// FILE : src/main/frontend/src/layout/MainSidebar.jsx
import React, { useEffect, useMemo, useRef, useState }  from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `lnb__item ${isActive ? "is-active" : ""}`}
  >
    {children}
  </NavLink>
);

export default function MainSidebar({
  user = null, userLoading = false, userError = null, permissions = null,
  bootstrap = null, bootstrapLoading = false, bootstrapError = null, 
  onRefreshUser, onRefreshBootstrap, onLogout, // (옵션) 로그아웃 핸들러를 AppShell에서 내려주면 여기서 호출
}) {
  
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const isAdmin = !!permissions?.isAdmin;

  return (
    <aside className="lnb">
      <div className="lnb__section">
        <div className="lnb__title">DAYLOGUE</div>
        <Item to="/home">홈 대시보드</Item>
        <Item to="/diary/daily">데일리 다이어리</Item>
        <Item to="/diary/calendar">다이어리 리포트</Item>
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
        <Item to="/stat/compare">비교 분석(PvsA)</Item>
        <Item to="/insight/ai-report">AI 리포트</Item>
      </div>

      <div className="lnb__section">
        <div className="lnb__title">WORK</div>
        <Item to="/work/report">업무 리포트</Item>
        <Item to="/goals/year">신년목표/올해 회고</Item>
      </div>

      <div className="lnb__section">
        <div className="lnb__title">COMMUNITY</div>
        <Item to="/community">커뮤니티 탐색/피드</Item>
      </div>

      <div className="lnb__section">
        <div className="lnb__title">SETTINGS</div>
        <Item to="/settings/categories">카테고리 설정</Item>
      </div>

      <div className="lnb__section">
        <div className="lnb__title">DATA</div>
        <Item to="/data">데이터 관리</Item>
      </div>

      {isAdmin && (
        <div className="lnb__section">
          <div className="lnb__title">ADMIN</div>
          <Item to="/admin">관리자 설정</Item>
        </div>
      )}
    </aside>
  );
}
