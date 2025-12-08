// src/main/frontend/src/layout/Header.jsx

import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';

// 날짜 네비게이션 훅 (필요하면 나중에 다른 파일로 분리 가능)
const useDateNavigation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const moveDate = (days) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + days);
    setCurrentDate(next);
  };

  const moveWeek = (weeks) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + weeks * 7);
    setCurrentDate(next);
  };

  const moveMonth = (months) => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + months);
    setCurrentDate(next);
  };

  const resetToToday = () => setCurrentDate(new Date());

  return { currentDate, moveDate, moveWeek, moveMonth, resetToToday };
};

const Header = () => {
  const { currentMode, setMode } = useMode();
  const { currentDate, moveDate, moveWeek, moveMonth, resetToToday } =
    useDateNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  let plannerView = '';
  if (location.pathname.includes('/planner/daily')) {
    plannerView = 'daily';
  } else if (location.pathname.includes('/planner/weekly')) {
    plannerView = 'weekly';
  } else if (location.pathname.includes('/planner/monthly')) {
    plannerView = 'monthly';
  } else if (location.pathname.includes('/planner/yearly')) {
    plannerView = 'yearly';
  }

  const handleDateNavigation = (direction) => {
    switch (plannerView) {
      case 'daily':
        moveDate(direction);
        break;
      case 'weekly':
        moveWeek(direction);
        break;
      case 'monthly':
        moveMonth(direction);
        break;
      default:
        break;
    }
  };

  const PlannerTabs = () => {
    const tabs = [
      { label: '일간', path: '/planner/daily' },
      { label: '주간', path: '/planner/weekly' },
      { label: '월간', path: '/planner/monthly' },
      { label: '연간', path: '/planner/yearly' },
    ];

    return (
      <div className="header-planner-tabs">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.path}
            className={({ isActive }) =>
              'header-planner-tab ' + (isActive ? 'is-active' : '')
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    );
  };

  return (
    <header className="app-shell__header header-bar">
      {/* 좌측 영역: 로고/타이틀/모드/플래너 탭 */}
      <div className="header-left">
        <div
          className="header-logo"
          onClick={() => navigate('/home')}
          title="홈으로 이동"
        >
          Timebar Diary
        </div>

        <div className="header-mode-select">
          <select
            value={currentMode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="J">J 모드 (계획)</option>
            <option value="P">P 모드 (기록)</option>
            <option value="B">B 모드 (밸런스)</option>
          </select>
        </div>

        <PlannerTabs />
      </div>

      {/* 우측 영역: 날짜 네비 + 유저 정보 */}
      <div className="header-right">
        {plannerView && plannerView !== 'yearly' && (
          <div className="header-date-nav">
            <button onClick={() => handleDateNavigation(-1)}>&lt;</button>
            <span className="header-date-text">
              {currentDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <button onClick={resetToToday}>오늘</button>
            <button onClick={() => handleDateNavigation(1)}>&gt;</button>
          </div>
        )}

        <div className="header-user">
          <span className="header-user-name">홍길동 님</span>
          <i
            className="bi bi-bell-fill header-bell"
            onClick={() => navigate('/inbox')}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
