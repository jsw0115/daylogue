import React from "react";

function FocusSessionScreen() {
  return (
    <div className="screen focus-session-screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">집중 모드</h1>
          <p className="screen-header__subtitle">
            뽀모도로/딥워크 세션을 기록하고 통계로 연결합니다.
          </p>
        </div>
      </div>

      <div className="focus-grid">
        <section className="dashboard-card focus-timer-main">
          <div className="focus-timer-circle">25:00</div>
          <div>
            <button className="btn btn--primary">시작</button>
          </div>
        </section>

        <section className="dashboard-card">
          <h2 className="dashboard-card__title">오늘 기록</h2>
          <ul className="simple-list">
            <li>• 공부 25분 x 2세트</li>
            <li>• 프로젝트 작업 25분 x 1세트</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default FocusSessionScreen;
