import React, { useEffect, useMemo, useRef, useState } from "react";
import { safeStorage } from "../../../shared/utils/safeStorage";

function fmt(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function PomodoroPortlet() {
  const defaults = useMemo(() => safeStorage.getJSON("pomodoro.settings", { focusMin: 25, breakMin: 5 }), []);
  const [focusMin, setFocusMin] = useState(defaults.focusMin);
  const [breakMin, setBreakMin] = useState(defaults.breakMin);

  const [phase, setPhase] = useState("FOCUS"); // FOCUS | BREAK
  const [running, setRunning] = useState(false);
  const [secLeft, setSecLeft] = useState(focusMin * 60);

  const timerRef = useRef(null);

  useEffect(() => {
    safeStorage.setJSON("pomodoro.settings", { focusMin, breakMin });
    if (!running) {
      setSecLeft((phase === "FOCUS" ? focusMin : breakMin) * 60);
    }
  }, [focusMin, breakMin]); // phase/running은 의도적으로 제외

  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setSecLeft((s) => s - 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (secLeft > 0) return;

    // phase 전환
    if (phase === "FOCUS") {
      setPhase("BREAK");
      setSecLeft(breakMin * 60);
    } else {
      setPhase("FOCUS");
      setSecLeft(focusMin * 60);
    }
  }, [secLeft, running, phase, focusMin, breakMin]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setSecLeft((phase === "FOCUS" ? focusMin : breakMin) * 60);
  };

  return (
    <div className="pomodoro">
      <div className="pomodoro__top">
        <div className={"badge " + (phase === "FOCUS" ? "badge--primary" : "badge--muted")}>
          {phase === "FOCUS" ? "집중" : "휴식"}
        </div>
        <div className="pomodoro__time">{fmt(Math.max(0, secLeft))}</div>
      </div>

      <div className="pomodoro__actions">
        {!running ? (
          <button className="btn btn--sm btn--primary" type="button" onClick={start}>시작</button>
        ) : (
          <button className="btn btn--sm" type="button" onClick={pause}>일시정지</button>
        )}
        <button className="btn btn--sm" type="button" onClick={reset}>리셋</button>
      </div>

      <div className="pomodoro__settings">
        <div className="fieldRow">
          <label className="fieldRow__label">집중(분)</label>
          <input className="fieldRow__input" type="number" min={1} value={focusMin} onChange={(e) => setFocusMin(Number(e.target.value || 1))} />
        </div>
        <div className="fieldRow">
          <label className="fieldRow__label">휴식(분)</label>
          <input className="fieldRow__input" type="number" min={1} value={breakMin} onChange={(e) => setBreakMin(Number(e.target.value || 1))} />
        </div>
      </div>
    </div>
  );
}
