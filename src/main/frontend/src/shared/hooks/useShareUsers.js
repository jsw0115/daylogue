// src/shared/hooks/useShareUsers.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { safeStorage } from "../utils/safeStorage";

const KEY = "share.users";

function loadUsers() {
  const list = safeStorage.getJSON(KEY, []);
  return Array.isArray(list) ? list : [];
}
function saveUsers(list) {
  safeStorage.setJSON(KEY, list);
}

export function useShareUsers() {
  const [users, setUsers] = useState(loadUsers);

  const refresh = useCallback(() => setUsers(loadUsers()), []);

  useEffect(() => {
    const onStorage = () => refresh();
    if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const addUser = useCallback((user) => {
    const next = [...loadUsers(), user];
    setUsers(next);
    saveUsers(next);
  }, []);

  const removeUser = useCallback((id) => {
    const next = loadUsers().filter((u) => u.id !== id);
    setUsers(next);
    saveUsers(next);
  }, []);

  const byId = useMemo(() => {
    const m = new Map();
    users.forEach((u) => m.set(u.id, u));
    return m;
  }, [users]);

  return { users, byId, refresh, addUser, removeUser };
}
