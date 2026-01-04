import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  Calendar,
  CheckSquare,
  Home,
  Repeat,
  BarChart3,
} from "lucide-react";

import "../styles/mobileLayout.css";

/**
 * 모바일 환경에서만 보이는 하단 네비게이션 바
 */
const MobileBottomNav = () => {
  const navItems = [
    { name: "일간", path: "/planner/daily", Icon: Calendar },
    { name: "할 일", path: "/action/task", Icon: CheckSquare },
    { name: "대시보드", path: "/", Icon: Home, end: true },
    { name: "루틴", path: "/action/routine/list", Icon: Repeat },
    { name: "통계", path: "/insight/stat", Icon: BarChart3 },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="하단 내비게이션">
      {navItems.map(({ name, path, Icon, end }) => (
        <NavLink
          key={path}
          to={path}
          end={!!end}
          className={({ isActive }) =>
            clsx("mobile-bottom-nav__item", isActive && "is-active")
          }
        >
          <span className="mobile-bottom-nav__icon" aria-hidden="true">
            <Icon size={22} />
          </span>
          <span className="mobile-bottom-nav__label">{name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
