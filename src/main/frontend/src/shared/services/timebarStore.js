// src/main/frontend/src/shared/services/timebarStore.js
import { safeStorage } from "../utils/safeStorage";

const KEY_SCHEDULES = "timebar:schedules";
const KEY_ROUTINES = "timebar:routines";
const KEY_DIARY = "timebar:diary";

function uuid() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// ---------- SCHEDULES ----------
export function loadSchedules() {
  return safeStorage.getJSON(KEY_SCHEDULES, []);
}

export function saveSchedules(items) {
  safeStorage.setJSON(KEY_SCHEDULES, items);
}

export function upsertSchedule(schedule) {
  const items = loadSchedules();
  const now = new Date().toISOString();
  if (!schedule.id) {
    const created = { ...schedule, id: uuid(), createdAt: now, updatedAt: now };
    saveSchedules([created, ...items]);
    return created;
  }
  const next = items.map((it) => (it.id === schedule.id ? { ...it, ...schedule, updatedAt: now } : it));
  saveSchedules(next);
  return next.find((it) => it.id === schedule.id);
}

export function deleteSchedule(id) {
  const items = loadSchedules().filter((it) => it.id !== id);
  saveSchedules(items);
}

// ---------- ROUTINES ----------
export function loadRoutines() {
  return safeStorage.getJSON(KEY_ROUTINES, []);
}

export function saveRoutines(items) {
  safeStorage.setJSON(KEY_ROUTINES, items);
}

export function upsertRoutine(routine) {
  const items = loadRoutines();
  const now = new Date().toISOString();
  if (!routine.id) {
    const created = { ...routine, id: uuid(), createdAt: now, updatedAt: now };
    saveRoutines([created, ...items]);
    return created;
  }
  const next = items.map((it) => (it.id === routine.id ? { ...it, ...routine, updatedAt: now } : it));
  saveRoutines(next);
  return next.find((it) => it.id === routine.id);
}

export function deleteRoutine(id) {
  const items = loadRoutines().filter((it) => it.id !== id);
  saveRoutines(items);
}

// ---------- DIARY ----------
export function loadDiaryMap() {
  return safeStorage.getJSON(KEY_DIARY, {});
}

export function loadDiary(dateKey /* YYYY-MM-DD */) {
  const map = loadDiaryMap();
  return map[dateKey]?.content ?? "";
}

export function saveDiary(dateKey, content) {
  const map = loadDiaryMap();
  map[dateKey] = { content, updatedAt: new Date().toISOString() };
  safeStorage.setJSON(KEY_DIARY, map);
}
