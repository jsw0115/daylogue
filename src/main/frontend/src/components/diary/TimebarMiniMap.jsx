// src/main/frontend/src/components/diary/TimebarMinMap.jsx
import React from "react";
import "../../styles/components.css";

function TimebarMinMap({ blocks }) {
  return (
    <div className="timebar-mini">
      {blocks && blocks.map((block) => {
        const startH = parseInt(block.start.split(":")[0], 10);
        const endH = parseInt(block.end.split(":")[0], 10);
        const startPercent = (startH / 24) * 100;
        const widthPercent = Math.max(((endH - startH) / 24) * 100, 2);

        return (
          <div key={block.id}
            className="timebar-mini__segment"
            style={{
              left: `${startPercent}%`,
              width: `${widthPercent}%`,
            }}
          />
        );
      })}
    </div>
  );
}

export default TimebarMinMap;

