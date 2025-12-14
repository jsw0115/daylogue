// src/screens/routine/RoutineListScreen.jsx
import React, { useMemo, useState } from "react";
import "../../styles/screens/routine.css";
import Modal from "../../components/common/Modal";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

const initialRoutines = [
  { id: 1, name: "아침 스트레칭", type: "daily", time: "07:00" },
  { id: 2, name: "SQLD 공부", type: "weekly", time: "21:00" },
];

const WEEK_DAYS = [
  { value: "mon", label: "월" },
  { value: "tue", label: "화" },
  { value: "wed", label: "수" },
  { value: "thu", label: "목" },
  { value: "fri", label: "금" },
  { value: "sat", label: "토" },
  { value: "sun", label: "일" },
];

function makeDefaultDraft() {
  return {
    name: "",
    time: "07:00",
    // 상세 옵션 (MVP 포함 요청 반영)
    icon: "✨",
    categoryId: (DEFAULT_CATEGORIES?.[0]?.id) || "health",
    notify: true,
    beforeMinutes: "10m",
    days: ["mon", "tue", "wed", "thu", "fri"],
  };
}

export default function RoutineListScreen() {
  const [routines, setRoutines] = useState(initialRoutines);
  const [modalOpen, setModalOpen] = useState(false);

  // quick | detail (UI 탭)
  const [mode, setMode] = useState("quick");
  const [draft, setDraft] = useState(() => makeDefaultDraft());

  const categoryOptions = useMemo(() => {
    const list = Array.isArray(DEFAULT_CATEGORIES) ? DEFAULT_CATEGORIES : [];
    return list.map((c) => ({ value: c.id, label: c.name }));
  }, []);

  const openModal = () => {
    setMode("quick");
    setDraft(makeDefaultDraft());
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const isValid = draft.name.trim().length > 0;

  const toggleDay = (value) => {
    setDraft((prev) => {
      const has = prev.days.includes(value);
      const nextDays = has ? prev.days.filter((d) => d !== value) : [...prev.days, value];
      return { ...prev, days: nextDays };
    });
  };

  const handleCreate = () => {
    if (!isValid) return;

    const payload = {
      id: Date.now(),
      name: draft.name.trim(),
      time: draft.time,
      // 목록 표시에 쓰는 기존 type 유지
      type: mode === "quick" ? "daily" : "weekly",
      // 상세 옵션은 추후 API 붙일 때 사용
      meta:
        mode === "detail"
          ? {
              icon: draft.icon,
              categoryId: draft.categoryId,
              notify: draft.notify,
              beforeMinutes: draft.beforeMinutes,
              days: draft.days,
            }
          : null,
    };

    setRoutines((prev) => [...prev, payload]);
    closeModal();
  };

  return (
    <div className="screen routine-list-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">루틴 관리</h1>
          <p className="text-muted font-small">
            간편 루틴(시간+제목)과 상세 루틴(요일/카테고리/알림)을 관리합니다.
          </p>
        </div>
        <button className="btn btn--primary" type="button" onClick={openModal}>
          + 새 루틴 추가
        </button>
      </div>

      <div className="card">
        <table className="routine-table">
          <thead>
            <tr>
              <th>루틴 이름</th>
              <th>유형</th>
              <th>시간</th>
            </tr>
          </thead>
          <tbody>
            {routines.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.type === "daily" ? "매일" : "주간"}</td>
                <td>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 새 루틴 추가 모달 */}
      <Modal
        open={modalOpen}
        title="새 루틴 추가"
        onClose={closeModal}
        footer={
          <>
            <button className="btn btn--ghost btn--sm" type="button" onClick={closeModal}>
              취소
            </button>
            <button
              className="btn btn--primary btn--sm"
              type="button"
              onClick={handleCreate}
              disabled={!isValid}
              aria-disabled={!isValid}
            >
              저장
            </button>
          </>
        }
      >
        <div className="routineCreateModal">
          {/* 탭 */}
          <div className="routineCreateModal__tabs" role="tablist" aria-label="루틴 생성 모드">
            <button
              type="button"
              role="tab"
              className={"routineCreateModal__tab " + (mode === "quick" ? "is-active" : "")}
              aria-selected={mode === "quick"}
              onClick={() => setMode("quick")}
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

          {/* 공통: 시간 */}
          <div className="routineCreateModal__grid2">
            <div className="routineCreateModal__field">
              <label className="routineCreateModal__label">대표 시간</label>
              <input
                type="time"
                className="routineCreateModal__input"
                value={draft.time}
                onChange={(e) => setDraft((p) => ({ ...p, time: e.target.value }))}
              />
            </div>

            {mode === "detail" ? (
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

                  <select
                    className="routineCreateModal__input"
                    value={draft.beforeMinutes}
                    onChange={(e) => setDraft((p) => ({ ...p, beforeMinutes: e.target.value }))}
                    disabled={!draft.notify}
                  >
                    <option value="0m">정시</option>
                    <option value="5m">5분 전</option>
                    <option value="10m">10분 전</option>
                    <option value="30m">30분 전</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="routineCreateModal__hint">
                간단 모드는 이름+시간만 저장합니다.
              </div>
            )}
          </div>

          {/* 상세 옵션 */}
          {mode === "detail" && (
            <>
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
                    {categoryOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="routineCreateModal__field">
                <label className="routineCreateModal__label">반복 요일</label>
                <div className="routineCreateModal__weekdays">
                  {WEEK_DAYS.map((d) => {
                    const active = draft.days.includes(d.value);
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
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
