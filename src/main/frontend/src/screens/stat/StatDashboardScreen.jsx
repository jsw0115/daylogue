// src/main/frontend/src/screens/stat/StatDashboardScreen.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';

const StatDashboardScreen = () => {
    const chartData = [
        { label: 'PLAN 달성률', value: 85, color: 'primary' },
        { label: 'ACTION 완료율', value: 60, color: 'success' },
        { label: 'DIARY 작성율', value: 95, color: 'warning' },
    ];
    
    return (
        <div>
            <div className="screen-header">
                <div className="screen-header__title">통합 통계 대시보드</div>
                {/* 임시 탭 바 */}
                <div className="tabbar tabbar--sm">
                    <NavLink to="/insight/stat" className="tabbar__item tabbar__item--active">개요</NavLink>
                    <NavLink to="/insight/stat/routine" className="tabbar__item">루틴</NavLink>
                    <NavLink to="/insight/stat/task" className="tabbar__item">할 일</NavLink>
                </div>
            </div>
            
            <h3 className="text-muted mb-4">전반적인 활동 분석</h3>
            
            <div className="card grid-3-cols gap-4 stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {chartData.map((data, index) => (
                    <div key={index} className="stat-card p-4 flex-col items-center justify-center text-center">
                        <div 
                            className={`stat-circle font-bold text-${data.color}`} 
                            style={{ fontSize: '32px', marginBottom: '8px' }}
                        >
                            {data.value}%
                        </div>
                        <h4 className="font-bold text-muted">{data.label}</h4>
                    </div>
                ))}
            </div>

            <div className="card mt-4 p-4">
                <h4 className="dashboard-card__title mb-3">주간 시간 사용 분포</h4>
                <div style={{ height: '200px', backgroundColor: 'var(--color-background-hover)', borderRadius: 'var(--border-radius)' }} className="flex justify-center items-center text-muted">
                    Bar Chart Placeholder
                </div>
            </div>
        </div>
    );
}

export default StatDashboardScreen;