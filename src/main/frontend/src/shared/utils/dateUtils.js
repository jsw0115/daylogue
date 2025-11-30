export function formatDateKorean(dateStr) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${y}. ${m}. ${day} (${weekday})`;
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
