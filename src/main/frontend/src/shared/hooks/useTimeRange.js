// src/main/frontend/src/shared/hooks/useTimeRange.js
import { useMemo } from "react";
import { parseTimeToMinutes } from "../utils/timeUtils";

export function useTimeRange(blocks) {
  // 블록들의 전체 시간(min, max)을 계산 → 통계/타임라인 등에서 활용
  return useMemo(() => {
    if (!blocks || blocks.length === 0) {
      return { minMinutes: 6 * 60, maxMinutes: 24 * 60 };
    }

    let min = Infinity;
    let max = -Infinity;
    blocks.forEach((b) => {
      const start = parseTimeToMinutes(b.start);
      const end = parseTimeToMinutes(b.end);
      min = Math.min(min, start);
      max = Math.max(max, end);
    });

    return { minMinutes: min, maxMinutes: max };
  }, [blocks]);
}

