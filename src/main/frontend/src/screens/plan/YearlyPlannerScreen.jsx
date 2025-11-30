// src/main/frontend/src/screens/plan/YearlyPlannerScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import DashboardCard from "../../components/dashboard/DashboardCard";
import "../../styles/screens/planner.css";

function YearlyPlannerScreen() {
  return (
    <AppShell title="연간 개요">
      <div className="screen yearly-planner-screen">
        <header className="screen-header">
          <h2>2025년 연간 개요</h2>
        </header>

        <div className="yearly-grid">
          <DashboardCard title="연간 목표">
            <textarea placeholder="연말에 돌아봤을 때 이루고 싶은 것들" />
          </DashboardCard>
          <DashboardCard title="큰 이벤트 / 시험 / 기념일">
            <ul>
              <li>03월 SQLD 시험</li>
              <li>05월 친구 결혼식</li>
              <li>09월 프로젝트 런칭</li>
            </ul>
          </DashboardCard>
          <DashboardCard title="연간 통계(요약)">
            <p>· 공부 시간: 320h</p>
            <p>· 포커스 세션: 450회</p>
          </DashboardCard>
        </div>
      </div>
    </AppShell>
  );
}

export default YearlyPlannerScreen;
