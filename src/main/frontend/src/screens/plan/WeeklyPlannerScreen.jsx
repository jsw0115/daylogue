// FILE: src/screens/plan/WeeklyPlannerScreen.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { todayStr, formatDateKorean } from "../../shared/utils/dateUtils";
import { parseTimeToMinutes, minutesToTime } from "../../shared/utils/timeUtils";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

// ===== 주차 계산 유틸 =====

function getWeekStart(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 = Sun, 1 = Mon ...
  const diff = (day === 0 ? -6 : 1 - day); // 월요일 기준
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function addDaysStr(dateStr, diff) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function getWeekIndexLabel(weekStartStr) {
  const d = new Date(weekStartStr);
  const year = d.getFullYear();

  // ISO week number
  const tmp = new Date(Date.UTC(year, d.getMonth(), d.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);

  return { year, weekNo };
}

// ===== 더미 데이터 (PLAN/ACTUAL 타임블록) =====
// 열품타 스타일: date, start, end, categoryKey, title, memo, type

const WEEK_TEMPLATE = [
  {
    offsetDay: 0,
    start: "06:00",
    end: "07:00",
    categoryKey: "health",
    title: "아침 운동",
    memo: "스트레칭 + 러닝",
    type: "ACTUAL",
  },
  {
    offsetDay: 0,
    start: "09:00",
    end: "12:00",
    categoryKey: "work",
    title: "업무 1",
    memo: "팀 미팅 / 보고",
    type: "PLAN",
  },
  {
    offsetDay: 0,
    start: "13:00",
    end: "15:00",
    categoryKey: "work",
    title: "업무 2",
    memo: "개발 작업",
    type: "ACTUAL",
  },
  {
    offsetDay: 1,
    start: "20:00",
    end: "22:00",
    categoryKey: "study",
    title: "SQLD 공부",
    memo: "1강 완강",
    type: "ACTUAL",
  },
  {
    offsetDay: 2,
    start: "19:00",
    end: "21:00",
    categoryKey: "study",
    title: "React 리팩터링",
    memo: "타임바 UI 수정",
    type: "PLAN",
  },
  {
    offsetDay: 3,
    start: "18:00",
    end: "19:00",
    categoryKey: "family",
    title: "가족 저녁",
    memo: "외식",
    type: "ACTUAL",
  },
  {
    offsetDay: 4,
    start: "21:00",
    end: "22:30",
    categoryKey: "rest",
    title: "휴식",
    memo: "넷플릭스",
    type: "ACTUAL",
  },
];

function buildWeekBlocks(weekStartDate) {
  return WEEK_TEMPLATE.map((item, idx) => {
    const date = addDaysStr(weekStartDate, item.offsetDay);
    const startMinutes = parseTimeToMinutes(item.start);
    const endMinutes = parseTimeToMinutes(item.end);
    return {
      id: `w-${idx}`,
      date,
      startMinutes,
      endMinutes,
      categoryKey: item.categoryKey,
      title: item.title,
      memo: item.memo,
      type: item.type, // PLAN / ACTUAL
    };
  });
}

// ===== 집계 유틸 =====

function aggregateByCategory(blocks, categories) {
  const map = new Map();
  blocks.forEach((b) => {
    const duration = b.endMinutes - b.startMinutes;
    if (duration <= 0) return;
    const prev = map.get(b.categoryKey) || { minutes: 0, count: 0 };
    map.set(b.categoryKey, {
      minutes: prev.minutes + duration,
      count: prev.count + 1,
    });
  });

  const result = Array.from(map.entries()).map(([key, value]) => {
    const cat =
      categories.find((c) => c.key === key) || {
        key,
        name: key,
        color: "#9ca3af",
      };
    return {
      key,
      name: cat.name,
      color: cat.color,
      minutes: value.minutes,
      count: value.count,
    };
  });

  const totalMinutes = result.reduce((sum, r) => sum + r.minutes, 0);
  result.sort((a, b) => b.minutes - a.minutes);

  return { categoriesSummary: result, totalMinutes };
}

function buildDonutGradient(summary) {
  const total = summary.reduce((sum, s) => sum + s.minutes, 0);
  if (total === 0) {
    // 회색 기본
    return "conic-gradient(#e5e7eb 0deg 360deg)";
  }

  let acc = 0;
  const parts = summary.map((s) => {
    const start = (acc / total) * 360;
    const end = ((acc + s.minutes) / total) * 360;
    acc += s.minutes;
    return `${s.color} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${parts.join(", ")})`;
}

function minutesToHourText(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

// ===== 메인 컴포넌트 =====

export default function WeeklyPlannerScreen() {
  const navigate = useNavigate();
  const [weekStartDate, setWeekStartDate] = useState(
    getWeekStart(todayStr())
  );
  const [viewMode, setViewMode] = useState("PLAN"); // PLAN / ACTUAL
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(null);

  const weekLabel = getWeekIndexLabel(weekStartDate);
  const categories = DEFAULT_CATEGORIES;

  const blocks = useMemo(
    () => buildWeekBlocks(weekStartDate),
    [weekStartDate]
  );

  const filteredBlocks = useMemo(
    () => blocks.filter((b) => b.type === viewMode),
    [blocks, viewMode]
  );

  const { categoriesSummary, totalMinutes } = useMemo(
    () => aggregateByCategory(filteredBlocks, categories),
    [filteredBlocks, categories]
  );

  const donutBackground = buildDonutGradient(categoriesSummary);

  const top5 = categoriesSummary.slice(0, 5);

  const tasksByCategory = useMemo(() => {
    const map = new Map();
    filteredBlocks.forEach((b) => {
      const duration = b.endMinutes - b.startMinutes;
      if (duration <= 0) return;
      const prev = map.get(b.categoryKey) || [];
      map.set(b.categoryKey, [
        ...prev,
        {
          id: b.id,
          date: b.date,
          title: b.title,
          duration,
          timeRange: `${minutesToTime(b.startMinutes)} ~ ${minutesToTime(
            b.endMinutes
          )}`,
        },
      ]);
    });

    // 정렬 (duration desc)
    Array.from(map.keys()).forEach((key) => {
      map.get(key).sort((a, b) => b.duration - a.duration);
    });

    return map;
  }, [filteredBlocks]);

  const selectedTasks =
    selectedCategoryKey && tasksByCategory.get(selectedCategoryKey);

  const plannedBlocks = blocks.filter((b) => b.type === "PLAN");
  const actualBlocks = blocks.filter((b) => b.type === "ACTUAL");
  const plannedMinutes = plannedBlocks.reduce(
    (sum, b) => sum + (b.endMinutes - b.startMinutes),
    0
  );
  const actualMinutes = actualBlocks.reduce(
    (sum, b) => sum + (b.endMinutes - b.startMinutes),
    0
  );
  const completionRate =
    plannedMinutes > 0
      ? Math.round((actualMinutes / plannedMinutes) * 100)
      : 0;

  const handlePrevWeek = () => {
    setWeekStartDate((prev) => addDaysStr(prev, -7));
  };
  const handleThisWeek = () => {
    setWeekStartDate(getWeekStart(todayStr()));
  };
  const handleNextWeek = () => {
    setWeekStartDate((prev) => addDaysStr(prev, 7));
  };

  const goDaily = () => navigate("/plan/daily");
  const goMonthly = () => navigate("/plan/monthly");
  const goYearly = () => navigate("/plan/yearly");

  return (
    <div className="screen weekly-planner-screen">
      {/* 헤더 */}
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">주간 플래너</h1>
          <p className="screen-header__subtitle">
            {weekLabel.year}년 {weekLabel.weekNo}주차 · 주간 계획 &amp; 리뷰
          </p>
          <p className="screen-header__subtitle">
            기준일: {formatDateKorean(weekStartDate)} (월 시작)
          </p>
        </div>

        <div className="planner-header__controls">
          <div className="planner-header__row">
            <div className="planner-date-nav">
              <button
                type="button"
                className="planner-date-nav-button"
                onClick={handlePrevWeek}
              >
                이전 주
              </button>
              <button
                type="button"
                className="planner-date-nav-button planner-date-nav-button--today"
                onClick={handleThisWeek}
              >
                이번 주
              </button>
              <button
                type="button"
                className="planner-date-nav-button"
                onClick={handleNextWeek}
              >
                다음 주
              </button>
            </div>

            <div className="planner-tabs">
              <div className="tabbar">
                <button className="tabbar__item" onClick={goDaily}>
                  일간
                </button>
                <button className="tabbar__item tabbar__item--active">
                  주간
                </button>
                <button className="tabbar__item" onClick={goMonthly}>
                  월간
                </button>
                <button className="tabbar__item" onClick={goYearly}>
                  연간
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 – 좌: 주간 타임테이블, 우: 요약/리포트 */}
      <div className="weekly-grid">
        {/* LEFT: 주간 타임테이블 */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <div className="dashboard-card__title-row">
              <h2 className="dashboard-card__title">주간 타임테이블</h2>
              <span className="dashboard-card__subtitle">
                한 주 동안의 카테고리별 시간 분포를 확인해 보세요.
              </span>
            </div>
          </div>

          <WeeklyTimeTable
            weekStartDate={weekStartDate}
            blocks={blocks}
            categories={categories}
          />
        </section>

        {/* RIGHT: 요약 / 원형 그래프 / TOP5 */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <div className="dashboard-card__title-row">
              <h2 className="dashboard-card__title">카테고리별 시간 &amp; 작업 요약</h2>
              <span className="dashboard-card__subtitle">
                이번 주에 어떤 카테고리에 시간을 썼는지 한눈에 확인해요.
              </span>
            </div>
            <div className="tabbar">
              <button
                type="button"
                className={
                  "tabbar__item" +
                  (viewMode === "PLAN" ? " tabbar__item--active" : "")
                }
                onClick={() => setViewMode("PLAN")}
              >
                계획
              </button>
              <button
                type="button"
                className={
                  "tabbar__item" +
                  (viewMode === "ACTUAL" ? " tabbar__item--active" : "")
                }
                onClick={() => setViewMode("ACTUAL")}
              >
                실행
              </button>
            </div>
          </div>

          {/* 도넛 + 요약 */}
          <div className="weekly-summary">
            <div className="weekly-summary__donut">
              <div
                className="weekly-donut"
                style={{ backgroundImage: donutBackground }}
              >
                <div className="weekly-donut__center">
                  <div className="weekly-donut__percent">
                    {totalMinutes > 0
                      ? Math.round(
                          (totalMinutes / (24 * 60 * 7)) * 100
                        )
                      : 0}
                    %
                  </div>
                  <div className="weekly-donut__label">
                    이번 주 24시간 × 7 기준
                  </div>
                  <div className="weekly-donut__time">
                    {minutesToHourText(totalMinutes)}
                  </div>
                </div>
              </div>
            </div>

            <div className="weekly-summary__right">
              <div className="weekly-summary__stat">
                <strong>완료율</strong>
                <span>
                  {completionRate}%{" "}
                  <span className="weekly-summary__stat-note">
                    (계획 {minutesToHourText(plannedMinutes)} / 실행{" "}
                    {minutesToHourText(actualMinutes)})
                  </span>
                </span>
              </div>

              <div className="weekly-summary__top">
                <div className="weekly-summary__top-header">
                  <strong>TOP5 카테고리</strong>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => navigate("/settings/profile")}
                  >
                    카테고리 편집
                  </button>
                </div>
                <ul className="weekly-summary__top-list">
                  {top5.length === 0 && (
                    <li className="weekly-summary__empty">
                      아직 기록된 시간이 없습니다.
                    </li>
                  )}
                  {top5.map((c) => (
                    <li
                      key={c.key}
                      className={
                        "weekly-summary__top-item" +
                        (selectedCategoryKey === c.key
                          ? " weekly-summary__top-item--active"
                          : "")
                      }
                      onClick={() =>
                        setSelectedCategoryKey(
                          selectedCategoryKey === c.key ? null : c.key
                        )
                      }
                    >
                      <span
                        className="weekly-summary__top-dot"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="weekly-summary__top-name">
                        {c.name}
                      </span>
                      <span className="weekly-summary__top-time">
                        {Math.round((c.minutes / totalMinutes) * 100) || 0}
                        % · {minutesToHourText(c.minutes)} · {c.count}개
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 선택된 카테고리 작업 목록 */}
          <div className="weekly-summary__tasks">
            <h3 className="weekly-summary__tasks-title">
              사용 목록
              {selectedCategoryKey &&
                ` – ${
                  categories.find((c) => c.key === selectedCategoryKey)?.name ??
                  selectedCategoryKey
                }`}
            </h3>
            {!selectedTasks && (
              <p className="weekly-summary__empty">
                카테고리를 선택하면 이번 주 해당 카테고리에서 했던
                작업 목록이 시간 순으로 나타납니다.
              </p>
            )}
            {selectedTasks && (
              <ul className="weekly-summary__task-list">
                {selectedTasks.map((t) => (
                  <li key={t.id} className="weekly-summary__task-item">
                    <div className="weekly-summary__task-main">
                      <span className="weekly-summary__task-title">
                        {t.title}
                      </span>
                      <span className="weekly-summary__task-time">
                        {minutesToHourText(t.duration)} · {t.timeRange}
                      </span>
                    </div>
                    <div className="weekly-summary__task-date">
                      {formatDateKorean(t.date)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// ===== 서브 컴포넌트: WeeklyTimeTable =====

function WeeklyTimeTable({ weekStartDate, blocks, categories }) {
  const days = Array.from({ length: 7 }).map((_, idx) => {
    const date = addDaysStr(weekStartDate, idx);
    const d = new Date(date);
    const weekday = ["월", "화", "수", "목", "금", "토", "일"][idx];
    return {
      key: idx,
      label: `${weekday}`,
      date,
      dateLabel: `${d.getMonth() + 1}/${d.getDate()}`,
    };
  });

  const categoryMap = new Map(
    categories.map((c) => [c.key, c.color])
  );

  const dayBlocks = days.map((day) => {
    const list = blocks
      .filter((b) => b.date === day.date)
      .map((b) => ({
        ...b,
        duration: b.endMinutes - b.startMinutes,
      }))
      .filter((b) => b.duration > 0)
      .sort((a, b) => a.startMinutes - b.startMinutes);
    return { day, blocks: list };
  });

  return (
    <div className="weekly-timetable">
      {dayBlocks.map(({ day, blocks: list }) => (
        <div key={day.key} className="weekly-timetable__row">
          <div className="weekly-timetable__day">
            <div className="weekly-timetable__day-name">{day.label}</div>
            <div className="weekly-timetable__day-date">
              {day.dateLabel}
            </div>
          </div>
          <div className="weekly-timetable__bar">
            {list.length === 0 && (
              <div className="weekly-timetable__bar-empty">
                기록 없음
              </div>
            )}
            {list.map((b) => (
              <div
                key={b.id}
                className={
                  "weekly-timetable__segment" +
                  (b.type === "PLAN"
                    ? " weekly-timetable__segment--plan"
                    : " weekly-timetable__segment--actual")
                }
                style={{
                  flexGrow: b.duration,
                  backgroundColor:
                    categoryMap.get(b.categoryKey) || "#e5e7eb",
                }}
                title={`${minutesToTime(b.startMinutes)}~${minutesToTime(
                  b.endMinutes
                )} ${b.title}`}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="weekly-timetable__legend">
        {categories.map((c) => (
          <div key={c.key} className="weekly-timetable__legend-item">
            <span
              className="weekly-timetable__legend-dot"
              style={{ backgroundColor: c.color }}
            />
            <span>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
