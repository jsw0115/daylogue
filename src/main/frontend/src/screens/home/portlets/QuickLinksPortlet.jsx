import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuickLinksPortlet() {
  const go = useNavigate();
  const links = [
    { label: "일간 플래너", to: "/planner/daily" },
    { label: "주간 플래너", to: "/planner/weekly" },
    { label: "할 일", to: "/action/task" },
    { label: "통계", to: "/insight/stat" },
    { label: "데이터 관리", to: "/data" },
  ];

  return (
    <div className="quickLinks">
      <div className="quickLinks-row">
        {links.map((l) => (
          <button key={l.to} className="btn btn--sm" onClick={() => go(l.to)}>
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
