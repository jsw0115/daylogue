// src/main/frontend/src/screens/plan/YearlyOverviewScreen.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';

const YearlyOverviewScreen = () => {
    const year = 2025;
    const months = Array.from({ length: 12 }, (_, i) => ({
        name: `${year}년 ${String(i + 1).padStart(2, '0')}월`,
        progress: Math.floor(Math.random() * 10) + 1, // 임시 진행도 (1~10)
    }));

    return (
        <div>
            <div className="screen-header">
                <div className="screen-header__title">연간 플래너</div>
                {/* 탭을 NavLink로 수정하여 라우팅 연동 */}
                <div className="tabbar tabbar--sm">
                    <NavLink to="/planner/daily" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>일간</NavLink>
                    <NavLink to="/planner/weekly" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>주간</NavLink>
                    <NavLink to="/planner/monthly" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>월간</NavLink>
                    <NavLink to="/planner/yearly" className={({ isActive }) => `tabbar__item ${isActive ? 'tabbar__item--active' : ''}`}>연간</NavLink>
                </div>
            </div>

            <h3 className="text-muted mb-4">{year}년 연간 기록/패턴 중심</h3>

            <div className="flex gap-2 mb-4">
                <button className="btn btn--sm btn--ghost" style={{ backgroundColor: 'transparent', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>이전 {year - 1}</button>
                <button className="btn btn--sm primary-button">다음 {year + 1}</button>
            </div>

            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {months.map((month, index) => (
                    <div key={index} className="flex flex-col gap-2 p-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <div className="font-bold">{month.name}</div>
                        
                        {/* 임시 프로그레스 바 */}
                        <div className="flex items-center gap-2">
                            <div style={{ height: '8px', flexGrow: 1, backgroundColor: 'var(--color-background-hover)', borderRadius: '4px' }}>
                                <div style={{ width: `${month.progress * 10}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '4px' }}></div>
                            </div>
                            <span className="text-muted font-small" style={{ width: '120px', textAlign: 'right' }}>
                                월간 플래너/통계에서 상세 보기
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default YearlyOverviewScreen;