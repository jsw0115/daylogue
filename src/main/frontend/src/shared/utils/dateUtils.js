// src/main/frontend/src/shared/utils/dateUtils.js
export function formatDate(date) {
  if (!date) return "";
  if (typeof date === "string") return date;
  return date.toISOString().slice(0, 10);
}

export function todayString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

