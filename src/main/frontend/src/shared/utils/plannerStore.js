// FILE: src/main/frontend/src/shared/utils/plannerStore.js
// - 기존 export 유지: deleteEventForDate, getEventsForDate, toDateKey, upsertEventForDate
// - ScheduleFormModal에서 요구하는 export 추가:
//   createSeries, updateSeriesFuture, endSeriesFromDate, upsertOneOffEvent, deleteEvent
//
// - 저장소는 safeStorage만 사용(차단 시에도 런타임 크래시 방지)

import moment from "moment";
import { safeStorage } from "./safeStorage";

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function toDateKey(d) {
  const dt = d instanceof Date ? d : new Date(d);
  const y = dt.getFullYear();
  const m = pad2(dt.getMonth() + 1);
  const day = pad2(dt.getDate());
  return `${y}-${m}-${day}`;
}

function clampDateKey(v) {
  if (typeof v !== "string") return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "";
}

function normalizeHHmm(v, fallback = "00:00") {
  const s = String(v || "").trim();
  const m = moment(s, ["HH:mm", "H:mm"], true);
  return m.isValid() ? m.format("HH:mm") : fallback;
}

function makeId(prefix = "id") {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
  } catch {
    // ignore
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/** ===== Storage Keys ===== */
const KEY_EVENTS_MAP = "timeflow.planner.events.byDate.v2"; // { [bucketDateKey]: Event[] }
const KEY_SERIES_MAP = "timeflow.planner.series.v1"; // { [seriesId]: Series }
const LEGACY_PREFIX = "planner.events."; // 기존: planner.events.YYYY-MM-DD

function legacyKeyOf(dateKey) {
  return `${LEGACY_PREFIX}${dateKey}`;
}

function loadEventsMap() {
  const map = safeStorage.getJSON(KEY_EVENTS_MAP, {});
  return map && typeof map === "object" ? map : {};
}

function saveEventsMap(map) {
  safeStorage.setJSON(KEY_EVENTS_MAP, map || {});
}

function loadSeriesMap() {
  const map = safeStorage.getJSON(KEY_SERIES_MAP, {});
  return map && typeof map === "object" ? map : {};
}

function saveSeriesMap(map) {
  safeStorage.setJSON(KEY_SERIES_MAP, map || {});
}

/**
 * 레거시(날짜별 키 저장) → 신규(map 저장)로 "요청된 날짜"만 부분 마이그레이션.
 * (localStorage가 막혀있으면 키 목록을 못 봐서 전체 마이그레이션은 불가)
 */
function ensureLegacyMigratedFor(dateKey) {
  const dk = clampDateKey(dateKey);
  if (!dk) return;

  const legacy = safeStorage.getJSON(legacyKeyOf(dk), null);
  if (!Array.isArray(legacy) || legacy.length === 0) return;

  const map = loadEventsMap();
  const cur = Array.isArray(map[dk]) ? map[dk] : [];

  const byId = new Map(cur.map((e) => [String(e?.id), e]));
  for (const raw of legacy) {
    if (!raw) continue;
    const ev = { ...raw };
    if (!ev.id) ev.id = makeId("evt");
    if (!ev.startDateKey) ev.startDateKey = dk;
    if (!ev.endDateKey) ev.endDateKey = ev.startDateKey;
    if (!ev.start) ev.start = "09:00";
    if (!ev.end) ev.end = "09:30";
    ev.start = normalizeHHmm(ev.start, "09:00");
    ev.end = normalizeHHmm(ev.end, "09:30");
    if (!ev.colorHex && ev.color) ev.colorHex = ev.color;
    byId.set(String(ev.id), { ...(byId.get(String(ev.id)) || {}), ...ev });
  }

  map[dk] = Array.from(byId.values());
  saveEventsMap(map);

  // 중복 표시 방지를 위해 레거시 키 제거
  safeStorage.removeItem(legacyKeyOf(dk));
}

function isBetweenInclusive(dateKey, startKey, endKey) {
  const d = clampDateKey(dateKey);
  const s = clampDateKey(startKey);
  const e = clampDateKey(endKey);
  if (!d || !s || !e) return false;
  return s <= d && d <= e;
}

function weekdayKeyOf(dateKey) {
  const d = moment(dateKey, "YYYY-MM-DD").day(); // 0..6 (sun..sat)
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d];
}

function prevDateKey(dateKey) {
  return moment(dateKey, "YYYY-MM-DD").subtract(1, "day").format("YYYY-MM-DD");
}

function buildOccurrenceKey(dateKey, startTime) {
  // 정책: YYYY-MM-DDTHH:mm
  return `${dateKey}T${normalizeHHmm(startTime, "00:00")}`;
}

function normalizeRepeatRule(rr) {
  if (!rr?.enabled) return { enabled: false };
  return {
    enabled: true,
    freq: rr.freq || "weekly", // daily|weekly|monthly|yearly
    interval: Math.max(1, Number(rr.interval || 1)),
    byWeekdays: Array.isArray(rr.byWeekdays) ? rr.byWeekdays : [],
    end: rr.end?.type === "until" ? { type: "until", until: rr.end.until } : { type: "none" },
  };
}

function seriesOccursOnDate(series, dateKey) {
  const d = clampDateKey(dateKey);
  const startDate = clampDateKey(series?.startDate);
  if (!d || !startDate) return false;

  const rr = normalizeRepeatRule(series?.repeatRule);
  if (!rr.enabled) return false;

  if (d < startDate) return false;

  if (rr.end?.type === "until") {
    const until = clampDateKey(rr.end.until);
    if (until && d > until) return false;
  }

  const interval = Math.max(1, Number(rr.interval || 1));
  const s = moment(startDate, "YYYY-MM-DD");
  const t = moment(d, "YYYY-MM-DD");

  if (rr.freq === "daily") {
    const diff = t.diff(s, "days");
    return diff % interval === 0;
  }

  if (rr.freq === "weekly") {
    const diffWeeks = t.clone().startOf("week").diff(s.clone().startOf("week"), "weeks");
    if (diffWeeks % interval !== 0) return false;
    const by = rr.byWeekdays?.length ? rr.byWeekdays : [weekdayKeyOf(startDate)];
    return by.includes(weekdayKeyOf(d));
  }

  if (rr.freq === "monthly") {
    const diffMonths = t.diff(s, "months");
    if (diffMonths % interval !== 0) return false;
    return t.date() === s.date();
  }

  if (rr.freq === "yearly") {
    const diffYears = t.diff(s, "years");
    if (diffYears % interval !== 0) return false;
    return t.month() === s.month() && t.date() === s.date();
  }

  return false;
}

/** =========================
 *  기존 export 유지
 *  ========================= */

export function getEventsForDate(dateKey) {
  const dk = clampDateKey(dateKey);
  if (!dk) return [];

  // 레거시(날짜키 저장) 데이터가 있으면 요청 날짜만 마이그레이션
  ensureLegacyMigratedFor(dk);

  const eventsMap = loadEventsMap();
  const seriesMap = loadSeriesMap();

  // 1) one-off / exception 포함: map 전체에서 "해당 날짜에 걸치는" 이벤트 수집
  const oneOffAll = [];
  for (const bucketKey of Object.keys(eventsMap)) {
    const arr = eventsMap[bucketKey];
    if (!Array.isArray(arr)) continue;

    for (const e of arr) {
      if (!e) continue;
      const s = clampDateKey(e.startDateKey || bucketKey) || bucketKey;
      const ed = clampDateKey(e.endDateKey || s) || s;
      if (isBetweenInclusive(dk, s, ed)) oneOffAll.push(e);
    }
  }

  // 2) exception 맵(이 날짜의 시리즈 occurrence에 대한 수정/삭제)
  const exMap = new Map(); // key: seriesId::occurrenceKey
  for (const e of oneOffAll) {
    if (!e) continue;
    if (e.seriesId && e.occurrenceKey && (e.isException || e.isDeleted)) {
      exMap.set(`${e.seriesId}::${e.occurrenceKey}`, e);
    }
  }

  // 3) series occurrence 생성
  const occurrences = [];
  for (const sid of Object.keys(seriesMap)) {
    const s = seriesMap[sid];
    if (!s || s.isDeleted) continue;
    if (!seriesOccursOnDate(s, dk)) continue;

    const occKey = buildOccurrenceKey(dk, s.startTime);
    const ex = exMap.get(`${sid}::${occKey}`);

    // 삭제 예외면 표시 X
    if (ex && ex.isDeleted) continue;

    // 수정 예외면 그걸로 표시
    if (ex) {
      occurrences.push({
        ...ex,
        isOccurrence: true,
        isException: true,
        seriesId: sid,
        occurrenceKey: occKey,
      });
      continue;
    }

    occurrences.push({
      id: `${sid}::${occKey}`,
      title: s.title || "",
      start: normalizeHHmm(s.startTime, "00:00"),
      end: normalizeHHmm(s.endTime, "23:59"),
      startDateKey: dk,
      endDateKey: dk,
      categoryId: s.categoryId || "",
      sharedUserIds: Array.isArray(s.sharedUserIds) ? s.sharedUserIds : [],
      colorHex: s.colorHex || s.color || "",
      importance: Number.isFinite(Number(s.importance)) ? Number(s.importance) : 0,
      bookmarked: Boolean(s.bookmarked),
      visibility: String(s.visibility || "public"),
      ddayEnabled: Boolean(s.ddayEnabled),
      ddayDate: s.ddayDate || "",
      location: String(s.location || ""),
      memo: String(s.memo || ""),
      tags: Array.isArray(s.tags) ? s.tags : [],
      attendees: Array.isArray(s.attendees) ? s.attendees : [],
      timeZone: String(s.timeZone || "Asia/Seoul"),
      repeatRule: normalizeRepeatRule(s.repeatRule),
      seriesId: sid,
      occurrenceKey: occKey,
      isOccurrence: true,
      createdAt: s.createdAt || Date.now(),
      updatedAt: s.updatedAt || Date.now(),
    });
  }

  // 4) one-off 목록에서 exception 전용 row 제거(중복 방지)
  const oneOffVisible = oneOffAll.filter(
    (e) => !(e && (e.isException || e.isDeleted) && e.seriesId && e.occurrenceKey)
  );

  const merged = [...oneOffVisible, ...occurrences];

  // 5) 정렬(시작시간 → 제목)
  merged.sort((a, b) => {
    const as = normalizeHHmm(a?.start, "00:00");
    const bs = normalizeHHmm(b?.start, "00:00");
    if (as < bs) return -1;
    if (as > bs) return 1;
    return String(a?.title || "").localeCompare(String(b?.title || ""));
  });

  return merged;
}

export function upsertEventForDate(dateKey, event) {
  const dk = clampDateKey(dateKey);
  if (!dk) return null;

  ensureLegacyMigratedFor(dk);

  const map = loadEventsMap();
  const list = Array.isArray(map[dk]) ? map[dk] : [];

  const ev = { ...(event || {}) };
  if (!ev.id) ev.id = makeId("evt");

  if (!ev.startDateKey) ev.startDateKey = dk;
  if (!ev.endDateKey) ev.endDateKey = ev.startDateKey;

  if (!ev.start) ev.start = "09:00";
  if (!ev.end) ev.end = "09:30";
  ev.start = normalizeHHmm(ev.start, "09:00");
  ev.end = normalizeHHmm(ev.end, "09:30");

  if (!ev.colorHex && ev.color) ev.colorHex = ev.color;

  const idx = list.findIndex((x) => String(x?.id) === String(ev.id));
  const next = idx >= 0 ? list.map((x, i) => (i === idx ? { ...x, ...ev } : x)) : [...list, ev];

  map[dk] = next;
  saveEventsMap(map);
  return ev;
}

export function deleteEventForDate(dateKey, eventId) {
  const dk = clampDateKey(dateKey);
  if (!dk) return;

  ensureLegacyMigratedFor(dk);

  const map = loadEventsMap();
  const list = Array.isArray(map[dk]) ? map[dk] : [];
  map[dk] = list.filter((x) => String(x?.id) !== String(eventId));
  saveEventsMap(map);
}

/** =========================
 *  ScheduleFormModal용 추가 export
 *  ========================= */

export function upsertOneOffEvent(dateKey, event) {
  return upsertEventForDate(dateKey, event);
}

export function deleteEvent(dateKey, event) {
  const dk = clampDateKey(dateKey);
  if (!dk || !event) return;

  // 반복 발생분(occurrence)은 “실제 삭제”가 아니라 "삭제 예외"로 저장
  if (event.isOccurrence && event.seriesId && event.occurrenceKey) {
    upsertEventForDate(dk, {
      id: makeId("exdel"),
      title: event.title || "",
      start: normalizeHHmm(event.start, "00:00"),
      end: normalizeHHmm(event.end, "23:59"),
      startDateKey: dk,
      endDateKey: dk,
      categoryId: event.categoryId || "",
      sharedUserIds: Array.isArray(event.sharedUserIds) ? event.sharedUserIds : [],
      colorHex: event.colorHex || "",
      importance: Number.isFinite(Number(event.importance)) ? Number(event.importance) : 0,
      bookmarked: Boolean(event.bookmarked),
      visibility: String(event.visibility || "public"),
      ddayEnabled: Boolean(event.ddayEnabled),
      ddayDate: event.ddayDate || "",
      location: String(event.location || ""),
      memo: String(event.memo || ""),
      tags: Array.isArray(event.tags) ? event.tags : [],
      attendees: Array.isArray(event.attendees) ? event.attendees : [],
      timeZone: String(event.timeZone || "Asia/Seoul"),
      seriesId: event.seriesId,
      occurrenceKey: event.occurrenceKey,
      isException: true,
      isDeleted: true,
      updatedAt: Date.now(),
    });
    return;
  }

  // 일반 one-off는 버킷에서 제거
  deleteEventForDate(dk, event.id);
}

export function createSeries(payload) {
  const startDate = clampDateKey(payload?.startDate) || toDateKey(new Date());
  const rr = normalizeRepeatRule(payload?.repeatRule);

  const seriesMap = loadSeriesMap();
  const id = makeId("ser");

  seriesMap[id] = {
    id,
    title: String(payload?.title || ""),
    startTime: normalizeHHmm(payload?.startTime, "00:00"),
    endTime: normalizeHHmm(payload?.endTime, "23:59"),
    categoryId: String(payload?.categoryId || ""),
    sharedUserIds: Array.isArray(payload?.sharedUserIds) ? payload.sharedUserIds : [],
    startDate,
    repeatRule: rr,

    // 부가필드(있으면 보존)
    colorHex: payload?.colorHex || payload?.color || "",
    importance: Number.isFinite(Number(payload?.importance)) ? Number(payload.importance) : 0,
    bookmarked: Boolean(payload?.bookmarked),
    visibility: String(payload?.visibility || "public"),
    ddayEnabled: Boolean(payload?.ddayEnabled),
    ddayDate: payload?.ddayDate || "",
    location: String(payload?.location || ""),
    memo: String(payload?.memo || ""),
    tags: Array.isArray(payload?.tags) ? payload.tags : [],
    attendees: Array.isArray(payload?.attendees) ? payload.attendees : [],
    timeZone: String(payload?.timeZone || "Asia/Seoul"),

    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false,
  };

  saveSeriesMap(seriesMap);
  return seriesMap[id];
}

export function endSeriesFromDate(seriesId, fromDateKey) {
  const sid = String(seriesId || "");
  const from = clampDateKey(fromDateKey);
  if (!sid || !from) return null;

  const seriesMap = loadSeriesMap();
  const s = seriesMap[sid];
  if (!s) return null;

  const startDate = clampDateKey(s.startDate);
  if (!startDate) return null;

  // 시작일 이전(또는 같음)부터 종료면 사실상 삭제
  if (from <= startDate) {
    seriesMap[sid] = { ...s, isDeleted: true, updatedAt: Date.now() };
    saveSeriesMap(seriesMap);
    return seriesMap[sid];
  }

  const until = prevDateKey(from);
  const rr = normalizeRepeatRule(s.repeatRule);

  seriesMap[sid] = {
    ...s,
    repeatRule: { ...rr, enabled: true, end: { type: "until", until } },
    updatedAt: Date.now(),
  };

  saveSeriesMap(seriesMap);
  return seriesMap[sid];
}

export function updateSeriesFuture(seriesId, fromDateKey, patch) {
  const sid = String(seriesId || "");
  const from = clampDateKey(fromDateKey);
  if (!sid || !from) return null;

  const seriesMap = loadSeriesMap();
  const s = seriesMap[sid];
  if (!s) return null;

  const startDate = clampDateKey(s.startDate);
  if (!startDate) return null;

  const p = { ...(patch || {}) };

  // from == startDate면 기존 시리즈를 그대로 업데이트
  if (from === startDate) {
    const nextRR = p.repeatRule ? normalizeRepeatRule(p.repeatRule) : normalizeRepeatRule(s.repeatRule);

    seriesMap[sid] = {
      ...s,
      title: p.title ?? s.title,
      startTime: p.startTime ? normalizeHHmm(p.startTime, s.startTime) : s.startTime,
      endTime: p.endTime ? normalizeHHmm(p.endTime, s.endTime) : s.endTime,
      categoryId: p.categoryId ?? s.categoryId,
      sharedUserIds: Array.isArray(p.sharedUserIds) ? p.sharedUserIds : s.sharedUserIds,
      repeatRule: nextRR,
      updatedAt: Date.now(),
    };

    saveSeriesMap(seriesMap);
    return seriesMap[sid];
  }

  // split: A(기존) 종료 + B(새 시리즈) 생성
  endSeriesFromDate(sid, from);

  const newId = makeId("ser");
  const nextRR = p.repeatRule ? normalizeRepeatRule(p.repeatRule) : normalizeRepeatRule(s.repeatRule);

  seriesMap[newId] = {
    ...s,
    id: newId,
    startDate: from,
    title: p.title ?? s.title,
    startTime: p.startTime ? normalizeHHmm(p.startTime, s.startTime) : s.startTime,
    endTime: p.endTime ? normalizeHHmm(p.endTime, s.endTime) : s.endTime,
    categoryId: p.categoryId ?? s.categoryId,
    sharedUserIds: Array.isArray(p.sharedUserIds) ? p.sharedUserIds : s.sharedUserIds,
    repeatRule: nextRR,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false,
  };

  saveSeriesMap(seriesMap);
  return seriesMap[newId];
}
