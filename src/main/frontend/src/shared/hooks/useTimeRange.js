// 타임바 등에서 24시간 분 단위 계산용 간단 훅
export function useTimeRange() {
  const minutesInDay = 24 * 60;

  const toMinute = (timeStr) => {
    // "HH:MM" -> minute
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const toTimeString = (minute) => {
    const h = String(Math.floor(minute / 60)).padStart(2, "0");
    const m = String(minute % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  return { minutesInDay, toMinute, toTimeString };
}
