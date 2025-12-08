// src/main/frontend/src/screens/focus/FocusModeScreen.jsx

import React, { useState, useEffect, useCallback } from 'react';
// 임시 훅 정의: 실제 프로젝트에서는 Context나 Redux를 통해 모드, 집중 시간, 타임바 연동 상태를 관리해야 합니다.
const useFocusMode = () => ({ 
    mode: 'J', // J, P, B 모드
    totalFocusTime: '02h 35m', 
    longestSession: '45m',
    currentStreak: 7,
    badges: ['Focus Master', 'Pomodoro Pro'],
    plannedSessions: 5,
    completedSessions: 3,
    startFocusSession: (category) => console.log(`Starting focus for: ${category}`),
    stopFocusSession: (duration) => console.log(`Stopping focus after: ${duration}`),
    focusCategories: ['공부', '업무', '독서'],
});

const FocusModeScreen = () => {
    const { 
        mode, totalFocusTime, longestSession, currentStreak, badges, 
        plannedSessions, completedSessions, startFocusSession, stopFocusSession, focusCategories 
    } = useFocusMode();
    
    // 타이머 상태 관리 (FOCUS-001-F01)
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0); // 초 단위
    const [timerMode, setTimerMode] = useState('free'); // 'free' or 'pomodoro'
    const [selectedCategory, setSelectedCategory] = useState(focusCategories[0]);
    
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleTimerToggle = () => {
        if (isRunning) {
            // 타이머 종료 시 (FOCUS-001-F02: 세션 기록 -> 타임바 반영)
            stopFocusSession(time); 
            setTime(0);
        } else {
            // 타이머 시작 시
            startFocusSession(selectedCategory);
        }
        setIsRunning(!isRunning);
    };

    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isRunning && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, time]);

    // 모드별 KPI 표시 (MODE-001-F03)
    const renderModeKPI = () => {
        if (mode === 'J') {
            return (
                <div className="kpi-card bg-light-plan">
                    <h3>계획 대비 집중 수행</h3>
                    <p className="kpi-value">{completedSessions} / {plannedSessions} 세션 완료</p>
                    <p className="text-muted">계획된 세션을 완료하여 목표 달성률을 높이세요!</p>
                </div>
            );
        }
        if (mode === 'P') {
            return (
                <div className="kpi-card bg-light-actual">
                    <h3>실제 누적 집중 시간</h3>
                    <p className="kpi-value">{totalFocusTime}</p>
                    <p className="text-muted">최장 집중 시간: {longestSession} | 🔥 스트릭: {currentStreak}일</p>
                </div>
            );
        }
        if (mode === 'B') {
            return (
                <div className="kpi-card bg-light-balance">
                    <h3>계획과 실행 균형</h3>
                    <p className="kpi-value">{completedSessions} 세션 / {totalFocusTime}</p>
                    <p className="text-muted">총 {plannedSessions} 세션 중 {completedSessions}개 완료</p>
                </div>
            );
        }
    };

    return (
        <div className="focus-mode-screen p-4">
            <h2 className="mb-4">⏰ 집중 모드</h2>

            {/* 모드별 KPI 대시보드 */}
            <div className="row mb-5">
                <div className="col-12 col-md-8 offset-md-2">
                    {renderModeKPI()}
                </div>
            </div>

            <div className="focus-container text-center">
                
                {/* 1. 타이머 제어 (FOCUS-001-F01) */}
                <div className="timer-controls mb-4 d-flex justify-content-center">
                    <button 
                        className={`btn btn-sm me-2 ${timerMode === 'free' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setTimerMode('free')}
                    >
                        자유 시간
                    </button>
                    <button 
                        className={`btn btn-sm ${timerMode === 'pomodoro' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setTimerMode('pomodoro')}
                        disabled // 포모도로 로직은 복잡하여 일단 비활성화
                    >
                        포모도로 (미구현)
                    </button>
                </div>

                <div className="timer-display mb-4 p-5 rounded shadow" style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '2px', backgroundColor: '#f9f9f9' }}>
                    {formatTime(time)}
                </div>

                <div className="timer-action mb-4">
                    <button 
                        className={`btn btn-lg ${isRunning ? 'btn-warning' : 'btn-success'}`}
                        onClick={handleTimerToggle}
                    >
                        {isRunning ? '⏸️ 일시 정지 / 종료' : '▶️ 지금부터 집중 시작'}
                    </button>
                </div>

                {/* 2. 집중 설정 */}
                <div className="focus-settings d-flex justify-content-center align-items-center mb-5">
                    <label htmlFor="categorySelect" className="me-3 text-muted">집중 카테고리:</label>
                    <select 
                        id="categorySelect" 
                        className="form-select w-auto" 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        disabled={isRunning}
                    >
                        {focusCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 3. 리워드/방해 차단 (FOCUS-001-F03, FOCUS-001-F04) */}
            <div className="row mt-5">
                <div className="col-md-6 mb-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">🏆 리워드 및 뱃지</h5>
                            <p className="card-text text-muted">집중 세션 수에 따라 뱃지를 획득하세요!</p>
                            <div className="d-flex flex-wrap">
                                {badges.map(badge => (
                                    <span key={badge} className="badge bg-info text-dark me-2 mb-2">{badge}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">🔕 방해 차단 옵션 (Do Not Disturb)</h5>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="dndSwitch" />
                                <label className="form-check-label" htmlFor="dndSwitch">집중 중 알림 끄기</label>
                            </div>
                            <p className="text-muted mt-2 small">켜면 모바일 푸시 알림 및 인앱 알림이 일시 중지됩니다.</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .focus-mode-screen {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .kpi-card {
                    padding: 20px;
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }
                .kpi-value {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--color-primary);
                    margin: 5px 0 10px;
                }
                .bg-light-plan { background-color: #e6f7ff; border: 1px solid #91d5ff; }
                .bg-light-actual { background-color: #fff1f0; border: 1px solid #ff7875; }
                .bg-light-balance { background-color: #f6ffed; border: 1px solid #b7eb8f; }
            `}</style>
        </div>
    );
};

export default FocusModeScreen;