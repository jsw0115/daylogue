// src/main/frontend/src/screens/settings/SettingsScreen.jsx

import React from 'react';

const SettingsScreen = () => {
    return (
        <div>
            <div className="screen-header">
                <div className="screen-header__title">설정</div>
            </div>
            
            <h3 className="text-muted mb-4">앱 환경 및 계정 관리</h3>

            <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* 계정 설정 */}
                <div className="card flex-col gap-3">
                    <h4 className="dashboard-card__title">👤 계정 및 프로필</h4>
                    <p className="text-muted font-small">사용자 이름, 비밀번호 변경, 이메일 설정</p>
                    <button className="primary-button btn--sm" style={{ alignSelf: 'flex-start' }}>프로필 편집</button>
                </div>
                
                {/* 앱 테마 설정 */}
                <div className="card flex-col gap-3">
                    <h4 className="dashboard-card__title">🎨 테마 및 UI</h4>
                    <p className="text-muted font-small">다크 모드/라이트 모드 전환, 기본 색상 설정</p>
                    <select style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                        <option>라이트 모드</option>
                        <option>다크 모드</option>
                    </select>
                </div>

                {/* 데이터 관리 */}
                <div className="card flex-col gap-3">
                    <h4 className="dashboard-card__title">💾 데이터 관리</h4>
                    <p className="text-muted font-small">데이터 백업 및 복원, 모든 데이터 삭제</p>
                    <button className="primary-button btn--sm" style={{ backgroundColor: 'var(--color-warning)', alignSelf: 'flex-start' }}>데이터 백업</button>
                </div>
                
                {/* 알림 설정 */}
                <div className="card flex-col gap-3">
                    <h4 className="dashboard-card__title">🔔 알림 설정</h4>
                    <p className="text-muted font-small">루틴/할 일 알림 켜기/끄기</p>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span>푸시 알림 활성화</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default SettingsScreen;