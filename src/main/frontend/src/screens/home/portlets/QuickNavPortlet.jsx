import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuickNavPortlet() {
  const navigate = useNavigate();
  const go = (to) => () => navigate(to);

  return (
    <div className="quicknav">
      <button className="chip" onClick={go("/planner/daily")} type="button">일간 플래너</button>
      <button className="chip" onClick={go("/planner/weekly")} type="button">주간 플래너</button>
      <button className="chip" onClick={go("/planner/monthly")} type="button">월간 플래너</button>
      <button className="chip" onClick={go("/action/task")} type="button">할 일</button>
      <button className="chip" onClick={go("/focus")} type="button">포커스</button>
      <button className="chip" onClick={go("/data")} type="button">데이터 관리</button>
    </div>
  );
}
