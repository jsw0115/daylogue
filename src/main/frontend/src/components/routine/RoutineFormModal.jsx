// FILE: src/main/frontend/src/components/routine/RoutineFormModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

import Modal from "../common/Modal";
import "../../styles/components/routine-form-modal.css";

import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";
import { safeStorage } from "../../shared/utils/safeStorage";

const STORAGE_KEY = "timebar.routines.v1";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function clampYmd(v) {
  if (typeof v !== "string") return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "";
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `rt_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function loadList() {
  const list = safeStorage.getJSON(STORAGE_KEY, []);
  return Array.isArray(list) ? list : [];
}

function saveList(list) {
  safeStorage.setJSON(STORAGE_KEY, Array.isArray(list) ? list : []);
}

const WEEKDAYS = [
  ["mon", "월"],
  ["tue", "화"],
  ["wed", "수"],
  ["thu", "목"],
  ["fri", "금"],
  ["sat", "토"],
  ["sun", "일"],
];

export default function RoutineFormModal({
  open,
  onClose,
  mode = "quick", // quick | detail
  initialRoutine = null,
  onSaved,
}) {
  const isEdit = !!initialRoutine;

  // “수정이면 dirty일 때만 저장 버튼 활성화”
  const [dirty, setDirty] = useState(false);

  // 모달 내 간단/상세 탭 (루틴 관리/일간 플래너에서 동일 UX)
  const [tab, setTab] = useState(mode);

  // 기본 필드
  const [name, setName] = useState("");
  const [type, setType] = useState("daily"); // daily | weekly
  const [time, setTime] = useState("07:00");

  // 상세 필드
  const [icon, setIcon] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // 주간 반복(weekly)일 때만
  const [weekdays, setWeekdays] = useState(["mon"]);

  // 목표
  const [goalType, setGoalType] = useState("check"); // check | count | minutes
  const [goalValue, setGoalValue] = useState(1);

  // 알림 (MVP: 체크박스 기반)
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [notifyOffsets, setNotifyOffsets] = useState([10]); // 분 단위: 0=정시, 5,10,30...

  // 활성/중지
  const [active, setActive] = useState(true);
  const [suspendUntil, setSuspendUntil] = useState(""); // yyyy-mm-dd

  // 수정 시 원본 ID 고정
  const originalIdRef = useRef(null);

  const categoryOptions = useMemo(() => [{ id: "", name: "선택 없음" }, ...DEFAULT_CATEGORIES], []);

  const resetFrom = () => {
    setDirty(false);

    // 편집이면 상세를 기본 탭으로 (필드 접근성)
    setTab(isEdit ? "detail" : mode);

    if (initialRoutine) {
      originalIdRef.current = initialRoutine.id ?? null;

      setName(initialRoutine.name ?? "");
      setType(initialRoutine.type === "weekly" ? "weekly" : "daily");
      setTime(initialRoutine.time ?? "07:00");

      setIcon(initialRoutine.icon ?? "");
      setCategoryId(initialRoutine.categoryId ?? "");

      const w = Array.isArray(initialRoutine.weekdays) ? initialRoutine.weekdays : null;
      setWeekdays(w && w.length ? w : ["mon"]);

      // goal
      const gt = initialRoutine.goalType ?? "check";
      setGoalType(gt);
      const gv = Number(initialRoutine.goalValue ?? (gt === "check" ? 1 : 1));
      setGoalValue(Number.isFinite(gv) ? gv : 1);

      // notify
      const ne = !!initialRoutine.notify;
      setNotifyEnabled(ne);

      // 기존 호환: beforeMinutes(단일) + notifyOffsets(배열) 둘 다 허용
      const offsets =
        Array.isArray(initialRoutine.notifyOffsets) && initialRoutine.notifyOffsets.length
          ? initialRoutine.notifyOffsets
          : typeof initialRoutine.beforeMinutes === "number"
            ? [initialRoutine.beforeMinutes]
            : [10];

      setNotifyOffsets(offsets.map((x) => Number(x)).filter((x) => Number.isFinite(x)));

      setActive(initialRoutine.active !== false);

      const su = clampYmd(initialRoutine.suspendUntil ?? "");
      setSuspendUntil(su);
    } else {
      originalIdRef.current = null;

      setName("");
      setType("daily");
      setTime("07:00");

      setIcon("");
      setCategoryId("");

      setWeekdays(["mon"]);

      setGoalType("check");
      setGoalValue(1);

      setNotifyEnabled(false);
      setNotifyOffsets([10]);

      setActive(true);
      setSuspendUntil("");
    }
  };

  useEffect(() => {
    if (!open) return;
    resetFrom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, isEdit]);

  const setDirtyWrap = (setter) => (v) => {
    setDirty(true);
    setter(v);
  };

  const toggleWeekday = (wk) => {
    setDirty(true);
    setWeekdays((prev) => (prev.includes(wk) ? prev.filter((x) => x !== wk) : [...prev, wk]));
  };

  const toggleOffset = (min) => {
    setDirty(true);
    setNotifyOffsets((prev) => {
      const s = new Set(prev.map((x) => Number(x)));
      if (s.has(min)) s.delete(min);
      else s.add(min);
      return Array.from(s).sort((a, b) => a - b);
    });
  };

  const canSave = useMemo(() => {
    const hasName = !!String(name || "").trim();
    if (!hasName) return false;

    // weekly면 요일 최소 1개
    if (tab === "detail" && type === "weekly" && (!weekdays || weekdays.length === 0)) return false;

    // goalValue는 양수
    const gv = Number(goalValue);
    if (tab === "detail") {
      if (goalType !== "check" && (!Number.isFinite(gv) || gv <= 0)) return false;
    }

    if (isEdit) return dirty;
    return true;
  }, [name, isEdit, dirty, tab, type, weekdays, goalType, goalValue]);

  const buildRoutine = () => {
    const trimmed = String(name || "").trim();

    // 알림(호환 필드 beforeMinutes 유지)
    const offsets = notifyEnabled
      ? (notifyOffsets || []).map((x) => Number(x)).filter((x) => Number.isFinite(x))
      : [];

    const beforeMinutes = offsets.length ? offsets[0] : null;

    const base = {
      id: originalIdRef.current || initialRoutine?.id || makeId(),
      name: trimmed,
      type: type === "weekly" ? "weekly" : "daily",
      time: time || "07:00",

      // 상세
      icon: tab === "detail" ? icon || "" : initialRoutine?.icon || "",
      categoryId: tab === "detail" ? categoryId || "" : initialRoutine?.categoryId || "",

      weekdays: tab === "detail" && type === "weekly" ? weekdays : initialRoutine?.weekdays || [],

      goalType: tab === "detail" ? goalType : initialRoutine?.goalType || "check",
      goalValue:
        tab === "detail"
          ? goalType === "check"
            ? 1
            : Number(goalValue || 1)
          : initialRoutine?.goalValue ?? 1,

      notify: tab === "detail" ? !!notifyEnabled : !!initialRoutine?.notify,
      notifyOffsets: tab === "detail" ? offsets : initialRoutine?.notifyOffsets || [],
      beforeMinutes:
        tab === "detail"
          ? beforeMinutes == null
            ? null
            : beforeMinutes
          : initialRoutine?.beforeMinutes ?? null,

      active: tab === "detail" ? !!active : initialRoutine?.active !== false,
      suspendUntil: tab === "detail" ? clampYmd(suspendUntil) : clampYmd(initialRoutine?.suspendUntil || ""),

      updatedAt: Date.now(),
      createdAt: initialRoutine?.createdAt ?? Date.now(),
    };

    return base;
  };

  const handleSave = () => {
    const trimmed = String(name || "").trim();
    if (!trimmed) return;

    const nextRoutine = buildRoutine();
    const list = loadList();

    const idx = list.findIndex((x) => String(x?.id) === String(nextRoutine.id));
    const next = idx >= 0 ? list.map((x, i) => (i === idx ? { ...x, ...nextRoutine } : x)) : [...list, nextRoutine];

    saveList(next);
    onSaved?.();
    onClose?.();
  };

  const handleDelete = () => {
    if (!initialRoutine?.id) return;

    const list = loadList();
    const next = list.filter((x) => String(x?.id) !== String(initialRoutine.id));
    saveList(next);

    onSaved?.();
    onClose?.();
  };

  const modalTitle = useMemo(() => {
    if (initialRoutine) return "루틴 수정";
    return "새 루틴 추가";
  }, [initialRoutine]);

  const footer = (
    <>
      {initialRoutine ? (
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
      <div className="rfm">
        {/* 간단/상세 탭 */}
        <div className="rfm__section rfm__section--top">
          <div className="rfm__tabs">
            <button
              type="button"
              className={"rfm__tab " + (tab === "quick" ? "is-on" : "")}
              onClick={() => setTab("quick")}
            >
              간단
            </button>
            <button
              type="button"
              className={"rfm__tab " + (tab === "detail" ? "is-on" : "")}
              onClick={() => setTab("detail")}
            >
              상세
            </button>
          </div>
          <div className="rfm__hint">
            간단은 빠른 입력(이름+시간), 상세는 카테고리/아이콘/목표/알림/중지 등 고급 옵션을 제공합니다.
          </div>
        </div>

        <div className="rfm__grid">
          {/* 루틴 이름 */}
          <div className="rfm__field rfm__span2">
            <div className="rfm__label">루틴 이름</div>
            <input
              className="rfm__input"
              value={name}
              placeholder="예) 아침 스트레칭"
              onChange={(e) => setDirtyWrap(setName)(e.target.value)}
            />
          </div>

          {/* 반복 유형 / 대표 시간 */}
          <div className="rfm__field">
            <div className="rfm__label">반복 유형</div>
            <select className="rfm__input" value={type} onChange={(e) => setDirtyWrap(setType)(e.target.value)}>
              <option value="daily">매일</option>
              <option value="weekly">주간(요일 선택)</option>
            </select>
          </div>

          <div className="rfm__field">
            <div className="rfm__label">대표 시간</div>
            <input className="rfm__input" type="time" value={time} onChange={(e) => setDirtyWrap(setTime)(e.target.value)} />
          </div>

          {/* weekly 요일 */}
          {tab === "detail" && type === "weekly" ? (
            <div className="rfm__field rfm__span2">
              <div className="rfm__label">요일</div>
              <div className="rfm__weekdays">
                {WEEKDAYS.map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    className={"rfm__wkBtn " + (weekdays.includes(k) ? "is-on" : "")}
                    onClick={() => toggleWeekday(k)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="rfm__hint">주간 루틴은 선택한 요일에만 “오늘 실행할 루틴”에 표시됩니다.</div>
            </div>
          ) : null}

          {/* 상세 탭 */}
          {tab === "detail" ? (
            <>
              <div className="rfm__field">
                <div className="rfm__label">아이콘</div>
                <input
                  className="rfm__input"
                  value={icon}
                  placeholder="예) ✨"
                  onChange={(e) => setDirtyWrap(setIcon)(e.target.value)}
                />
              </div>

              <div className="rfm__field">
                <div className="rfm__label">카테고리</div>
                <select
                  className="rfm__input"
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

              <div className="rfm__field">
                <div className="rfm__label">목표 타입</div>
                <select
                  className="rfm__input"
                  value={goalType}
                  onChange={(e) => {
                    setDirty(true);
                    const v = e.target.value;
                    setGoalType(v);
                    if (v === "check") setGoalValue(1);
                  }}
                >
                  <option value="check">체크(1회)</option>
                  <option value="count">횟수</option>
                  <option value="minutes">시간(분)</option>
                </select>
              </div>

              <div className="rfm__field">
                <div className="rfm__label">목표 값</div>
                <input
                  className="rfm__input"
                  type="number"
                  min={1}
                  value={goalType === "check" ? 1 : goalValue}
                  disabled={goalType === "check"}
                  onChange={(e) => setDirtyWrap(setGoalValue)(Number(e.target.value || 1))}
                />
                <div className="rfm__hint">
                  체크형은 1회 완료로 처리됩니다. (추후 PvA/통계에서 목표 대비 달성률 계산에 사용)
                </div>
              </div>

              <div className="rfm__section rfm__span2">
                <div className="rfm__sectionHead">
                  <span>알림</span>
                  <label className="rfm__switch">
                    <input
                      type="checkbox"
                      checked={notifyEnabled}
                      onChange={(e) => {
                        setDirty(true);
                        const on = e.target.checked;
                        setNotifyEnabled(on);
                        if (on && (!notifyOffsets || notifyOffsets.length === 0)) setNotifyOffsets([10]);
                      }}
                    />
                    <span>사용</span>
                  </label>
                </div>

                {notifyEnabled ? (
                  <div className="rfm__notifyBox">
                    <label className="rfm__chk">
                      <input type="checkbox" checked={notifyOffsets.includes(0)} onChange={() => toggleOffset(0)} />
                      정시
                    </label>
                    <label className="rfm__chk">
                      <input type="checkbox" checked={notifyOffsets.includes(5)} onChange={() => toggleOffset(5)} />
                      5분 전
                    </label>
                    <label className="rfm__chk">
                      <input type="checkbox" checked={notifyOffsets.includes(10)} onChange={() => toggleOffset(10)} />
                      10분 전
                    </label>
                    <label className="rfm__chk">
                      <input type="checkbox" checked={notifyOffsets.includes(30)} onChange={() => toggleOffset(30)} />
                      30분 전
                    </label>
                    <div className="rfm__hint">
                      MVP는 체크박스 기반(복수 선택)으로만 제공됩니다. 서버 알림 연동 시 동작 정책은 API에서 확정합니다.
                    </div>
                  </div>
                ) : (
                  <div className="rfm__hint">알림을 끄면 루틴은 표시만 되고 푸시/알림 예약은 생성되지 않습니다.</div>
                )}
              </div>

              <div className="rfm__field">
                <div className="rfm__label">활성 여부</div>
                <label className="rfm__inline">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => {
                      setDirty(true);
                      setActive(e.target.checked);
                    }}
                  />
                  활성
                </label>
              </div>

              <div className="rfm__field">
                <div className="rfm__label">중지(선택)</div>
                <input
                  className="rfm__input"
                  type="date"
                  value={suspendUntil}
                  onChange={(e) => setDirtyWrap(setSuspendUntil)(e.target.value)}
                  placeholder={todayYmd()}
                />
                <div className="rfm__hint">
                  값이 있으면 목록에 “중지(날짜)”로 표시할 수 있습니다. (정책/동작은 추후 API에서 확정)
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
