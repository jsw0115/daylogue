// src/screens/stat/StatPlanActualScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import "../../styles/screens/stat.css";

function StatPlanActualScreen() {
  return (
    <div className="screen stat-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">Plan vs Actual</h2>
          <p className="screen-header__subtitle">
            계획 대비 실제 수행 시간을 일/주/월 단위로 비교해요.
          </p>
        </div>
      </header>

      <div className="stat-grid">
        <DashboardCard title="그래프" subtitle="라인 또는 막대 그래프">
          <div style={{ height: 280 }} />
        </DashboardCard>

        <DashboardCard title="요약" subtitle="계획 대비 차이">
          <ul className="home-list">
            <li>이번 주 공부: 계획 10h vs 실제 8h (-2h)</li>
            <li>운동: 계획 3회 vs 실제 4회 (+1회)</li>
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
}

export default StatPlanActualScreen;
