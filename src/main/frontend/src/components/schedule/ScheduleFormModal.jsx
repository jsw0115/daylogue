// FILE: src/components/schedule/ScheduleFormModal.jsx
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

function defaultAllDay() {
  return { start: "00:00", end: "23:59" };
}

function dayKeyOfDate(date) {
  const d = moment(date).day(); // 0..6
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d];
}

function clampDateKey(v) {
  // yyyy-mm-dd 형식만 허용(대충 방어)
  if (typeof v !== "string") return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "";
}

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

  // 편집 범위(반복 발생분만)
  const [editScope, setEditScope] = useState("one"); // one | future

  // 날짜/시간
  const [startDate, setStartDate] = useState(viewDateKey);
  const [endDate, setEndDate] = useState(viewDateKey);
  const [start, setStart] = useState(defaultAllDay().start);
  const [end, setEnd] = useState(defaultAllDay().end);

  // 기본 필드
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
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

  // 수정 시, 기존 이벤트가 저장돼 있던 버킷(dateKey)을 기억해두고,
  // 사용자가 시작일을 바꾸면 "기존 버킷에서 삭제 -> 새 버킷에 저장"을 해준다.
  const originalBucketRef = useRef(viewDateKey);

  const resetFrom = () => {
    setDirty(false);
    setEditScope("one");

    // 탭 초기값: 편집이면 상세를 기본으로(공유/반복 등 손쉬운 접근)
    setTab(isEdit ? "detail" : mode);

    if (initialEvent) {
      setTitle(initialEvent.title || "");

      // 날짜 필드(기존 데이터 호환: 없으면 viewDateKey)
      const sdk = clampDateKey(initialEvent.startDateKey) || viewDateKey;
      const edk = clampDateKey(initialEvent.endDateKey) || sdk;

      setStartDate(sdk);
      setEndDate(edk);

      setStart(initialEvent.start || defaultAllDay().start);
      setEnd(initialEvent.end || defaultAllDay().end);
      setCategoryId(initialEvent.categoryId || "");
      setSharedUserIds(Array.isArray(initialEvent.sharedUserIds) ? initialEvent.sharedUserIds : []);

      originalBucketRef.current =
        clampDateKey(initialEvent.startDateKey) ||
        clampDateKey(initialEvent.dateKey) ||
        viewDateKey;

      // 반복 규칙 로딩(상세에서만 의미)
      const rr = initialEvent.repeatRule;
      if (rr?.enabled) {
        setRepeatEnabled(true);
        setRepeatFreq(rr.freq || "weekly");
        setRepeatInterval(Number(rr.interval || 1));
        setRepeatWeekdays(Array.isArray(rr.byWeekdays) ? rr.byWeekdays : []);
        const endObj = rr.end || { type: "none" };
        setRepeatEndType(endObj.type || "none");
        setRepeatEndUntil(endObj.until || viewDateKey);
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
      setStart(ad.start);
      setEnd(ad.end);

      setStartDate(viewDateKey);
      setEndDate(viewDateKey);

      setCategoryId("");
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

    // 날짜 유효성 + 시작<=종료(날짜 기준)
    const s = clampDateKey(startDate);
    const e = clampDateKey(endDate);
    if (!s || !e) return false;
    if (s > e) return false;

    if (isEdit) return dirty; // 수정: dirty일 때만 활성화
    return true; // 생성: 제목 있으면 OK
  }, [title, isEdit, dirty, startDate, endDate]);

  const buildRepeatRule = () => {
    // 상세 탭에서만 반복 활성
    if (tab !== "detail" || !repeatEnabled) return { enabled: false };

    return {
      enabled: true,
      freq: repeatFreq,
      interval: Math.max(1, Number(repeatInterval || 1)),
      byWeekdays: repeatFreq === "weekly" ? repeatWeekdays : [],
      end:
        repeatEndType === "until"
          ? { type: "until", until: repeatEndUntil }
          : { type: "none" },
    };
  };

  const handleSave = () => {
    const t = title.trim();
    if (!t) return;

    const sDateKey = clampDateKey(startDate) || viewDateKey;
    const eDateKey = clampDateKey(endDate) || sDateKey;
    if (sDateKey > eDateKey) return;

    const rr = buildRepeatRule();

    const base = {
      title: t,
      start,
      end,
      startDateKey: sDateKey,
      endDateKey: eDateKey,
      categoryId: categoryId || "",
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
      // 반복 시리즈는 “시작일” 기준
      createSeries({
        title: base.title,
        startTime: base.start,
        endTime: base.end,
        categoryId: base.categoryId,
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

  const modalTitle = useMemo(() => {
    if (initialEvent) return "일정 수정";
    return "일정 추가";
  }, [initialEvent]);

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

  return (
    <Modal open={open} onClose={onClose} title={modalTitle} footer={footer}>
      <div className="sfm">
        {/* 간단/상세 탭 */}
        <div className="sfm__section" style={{ paddingTop: 0 }}>
          <div className="sfm__scope" style={{ justifyContent: "flex-start", gap: 8 }}>
            <button
              type="button"
              className={"btn btn--sm " + (tab === "quick" ? "btn--primary" : "btn--ghost")}
              onClick={() => setTab("quick")}
            >
              간단
            </button>
            <button
              type="button"
              className={"btn btn--sm " + (tab === "detail" ? "btn--primary" : "btn--ghost")}
              onClick={() => setTab("detail")}
            >
              상세
            </button>
          </div>
          <div className="sfm__hint">간단은 빠른 입력, 상세는 공유/반복 등 고급 옵션을 제공합니다.</div>
        </div>

        {isEdit && isOccurrence ? (
          <div className="sfm__section">
            <div className="sfm__label">편집 범위</div>
            <div className="sfm__scope">
              <label className="sfm__radio">
                <input
                  type="radio"
                  name="editScope"
                  checked={editScope === "one"}
                  onChange={() => setEditScope("one")}
                />
                이번 일정만
              </label>
              <label className="sfm__radio">
                <input
                  type="radio"
                  name="editScope"
                  checked={editScope === "future"}
                  onChange={() => setEditScope("future")}
                />
                앞으로 모두
              </label>
            </div>
            <div className="sfm__hint">“앞으로 모두”는 기준일부터 반복 규칙/내용이 적용됩니다(시리즈 분할).</div>
          </div>
        ) : null}

        <div className="sfm__grid">
          <div className="sfm__field">
            <div className="sfm__label">제목</div>
            <input
              className="sfm__input"
              value={title}
              placeholder="예) 프로젝트 회의"
              onChange={(e) => setDirtyWrap(setTitle)(e.target.value)}
            />
          </div>

          {/* 시작/종료 날짜 */}
          <div className="sfm__row2">
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
          </div>

          {/* 시작/종료 시간 */}
          <div className="sfm__row2">
            <div className="sfm__field">
              <div className="sfm__label">시작 시간</div>
              <input
                type="time"
                className="sfm__input"
                value={start}
                onChange={(e) => setDirtyWrap(setStart)(e.target.value)}
              />
            </div>
            <div className="sfm__field">
              <div className="sfm__label">종료 시간</div>
              <input
                type="time"
                className="sfm__input"
                value={end}
                onChange={(e) => setDirtyWrap(setEnd)(e.target.value)}
              />
            </div>
          </div>

          {/* 상세 탭에서만 */}
          {tab === "detail" ? (
            <>
              <div className="sfm__field">
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

              <div className="sfm__field">
                <div className="sfm__label">공유 사용자</div>
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
                  placeholder="사용자 입력 후 Enter (검색/자동완성)"
                />
                <div className="sfm__hint">
                  서버 연결 전 임시 UX입니다. Enter/콤마로 추가, 방향키로 선택 가능합니다.
                </div>
              </div>

              <div className="sfm__section">
                <div className="sfm__sectionHead">
                  <span>반복</span>
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
                    <div className="sfm__row2">
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
                    </div>

                    {repeatFreq === "weekly" ? (
                      <div className="sfm__field">
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
                    ) : null}
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
