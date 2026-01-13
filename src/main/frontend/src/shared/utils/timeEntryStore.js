// FILE: src/main/frontend/src/shared/utils/timeEntryStore.js
import moment from "moment";
import { safeStorage } from "./safeStorage";

const KEY_PREFIX = "timebar.entries."; // timebar.entries.YYYY-MM-DD

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function makeTimeEntryId(prefix = "te") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function isValidDateKey(dateKey) {
  return Boolean(moment(dateKey, "YYYY-MM-DD", true).isValid());
}

export function isValidHHMM(t) {
  return Boolean(moment(t, ["HH:mm", "H:mm"], true).isValid());
}

export function parseHHMMToMinutes(t) {
  const m = moment(t, ["HH:mm", "H:mm"], true);
  if (!m.isValid()) return null;
  return m.hours() * 60 + m.minutes();
}

export function minutesToHHMM(min) {
  const v = Math.max(0, Math.min(24 * 60, Number(min) || 0));
  const hh = Math.floor(v / 60);
  const mm = v % 60;
  return `${pad2(hh)}:${pad2(mm)}`;
}

export function snapMinutes(min, step = 15) {
  const s = Math.max(1, Number(step) || 15);
  return Math.round((Number(min) || 0) / s) * s;
}

export function toUtcIso(dateKey, hhmm, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  if (!isValidDateKey(dateKey) || !isValidHHMM(hhmm)) return null;
  const [yy, mm, dd] = dateKey.split("-").map((x) => parseInt(x, 10));
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));

  // 브라우저 local timezone 기준 Date 생성 → toISOString()은 UTC로 변환된 ISO
  const d = new Date(yy, mm - 1, dd, h, m, 0, 0);
  return d.toISOString();
}

export function utcIsoToHHMM(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function normalizeTimeEntry(dateKey, raw) {
  const nowTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const id = String(raw?.id || "").trim() || makeTimeEntryId();
  const type = raw?.type === "plan" ? "plan" : "actual";
  const timeZone = String(raw?.timeZone || nowTz);

  let start = String(raw?.start ?? "");
  let end = String(raw?.end ?? "");

  // start/end가 없고 UTC만 있으면 복원
  if ((!start || !end) && (raw?.startAtUtc || raw?.endAtUtc)) {
    start = start || utcIsoToHHMM(raw?.startAtUtc);
    end = end || utcIsoToHHMM(raw?.endAtUtc);
  }

  // 최종 안전화(없으면 최소값)
  if (!isValidHHMM(start)) start = "09:00";
  if (!isValidHHMM(end)) end = "09:30";

  const startMin = parseHHMMToMinutes(start) ?? 0;
  const endMin = parseHHMMToMinutes(end) ?? startMin + 30;
  const fixedEndMin = Math.max(endMin, startMin + 1);

  const fixedStart = minutesToHHMM(startMin);
  const fixedEnd = minutesToHHMM(fixedEndMin);

  const startAtUtc = raw?.startAtUtc || toUtcIso(dateKey, fixedStart, timeZone);
  const endAtUtc = raw?.endAtUtc || toUtcIso(dateKey, fixedEnd, timeZone);

  return {
    id,
    type,
    timeZone,
    start: fixedStart,
    end: fixedEnd,
    startAtUtc,
    endAtUtc,
    title: String(raw?.title ?? "").trim(),
    categoryId: raw?.categoryId != null ? String(raw.categoryId) : "",
    description: String(raw?.description ?? "").trim(),
    source: String(raw?.source ?? "manual"),
    link: {
      eventId: raw?.link?.eventId ? String(raw.link.eventId) : raw?.eventId ? String(raw.eventId) : "",
      taskId: raw?.link?.taskId ? String(raw.link.taskId) : raw?.taskId ? String(raw.taskId) : "",
    },
  };
}

export function getTimeEntriesForDate(dateKey) {
  if (!isValidDateKey(dateKey)) return [];
  const key = `${KEY_PREFIX}${dateKey}`;
  const raw = safeStorage.getJSON(key, []);
  const list = Array.isArray(raw) ? raw : [];
  return list.map((x) => normalizeTimeEntry(dateKey, x));
}

export function setTimeEntriesForDate(dateKey, entries) {
  if (!isValidDateKey(dateKey)) return;
  const key = `${KEY_PREFIX}${dateKey}`;
  const list = (Array.isArray(entries) ? entries : []).map((x) => normalizeTimeEntry(dateKey, x));
  safeStorage.setJSON(key, list);
}

export function upsertTimeEntry(dateKey, entry) {
  const list = getTimeEntriesForDate(dateKey);
  const next = normalizeTimeEntry(dateKey, entry);

  const idx = list.findIndex((x) => x.id === next.id);
  if (idx >= 0) list[idx] = next;
  else list.push(next);

  setTimeEntriesForDate(dateKey, list);
  return next;
}

export function deleteTimeEntry(dateKey, id) {
  const list = getTimeEntriesForDate(dateKey).filter((x) => x.id !== id);
  setTimeEntriesForDate(dateKey, list);
}

/**
 * 이벤트(Event)를 "Plan 후보(TimeEntry)"로 변환 (기본은 저장하지 않고 화면에서만 보여주는 용도)
 * - id: pe:<eventId>:<dateKey> 로 만들어 충돌 방지
 */
export function buildPlanEntriesFromEvents(events, dateKey) {
  const list = Array.isArray(events) ? events : [];
  return list
    .map((ev) => {
      const start = String(ev?.start ?? "").trim();
      const end = String(ev?.end ?? "").trim();
      if (!isValidHHMM(start) || !isValidHHMM(end)) return null;

      const id = `pe:${String(ev.id)}:${dateKey}`;
      const timeZone = String(ev?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone);

      return normalizeTimeEntry(dateKey, {
        id,
        type: "plan",
        timeZone,
        start,
        end,
        title: String(ev?.title ?? ""),
        categoryId: ev?.categoryId != null ? String(ev.categoryId) : "",
        description: String(ev?.memo ?? ev?.description ?? ""),
        source: "fromEvent",
        link: { eventId: String(ev.id) },
      });
    })
    .filter(Boolean);
}

/**
 * 겹침 계산:
 * - overlapMap: 각 entry가 "어떤 것과라도" 겹치면 true
 * - overlapCoverageMin: 하루에서 "2개 이상 겹친 구간"의 총 분(중복 카운팅 없이)
 */
export function computeOverlaps(entries) {
  const list = (Array.isArray(entries) ? entries : [])
    .map((e) => ({
      ...e,
      _s: new Date(e.startAtUtc).getTime(),
      _e: new Date(e.endAtUtc).getTime(),
    }))
    .filter((e) => Number.isFinite(e._s) && Number.isFinite(e._e) && e._e > e._s)
    .sort((a, b) => a._s - b._s);

  // 1) overlapMap(간단 스캔)
  const overlapMap = {};
  const active = []; // {id,endMs}
  for (const it of list) {
    // 끝난 active 제거
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].endMs <= it._s) active.splice(i, 1);
    }
    if (active.length) {
      overlapMap[it.id] = true;
      active.forEach((a) => (overlapMap[a.id] = true));
    }
    active.push({ id: it.id, endMs: it._e });
  }

  // 2) overlapCoverageMin(스윕라인)
  const points = [];
  for (const it of list) {
    points.push({ t: it._s, v: +1 });
    points.push({ t: it._e, v: -1 });
  }
  points.sort((a, b) => (a.t !== b.t ? a.t - b.t : a.v - b.v));

  let cnt = 0;
  let lastT = null;
  let overlapMs = 0;

  for (const p of points) {
    if (lastT != null && p.t > lastT) {
      if (cnt >= 2) overlapMs += p.t - lastT;
    }
    cnt += p.v;
    lastT = p.t;
  }

  return {
    overlapMap,
    overlapCoverageMin: Math.round(overlapMs / 60000),
    overlappedEntryCount: Object.keys(overlapMap).length,
  };
}

/**
 * 겹침 그룹 안에서 lane(열) 배정
 * - type별로 따로 배정해서 Plan/Actual이 서로 폭을 잡아먹지 않게 함
 */
export function layoutByLanes(entries) {
  const list = (Array.isArray(entries) ? entries : [])
    .map((e) => ({
      ...e,
      _s: new Date(e.startAtUtc).getTime(),
      _e: new Date(e.endAtUtc).getTime(),
    }))
    .filter((e) => Number.isFinite(e._s) && Number.isFinite(e._e) && e._e > e._s)
    .sort((a, b) => a._s - b._s);

  // overlap group 나누기
  const groups = [];
  let cur = null;

  for (const it of list) {
    if (!cur) {
      cur = { start: it._s, end: it._e, items: [it] };
      continue;
    }
    if (it._s < cur.end) {
      cur.items.push(it);
      cur.end = Math.max(cur.end, it._e);
    } else {
      groups.push(cur);
      cur = { start: it._s, end: it._e, items: [it] };
    }
  }
  if (cur) groups.push(cur);

  // 각 그룹 lane 배정
  const out = [];
  for (const g of groups) {
    const laneEnds = []; // lane index -> endMs
    for (const it of g.items) {
      let lane = -1;
      for (let i = 0; i < laneEnds.length; i++) {
        if (laneEnds[i] <= it._s) {
          lane = i;
          break;
        }
      }
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(it._e);
      } else {
        laneEnds[lane] = it._e;
      }
      out.push({
        ...it,
        laneIndex: lane,
        laneCount: laneEnds.length,
      });
    }
  }

  // laneCount가 그룹 내 최대가 되도록 보정(뒤에서 커진 laneCount를 앞 항목에도 반영)
  // 간단히: 같은 그룹 구간(겹침이 있는 애들)은 laneCount를 최대값으로 맞춘다
  // (일별 데이터가 많지 않아서 O(n^2) 허용)
  for (let i = 0; i < out.length; i++) {
    const a = out[i];
    let max = a.laneCount;
    for (let j = 0; j < out.length; j++) {
      if (i === j) continue;
      const b = out[j];
      const overlap = a._s < b._e && b._s < a._e;
      if (overlap) max = Math.max(max, b.laneCount);
    }
    out[i] = { ...a, laneCount: max };
  }

  return out;
}

export function getTimebarSummary(dateKey) {
  const list = getTimeEntriesForDate(dateKey);
  const actual = list.filter((x) => x.type === "actual");
  const totalActualMin = actual.reduce((acc, e) => {
    const s = new Date(e.startAtUtc).getTime();
    const en = new Date(e.endAtUtc).getTime();
    if (!Number.isFinite(s) || !Number.isFinite(en) || en <= s) return acc;
    return acc + Math.round((en - s) / 60000);
  }, 0);

  const { overlapCoverageMin } = computeOverlaps(actual);

  return { totalActualMin, overlapCoverageMin, actualCount: actual.length };
}

/**
 * 어제 → 오늘 복사(기본: actual만)
 */
export function copyEntriesToDate(fromDateKey, toDateKey, { types = ["actual"] } = {}) {
  const src = getTimeEntriesForDate(fromDateKey).filter((x) => types.includes(x.type));
  const copied = src.map((x) => {
    const start = x.start;
    const end = x.end;
    const id = makeTimeEntryId("cp");
    return normalizeTimeEntry(toDateKey, {
      ...x,
      id,
      start,
      end,
      startAtUtc: toUtcIso(toDateKey, start, x.timeZone),
      endAtUtc: toUtcIso(toDateKey, end, x.timeZone),
      source: "manual",
    });
  });

  const dst = getTimeEntriesForDate(toDateKey);
  setTimeEntriesForDate(toDateKey, [...dst, ...copied]);
  return copied.length;
}
