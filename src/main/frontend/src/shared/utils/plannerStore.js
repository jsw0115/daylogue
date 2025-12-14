// FILE: src/shared/utils/plannerStore.js
import moment from "moment";
import { safeStorage } from "./safeStorage";

const KEY_SERIES = "planner.series.v1";
const KEY_ONEOFF_PREFIX = "planner.events."; // planner.events.YYYY-MM-DD

function uid(prefix = "ev") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

export function toDateKey(d) {
  return moment(d).format("YYYY-MM-DD");
}

function loadSeriesList() {
  const list = safeStorage.getJSON(KEY_SERIES, []);
  return Array.isArray(list) ? list : [];
}
function saveSeriesList(list) {
  safeStorage.setJSON(KEY_SERIES, list);
}

function loadOneOffList(dateKey) {
  const list = safeStorage.getJSON(`${KEY_ONEOFF_PREFIX}${dateKey}`, []);
  return Array.isArray(list) ? list : [];
}
function saveOneOffList(dateKey, list) {
  safeStorage.setJSON(`${KEY_ONEOFF_PREFIX}${dateKey}`, list);
}

function weekdayKey(date) {
  const d = moment(date).day(); // 0~6 (Sun~Sat)
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d];
}

function withinEnd(dateKey, end) {
  if (!end || end.type === "none") return true;
  if (end.type === "until") return moment(dateKey).isSameOrBefore(moment(end.until, "YYYY-MM-DD"));
  return true;
}

function matchesRepeat(series, dateKey) {
  const rr = series.repeatRule;
  if (!rr?.enabled) return false;

  const date = moment(dateKey, "YYYY-MM-DD");
  const start = moment(series.startDate, "YYYY-MM-DD");
  if (date.isBefore(start)) return false;
  if (!withinEnd(dateKey, rr.end)) return false;

  const interval = Math.max(1, Number(rr.interval || 1));

  if (rr.freq === "daily") {
    const diff = date.diff(start, "days");
    return diff % interval === 0;
  }

  if (rr.freq === "weekly") {
    const diffWeeks = date.clone().startOf("week").diff(start.clone().startOf("week"), "weeks");
    if (diffWeeks % interval !== 0) return false;
    const wk = weekdayKey(date);
    const by = Array.isArray(rr.byWeekdays) && rr.byWeekdays.length ? rr.byWeekdays : [weekdayKey(start)];
    return by.includes(wk);
  }

  if (rr.freq === "monthly") {
    const diffMonths = date.diff(start, "months");
    if (diffMonths % interval !== 0) return false;
    return date.date() === start.date();
  }

  if (rr.freq === "yearly") {
    const diffYears = date.diff(start, "years");
    if (diffYears % interval !== 0) return false;
    return date.month() === start.month() && date.date() === start.date();
  }

  return false;
}

function buildOccurrence(series, dateKey) {
  const id = `${series.seriesId}#${dateKey}`;
  return {
    id,
    title: series.title,
    start: series.startTime,
    end: series.endTime,
    categoryId: series.categoryId || "",
    sharedUserIds: Array.isArray(series.sharedUserIds) ? series.sharedUserIds : [],
    repeatRule: series.repeatRule,
    seriesId: series.seriesId,
    occurrenceKey: dateKey,
    isOccurrence: true,
  };
}

/**
 * 날짜 기준 “표시용 이벤트” 반환
 * - one-off(단건)
 * - series occurrence(반복) + exception(단건 수정/삭제)
 */
export function getEventsForDate(dateKey) {
  const oneOff = loadOneOffList(dateKey);
  const seriesList = loadSeriesList();

  // 예외(단건 수정/삭제) 맵: seriesId+occurrenceKey
  const exceptionMap = new Map();
  for (const e of oneOff) {
    if (e?.isException && e.seriesId && e.occurrenceKey) {
      exceptionMap.set(`${e.seriesId}#${e.occurrenceKey}`, e);
    }
  }

  const out = [];

  // 1) 단건 이벤트(예외 제외)
  for (const e of oneOff) {
    if (!e) continue;
    if (e.isException) continue;
    out.push(e);
  }

  // 2) 반복 시리즈 발생분
  for (const s of seriesList) {
    if (!s?.seriesId) continue;
    if (!matchesRepeat(s, dateKey)) continue;

    const occ = buildOccurrence(s, dateKey);
    const ex = exceptionMap.get(`${s.seriesId}#${dateKey}`);
    if (ex?.isDeleted) continue;

    if (ex) {
      out.push({
        ...occ,
        ...ex,
        id: occ.id, // occurrence id 유지
        isOccurrence: true,
        seriesId: s.seriesId,
        occurrenceKey: dateKey,
      });
    } else {
      out.push(occ);
    }
  }

  // 정렬: 시작시간 기준
  out.sort((a, b) => String(a.start || "").localeCompare(String(b.start || "")));
  return out;
}

export function upsertOneOffEvent(dateKey, event) {
  const list = loadOneOffList(dateKey);
  const next = { ...event };
  if (!next.id) next.id = uid("ev");

  const idx = list.findIndex((x) => x?.id === next.id);
  if (idx >= 0) list[idx] = next;
  else list.push(next);

  saveOneOffList(dateKey, list);
  return next;
}

export function deleteEvent(dateKey, event) {
  // 반복 발생분(occurrence) 삭제는 “예외 삭제”로 기록
  if (event?.isOccurrence && event.seriesId && event.occurrenceKey) {
    const ex = {
      id: uid("exdel"),
      seriesId: event.seriesId,
      occurrenceKey: event.occurrenceKey,
      isException: true,
      isDeleted: true,
      updatedAt: Date.now(),
    };
    upsertOneOffEvent(dateKey, ex);
    return;
  }

  // 단건 삭제
  const list = loadOneOffList(dateKey);
  const filtered = list.filter((x) => x?.id !== event?.id);
  saveOneOffList(dateKey, filtered);
}

export function createSeries(payload) {
  const list = loadSeriesList();
  const seriesId = payload.seriesId || uid("ser");
  const next = { ...payload, seriesId };
  list.push(next);
  saveSeriesList(list);
  return seriesId;
}

export function updateSeries(seriesId, patch) {
  const list = loadSeriesList();
  const idx = list.findIndex((s) => s.seriesId === seriesId);
  if (idx < 0) return false;
  list[idx] = { ...list[idx], ...patch };
  saveSeriesList(list);
  return true;
}

export function deleteSeries(seriesId) {
  const list = loadSeriesList();
  saveSeriesList(list.filter((s) => s.seriesId !== seriesId));
}

function dayBefore(dateKey) {
  return moment(dateKey, "YYYY-MM-DD").subtract(1, "day").format("YYYY-MM-DD");
}

/**
 * “앞으로 모두” 삭제: fromDateKey(포함) 이후 발생 중단
 */
export function endSeriesFromDate(seriesId, fromDateKey) {
  const list = loadSeriesList();
  const idx = list.findIndex((s) => s.seriesId === seriesId);
  if (idx < 0) return false;

  const s = list[idx];
  if (moment(fromDateKey).isSameOrBefore(moment(s.startDate))) {
    // 시작 이전/같으면 시리즈 자체 삭제
    list.splice(idx, 1);
    saveSeriesList(list);
    return true;
  }

  const until = dayBefore(fromDateKey);
  const rr = { ...(s.repeatRule || {}), enabled: true };
  const prevEnd = rr.end || { type: "none" };

  // 더 이른 until이면 갱신
  if (prevEnd.type === "until") {
    if (moment(prevEnd.until).isAfter(moment(until))) rr.end = { type: "until", until };
  } else {
    rr.end = { type: "until", until };
  }

  list[idx] = { ...s, repeatRule: rr };
  saveSeriesList(list);
  return true;
}

/**
 * “앞으로 모두” 수정: 기준일(fromDateKey)에서 시리즈를 split
 * - A: 기존 시리즈를 fromDateKey 전날까지로 종료
 * - B: fromDateKey부터 patch 적용된 새 시리즈 생성
 */
export function updateSeriesFuture(seriesId, fromDateKey, patch) {
  const list = loadSeriesList();
  const idx = list.findIndex((s) => s.seriesId === seriesId);
  if (idx < 0) return null;

  const s = list[idx];
  const from = moment(fromDateKey, "YYYY-MM-DD");
  const start = moment(s.startDate, "YYYY-MM-DD");

  // 시작일 이전/같으면 그냥 in-place 업데이트
  if (from.isSameOrBefore(start)) {
    list[idx] = { ...s, ...patch };
    saveSeriesList(list);
    return s.seriesId;
  }

  // A 종료
  const until = dayBefore(fromDateKey);
  const rrA = { ...(s.repeatRule || {}), enabled: true };
  const prevEnd = rrA.end || { type: "none" };
  if (prevEnd.type === "until") {
    if (moment(prevEnd.until).isAfter(moment(until))) rrA.end = { type: "until", until };
  } else {
    rrA.end = { type: "until", until };
  }
  const seriesA = { ...s, repeatRule: rrA };

  // B 생성
  const newId = uid("ser");
  const seriesB = {
    ...s,
    ...patch,
    seriesId: newId,
    startDate: fromDateKey,
  };

  // 주간 반복인데 fromDateKey 요일이 빠져있으면, 클릭한 회차가 사라지는 UX가 생김 → 자동 포함
  if (seriesB.repeatRule?.enabled && seriesB.repeatRule.freq === "weekly") {
    const wk = weekdayKey(from.toDate());
    const by = Array.isArray(seriesB.repeatRule.byWeekdays) ? seriesB.repeatRule.byWeekdays : [];
    if (by.length && !by.includes(wk)) {
      seriesB.repeatRule = { ...seriesB.repeatRule, byWeekdays: [...by, wk] };
    }
  }

  const nextList = list.slice();
  nextList[idx] = seriesA;
  nextList.push(seriesB);
  saveSeriesList(nextList);

  return newId;
}
