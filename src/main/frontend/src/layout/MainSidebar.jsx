import React from "react";
import { NavLink } from "react-router-dom";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `lnb__item ${isActive ? "is-active" : ""}`}
  >
    {children}
  </NavLink>
);

export default function MainSidebar() {
  return (
    <aside className="lnb">
      <div className="lnb__section">
        <div className="lnb__title">DAYLOGUE</div>
        <Item to="/home">홈 대시보드</Item>
        <Item to="/diary/daily">데일리 다이어리</Item>
      </div>

      <div className="lnb__section">
        <div className="lnb__title">PLAN</div>
        <Item to="/planner/daily">일간</Item>
        <Item to="/planner/weekly">주간</Item>
        <Item to="/planner/monthly">월간</Item>
        <Item to="/planner/yearly">연간</Item>
      </div>

      <div className="lnb__section">
        <div className="lnb__title">ACTION</div>
        <Item to="/action/task">할 일</Item>
        <Item to="/action/routine/list">루틴</Item>
        <Item to="/focus">포커스</Item>
      </div>

      <div className="lnb__section">
        <div className="lnb__title">INSIGHT</div>
        <Item to="/insight/stat">통계</Item>
      </div>

      <div className="lnb__section">
        <div className="lnb__title">DATA</div>
        <Item to="/data">데이터 관리</Item>
      </div>

      <div className="lnb__section">
        <div className="lnb__title">ADMIN</div>
        <Item to="/admin">관리자 설정</Item>
      </div>
    </aside>
  );
}
