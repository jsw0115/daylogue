// src/screens/plan/DailyPlannerScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import TimebarTimeline from "../../components/planner/TimebarTimeline";
import WeeklyTimeBricks from "../../components/planner/WeeklyTimeBricks";
import "../../styles/screens/planner.css";

function DailyPlannerScreen() {
  return (
    <div className="screen daily-planner-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">일간 플래너</h2>
          <p className="screen-header__subtitle">
            오늘의 계획과 실제 사용한 시간을 타임바로 비교해 보세요.
          </p>
        </div>
      </header>

      <div className="planner-layout">
        <DashboardCard
          title="타임바 · 계획 vs 실제"
          subtitle="드래그하여 시간블록을 추가하거나 수정할 수 있어요."
        >
          <TimebarTimeline />
        </DashboardCard>

        <div className="planner-layout__right">
          <DashboardCard title="오늘의 주요 목표" subtitle="최대 3개 추천">
            <ul className="home-list">
              <li>📚 SQLD 요약 노트 정리</li>
              <li>🏃 30분 운동 또는 산책</li>
              <li>🧠 집중 세션 2회 이상</li>
            </ul>
          </DashboardCard>

          <DashboardCard title="오늘의 루틴" subtitle="체크해서 완료 표시">
            <WeeklyTimeBricks compact />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

export default DailyPlannerScreen;
