// src/main/frontend/src/components/planner/WeeklyTimeBricks.jsx
import React from "react";
import "../../styles/components.css";

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

function WeeklyTimeBricks({ week }) {
  // week: [{ day:'2025-03-17', segments:[{categoryId,color,ratio}] }]
  return (
    <div className="weekly-bricks">
      {week && week.map((day, idx) => (
        <div key={day.day || idx} className="weekly-bricks__row">
          <div className="weekly-bricks__label">
            {DAY_LABELS[idx]}{" "}
            {day.day ? day.day.split("-")[2].replace(/^0/, "") : ""}
          </div>
          <div className="weekly-bricks__bar">
            {day.segments && day.segments.map((seg, i) => (
              <span key={i}
                className="weekly-bricks__segment"
                style={{
                  width: `${Math.max(seg.ratio * 100, 5)}%`,
                  backgroundColor: seg.color,
                }}
                title={seg.label}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WeeklyTimeBricks;

