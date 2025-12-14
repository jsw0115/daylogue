// FILE: src/shared/utils/routineStore.js
import moment from "moment";
import { safeStorage } from "./safeStorage";

const KEY = "planner.routines.v1";

function uid(prefix = "rt") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function loadAll() {
  const list = safeStorage.getJSON(KEY, []);
  return Array.isArray(list) ? list : [];
}
function saveAll(list) {
  safeStorage.setJSON(KEY, list);
}

export function listRoutines() {
  return loadAll();
}

export function upsertRoutine(routine) {
  const list = loadAll();
  const next = { ...routine };
  if (!next.id) next.id = uid("rt");
  next.updatedAt = Date.now();
  if (!next.createdAt) next.createdAt = next.updatedAt;

  const idx = list.findIndex((r) => r.id === next.id);
  if (idx >= 0) list[idx] = next;
  else list.push(next);

  saveAll(list);
  return next;
}

export function deleteRoutine(id) {
  const list = loadAll();
  saveAll(list.filter((r) => r.id !== id));
}

function dayKeyOf(date) {
  const d = moment(date).day(); // 0..6
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d];
}

export function getRoutinesForDate(date) {
  const list = loadAll();
  const wk = dayKeyOf(date);

  return list
    .filter((r) => r.active !== false)
    .filter((r) => {
      if (r.type === "daily") return true;
      if (r.type === "weekly") {
        const days = Array.isArray(r.days) ? r.days : [];
        return days.includes(wk);
      }
      return false;
    })
    .sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
}
