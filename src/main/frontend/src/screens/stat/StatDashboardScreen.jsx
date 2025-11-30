import React from "react";

function StatDashboardScreen() {
  return (
    <div className="screen stat-screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">통합 통계</h1>
          <p className="screen-header__subtitle">
            완료 Task, 루틴 달성률, 일기 작성일 수를 한 눈에 봅니다.
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">오늘·이번 주 요약</h2>
          </div>
          <ul className="simple-list">
            <li>• 완료 Task: 5개</li>
            <li>• 루틴 달성률: 72%</li>
            <li>• 일기 작성일 수: 18일</li>
          </ul>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Plan vs Actual</h2>
          </div>
          <p className="stat-legend">
            나중에 Recharts 같은 라이브러리로 그래프를 붙이면 돼요.
          </p>
        </section>
      </div>
    </div>
  );
}

export default StatDashboardScreen;
