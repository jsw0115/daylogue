import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";

import Modal from "../common/Modal";
import UserChipsInput from "../common/UserChipsInput";

import "../../styles/components/schedule-form-modal.css";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";
import { addUserToDirectory, loadUserDirectory } from "../../shared/utils/userDirectory";
import {
  createSeries,
  deleteEvent,
  endSeriesFromDate,
  getEventsForDate,
  toDateKey,
  updateSeriesFuture,
  upsertOneOffEvent,
} from "../../shared/utils/plannerStore";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function defaultAllDay() {
  return { start: "00:00", end: "23:59" };
}

function dayKeyOfDate(date) {
  const d = moment(date).day(); // 0..6
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d];
}

function clampDateKey(v) {
  if (typeof v !== "string") return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "";
}

function getLocalTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul";
  } catch {
    return "Asia/Seoul";
  }
}

function parseTimeToMin(t) {
  const m = String(t || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}

function minToTime(totalMin) {
  const m = Math.max(0, Math.min(24 * 60 - 1, totalMin)); // 0..1439
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${pad2(hh)}:${pad2(mm)}`;
}

/**
 * 10분 스냅
 * - start: floor
 * - end: ceil
 */
function snapTime10(t, kind /* "start" | "end" */) {
  const min = parseTimeToMin(t);
  if (min == null) return t;

  const step = 10;
  if (kind === "end") {
    const snapped = Math.ceil(min / step) * step;
    // 24:00 같은 값 방지 (끝은 23:59로 클램프)
    return snapped >= 24 * 60 ? "23:59" : minToTime(snapped);
  }
  // start
  const snapped = Math.floor(min / step) * step;
  return minToTime(snapped);
}

function uniqStrings(arr) {
  const out = [];
  const seen = new Set();
  (Array.isArray(arr) ? arr : []).forEach((v) => {
    const s = String(v || "").trim();
    if (!s) return;
    const k = s.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    out.push(s);
  });
  return out;
}

const COLOR_PRESETS = [
  "#6366F1", // indigo
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#06B6D4", // cyan
  "#A855F7", // purple
  "#EC4899", // pink
  "#64748B", // slate
];

export default function ScheduleFormModal({
  open,
  onClose,
  date,
  mode = "quick", // quick | detail (초기 탭)
  initialEvent = null,
  onSaved,
}) {
  const viewDateKey = useMemo(() => toDateKey(date || new Date()), [date]);

  const isEdit = !!initialEvent;
  const isOccurrence =
    !!initialEvent?.isOccurrence && !!initialEvent?.seriesId && !!initialEvent?.occurrenceKey;

  // “클릭 즉시 수정 모달 + 저장은 Dirty일 때만”
  const [dirty, setDirty] = useState(false);

  // 간단/상세 탭
  const [tab, setTab] = useState(mode);

  // 반복 편집 범위(반복 발생분만)
  const [editScope, setEditScope] = useState("one"); // one | future

  // 날짜/시간
  const [startDate, setStartDate] = useState(viewDateKey);
  const [endDate, setEndDate] = useState(viewDateKey);
  const [allDay, setAllDay] = useState(true);
  const [start, setStart] = useState(defaultAllDay().start);
  const [end, setEnd] = useState(defaultAllDay().end);

  // 기본 필드
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [colorHex, setColorHex] = useState(COLOR_PRESETS[0]);
  const [visibility, setVisibility] = useState("all"); // all/public/attendees/busy/private (검색/필터와 연결)
  const [importance, setImportance] = useState(""); // "" | 1..5
  const [bookmarked, setBookmarked] = useState(false);
  const [memo, setMemo] = useState("");
  const [tags, setTags] = useState([]);
  const [tagDraft, setTagDraft] = useState("");
  const [location, setLocation] = useState("");
  const [timeZone, setTimeZone] = useState(getLocalTimeZone());

  // D-Day
  const [ddayEnabled, setDdayEnabled] = useState(false);
  const [ddayDate, setDdayDate] = useState(viewDateKey);

  // 공유
  const [sharedUserIds, setSharedUserIds] = useState([]);

  // 반복(상세 탭에서만)
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatFreq, setRepeatFreq] = useState("weekly"); // daily|weekly|monthly|yearly
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatWeekdays, setRepeatWeekdays] = useState([]);
  const [repeatEndType, setRepeatEndType] = useState("none"); // none|until
  const [repeatEndUntil, setRepeatEndUntil] = useState(viewDateKey);

  // 임시 사용자 디렉토리
  const [userDir, setUserDir] = useState(() => loadUserDirectory());

  const categoryOptions = useMemo(() => [{ id: "", name: "선택 없음" }, ...DEFAULT_CATEGORIES], []);
  const categoryMap = useMemo(() => {
    const m = new Map();
    (DEFAULT_CATEGORIES || []).forEach((c) => m.set(String(c.id), c));
    return m;
  }, []);

  // 수정 시 기존 버킷(dateKey) 기억 -> 시작일 바뀌면 이동
  const originalBucketRef = useRef(viewDateKey);

  // 종일 해제 시 이전 시간 복원
  const lastNonAllDayRef = useRef({ start: "09:00", end: "10:00" });

  const resetFrom = () => {
    setDirty(false);
    setEditScope("one");

    // 편집이면 상세 기본(공유/반복/옵션 접근 용이)
    setTab(isEdit ? "detail" : mode);

    // 공통 초기
    setTagDraft("");
    setTimeZone(getLocalTimeZone());

    if (initialEvent) {
      const sdk = clampDateKey(initialEvent.startDateKey) || clampDateKey(initialEvent.dateKey) || viewDateKey;
      const edk = clampDateKey(initialEvent.endDateKey) || sdk;

      setTitle(initialEvent.title || "");
      setStartDate(sdk);
      setEndDate(edk);

      const st = initialEvent.start || defaultAllDay().start;
      const en = initialEvent.end || defaultAllDay().end;

      const isAll = st === "00:00" && en === "23:59";
      setAllDay(isAll);
      setStart(st);
      setEnd(en);
      if (!isAll) lastNonAllDayRef.current = { start: st, end: en };

      setCategoryId(initialEvent.categoryId || "");
      setColorHex(initialEvent.colorHex || initialEvent.color || COLOR_PRESETS[0]);

      setVisibility(initialEvent.visibility || "all");
      setImportance(
        initialEvent.importance == null || initialEvent.importance === ""
          ? ""
          : String(initialEvent.importance)
      );
      setBookmarked(Boolean(initialEvent.bookmarked ?? initialEvent.isBookmarked ?? false));
      setMemo(String(initialEvent.memo ?? ""));
      setTags(uniqStrings(initialEvent.tags));
      setLocation(String(initialEvent.location ?? ""));
      setTimeZone(String(initialEvent.timeZone ?? getLocalTimeZone()));

      const dEnabled = Boolean(initialEvent.ddayEnabled ?? initialEvent.isDday ?? false);
      setDdayEnabled(dEnabled);
      setDdayDate(clampDateKey(initialEvent.ddayDate ?? initialEvent.ddayTargetDate) || sdk);

      setSharedUserIds(Array.isArray(initialEvent.sharedUserIds) ? initialEvent.sharedUserIds : []);

      originalBucketRef.current = sdk;

      // 반복 규칙 로딩
      const rr = initialEvent.repeatRule;
      if (rr?.enabled) {
        setRepeatEnabled(true);
        setRepeatFreq(rr.freq || "weekly");
        setRepeatInterval(Number(rr.interval || 1));
        setRepeatWeekdays(Array.isArray(rr.byWeekdays) ? rr.byWeekdays : []);
        const endObj = rr.end || { type: "none" };
        setRepeatEndType(endObj.type || "none");
        setRepeatEndUntil(clampDateKey(endObj.until) || viewDateKey);
      } else {
        setRepeatEnabled(false);
        setRepeatFreq("weekly");
        setRepeatInterval(1);
        setRepeatWeekdays([]);
        setRepeatEndType("none");
        setRepeatEndUntil(viewDateKey);
      }
    } else {
      // 신규
      setTitle("");

      const ad = defaultAllDay();
      setAllDay(true);
      setStart(ad.start);
      setEnd(ad.end);
      lastNonAllDayRef.current = { start: "09:00", end: "10:00" };

      setStartDate(viewDateKey);
      setEndDate(viewDateKey);

      setCategoryId("");
      setColorHex(COLOR_PRESETS[0]);

      setVisibility("all");
      setImportance("");
      setBookmarked(false);
      setMemo("");
      setTags([]);
      setLocation("");
      setTimeZone(getLocalTimeZone());

      setDdayEnabled(false);
      setDdayDate(viewDateKey);

      setSharedUserIds([]);

      setRepeatEnabled(false);
      setRepeatFreq("weekly");
      setRepeatInterval(1);
      setRepeatWeekdays([dayKeyOfDate(date)]);
      setRepeatEndType("none");
      setRepeatEndUntil(viewDateKey);

      originalBucketRef.current = viewDateKey;
    }
  };

  useEffect(() => {
    if (!open) return;
    resetFrom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, viewDateKey, mode, isEdit]);

  const setDirtyWrap = (setter) => (v) => {
    setDirty(true);
    setter(v);
  };

  const canSave = useMemo(() => {
    const hasTitle = !!title.trim();
    if (!hasTitle) return false;

    const s = clampDateKey(startDate);
    const e = clampDateKey(endDate);
    if (!s || !e) return false;
    if (s > e) return false;

    // 같은 날짜면 시간 검증(종일 제외)
    if (!allDay && s === e) {
      const sm = parseTimeToMin(start);
      const em = parseTimeToMin(end);
      if (sm == null || em == null) return false;
      if (em <= sm) return false;
    }

    if (isEdit) return dirty;
    return true;
  }, [title, isEdit, dirty, startDate, endDate, allDay, start, end]);

  const buildRepeatRule = () => {
    if (tab !== "detail" || !repeatEnabled) return { enabled: false };
    return {
      enabled: true,
      freq: repeatFreq,
      interval: Math.max(1, Number(repeatInterval || 1)),
      byWeekdays: repeatFreq === "weekly" ? repeatWeekdays : [],
      end: repeatEndType === "until" ? { type: "until", until: repeatEndUntil } : { type: "none" },
    };
  };

  const normalizeForSave = () => {
    // 시간 10분 스냅 (수동입력 방어)
    if (allDay) return { start: "00:00", end: "23:59" };
    return {
      start: snapTime10(start, "start"),
      end: snapTime10(end, "end"),
    };
  };

  const handleSave = () => {
    const t = title.trim();
    if (!t) return;

    const sDateKey = clampDateKey(startDate) || viewDateKey;
    const eDateKey = clampDateKey(endDate) || sDateKey;
    if (sDateKey > eDateKey) return;

    const rr = buildRepeatRule();

    const times = normalizeForSave();
    const cat = categoryId ? categoryMap.get(String(categoryId)) : null;

    const base = {
      title: t,
      start: times.start,
      end: times.end,
      startDateKey: sDateKey,
      endDateKey: eDateKey,

      categoryId: categoryId || "",
      categoryName: cat?.name || initialEvent?.categoryName || "",
      colorHex: colorHex || "",

      visibility: visibility || "all",
      importance: importance === "" ? null : Number(importance),
      bookmarked: Boolean(bookmarked),

      memo: String(memo || ""),
      tags: uniqStrings(tags),

      timeZone: String(timeZone || getLocalTimeZone()),
      location: String(location || ""),

      ddayEnabled: Boolean(ddayEnabled),
      ddayDate: ddayEnabled ? (clampDateKey(ddayDate) || sDateKey) : null,

      sharedUserIds: Array.isArray(sharedUserIds) ? sharedUserIds : [],
      updatedAt: Date.now(),
      repeatRule: rr?.enabled ? rr : { enabled: false },
    };

    // EDIT
    if (initialEvent) {
      // occurrence + “앞으로 모두”
      if (isOccurrence && editScope === "future") {
        if (rr?.enabled) {
          updateSeriesFuture(initialEvent.seriesId, viewDateKey, {
            title: base.title,
            startTime: base.start,
            endTime: base.end,
            categoryId: base.categoryId,
            categoryName: base.categoryName,
            colorHex: base.colorHex,
            visibility: base.visibility,
            importance: base.importance,
            bookmarked: base.bookmarked,
            memo: base.memo,
            tags: base.tags,
            timeZone: base.timeZone,
            location: base.location,
            ddayEnabled: base.ddayEnabled,
            ddayDate: base.ddayDate,
            sharedUserIds: base.sharedUserIds,
            repeatRule: rr,
          });
        } else {
          // 반복 해제(앞으로 모두): 기존 시리즈 종료 + 기준일에 단건 생성
          endSeriesFromDate(initialEvent.seriesId, viewDateKey);
          upsertOneOffEvent(viewDateKey, {
            ...base,
            id: undefined,
            repeatRule: { enabled: false },
          });
        }
        onSaved?.(getEventsForDate(viewDateKey));
        onClose?.();
        return;
      }

      // occurrence + “이번만”
      if (isOccurrence) {
        upsertOneOffEvent(viewDateKey, {
          id: undefined,
          ...base,
          isException: true,
          seriesId: initialEvent.seriesId,
          occurrenceKey: initialEvent.occurrenceKey,
          isDeleted: false,
        });
        onSaved?.(getEventsForDate(viewDateKey));
        onClose?.();
        return;
      }

      // one-off 수정: 시작일이 바뀌면 버킷 이동
      const prevBucket = originalBucketRef.current || viewDateKey;
      if (prevBucket !== sDateKey) {
        deleteEvent(prevBucket, initialEvent);
        originalBucketRef.current = sDateKey;
      }

      upsertOneOffEvent(sDateKey, {
        ...initialEvent,
        ...base,
      });

      onSaved?.(getEventsForDate(viewDateKey));
      onClose?.();
      return;
    }

    // CREATE
    if (tab === "detail" && rr?.enabled) {
      createSeries({
        title: base.title,
        startTime: base.start,
        endTime: base.end,
        categoryId: base.categoryId,
        categoryName: base.categoryName,
        colorHex: base.colorHex,
        visibility: base.visibility,
        importance: base.importance,
        bookmarked: base.bookmarked,
        memo: base.memo,
        tags: base.tags,
        timeZone: base.timeZone,
        location: base.location,
        ddayEnabled: base.ddayEnabled,
        ddayDate: base.ddayDate,
        sharedUserIds: base.sharedUserIds,
        startDate: sDateKey,
        repeatRule: rr,
      });
      onSaved?.(getEventsForDate(viewDateKey));
      onClose?.();
      return;
    }

    upsertOneOffEvent(sDateKey, {
      ...base,
      id: undefined,
      repeatRule: { enabled: false },
    });
    onSaved?.(getEventsForDate(viewDateKey));
    onClose?.();
  };

  const handleDelete = () => {
    if (!initialEvent) return;

    if (isOccurrence && editScope === "future") {
      endSeriesFromDate(initialEvent.seriesId, viewDateKey);
      onSaved?.(getEventsForDate(viewDateKey));
      onClose?.();
      return;
    }

    const prevBucket = originalBucketRef.current || viewDateKey;
    deleteEvent(prevBucket, initialEvent);
    onSaved?.(getEventsForDate(viewDateKey));
    onClose?.();
  };

  const toggleWeekday = (wk) => {
    setDirty(true);
    setRepeatWeekdays((prev) => (prev.includes(wk) ? prev.filter((x) => x !== wk) : [...prev, wk]));
  };

  const modalTitle = useMemo(() => (initialEvent ? "일정 수정" : "일정 추가"), [initialEvent]);

  const footer = (
    <>
      {initialEvent ? (
        <button type="button" className="btn btn--sm btn--ghost" onClick={handleDelete}>
          삭제
        </button>
      ) : null}
      <button type="button" className="btn btn--sm btn--ghost" onClick={onClose}>
        취소
      </button>
      <button
        type="button"
        className={"btn btn--sm btn--primary" + (!canSave ? " is-disabled" : "")}
        onClick={handleSave}
        disabled={!canSave}
      >
        저장
      </button>
    </>
  );

  const addTagFromDraft = () => {
    const raw = String(tagDraft || "").trim();
    if (!raw) return;
    const parts = raw
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    if (!parts.length) return;

    setDirty(true);
    setTags((prev) => uniqStrings([...(prev || []), ...parts]));
    setTagDraft("");
  };

  const removeTag = (tag) => {
    setDirty(true);
    setTags((prev) => (Array.isArray(prev) ? prev.filter((t) => String(t) !== String(tag)) : []));
  };

  const onToggleAllDay = (next) => {
    setDirty(true);
    setAllDay(next);
    if (next) {
      // 종일 ON
      if (start !== "00:00" || end !== "23:59") {
        lastNonAllDayRef.current = { start, end };
      }
      setStart("00:00");
      setEnd("23:59");
      return;
    }
    // 종일 OFF -> 이전 시간 복원
    const last = lastNonAllDayRef.current || { start: "09:00", end: "10:00" };
    setStart(snapTime10(last.start, "start"));
    setEnd(snapTime10(last.end, "end"));
  };

  const BasicCard = (
    <div className="sfm__card">
      <div className="sfm__cardHead">
        <div>
          <div className="sfm__cardTitle">기본</div>
          <div className="sfm__cardSub">10분 단위 시간 선택 / 색상 지정</div>
        </div>
      </div>

      <div className="sfm__formGrid">
        <div className="sfm__field sfm__col2">
          <div className="sfm__label">제목</div>
          <input
            className="sfm__input"
            value={title}
            placeholder="예) 프로젝트 회의"
            onChange={(e) => setDirtyWrap(setTitle)(e.target.value)}
          />
        </div>

        <div className="sfm__field">
          <div className="sfm__label">시작일</div>
          <input
            type="date"
            className="sfm__input"
            value={startDate}
            onChange={(e) => setDirtyWrap(setStartDate)(e.target.value)}
          />
        </div>

        <div className="sfm__field">
          <div className="sfm__label">종료일</div>
          <input
            type="date"
            className="sfm__input"
            value={endDate}
            onChange={(e) => setDirtyWrap(setEndDate)(e.target.value)}
          />
        </div>

        <div className="sfm__field sfm__col2">
          <label className="sfm__checkRow" style={{ marginTop: 2 }}>
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => onToggleAllDay(e.target.checked)}
            />
            <span>종일</span>
            <span className="sfm__muted">종일이면 00:00~23:59로 저장</span>
          </label>
        </div>

        {!allDay ? (
          <>
            <div className="sfm__field">
              <div className="sfm__label">시작 시간</div>
              <input
                type="time"
                step={600}
                className="sfm__input"
                value={start}
                onChange={(e) => setDirtyWrap(setStart)(e.target.value)}
                onBlur={() => setStart((v) => snapTime10(v, "start"))}
              />
            </div>

            <div className="sfm__field">
              <div className="sfm__label">종료 시간</div>
              <input
                type="time"
                step={600}
                className="sfm__input"
                value={end}
                onChange={(e) => setDirtyWrap(setEnd)(e.target.value)}
                onBlur={() => setEnd((v) => snapTime10(v, "end"))}
              />
            </div>
          </>
        ) : null}

        <div className="sfm__field sfm__col2">
          <div className="sfm__label">색상</div>
          <div className="sfm__colorRow">
            <div className="sfm__colors">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={"sfm__colorDot " + (String(colorHex).toLowerCase() === c.toLowerCase() ? "is-on" : "")}
                  style={{ background: c }}
                  onClick={() => setDirtyWrap(setColorHex)(c)}
                  aria-label={`color ${c}`}
                  title={c}
                />
              ))}
            </div>
            <input
              type="color"
              className="sfm__colorPicker"
              value={colorHex || "#6366F1"}
              onChange={(e) => setDirtyWrap(setColorHex)(e.target.value)}
              title="커스텀 색상"
            />
          </div>
        </div>

        {/* 상세 탭에서만 카테고리 노출(간단은 최소 필드 유지) */}
        {tab === "detail" ? (
          <div className="sfm__field sfm__col2">
            <div className="sfm__label">카테고리</div>
            <select
              className="sfm__input"
              value={categoryId}
              onChange={(e) => setDirtyWrap(setCategoryId)(e.target.value)}
            >
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
    </div>
  );

  const QuickOptionsCard = (
    <div className="sfm__card">
      <div className="sfm__cardHead">
        <div>
          <div className="sfm__cardTitle">자주 쓰는 옵션</div>
          <div className="sfm__cardSub">최소 옵션만 빠르게</div>
        </div>
      </div>

      <div className="sfm__formGrid">
        <div className="sfm__field">
          <div className="sfm__label">중요도</div>
          <select
            className="sfm__input"
            value={importance}
            onChange={(e) => setDirtyWrap(setImportance)(e.target.value)}
          >
            <option value="">없음</option>
            <option value="5">5 (가장 중요)</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </div>

        <div className="sfm__field">
          <div className="sfm__label">북마크</div>
          <label className="sfm__checkRow" style={{ height: 40 }}>
            <input
              type="checkbox"
              checked={bookmarked}
              onChange={(e) => setDirtyWrap(setBookmarked)(e.target.checked)}
            />
            <span>북마크</span>
          </label>
        </div>

        <div className="sfm__field sfm__col2">
          <div className="sfm__label">메모</div>
          <textarea
            className="sfm__textarea"
            rows={5}
            value={memo}
            placeholder="간단 메모(검색 대상)"
            onChange={(e) => setDirtyWrap(setMemo)(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const DetailOptionsCard = (
    <div className="sfm__card">
      <div className="sfm__cardHead">
        <div>
          <div className="sfm__cardTitle">옵션</div>
          <div className="sfm__cardSub">필터/검색/목록 표시와 연결</div>
        </div>
      </div>

      <div className="sfm__formGrid">
        <div className="sfm__field">
          <div className="sfm__label">공개범위</div>
          <select
            className="sfm__input"
            value={visibility}
            onChange={(e) => setDirtyWrap(setVisibility)(e.target.value)}
          >
            <option value="all">전체(미지정)</option>
            <option value="public">모두</option>
            <option value="attendees">참석자만</option>
            <option value="busy">바쁨만</option>
            <option value="private">나만</option>
          </select>
        </div>

        <div className="sfm__field">
          <div className="sfm__label">중요도</div>
          <select
            className="sfm__input"
            value={importance}
            onChange={(e) => setDirtyWrap(setImportance)(e.target.value)}
          >
            <option value="">없음</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </div>

        <div className="sfm__field">
          <div className="sfm__label">북마크</div>
          <label className="sfm__checkRow" style={{ height: 40 }}>
            <input
              type="checkbox"
              checked={bookmarked}
              onChange={(e) => setDirtyWrap(setBookmarked)(e.target.checked)}
            />
            <span>북마크</span>
          </label>
        </div>

        <div className="sfm__field">
          <div className="sfm__label">D-Day</div>
          <label className="sfm__checkRow" style={{ height: 40 }}>
            <input
              type="checkbox"
              checked={ddayEnabled}
              onChange={(e) => setDirtyWrap(setDdayEnabled)(e.target.checked)}
            />
            <span>사용</span>
          </label>
        </div>

        {ddayEnabled ? (
          <div className="sfm__field sfm__col2">
            <div className="sfm__label">D-Day 날짜</div>
            <input
              type="date"
              className="sfm__input"
              value={ddayDate}
              onChange={(e) => setDirtyWrap(setDdayDate)(e.target.value)}
            />
          </div>
        ) : null}

        {/*         
        <div className="sfm__field">
          <div className="sfm__label">타임존</div>
          <input
            className="sfm__input"
            value={timeZone}
            onChange={(e) => setDirtyWrap(setTimeZone)(e.target.value)}
            placeholder="예) Asia/Seoul"
          />
          <div className="sfm__hint">UTC 저장이어도 입력/표시 기준 타임존이 필요합니다.</div>
        </div>
         */}

        <div className="sfm__field">
          <div className="sfm__label">위치</div>
          <input
            className="sfm__input"
            value={location}
            onChange={(e) => setDirtyWrap(setLocation)(e.target.value)}
            placeholder="예) 회의실 A / 온라인"
          />
        </div>

        <div className="sfm__field sfm__col2">
          <div className="sfm__label">메모</div>
          <textarea
            className="sfm__textarea"
            rows={5}
            value={memo}
            placeholder="메모(검색 대상)"
            onChange={(e) => setDirtyWrap(setMemo)(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const TagsCard = (
    <div className="sfm__card sfm__cardFull">
      <div className="sfm__cardHead">
        <div>
          <div className="sfm__cardTitle">태그</div>
          <div className="sfm__cardSub">검색(제목/메모/태그/참석자)과 연결</div>
        </div>
      </div>

      <div className="sfm__tagsWrap">
        <div className="sfm__chips">
          {(tags || []).map((t) => (
            <button key={t} type="button" className="sfm__chip" onClick={() => removeTag(t)} title="클릭해서 제거">
              #{t} <span className="sfm__chipX">×</span>
            </button>
          ))}
          {!tags?.length ? <div className="sfm__muted">태그가 없습니다.</div> : null}
        </div>

        <div className="sfm__tagInputRow">
          <input
            className="sfm__input"
            value={tagDraft}
            placeholder="태그 입력 후 Enter (콤마로 여러 개 가능)"
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTagFromDraft();
              }
            }}
          />
          <button type="button" className="btn btn--sm btn--secondary" onClick={addTagFromDraft}>
            추가
          </button>
        </div>
      </div>
    </div>
  );

  const ShareCard = (
    <div className="sfm__card sfm__cardFull">
      <div className="sfm__cardHead">
        <div>
          <div className="sfm__cardTitle">공유 사용자</div>
          <div className="sfm__cardSub">Enter/콤마로 추가, 자동완성 지원(임시 UX)</div>
        </div>
      </div>

      <UserChipsInput
        value={sharedUserIds}
        onChange={(v) => {
          setDirty(true);
          setSharedUserIds(v);
        }}
        suggestions={userDir}
        onAddNewSuggestion={(v) => {
          const next = addUserToDirectory(v);
          setUserDir(next);
        }}
        placeholder="사용자 입력 후 Enter"
      />
    </div>
  );

  const RepeatCard =
    tab === "detail" ? (
      <div className="sfm__card sfm__cardFull">
        <div className="sfm__cardHead sfm__repeatHead">
          <div>
            <div className="sfm__cardTitle">반복</div>
            <div className="sfm__cardSub">주간/월간/연간 플래너에도 자동 표시</div>
          </div>

          <label className="sfm__switch">
            <input
              type="checkbox"
              checked={repeatEnabled}
              onChange={(e) => {
                setDirty(true);
                setRepeatEnabled(e.target.checked);
              }}
            />
            <span>반복 사용</span>
          </label>
        </div>

        {repeatEnabled ? (
          <div className="sfm__repeatBox">
            <div className="sfm__formGrid">
              <div className="sfm__field">
                <div className="sfm__label">주기</div>
                <select
                  className="sfm__input"
                  value={repeatFreq}
                  onChange={(e) => {
                    setDirty(true);
                    setRepeatFreq(e.target.value);
                  }}
                >
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                  <option value="monthly">매월</option>
                  <option value="yearly">매년</option>
                </select>
              </div>

              <div className="sfm__field">
                <div className="sfm__label">간격</div>
                <input
                  className="sfm__input"
                  type="number"
                  min={1}
                  value={repeatInterval}
                  onChange={(e) => {
                    setDirty(true);
                    setRepeatInterval(Number(e.target.value || 1));
                  }}
                />
              </div>

              {repeatFreq === "weekly" ? (
                <div className="sfm__field sfm__col2">
                  <div className="sfm__label">요일</div>
                  <div className="sfm__weekdays">
                    {[
                      ["mon", "월"],
                      ["tue", "화"],
                      ["wed", "수"],
                      ["thu", "목"],
                      ["fri", "금"],
                      ["sat", "토"],
                      ["sun", "일"],
                    ].map(([k, label]) => (
                      <button
                        key={k}
                        type="button"
                        className={"sfm__wkBtn " + (repeatWeekdays.includes(k) ? "is-on" : "")}
                        onClick={() => toggleWeekday(k)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="sfm__field">
                <div className="sfm__label">종료 방식</div>
                <select
                  className="sfm__input"
                  value={repeatEndType}
                  onChange={(e) => {
                    setDirty(true);
                    setRepeatEndType(e.target.value);
                  }}
                >
                  <option value="none">없음</option>
                  <option value="until">날짜까지</option>
                </select>
              </div>

              {repeatEndType === "until" ? (
                <div className="sfm__field">
                  <div className="sfm__label">종료 날짜</div>
                  <input
                    type="date"
                    className="sfm__input"
                    value={repeatEndUntil}
                    onChange={(e) => {
                      setDirty(true);
                      setRepeatEndUntil(e.target.value);
                    }}
                  />
                </div>
              ) : (
                <div className="sfm__field">
                  <div className="sfm__label">종료 날짜</div>
                  <div className="sfm__muted" style={{ height: 40, display: "flex", alignItems: "center" }}>
                    없음
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    ) : null;

  return (
    <Modal open={open} onClose={onClose} title={modalTitle} footer={footer}>
      <div className="sfm">
        {/* 상단 바: 날짜 + 간단/상세 세그먼트 */}
        <div className="sfm__bar">
          <div className="sfm__barLeft">
            <div className="sfm__barKicker">DATE</div>
            <div className="sfm__barValue">{viewDateKey}</div>
          </div>

          <div className="sfm__barRight">
            <div className="sfm__seg">
              <button
                type="button"
                className={"sfm__segBtn " + (tab === "quick" ? "is-active" : "")}
                onClick={() => setTab("quick")}
              >
                간단
              </button>
              <button
                type="button"
                className={"sfm__segBtn " + (tab === "detail" ? "is-active" : "")}
                onClick={() => setTab("detail")}
              >
                상세
              </button>
            </div>
          </div>
        </div>

        {isEdit && isOccurrence ? (
          <div className="sfm__scopeBox">
            <div className="sfm__label">편집 범위</div>
            <div className="sfm__scopeRow">
              <label className="sfm__radio">
                <input
                  type="radio"
                  name="editScope"
                  checked={editScope === "one"}
                  onChange={() => setDirtyWrap(setEditScope)("one")}
                />
                <span>이번 일정만</span>
              </label>
              <label className="sfm__radio">
                <input
                  type="radio"
                  name="editScope"
                  checked={editScope === "future"}
                  onChange={() => setDirtyWrap(setEditScope)("future")}
                />
                <span>앞으로 모두</span>
              </label>
            </div>
            <div className="sfm__hint">“앞으로 모두”는 기준일부터 반복 규칙/내용이 적용됩니다(시리즈 분할).</div>
          </div>
        ) : null}

        {/* 본문 */}
        {tab === "quick" ? (
          <div className="sfm__cards">
            {BasicCard}
            {QuickOptionsCard}
          </div>
        ) : (
          <>
            <div className="sfm__cards">
              {BasicCard}
              {DetailOptionsCard}
            </div>

            {TagsCard}
            {ShareCard}
            {RepeatCard}
          </>
        )}
      </div>
    </Modal>
  );
}
