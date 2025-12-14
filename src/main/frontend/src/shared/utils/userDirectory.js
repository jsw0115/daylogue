// FILE: src/shared/utils/userDirectory.js
import { safeStorage } from "./safeStorage";

const KEY = "mock.userDirectory.v1";

const DEFAULT_USERS = [
  "userA",
  "userB",
  "userC",
  "hong",
  "gildong",
  "tester",
  "admin",
];

export function loadUserDirectory() {
  const list = safeStorage.getJSON(KEY, null);
  if (Array.isArray(list) && list.length) return Array.from(new Set(list));
  return DEFAULT_USERS;
}

export function addUserToDirectory(userId) {
  const v = String(userId || "").trim();
  if (!v) return loadUserDirectory();
  const cur = loadUserDirectory();
  if (cur.includes(v)) return cur;
  const next = [...cur, v];
  safeStorage.setJSON(KEY, next);
  return next;
}
