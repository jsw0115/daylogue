// FILE: src/main/frontend/src/screens/plan/WeeklyPlannerScreen.jsx
import React, { useEffect, useState } from "react";
import { fetchDailyPlan, fetchWeeklySummary } from "../../shared/api/plannerApi";
import { formatDateKorean, todayStr } from "../../shared/utils/dateUtils";
import { formatDurationMinutes } from "../../shared/utils/formatUtils";
import {
  addDays,
  buildWeekDays,
  getWeekStart,
} from "../../shared/utils/calendarUtils";
import { useAppMode, APP_MODES } from "../../shared/context/AppModeContext";
import PlannerTabs from "./PlannerTabs";

function sumSlices(slices) {
  if (!slices) return 0;
  return slices.reduce((acc, cur) => acc + (cur.minutes || 0), 0);
}

function buildFallbackWeeklySummary(weekStartStr) {
  const days = buildWeekDays(weekStartStr);
  return {
    weekStartDate: weekStartStr,
    days: days.map((d, index) => {
      const total = 120 + index * 30;
      const slices = [
        { categoryId: "study", minutes: Math.round(total * 0.4) },
        { categoryId: "work", minutes: Math.round(total * 0.3) },
        { categoryId: "health", minutes: Math.round(total * 0.2) },
      ];
      return {
        date: d.dateStr,
        slices,
        totalMinutes: total,
      };
    }),
  };
}

function normalizeWeeklySummary(raw, weekStartStr) {
  if (!raw) return buildFallbackWeeklySummary(weekStartStr);

  if (Array.isArray(raw.days)) {
    const days = raw.days.map((day) => {
      const total =
        typeof day.totalMinutes === "number"
          ? day.totalMinutes
          : sumSlices(day.slices || []);
      return {
        date: day.date,
        slices: day.slices || [],
        totalMinutes: total,
      };
    });
    return { weekStartDate: raw.weekStartDate || weekStartStr, days };
  }

  if (Array.isArray(raw)) {
    const days = raw.map((day) => ({
      date: day.date,
      slices: day.slices || [],
      totalMinutes:
        typeof day.totalMinutes === "number"
          ? day.totalMinutes
          : sumSlices(day.slices || []),
    }));
    return { weekStartDate: weekStartStr, days };
  }

  return buildFallbackWeeklySummary(weekStartStr);
}

function normalizeDailyPlan(data, date) {
  const goals = data?.goals || [];
  return {
    date: data?.date || date,
    goals,
  };
}

function getCategoryColorVar(categoryId) {
  switch (categoryId) {
    case "study":
      return "var(--color-primary)";
    case "work":
      return "var(--color-accent-green)";
    case "family":
      return "var(--color-accent-pink)";
    case "health":
      return "var(--color-accent-green)";
    case "rest":
      return "var(--color-border)";
    default:
      return "var(--color-border)";
  }
}

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

function formatDateRange(start, end) {
  return `${formatDateKorean(start)} ~ ${formatDateKorean(end)}`;
}

function WeeklyPlannerScreen() {
  const { mode } = useAppMode();
  const today = todayStr();
  const [selectedDate, setSelectedDate] = useState(today);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [selectedDayPlan, setSelectedDayPlan] = useState(null);

  const weekStart = getWeekStart(selectedDate);
  const weekEnd = addDays(weekStart, 6);
  const weekDays = buildWeekDays(weekStart);

  useEffect(() => {
    let cancelled = false;
    async function loadWeekly() {
      try {
        const data = await fetchWeeklySummary(weekStart);
        if (cancelled) return;
        setWeeklySummary(normalizeWeeklySummary(data, weekStart));
      } catch (e) {
        if (cancelled) return;
        setWeeklySummary(buildFallbackWeeklySummary(weekStart));
      }
    }
    loadWeekly();
    return () => {
      cancelled = true;
    };
  }, [weekStart]);

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

  const handlePrevWeek = () => {
    setSelectedDate((prev) => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate((prev) => addDays(prev, 7));
  };

  const handleToday = () => {
    setSelectedDate(today);
  };

  const handleSelectDay = (dateStr) => {
    setSelectedDate(dateStr);
  };

  const summaryForSelected =
    weeklySummary?.days?.find((d) => d.date === selectedDate) || null;

  const totalMinutes =
    summaryForSelected?.totalMinutes ||
    sumSlices(summaryForSelected?.slices || []);

  return (
    <div className="screen weekly-planner-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">주간 플래너</h1>
          <p className="screen-header__subtitle">
            {formatDateRange(weekStart, weekEnd)} · {modeShort(mode)}
          </p>
        </div>
        <PlannerTabs />
      </header>

      <div className="weekly-grid">
        {/* 좌: 한 주 캘린더 */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <div className="dashboard-card__title-row">
              <h3 className="dashboard-card__title">주간 캘린더</h3>
              <span className="dashboard-card__subtitle">
                한 주의 계획/기록 분포를 한눈에 보기
              </span>
            </div>
          </div>

          <div className="week-calendar-card__header">
            <div className="week-calendar-nav">
              <button type="button" onClick={handlePrevWeek}>
                이전
              </button>
              <span className="week-calendar-range">
                {formatDateRange(weekStart, weekEnd)}
              </span>
              <button type="button" onClick={handleNextWeek}>
                다음
              </button>
            </div>
            <button
              type="button"
              className="ghost-button"
              onClick={handleToday}
            >
              이번 주
            </button>
          </div>

          <div className="week-calendar">
            {weekDays.map((day) => {
              const daySummary =
                weeklySummary?.days?.find((d) => d.date === day.dateStr) || null;
              const minutes =
                daySummary?.totalMinutes || sumSlices(daySummary?.slices || []);
              const isToday = day.dateStr === today;
              const isSelected = day.dateStr === selectedDate;

              const className = [
                "week-calendar__day",
                isToday && "week-calendar__day--today",
                isSelected && "week-calendar__day--selected",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={day.dateStr}
                  className={className}
                  onClick={() => handleSelectDay(day.dateStr)}
                >
                  <div className="week-calendar__day-header">
                    <span className="week-calendar__weekday">
                      {day.weekday}
                    </span>
                    <span className="week-calendar__date">
                      {day.dateStr.slice(5)}
                    </span>
                  </div>
                  <div className="week-calendar__minutes">
                    {minutes > 0
                      ? `기록 ${formatDurationMinutes(minutes)}`
                      : "기록 없음"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 우: 선택한 하루 요약 (계획 + 히스토리) */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <div className="dashboard-card__title-row">
              <h3 className="dashboard-card__title">선택한 하루</h3>
              <span className="dashboard-card__subtitle">
                {formatDateKorean(selectedDate)} 기준
              </span>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 12,
                color: "var(--color-muted)",
                marginBottom: 4,
              }}
            >
              오늘의 목표
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

          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--color-muted)",
                marginBottom: 4,
              }}
            >
              시간 기록 요약
            </div>
            <div className="weekly-timebricks">
              <div className="weekly-timebricks__row weekly-timebricks__row--hovered">
                <div className="weekly-timebricks__label">
                  {formatDateKorean(selectedDate)}
                </div>
                <div className="weekly-timebricks__bar">
                  {summaryForSelected?.slices?.length && totalMinutes > 0 ? (
                    summaryForSelected.slices.map((slice, idx) => (
                      <div
                        key={`${slice.categoryId}-${idx}`}
                        className="weekly-timebricks__segment"
                        style={{
                          flexBasis: `${
                            (slice.minutes / totalMinutes) * 100
                          }%`,
                          background: getCategoryColorVar(slice.categoryId),
                        }}
                      />
                    ))
                  ) : (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--color-muted)",
                        paddingLeft: 6,
                      }}
                    >
                      기록된 시간이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {totalMinutes > 0 && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "var(--color-muted)",
                }}
              >
                총 기록 시간: {formatDurationMinutes(totalMinutes)}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default WeeklyPlannerScreen;
