// FILE: src/main/frontend/src/shared/utils/calendarUtils.js
// 간단 날짜 유틸 & 주/월 캘린더 생성

export function parseISO(dateStr) {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(dateStr, days) {
  const d = parseISO(dateStr);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

// 월요일 시작 주차 기준
export function getWeekStart(dateStr) {
  const d = parseISO(dateStr);
  const day = d.getDay(); // 0(일) ~ 6(토)
  const diffFromMonday = (day + 6) % 7; // 월=0, 화=1 ...
  d.setDate(d.getDate() - diffFromMonday);
  return toISO(d);
}

export function buildWeekDays(weekStartStr) {
  const start = parseISO(weekStartStr);
  const result = [];
  const weeknames = ["일", "월", "화", "수", "목", "금", "토"];

  for (let i = 0; i < 7; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = toISO(d);
    const weekday = weeknames[d.getDay()];
    result.push({
      dateStr,
      weekday,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
    });
  }
  return result;
}

// month: 1~12, 6줄 x 7칸 = 42셀
export function buildMonthMatrix(year, month) {
  const firstOfMonth = new Date(year, month - 1, 1);
  const firstDay = firstOfMonth.getDay(); // 0~6
  const startDate = new Date(year, month - 1, 1 - firstDay);

  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = toISO(d);
    const inCurrentMonth = d.getMonth() === month - 1;
    cells.push({
      dateStr,
      inCurrentMonth,
      day: d.getDate(),
      weekday: d.getDay(),
    });
  }
  return cells;
}
