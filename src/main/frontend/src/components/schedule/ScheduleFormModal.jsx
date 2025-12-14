// FILE: src/components/schedule/ScheduleFormModal.jsx
import React, { useEffect, useMemo, useState } from "react";
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

export default function ScheduleFormModal({
  open,
  onClose,
  date,
  mode = "quick", // quick | detail
  initialEvent = null,
  onSaved,
}) {
  const dateKey = useMemo(() => toDateKey(date || new Date()), [date]);

  const isEdit = !!initialEvent;
  const isOccurrence = !!initialEvent?.isOccurrence && !!initialEvent?.seriesId && !!initialEvent?.occurrenceKey;

  // “클릭 즉시 수정 모달 + 저장은 Dirty일 때만”
  const [dirty, setDirty] = useState(false);

  // 편집 범위(반복 발생분만)
  const [editScope, setEditScope] = useState("one"); // one | future

  // 기본 필드
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(defaultAllDay().start);
  const [end, setEnd] = useState(defaultAllDay().end);
  const [categoryId, setCategoryId] = useState("");
  const [sharedUserIds, setSharedUserIds] = useState([]);

  // 반복(상세 모드)
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatFreq, setRepeatFreq] = useState("weekly"); // daily|weekly|monthly|yearly
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatWeekdays, setRepeatWeekdays] = useState([]);
  const [repeatEndType, setRepeatEndType] = useState("none"); // none|until
  const [repeatEndUntil, setRepeatEndUntil] = useState(dateKey);

  // 임시 사용자 디렉토리
  const [userDir, setUserDir] = useState(() => loadUserDirectory());

  const categoryOptions = useMemo(
    () => [{ id: "", name: "선택 없음" }, ...DEFAULT_CATEGORIES],
    []
  );

  const resetFrom = () => {
    setDirty(false);
    setEditScope("one");

    if (initialEvent) {
      setTitle(initialEvent.title || "");
      setStart(initialEvent.start || defaultAllDay().start);
      setEnd(initialEvent.end || defaultAllDay().end);
      setCategoryId(initialEvent.categoryId || "");
      setSharedUserIds(Array.isArray(initialEvent.sharedUserIds) ? initialEvent.sharedUserIds : []);

      // 시리즈 occurrence 편집이면 repeatRule 표시만(기본 값)
      const rr = initialEvent.repeatRule;
      if (mode === "detail") {
        if (rr?.enabled) {
          setRepeatEnabled(true);
          setRepeatFreq(rr.freq || "weekly");
          setRepeatInterval(Number(rr.interval || 1));
          setRepeatWeekdays(Array.isArray(rr.byWeekdays) ? rr.byWeekdays : []);
          const endObj = rr.end || { type: "none" };
          setRepeatEndType(endObj.type || "none");
          setRepeatEndUntil(endObj.until || dateKey);
        } else {
          setRepeatEnabled(false);
          setRepeatFreq("weekly");
          setRepeatInterval(1);
          setRepeatWeekdays([]);
          setRepeatEndType("none");
          setRepeatEndUntil(dateKey);
        }
      }
    } else {
      setTitle("");
      if (mode === "quick") {
        const ad = defaultAllDay();
        setStart(ad.start);
        setEnd(ad.end);
        setCategoryId("");
        setSharedUserIds([]);
        setRepeatEnabled(false);
      } else {
        // 상세 신규: “오늘 클릭한 날짜 기준” UX
        const ad = defaultAllDay();
        setStart(ad.start);
        setEnd(ad.end);
        setCategoryId("");
        setSharedUserIds([]);

        setRepeatEnabled(false);
        setRepeatFreq("weekly");
        setRepeatInterval(1);
        setRepeatWeekdays([dayKeyOfDate(date)]);
        setRepeatEndType("none");
        setRepeatEndUntil(dateKey);
      }
    }
  };

  useEffect(() => {
    if (!open) return;
    resetFrom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dateKey, mode, isEdit]);

  const setDirtyWrap = (setter) => (v) => {
    setDirty(true);
    setter(v);
  };

  const canSave = useMemo(() => {
    const hasTitle = !!title.trim();
    if (!hasTitle) return false;
    if (isEdit) return dirty; // 수정: dirty일 때만 활성화
    return true; // 생성: 제목 있으면 OK
  }, [title, isEdit, dirty]);

  const buildRepeatRule = () => {
    if (mode !== "detail" || !repeatEnabled) return { enabled: false };
    const rr = {
      enabled: true,
      freq: repeatFreq,
      interval: Math.max(1, Number(repeatInterval || 1)),
      byWeekdays: repeatFreq === "weekly" ? repeatWeekdays : [],
      end: repeatEndType === "until" ? { type: "until", until: repeatEndUntil } : { type: "none" },
    };
    return rr;
  };

  const handleSave = () => {
    const t = title.trim();
    if (!t) return;

    const rr = buildRepeatRule();
    const base = {
      title: t,
      start,
      end,
      categoryId: categoryId || "",
      sharedUserIds: Array.isArray(sharedUserIds) ? sharedUserIds : [],
      updatedAt: Date.now(),
    };

    // EDIT
    if (initialEvent) {
      // occurrence + “앞으로 모두”
      if (isOccurrence && editScope === "future") {
        if (rr?.enabled) {
          // 반복 유지: split + 새 시리즈 생성
          updateSeriesFuture(initialEvent.seriesId, dateKey, {
            title: base.title,
            startTime: base.start,
            endTime: base.end,
            categoryId: base.categoryId,
            sharedUserIds: base.sharedUserIds,
            repeatRule: rr,
          });
        } else {
          // 반복 해제(앞으로 모두): 기존 시리즈 종료 + 기준일에 단건 생성
          endSeriesFromDate(initialEvent.seriesId, dateKey);
          upsertOneOffEvent(dateKey, {
            ...base,
            id: undefined,
          });
        }
        onSaved?.(getEventsForDate(dateKey));
        onClose?.();
        return;
      }

      // occurrence + “이번만”
      if (isOccurrence) {
        upsertOneOffEvent(dateKey, {
          id: undefined,
          ...base,
          isException: true,
          seriesId: initialEvent.seriesId,
          occurrenceKey: initialEvent.occurrenceKey,
          isDeleted: false,
        });
        onSaved?.(getEventsForDate(dateKey));
        onClose?.();
        return;
      }

      // one-off 수정
      upsertOneOffEvent(dateKey, {
        ...initialEvent,
        ...base,
      });
      onSaved?.(getEventsForDate(dateKey));
      onClose?.();
      return;
    }

    // CREATE
    if (mode === "detail" && rr?.enabled) {
      createSeries({
        title: base.title,
        startTime: base.start,
        endTime: base.end,
        categoryId: base.categoryId,
        sharedUserIds: base.sharedUserIds,
        startDate: dateKey,
        repeatRule: rr,
      });
      onSaved?.(getEventsForDate(dateKey));
      onClose?.();
      return;
    }

    upsertOneOffEvent(dateKey, {
      ...base,
      id: undefined,
      repeatRule: { enabled: false },
    });
    onSaved?.(getEventsForDate(dateKey));
    onClose?.();
  };

  const handleDelete = () => {
    if (!initialEvent) return;

    if (isOccurrence && editScope === "future") {
      endSeriesFromDate(initialEvent.seriesId, dateKey);
      onSaved?.(getEventsForDate(dateKey));
      onClose?.();
      return;
    }

    deleteEvent(dateKey, initialEvent);
    onSaved?.(getEventsForDate(dateKey));
    onClose?.();
  };

  const toggleWeekday = (wk) => {
    setDirty(true);
    setRepeatWeekdays((prev) => (prev.includes(wk) ? prev.filter((x) => x !== wk) : [...prev, wk]));
  };

  const modalTitle = useMemo(() => {
    if (initialEvent) return "일정 수정";
    return mode === "quick" ? "새 일정 추가(간단)" : "새 일정 추가(상세)";
  }, [initialEvent, mode]);

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
            <div className="sfm__hint">
              “앞으로 모두”는 기준일부터 반복 규칙/내용이 적용됩니다(시리즈 분할).
            </div>
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

          <div className="sfm__row2">
            <div className="sfm__field">
              <div className="sfm__label">시작</div>
              <input
                type="time"
                className="sfm__input"
                value={start}
                onChange={(e) => setDirtyWrap(setStart)(e.target.value)}
              />
            </div>
            <div className="sfm__field">
              <div className="sfm__label">종료</div>
              <input
                type="time"
                className="sfm__input"
                value={end}
                onChange={(e) => setDirtyWrap(setEnd)(e.target.value)}
              />
            </div>
          </div>

          {mode === "detail" ? (
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
