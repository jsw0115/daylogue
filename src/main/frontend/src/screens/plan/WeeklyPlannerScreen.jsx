// src/screens/plan/WeeklyPlannerScreen.jsx
import React from "react";

const days = ["월", "화", "수", "목", "금", "토", "일"];

function WeeklyPlannerScreen() {
  return (
    <div className="screen weekly-planner-screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">주간 플래너</h1>
          <p className="screen-header__subtitle">
            한 주의 목표, 일정, 할 일을 한 눈에 봅니다.
          </p>
        </div>
      </div>

      <div className="weekly-grid">
        {days.map((d) => (
          <section key={d} className="dashboard-card">
            <div className="dashboard-card__header">
              <h2 className="dashboard-card__title">{d}요일</h2>
            </div>
            <ul className="simple-list">
              <li>• 주요 일정</li>
              <li>• 할 일</li>
              <li>• 루틴</li>
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export default WeeklyPlannerScreen;
