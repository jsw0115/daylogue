// src/components/routine/RoutineTrackerGrid.jsx
import React, { useMemo, useRef, useState } from "react";

/**
 * 루틴 × 날짜 그리드
 *
 * props:
 *  - startDate: Date | string (YYYY-MM-DD)
 *  - dayCount: number (기본 7, 30 등)
 *  - routines: { id: string; name: string; icon?: string }[]
 *  - cells: {
 *      routineId: string;
 *      date: string | Date;   // 수행된 날짜
 *      status?: "done" | "missed" | "skip";
 *    }[]
 *  - onCellToggle?: (routineId: string, dateKey: string) => void
 *  - onCellLongPress?: (routineId: string, dateKey: string) => void
 */

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

// Date | string -> Date 객체로 통일
function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  return new Date();
}

// Date | string -> 'YYYY-MM-DD'
function toDateKey(value) {
  const d = toDate(value);
  return d.toISOString().slice(0, 10);
}

// Date | string -> 'M/D(요일)' 라벨 (JSX에 Date 직접 안 쓰고 문자열만)
function formatDayLabel(value) {
  const d = toDate(value);
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const weekday = WEEKDAY_KO[d.getDay()];
  return `${month}/${date}(${weekday})`;
}

function RoutineTrackerGrid({
  startDate,
  dayCount = 7,
  routines = [],
  cells = [],
  onCellToggle,
  onCellLongPress,
}) {
  const start = toDate(startDate);
  const [dragging, setDragging] = useState(false);

  // 날짜 배열 생성
  const days = useMemo(() => {
    return Array.from({ length: dayCount }, (_, idx) => {
      const d = new Date(start);
      d.setDate(d.getDate() + idx);
      return d;
    });
  }, [start.getTime(), dayCount]); // startDate 변경 시 재계산

  // cells -> Map('routineId|YYYY-MM-DD' -> status)
  const cellMap = useMemo(() => {
    const map = {};
    cells.forEach((c) => {
      const key = `${c.routineId}|${toDateKey(c.date)}`;
      map[key] = c.status || "done"; // 기본 done
    });
    return map;
  }, [cells]);

  // 롱프레스 핸들링용
  const longPressTimer = useRef(null);

  const handlePointerDown = (routineId, dateKey) => {
    setDragging(true);

    // 롱프레스 타이머 시작
    if (onCellLongPress) {
      longPressTimer.current = setTimeout(() => {
        onCellLongPress(routineId, dateKey);
        longPressTimer.current = null;
        setDragging(false);
      }, 500); // 0.5초 이상 누르면 롱프레스
    }
  };

  const handlePointerUp = (routineId, dateKey) => {
    const timer = longPressTimer.current;
    if (timer) {
      clearTimeout(timer);
      longPressTimer.current = null;

      // 롱프레스가 아니라면 토글로 처리
      if (onCellToggle) {
        onCellToggle(routineId, dateKey);
      }
    }
    setDragging(false);
  };

  const handlePointerLeave = () => {
    // 영역 벗어나면 롱프레스 취소
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setDragging(false);
  };

  return (
    <div className="routine-grid">
      {/* 상단 날짜 헤더 */}
      <div className="routine-grid__header-row">
        <div className="routine-grid__corner-cell">루틴</div>
        {days.map((d) => {
          const dateKey = toDateKey(d);
          return (
            <div key={dateKey} className="routine-grid__day-header">
              {/* ✅ 여기서 Date 객체 직접 안 쓰고, 문자열만 렌더링 */}
              <span className="routine-grid__day-label">
                {formatDayLabel(d)}
              </span>
            </div>
          );
        })}
      </div>

      {/* 루틴별 행 */}
      {routines.length === 0 ? (
        <div className="routine-grid__empty">
          아직 등록된 루틴이 없습니다. 루틴을 추가하고 매일 체크해보세요 ✨
        </div>
      ) : (
        routines.map((routine) => (
          <div
            key={routine.id}
            className="routine-grid__row"
            onMouseLeave={handlePointerLeave}
            onTouchMove={handlePointerLeave}
          >
            <div className="routine-grid__routine-cell">
              {routine.icon && (
                <span className="routine-grid__routine-icon">
                  {routine.icon}
                </span>
              )}
              <span className="routine-grid__routine-name">
                {routine.name}
              </span>
            </div>

            {days.map((d) => {
              const dateKey = toDateKey(d);
              const mapKey = `${routine.id}|${dateKey}`;
              const status = cellMap[mapKey]; // "done" | "missed" | "skip" | undefined
              const isActive = !!status;

              let emoji = "";
              if (status === "done") emoji = "✅";
              else if (status === "missed") emoji = "⚪";
              else if (status === "skip") emoji = "➖";

              return (
                <button
                  key={mapKey}
                  type="button"
                  className={
                    "routine-grid__cell" +
                    (isActive ? " routine-grid__cell--active" : "")
                  }
                  onMouseDown={() =>
                    handlePointerDown(routine.id, dateKey)
                  }
                  onMouseUp={() => handlePointerUp(routine.id, dateKey)}
                  onTouchStart={() =>
                    handlePointerDown(routine.id, dateKey)
                  }
                  onTouchEnd={() => handlePointerUp(routine.id, dateKey)}
                >
                  <span className="routine-grid__cell-emoji">
                    {emoji || ""}
                  </span>
                </button>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}

export default RoutineTrackerGrid;
