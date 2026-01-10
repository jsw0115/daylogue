// FILE: src/screens/routine/RoutineListScreen.jsx
import React, { useMemo, useState } from "react";
import "../../styles/screens/routine.css";
import Modal from "../../components/common/Modal";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

const WEEK_DAYS = [
  { value: "mon", label: "월" },
  { value: "tue", label: "화" },
  { value: "wed", label: "수" },
  { value: "thu", label: "목" },
  { value: "fri", label: "금" },
  { value: "sat", label: "토" },
  { value: "sun", label: "일" },
];

const REMINDER_OPTIONS = [
  { value: "0m", label: "정시" },
  { value: "5m", label: "5분 전" },
  { value: "10m", label: "10분 전" },
  { value: "30m", label: "30분 전" },
];

const SCHEDULE_OPTIONS = [
  { value: "daily", label: "매일" },
  { value: "weekly", label: "요일 선택" },
  { value: "interval", label: "N일마다" },
  { value: "anytime", label: "언제든" },
];

const GOAL_TYPE_OPTIONS = [
  { value: "check", label: "체크(1회)" },
  { value: "count", label: "횟수 목표" },
  { value: "minutes", label: "시간(분) 목표" },
];

const initialRoutines = [
  {
    id: 1,
    name: "아침 스트레칭",
    icon: "✨",
    categoryId: "health",
    active: true,
    scheduleType: "daily",
    time: "07:00",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    intervalDays: 2,
    goalType: "minutes",
    goalValue: 10,
    notify: true,
    reminders: ["10m"],
    pauseUntil: "",
  },
  {
    id: 2,
    name: "SQLD 공부",
    icon: "📘",
    categoryId: "study",
    active: true,
    scheduleType: "weekly",
    time: "21:00",
    days: ["mon", "wed", "fri"],
    intervalDays: 2,
    goalType: "minutes",
    goalValue: 60,
    notify: true,
    reminders: ["30m", "10m"],
    pauseUntil: "",
  },
];

function todayYmd() {
  const d = new Date();
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function makeDefaultDraft() {
  const firstCat = (DEFAULT_CATEGORIES?.[0]?.id) || "health";
  const allDays = WEEK_DAYS.map((d) => d.value);
  return {
    name: "",
    icon: "✨",
    categoryId: firstCat,
    active: true,

    // schedule
    scheduleType: "daily", // daily | weekly | interval | anytime
    time: "07:00",
    days: allDays,
    intervalDays: 2,

    // goal
    goalType: "check", // check | count | minutes
    goalValue: 1,

    // notify
    notify: true,
    reminders: ["10m"],

    // pause
    pauseUntil: "",
  };
}

function scheduleSummary(routine) {
  const t = routine.scheduleType;
  const timeText = t === "anytime" ? "" : ` ${routine.time || ""}`.trimEnd();

  if (t === "anytime") return "언제든";
  if (t === "daily") return `매일${timeText ? " " + routine.time : ""}`.trim();
  if (t === "interval") {
    const n = Number(routine.intervalDays || 0);
    const nText = Number.isFinite(n) && n > 0 ? `${n}일마다` : "N일마다";
    return `${nText}${timeText ? " " + routine.time : ""}`.trim();
  }
  // weekly
  const dayLabels = WEEK_DAYS.filter((d) => (routine.days || []).includes(d.value)).map((d) => d.label);
  const dayText = dayLabels.length > 0 ? dayLabels.join("/") : "요일 미지정";
  return `${dayText}${timeText ? " " + routine.time : ""}`.trim();
}

function goalSummary(routine) {
  if (routine.goalType === "count") return `횟수 ${Number(routine.goalValue || 0) || 0}회`;
  if (routine.goalType === "minutes") return `시간 ${Number(routine.goalValue || 0) || 0}분`;
  return "체크";
}

function isDraftValid(draft) {
  if (!draft.name || draft.name.trim().length === 0) return false;

  if (draft.scheduleType !== "anytime") {
    if (!draft.time || String(draft.time).trim().length === 0) return false;
  }

  if (draft.scheduleType === "weekly") {
    if (!Array.isArray(draft.days) || draft.days.length === 0) return false;
  }

  if (draft.scheduleType === "interval") {
    const n = Number(draft.intervalDays);
    if (!Number.isFinite(n) || n <= 0) return false;
  }

  if (draft.goalType === "count" || draft.goalType === "minutes") {
    const v = Number(draft.goalValue);
    if (!Number.isFinite(v) || v <= 0) return false;
  }

  return true;
}

export default function RoutineListScreen() {
  const [routines, setRoutines] = useState(initialRoutines);

  // filter
  const [q, setQ] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("all");
  const [filterActive, setFilterActive] = useState("all"); // all | active | paused
  const [filterSchedule, setFilterSchedule] = useState("all"); // all | daily | weekly | interval | anytime

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("quick"); // quick | detail
  const [draft, setDraft] = useState(() => makeDefaultDraft());
  const [editingId, setEditingId] = useState(null);

  const categoryOptions = useMemo(() => {
    const list = Array.isArray(DEFAULT_CATEGORIES) ? DEFAULT_CATEGORIES : [];
    return [{ value: "all", label: "전체" }, ...list.map((c) => ({ value: c.id, label: c.name }))];
  }, []);

  const filteredRoutines = useMemo(() => {
    const text = q.trim().toLowerCase();
    return routines.filter((r) => {
      if (text) {
        const base = `${r.name || ""} ${(r.icon || "").toString()} ${(r.categoryId || "")}`.toLowerCase();
        if (!base.includes(text)) return false;
      }
      if (filterCategoryId !== "all" && r.categoryId !== filterCategoryId) return false;
      if (filterActive === "active" && !r.active) return false;
      if (filterActive === "paused" && r.active) return false;
      if (filterSchedule !== "all" && r.scheduleType !== filterSchedule) return false;
      return true;
    });
  }, [routines, q, filterCategoryId, filterActive, filterSchedule]);

  const openCreateModal = () => {
    setMode("quick");
    setDraft(makeDefaultDraft());
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (routine) => {
    setMode("detail"); // 수정은 상세로 진입
    setDraft({
      name: routine.name || "",
      icon: routine.icon || "✨",
      categoryId: routine.categoryId || (DEFAULT_CATEGORIES?.[0]?.id || "health"),
      active: !!routine.active,
      scheduleType: routine.scheduleType || "daily",
      time: routine.time || "07:00",
      days: Array.isArray(routine.days) ? routine.days : [],
      intervalDays: routine.intervalDays || 2,
      goalType: routine.goalType || "check",
      goalValue: routine.goalValue || 1,
      notify: !!routine.notify,
      reminders: Array.isArray(routine.reminders) ? routine.reminders : ["10m"],
      pauseUntil: routine.pauseUntil || "",
    });
    setEditingId(routine.id);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const valid = isDraftValid(draft);

  const toggleDay = (value) => {
    setDraft((prev) => {
      const days = Array.isArray(prev.days) ? prev.days : [];
      const has = days.includes(value);
      const nextDays = has ? days.filter((d) => d !== value) : [...days, value];
      return { ...prev, days: nextDays };
    });
  };

  const toggleReminder = (value) => {
    setDraft((prev) => {
      const cur = Array.isArray(prev.reminders) ? prev.reminders : [];
      const has = cur.includes(value);
      const next = has ? cur.filter((x) => x !== value) : [...cur, value];
      // 정렬: 30m,10m,5m,0m 같은 순서를 의도하면 여기에서 정렬 규칙을 넣으면 됨
      return { ...prev, reminders: next };
    });
  };

  const handleSave = () => {
    if (!valid) return;

    const payload = {
      id: editingId ?? Date.now(),
      name: draft.name.trim(),
      icon: draft.icon || "✨",
      categoryId: draft.categoryId,
      active: !!draft.active,

      scheduleType: mode === "quick" ? "daily" : draft.scheduleType,
      time: mode === "quick" ? draft.time : (draft.scheduleType === "anytime" ? "" : draft.time),
      days: mode === "quick"
        ? WEEK_DAYS.map((d) => d.value)
        : (draft.scheduleType === "weekly" ? draft.days : WEEK_DAYS.map((d) => d.value)),
      intervalDays: mode === "quick" ? 2 : Number(draft.intervalDays || 2),

      goalType: mode === "quick" ? "check" : draft.goalType,
      goalValue:
        mode === "quick"
          ? 1
          : (draft.goalType === "check" ? 1 : Number(draft.goalValue || 1)),

      notify: mode === "quick" ? false : !!draft.notify,
      reminders: mode === "quick" ? [] : (draft.notify ? (draft.reminders || []) : []),

      pauseUntil: mode === "quick" ? "" : (draft.pauseUntil || ""),
    };

    setRoutines((prev) => {
      if (editingId == null) return [...prev, payload];
      return prev.map((r) => (r.id === editingId ? payload : r));
    });

    closeModal();
  };

  const handleDelete = (id) => {
    const ok = window.confirm("이 루틴을 삭제할까요?");
    if (!ok) return;
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleActive = (id) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active, pauseUntil: !r.active ? "" : r.pauseUntil } : r))
    );
  };

  const markPauseUntilTomorrow = (id) => {
    const t = todayYmd();
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, active: false, pauseUntil: t }
          : r
      )
    );
  };

  return (
    <div className="screen routine-list-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">루틴 관리</h1>
          <p className="text-muted font-small">
            간단 루틴(이름+시간)과 상세 루틴(반복/목표/알림/일시중지)을 관리합니다.
          </p>
        </div>
        <button className="btn btn--primary" type="button" onClick={openCreateModal}>
          + 새 루틴 추가
        </button>
      </div>

      {/* 필터 */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="routine-filter" style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 140px 160px", gap: 8 }}>
            <input
              type="text"
              className="routineCreateModal__input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색: 이름/아이콘/카테고리"
            />
            <select
              className="routineCreateModal__input"
              value={filterCategoryId}
              onChange={(e) => setFilterCategoryId(e.target.value)}
            >
              {categoryOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              className="routineCreateModal__input"
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="paused">중지</option>
            </select>
            <select
              className="routineCreateModal__input"
              value={filterSchedule}
              onChange={(e) => setFilterSchedule(e.target.value)}
            >
              <option value="all">전체 반복</option>
              {SCHEDULE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-muted font-small">
            총 {filteredRoutines.length}개
          </div>
        </div>
      </div>

      <div className="card">
        <table className="routine-table">
          <thead>
            <tr>
              <th>루틴</th>
              <th>반복</th>
              <th>목표</th>
              <th>알림</th>
              <th>상태</th>
              <th style={{ width: 220 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutines.map((r) => {
              const remindersText =
                r.notify && Array.isArray(r.reminders) && r.reminders.length > 0
                  ? r.reminders
                      .slice()
                      .sort((a, b) => Number(String(b).replace("m", "")) - Number(String(a).replace("m", "")))
                      .join(", ")
                  : "-";
              return (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span aria-hidden="true">{r.icon}</span>
                      <div style={{ display: "grid" }}>
                        <div style={{ fontWeight: 600 }}>{r.name}</div>
                        <div className="text-muted font-small">
                          {r.categoryId}
                          {r.pauseUntil ? ` · 중지(~${r.pauseUntil})` : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{scheduleSummary(r)}</td>
                  <td>{goalSummary(r)}</td>
                  <td>{remindersText}</td>
                  <td>{r.active ? "활성" : "중지"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button className="btn btn--sm" type="button" onClick={() => openEditModal(r)}>
                        수정
                      </button>
                      <button className="btn btn--sm btn--ghost" type="button" onClick={() => toggleActive(r.id)}>
                        {r.active ? "일시중지" : "재개"}
                      </button>
                      <button className="btn btn--sm btn--ghost" type="button" onClick={() => markPauseUntilTomorrow(r.id)}>
                        오늘만 중지
                      </button>
                      <button className="btn btn--sm btn--danger" type="button" onClick={() => handleDelete(r.id)}>
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredRoutines.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-muted font-small" style={{ padding: 16 }}>
                  조건에 맞는 루틴이 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* 생성/수정 모달 */}
      <Modal
        open={modalOpen}
        title={editingId == null ? "새 루틴 추가" : "루틴 수정"}
        onClose={closeModal}
        footer={
          <>
            <button className="btn btn--ghost btn--sm" type="button" onClick={closeModal}>
              취소
            </button>
            <button
              className="btn btn--primary btn--sm"
              type="button"
              onClick={handleSave}
              disabled={!valid}
              aria-disabled={!valid}
            >
              저장
            </button>
          </>
        }
      >
        <div className="routineCreateModal">
          {/* 탭 */}
          <div className="routineCreateModal__tabs" role="tablist" aria-label="루틴 생성/수정 모드">
            <button
              type="button"
              role="tab"
              className={"routineCreateModal__tab " + (mode === "quick" ? "is-active" : "")}
              aria-selected={mode === "quick"}
              onClick={() => setMode("quick")}
              disabled={editingId != null} // 수정 중에는 상세 고정
              aria-disabled={editingId != null}
              title={editingId != null ? "수정은 상세 모드에서만 가능합니다." : undefined}
            >
              간단
            </button>
            <button
              type="button"
              role="tab"
              className={"routineCreateModal__tab " + (mode === "detail" ? "is-active" : "")}
              aria-selected={mode === "detail"}
              onClick={() => setMode("detail")}
            >
              상세
            </button>
          </div>

          {/* 공통: 이름 */}
          <div className="routineCreateModal__field">
            <label className="routineCreateModal__label">루틴 이름</label>
            <input
              type="text"
              className="routineCreateModal__input"
              value={draft.name}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              placeholder="예) 아침 스트레칭"
              autoFocus
            />
          </div>

          {/* 간단 */}
          {mode === "quick" ? (
            <div className="routineCreateModal__grid2">
              <div className="routineCreateModal__field">
                <label className="routineCreateModal__label">시간</label>
                <input
                  type="time"
                  className="routineCreateModal__input"
                  value={draft.time}
                  onChange={(e) => setDraft((p) => ({ ...p, time: e.target.value }))}
                />
              </div>
              <div className="routineCreateModal__hint">
                간단 모드는 이름+시간만 저장합니다. (반복/목표/알림은 상세에서 설정)
              </div>
            </div>
          ) : (
            <>
              {/* 상세: 기본 */}
              <div className="routineCreateModal__grid2">
                <div className="routineCreateModal__field">
                  <label className="routineCreateModal__label">아이콘</label>
                  <input
                    type="text"
                    className="routineCreateModal__input"
                    value={draft.icon}
                    onChange={(e) => setDraft((p) => ({ ...p, icon: e.target.value }))}
                    placeholder="예) ✨"
                  />
                </div>

                <div className="routineCreateModal__field">
                  <label className="routineCreateModal__label">카테고리</label>
                  <select
                    className="routineCreateModal__input"
                    value={draft.categoryId}
                    onChange={(e) => setDraft((p) => ({ ...p, categoryId: e.target.value }))}
                  >
                    {categoryOptions
                      .filter((o) => o.value !== "all")
                      .map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* 상세: 반복 */}
              <div className="routineCreateModal__grid2">
                <div className="routineCreateModal__field">
                  <label className="routineCreateModal__label">반복 유형</label>
                  <select
                    className="routineCreateModal__input"
                    value={draft.scheduleType}
                    onChange={(e) => setDraft((p) => ({ ...p, scheduleType: e.target.value }))}
                  >
                    {SCHEDULE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="routineCreateModal__field">
                  <label className="routineCreateModal__label">대표 시간</label>
                  <input
                    type="time"
                    className="routineCreateModal__input"
                    value={draft.time}
                    onChange={(e) => setDraft((p) => ({ ...p, time: e.target.value }))}
                    disabled={draft.scheduleType === "anytime"}
                  />
                  {draft.scheduleType === "anytime" ? (
                    <div className="text-muted font-small" style={{ marginTop: 6 }}>
                      “언제든” 루틴은 시간 없이 체크/기록합니다.
                    </div>
                  ) : null}
                </div>
              </div>

              {draft.scheduleType === "weekly" ? (
                <div className="routineCreateModal__field">
                  <label className="routineCreateModal__label">반복 요일</label>
                  <div className="routineCreateModal__weekdays">
                    {WEEK_DAYS.map((d) => {
                      const active = (draft.days || []).includes(d.value);
                      return (
                        <button
                          key={d.value}
                          type="button"
                          className={"routineCreateModal__day " + (active ? "is-active" : "")}
                          onClick={() => toggleDay(d.value)}
                          aria-pressed={active}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {draft.scheduleType === "interval" ? (
                <div className="routineCreateModal__field">
                  <label className="routineCreateModal__label">간격(일)</label>
                  <input
                    type="number"
                    min="1"
                    className="routineCreateModal__input"
                    value={draft.intervalDays}
                    onChange={(e) => setDraft((p) => ({ ...p, intervalDays: e.target.value }))}
                    placeholder="예) 2"
                  />
                </div>
              ) : null}

              {/* 상세: 목표 */}
              <div className="routineCreateModal__grid2">
                <div className="routineCreateModal__field">
                  <label className="routineCreateModal__label">목표 타입</label>
                  <select
                    className="routineCreateModal__input"
                    value={draft.goalType}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        goalType: e.target.value,
                        goalValue: e.target.value === "check" ? 1 : p.goalValue,
                      }))
                    }
                  >
                    {GOAL_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="routineCreateModal__field">
                  <label className="routineCreateModal__label">목표 값</label>
                  <input
                    type="number"
                    min="1"
                    className="routineCreateModal__input"
                    value={draft.goalValue}
                    onChange={(e) => setDraft((p) => ({ ...p, goalValue: e.target.value }))}
                    disabled={draft.goalType === "check"}
                    placeholder={draft.goalType === "count" ? "예) 3" : "예) 20"}
                  />
                  {draft.goalType === "check" ? (
                    <div className="text-muted font-small" style={{ marginTop: 6 }}>
                      체크형은 1회 완료로 처리됩니다.
                    </div>
                  ) : null}
                </div>
              </div>

              {/* 상세: 알림 */}
              <div className="routineCreateModal__field">
                <label className="routineCreateModal__label">알림</label>
                <div className="routineCreateModal__row">
                  <label className="routineCreateModal__check">
                    <input
                      type="checkbox"
                      checked={draft.notify}
                      onChange={(e) => setDraft((p) => ({ ...p, notify: e.target.checked }))}
                    />
                    <span>사용</span>
                  </label>
                  <span className="text-muted font-small">
                    다중 알림(스누즈)은 MVP에서 체크박스로만 구성
                  </span>
                </div>

                {draft.notify ? (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                    {REMINDER_OPTIONS.map((o) => {
                      const checked = (draft.reminders || []).includes(o.value);
                      return (
                        <label key={o.value} className="routineCreateModal__check">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleReminder(o.value)}
                          />
                          <span>{o.label}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-muted font-small" style={{ marginTop: 6 }}>
                    알림을 끄면 루틴 시간 알림이 발송되지 않습니다.
                  </div>
                )}
              </div>

              {/* 상세: 활성/일시중지 */}
              <div className="routineCreateModal__grid2">
                <div className="routineCreateModal__field">
                  <label className="routineCreateModal__label">활성 여부</label>
                  <label className="routineCreateModal__check">
                    <input
                      type="checkbox"
                      checked={draft.active}
                      onChange={(e) => setDraft((p) => ({ ...p, active: e.target.checked }))}
                    />
                    <span>활성</span>
                  </label>
                </div>

                <div className="routineCreateModal__field">
                  <label className="routineCreateModal__label">중지(선택)</label>
                  <input
                    type="date"
                    className="routineCreateModal__input"
                    value={draft.pauseUntil}
                    onChange={(e) => setDraft((p) => ({ ...p, pauseUntil: e.target.value }))}
                    placeholder="YYYY-MM-DD"
                  />
                  <div className="text-muted font-small" style={{ marginTop: 6 }}>
                    값이 있으면 목록에 “중지(~날짜)”로 표시됩니다. (정책/동작은 추후 API에서 확정)
                  </div>
                </div>
              </div>
            </>
          )}

          {!valid ? (
            <div className="text-muted font-small" style={{ marginTop: 10 }}>
              입력을 확인하세요: 이름 필수, 반복/목표 조건을 만족해야 저장됩니다.
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
