// src/shared/utils/safeStorage.js
// - localStorage가 막힌 환경에서도 앱이 죽지 않도록 안전 래퍼 제공
// - 기존 코드 호환: default export + named export(safeStorage) 둘 다 제공
// - 기존 코드 호환: get/set/keys/removeItem/isPersistentAvailable 유지
// - 신규 코드 호환: getItem/setItem/getJSON/setJSON 제공

const memoryStore = new Map();

function hasWindow() {
  return typeof window !== "undefined";
}

function canUseLocalStorage() {
  if (!hasWindow()) return false;
  try {
    const ls = window.localStorage;
    if (!ls) return false;
    const k = "__ls_test__";
    ls.setItem(k, "1");
    ls.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

function readRaw(key) {
  if (canUseLocalStorage()) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return memoryStore.has(key) ? memoryStore.get(key) : null;
}

function writeRaw(key, value) {
  const v = value == null ? "" : String(value);
  if (canUseLocalStorage()) {
    try {
      window.localStorage.setItem(key, v);
      return;
    } catch {
      // fallthrough
    }
  }
  memoryStore.set(key, v);
}

function removeRaw(key) {
  if (canUseLocalStorage()) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
  memoryStore.delete(key);
}

function allKeys() {
  const out = new Set();
  if (canUseLocalStorage()) {
    try {
      const ls = window.localStorage;
      for (let i = 0; i < ls.length; i++) out.add(ls.key(i));
    } catch {
      // ignore
    }
  }
  for (const k of memoryStore.keys()) out.add(k);
  return Array.from(out).filter(Boolean);
}

export const safeStorage = {
  // 신규 API
  getItem(key, fallback = "") {
    const v = readRaw(key);
    return v == null ? fallback : v;
  },
  setItem(key, value) {
    writeRaw(key, value);
  },
  removeItem(key) {
    removeRaw(key);
  },
  getJSON(key, fallback) {
    const raw = readRaw(key);
    if (raw == null || raw === "") return fallback;
    try {
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  },
  setJSON(key, obj) {
    writeRaw(key, JSON.stringify(obj ?? null));
  },
  keys() {
    return allKeys();
  },
  isPersistentAvailable() {
    return canUseLocalStorage();
  },

  // 구형 코드 호환 API (HomeDashboardScreen 등)
  get(key, fallback = "") {
    return safeStorage.getItem(key, fallback);
  },
  set(key, value) {
    safeStorage.setItem(key, value);
  },
};

export default safeStorage;
