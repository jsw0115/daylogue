// src/main/frontend/src/screens/PlaceholderScreen.jsx

import React from 'react';
import { useLocation } from 'react-router-dom';

const PlaceholderScreen = () => {
    const location = useLocation();
    const path = location.pathname;

    // 경로에 따라 화면 제목 설정
    let title = "설정 및 데이터 화면";
    if (path.includes('/settings')) {
        title = "설정 (Settings)";
    } else if (path.includes('/data')) {
        title = "데이터 관리";
    } else if (path.includes('/focus-mode')) {
        title = "집중 모드";
    } else if (path.includes('/planner/yearly')) {
        title = "연간 개요";
    }

    return (
        <div style={{ padding: '20px', backgroundColor: 'var(--color-background-hover)', minHeight: '80vh', borderRadius: 'var(--border-radius)' }}>
            <h2 style={{ color: 'var(--color-primary)' }}>{title}</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '10px' }}>
                현재 경로: **{path}**
            </p>
            <p style={{ marginTop: '20px', fontSize: '1.1rem' }}>
                이 화면은 현재 구현 단계에 있습니다. 추후 프로필, 테마 설정, 데이터 백업 등의 기능이 추가될 예정입니다.
            </p>
        </div>
    );
}

export default PlaceholderScreen;