import React from "react";
import { useNavigate } from "react-router-dom";

export default function FocusPomodoroPortlet() {
  const navigate = useNavigate();
  return (
    <div className="focus-mini">
      <div className="muted">포모도로(25/5)로 빠르게 집중을 시작할 수 있어요.</div>
      <div className="focus-mini__actions">
        <button className="btn primary" onClick={() => navigate("/focus")} type="button">
          포모도로 시작
        </button>
        <button className="btn" onClick={() => navigate("/insight/stat")} type="button">
          통계 보기
        </button>
      </div>
    </div>
  );
}
