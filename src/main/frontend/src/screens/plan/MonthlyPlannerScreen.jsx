// src/screens/plan/MonthlyPlannerScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import MonthlyCategoryDots from "../../components/planner/MonthlyCategoryDots";
import "../../styles/screens/planner.css";

function MonthlyPlannerScreen() {
  return (
    <div className="screen monthly-planner-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">월간 플래너</h2>
          <p className="screen-header__subtitle">
            이번 달 중요한 일정과 D-Day를 달력에서 관리해요.
          </p>
        </div>
      </header>

      <div className="monthly-grid">
        <DashboardCard title="월간 캘린더" subtitle="색 점으로 카테고리 표시">
          <MonthlyCategoryDots />
        </DashboardCard>

        <DashboardCard title="이번 달의 큰 일정" subtitle="시험, 프로젝트, 기념일 등">
          <ul className="home-list">
            <li>SQLD 시험 (D-7)</li>
            <li>회사 프로젝트 마감 (D-14)</li>
            <li>가족 모임 (D-21)</li>
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
}

export default MonthlyPlannerScreen;
