// src/main/frontend/src/layout/MobileBottomNav.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/layout.css";

function MobileBottomNav() {
  const location = useLocation();

  const items = [
    { to: "/plan/daily", label: "플랜" },
    { to: "/focus", label: "포커스" },
    { to: "/tasks", label: "할 일" },
    { to: "/stat", label: "통계" },
    { to: "/settings/category", label: "설정" },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => {
        const active = location.pathname.startsWith(item.to);
        return (
          <Link key={item.to}
            to={item.to}
            className={
              active
                ? "mobile-bottom-nav__item mobile-bottom-nav__item--active"
                : "mobile-bottom-nav__item"
            }
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;

