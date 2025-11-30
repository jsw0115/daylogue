import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { path: "/plan/daily", label: "일간" },
  { path: "/tasks", label: "할 일" },
  { path: "/diary/daily", label: "일기" },
  { path: "/stat", label: "통계" },
];

function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
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
