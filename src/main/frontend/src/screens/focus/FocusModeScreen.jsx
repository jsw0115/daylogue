import React, { useEffect, useMemo, useRef, useState } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function FocusModeScreen() {
  const [tab, setTab] = useState("pomodoro"); // "free" | "pomodoro"
  const [running, setRunning] = useState(false);

  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);

  const [phase, setPhase] = useState("work"); // work | break
  const [secLeft, setSecLeft] = useState(workMin * 60);

  const tickRef = useRef(null);

  const total = useMemo(() => {
    const m = Math.floor(secLeft / 60);
    const s = secLeft % 60;
    return `${pad(m)}:${pad(s)}`;
  }, [secLeft]);

  // 설정 변경 시(정지 상태) 초기화
  useEffect(() => {
    if (running) return;
    if (phase === "work") setSecLeft(workMin * 60);
    else setSecLeft(breakMin * 60);
  }, [workMin, breakMin, phase, running]);

  useEffect(() => {
    if (!running) return;

    tickRef.current = setInterval(() => {
      setSecLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (secLeft !== 0) return;

    // 세션 종료 → 다음 페이즈로 자동 전환
    if (phase === "work") {
      setPhase("break");
      setSecLeft(breakMin * 60);
    } else {
      setPhase("work");
      setSecLeft(workMin * 60);
    }
  }, [secLeft, running, phase, workMin, breakMin]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setPhase("work");
    setSecLeft(workMin * 60);
  };

  return (
    <div className="focus-screen">
      <div className="screen-head">
        <div>
          <div className="screen-title">집중 모드</div>
          <div className="screen-subtitle">포모도로/자유 타이머로 집중 시간을 기록하세요.</div>
        </div>
        <div className="seg">
          <button className={`seg__btn ${tab === "free" ? "is-on" : ""}`} onClick={() => setTab("free")} type="button">자유 시간</button>
          <button className={`seg__btn ${tab === "pomodoro" ? "is-on" : ""}`} onClick={() => setTab("pomodoro")} type="button">포모도로</button>
        </div>
      </div>

      {tab === "pomodoro" && (
        <div className="focus-card">
          <div className="focus-row">
            <div className="field small">
              <div className="label">집중(분)</div>
              <input type="number" min={1} value={workMin} onChange={(e) => setWorkMin(Number(e.target.value || 25))} disabled={running} />
            </div>
            <div className="field small">
              <div className="label">휴식(분)</div>
              <input type="number" min={1} value={breakMin} onChange={(e) => setBreakMin(Number(e.target.value || 5))} disabled={running} />
            </div>
            <div className="pill">{phase === "work" ? "집중" : "휴식"}</div>
          </div>

          <div className="timer">{total}</div>

          <div className="focus-actions">
            {!running ? (
              <button className="btn primary" onClick={start} type="button">시작</button>
            ) : (
              <button className="btn" onClick={pause} type="button">일시정지</button>
            )}
            <button className="btn" onClick={reset} type="button">리셋</button>
          </div>

          <div className="muted">
            포모도로 탭이 “미구현”으로 보이던 건 UI만 있고 타이머 로직이 없어서였고, 지금 파일로 동작하게 바뀜.
          </div>
        </div>
      )}

      {tab === "free" && (
        <div className="focus-card">
          <div className="muted">자유 타이머는 다음 단계에서 “목표 시간/카테고리/기록 저장 API” 연결로 확장.</div>
          <div className="timer">00:00</div>
          <div className="focus-actions">
            <button className="btn primary" type="button" onClick={() => alert("자유 타이머는 다음 단계에서 구현 확장")}>
              시작
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
