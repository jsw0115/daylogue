// src/main/frontend/src/screens/plan/DailyPlannerScreen.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';

const PlannerViewTabs = () => {
  const tabs = [
    { label: "일간", path: "/planner/daily" },
    { label: "주간", path: "/planner/weekly" },
    { label: "월간", path: "/planner/monthly" },
    { label: "연간", path: "/planner/yearly" },
  ];

  return (
    <div className="planner-view-tabs">
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.path}
          className={({ isActive }) =>
            "planner-view-tab " + (isActive ? "is-active" : "")
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};

const DailyPlannerScreen = () => {
    const date = "2025. 12. 7 (일)";
    const dayPlan = "하루 계획";
    
    return (
        <div className="daily-planner-screen">
            {/* 상단 헤더: 좌측 제목, 우측 탭 */}
            <div className="screen-header">
                <div className="screen-header__left">
                <h1 className="screen-header__title">일간 플래너</h1>
                </div>
                <div className="screen-header__right">
                <PlannerViewTabs />
                </div>
            </div>

            {/* 아래는 기존 컨텐츠 (날짜, 카드들 등) 그대로 두면 됨 */}
            {/* Date & Sub-header (날짜 이동 컨트롤) */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                    <button className="btn btn--sm btn--ghost" style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&lt;</button>
                    <h3 className="text-primary">{date}</h3>
                    <button className="btn btn--sm btn--ghost" style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&gt;</button>
                </div>
                <p className="text-muted font-small">{dayPlan}</p>
            </div>

            {/* 메인 컨텐츠 그리드 */}
            <div className="screen-grid daily-layout"> 
                
                {/* 1열: Daily To-do & Memo */}
                <div className="flex flex-col gap-4">
                    
                    {/* Daily To-do Card */}
                    <div className="card flex-col">
                        <h3 className="dashboard-card__title">Daily Todo</h3>
                        <div className="text-muted font-small mb-3">오늘 할 일 목록</div>
                        
                        {/* To-do List Item Example */}
                        <div className="todo-item">
                            <label className="checkbox flex items-center gap-2">
                                <span className="checkbox__box checkbox__box--checked" style={{ display: 'inline-block', width: '16px', height: '16px', border: '1px solid var(--color-primary)', backgroundColor: 'var(--color-primary)', borderRadius: '3px' }}>
                                    <svg className="checkbox__icon" viewBox="0 0 16 16" fill="white" width="100%" height="100%"><path d="M12.207 4.793a1 1 0 00-1.414 0L6 9.586 4.207 7.793a1 1 0 00-1.414 1.414l2.5 2.5a1 1 0 001.414 0l5-5a1 1 0 000-1.414z"/></svg>
                                </span>
                                <span className="checkbox__label">SQLD 1일 1문제 풀기</span>
                            </label>
                            <span className="badge badge--success" style={{ backgroundColor: 'var(--color-success)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>30분</span>
                        </div>
                        
                        <button className="primary-button btn--sm mt-4">+ 추가</button>
                    </div>

                    {/* Daily Memo Card */}
                    <div className="card flex-col">
                        <h3 className="dashboard-card__title">Daily Memo</h3>
                        <div className="text-muted font-small mb-3">오늘의 배움 / 감사 / 위시</div>
                        
                        <textarea 
                            className="field__control memo-textarea" 
                            placeholder="오늘 하루를 기록하세요..."
                            defaultValue="오전: 학교 앞 카페에서 프로젝트 회의 완료.
오후: 운동 30분, 피드백 반영 완료."
                            rows="5"
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px', resize: 'vertical' }}
                        ></textarea>
                        
                        {/* Quote 영역 */}
                        <blockquote className="memo-quote" style={{ marginTop: '10px', borderLeft: '3px solid var(--color-primary)', paddingLeft: '10px', color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                            "성공이란 열정을 잃지 않고 실패를 거듭할 수 있는 능력이다." (Quote)
                        </blockquote>
                    </div>
                </div>

                {/* 2열: Routine & Detailed Timeline */}
                <div className="flex flex-col gap-4">
                    
                    {/* Routine 영역 */}
                    <div className="card">
                        <h3 className="dashboard-card__title">Routine</h3>
                        <div className="text-muted font-small mb-3">오늘 달성할 루틴 목록</div>
                        <div className="flex justify-between items-center py-2 border-b-1 border-border">
                            <span>Morning Stretch</span>
                            <span className="badge badge--primary" style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>Done</span>
                        </div>
                    </div>

                    {/* Timeline 영역 */}
                    <div className="card flex-col flex-1" style={{ height: '100%', minHeight: '300px' }}> 
                        <h3 className="dashboard-card__title">Timeline</h3>
                        <div className="text-muted font-small mb-3">하루 시간 사용 상세 기록</div>
                        <div className="flex justify-center items-center h-full text-muted" style={{ flexGrow: 1 }}>
                           ...타임라인 상세 기록 영역...
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default DailyPlannerScreen;