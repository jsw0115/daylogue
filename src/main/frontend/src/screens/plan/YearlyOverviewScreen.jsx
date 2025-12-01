// FILE: src/main/frontend/src/screens/plan/YearlyOverviewScreen.jsx
import React, { useState } from "react";
import { todayStr } from "../../shared/utils/dateUtils";
import { useAppMode, APP_MODES } from "../../shared/context/AppModeContext";
import PlannerTabs from "./PlannerTabs";

function modeShort(mode) {
  switch (mode) {
    case APP_MODES.J:
      return "연간 목표/계획 중심";
    case APP_MODES.P:
      return "연간 기록/패턴 중심";
    case APP_MODES.B:
    default:
      return "목표와 기록을 함께 보기";
  }
}

function buildYearMonths(year) {
  return Array.from({ length: 12 }).map((_, idx) => ({
    month: idx + 1,
    label: `${year}년 ${String(idx + 1).padStart(2, "0")}월`,
  }));
}

// 간단히 월별 "활동 레벨"을 만든 더미 로직 (차후 통계 API 연동 가능)
function buildMonthActivity(month) {
  const level = (month % 4) + 2; // 2~5 정도
  return Array.from({ length: 7 }).map((_, idx) => idx < level);
}

function YearlyOverviewScreen() {
  const today = todayStr();
  const [currentYear, setCurrentYear] = useState(
    new Date(today).getFullYear()
  );
  const { mode } = useAppMode();

  const months = buildYearMonths(currentYear);

  const handlePrevYear = () => {
    setCurrentYear((y) => y - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((y) => y + 1);
  };

  const titleLabel = `${currentYear}년 연간 플래너`;

  return (
    <div className="screen yearly-overview-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">연간 플래너</h1>
          <p className="screen-header__subtitle">
            {titleLabel} · {modeShort(mode)}
          </p>
        </div>
        <PlannerTabs />
      </header>

      <div
        className="dashboard-card"
        style={{ marginBottom: 16, paddingBottom: 10 }}
      >
        <div className="week-calendar-card__header">
          <div className="week-calendar-nav">
            <button type="button" onClick={handlePrevYear}>
              이전
            </button>
            <span className="week-calendar-range">{currentYear}년</span>
            <button type="button" onClick={handleNextYear}>
              다음
            </button>
          </div>
        </div>
      </div>

      <div className="yearly-grid">
        {months.map((m) => {
          const activity = buildMonthActivity(m.month);
          return (
            <section
              key={m.month}
              className="dashboard-card yearly-month-card"
            >
              <div className="yearly-month-card__header">
                <div className="yearly-month-card__title">{m.label}</div>
                <div className="yearly-month-card__meta">
                  월간 플래너 / 통계에서 상세 보기
                </div>
              </div>
              <div className="yearly-month-card__heat">
                {activity.map((active, idx) => (
                  <div
                    key={idx}
                    className={
                      active
                        ? "yearly-month-card__dot yearly-month-card__dot--active"
                        : "yearly-month-card__dot"
                    }
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default YearlyOverviewScreen;
