import { useCallback, useEffect, useState } from "react";
import { safeStorage } from "../utils/safeStorage";

/**
 * 현재는 “관리자 화면은 누구나 보이게” 요청이어서
 * UI 표시용 isAdmin은 남겨두되, 실패해도 앱이 죽지 않게만 한다.
 *
 * 권한은 서버 API에서 최종 검증하면 됨.
 */

const KEY = "auth.role"; // 예: "ADMIN" | "USER"
const listeners = new Set();

export function notifySessionChanged() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (_) {}
  });
}

export function getIsAdminSync() {
  const role = safeStorage.get(KEY, "USER");
  return role === "ADMIN";
}

export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(getIsAdminSync());

  const refresh = useCallback(() => {
    setIsAdmin(getIsAdminSync());
  }, []);

  useEffect(() => {
    listeners.add(refresh);
    return () => listeners.delete(refresh);
  }, [refresh]);

  return { isAdmin, refresh };
}
