// src/main/frontend/src/screens/plan/WeeklyPlannerScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import WeeklyTimeBricks from "../../components/planner/WeeklyTimeBricks";
import "../../styles/screens/planner.css";

const sampleWeek = [
  {
    day: "2025-03-17",
    segments: [
      { categoryId: "work", label: "업무", color: "#3B5BDB", ratio: 0.5 },
      { categoryId: "study", label: "공부", color: "#4F8BFF", ratio: 0.3 },
      { categoryId: "rest", label: "휴식", color: "#14B8A6", ratio: 0.2 },
    ],
  },
  {
    day: "2025-03-18",
    segments: [
      { categoryId: "work", label: "업무", color: "#3B5BDB", ratio: 0.7 },
      { categoryId: "rest", label: "휴식", color: "#14B8A6", ratio: 0.3 },
    ],
  },
  // ... 나머지 요일은 샘플
];

function WeeklyPlannerScreen() {
  return (
    <AppShell title="주간 플래너">
      <div className="screen weekly-planner-screen">
        <header className="screen-header">
          <h2>2025년 3월 3주차</h2>
        </header>

        <section className="weekly-goals">
          <h3>이번 주 목표</h3>
          <textarea placeholder="예: SQLD 공부 3회, 운동 2회, 블로그 글 1개" />
        </section>

        <section className="weekly-bricks-section">
          <h3>색으로 보는 한 주</h3>
          <WeeklyTimeBricks week={sampleWeek} />
        </section>
      </div>
    </AppShell>
  );
}

export default WeeklyPlannerScreen;

