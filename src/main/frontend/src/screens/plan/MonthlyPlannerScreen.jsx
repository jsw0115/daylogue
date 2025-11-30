// src/screens/plan/MonthlyPlannerScreen.jsx
import React from "react";

function MonthlyPlannerScreen() {
  const weeks = [1, 2, 3, 4, 5];

  return (
    <div className="screen monthly-planner-screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">월간 플래너</h1>
          <p className="screen-header__subtitle">
            월간 캘린더와 주차별 주요 계획을 관리해요.
          </p>
        </div>
      </div>

      <div className="monthly-grid">
        {weeks.map((w) => (
          <section key={w} className="dashboard-card">
            <div className="dashboard-card__header">
              <h2 className="dashboard-card__title">{w}주차</h2>
            </div>
            <ul className="simple-list">
              <li>• 대표 일정 1</li>
              <li>• 대표 일정 2</li>
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export default MonthlyPlannerScreen;
