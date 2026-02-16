// FILE: src/main/frontend/src/layout/MainSidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, CheckSquare, Repeat,
  Inbox, Wallet, BarChart2, Users, Settings,
  ChevronLeft, ChevronRight, Activity, ToggleLeft, ToggleRight,
  FileText, Goal, Shield, Database
} from "lucide-react";
import "./MainSidebar.css"; // CSS 파일 분리

// NavLink 래퍼 컴포넌트
const Item = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `lnb__item ${isActive ? "is-active" : ""}`}
  >
    {Icon && <Icon size={18} className="lnb__icon" />}
    <span className="lnb__text">{children}</span>
  </NavLink>
);

export default function MainSidebar({
  user, permissions, // user info
  userMode = "J", onToggleMode, // J/P 모드 props (상위에서 전달받음)
  isCollapsed, onToggleCollapse // 사이드바 접기/펴기 상태
}) {
  const navigate = useNavigate();
  const isAdmin = !!permissions?.isAdmin;

  // 로컬 상태로 접기/펴기 관리 (상위 props가 없으면 스스로 관리)
  const [collapsedLocal, setCollapsedLocal] = useState(false);
  const collapsed = isCollapsed !== undefined ? isCollapsed : collapsedLocal;

  const toggleCollapse = () => {
    if (onToggleCollapse) onToggleCollapse();
    else setCollapsedLocal(!collapsedLocal);
  };

  // 모드 토글 핸들러 (없으면 로컬 테스트용 경고)
  const handleModeToggle = () => {
    if (onToggleMode) onToggleMode();
    else console.warn("onToggleMode prop이 전달되지 않았습니다.");
  };

  return (
    <aside className={`lnb ${collapsed ? "collapsed" : ""}`}>
      {/* 1. Brand / Logo Area */}
      {/*
      <div className="lnb__brand">
        <div className="lnb__logo-wrapper" onClick={() => navigate("/home")}>
          <Activity size={24} className="lnb__logo-icon" color="var(--tf-primary)"/>
          {!collapsed && <span className="lnb__logo-text">TimeFlow</span>}
        </div>
        <button className="lnb__toggle-btn" onClick={toggleCollapse}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div> 
      */}

      {/* 2. J/P Mode Switcher (펼쳐졌을 때만 표시) */}
      {!collapsed && (
        <div className="lnb__mode-switch" onClick={handleModeToggle}>
          <div className="lnb__mode-labels">
            <span className={userMode === 'J' ? 'active' : ''}>J-Plan</span>
            <span className="divider">/</span>
            <span className={userMode === 'P' ? 'active' : ''}>P-Flow</span>
          </div>
          {userMode === 'J'
            ? <ToggleLeft size={24} color="var(--tf-primary)" />
            : <ToggleRight size={24} color="#10b981" />
          }
        </div>
      )}

      {/* 3. Navigation Menu */}
      <div className="lnb__scroll-area">

        {/* DAYLOGUE (Core) */}
        <div className="lnb__section">
          {!collapsed && <div className="lnb__title">DAYLOGUE</div>}
          <Item to="/home" icon={LayoutDashboard}>홈 대시보드</Item>
          <Item to="/inbox" icon={Inbox}>인박스 (Quick)</Item>
          <Item to="/diary/daily" icon={FileText}>데일리 다이어리</Item>
          <Item to="/money" icon={Wallet}>머니로그</Item>
        </div>

        {/* PLAN (Time) */}
        <div className="lnb__section">
          {!collapsed && <div className="lnb__title">PLAN</div>}
          <Item to="/planner/daily" icon={Calendar}>일간 플래너</Item>
          <Item to="/planner/weekly" icon={Calendar}>주간 플래너</Item>
          <Item to="/planner/monthly" icon={Calendar}>월간 플래너</Item>
          <Item to="/planner/yearly" icon={Calendar}>연간 플래너</Item>
        </div>

        {/* ACTION (Execution) */}
        <div className="lnb__section">
          {!collapsed && <div className="lnb__title">ACTION</div>}
          <Item to="/action/task" icon={CheckSquare}>할 일</Item>
          <Item to="/action/routine/list" icon={Repeat}>루틴</Item>
          <Item to="/focus" icon={Activity}>포커스 타이머</Item>
        </div>

        {/* INSIGHT (Stats) */}
        <div className="lnb__section">
          {!collapsed && <div className="lnb__title">INSIGHT</div>}
          <Item to="/insight/stat" icon={BarChart2}>통계</Item>
          <Item to="/stat/compare" icon={BarChart2}>P vs A 분석</Item>
          <Item to="/insight/ai-report" icon={FileText}>AI 리포트</Item>
        </div>

        {/* WORK (Professional) */}
        <div className="lnb__section">
          {!collapsed && <div className="lnb__title">WORK</div>}
          <Item to="/work/report" icon={FileText}>업무 리포트</Item>
          <Item to="/goals/year" icon={Goal}>목표/회고</Item>
        </div>

        {/* COMMUNITY (Social) */}
        <div className="lnb__section">
          {!collapsed && <div className="lnb__title">CONNECT</div>}
          <Item to="/share/address-book" icon={Users}>주소록</Item>
          <Item to="/community" icon={Users}>커뮤니티</Item>
        </div>

        {/* DATA */}
        <div className="lnb__section">
          {!collapsed && <div className="lnb__title">DATA</div>}
          <Item to="/data" icon={Database}>데이터 관리</Item>
        </div>

        {/* ADMIN (Only for Admin) */}
        {isAdmin && (
          <div className="lnb__section">
            {!collapsed && <div className="lnb__title">ADMIN</div>}
            <Item to="/admin" icon={Shield}>관리자 설정</Item>
          </div>
        )}
      </div>
    </aside>
  );
}