// src/main/frontend/src/screens/plan/WeeklyPlannerScreen.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 

const WeeklyPlannerScreen = () => {
    const navigate = useNavigate(); 
    const weeklyData = [
        { day: '월', date: '12/01', tasks: 3, mood: '좋음' },
        { day: '화', date: '12/02', tasks: 5, mood: '보통' },
        { day: '수', date: '12/03', tasks: 2, mood: '나쁨' },
        { day: '목', 'date': '12/04', tasks: 4, mood: '좋음' },
        { day: '금', date: '12/05', tasks: 1, mood: '최고' },
        { day: '토', date: '12/06', tasks: 0, mood: '휴식' },
        { day: '일', date: '12/07', tasks: 2, mood: '보통' },
    ];
    
    const handleDayClick = (dateString) => {
        navigate(`/planner/daily`); 
    }
    
    return (
        <div>
            <div className="screen-header">
                <div className="screen-header__title">주간 플래너</div>
                {/* 탭을 NavLink로 수정하여 라우팅 연동 */}
                <div className="tabbar tabbar--sm">
                    <NavLink to="/planner/daily" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>일간</NavLink>
                    <NavLink to="/planner/weekly" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>주간</NavLink>
                    <NavLink to="/planner/monthly" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>월간</NavLink>
                    <NavLink to="/planner/yearly" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>연간</NavLink>
                </div>
            </div>
            
            <h3 className="text-muted mb-4">2025년 12월 첫째 주</h3>
            
            <div className="card weekly-grid gap-3">
                {weeklyData.map((data, index) => (
                    <div 
                        key={index} 
                        className={`weekly-day-card flex-col items-center p-3 rounded-md ${data.day === '일' ? 'text-danger' : ''}`}
                        onClick={() => handleDayClick(data.date)} 
                        style={{ border: '1px solid var(--color-border)', cursor: 'pointer' }}
                    >
                        <div className="font-bold">{data.day}</div>
                        <div className="text-muted font-small mb-2">{data.date}</div>
                        <div className="text-primary font-bold">{data.tasks} Tasks</div>
                        <div className="text-secondary font-small">{data.mood}</div>
                    </div>
                ))}
            </div>

            <div className="card mt-4 p-4">
                <h4 className="dashboard-card__title">주간 리뷰 및 요약</h4>
                <textarea 
                    className="field__control memo-textarea" 
                    placeholder="이번 주를 요약하고 다음 주 계획을 세우세요..."
                    rows="5"
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px', resize: 'vertical' }}
                ></textarea>
            </div>
        </div>
    );
}

export default WeeklyPlannerScreen;