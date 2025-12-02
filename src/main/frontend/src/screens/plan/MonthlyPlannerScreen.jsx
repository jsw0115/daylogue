// FILE: src/screens/plan/MonthlyPlannerScreen.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { todayStr, formatDateKorean } from "../../shared/utils/dateUtils";
import { parseTimeToMinutes } from "../../shared/utils/timeUtils";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

// ===== 월 계산 유틸 =====

function getMonthStart(dateStr) {
  const d = new Date(dateStr);
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

function addMonthsStr(dateStr, diff) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + diff);
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

function getMonthLabel(dateStr) {
  const d = new Date(dateStr);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function getDaysInMonth(startStr) {
  const start = new Date(startStr);
  const year = start.getFullYear();
  const month = start.getMonth(); // 0-based
  const last = new Date(year, month + 1, 0).getDate();
  const list = [];
  for (let i = 1; i <= last; i += 1) {
    const d = new Date(year, month, i);
    list.push(d.toISOString().slice(0, 10));
  }
  return list;
}

// ===== 더미 데이터 (월간 시간 기록) =====

const MONTH_TEMPLATE = [
  {
    day: 1,
    start: "09:00",
    end: "12:00",
    categoryKey: "work",
    type: "PLAN",
    title: "업무 1",
  },
  {
    day: 1,
    start: "20:00",
    end: "22:00",
    categoryKey: "study",
    type: "ACTUAL",
    title: "SQLD 공부",
  },
  {
    day: 3,
    start: "06:30",
    end: "07:30",
    categoryKey: "health",
    type: "ACTUAL",
    title: "아침 운동",
  },
  {
    day: 5,
    start: "19:00",
    end: "21:00",
    categoryKey: "study",
    type: "PLAN",
    title: "React 리팩터링",
  },
  {
    day: 10,
    start: "18:00",
    end: "19:30",
    categoryKey: "family",
    type: "ACTUAL",
    title: "가족 외식",
  },
];

function buildMonthBlocks(monthStartStr) {
  const start = new Date(monthStartStr);
  return MONTH_TEMPLATE.map((item, idx) => {
    const d = new Date(start.getFullYear(), start.getMonth(), item.day);
    const date = d.toISOString().slice(0, 10);
    const startMinutes = parseTimeToMinutes(item.start);
    const endMinutes = parseTimeToMinutes(item.end);
    return {
      id: `m-${idx}`,
      date,
      startMinutes,
      endMinutes,
      categoryKey: item.categoryKey,
      title: item.title,
      type: item.type,
    };
  });
}

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

export default function MonthlyPlannerScreen() {
  const navigate = useNavigate();
  const [monthStart, setMonthStart] = useState(getMonthStart(todayStr()));
  const [viewMode, setViewMode] = useState("PLAN"); // PLAN / ACTUAL
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(null);

  const monthLabel = getMonthLabel(monthStart);
  const categories = DEFAULT_CATEGORIES;

  const blocks = useMemo(
    () => buildMonthBlocks(monthStart),
    [monthStart]
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

  const days = useMemo(() => getDaysInMonth(monthStart), [monthStart]);

  const blocksByDate = useMemo(() => {
    const map = new Map();
    blocks.forEach((b) => {
      const duration = b.endMinutes - b.startMinutes;
      if (duration <= 0) return;
      const prev = map.get(b.date) || { minutes: 0, items: [] };
      map.set(b.date, {
        minutes: prev.minutes + duration,
        items: [...prev.items, b],
      });
    });
    return map;
  }, [blocks]);

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
        },
      ]);
    });
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

  const handlePrevMonth = () => {
    setMonthStart((prev) => addMonthsStr(prev, -1));
  };
  const handleThisMonth = () => {
    setMonthStart(getMonthStart(todayStr()));
  };
  const handleNextMonth = () => {
    setMonthStart((prev) => addMonthsStr(prev, 1));
  };

  const goDaily = () => navigate("/plan/daily");
  const goWeekly = () => navigate("/plan/weekly");
  const goYearly = () => navigate("/plan/yearly");

  return (
    <div className="screen monthly-planner-screen">
      {/* 헤더 */}
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">월간 플래너</h1>
          <p className="screen-header__subtitle">
            {monthLabel.year}년 {monthLabel.month}월 · 월간 계획 &amp; 리뷰
          </p>
        </div>

        <div className="planner-header__controls">
          <div className="planner-header__row">
            <div className="planner-date-nav">
              <button
                type="button"
                className="planner-date-nav-button"
                onClick={handlePrevMonth}
              >
                이전 달
              </button>
              <button
                type="button"
                className="planner-date-nav-button planner-date-nav-button--today"
                onClick={handleThisMonth}
              >
                이번 달
              </button>
              <button
                type="button"
                className="planner-date-nav-button"
                onClick={handleNextMonth}
              >
                다음 달
              </button>
            </div>

            <div className="planner-tabs">
              <div className="tabbar">
                <button className="tabbar__item" onClick={goDaily}>
                  일간
                </button>
                <button className="tabbar__item" onClick={goWeekly}>
                  주간
                </button>
                <button className="tabbar__item tabbar__item--active">
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

      {/* 본문 레이아웃 */}
      <div className="monthly-grid">
        {/* LEFT: 월간 캘린더 */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <div className="dashboard-card__title-row">
              <h2 className="dashboard-card__title">월간 캘린더</h2>
              <span className="dashboard-card__subtitle">
                날짜별로 어떤 카테고리에 시간을 썼는지 간단히 확인해요.
              </span>
            </div>
          </div>

          <MonthlyCalendar
            monthStart={monthStart}
            days={days}
            blocksByDate={blocksByDate}
            categories={categories}
            onClickDay={(date) => {
              // TODO: 필요하면 /plan/daily?date= 로 이동하도록 개선
              console.log("clicked day", date);
            }}
          />
        </section>

        {/* RIGHT: 카테고리 요약 & 원형 그래프 */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <div className="dashboard-card__title-row">
              <h2 className="dashboard-card__title">
                카테고리별 시간 &amp; 작업 요약
              </h2>
              <span className="dashboard-card__subtitle">
                이번 달에 어떤 카테고리에 시간을 썻는지 한눈에 확인해요.
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
                          (totalMinutes /
                            (24 * 60 * days.length)) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <div className="weekly-donut__label">
                    이번 달 {days.length}일 기준
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
                카테고리를 선택하면 이번 달 해당 카테고리에서 했던 작업이
                많이 한 순으로 나타납니다.
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
                        {minutesToHourText(t.duration)}
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

// ===== 서브 컴포넌트: MonthlyCalendar =====

function MonthlyCalendar({
  monthStart,
  days,
  blocksByDate,
  categories,
  onClickDay,
}) {
  const start = new Date(monthStart);
  const year = start.getFullYear();
  const month = start.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const leadingEmpty = (firstDay + 6) % 7; // 월=0 기준
  const cells = [];

  for (let i = 0; i < leadingEmpty; i += 1) {
    cells.push({ type: "empty", key: `e-${i}` });
  }

  days.forEach((date) => {
    cells.push({ type: "day", date, key: date });
  });

  const categoryMap = new Map(
    categories.map((c) => [c.key, c.color])
  );

  return (
    <div className="monthly-calendar">
      <div className="monthly-calendar__header">
        {["월", "화", "수", "목", "금", "토", "일"].map((w) => (
          <div key={w} className="monthly-calendar__header-cell">
            {w}
          </div>
        ))}
      </div>
      <div className="monthly-calendar__body">
        {cells.map((cell) => {
          if (cell.type === "empty") {
            return (
              <div
                key={cell.key}
                className="monthly-calendar__cell monthly-calendar__cell--empty"
              />
            );
          }
          const date = cell.date;
          const d = new Date(date);
          const dayNum = d.getDate();
          const data = blocksByDate.get(date);
          const minutes = data?.minutes ?? 0;
          const items = data?.items ?? [];

          const categoryMinutesMap = new Map();
          items.forEach((b) => {
            const duration = b.endMinutes - b.startMinutes;
            const prev = categoryMinutesMap.get(b.categoryKey) || 0;
            categoryMinutesMap.set(b.categoryKey, prev + duration);
          });

          const daySegments = Array.from(
            categoryMinutesMap.entries()
          ).map(([key, value]) => ({
            key,
            color: categoryMap.get(key) || "#e5e7eb",
            value,
          }));

          const total = daySegments.reduce(
            (sum, s) => sum + s.value,
            0
          );

          return (
            <button
              type="button"
              key={cell.key}
              className="monthly-calendar__cell"
              onClick={() => onClickDay(date)}
            >
              <div className="monthly-calendar__date">{dayNum}</div>
              <div className="monthly-calendar__bars">
                {daySegments.map((s) => (
                  <div
                    key={s.key}
                    className="monthly-calendar__bar"
                    style={{
                      backgroundColor: s.color,
                      flexGrow: s.value,
                    }}
                  />
                ))}
                {daySegments.length === 0 && (
                  <div className="monthly-calendar__bar monthly-calendar__bar--empty" />
                )}
              </div>
              {total > 0 && (
                <div className="monthly-calendar__minutes">
                  {minutesToHourText(total)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
