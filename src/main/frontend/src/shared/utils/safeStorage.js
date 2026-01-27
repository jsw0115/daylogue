// FILE: src/shared/utils/safeStorage.js
// - localStorage가 막힌 환경에서도 앱이 죽지 않도록 안전 래퍼 제공
// - 기존 코드 호환: default export + named export(safeStorage) 둘 다 제공
// - 기존 코드 호환: get/set/keys/removeItem/isPersistentAvailable 유지
// - 신규 코드 호환: getItem/setItem/getJSON/setJSON 제공
// - 추가: remove(key) 별칭 제공 (removeItem과 동일 동작)

const memoryStore = new Map();

// localStorage 사용 가능 여부는 매번 테스트하지 말고 캐시(성능 + 안정성)
let _checked = false;
let _persistentAvailable = false;

function hasWindow() {
  return typeof window !== "undefined";
}

function detectLocalStorageAvailable() {
  if (!hasWindow()) return false;
  try {
    // 이 접근 자체가 SecurityError를 던질 수 있음
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

function canUseLocalStorage() {
  if (_checked) return _persistentAvailable;
  _checked = true;
  _persistentAvailable = detectLocalStorageAvailable();
  return _persistentAvailable;
}

function readRaw(key) {
  const k = String(key ?? "");
  if (!k) return null;

  if (canUseLocalStorage()) {
    try {
      return window.localStorage.getItem(k);
    } catch {
      // fallthrough
    }
  }
  return memoryStore.has(k) ? memoryStore.get(k) : null;
}

function writeRaw(key, value) {
  const k = String(key ?? "");
  if (!k) return;

  const v = value == null ? "" : String(value);

  if (canUseLocalStorage()) {
    try {
      window.localStorage.setItem(k, v);
      // localStorage에 저장 성공하면 메모리 동기화 제거
      memoryStore.delete(k);
      return;
    } catch {
      // fallthrough
    }
  }
  memoryStore.set(k, v);
}

function removeRaw(key) {
  const k = String(key ?? "");
  if (!k) return;

  if (canUseLocalStorage()) {
    try {
      window.localStorage.removeItem(k);
    } catch {
      // ignore
    }
  }
  memoryStore.delete(k);
}

function allKeys() {
  const out = new Set();

  if (canUseLocalStorage()) {
    try {
      const ls = window.localStorage;
      for (let i = 0; i < ls.length; i++) {
        const kk = ls.key(i);
        if (kk) out.add(kk);
      }
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

  // 기존 코드에서 safeStorage.remove(key)를 쓰는 케이스 대응(별칭)
  remove(key) {
    removeRaw(key);
  },

  getJSON(key, fallback = null) {
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

  // 구형 코드 호환 API (get/set 기반)
  get(key, fallback = "") {
    return safeStorage.getItem(key, fallback);
  },

  set(key, value) {
    safeStorage.setItem(key, value);
  },
};

// 핵심: default export도 반드시 제공
export default safeStorage;
