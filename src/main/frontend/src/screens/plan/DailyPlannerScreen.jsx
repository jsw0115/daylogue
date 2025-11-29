// src/main/frontend/src/screens/plan/DailyPlannerScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import { useResponsiveLayout } from "../../shared/hooks/useResponsiveLayout";
import TimebarTimeline from "../../components/planner/TimebarTimeline";
import DashboardCard from "../../components/dashboard/DashboardCard";

const mockBlocks = [
  {
    id: "b1",
    start: "06:30",
    end: "07:00",
    categoryId: "health",
    title: "아침 스트레칭",
    planOrActual: "actual",
  },
  {
    id: "b2",
    start: "09:00",
    end: "11:30",
    categoryId: "work",
    title: "업무 집중 타임",
    planOrActual: "plan",
  },
  {
    id: "b3",
    start: "21:00",
    end: "23:00",
    categoryId: "study",
    title: "SQLD 공부",
    planOrActual: "actual",
  },
];

function DailyPlannerScreen() {
  const viewport = useResponsiveLayout();
  const [date] = useState("2025-03-16");
  const [blocks] = useState(mockBlocks);

  const isDesktop = viewport === "desktop";

  return (
    <AppShell title="일간 플래너">
      <div className={`screen screen--daily-planner screen--${viewport}`}>
        <header className="screen-header">
          <div className="screen-header__left">
            <button className="ghost-button">◀</button>
            <button className="ghost-button">오늘</button>
            <button className="ghost-button">▶</button>
          </div>
          <div className="screen-header__center">
            <h2>2025년 3월 16일 (일)</h2>
          </div>
          <div className="screen-header__right">
            <button className="emoji-button">🙂</button>
            <button className="ghost-button">⋯</button>
          </div>
        </header>

        <div
          className={
            isDesktop
              ? "daily-layout daily-layout--desktop"
              : "daily-layout daily-layout--stack"
          }
        >
          <section className="daily-layout__main">
            <TimebarTimeline
              date={date}
              blocks={blocks}
              viewport={viewport}
              onBlockClick={(b) => console.log("block click", b)}
            />
          </section>

          <section className="daily-layout__side">
            <DashboardCard title="오늘 요약">
              <ul className="summary-list">
                <li>
                  <span>공부</span>
                  <strong>3h 00m</strong>
                </li>
                <li>
                  <span>업무</span>
                  <strong>5h 30m</strong>
                </li>
                <li>
                  <span>건강</span>
                  <strong>0h 30m</strong>
                </li>
              </ul>
            </DashboardCard>

            <DashboardCard title="일간 회고">
              <div className="reflection-group">
                <label>
                  잘한 점
                  <textarea placeholder="오늘 내가 잘한 것들을 적어보세요." />
                </label>
                <label>
                  아쉬운 점
                  <textarea placeholder="다음에는 이렇게 해보면 좋겠다는 점." />
                </label>
                <label>
                  내일을 위해
                  <textarea placeholder="내일의 나에게 남기고 싶은 한마디." />
                </label>
              </div>
            </DashboardCard>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

export default DailyPlannerScreen;
