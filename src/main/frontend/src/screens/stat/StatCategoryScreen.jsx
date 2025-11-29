// src/main/frontend/src/screens/stat/StatCategoryScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/stat.css";

function StatCategoryScreen() {
  const data = [
    { category: "공부", hours: 12 },
    { category: "업무", hours: 20 },
    { category: "건강", hours: 5 },
  ];

  return (
    <AppShell title="카테고리별 통계">
      <div className="screen stat-category-screen">
        <header className="screen-header">
          <h2>카테고리별 시간 사용</h2>
        </header>

        <section className="stat-bar-list">
          {data.map((d) => (
            <div key={d.category} className="stat-bar-item">
              <span className="stat-bar-item__label">{d.category}</span>
              <div className="stat-bar-item__bar">
                <div className="stat-bar-item__fill"
                  style={{ width: `${Math.min(d.hours * 5, 100)}%` }}
                />
              </div>
              <span className="stat-bar-item__value">{d.hours}h</span>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default StatCategoryScreen;

