import React from 'react';

const YearlyPlannerScreen = () => {
    const yearData = [
        { quarter: '1분기 (1월-3월)', goal: '프로젝트 기획 완료', status: '70% 달성' },
        { quarter: '2분기 (4월-6월)', goal: '중간고사 우수 성적 획득', status: '완료' },
        { quarter: '3분기 (7월-9월)', goal: 'SQLD 자격증 취득', status: '계획 중' },
        { quarter: '4분기 (10월-12월)', goal: '포트폴리오 완성', status: '진행 중' },
    ];

    return (
        <div>
            <div className="screen-header">
                <div className="screen-header__title">연간 플래너</div>
                <div className="tabbar tabbar--sm">
                    <div className="tabbar__item">일간</div>
                    <div className="tabbar__item">주간</div>
                    <div className="tabbar__item">월간</div>
                    <div className="tabbar__item tabbar__item--active">연간</div>
                </div>
            </div>
            
            <h3 className="text-primary mb-5">2025년 목표 대시보드</h3>

            <div className="grid grid-2-cols gap-4">
                {yearData.map((data, index) => (
                    <div key={index} className="card p-4 flex-col">
                        <h4 className="font-bold text-secondary mb-2">{data.quarter}</h4>
                        <p className="font-large mb-3">{data.goal}</p>
                        <div className={`badge badge--${data.status.includes('완료') ? 'success' : 'warning'}`}>{data.status}</div>
                    </div>
                ))}
            </div>

            <div className="card mt-4 p-4">
                <h4 className="dashboard-card__title">연간 회고 및 다음 연도 계획</h4>
                <p className="text-muted">올해의 성과와 실패를 기록하여 내년 계획에 반영하세요.</p>
            </div>
        </div>
    );
}

export default YearlyPlannerScreen;