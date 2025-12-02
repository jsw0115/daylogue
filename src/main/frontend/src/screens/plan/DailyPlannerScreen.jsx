// FILE: src/screens/plan/DailyPlannerScreen.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDateKorean, todayStr } from "../../shared/utils/dateUtils";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

const MINUTES_IN_DAY = 24 * 60;

const MOCK_BLOCKS = [
  // 간단 샘플 데이터 (카테고리별 시간 계산용)
  {
    id: 1,
    categoryKey: "work",
    title: "업무 1",
    startMinutes: 9 * 60,
    endMinutes: 12 * 60,
    type: "PLAN",
  },
  {
    id: 2,
    categoryKey: "study",
    title: "SQLD 공부",
    startMinutes: 13 * 60,
    endMinutes: 15 * 60,
    type: "PLAN",
  },
  {
    id: 3,
    categoryKey: "health",
    title: "운동",
    startMinutes: 20 * 60,
    endMinutes: 20 * 60 + 40,
    type: "PLAN",
  },
];

function addDays(dateStr, delta) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

export default function DailyPlannerScreen() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(todayStr());

  // Daily Todo
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState(["SQLD 1강 듣기", "운동 30분"]);

  // Daily Memo
  const [dailyQuote, setDailyQuote] = useState(
    "당신이 할 수 있는 가장 용감한 일은 포기하고 싶을 때 계속하는 것입니다."
  );
  const [dailyMemo, setDailyMemo] = useState("");

  // Daily Review
  const [reviewGood, setReviewGood] = useState("");
  const [reviewRegret, setReviewRegret] = useState("");
  const [reviewTomorrow, setReviewTomorrow] = useState("");

  // 카테고리 통계 탭 (계획 / 실행)
  const [statMode, setStatMode] = useState("PLAN"); // "PLAN" | "ACTUAL"
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(null);

  const dateLabel = useMemo(
    () => formatDateKorean(selectedDate),
    [selectedDate]
  );

  // === 네비게이션 ===
  const handlePrevDay = () => {
    setSelectedDate((prev) => addDays(prev, -1));
  };
  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };
  const handleToday = () => {
    setSelectedDate(todayStr());
  };

  const handleTodoKeyDown = (e) => {
    if (e.key === "Enter" && todoInput.trim()) {
      e.preventDefault();
      setTodos((prev) => [...prev, todoInput.trim()]);
      setTodoInput("");
    }
  };

  const handleRemoveTodo = (index) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
  };

  // === 카테고리별 시간 & 작업 요약 계산 ===
  const categoryStats = useMemo(() => {
    // 실제로는 statMode 에 따라 PLAN / ACTUAL 블록 분리
    const blocks = MOCK_BLOCKS; // TODO: selectedDate, statMode 기준 실제 데이터로 교체

    const perCategory = new Map();
    blocks.forEach((b) => {
      const minutes = b.endMinutes - b.startMinutes;
      if (!perCategory.has(b.categoryKey)) {
        perCategory.set(b.categoryKey, {
          key: b.categoryKey,
          minutes: 0,
          blocks: [],
        });
      }
      const entry = perCategory.get(b.categoryKey);
      entry.minutes += minutes;
      entry.blocks.push(b);
    });

    const list = Array.from(perCategory.values()).sort(
      (a, b) => b.minutes - a.minutes
    );
    const totalMinutes = list.reduce((sum, c) => sum + c.minutes, 0);

    return {
      totalMinutes,
      categories: list,
    };
  }, [statMode, selectedDate]);

  const totalPercent = useMemo(() => {
    if (!categoryStats.totalMinutes) return 0;
    return Math.round(
      (categoryStats.totalMinutes / MINUTES_IN_DAY) * 100
    );
  }, [categoryStats.totalMinutes]);

  const selectedCategory =
    categoryStats.categories.find((c) => c.key === selectedCategoryKey) ||
    categoryStats.categories[0];

  const selectedCategoryMeta = selectedCategory
    ? DEFAULT_CATEGORIES.find((c) => c.key === selectedCategory.key)
    : null;

  const handleCategoryClick = (key) => {
    setSelectedCategoryKey(key);
  };

  const handleTabClick = (mode) => {
    setStatMode(mode);
  };

  const handleChangeView = (view) => {
    // 상단 "일간 / 주간 / 월간 / 연간" 탭 전환
    if (view === "daily") return;
    if (view === "weekly") navigate("/plan/weekly");
    if (view === "monthly") navigate("/plan/monthly");
    if (view === "yearly") navigate("/plan/yearly");
  };

  return (
    <div className="page-container">
      <div className="screen daily-planner-screen">
        {/* ===== 헤더 ===== */}
        <header className="screen-header daily-planner-header">
          <div className="screen-header__left">
            <h1 className="screen-header__title">일간 플래너</h1>
            <p className="screen-header__subtitle">
              {dateLabel} · 하루 계획 &amp; 리뷰
            </p>
          </div>

          <div className="daily-planner-header__rows">
            <div className="daily-planner-header__row">
              <div className="daily-planner-header__nav">
                <div className="date-nav-arrows">
                  <button
                    type="button"
                    className="date-nav-arrow"
                    onClick={handlePrevDay}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="date-nav-arrow"
                    onClick={handleNextDay}
                  >
                    ›
                  </button>
                </div>
                <div className="date-nav-chips">
                  <button
                    type="button"
                    className="date-nav-chip"
                    onClick={() =>
                      setSelectedDate((prev) => addDays(prev, -1))
                    }
                  >
                    어제
                  </button>
                  <button
                    type="button"
                    className="date-nav-chip date-nav-chip--primary"
                    onClick={handleToday}
                  >
                    오늘
                  </button>
                  <button
                    type="button"
                    className="date-nav-chip"
                    onClick={() =>
                      setSelectedDate((prev) => addDays(prev, 1))
                    }
                  >
                    내일
                  </button>
                </div>
              </div>

              <div className="planner-tabs">
                <div className="tabbar">
                  <button
                    type="button"
                    className="tabbar__item tabbar__item--active"
                  >
                    일간
                  </button>
                  <button
                    type="button"
                    className="tabbar__item"
                    onClick={() => handleChangeView("weekly")}
                  >
                    주간
                  </button>
                  <button
                    type="button"
                    className="tabbar__item"
                    onClick={() => handleChangeView("monthly")}
                  >
                    월간
                  </button>
                  <button
                    type="button"
                    className="tabbar__item"
                    onClick={() => handleChangeView("yearly")}
                  >
                    연간
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===== 본문 레이아웃 ===== */}
        <div className="planner-layout">
          {/* 왼쪽: Todo + Routine/Plan/Do 표 */}
          <div className="planner-layout__left">
            {/* Daily Todo */}
            <section className="dashboard-card">
              <div className="dashboard-card__header">
                <div className="dashboard-card__title-row">
                  <h2 className="dashboard-card__title">Daily Todo</h2>
                  <span className="dashboard-card__subtitle">
                    오늘 꼭 하고 싶은 일
                  </span>
                </div>
              </div>

              <ol className="planner-day-list">
                {todos.map((item, idx) => (
                  <li key={idx}>
                    <span>{idx + 1}.</span>
                    <span>{item}</span>
                    <button
                      type="button"
                      className="btn-link-remove"
                      onClick={() => handleRemoveTodo(idx)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ol>

              <div className="daily-todo-input-row">
                <input
                  className="field__control daily-todo-input"
                  placeholder="할 일을 입력하고 Enter"
                  value={todoInput}
                  onChange={(e) => setTodoInput(e.target.value)}
                  onKeyDown={handleTodoKeyDown}
                />
                <button
                  type="button"
                  className="btn btn--primary daily-todo-add"
                  onClick={() => {
                    if (!todoInput.trim()) return;
                    setTodos((prev) => [...prev, todoInput.trim()]);
                    setTodoInput("");
                  }}
                >
                  + 추가
                </button>
              </div>
            </section>

            {/* Routine · Memo · Plan · Do 테이블 */}
            <section className="dashboard-card">
              <div className="dashboard-card__header">
                <div className="dashboard-card__title-row">
                  <h2 className="dashboard-card__title">
                    Routine · Memo · Plan · Do
                  </h2>
                  <span className="dashboard-card__subtitle">
                    하루를 아침/낮/저녁으로 나누어 계획과 실제를 기록해요.
                  </span>
                </div>
              </div>

              <div className="routine-table-wrapper">
                <table className="routine-table">
                  <thead>
                    <tr>
                      <th>구분</th>
                      <th>Routine</th>
                      <th>Memo</th>
                      <th>Plan</th>
                      <th>Do</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>아침</td>
                      <td>아침 루틴</td>
                      <td>메모</td>
                      <td>오늘의 계획</td>
                      <td>실제 한 일</td>
                    </tr>
                    <tr>
                      <td>낮</td>
                      <td>낮 루틴</td>
                      <td>메모</td>
                      <td>오늘의 계획</td>
                      <td>실제 한 일</td>
                    </tr>
                    <tr>
                      <td>저녁</td>
                      <td>저녁 루틴</td>
                      <td>메모</td>
                      <td>오늘의 계획</td>
                      <td>실제 한 일</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* 오른쪽: Memo + Review + 카테고리 통계 */}
          <div className="planner-layout__right">
            {/* Daily Memo */}
            <section className="dashboard-card">
              <div className="dashboard-card__header">
                <div className="dashboard-card__title-row">
                  <h2 className="dashboard-card__title">Daily Memo</h2>
                  <span className="dashboard-card__subtitle">
                    오늘의 문장 / 다짐 / 기억하고 싶은 한 줄
                  </span>
                </div>
              </div>

              <div className="daily-memo-body">
                <div className="field">
                  <label className="field__label">오늘의 문장 (Quote)</label>
                  <textarea
                    className="field__control"
                    rows={2}
                    value={dailyQuote}
                    onChange={(e) => setDailyQuote(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label className="field__label">메모</label>
                  <textarea
                    className="field__control"
                    rows={3}
                    placeholder="오늘의 생각, 감정, 로그를 남겨 보세요."
                    value={dailyMemo}
                    onChange={(e) => setDailyMemo(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Daily Review */}
            <section className="dashboard-card">
              <div className="dashboard-card__header">
                <div className="dashboard-card__title-row">
                  <h2 className="dashboard-card__title">Daily Review</h2>
                  <span className="dashboard-card__subtitle">
                    오늘을 돌아보고, 내일의 나에게 한 말을 남겨요.
                  </span>
                </div>
              </div>

              <div className="daily-review-body">
                <div className="field">
                  <label className="field__label">오늘 잘한 일</label>
                  <textarea
                    className="field__control"
                    rows={2}
                    value={reviewGood}
                    onChange={(e) => setReviewGood(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="field__label">오늘 아쉬웠던 점</label>
                  <textarea
                    className="field__control"
                    rows={2}
                    value={reviewRegret}
                    onChange={(e) => setReviewRegret(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="field__label">내일의 미션 / 계획</label>
                  <textarea
                    className="field__control"
                    rows={2}
                    value={reviewTomorrow}
                    onChange={(e) => setReviewTomorrow(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* 카테고리별 시간 & 작업 요약 */}
            <section className="dashboard-card">
              <div className="dashboard-card__header">
                <div className="dashboard-card__title-row">
                  <h2 className="dashboard-card__title">
                    카테고리별 시간 &amp; 작업 요약
                  </h2>
                  <span className="dashboard-card__subtitle">
                    하루 동안 어떤 카테고리에 시간을 썼는지 한눈에 확인해요.
                  </span>
                </div>
              </div>

              <div className="daily-stat-body">
                {/* 계획 / 실행 탭 */}
                <div className="daily-stat-tabs">
                  <button
                    type="button"
                    className={`daily-stat-tab ${
                      statMode === "PLAN" ? "daily-stat-tab--active" : ""
                    }`}
                    onClick={() => handleTabClick("PLAN")}
                  >
                    계획
                  </button>
                  <button
                    type="button"
                    className={`daily-stat-tab ${
                      statMode === "ACTUAL" ? "daily-stat-tab--active" : ""
                    }`}
                    onClick={() => handleTabClick("ACTUAL")}
                  >
                    실행
                  </button>
                </div>

                <div className="daily-stat-grid">
                  {/* 원형 차트 영역 (단순 CSS 도넛) */}
                  <div className="daily-stat-pie-wrapper">
                    <div className="daily-stat-pie">
                      <div className="daily-stat-pie__center">
                        <div className="daily-stat-pie__percent">
                          {totalPercent}%
                        </div>
                        <div className="daily-stat-pie__label">
                          하루 24시간 중
                          <br />
                          사용된 시간
                        </div>
                      </div>
                    </div>

                    <ul className="daily-stat-legend">
                      {categoryStats.categories.map((c) => {
                        const meta =
                          DEFAULT_CATEGORIES.find(
                            (cat) => cat.key === c.key
                          ) || {};
                        const percent = categoryStats.totalMinutes
                          ? Math.round(
                              (c.minutes /
                                categoryStats.totalMinutes) *
                                100
                            )
                          : 0;
                        return (
                          <li
                            key={c.key}
                            className={`daily-stat-legend__item ${
                              selectedCategory?.key === c.key
                                ? "daily-stat-legend__item--active"
                                : ""
                            }`}
                            onClick={() => handleCategoryClick(c.key)}
                          >
                            <span
                              className="daily-stat-legend__color"
                              style={{
                                background: meta.color,
                              }}
                            />
                            <div className="daily-stat-legend__meta">
                              <span className="daily-stat-legend__name">
                                {meta.name || c.key}
                              </span>
                              <span className="daily-stat-legend__value">
                                {percent}% ·{" "}
                                {Math.round(c.minutes / 60)}시간{" "}
                                {c.minutes % 60}분
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* 오른쪽: 사용 목록 + 부족한 점/내일로 미룰 일 */}
                  <div className="daily-stat-detail">
                    <div className="daily-stat-detail__header">
                      <span className="daily-stat-detail__label">
                        사용 목록
                      </span>
                      {selectedCategoryMeta && (
                        <span className="daily-stat-detail__category">
                          {selectedCategoryMeta.name}
                        </span>
                      )}
                    </div>

                    <ul className="daily-stat-usage-list">
                      {(selectedCategory?.blocks || []).map((b) => (
                        <li key={b.id} className="daily-stat-usage-item">
                          <span className="daily-stat-usage-item__time">
                            {toTime(b.startMinutes)} ~{" "}
                            {toTime(b.endMinutes)}
                          </span>
                          <span className="daily-stat-usage-item__title">
                            {b.title}
                          </span>
                        </li>
                      ))}
                      {(!selectedCategory ||
                        !selectedCategory.blocks?.length) && (
                        <li className="daily-stat-usage-item daily-stat-usage-item--empty">
                          아직 기록된 작업이 없어요.
                        </li>
                      )}
                    </ul>

                    <div className="field">
                      <label className="field__label">부족한 점</label>
                      <textarea
                        className="field__control"
                        rows={2}
                        placeholder="카테고리별 시간 분배를 보며, 부족했던 점을 적어 보세요."
                      />
                    </div>

                    <div className="field">
                      <label className="field__label">
                        내일로 미룰 일 점검
                      </label>
                      <textarea
                        className="field__control"
                        rows={2}
                        placeholder="오늘 못한 일 중 내일로 미룰 것들을 점검해 보세요."
                      />
                    </div>
                  </div>
                </div>

                <div className="daily-stat-footer">
                  <button type="button" className="btn btn--primary btn--full">
                    오늘 플래너 저장하기
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// 분 → HH:MM
function toTime(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}
