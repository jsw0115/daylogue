// src/main/frontend/src/components/dashboard/StatValue.jsx
import React from "react";
import "../../styles/components.css";

function StatValue({ label, value, unit, trend }) {
  return (
    <div className="stat-value">
      <div className="stat-value__label">{label}</div>
      <div className="stat-value__main">
        <span className="stat-value__number">{value}</span>
        {unit && <span className="stat-value__unit">{unit}</span>}
      </div>
      {trend && (
        <div className
        ={
            trend.direction === "up"
              ? "stat-value__trend stat-value__trend--up"
              : "stat-value__trend stat-value__trend--down"
          }
        >
          {trend.direction === "up" ? "▲" : "▼"} {trend.text}
        </div>
      )}
    </div>
  );
}

export default StatValue;

