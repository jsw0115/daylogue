// src/shared/hooks/useSafeStorageState.js
import { useEffect, useMemo, useState } from "react";
import { safeStorage } from "../utils/safeStorage";

export function useSafeStorageState(key, defaultValue) {
  const initial = useMemo(() => {
    const stored = safeStorage.getJSON(key, null);
    return stored === null ? defaultValue : stored;
  }, [key, defaultValue]);

  const [value, setValue] = useState(initial);

  useEffect(() => {
    safeStorage.setJSON(key, value);
  }, [key, value]);

  return [value, setValue];
}
