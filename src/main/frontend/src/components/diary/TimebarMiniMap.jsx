// src/components/diary/TimebarMiniMap.jsx
import React from "react";

const CATEGORY_COLORS = {
  study: "#4F8BFF",
  work: "#3B5BDB",
  family: "#FB7185",
  friends: "#FB923C",
  health: "#22C55E",
  rest: "#14B8A6",
  other: "#9CA3AF",
};

// Date | string | null -> ISO 'YYYY-MM-DD' 형태 문자열로 변환
function normalizeDateValue(date) {
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10); // 2025-11-30
  }
  if (date == null) return "";
  return String(date);
}

/**
 * props:
 *  - date: Date | string
 *  - summary: { date, slices: [{ categoryId, minutes }] } | null
 *  - onDrilldown?: (dateString) => void
 */
function TimebarMiniMap({ date, summary, onDrilldown }) {
  const dateValue = normalizeDateValue(date);

  const totalMinutes =
    summary?.slices?.reduce((acc, cur) => acc + (cur.minutes || 0), 0) ?? 0;

  const slicesWithRatio =
    summary?.slices?.map((slice) => ({
      ...slice,
      ratio: totalMinutes ? slice.minutes / totalMinutes : 0,
    })) ?? [];

  return (
    <button
      type="button"
      className="timebar-mini"
      onClick={() => onDrilldown && onDrilldown(dateValue)}
    >
      <div className="timebar-mini__bar">
        {slicesWithRatio.length === 0 ? (
          <div className="timebar-mini__segment timebar-mini__segment--empty" />
        ) : (
          slicesWithRatio.map((item) => (
            <div
              key={item.categoryId}
              className="timebar-mini__segment"
              style={{
                flexGrow: item.ratio || 0.0001,
                backgroundColor: CATEGORY_COLORS[item.categoryId] || "#9CA3AF",
              }}
              title={`${item.categoryId} · ${Math.round(
                (item.minutes || 0) / 60
              )}h`}
            />
          ))
        )}
      </div>

      <div className="timebar-mini__meta">
        {/* ✅ 여기서 더 이상 Date 객체를 직접 렌더링하지 않음 */}
        <span className="timebar-mini__date">{dateValue}</span>
        {totalMinutes > 0 && (
          <span className="timebar-mini__total">
            {Math.round(totalMinutes / 60)}h
          </span>
        )}
      </div>
    </button>
  );
}

export default TimebarMiniMap;
