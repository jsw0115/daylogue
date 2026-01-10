// FILE: src/screens/plan/plannerUiUtils.js
import moment from "moment";

/** 안전 숫자 파싱 */
export function toSafeNumber(v, fallback = 999999) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** 이벤트 우선순위(낮을수록 우선) */
export function getEventPriority(ev) {
  return toSafeNumber(ev?.sortOrder ?? ev?.priorityOrder ?? ev?.priority ?? undefined, 999999);
}

/** 이벤트 시작 정렬 키 */
export function getEventStartSortKey(ev, dateKey) {
  // ev.start가 "09:00" 형태라고 가정(현재 UI가 그렇게 사용중). ISO면 moment가 알아서 처리.
  const raw = ev?.start;
  if (!raw) return 999999999;

  // HH:mm일 가능성
  const hhmm = moment(raw, ["HH:mm", "H:mm"], true);
  if (hhmm.isValid()) {
    const m = moment(`${dateKey} ${raw}`, "YYYY-MM-DD HH:mm", true);
    return m.isValid() ? m.valueOf() : 999999999;
  }

  // ISO or Date string
  const iso = moment(raw);
  return iso.isValid() ? iso.valueOf() : 999999999;
}

/** 텍스트 검색 */
export function textIncludes(hay, needle) {
  if (!needle) return true;
  const h = String(hay ?? "").toLowerCase();
  const n = String(needle ?? "").trim().toLowerCase();
  if (!n) return true;
  return h.includes(n);
}

/** D-Day 계산 (옵션) */
export function getDdayLeft(ev, dateKey) {
  // 가정: ddayDate(YYYY-MM-DD) 또는 startDate 기반
  const ddayDate = ev?.ddayDate ?? ev?.ddayTargetDate ?? ev?.startDate ?? null;
  if (!ddayDate) return null;

  const base = moment(dateKey, "YYYY-MM-DD", true);
  const target = moment(ddayDate, ["YYYY-MM-DD", moment.ISO_8601], true);
  if (!base.isValid() || !target.isValid()) return null;

  return target.startOf("day").diff(base.startOf("day"), "days"); // 0이면 D-Day
}

/** 필터/검색/정렬 적용 */
export function applyEventQuery(events, query, dateKey) {
  const list = Array.isArray(events) ? [...events] : [];
  const q = query ?? {};

  const keyword = String(q.keyword ?? "").trim();
  const onlyDday = Boolean(q.onlyDday);
  const onlyBookmarked = Boolean(q.onlyBookmarked);
  const onlyShared = Boolean(q.onlyShared);
  const categoryId = q.categoryId ?? "all";
  const visibility = q.visibility ?? "all"; // public/attendees/busy/private 같은 값 가정
  const sortKey = q.sortKey ?? "priority"; // priority | start | importance

  const filtered = list.filter((ev) => {
    // 검색(제목/메모/태그/참석자 등)
    const tagsText = Array.isArray(ev?.tags) ? ev.tags.join(" ") : "";
    const attendeesText = Array.isArray(ev?.attendees) ? ev.attendees.join(" ") : "";
    const memoText = String(ev?.memo ?? "");
    const titleText = String(ev?.title ?? "");

    if (
      keyword &&
      !(
        textIncludes(titleText, keyword) ||
        textIncludes(memoText, keyword) ||
        textIncludes(tagsText, keyword) ||
        textIncludes(attendeesText, keyword)
      )
    ) {
      return false;
    }

    // 카테고리
    if (categoryId !== "all" && String(ev?.categoryId ?? "") !== String(categoryId)) return false;

    // 공개범위
    if (visibility !== "all" && String(ev?.visibility ?? "") !== String(visibility)) return false;

    // D-Day only
    if (onlyDday) {
      const enabled = Boolean(ev?.ddayEnabled ?? ev?.isDday ?? false);
      if (!enabled) return false;
    }

    // 북마크 only
    if (onlyBookmarked) {
      if (!Boolean(ev?.bookmarked ?? ev?.isBookmarked ?? false)) return false;
    }

    // 공유 only
    if (onlyShared) {
      const sharedCnt = Array.isArray(ev?.sharedUserIds) ? ev.sharedUserIds.length : 0;
      if (sharedCnt <= 0) return false;
    }

    return true;
  });

  // 정렬
  filtered.sort((a, b) => {
    if (sortKey === "start") {
      const ap = getEventStartSortKey(a, dateKey);
      const bp = getEventStartSortKey(b, dateKey);
      if (ap !== bp) return ap - bp;
      // tie-break
      return getEventPriority(a) - getEventPriority(b);
    }

    if (sortKey === "importance") {
      // 가정: importance(1~5, 높을수록 중요)
      const ai = toSafeNumber(a?.importance, 0);
      const bi = toSafeNumber(b?.importance, 0);
      if (ai !== bi) return bi - ai; // 높은 중요도 먼저
      return getEventPriority(a) - getEventPriority(b);
    }

    // default: priority
    const ap = getEventPriority(a);
    const bp = getEventPriority(b);
    if (ap !== bp) return ap - bp;

    // 그 다음 시작시간, 그 다음 제목
    const as = getEventStartSortKey(a, dateKey);
    const bs = getEventStartSortKey(b, dateKey);
    if (as !== bs) return as - bs;

    return String(a?.title ?? "").localeCompare(String(b?.title ?? ""));
  });

  return filtered;
}

/** 카테고리 옵션(이벤트에서 추출) */
export function buildCategoryOptions(events) {
  const map = new Map();
  (Array.isArray(events) ? events : []).forEach((ev) => {
    const id = ev?.categoryId;
    const name = ev?.categoryName;
    if (id == null) return;
    map.set(String(id), String(name ?? id));
  });

  const items = Array.from(map.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return [{ id: "all", name: "전체" }, ...items];
}
