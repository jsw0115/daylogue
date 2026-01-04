
// FILE: src/main/frontend/src/screens/portlets/UpcomingEventsPortlet.jsx
import React, { useMemo } from "react";

function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function UpcomingEvents7dPortlet() {
  // TODO: /api/events?from=...&to=... 로 바꾸면 됨
  const items = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      return { date: fmt(d), title: i === 0 ? "오늘 일정 없음" : "예시 일정", time: i === 0 ? "" : "10:00" };
    });
  }, []);

  return (
    <div className="upcoming">
      {items.map((it) => (
        <div className="upcoming__row" key={it.date}>
          <div className="upcoming__date">{it.date}</div>
          <div className="upcoming__main">
            <div className="upcoming__title">{it.title}</div>
            {it.time && <div className="upcoming__time">{it.time}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
