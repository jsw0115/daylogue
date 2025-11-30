// src/screens/plan/YearlyOverviewScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import "../../styles/screens/planner.css";

function YearlyOverviewScreen() {
  return (
    <div className="screen yearly-overview-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">연간 개요</h2>
          <p className="screen-header__subtitle">
            올해의 큰 목표와 주요 이벤트를 한 페이지에서 정리해요.
          </p>
        </div>
      </header>

      <div className="yearly-grid">
        <DashboardCard title="연간 목표" subtitle="3~5개의 큰 방향">
          <ul className="home-list">
            <li>데브/SQDL 자격증 취득</li>
            <li>건강 루틴 정착 (주 3회 이상 활동)</li>
            <li>개인 프로젝트(앱) 출시</li>
          </ul>
        </DashboardCard>

        <DashboardCard title="주요 이벤트" subtitle="시험, 여행, 프로젝트 마감 등">
          <ul className="home-list">
            <li>상반기 SQLD 시험</li>
            <li>하반기 여행 계획</li>
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
}

export default YearlyOverviewScreen;
