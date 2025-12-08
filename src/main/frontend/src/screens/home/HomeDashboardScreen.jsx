import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/screens/home.css";

/** --- 더미 데이터 (추후 API 연동 예정) --- */
const mockPlanVsActual = {
  daily: { planned: 6, done: 4 },
  weekly: { planned: 30, done: 22 },
  monthly: { planned: 120, done: 98 },
};

const mockEvents = [
  { id: 1, date: "2025-12-07", title: "SQLD 1강 복습", group: "공부" },
  { id: 2, date: "2025-12-07", title: "운동 - 러닝 30분", group: "건강" },
  { id: 3, date: "2025-12-08", title: "프로젝트 회의", group: "업무" },
  { id: 4, date: "2025-12-10", title: "친구 약속", group: "개인" },
];

const todayStr = new Date().toISOString().slice(0, 10);

/** 현재 월의 달력 셀(앞 공백 포함) 생성 */
const buildMonthDays = (baseDate = new Date()) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0~11
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstWeekday = firstDay.getDay(); // 0(일)~6(토)
  const daysInMonth = lastDay.getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  return cells;
};

function HomeDashboardScreen() {
  const navigate = useNavigate();

  // 대시보드 상태
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [todayMemo, setTodayMemo] = useState("");
  const [todayQuote, setTodayQuote] = useState("");
  const [planViewMode, setPlanViewMode] = useState("chart"); // chart | gantt | timetable | list

  const monthDays = useMemo(() => buildMonthDays(new Date()), []);

  const eventsByDate = useMemo(() => {
    const map = {};
    mockEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, []);

  const selectedEvents = eventsByDate[selectedDate] || [];

  /** 특정 날짜의 일간 플래너로 이동 (쿼리 파라미터로 날짜 전달) */
  const goToDailyPlanner = (dateStr) => {
    navigate(`/planner/daily?date=${dateStr}`);
  };

  return (
    <div className="home-dashboard-screen">
      {/* 상단 헤더: 제목 + 액션 버튼 */}
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">대시보드</h1>
          <p className="screen-header__subtitle">
            오늘의 진행 상황과 한 달 일정, 메모를 한눈에 확인하세요.
          </p>
        </div>
        <div className="home-header-actions">
          <button
            className="btn btn--primary"
            onClick={() => navigate("/event/create")}
          >
            + 일정 등록
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/planner/daily")}
          >
            오늘 일간 플래너
          </button>
        </div>
      </div>

      {/* 1행: PLAN vs ACTUAL / 오늘 메모 & 좌우명 / 월간 일정 */}
      <div className="home-grid">
        {/* 1-1. PLAN vs ACTUAL 테이블 */}
        <section className="card dashboard-card">
          <h2 className="dashboard-card__title">
            계획 대비 실행 (일간/주간/월간)
          </h2>
          <p className="text-muted font-small mb-3">
            PLAN vs ACTUAL 기준으로 오늘·이번 주·이번 달 진행률을 확인할 수
            있습니다.
          </p>

          <table className="plan-actual-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>계획</th>
                <th>실행</th>
                <th>진행률</th>
              </tr>
            </thead>
            <tbody>
              {["daily", "weekly", "monthly"].map((key) => {
                const row = mockPlanVsActual[key];
                const progress =
                  row.planned === 0
                    ? 0
                    : Math.round((row.done / row.planned) * 100);
                const label =
                  key === "daily"
                    ? "오늘"
                    : key === "weekly"
                    ? "이번 주"
                    : "이번 달";
                return (
                  <tr key={key}>
                    <td>{label}</td>
                    <td>{row.planned}</td>
                    <td>{row.done}</td>
                    <td>
                      <div className="plan-actual-progress">
                        <div
                          className="plan-actual-progress__bar"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                        <span className="plan-actual-progress__text">
                          {progress}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* 1-2. 오늘 메모 & 좌우명 */}
        <section className="card dashboard-card">
          <h2 className="dashboard-card__title">오늘 나의 메모 & 좌우명</h2>

          <div className="today-memo-section">
            <label className="dashboard-label">오늘 나의 메모</label>
            <textarea
              className="home-oneline"
              placeholder="오늘의 생각, 배운 점, 감정 등을 간단히 적어보세요."
              value={todayMemo}
              onChange={(e) => setTodayMemo(e.target.value)}
            />
          </div>

          <div className="today-quote-section mt-4">
            <label className="dashboard-label">오늘 나의 좌우명</label>
            <input
              type="text"
              className="today-quote-input"
              placeholder="예) 꾸준함은 재능을 이긴다."
              value={todayQuote}
              onChange={(e) => setTodayQuote(e.target.value)}
            />
          </div>

          <p className="text-muted font-small mt-3">
            일간 플래너의 일일 메모/명언과 연동할 수 있는 영역입니다. 추후
            API와 연결해서 자동 저장/불러오기를 할 수 있습니다.
          </p>
        </section>

        {/* 1-3. 월간 일정 + 선택 날짜의 일정 목록 */}
        <section className="card dashboard-card month-schedule-card">
          <div className="month-schedule-header">
            <div>
              <h2 className="dashboard-card__title">한 달 일정 한눈에 보기</h2>
              <p className="text-muted font-small">
                일정이 있는 날짜에는 점으로 표시됩니다. 날짜를 클릭하면 해당
                날짜의 일정 목록이 우측에 표시됩니다.
              </p>
            </div>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => navigate("/event/list")}
            >
              일정 전체 보기
            </button>
          </div>

          <div className="month-schedule-grid">
            {/* 달력 */}
            <div className="monthly-calendar">
              <div className="calendar-weekdays">
                {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                  <div key={d} className="calendar-weekday">
                    {d}
                  </div>
                ))}
              </div>
              <div className="calendar-days">
                {monthDays.map((day, idx) => {
                  if (!day) return <div key={idx} className="calendar-day empty" />;
                  const dateStr = day.toISOString().slice(0, 10);
                  const hasEvents = !!eventsByDate[dateStr];
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={idx}
                      className={
                        "calendar-day" +
                        (hasEvents ? " has-events" : "") +
                        (isSelected ? " is-selected" : "")
                      }
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      <span className="calendar-day__num">{day.getDate()}</span>
                      {hasEvents && <span className="calendar-day__dot" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 선택된 날짜의 일정 목록 */}
            <div className="daily-event-list">
              <div className="daily-event-list__header">
                <span className="font-small text-muted">
                  선택 날짜: {selectedDate}
                </span>
                <div className="daily-event-list__actions">
                  <button
                    className="btn btn--sm btn--primary"
                    onClick={() => navigate("/event/create")}
                  >
                    + 일정 추가
                  </button>
                  <button
                    className="btn btn--sm btn--secondary"
                    onClick={() => goToDailyPlanner(selectedDate)}
                  >
                    이 날짜 일간 플래너
                  </button>
                </div>
              </div>

              {selectedEvents.length === 0 ? (
                <p className="text-muted font-small mt-2">
                  선택한 날짜에 등록된 일정이 없습니다.
                </p>
              ) : (
                <ul className="daily-event-list__items">
                  {selectedEvents.map((e) => (
                    <li key={e.id}>
                      <div className="daily-event-title">{e.title}</div>
                      <div className="daily-event-meta font-small text-muted">
                        그룹: {e.group}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* 1-4. 한 주/하루 타임라인 – 차트/간트/시간표/목록 뷰 전환 */}
        <section className="card dashboard-card plan-view-card">
          <div className="plan-view-header">
            <h2 className="dashboard-card__title">계획/실행 타임라인 뷰</h2>
            <div className="plan-view-tabs">
              {[
                { key: "chart", label: "막대 차트" },
                { key: "gantt", label: "간트형" },
                { key: "timetable", label: "시간표" },
                { key: "list", label: "목록" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={
                    "plan-view-tab" +
                    (planViewMode === tab.key ? " plan-view-tab--active" : "")
                  }
                  onClick={() => setPlanViewMode(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 뷰 별 렌더링 */}
          {planViewMode === "chart" && (
            <div className="plan-view-chart">
              {["공부", "업무", "건강", "휴식"].map((cat) => (
                <div key={cat} className="plan-view-chart-row">
                  <span className="plan-view-chart-label">{cat}</span>
                  <div className="plan-view-chart-bar-bg">
                    <div className="plan-view-chart-bar plan-view-chart-bar--plan" />
                    <div className="plan-view-chart-bar plan-view-chart-bar--actual" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {planViewMode === "gantt" && (
            <div className="plan-view-gantt">
              {/* 가로 타임라인 – 간단한 가짜 간트 */}
              <div className="plan-view-gantt-row">
                <div className="plan-view-gantt-label">오전</div>
                <div className="plan-view-gantt-track">
                  <div className="plan-view-gantt-block plan-view-gantt-block--study">
                    공부
                  </div>
                  <div className="plan-view-gantt-block plan-view-gantt-block--work">
                    업무
                  </div>
                </div>
              </div>
              <div className="plan-view-gantt-row">
                <div className="plan-view-gantt-label">오후</div>
                <div className="plan-view-gantt-track">
                  <div className="plan-view-gantt-block plan-view-gantt-block--health">
                    운동
                  </div>
                  <div className="plan-view-gantt-block plan-view-gantt-block--rest">
                    휴식
                  </div>
                </div>
              </div>
            </div>
          )}

          {planViewMode === "timetable" && (
            <div className="plan-view-timetable">
              {["06", "08", "10", "12", "14", "16", "18", "20", "22"].map(
                (h) => (
                  <div key={h} className="plan-view-timetable-row">
                    <div className="plan-view-timetable-time">{h}:00</div>
                    <div className="plan-view-timetable-cell">
                      {/* 나중에 타임라인/집중 모드와 연동 */}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

          {planViewMode === "list" && (
            <div className="plan-view-list">
              <ul>
                <li>
                  <span className="plan-view-list-time">07:00</span>
                  <span className="plan-view-list-title">
                    기상 & 스트레칭 (루틴)
                  </span>
                </li>
                <li>
                  <span className="plan-view-list-time">09:00</span>
                  <span className="plan-view-list-title">
                    프로젝트 업무 (할 일)
                  </span>
                </li>
                <li>
                  <span className="plan-view-list-time">20:00</span>
                  <span className="plan-view-list-title">
                    SQLD 공부 (집중 모드)
                  </span>
                </li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default HomeDashboardScreen;
