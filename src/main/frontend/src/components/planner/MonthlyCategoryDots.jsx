// src/main/frontend/src/components/planner/MonthlyCategoryDots.jsx
import React from "react";
import "../../styles/components.css";

function MonthlyCategoryDots({ days }) {
  // days: [{ date:'2025-03-01', topCategoryId:'study', color:'#4F8BFF', label:'공부' }, ...]
  return (
    <div className="month-dots">
      {days.map((day) => (
        <div key={day.date} className="month-dots__day">
          <span className="month-dots__date">
            {day.date.split("-")[2].replace(/^0/, "")}
          </span>
          {day.color && (
            <span className="month-dots__dot"
              style={{ backgroundColor: day.color }}
              title={day.label}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default MonthlyCategoryDots;

