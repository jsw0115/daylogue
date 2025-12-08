// FILE: src/main/frontend/src/components/dashboard/StatValue.jsx
import React from "react";
import "../../styles/components.css";

/**
 * 공통 지표 카드 숫자 컴포넌트
 *
 * - label: 지표 이름
 * - value: 값 (숫자/문자 모두 허용)
 * - unit : 단위 (예: %, h, 개 등)
 * - trend: { direction: "up" | "down", text: string }
 */
function StatValue({ label, value, unit, trend }) {
  const trendClass =
    trend && trend.direction === "up"
      ? "stat-value__trend stat-value__trend--up"
      : trend && trend.direction === "down"
      ? "stat-value__trend stat-value__trend--down"
      : "";

  return (
    <div className="stat-value">
      <div className="stat-value__label">{label}</div>
      <div className="stat-value__main">
        <span className="stat-value__number">{value}</span>
        {unit && <span className="stat-value__unit">{unit}</span>}
      </div>
      {trend && (
        <div className={trendClass}>
          {trend.direction === "up" ? "▲" : "▼"} {trend.text}
        </div>
      )}
    </div>
  );
}

export default StatValue;
