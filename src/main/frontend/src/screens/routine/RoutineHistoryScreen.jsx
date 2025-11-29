// src/main/frontend/src/screens/routine/RoutineHistoryScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/routine.css";

function RoutineHistoryScreen() {
  const history = [
    { date: "2025-03-10", name: "아침 스트레칭", done: true },
    { date: "2025-03-11", name: "아침 스트레칭", done: false },
    { date: "2025-03-12", name: "아침 스트레칭", done: true },
  ];

  return (
    <AppShell title="루틴 달성률/히스토리">
      <div className="screen routine-history-screen">
        <header className="screen-header">
          <h2>루틴 히스토리</h2>
        </header>

        <section className="routine-history-summary">
          <p>이번 주 평균 달성률: 78%</p>
        </section>

        <section className="routine-history-list">
          {history.map((h, idx) => (
            <div key={idx} className="routine-history-item">
              <span className="routine-history__date">{h.date}</span>
              <span className="routine-history__name">{h.name}</span>
              <span className="routine-history__status">
                {h.done ? "완료" : "미완료"}
              </span>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default RoutineHistoryScreen;

