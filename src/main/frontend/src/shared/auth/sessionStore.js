// FILE: src/main/frontend/src/shared/auth/sessionStore.js
import { safeStorage } from "../utils/safeStorage";

/**
 * "세션"이라고 부르지만 실제로는 토큰이 아니라
 * UI 표시/권한 분기용 사용자 정보(me) 캐시를 저장한다.
 *
 * 토큰(AccessToken/RefreshToken)은 저장하지 않는다.
 */
const KEY = "timeflow.session.v1";

/**
 * 저장 포맷:
 * {
 *   me: { id, email, nick, role, tz, ... },
 *   cachedAt: number (Date.now())
 * }
 */
export function setSession(me) {
  const payload = {
    me: me ?? null,
    cachedAt: Date.now(),
  };
  safeStorage.set(KEY, JSON.stringify(payload));
}

/**
 * 사용자가 원하는 형태의 getSession() 제공.
 * - 브라우저 localStorage 표준에 없는 함수이므로 우리가 만든다.
 */
export function getSession() {
  try {
    const raw = safeStorage.get(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * 캐시된 me를 TTL 조건으로 반환
 * ttlMs를 넘겼으면 null 처리해서 서버 재조회 유도
 */
export function getCachedMe(ttlMs = 10 * 60 * 1000) {
  const s = getSession();
  if (!s?.me) return null;
  if (!s?.cachedAt) return s.me;

  const age = Date.now() - s.cachedAt;
  if (ttlMs > 0 && age > ttlMs) return null;

  return s.me;
}

export function clearSession() {
  safeStorage.remove(KEY);
}
