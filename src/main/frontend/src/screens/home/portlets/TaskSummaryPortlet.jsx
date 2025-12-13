import React, { useMemo } from "react";

export default function TaskSummaryPortlet() {
  // TODO: /api/tasks?date=YYYY-MM-DD 로 변경
  const tasks = useMemo(
    () => [
      { id: 1, title: "SQLD 1일 1문제", done: true, durationMin: 30 },
      { id: 2, title: "프로젝트 이슈 정리", done: false, durationMin: 40 },
    ],
    []
  );

  return (
    <div className="task-mini">
      {tasks.map((t) => (
        <div className="task-mini__row" key={t.id}>
          <div className={`chk ${t.done ? "is-done" : ""}`}>{t.done ? "✓" : ""}</div>
          <div className="task-mini__title">{t.title}</div>
          <div className="task-mini__meta">{t.durationMin}분</div>
        </div>
      ))}
    </div>
  );
}
