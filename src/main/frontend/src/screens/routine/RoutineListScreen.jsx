import React, { useState } from "react";
import "../../styles/screens/routine.css";
import Modal from "../../components/common/Modal";

const initialRoutines = [
  { id: 1, name: "아침 스트레칭", type: "daily", time: "07:00" },
  { id: 2, name: "SQLD 공부", type: "weekly", time: "21:00" },
];

const RoutineListScreen = () => {
  const [routines, setRoutines] = useState(initialRoutines);
  const [modalOpen, setModalOpen] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    name: "",
    type: "daily",
    time: "07:00",
  });

  const handleCreate = () => {
    if (!newRoutine.name.trim()) return;
    setRoutines((prev) => [
      ...prev,
      { id: Date.now(), ...newRoutine, name: newRoutine.name.trim() },
    ]);
    setNewRoutine({ name: "", type: "daily", time: "07:00" });
    setModalOpen(false);
    // TODO: backend POST /api/routines
  };

  return (
    <div className="screen routine-list-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">루틴 관리</h1>
          <p className="text-muted font-small">
            간편 루틴(시간+제목)과 상세 루틴(조건/반복/알림)을 관리합니다.
          </p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => setModalOpen(true)}
        >
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

      {/* 새 루틴 추가 모달 (간편/상세 탭) */}
      <Modal
        open={modalOpen}
        title="새 루틴 추가"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              취소
            </button>
            <button
              className="btn btn--primary btn--sm"
              type="button"
              onClick={handleCreate}
            >
              저장
            </button>
          </>
        }
      >
        <div className="form-row">
          <label className="form-label">루틴 이름</label>
          <input
            type="text"
            className="form-input"
            value={newRoutine.name}
            onChange={(e) =>
              setNewRoutine((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="예) 아침 스트레칭"
          />
        </div>

        <div className="form-row form-row--inline">
          <div>
            <label className="form-label">유형</label>
            <select
              className="form-input"
              value={newRoutine.type}
              onChange={(e) =>
                setNewRoutine((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option value="daily">간편(매일)</option>
              <option value="weekly">상세(요일 선택)</option>
            </select>
          </div>
          <div>
            <label className="form-label">대표 시간</label>
            <input
              type="time"
              className="form-input"
              value={newRoutine.time}
              onChange={(e) =>
                setNewRoutine((prev) => ({ ...prev, time: e.target.value }))
              }
            />
          </div>
        </div>

        {/* 상세 루틴 옵션 (요일/알림) – type이 weekly일 때만 */}
        {newRoutine.type === "weekly" && (
          <div className="form-row">
            <label className="form-label">반복 요일</label>
            <div className="routine-weekdays">
              {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
                <button
                  key={d}
                  type="button"
                  className="btn btn--ghost btn--sm"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoutineListScreen;
