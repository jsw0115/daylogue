// src/screens/routine/RoutineManagementScreen.jsx
import React, { useMemo, useState } from "react";
import "../../styles/screens/routine.css";
import safeStorage from "../../shared/utils/safeStorage";
import RoutineFormModal from "../../components/routine/RoutineFormModal";

const STORAGE_KEY = "timebar.routines.v1";

function loadList() {
  const list = safeStorage.getJSON(STORAGE_KEY, []);
  return Array.isArray(list) ? list : [];
}

export default function RoutineManagementScreen() {
  const [tick, setTick] = useState(0);
  const reload = () => setTick((v) => v + 1);

  const routines = useMemo(() => {
    void tick;
    return loadList();
  }, [tick]);

  const [openQuick, setOpenQuick] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div className="screen routine-screen">
      <div className="routine-head">
        <div>
          <div className="screen-title">루틴 관리</div>
          <div className="screen-subtitle">간단 루틴(시간+제목)과 상세 루틴(요일/알림/아이콘/카테고리)을 관리합니다.</div>
        </div>

        <div className="routine-actions">
          <button type="button" className="btn btn--sm btn--primary" onClick={() => setOpenQuick(true)}>
            + 새 루틴(간단)
          </button>
          <button type="button" className="btn btn--sm btn--secondary" onClick={() => setOpenDetail(true)}>
            + 새 루틴(상세)
          </button>
        </div>
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
            {routines.length ? (
              routines.map((r) => (
                <tr key={r.id} className="routine-row" onClick={() => setEditing(r)} role="button">
                  <td>{r.icon ? `${r.icon} ` : ""}{r.name}</td>
                  <td>{r.type === "weekly" ? "주간" : "매일"}</td>
                  <td>{r.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-muted font-small">
                  등록된 루틴이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 모달 */}
      <RoutineFormModal
        open={openQuick}
        onClose={() => setOpenQuick(false)}
        mode="quick"
        onSaved={reload}
      />
      <RoutineFormModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        mode="detail"
        onSaved={reload}
      />
      <RoutineFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        mode="detail"
        initialRoutine={editing}
        onSaved={() => {
          setEditing(null);
          reload();
        }}
      />
    </div>
  );
}
