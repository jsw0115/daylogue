// src/main/frontend/src/layout/MainSidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom"; 
// useAuth 훅이 정의되어 있다고 가정합니다.
const useAuth = () => ({ isAuthenticated: true }); 

const MainSidebar = () => {
    // const { isAuthenticated } = useAuth(); // 'isAuthenticated' 경고 해결을 위해 주석 처리

    const menuItems = [
        {
            title: "PLAN",
            items: [
                { name: "일간", path: "/planner/daily" }, 
                { name: "주간", path: "/planner/weekly" }, 
                { name: "월간", path: "/planner/monthly" }, 
                { name: "연간", path: "/planner/yearly" }, 
            ]
        },
        {
            title: "ACTION",
            items: [
                { name: "할 일", path: "/action/task" }, 
                { name: "루틴", path: "/action/routine/list" },
                { name: "데일리 다이어리", path: "/action/diary" }, 
            ]
        },
        {
            title: "INSIGHT",
            items: [
                { name: "통계", path: "/insight/stat" }, 
                { name: "설정", path: "/settings" }, 
            ]
        }
    ];

    return (
        <nav className="app-shell__sidebar">
            <div className="app-shell__sidebar-section" style={{ marginBottom: '30px' }}>
                <div className="app-shell__sidebar-title" style={{ color: 'var(--color-text-default)', fontSize: '1.2rem', fontWeight: 'bold' }}>DAYLOGUE</div>
                <p className="text-muted" style={{ fontSize: 'var(--font-small)', paddingLeft: '0' }}>
                    하루를 축으로 엮는 타임라인 다이어리
                </p>
            </div>
            
            {/* C 영역 메뉴 렌더링 */}
            {menuItems.map((section, index) => (
                <div className="app-shell__sidebar-section" key={index}>
                    <div className="app-shell__sidebar-title">{section.title}</div>
                    {section.items.map((item) => (
                        <div className="app-shell__sidebar-item" key={item.path}>
                            <NavLink 
                                to={item.path} 
                                className={({ isActive }) => isActive ? "app-shell__sidebar-item--active" : ""}
                            >
                                {item.name}
                            </NavLink>
                        </div>
                    ))}
                </div>
            ))}
            
            {/* 하단 유틸리티 링크 */}
            <div className="app-shell__sidebar-section" style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                <div className="app-shell__sidebar-item">
                    <NavLink to="/focus-mode" className="text-muted">
                         ⏰ 타임라인 기반 집중 관리
                    </NavLink>
                </div>
                 <div className="app-shell__sidebar-item">
                    <NavLink to="/data" className="text-muted">
                         💾 데이터 관리
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default MainSidebar;