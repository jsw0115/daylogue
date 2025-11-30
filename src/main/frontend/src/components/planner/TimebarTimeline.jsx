// src/main/frontend/src/components/planner/TimebarTimeline.jsx
import React from "react";
import "../../styles/components.css";

const HOURS = Array.from({ length: 18 }).map((_, i) => 6 + i); // 6~23

function TimebarTimeline({ date, blocks, viewport, onBlockClick }) {
  const isCompact = viewport === "mobile";

  const containerClass =
    viewport === "desktop"
      ? "timebar timebar--desktop"
      : viewport === "tablet"
      ? "timebar timebar--tablet"
      : "timebar timebar--mobile";

  return (
    <div className={containerClass} data-date={date}>
      <div className="timebar__column timebar__column--time">
        {HOURS && HOURS.map((h) => (
          <div key={h} className="timebar__time-label">
            {h.toString().padStart(2, "0")}:00
          </div>
        ))}
      </div>

      <div className="timebar__column timebar__column--blocks">
        {HOURS && HOURS.map((h) => (
          <div key={h} className="timebar__row">
            <div className="timebar__row-line" />
          </div>
        ))}

        {blocks && blocks.map((block) => {
          const startHour = parseInt(block.start.split(":")[0], 10);
          const endHour = parseInt(block.end.split(":")[0], 10);
          const top = (startHour - 6) * 48;
          const height = Math.max((endHour - startHour) * 48, 24);
          const isPlan = block.planOrActual === "plan";

          return (
            <div key={block.id}
              className={`timebar__block ${
                isPlan ? "timebar__block--plan" : "timebar__block--actual"
              }`}
              style={{
                top,
                height,
                left: isPlan ? "4%" : "10%",
                width: isCompact ? "86%" : "80%",
              }}
              onClick={() => onBlockClick && onBlockClick(block)}
            >
              <div className="timebar__block-header">
                <span className="timebar__block-category-dot" />
                <span className="timebar__block-category">
                  {block.categoryId.toUpperCase()}
                </span>
              </div>
              <div className="timebar__block-title">{block.title}</div>
              <div className="timebar__block-time">
                {block.start} ~ {block.end}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimebarTimeline;

