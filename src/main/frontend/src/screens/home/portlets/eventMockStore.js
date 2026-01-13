// FILE: src/screens/home/portlets/eventMockStore.js
import { safeStorage } from "../../../shared/utils/safeStorage";

const KEY = "events.mock.v1";

function id() {
  return `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// Event mock shape (요약)
// {
//   id, title, dateKey(YYYY-MM-DD), start("HH:mm"), end("HH:mm"),
//   category, visibility("PUBLIC"|"PARTICIPANTS"|"BUSY_ONLY"|"PRIVATE"),
//   importance("LOW"|"NORMAL"|"HIGH"),
//   isBookmarked, isDday, ddayPinned,
//   repeatRule("NONE"|"DAILY"|"WEEKLY"|"MONTHLY"|"YEARLY"),
//   reminderMin, timeZone("Asia/Seoul"),
//   ownerUserId("me"), participantsCount,
//   deletedAt(null|number) // EVT-DEL-F01 방향성만 표시
// }

export function getEvents() {
  return safeStorage.getJSON(KEY, []);
}

export function saveEvents(list) {
  safeStorage.setJSON(KEY, list);
}

export function seedIfEmpty() {
  const cur = getEvents();
  if (cur.length) return;

  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const dateKey = `${y}-${m}-${d}`;

  const demo = [
    {
      id: id(),
      title: "팀 미팅",
      dateKey,
      start: "10:00",
      end: "10:30",
      category: "업무",
      visibility: "PARTICIPANTS",
      importance: "HIGH",
      isBookmarked: true,
      isDday: false,
      ddayPinned: false,
      repeatRule: "WEEKLY",
      reminderMin: 10,
      timeZone: "Asia/Seoul",
      ownerUserId: "me",
      participantsCount: 4,
      deletedAt: null,
    },
    {
      id: id(),
      title: "러닝",
      dateKey,
      start: "19:30",
      end: "20:10",
      category: "건강",
      visibility: "PUBLIC",
      importance: "NORMAL",
      isBookmarked: false,
      isDday: true,
      ddayPinned: true,
      repeatRule: "NONE",
      reminderMin: 30,
      timeZone: "Asia/Seoul",
      ownerUserId: "me",
      participantsCount: 1,
      deletedAt: null,
    },
  ];

  saveEvents(demo);
}

export function addEvent(payload) {
  const list = getEvents();
  const next = [
    {
      id: id(),
      deletedAt: null,
      ownerUserId: "me",
      participantsCount: 1,
      timeZone: "Asia/Seoul",
      repeatRule: "NONE",
      reminderMin: 10,
      importance: "NORMAL",
      visibility: "PRIVATE",
      category: "기타",
      isBookmarked: false,
      isDday: false,
      ddayPinned: false,
      ...payload,
    },
    ...list,
  ];
  saveEvents(next);
  return next;
}

export function toggleBookmark(eventId) {
  const list = getEvents();
  const next = list.map((e) =>
    e.id === eventId ? { ...e, isBookmarked: !e.isBookmarked } : e
  );
  saveEvents(next);
  return next;
}

export function toggleDdayPinned(eventId) {
  const list = getEvents();
  const next = list.map((e) =>
    e.id === eventId ? { ...e, ddayPinned: !e.ddayPinned, isDday: true } : e
  );
  saveEvents(next);
  return next;
}
