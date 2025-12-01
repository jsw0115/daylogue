// FILE: src/main/frontend/src/screens/plan/MonthlyPlannerScreen.jsx
import React, { useEffect, useState } from "react";
import { fetchDailyPlan } from "../../shared/api/plannerApi";
import { formatDateKorean, todayStr } from "../../shared/utils/dateUtils";
import {
  buildMonthMatrix,
  parseISO,
  toISO,
} from "../../shared/utils/calendarUtils";
import { useAppMode, APP_MODES } from "../../shared/context/AppModeContext";
import PlannerTabs from "./PlannerTabs";

function modeShort(mode) {
  switch (mode) {
    case APP_MODES.J:
      return "계획 중심";
    case APP_MODES.P:
      return "기록 중심";
    case APP_MODES.B:
    default:
      return "Plan + Actual";
  }
}

function normalizeDailyPlan(data, date) {
  const goals = data?.goals || [];
  return {
    date: data?.date || date,
    goals,
  };
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function MonthlyPlannerScreen() {
  const { mode } = useAppMode();
  const today = todayStr();
  const todayDate = parseISO(today);

  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedDayPlan, setSelectedDayPlan] = useState(null);

  const monthCells = buildMonthMatrix(currentYear, currentMonth);

  useEffect(() => {
    let cancelled = false;
    async function loadDaily() {
      try {
        const data = await fetchDailyPlan(selectedDate);
        if (cancelled) return;
        setSelectedDayPlan(normalizeDailyPlan(data, selectedDate));
      } catch (e) {
        if (cancelled) return;
        setSelectedDayPlan({
          date: selectedDate,
          goals: [],
        });
      }
    }
    loadDaily();
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 1) {
        setCurrentYear((y) => y - 1);
        return 12;
      }
      return prevMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 12) {
        setCurrentYear((y) => y + 1);
        return 1;
      }
      return prevMonth + 1;
    });
  };

  const handleTodayMonth = () => {
    const now = new Date();
    const iso = toISO(now);
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
    setSelectedDate(iso);
  };

  const handleSelectDate = (dateStr) => {
    const d = parseISO(dateStr);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth() + 1);
    setSelectedDate(dateStr);
  };

  const isToday = (dateStr) => dateStr === today;
  const isSelected = (dateStr) => dateStr === selectedDate;

  const titleLabel = `${currentYear}년 ${String(currentMonth).padStart(
    2,
    "0"
  )}월`;

  return (
    <div className="screen monthly-planner-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">월간 플래너</h1>
          <p className="screen-header__subtitle">
            {titleLabel} · {modeShort(mode)}
          </p>
        </div>
        <PlannerTabs />
      </header>

      <div className="monthly-grid">
        {/* 좌: 월간 캘린더 */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <div className="dashboard-card__title-row">
              <h3 className="dashboard-card__title">월간 캘린더</h3>
              <span className="dashboard-card__subtitle">
                한 달의 큰 그림을 캘린더로 보기
              </span>
            </div>
          </div>

          <div className="week-calendar-card__header">
            <div className="week-calendar-nav">
              <button type="button" onClick={handlePrevMonth}>
                이전
              </button>
              <span className="week-calendar-range">{titleLabel}</span>
              <button type="button" onClick={handleNextMonth}>
                다음
              </button>
            </div>
            <button
              type="button"
              className="ghost-button"
              onClick={handleTodayMonth}
            >
              이번 달
            </button>
          </div>

          <div className="month-calendar-wrapper">
            <table className="month-calendar">
              <thead>
                <tr>
                  {WEEKDAYS.map((w) => (
                    <th key={w}>{w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, rowIndex) => {
                  const rowCells = monthCells.slice(rowIndex * 7, rowIndex * 7 + 7);
                  return (
                    <tr key={rowIndex}>
                      {rowCells.map((cell) => {
                        const className = [
                          "month-calendar__day",
                          !cell.inCurrentMonth &&
                            "month-calendar__day--outside",
                          isToday(cell.dateStr) &&
                            "month-calendar__day--today",
                          isSelected(cell.dateStr) &&
                            "month-calendar__day--selected",
                        ]
                          .filter(Boolean)
                          .join(" ");
                        return (
                          <td key={cell.dateStr}>
                            <div
                              className={className}
                              onClick={() => handleSelectDate(cell.dateStr)}
                            >
                              <div className="month-calendar__day-label">
                                {cell.day}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 우: 선택한 하루 요약 */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <div className="dashboard-card__title-row">
              <h3 className="dashboard-card__title">선택한 하루</h3>
              <span className="dashboard-card__subtitle">
                {formatDateKorean(selectedDate)}
              </span>
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--color-muted)",
                marginBottom: 4,
              }}
            >
              목표 / 주요 일정
            </div>
            <ul className="planner-day-list">
              {(selectedDayPlan?.goals || []).length > 0 ? (
                selectedDayPlan.goals.map((goal, idx) => (
                  <li key={idx}>
                    <span>·</span>
                    <span>{goal}</span>
                  </li>
                ))
              ) : (
                <li style={{ fontSize: 12, color: "var(--color-muted)" }}>
                  아직 등록된 목표가 없습니다.
                </li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MonthlyPlannerScreen;
