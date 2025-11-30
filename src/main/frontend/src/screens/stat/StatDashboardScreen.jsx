// src/screens/stat/StatDashboardScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatValue from "../../components/dashboard/StatValue";
import "../../styles/screens/stat.css";

function StatDashboardScreen() {
  return (
    <div className="screen stat-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">통합 통계</h2>
          <p className="screen-header__subtitle">
            일정, 할 일, 루틴, 다이어리 기록을 한 번에 요약해서 보여줘요.
          </p>
        </div>
      </header>

      <div className="stat-grid">
        <DashboardCard title="지난 7일 요약" subtitle="완료한 할 일 / 루틴 / 일기">
          <StatValue label="완료한 할 일" value={42} unit="개" />
          <StatValue label="루틴 달성률" value={76} unit="%" />
          <StatValue label="일기 작성일" value={5} unit="/ 7일" />
        </DashboardCard>

        <DashboardCard title="오늘의 집중 시간" subtitle="포커스 타이머 기준">
          <StatValue label="공부" value={120} unit="분" />
          <StatValue label="업무" value={180} unit="분" />
        </DashboardCard>
      </div>
    </div>
  );
}

export default StatDashboardScreen;
