// src/main/frontend/src/screens/diary/DailyDiaryScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import { useResponsiveLayout } from "../../shared/hooks/useResponsiveLayout";
import TimebarMiniMap from "../../components/diary/TimebarMiniMap";

const sampleBlocks = [
  {
    id: "b1",
    start: "09:00",
    end: "11:30",
    categoryId: "work",
    title: "업무",
    planOrActual: "actual",
  },
  {
    id: "b2",
    start: "21:00",
    end: "23:00",
    categoryId: "study",
    title: "SQLD 공부",
    planOrActual: "actual",
  },
];

function DailyDiaryScreen() {
  const viewport = useResponsiveLayout();

  return (
    <AppShell title="일간 다이어리">
      <div className={`screen screen--daily-diary screen--${viewport}`}>
        <header className="screen-header">
          <div className="screen-header__center">
            <h2>2025년 3월 16일 (일)</h2>
          </div>
          <div className="screen-header__right">
            <button className="emoji-button">😌</button>
          </div>
        </header>

        <section className="diary-top">
          <h3>오늘 하루 색 줄기</h3>
          <TimebarMiniMap blocks={sampleBlocks} />
          <div className="diary-top__sliders">
            <label>
              에너지
              <input type="range" min={1} max={10} defaultValue={7} />
            </label>
            <label>
              만족도
              <input type="range" min={1} max={10} defaultValue={8} />
            </label>
          </div>
        </section>

        <section className="diary-cards">
          <article className="diary-card">
            <h4>오늘 최고였던 순간 ✨</h4>
            <textarea placeholder="나를 뿌듯하게 했던 순간을 적어보세요." />
          </article>
          <article className="diary-card">
            <h4>힘들었던/아쉬웠던 점</h4>
            <textarea placeholder="감정도 같이 적어두면 좋아요." />
          </article>
          <article className="diary-card">
            <h4>내일은 이렇게 해볼게</h4>
            <textarea placeholder="내일 나를 위한 한 줄 계획." />
          </article>
          <article className="diary-card">
            <h4>자유 메모</h4>
            <textarea placeholder="오늘 하루를 자유롭게 정리해보세요." />
          </article>
        </section>

        <section className="diary-bottom">
          <button className="ghost-button">자동 회고 문장 불러오기</button>
        </section>
      </div>
    </AppShell>
  );
}

export default DailyDiaryScreen;
