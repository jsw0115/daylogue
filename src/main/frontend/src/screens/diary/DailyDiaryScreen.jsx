// src/screens/diary/DailyDiaryScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import TimebarMiniMap from "../../components/diary/TimebarMiniMap";
import "../../styles/screens/diary.css";

function DailyDiaryScreen() {
  return (
    <div className="screen daily-diary-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">일간 다이어리</h2>
          <p className="screen-header__subtitle">
            오늘의 타임바와 감정을 함께 기록해 보세요.
          </p>
        </div>
      </header>

      <div className="diary-grid">
        <DashboardCard title="타임바 요약" subtitle="오늘 하루 색 막대">
          <TimebarMiniMap />
          <div
            className="diary-mood-row"
            style={{ marginTop: 10, fontSize: 13 }}
          >
            <span>오늘 기분</span>
            <span>😊 😊 😐 😟</span>
          </div>
        </DashboardCard>

        <DashboardCard title="회고" subtitle="잘한 점 · 아쉬운 점 · 내일 할 것">
          <div className="settings-section">
            <textarea
              className="diary-textarea"
              placeholder="오늘 잘한 점을 적어보세요."
            />
            <textarea
              className="diary-textarea"
              placeholder="아쉬웠던 점은 무엇이었나요?"
            />
            <textarea
              className="diary-textarea"
              placeholder="내일을 위해 준비하고 싶은 것들을 적어보세요."
            />
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

export default DailyDiaryScreen;
