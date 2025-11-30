// src/screens/plan/YearlyOverviewScreen.jsx
import React from "react";

function YearlyOverviewScreen() {
  return (
    <div className="screen yearly-overview-screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">연간 개요</h1>
          <p className="screen-header__subtitle">
            연간 목표, 큰 이벤트, 색으로 보는 1년 히트맵을 요약해요.
          </p>
        </div>
      </div>

      <div className="yearly-grid">
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">연간 목표</h2>
          </div>
          <ul className="simple-list">
            <li>• 건강: 10km 러닝 완주</li>
            <li>• 공부: SQLD + 추가 자격증</li>
            <li>• 커리어: 새로운 프로젝트 런칭</li>
          </ul>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">큰 이벤트</h2>
          </div>
          <ul className="simple-list">
            <li>• 03월 : 자격증 시험</li>
            <li>• 07월 : 여름 휴가</li>
            <li>• 10월 : 신규 프로젝트 시작</li>
          </ul>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">색으로 보는 1년</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 3,
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 32,
                  borderRadius: 4,
                  background:
                    i % 3 === 0
                      ? "rgba(79,70,229,0.25)"
                      : "rgba(148,163,184,0.3)",
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default YearlyOverviewScreen;
