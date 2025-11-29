// src/main/frontend/src/screens/focus/FocusSessionScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import { useResponsiveLayout } from "../../shared/hooks/useResponsiveLayout";

function FocusSessionScreen() {
  const viewport = useResponsiveLayout();
  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState(25 * 60); // 25분

  const handleToggle = () => {
    setIsRunning((prev) => !prev);
    // TODO: 타이머 로직 추가
  };

  return (
    <AppShell title="집중 모드">
      <div className={`screen screen--focus screen--${viewport}`}>
        <header className="screen-header">
          <div className="screen-header__center">
            <h2>집중 모드</h2>
          </div>
        </header>

        <div className="focus-layout">
          <section className="focus-layout__main">
            <div className="focus-timer">
              <div className="focus-timer__category">
                <label>
                  카테고리
                  <select defaultValue="study">
                    <option value="study">공부</option>
                    <option value="work">업무</option>
                    <option value="health">건강</option>
                    <option value="rest">휴식</option>
                  </select>
                </label>
              </div>

              <div className="focus-timer__circle">
                <div className="focus-timer__time">
                  {String(Math.floor(remaining / 60)).padStart(2, "0")}:
                  {String(remaining % 60).padStart(2, "0")}
                </div>
              </div>

              <div className="focus-timer__controls">
                <button className="primary-button" onClick={handleToggle}>
                  {isRunning ? "일시정지" : "시작"}
                </button>
                <button className="ghost-button">종료</button>
              </div>
            </div>
          </section>

          <section className="focus-layout__side">
            <h3>오늘의 집중 기록</h3>
            <ul className="focus-session-list">
              <li>
                <span>공부 · SQLD 인강</span>
                <strong>25분</strong>
              </li>
              <li>
                <span>업무 · 문서 작성</span>
                <strong>50분</strong>
              </li>
            </ul>

            <h3>오늘의 리워드</h3>
            <p>오늘 3세션을 달성했어요! 🌱</p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

export default FocusSessionScreen;
