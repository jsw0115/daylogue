// src/layout/MobileBottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../shared/constants/routes";

function MobileBottomNav() {
  const items = [
    { key: "home", label: "홈", to: ROUTES.HOME },
    { key: "daily", label: "일간", to: ROUTES.DAILY },
    { key: "tasks", label: "할 일", to: ROUTES.TASKS },
    { key: "diary", label: "다이어리", to: ROUTES.DIARY },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.key}
          to={item.to}
          className={({ isActive }) =>
            "mobile-bottom-nav__item" +
            (isActive ? " mobile-bottom-nav__item--active" : "")
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default MobileBottomNav;
