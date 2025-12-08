import React, { useEffect, useState } from "react";
import "../../styles/screens/focus.css";

const FocusSessionScreen = () => {
  // 자유 집중 타이머
  const [freeRunning, setFreeRunning] = useState(false);
  const [freeSeconds, setFreeSeconds] = useState(0);

  // 포모도로
  const [pomodoroMode, setPomodoroMode] = useState("focus"); // focus | break
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60); // 기본 25분
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  // 자유 타이머 tick
  useEffect(() => {
    if (!freeRunning) return;
    const id = setInterval(() => {
      setFreeSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [freeRunning]);

  // 포모도로 tick
  useEffect(() => {
    if (!pomodoroRunning) return;
    if (pomodoroSeconds <= 0) {
      // 모드 전환
      if (pomodoroMode === "focus") {
        setPomodoroMode("break");
        setPomodoroSeconds(5 * 60); // 5분 휴식
      } else {
        setPomodoroMode("focus");
        setPomodoroSeconds(25 * 60);
      }
      return;
    }
    const id = setInterval(() => {
      setPomodoroSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [pomodoroRunning, pomodoroSeconds, pomodoroMode]);

  const format = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="screen focus-session-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">타임라인 기반 집중 관리</h1>
          <p className="text-muted font-small">
            자유 집중 타이머와 포모도로 타이머로 집중 시간을 관리합니다.
          </p>
        </div>
      </div>

      <div className="focus-grid">
        {/* 자유 집중 모드 */}
        <section className="card focus-card">
          <h2 className="dashboard-card__title">자유 집중 타이머</h2>
          <p className="text-muted font-small">
            “지금부터 공부/작업 시작” 느낌으로 자유롭게 시간을 기록합니다.
          </p>
          <div className="focus-timer-display">
            <span className="focus-timer-time">
              {format(freeSeconds)}
            </span>
          </div>
          <div className="focus-timer-actions">
            {!freeRunning ? (
              <button
                className="btn btn--primary"
                onClick={() => setFreeRunning(true)}
              >
                시작
              </button>
            ) : (
              <button
                className="btn btn--secondary"
                onClick={() => setFreeRunning(false)}
              >
                일시정지
              </button>
            )}
            <button
              className="btn btn--ghost"
              onClick={() => {
                setFreeRunning(false);
                setFreeSeconds(0);
              }}
            >
              리셋
            </button>
          </div>
        </section>

        {/* 포모도로 모드 */}
        <section className="card focus-card">
          <h2 className="dashboard-card__title">포모도로 타이머</h2>
          <p className="text-muted font-small">
            25분 집중 / 5분 휴식을 반복하며 루틴에 맞게 집중 시간을 쌓을 수 있습니다.
          </p>

          <div className="focus-pomodoro-mode">
            현재 모드:{" "}
            <span className={pomodoroMode === "focus" ? "text-primary" : "text-success"}>
              {pomodoroMode === "focus" ? "집중" : "휴식"}
            </span>
          </div>

          <div className="focus-timer-display">
            <span className="focus-timer-time">
              {format(pomodoroSeconds)}
            </span>
          </div>

          <div className="focus-timer-actions">
            {!pomodoroRunning ? (
              <button
                className="btn btn--primary"
                onClick={() => setPomodoroRunning(true)}
              >
                시작
              </button>
            ) : (
              <button
                className="btn btn--secondary"
                onClick={() => setPomodoroRunning(false)}
              >
                일시정지
              </button>
            )}
            <button
              className="btn btn--ghost"
              onClick={() => {
                setPomodoroRunning(false);
                setPomodoroMode("focus");
                setPomodoroSeconds(25 * 60);
              }}
            >
              리셋
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FocusSessionScreen;
