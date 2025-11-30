// src/components/planner/TimebarTimeline.jsx
import React, { useMemo, useRef } from "react";

const CATEGORY_COLORS = {
  study: "#4F8BFF",
  work: "#3B5BDB",
  family: "#FB7185",
  friends: "#FB923C",
  health: "#22C55E",
  rest: "#14B8A6",
  other: "#9CA3AF",
};

const DAY_START_MINUTES = 6 * 60;
const DAY_END_MINUTES = 24 * 60;
const DAY_RANGE = DAY_END_MINUTES - DAY_START_MINUTES;
const hours = Array.from({ length: 19 }, (_, idx) => 6 + idx); // 6~24

function minutesToPercent(minutes) {
  const clamped = Math.min(Math.max(minutes, DAY_START_MINUTES), DAY_END_MINUTES);
  return ((clamped - DAY_START_MINUTES) / DAY_RANGE) * 100;
}

// Date | string | null -> ISO 'YYYY-MM-DD'
function normalizeDateValue(date) {
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }
  if (date == null) return "";
  return String(date);
}

/**
 * props:
 *  - date: Date | string
 *  - viewMode: 'plan' | 'actual' | 'overlay'
 *  - planBlocks / actualBlocks: TimeBlock[]
 *  - onViewModeChange?: (mode) => void
 *  - onBlockSelect?: (block) => void
 *  - onBlockCreate?: ({ date, startMinutes, endMinutes, categoryId, type }) => void
 *  - onBlockContextMenu?: (block, event) => void
 */
function TimebarTimeline(props) {
  const {
    date,
    viewMode,
    planBlocks,
    actualBlocks,
    onViewModeChange,
    onBlockSelect,
    onBlockCreate,
    onBlockContextMenu,
  } = props;

  const containerRef = useRef(null);
  const dateValue = normalizeDateValue(date);

  const blocksToRender = useMemo(() => {
    if (viewMode === "plan") return planBlocks || [];
    if (viewMode === "actual") return actualBlocks || [];

    const plan = (planBlocks || []).map((b) => ({ ...b, __mode: "PLAN" }));
    const actual = (actualBlocks || []).map((b) => ({ ...b, __mode: "ACTUAL" }));
    return [...plan, ...actual];
  }, [viewMode, planBlocks, actualBlocks]);

  const handleBackgroundDoubleClick = (e) => {
    if (!onBlockCreate || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const ratio = y / rect.height;

    const baseMinutes =
      DAY_START_MINUTES + Math.round((ratio * DAY_RANGE) / 30) * 30;
    const startMinutes = Math.max(DAY_START_MINUTES, baseMinutes);
    const endMinutes = Math.min(startMinutes + 60, DAY_END_MINUTES);

    onBlockCreate({
      date: dateValue, // ✅ 문자열로 넘겨줌
      startMinutes,
      endMinutes,
      categoryId: "other",
      type: viewMode === "plan" ? "PLAN" : "ACTUAL",
    });
  };

  return (
    <div className="timebar-timeline">
      {/* 상단 컨트롤 바 */}
      <div className="timebar-timeline__header">
        {/* ✅ 여기서도 Date 객체 그대로가 아니라 문자열만 렌더링 */}
        <span className="timebar-timeline__date">{dateValue}</span>

        <div className="timebar-timeline__view-toggle">
          <button
            type="button"
            className={`tabbar__item ${
              viewMode === "plan" ? "tabbar__item--active" : ""
            }`}
            onClick={() => onViewModeChange && onViewModeChange("plan")}
          >
            Plan
          </button>
          <button
            type="button"
            className={`tabbar__item ${
              viewMode === "actual" ? "tabbar__item--active" : ""
            }`}
            onClick={() => onViewModeChange && onViewModeChange("actual")}
          >
            Actual
          </button>
          <button
            type="button"
            className={`tabbar__item ${
              viewMode === "overlay" ? "tabbar__item--active" : ""
            }`}
            onClick={() => onViewModeChange && onViewModeChange("overlay")}
          >
            Overlay
          </button>
        </div>
      </div>

      <div className="timebar-timeline__body">
        {/* 시간 눈금 */}
        <div className="timebar-timeline__axis">
          {hours.map((h) => (
            <div key={h} className="timebar-timeline__axis-row">
              <span>{`${h}:00`}</span>
            </div>
          ))}
        </div>

        {/* 메인 타임라인 */}
        <div
          ref={containerRef}
          className="timebar-timeline__track"
          onDoubleClick={handleBackgroundDoubleClick}
        >
          {blocksToRender.map((block) => {
            const top = minutesToPercent(block.startMinutes);
            const bottom = 100 - minutesToPercent(block.endMinutes);
            const height = 100 - top - bottom;
            const color = CATEGORY_COLORS[block.categoryId] || "#9CA3AF";

            const isPlan =
              viewMode === "plan" ||
              (viewMode === "overlay" && block.__mode === "PLAN");
            const isActual =
              viewMode === "actual" ||
              (viewMode === "overlay" && block.__mode === "ACTUAL");

            return (
              <div
                key={block.id + (block.__mode || "")}
                className={`timebar-timeline__block ${
                  isPlan && viewMode === "overlay"
                    ? "timebar-timeline__block--plan-overlay"
                    : ""
                } ${
                  isActual && viewMode === "overlay"
                    ? "timebar-timeline__block--actual-overlay"
                    : ""
                }`}
                style={{
                  top: `${top}%`,
                  height: `${Math.max(height, 2)}%`,
                  backgroundColor: isActual ? color : "transparent",
                  borderColor: isPlan ? color : "transparent",
                }}
                onClick={() => onBlockSelect && onBlockSelect(block)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onBlockContextMenu && onBlockContextMenu(block, e);
                }}
              >
                <div className="timebar-timeline__block-title">
                  {block.title || "(제목 없음)"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TimebarTimeline;
