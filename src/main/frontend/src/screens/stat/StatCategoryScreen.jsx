// src/screens/stat/StatCategoryScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import "../../styles/screens/stat.css";

function StatCategoryScreen() {
  return (
    <div className="screen stat-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">카테고리별 통계</h2>
          <p className="screen-header__subtitle">
            공부/업무/건강/휴식 등 카테고리별로 사용한 시간을 비교해요.
          </p>
        </div>
      </header>

      <div className="stat-grid">
        <DashboardCard title="막대 그래프" subtitle="시간 또는 횟수 기준">
          <div style={{ height: 260 }} />
        </DashboardCard>

        <DashboardCard title="범례" subtitle="색상과 카테고리 매핑">
          <div className="stat-legend">
            <div className="stat-legend__item">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: "#6366f1",
                }}
              />
              공부
            </div>
            <div className="stat-legend__item">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: "#22c55e",
                }}
              />
              건강/운동
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

export default StatCategoryScreen;
