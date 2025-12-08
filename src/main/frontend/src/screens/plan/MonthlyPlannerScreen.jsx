// src/main/frontend/src/screens/plan/MonthlyPlannerScreen.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 

const MonthlyPlannerScreen = () => {
    const navigate = useNavigate();
    const daysInMonth = 30;
    const firstDayOffset = 4; // 1일이 목요일(인덱스 4)이라고 가정
    
    const handleDayClick = (day) => {
        navigate(`/planner/daily`);
    }

    // 단순 달력 셀 생성
    const calendarCells = [];
    for (let i = 0; i < firstDayOffset; i++) {
        calendarCells.push(<div key={`empty-${i}`} className="calendar-cell calendar-cell--empty"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarCells.push(
            <div 
                key={i} 
                className={`calendar-cell p-2 flex-col items-start ${i === 7 ? 'bg-background-hover' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleDayClick(i)} 
            >
                <div className="font-bold mb-1">{i}</div>
                <div className="text-primary font-small">T: 3</div>
                <div className="text-success font-small">R: 2</div>
            </div>
        );
    }

    return (
        <div>
            <div className="screen-header">
                <div className="screen-header__title">월간 플래너</div>
                {/* 탭을 NavLink로 수정하여 라우팅 연동 */}
                <div className="tabbar tabbar--sm">
                    <NavLink to="/planner/daily" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>일간</NavLink>
                    <NavLink to="/planner/weekly" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>주간</NavLink>
                    <NavLink to="/planner/monthly" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>월간</NavLink>
                    <NavLink to="/planner/yearly" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>연간</NavLink>
                </div>
            </div>
            
            <h3 className="text-primary mb-4">2025년 12월</h3>
            
            <div className="calendar-grid">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                    <div key={day} className="calendar-header-day text-center font-bold text-muted pb-2">{day}</div>
                ))}
                
                {calendarCells}
            </div>

            <div className="card mt-4 p-4">
                <h4 className="dashboard-card__title">월간 목표 및 주요 이벤트</h4>
                <p className="text-muted">이번 달 주요 목표를 한눈에 확인하세요.</p>
            </div>
        </div>
    );
}

export default MonthlyPlannerScreen;