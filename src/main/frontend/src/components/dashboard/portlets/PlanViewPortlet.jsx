import React from "react";

export default function PlanViewPortlet({ planViewMode, setPlanViewMode }) {
  return (
    <>
      <div className="plan-view-header">
        <div className="plan-view-tabs">
          {[
            { key: "chart", label: "막대 차트" },
            { key: "gantt", label: "간트형" },
            { key: "timetable", label: "시간표" },
            { key: "list", label: "목록" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={"plan-view-tab" + (planViewMode === tab.key ? " plan-view-tab--active" : "")}
              onClick={() => setPlanViewMode(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {planViewMode === "chart" && (
        <div className="plan-view-chart">
          {["공부", "업무", "건강", "휴식"].map((cat) => (
            <div key={cat} className="plan-view-chart-row">
              <span className="plan-view-chart-label">{cat}</span>
              <div className="plan-view-chart-bar-bg">
                <div className="plan-view-chart-bar plan-view-chart-bar--plan" />
                <div className="plan-view-chart-bar plan-view-chart-bar--actual" />
              </div>
            </div>
          ))}
        </div>
      )}

      {planViewMode === "gantt" && (
        <div className="plan-view-gantt">
          <div className="plan-view-gantt-row">
            <div className="plan-view-gantt-label">오전</div>
            <div className="plan-view-gantt-track">
              <div className="plan-view-gantt-block plan-view-gantt-block--study">공부</div>
              <div className="plan-view-gantt-block plan-view-gantt-block--work">업무</div>
            </div>
          </div>
          <div className="plan-view-gantt-row">
            <div className="plan-view-gantt-label">오후</div>
            <div className="plan-view-gantt-track">
              <div className="plan-view-gantt-block plan-view-gantt-block--health">운동</div>
              <div className="plan-view-gantt-block plan-view-gantt-block--rest">휴식</div>
            </div>
          </div>
        </div>
      )}

      {planViewMode === "timetable" && (
        <div className="plan-view-timetable">
          {["06", "08", "10", "12", "14", "16", "18", "20", "22"].map((h) => (
            <div key={h} className="plan-view-timetable-row">
              <div className="plan-view-timetable-time">{h}:00</div>
              <div className="plan-view-timetable-cell" />
            </div>
          ))}
        </div>
      )}

      {planViewMode === "list" && (
        <div className="plan-view-list">
          <ul>
            <li>
              <span className="plan-view-list-time">07:00</span>
              <span className="plan-view-list-title">기상 & 스트레칭 (루틴)</span>
            </li>
            <li>
              <span className="plan-view-list-time">09:00</span>
              <span className="plan-view-list-title">프로젝트 업무 (할 일)</span>
            </li>
            <li>
              <span className="plan-view-list-time">20:00</span>
              <span className="plan-view-list-title">SQLD 공부 (집중 모드)</span>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
