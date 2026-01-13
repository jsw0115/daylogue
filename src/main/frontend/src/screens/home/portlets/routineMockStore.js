import { safeStorage } from "../../../shared/utils/safeStorage";

const KEY = "routines.mock.v1";

function rid() {
  return `rtn_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function dayOfWeekKey(dateKey) {
  const [y, m, d] = (dateKey || "").split("-").map((x) => Number(x));
  const dt = new Date(y, (m || 1) - 1, d || 1);
  // 0 Sun ... 6 Sat
  return dt.getDay();
}

// routines store shape
// {
//   routines: [{ id, name, type("daily"|"weekly"), time, daysOfWeek?: number[] }],
//   done: { [dateKey]: { [routineId]: true } }
// }

function load() {
  return safeStorage.getJSON(KEY, { routines: [], done: {} });
}

function save(v) {
  safeStorage.setJSON(KEY, v);
}

export function seedRoutinesIfEmpty() {
  const cur = load();
  if (cur?.routines?.length) return;

  const demo = {
    routines: [
      { id: rid(), name: "아침 스트레칭", type: "daily", time: "07:00" },
      { id: rid(), name: "SQLD 공부", type: "weekly", time: "21:00", daysOfWeek: [1, 3, 5] }, // Mon/Wed/Fri
      { id: rid(), name: "러닝", type: "weekly", time: "19:30", daysOfWeek: [2, 4, 6] }, // Tue/Thu/Sat
    ],
    done: {},
  };

  save(demo);
}

export function getTodayRoutines(dateKey) {
  const st = load();
  const dow = dayOfWeekKey(dateKey);
  const doneMap = st.done?.[dateKey] || {};

  const rows = (st.routines || []).filter((r) => {
    if (r.type === "daily") return true;
    if (r.type === "weekly") {
      const days = Array.isArray(r.daysOfWeek) ? r.daysOfWeek : [];
      return days.includes(dow);
    }
    return false;
  });

  return rows
    .slice()
    .sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")))
    .map((r) => ({
      ...r,
      done: !!doneMap[r.id],
      typeLabel: r.type === "daily" ? "매일" : "매주",
    }));
}

export function toggleRoutineDoneToday(dateKey, routineId) {
  const st = load();
  const done = { ...(st.done || {}) };
  const map = { ...(done[dateKey] || {}) };

  map[routineId] = !map[routineId];
  done[dateKey] = map;

  save({ ...st, done });
}
