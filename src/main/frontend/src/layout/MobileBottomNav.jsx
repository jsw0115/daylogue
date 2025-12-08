import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * 모바일 환경에서만 보이는 하단 네비게이션 바 컴포넌트입니다.
 * 주요 5개 메뉴를 아이콘으로 표시합니다.
 */
const MobileBottomNav = () => {
    // 하단 탭에 표시할 주요 메뉴
    const navItems = [
        { name: '일간', path: '/planner/daily', icon: '📅' },
        { name: '할 일', path: '/action/task', icon: '✅' },
        { name: '대시보드', path: '/', icon: '🏠' }, // 홈 대시보드로 이동
        { name: '루틴', path: '/action/routine/list', icon: '🔁' },
        { name: '통계', path: '/insight/stat', icon: '📊' },
    ];

    return (
        <nav className="mobile-bottom-nav">
            {navItems.map(item => (
                <NavLink 
                    key={item.path} 
                    to={item.path}
                    className={({ isActive }) => `mobile-bottom-nav__item ${isActive ? 'mobile-bottom-nav__item--active' : ''}`}
                >
                    <div className="mobile-bottom-nav__icon">{item.icon}</div>
                    <div className="mobile-bottom-nav__label font-small">{item.name}</div>
                </NavLink>
            ))}
        </nav>
    );
};

export default MobileBottomNav;