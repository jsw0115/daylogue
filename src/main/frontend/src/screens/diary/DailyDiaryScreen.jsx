// src/screens/diary/DailyDiaryScreen.jsx
import React, { useMemo, useState } from "react";
import PageContainer from "../../layout/PageContainer";
import { useResponsiveLayout } from "../../shared/hooks/useResponsiveLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import TimebarMiniMap from "../../components/diary/TimebarMiniMap";

const MOCK_SUMMARY = [
  { category: "WORK", label: "업무", minutes: 240 },
  { category: "STUDY", label: "공부", minutes: 180 },
  { category: "HEALTH", label: "건강", minutes: 60 },
  { category: "REST", label: "휴식", minutes: 90 },
];

function DailyDiaryScreen() {
  const { isMobile } = useResponsiveLayout();
  const [selectedDate] = useState(new Date());
  const [review, setReview] = useState({
    best: "",
    hard: "",
    tomorrow: "",
    free: "",
  });

  const dateLabel = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth() + 1;
    const d = selectedDate.getDate();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const w = dayNames[selectedDate.getDay()];
    return `${y}. ${m}.${d} (${w})`;
  }, [selectedDate]);

  const handleApplyFromTimebar = () => {
    // 나중에는 /api/stat/daily-summary 같은 곳에서 Timebar 기반 문장 받아오기
    const text = `오늘은 업무 ${4}시간, 공부 ${3}시간, 건강 ${1}시간 정도를 보냈어요.`;
    setReview((prev) => ({
      ...prev,
      best: prev.best || text,
    }));
  };

  const handleSaveDiary = () => {
    console.log("save diary", { date: selectedDate, review });
    alert("일간 다이어리가 임시로 콘솔에만 저장되었습니다. (Stub)");
  };

  return (
    <PageContainer>
      <div className="screen daily-diary-screen">
        <header className="screen-header">
          <div className="screen-header__left">
            <h1 className="screen-header__title">일간 다이어리 / 회고</h1>
            <p className="screen-header__subtitle">
              오늘의 타임바를 보면서, 하루를 감정과 문장으로 정리해요.
            </p>
            <div className="mt-1 text-xs text-slate-500">{dateLabel}</div>
          </div>

          <div className="screen-header__right">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleApplyFromTimebar}
            >
              타임바에서 요약 불러오기
            </button>
          </div>
        </header>

        {/* diary.css의 .daily-diary-screen .diary-grid 사용 */}
        <div className="diary-grid">
          {/* LEFT: 타임바 미니맵 + 카테고리 요약 (모바일에서는 상단에 먼저 나옴) */}
          <section>
            <DashboardCard
              title="오늘의 타임바 요약"
              subtitle="색으로 보는 오늘 하루 – 탭하면 일간 플래너로 이동 예정"
            >
              <TimebarMiniMap date={selectedDate} summary={MOCK_SUMMARY} />

              <div className="mt-3 diary-mood-row">
                <span>오늘 기분</span>
                <button type="button" className="btn btn--ghost">
                  🙂 보통
                </button>
                <button type="button" className="btn btn--ghost">
                  😄 좋았음
                </button>
                <button type="button" className="btn btn--ghost">
                  😫 힘들었음
                </button>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                * 타임바 막대를 탭하면 PLAN-001(일간 플래너)로 이동하도록
                라우팅을 연결할 수 있어요.
              </div>
            </DashboardCard>
          </section>

          {/* RIGHT: 회고 카드들 – 작은 화면에서는 아래로 내려감 */}
          <section>
            <DashboardCard
              title="오늘을 돌아보기"
              subtitle="Best moments / Hard things / Tomorrow / Free memo"
            >
              <div className="field">
                <label className="field__label">가장 좋았던 순간 ✨</label>
                <textarea
                  className="diary-textarea"
                  rows={isMobile ? 3 : 4}
                  value={review.best}
                  onChange={(e) =>
                    setReview((prev) => ({ ...prev, best: e.target.value }))
                  }
                />
              </div>

              <div className="field">
                <label className="field__label">힘들거나 아쉬웠던 점</label>
                <textarea
                  className="diary-textarea"
                  rows={isMobile ? 3 : 4}
                  value={review.hard}
                  onChange={(e) =>
                    setReview((prev) => ({ ...prev, hard: e.target.value }))
                  }
                />
              </div>

              <div className="field">
                <label className="field__label">내일은 이렇게 해볼래요</label>
                <textarea
                  className="diary-textarea"
                  rows={isMobile ? 2 : 3}
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
                <label className="field__label">자유 메모 / 붙이고 싶은 말</label>
                <textarea
                  className="diary-textarea"
                  rows={isMobile ? 3 : 4}
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
                  onClick={handleSaveDiary}
                >
                  오늘 일기 저장
                </button>
              </div>
            </DashboardCard>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

export default DailyDiaryScreen;
