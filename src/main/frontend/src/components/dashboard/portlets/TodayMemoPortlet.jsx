// FILE: src/components/dashboard/portlets/TodayMemoPortlet.jsx
import React from "react";

export default function TodayMemoPortlet({
  todayMemo,
  setTodayMemo,
  todayQuote,
  setTodayQuote,
}) {
  return (
    <>
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
        일간 플래너의 일일 메모/명언과 연동할 수 있는 영역입니다. 추후 API와 연결해서
        자동 저장/불러오기를 할 수 있습니다.
      </p>
    </>
  );
}
