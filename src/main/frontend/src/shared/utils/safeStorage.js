// src/shared/utils/safeStorage.js
// localStorage 접근이 막히는(SecurityError) 환경에서도 죽지 않도록
// 모든 접근을 함수 내부 try/catch로 처리 + 메모리 fallback 제공

const memoryStore = new Map();

function hasWindow() {
  return typeof window !== "undefined";
}

function getLocalStorageSafely() {
  if (!hasWindow()) return null;
  try {
    // 어떤 환경에서는 window.localStorage "프로퍼티 읽기" 자체가 SecurityError를 던짐
    return window.localStorage;
  } catch (e) {
    return null;
  }
}

function canUseLocalStorage() {
  const ls = getLocalStorageSafely();
  if (!ls) return false;

  try {
    const k = "__safe_storage_test__";
    ls.setItem(k, "1");
    ls.removeItem(k);
    return true;
  } catch (e) {
    return false;
  }
}

function readRaw(key) {
  if (canUseLocalStorage()) {
    try {
      const ls = getLocalStorageSafely();
      return ls ? ls.getItem(key) : null;
    } catch (e) {
      return null;
    }
  }
  return memoryStore.has(key) ? String(memoryStore.get(key)) : null;
}

function writeRaw(key, value) {
  const v = value == null ? "" : String(value);

  if (canUseLocalStorage()) {
    try {
      const ls = getLocalStorageSafely();
      if (ls) ls.setItem(key, v);
      return;
    } catch (e) {
      // fallthrough
    }
  }
  memoryStore.set(key, v);
}

function removeRaw(key) {
  if (canUseLocalStorage()) {
    try {
      const ls = getLocalStorageSafely();
      if (ls) ls.removeItem(key);
      return;
    } catch (e) {
      // fallthrough
    }
  }
  memoryStore.delete(key);
}

function listKeys(prefix = "") {
  const keys = [];

  if (canUseLocalStorage()) {
    try {
      const ls = getLocalStorageSafely();
      if (!ls) return keys;

      for (let i = 0; i < ls.length; i += 1) {
        const k = ls.key(i);
        if (!k) continue;
        if (!prefix || k.startsWith(prefix)) keys.push(k);
      }
      return keys;
    } catch (e) {
      // fallthrough
    }
  }

  for (const k of memoryStore.keys()) {
    if (!prefix || String(k).startsWith(prefix)) keys.push(String(k));
  }
  return keys;
}

const safeStorage = {
  isAvailable() {
    return canUseLocalStorage();
  },

  getItem(key, fallback = null) {
    const v = readRaw(key);
    return v == null ? fallback : v;
  },

  setItem(key, value) {
    writeRaw(key, value);
  },

  removeItem(key) {
    removeRaw(key);
  },

  // ✅ 여기 때문에 지금 에러가 난다: getJSON / setJSON 제공
  getJSON(key, fallback = null) {
    const raw = readRaw(key);
    if (raw == null || raw === "") return fallback;

    try {
      return JSON.parse(raw);
    } catch (e) {
      // 저장된 값이 깨졌으면 fallback으로 처리
      return fallback;
    }
  },

  setJSON(key, obj) {
    try {
      const raw = JSON.stringify(obj);
      writeRaw(key, raw);
    } catch (e) {
      // stringify 실패(순환 참조 등)면 저장 안 함
    }
  },

  updateJSON(key, updater, fallback = null) {
    const current = safeStorage.getJSON(key, fallback);
    const next = typeof updater === "function" ? updater(current) : current;
    safeStorage.setJSON(key, next);
    return next;
  },

  keys(prefix = "") {
    return listKeys(prefix);
  },
};

export { safeStorage };
export default safeStorage;
