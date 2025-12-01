// FILE: src/main/frontend/src/shared/hooks/useTimeRange.js

// 타임바 등에서 24시간 분 단위 계산 + 스냅/클램프 유틸
export function useTimeRange(options = {}) {
  const {
    snapMinutes = 15,
    dayStartMinutes = 0,
    dayEndMinutes = 24 * 60,
  } = options;

  const minutesInDay = dayEndMinutes - dayStartMinutes;

  const toMinute = (timeStr) => {
    // "HH:MM" -> minute
    if (!timeStr) return dayStartMinutes;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const toTimeString = (minute) => {
    const clamped = clamp(minute);
    const h = String(Math.floor(clamped / 60)).padStart(2, "0");
    const m = String(clamped % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const snap = (minute) => {
    if (!snapMinutes || snapMinutes <= 1) return minute;
    return Math.round(minute / snapMinutes) * snapMinutes;
  };

  const clamp = (minute) => {
    return Math.min(
      dayEndMinutes,
      Math.max(dayStartMinutes, minute)
    );
  };

  /**
   * 블록 범위 정규화 (스냅 + 최소 길이 보장)
   */
  const normalizeRange = (
    startMinute,
    endMinute,
    { minDuration = snapMinutes } = {}
  ) => {
    let s = clamp(snap(startMinute));
    let e = clamp(snap(endMinute));

    if (e < s) {
      const tmp = s;
      s = e;
      e = tmp;
    }

    if (e - s < minDuration) {
      e = clamp(s + minDuration);
    }

    return [s, e];
  };

  /**
   * 분 단위를 트랙 높이(px) 기준 오프셋으로 변환
   */
  const minuteToOffset = (minute, trackHeight) => {
    const clamped = clamp(minute);
    const ratio =
      (clamped - dayStartMinutes) / minutesInDay || 0;
    return ratio * trackHeight;
  };

  /**
   * 시작/종료 분 -> top/height(px) 스타일 계산
   */
  const rangeToStyle = (startMinute, endMinute, trackHeight) => {
    const [s, e] = normalizeRange(startMinute, endMinute);
    const top = minuteToOffset(s, trackHeight);
    const bottom = minuteToOffset(e, trackHeight);
    return {
      top,
      height: Math.max(bottom - top, 0),
    };
  };

  return {
    minutesInDay,
    toMinute,
    toTimeString,
    snap,
    clamp,
    normalizeRange,
    minuteToOffset,
    rangeToStyle,
  };
}
