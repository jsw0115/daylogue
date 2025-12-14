// src/screens/home/portlets/StatsSummaryPortlet.jsx
import React from "react";

export default function StatsSummaryPortlet() {
  // TODO: 나중에 API 연동
  const items = [
    { label: "PLAN 달성률", value: "85%" },
    { label: "ACTION 완료율", value: "60%" },
    { label: "DIARY 작성률", value: "95%" },
  ];

  return (
    <div className="portlet">
      <div className="stat-row">
        {items.map((it) => (
          <div key={it.label} className="stat-card">
            <div className="stat-label">{it.label}</div>
            <div className="stat-value">{it.value}</div>
          </div>
        ))}
      </div>
      <div className="portlet-hint">여기는 이후 /api/stats 연동 포인트.</div>
    </div>
  );
}
