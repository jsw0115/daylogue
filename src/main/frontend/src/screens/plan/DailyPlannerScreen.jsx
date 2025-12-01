// FILE: src/main/frontend/src/screens/plan/DailyPlannerScreen.jsx
import React, { useEffect, useState } from "react";
import { fetchDailyPlan } from "../../shared/api/plannerApi";
import { formatDateKorean, todayStr } from "../../shared/utils/dateUtils";
import { useTimeRange } from "../../shared/hooks/useTimeRange";
import { addDays } from "../../shared/utils/calendarUtils";
import { useAppMode, APP_MODES } from "../../shared/context/AppModeContext";
import PlannerTabs from "./PlannerTabs";

function transformPlan(data, date) {
  const goals = data?.goals || [];
  let blocks = data?.blocks || [];

  // 블록이 없으면 목표를 기반으로 간단한 '계획' 블록 생성
  if (!blocks.length && goals.length) {
    blocks = goals.map((goal, index) => ({
      id: `goal-${index}`,
      start: `${String(9 + index).padStart(2, "0")}:00`,
      end: `${String(10 + index).padStart(2, "0")}:00`,
      title: goal,
      type: "plan",
    }));
  }

  return {
    date: data?.date || date,
    goals,
    blocks,
  };
}

function buildFallbackDailyPlan(date) {
  return transformPlan(
    {
      date,
      goals: ["집중 작업 2시간", "운동 30분"],
      blocks: [],
    },
    date
  );
}

function modeDescription(mode) {
  switch (mode) {
    case APP_MODES.J:
      return "계획 먼저 보는 J 모드";
    case APP_MODES.P:
      return "흐름/기록 위주 P 모드";
    case APP_MODES.B:
    default:
      return "Plan + Actual 같이 보는 B 모드";
  }
}

function DailyTimebar({ blocks }) {
  const { minutesInDay, toMinute } = useTimeRange();
  const TRACK_HEIGHT = 540;
  const hours = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  return (
    <div
      className="timebar-wrapper"
      style={{ maxHeight: `${TRACK_HEIGHT + 16}px` }}
    >
      <div className="timebar-axis" style={{ height: `${TRACK_HEIGHT}px` }}>
        {hours.map((h) => {
          const top = (h * 60 * TRACK_HEIGHT) / minutesInDay;
          const label = `${String(h).padStart(2, "0")}:00`;
          return (
            <div
              key={h}
              className="timebar-axis__label"
              style={{ top: `${top}px` }}
            >
              {label}
            </div>
          );
        })}
      </div>

      <div className="timebar-grid">
        <div className="timebar-grid__background">
          {hours.map((h) => {
            const top = (h * 60 * TRACK_HEIGHT) / minutesInDay;
            return (
              <div
                key={h}
                className="timebar-grid__hour-line"
                style={{ top: `${top}px` }}
              />
            );
          })}
        </div>

        <div
          className="timebar-grid__blocks"
          style={{ height: `${TRACK_HEIGHT}px` }}
        >
          {blocks.map((block) => {
            const startMin = toMinute(block.start);
            const endMin = toMinute(block.end);
            const top = (startMin * TRACK_HEIGHT) / minutesInDay;
            const duration = Math.max(endMin - startMin, 30); // 최소 30분
            const height = (duration * TRACK_HEIGHT) / minutesInDay;

            const isPlan = block.type === "plan";

            const className = [
              "timebar-block",
              isPlan ? "timebar-block--plan" : "timebar-block--actual",
            ]
              .filter(Boolean)
              .join(" ");

            const style = isPlan
              ? {
                  top: `${top}px`,
                  height: `${height}px`,
                  borderColor: "var(--color-primary)",
                  background: "var(--color-surface-soft)",
                }
              : {
                  top: `${top}px`,
                  height: `${height}px`,
                  borderColor: "var(--color-primary)",
                  background: "var(--color-primary)",
                  color: "var(--color-bg)",
                };

            return (
              <div key={block.id} className={className} style={style}>
                <div className="timebar-block__label">
                  <span className="timebar-block__category">
                    {isPlan ? "계획" : "기록"}
                  </span>
                  <span className="timebar-block__time">
                    {block.start} ~ {block.end}
                  </span>
                </div>
                <div className="timebar-block__title">{block.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DailyPlannerScreen() {
  const today = todayStr();
  const [selectedDate, setSelectedDate] = useState(today);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState("");
  const { mode } = useAppMode();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchDailyPlan(selectedDate);
        if (cancelled) return;
        setPlan(transformPlan(data, selectedDate));
      } catch (e) {
        if (cancelled) return;
        setPlan(buildFallbackDailyPlan(selectedDate));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const handlePrevDay = () => {
    setSelectedDate((prev) => addDays(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(today);
  };

  const headerSubtitle = `${formatDateKorean(selectedDate)} · ${modeDescription(
    mode
  )}`;

  return (
    <div className="screen daily-planner-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">일간 플래너</h1>
          <p className="screen-header__subtitle">{headerSubtitle}</p>
        </div>
        <PlannerTabs />
      </header>

      <div className="planner-layout">
        {/* 좌: 타임바 + 날짜 네비게이션 */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <div className="dashboard-card__title-row">
              <h3 className="dashboard-card__title">오늘의 타임라인</h3>
              <span className="dashboard-card__subtitle">
                계획 / 기록을 시간 순서로 보기
              </span>
            </div>
            <div className="week-calendar-nav">
              <button type="button" onClick={handlePrevDay}>
                이전
              </button>
              <span className="week-calendar-range">
                {formatDateKorean(selectedDate)}
              </span>
              <button type="button" onClick={handleNextDay}>
                다음
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={handleToday}
              >
                오늘
              </button>
            </div>
          </div>

          {loading && <div style={{ fontSize: 12 }}>불러오는 중...</div>}

          {plan && <DailyTimebar blocks={plan.blocks || []} />}
        </section>

        {/* 우: 목표 / 메모 카드 */}
        <section className="planner-layout__right">
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <div className="dashboard-card__title-row">
                <h3 className="dashboard-card__title">오늘의 목표</h3>
                <span className="dashboard-card__subtitle">
                  해야 할 일 / 집중 포인트
                </span>
              </div>
            </div>
            <ul className="planner-day-list">
              {(plan?.goals || []).length > 0 ? (
                plan.goals.map((goal, idx) => (
                  <li key={idx}>
                    <span>·</span>
                    <span>{goal}</span>
                  </li>
                ))
              ) : (
                <li style={{ fontSize: 12, color: "var(--color-muted)" }}>
                  오늘의 목표를 추가해보세요.
                </li>
              )}
            </ul>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <div className="dashboard-card__title-row">
                <h3 className="dashboard-card__title">한 줄 회고</h3>
                <span className="dashboard-card__subtitle">
                  오늘 하루를 짧게 남겨두기
                </span>
              </div>
            </div>
            <textarea
              className="home-oneline"
              placeholder="오늘 하루를 한 줄로 적어보세요."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default DailyPlannerScreen;
