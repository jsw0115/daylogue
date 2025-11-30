// src/screens/routine/RoutineHistoryScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import "../../styles/screens/routine.css";

function RoutineHistoryScreen() {
  return (
    <div className="screen routine-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">루틴 히스토리</h2>
          <p className="screen-header__subtitle">
            루틴을 얼마나 꾸준히 지켰는지 달력과 그래프로 확인해요.
          </p>
        </div>
      </header>

      <div className="routine-history-grid">
        <DashboardCard title="달력 뷰" subtitle="루틴 완료일 표시">
          {/* 나중에 캘린더 컴포넌트 연동 */}
          <div style={{ height: 260 }} />
        </DashboardCard>

        <DashboardCard title="달성률" subtitle="주/월 단위 통계">
          <div style={{ height: 260 }} />
        </DashboardCard>
      </div>
    </div>
  );
}

export default RoutineHistoryScreen;
