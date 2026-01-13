// FILE: src/main/frontend/src/screens/plan/_components/PlannerViewTabs.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function PlannerViewTabs({ dateKey }) {
  const mk = (path) => `${path}?date=${dateKey}`;
  return (
    <div className="tabbar tabbar--sm">
      <NavLink to={mk("/planner/daily")} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>일간</NavLink>
      <NavLink to={mk("/planner/weekly")} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>주간</NavLink>
      <NavLink to={mk("/planner/monthly")} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>월간</NavLink>
      <NavLink to={mk("/planner/yearly")} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>연간</NavLink>
    </div>
  );
}
