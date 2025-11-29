// src/main/frontend/src/components/focus/FocusTimer.jsx
import React, { useEffect, useState } from "react";
import "../../styles/components.css";

function FocusTimer({ initialMinutes = 25, running, onTick, onFinish }) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish && onFinish();
          return 0;
        }
        const next = prev - 1;
        onTick && onTick(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="focus-timer__circle">
      <div className="focus-timer__time">
        {minutes}:{seconds}
      </div>
    </div>
  );
}

export default FocusTimer;

