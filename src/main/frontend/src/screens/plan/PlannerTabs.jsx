// FILE: src/main/frontend/src/screens/plan/PlannerTabs.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { key: "daily", label: "일간", path: "/plan/daily" },
  { key: "weekly", label: "주간", path: "/plan/weekly" },
  { key: "monthly", label: "월간", path: "/plan/monthly" },
  { key: "yearly", label: "연간", path: "/plan/yearly" },
];

function PlannerTabs({ className = "" }) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeKey =
    TABS.find((tab) => location.pathname.startsWith(tab.path))?.key || "daily";

  const containerClass = ["planner-tabs", className].filter(Boolean).join(" ");

  return (
    <div className={containerClass}>
      <div className="tabbar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={
              tab.key === activeKey
                ? "tabbar__item tabbar__item--active"
                : "tabbar__item"
            }
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PlannerTabs;
