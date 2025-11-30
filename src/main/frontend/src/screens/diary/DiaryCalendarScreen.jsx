// src/screens/diary/DiaryCalendarScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import "../../styles/screens/diary.css";

function DiaryCalendarScreen() {
  return (
    <div className="screen diary-calendar-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">다이어리 캘린더</h2>
          <p className="screen-header__subtitle">
            일기를 작성한 날과 회고를 한 눈에 볼 수 있어요.
          </p>
        </div>
      </header>

      <div className="calendar-layout">
        <DashboardCard title="캘린더" subtitle="기록이 있는 날에 점 표시">
          <div style={{ height: 280 }} />
        </DashboardCard>

        <DashboardCard title="선택 날짜의 일기" subtitle="최근 일기 리스트">
          <ul className="home-list">
            <li>어제의 회고</li>
            <li>지난 주말 기록</li>
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
}

export default DiaryCalendarScreen;
