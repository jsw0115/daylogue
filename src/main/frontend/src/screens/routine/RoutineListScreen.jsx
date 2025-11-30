// src/screens/routine/RoutineListScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/common/Button";
import "../../styles/screens/routine.css";

const SAMPLE_ROUTINES = [
  { id: 1, name: "아침 스트레칭", days: "월~금", time: "07:30", active: true },
  { id: 2, name: "영단어 20개", days: "매일", time: "22:00", active: true },
];

function RoutineListScreen() {
  return (
    <div className="screen routine-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">루틴</h2>
          <p className="screen-header__subtitle">
            자주 반복되는 일을 루틴으로 만들어 자동으로 관리해요.
          </p>
        </div>
        <Button className="btn--primary">+ 새 루틴</Button>
      </header>

      <div className="routine-list-grid">
        <DashboardCard title="루틴 목록" subtitle="활성화 여부를 설정할 수 있어요.">
          <table className="routine-table">
            <thead>
              <tr>
                <th>루틴</th>
                <th>요일</th>
                <th>시간</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ROUTINES && SAMPLE_ROUTINES.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.days}</td>
                  <td>{r.time}</td>
                  <td>{r.active ? "활성" : "중지"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard>

        <DashboardCard title="선택된 루틴" subtitle="우측에서 세부 설정">
          <div className="routine-edit-form">
            {/* 나중에 실제 입력 폼으로 교체 */}
            <p style={{ fontSize: 13, color: "var(--color-muted)" }}>
              왼쪽에서 루틴을 선택하면 세부 설정을 여기에 표시합니다.
            </p>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

export default RoutineListScreen;
