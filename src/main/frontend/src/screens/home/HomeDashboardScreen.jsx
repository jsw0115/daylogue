// src/main/frontend/src/screens/home/HomeDashboardScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import DashboardCard from "../../components/dashboard/DashboardCard";
import "../../styles/screens/home.css";

function HomeDashboardScreen() {
  return (
    <AppShell title="오늘 요약">
      <div className="screen home-dashboard-screen">
        <header className="screen-header">
          <div className="screen-header__left">
            <h2>오늘의 Daylogue</h2>
          </div>
          <div className="screen-header__right">
            <button className="emoji-button">🙂</button>
          </div>
        </header>

        <div className="home-grid">
          <DashboardCard title="오늘 일정">
            <ul className="home-list">
              <li>09:00 팀 스크럼</li>
              <li>13:30 점심 약속</li>
              <li>21:00 SQLD 공부</li>
            </ul>
          </DashboardCard>

          <DashboardCard title="오늘 할 일">
            <ul className="home-list">
              <li>SQLD 1강 듣기</li>
              <li>업무 보고서 초안 작성</li>
            </ul>
          </DashboardCard>

          <DashboardCard title="D-Day">
            <ul className="home-list">
              <li>D-10 SQLD 시험</li>
              <li>D-30 친구 생일</li>
            </ul>
          </DashboardCard>

          <DashboardCard title="오늘 한 줄">
            <textarea className="home-oneline"
              placeholder="오늘은 이런 하루였어요..."
            />
          </DashboardCard>
        </div>
      </div>
    </AppShell>
  );
}

export default HomeDashboardScreen;

