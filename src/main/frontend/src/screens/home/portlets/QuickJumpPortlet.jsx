// src/screens/home/portlets/QuickJumpPortlet.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuickJumpPortlet() {
  const nav = useNavigate();
  const go = (p) => nav(p);

  return (
    <div className="pj">
      <div className="pj-row">
        <button className="chip" type="button" onClick={() => go("/planner/daily")}>일간 플래너</button>
        <button className="chip" type="button" onClick={() => go("/planner/weekly")}>주간 플래너</button>
        <button className="chip" type="button" onClick={() => go("/action/task")}>할 일</button>
      </div>
      <div className="pj-row">
        <button className="chip" type="button" onClick={() => go("/insight/stat")}>통계</button>
        <button className="chip" type="button" onClick={() => go("/data")}>데이터 관리</button>
        <button className="chip" type="button" onClick={() => go("/focus-mode")}>포커스</button>
      </div>
    </div>
  );
}
