// src/main/frontend/src/screens/event/DdayListScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/event.css";

function DdayListScreen() {
  const ddayList = [
    { id: 1, title: "SQLD 시험", targetDate: "2025-04-01", dday: "D-15" },
    { id: 2, title: "친구 결혼식", targetDate: "2025-05-20", dday: "D-64" },
  ];

  return (
    <AppShell title="D-Day 목록">
      <div className="screen dday-list-screen">
        <header className="screen-header">
          <h2>D-Day 전용 목록</h2>
        </header>

        <section className="dday-list">
          {ddayList && ddayList.map((d) => (
            <div key={d.id} className="dday-item">
              <div className="dday-item__title">{d.title}</div>
              <div className="dday-item__meta">
                <span className="dday-item__date">{d.targetDate}</span>
                <span className="dday-item__badge">{d.dday}</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default DdayListScreen;

