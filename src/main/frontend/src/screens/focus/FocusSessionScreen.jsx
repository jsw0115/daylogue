// src/screens/focus/FocusSessionScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/common/Button";
import "../../styles/screens/focus.css";

function FocusSessionScreen() {
  return (
    <div className="screen focus-session-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">포커스 모드</h2>
          <p className="screen-header__subtitle">
            방해 요소를 줄이고, 한 번에 한 가지 일에만 집중해 보세요.
          </p>
        </div>
      </header>

      <div className="focus-grid">
        <DashboardCard title="집중 타이머" subtitle="예: 25분 집중 + 5분 휴식">
          <div className="focus-timer-main">
            <div className="focus-timer-circle">25:00</div>
            <Button className="btn--primary">시작</Button>
          </div>
        </DashboardCard>

        <DashboardCard title="최근 세션" subtitle="오늘의 집중 기록">
          <ul className="home-list">
            <li>📚 공부 · 25분</li>
            <li>🧠 딥워크 · 40분</li>
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
}

export default FocusSessionScreen;
