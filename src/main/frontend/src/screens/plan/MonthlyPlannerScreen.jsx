// src/main/frontend/src/screens/plan/MonthlyPlannerScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import MonthlyCategoryDots from "../../components/planner/MonthlyCategoryDots";
import "../../styles/screens/planner.css";

const days = Array.from({ length: 30 }).map((_, i) => {
  const date = `2025-03-${String(i + 1).padStart(2, "0")}`;
  const colors = ["#4F8BFF", "#3B5BDB", "#22C55E", "#FB923C"];
  return {
    date,
    color: i % 4 === 0 ? colors[0] : colors[i % colors.length],
    label: "대표 카테고리",
  };
});

function MonthlyPlannerScreen() {
  return (
    <AppShell title="월간 플래너">
      <div className="screen monthly-planner-screen">
        <header className="screen-header">
          <h2>2025년 3월</h2>
        </header>

        <section className="monthly-main">
          <MonthlyCategoryDots days={days} />
        </section>

        <section className="monthly-goals">
          <h3>월간 목표</h3>
          <textarea placeholder="이번 달에 꼭 이루고 싶은 것들을 적어보세요." />
        </section>
      </div>
    </AppShell>
  );
}

export default MonthlyPlannerScreen;

