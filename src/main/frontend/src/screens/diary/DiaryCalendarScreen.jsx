// src/main/frontend/src/screens/diary/DiaryCalendarScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/diary.css";

function DiaryCalendarScreen() {
  const days = Array.from({ length: 30 }).map((_, i) => ({
    date: `2025-03-${String(i + 1).padStart(2, "0")}`,
    hasEntry: [1, 2, 3, 5, 7, 10, 15, 21].includes(i + 1),
  }));

  return (
    <AppShell title="다이어리 캘린더">
      <div className="screen diary-calendar-screen">
        <header className="screen-header">
          <h2>2025년 3월</h2>
        </header>

        <section className="diary-calendar-grid">
          {days.map((d) => (
            <div key={d.date}
              className={
                d.hasEntry
                  ? "diary-calendar-day diary-calendar-day--filled"
                  : "diary-calendar-day"
              }
            >
              <span className="diary-calendar-day__date">
                {d.date.split("-")[2].replace(/^0/, "")}
              </span>
              {d.hasEntry && <span className="diary-calendar-day__dot" />}
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default DiaryCalendarScreen;

