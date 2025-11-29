// src/main/frontend/src/screens/routine/RoutineListScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/routine.css";

function RoutineListScreen() {
  const routines = [
    { id: 1, name: "아침 스트레칭", days: "월~금", time: "06:30" },
    { id: 2, name: "SQLD 공부", days: "월·수·금", time: "21:00" },
  ];

  return (
    <AppShell title="루틴 목록">
      <div className="screen routine-list-screen">
        <header className="screen-header">
          <h2>루틴 목록</h2>
          <button className="primary-button">+ 새 루틴</button>
        </header>

        <section className="routine-list">
          {routines.map((r) => (
            <div key={r.id} className="routine-item">
              <div className="routine-item__main">
                <strong>{r.name}</strong>
                <span className="routine-item__days">{r.days}</span>
              </div>
              <div className="routine-item__time">{r.time}</div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default RoutineListScreen;

