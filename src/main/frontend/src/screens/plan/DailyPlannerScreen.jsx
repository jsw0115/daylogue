// src/screens/plan/DailyPlannerScreen.jsx
import React, { useState, useMemo } from "react";
import PageContainer from "../../layout/PageContainer";
import { useResponsiveLayout } from "../../shared/hooks/useResponsiveLayout";
import TimebarTimeline from "../../components/planner/TimebarTimeline";
import DashboardCard from "../../components/dashboard/DashboardCard";
// 이미 있는 공통 탭바 컴포넌트를 쓴다는 가정
import TabBar from "../../components/common/TabBar";

const PLAN_VIEW_MODES = [
  { value: "actual", label: "실제(Actual)" },
  { value: "plan", label: "계획(Plan)" },
  { value: "overlay", label: "겹쳐보기" },
];

// TODO: 실제로는 API에서 받아올 데이터
const MOCK_PLAN_BLOCKS = [
  {
    id: "plan-1",
    start: "09:00",
    end: "11:00",
    category: "STUDY",
    title: "SQL 공부",
  },
  {
    id: "plan-2",
    start: "14:00",
    end: "15:30",
    category: "WORK",
    title: "프로젝트 설계",
  },
];

const MOCK_ACTUAL_BLOCKS = [
  {
    id: "act-1",
    start: "09:30",
    end: "11:30",
    category: "STUDY",
    title: "SQL 문제풀이",
  },
  {
    id: "act-2",
    start: "16:00",
    end: "17:00",
    category: "HEALTH",
    title: "헬스장",
  },
];

const MOCK_TASKS = [
  { id: 1, title: "프로젝트 이슈 정리", category: "WORK", done: false },
  { id: 2, title: "React 구조 리팩토링", category: "STUDY", done: true },
  { id: 3, title: "운동 30분", category: "HEALTH", done: false },
];

const MOCK_ROUTINES = [
  { id: 1, name: "아침 스트레칭", category: "HEALTH", checked: true },
  { id: 2, name: "영어 단어 20개", category: "STUDY", checked: false },
  { id: 3, name: "오늘 하루 회고", category: "DIARY", checked: false },
];

function DailyPlannerScreen() {
  const { isMobile } = useResponsiveLayout();
  const [selectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("actual");
  const [oneLine, setOneLine] = useState("");
  const [review, setReview] = useState({
    good: "",
    bad: "",
    tomorrow: "",
    free: "",
  });

  // 실제로는 Timebar에서 계산된 summary를 API로 받을 수도 있음
  const categorySummary = useMemo(
    () => [
      { category: "STUDY", label: "공부", minutes: 180 },
      { category: "WORK", label: "업무", minutes: 240 },
      { category: "HEALTH", label: "건강", minutes: 60 },
      { category: "REST", label: "휴식", minutes: 90 },
    ],
    []
  );

  const handleToggleViewMode = (value) => {
    setViewMode(value);
  };

  // TODO: 실제 data fetch / save 로직과 연결
  const handleStartTrackingNow = () => {
    // 여기는 나중에 Actual 블록 open-end 생성 로직과 연결
    // 지금은 단순 alert
    alert("지금부터 기록 시작(Stub) – 나중에 Actual 블록 생성 로직과 연결 예정");
  };

  const handleSaveReview = () => {
    // 나중에 /api/diary/daily 로 POST
    console.log("save review", { oneLine, review });
    alert("오늘 회고가 임시로 콘솔에만 저장되었습니다. (Stub)");
  };

  const dateLabel = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth() + 1;
    const d = selectedDate.getDate();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const w = dayNames[selectedDate.getDay()];
    return `${y}. ${m}.${d} (${w})`;
  }, [selectedDate]);

  return (
    <PageContainer>
      <div className="screen daily-planner-screen">
        {/* 헤더: 제목 + 날짜 + 뷰 모드 탭 + '지금부터 기록' 버튼 */}
        <header className="screen-header">
          <div className="screen-header__left">
            <h1 className="screen-header__title">일간 플래너</h1>
            <p className="screen-header__subtitle">
              타임바로 오늘 하루의 Plan vs Actual을 한 번에 정리해요.
            </p>
            <div className="mt-1 text-xs text-slate-500">{dateLabel}</div>
          </div>

          <div className="screen-header__right">
            <div className="flex items-center gap-8">
              {/* Plan / Actual / Overlay 탭바 */}
              <TabBar
                value={viewMode}
                onChange={handleToggleViewMode}
                items={PLAN_VIEW_MODES}
              />

              {/* 지금부터 기록 버튼 – P 모드 UX 느낌 */}
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleStartTrackingNow}
              >
                지금부터 기록하기
              </button>
            </div>
          </div>
        </header>

        {/* 메인 레이아웃: 좌측 타임바, 우측 Task/루틴/회고 (planner.css의 grid 사용) */}
        <div className="planner-layout">
          {/* LEFT: 타임바 + 요약 */}
          <main className="planner-layout__left">
            <section aria-label="오늘 타임라인" className="mb-3">
              <TimebarTimeline
                date={selectedDate}
                viewMode={viewMode}
                planBlocks={MOCK_PLAN_BLOCKS}
                actualBlocks={MOCK_ACTUAL_BLOCKS}
              />
            </section>

            {/* 하단 카테고리별 요약 카드 */}
            <DashboardCard
              title="오늘 사용한 시간 요약"
              subtitle="카테고리별 Plan vs Actual은 다음 버전에서 확장 가능"
            >
              <ul className="home-dashboard-screen home-list">
                {categorySummary.map((item) => {
                  const hours = Math.floor(item.minutes / 60);
                  const mins = item.minutes % 60;
                  return (
                    <li key={item.category}>
                      <span className="badge mr-2">{item.label}</span>
                      <span>
                        {hours > 0 && `${hours}시간 `}
                        {mins > 0 && `${mins}분`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </DashboardCard>
          </main>

          {/* RIGHT: 오늘 할 일, 루틴 체크, 회고 – dashboard 카드 스택 */}
          <aside className="planner-layout__right">
            {/* 오늘 할 일 */}
            <DashboardCard
              title="오늘 할 일"
              subtitle="Task 탭에서 추가한 할 일들이 요약되어 보여요."
            >
              <section className="dashboard-card__section">
                <div className="task-list-wrapper">
                  <table className="task-list">
                    <thead>
                      <tr>
                        <th>제목</th>
                        <th>카테고리</th>
                        <th>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_TASKS.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="task-list__empty">
                            오늘 할 일이 없습니다. Task 탭에서 새로 추가해보세요 ✨
                          </td>
                        </tr>
                      ) : (
                        MOCK_TASKS.map((task) => (
                          <tr key={task.id} className="task-row">
                            <td className="task-row__title">{task.title}</td>
                            <td>{task.category}</td>
                            <td>
                              <span
                                className={
                                  "task-row__status " +
                                  (task.done ? "task-row__status--done" : "")
                                }
                              >
                                {task.done ? "완료" : "진행중"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </DashboardCard>

            {/* 루틴 체크 */}
            <DashboardCard
              title="오늘 루틴 체크"
              subtitle="루틴 탭에서 관리하는 루틴들의 오늘 체크 상태"
            >
              <ul className="routine-list">
                {MOCK_ROUTINES.map((routine) => (
                  <li key={routine.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={routine.checked}
                      readOnly
                    />
                    <span>{routine.name}</span>
                    <span className="badge">{routine.category}</span>
                  </li>
                ))}
              </ul>
            </DashboardCard>

            {/* 오늘 회고 + 한 줄 다짐 */}
            <DashboardCard
              title="오늘 회고"
              subtitle="잘한 점 / 아쉬운 점 / 내일을 위해 / 자유 메모"
            >
              <div className="field">
                <label className="field__label">오늘 한 줄 다짐</label>
                <textarea
                  className="home-oneline"
                  rows={isMobile ? 2 : 3}
                  placeholder="오늘 나는 이렇게 살고 싶어요"
                  value={oneLine}
                  onChange={(e) => setOneLine(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="field__label">잘한 점 ✨</label>
                <textarea
                  className="diary-textarea"
                  value={review.good}
                  onChange={(e) =>
                    setReview((prev) => ({ ...prev, good: e.target.value }))
                  }
                />
              </div>

              <div className="field">
                <label className="field__label">아쉬운 점</label>
                <textarea
                  className="diary-textarea"
                  value={review.bad}
                  onChange={(e) =>
                    setReview((prev) => ({ ...prev, bad: e.target.value }))
                  }
                />
              </div>

              <div className="field">
                <label className="field__label">내일을 위해</label>
                <textarea
                  className="diary-textarea"
                  value={review.tomorrow}
                  onChange={(e) =>
                    setReview((prev) => ({
                      ...prev,
                      tomorrow: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="field">
                <label className="field__label">자유 메모</label>
                <textarea
                  className="diary-textarea"
                  value={review.free}
                  onChange={(e) =>
                    setReview((prev) => ({ ...prev, free: e.target.value }))
                  }
                />
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleSaveReview}
                >
                  오늘 회고 저장
                </button>
              </div>
            </DashboardCard>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default DailyPlannerScreen;
