// src/components/routine/RoutineFormModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import Modal from "../common/Modal";
import safeStorage from "../../shared/utils/safeStorage";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

const WEEK_DAYS = [
  { value: "sun", label: "일" },
  { value: "mon", label: "월" },
  { value: "tue", label: "화" },
  { value: "wed", label: "수" },
  { value: "thu", label: "목" },
  { value: "fri", label: "금" },
  { value: "sat", label: "토" },
];

const STORAGE_KEY = "timebar.routines.v1";

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function loadList() {
  const list = safeStorage.getJSON(STORAGE_KEY, []);
  return Array.isArray(list) ? list : [];
}

function saveList(list) {
  safeStorage.setJSON(STORAGE_KEY, list);
}

function normalizeInitial(initialRoutine, mode) {
  const base = {
    id: uid(),
    name: "",
    type: "daily", // daily | weekly
    time: "07:00",
    days: ["mon", "tue", "wed", "thu", "fri"],
    icon: "✨",
    categoryId: (DEFAULT_CATEGORIES?.[0]?.id) || "health",
    active: true,
    notify: true,
    beforeMinutes: "10m",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const merged = { ...base, ...(initialRoutine || {}) };

  // quick 모드면 상세값은 기본값 유지
  if (mode === "quick") {
    merged.icon = merged.icon || "✨";
    merged.categoryId = merged.categoryId || ((DEFAULT_CATEGORIES?.[0]?.id) || "health");
    merged.notify = merged.notify ?? true;
    merged.beforeMinutes = merged.beforeMinutes || "10m";
  }

  return merged;
}

export default function RoutineFormModal({
  open,
  onClose,
  mode = "quick", // quick | detail
  initialRoutine = null,
  onSaved,
}) {
  const [form, setForm] = useState(() => normalizeInitial(initialRoutine, mode));
  const [baseline, setBaseline] = useState(() => JSON.stringify(normalizeInitial(initialRoutine, mode)));

  useEffect(() => {
    const next = normalizeInitial(initialRoutine, mode);
    setForm(next);
    setBaseline(JSON.stringify(next));
  }, [initialRoutine, mode, open]);

  const dirty = useMemo(() => JSON.stringify(form) !== baseline, [form, baseline]);

  const categoryOptions = useMemo(
    () => (DEFAULT_CATEGORIES || []).map((c) => ({ value: c.id, label: c.name })),
    []
  );

  const toggleDay = (d) => {
    setForm((p) => {
      const has = p.days.includes(d);
      const days = has ? p.days.filter((x) => x !== d) : [...p.days, d];
      return { ...p, days };
    });
  };

  const save = () => {
    if (!form.name.trim()) return;

    const list = loadList();
    const now = Date.now();

    const existsIdx = list.findIndex((r) => r.id === form.id);
    const next = { ...form, updatedAt: now };

    if (existsIdx >= 0) {
      list[existsIdx] = next;
    } else {
      list.unshift(next);
    }

    saveList(list);
    onSaved?.(next);
    onClose?.();
  };

  const footer = (
    <>
      <button type="button" className="btn btn--sm btn--ghost" onClick={onClose}>
        취소
      </button>
      <button
        type="button"
        className="btn btn--sm btn--primary"
        onClick={save}
        disabled={!dirty || !form.name.trim()}
        title={!dirty ? "변경 사항이 없습니다." : ""}
      >
        저장
      </button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialRoutine ? "루틴 수정" : "새 루틴 추가"}
      size="md"
      footer={footer}
      className="routineFormModal"
    >
      <div className="tbFormGrid tbFormGrid--1">
        <div className="tbField">
          <label>루틴 이름</label>
          <input
            value={form.name}
            placeholder="예) 아침 스트레칭"
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </div>

        <div className="tbFormGrid">
          <div className="tbField">
            <label>유형</label>
            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            >
              <option value="daily">매일</option>
              <option value="weekly">주간</option>
            </select>
          </div>

          <div className="tbField">
            <label>대표 시간</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
            />
          </div>
        </div>

        {form.type === "weekly" ? (
          <div className="tbField">
            <label>요일</label>
            <div className="tbPills">
              {WEEK_DAYS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  className={`tbPill ${form.days.includes(d.value) ? "is-active" : ""}`}
                  onClick={() => toggleDay(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {mode === "detail" ? (
          <>
            <div className="tbFormGrid">
              <div className="tbField">
                <label>아이콘</label>
                <input
                  value={form.icon}
                  onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                  placeholder="예) ✨"
                />
              </div>

              <div className="tbField">
                <label>카테고리</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                >
                  {categoryOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="tbRow">
              <label className="tbRow">
                <input
                  type="checkbox"
                  checked={!!form.active}
                  onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                />
                <span>루틴 활성화</span>
              </label>

              <label className="tbRow" style={{ marginLeft: 8 }}>
                <input
                  type="checkbox"
                  checked={!!form.notify}
                  onChange={(e) => setForm((p) => ({ ...p, notify: e.target.checked }))}
                />
                <span>알림 받기</span>
              </label>
            </div>

            {form.notify ? (
              <div className="tbField">
                <label>알림 시점</label>
                <select
                  value={form.beforeMinutes}
                  onChange={(e) => setForm((p) => ({ ...p, beforeMinutes: e.target.value }))}
                >
                  <option value="0m">정시</option>
                  <option value="5m">5분 전</option>
                  <option value="10m">10분 전</option>
                  <option value="30m">30분 전</option>
                </select>
                <div className="tbHelp" style={{ marginTop: 6 }}>
                  서버 연동 전까지는 UI/데이터만 저장됩니다.
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </Modal>
  );
}
