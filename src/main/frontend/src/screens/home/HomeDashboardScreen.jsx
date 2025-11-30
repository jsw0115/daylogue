import React from "react";

function HomeDashboardScreen() {
  return (
    <div className="screen home-dashboard-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">오늘의 팔레트</h1>
          <p className="screen-header__subtitle">
            오늘 하루의 타임바, 일정, 할 일, 루틴을 한 번에 확인해요.
          </p>
        </div>
      </header>

      <p>홈 대시보드는 나중에 PLAN-001/STAT-001 데이터와 연동해서 꾸미면 돼요.</p>
    </div>
  );
}

export default HomeDashboardScreen;
