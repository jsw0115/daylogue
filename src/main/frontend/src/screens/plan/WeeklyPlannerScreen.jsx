// src/screens/plan/WeeklyPlannerScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import WeeklyTimeBricks from "../../components/planner/WeeklyTimeBricks";
import "../../styles/screens/planner.css";

function WeeklyPlannerScreen() {
  return (
    <div className="screen weekly-planner-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">주간 플래너</h2>
          <p className="screen-header__subtitle">
            한 주 동안의 목표와 시간 사용 패턴을 한 눈에 볼 수 있어요.
          </p>
        </div>
      </header>

      <div className="weekly-grid">
        <DashboardCard title="주간 타임브릭" subtitle="요일별 색 막대">
          <WeeklyTimeBricks />
        </DashboardCard>

        <DashboardCard title="이번 주 목표" subtitle="3~5개 정도가 적당해요.">
          <ul className="home-list">
            <li>SQLD 모의고사 2회 풀기</li>
            <li>운동 3회 이상 하기</li>
            <li>업무 프로젝트 A 마감 준비</li>
          </ul>
        </DashboardCard>

        <DashboardCard title="주간 회고" subtitle="일요일에 한번 정리해 보세요.">
          <textarea
            className="home-oneline"
            placeholder="이번 주를 한 문장으로 요약해 보세요."
          />
        </DashboardCard>
      </div>
    </div>
  );
}

export default WeeklyPlannerScreen;
