// src/main/frontend/src/screens/plan/PlannerTabs.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";

const PlannerTabs = () => {
  const tabs = [
    { to: ROUTES.DAILY, label: "일간" },
    { to: ROUTES.WEEKLY, label: "주간" },
    { to: ROUTES.MONTHLY, label: "월간" },
    { to: ROUTES.YEARLY, label: "연간" },
  ];

  return (
    <div className="planner-tabs">
      <div className="tabbar">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              "tabbar__item" + (isActive ? " tabbar__item--active" : "")
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default PlannerTabs;
