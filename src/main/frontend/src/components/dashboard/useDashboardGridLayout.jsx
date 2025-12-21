// FILE: src/main/frontend/src/components/dashboard/useDashboardGridLayout.jsx
import { useEffect, useMemo, useState } from "react";

function safeParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function loadState(key, fallback) {
  try {
    const raw = localStorage.get(key);
    if (!raw) return fallback;
    return safeParse(raw, fallback);
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  try {
    localStorage.set(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function normalizeItem(it, cols) {
  const minW = it.minW ?? 1;
  const maxW = it.maxW ?? cols;
  const minH = it.minH ?? 1;
  const maxH = it.maxH ?? 999;

  const w = clamp(it.w ?? minW, minW, Math.min(maxW, cols));
  const h = clamp(it.h ?? minH, minH, maxH);

  let x = it.x ?? 0;
  let y = it.y ?? 0;

  if (w >= cols) x = 0;
  if (x + w > cols) x = 0;

  return { ...it, x, y, w, h, minW, maxW, minH, maxH };
}

function defaultsMap(defaultLayouts, bp) {
  const map = new Map();
  (defaultLayouts?.[bp] || []).forEach((it) => map.set(it.i, it));
  return map;
}

function mergeConstraints(layouts, defaultLayouts, colsByBp) {
  const next = {};
  const bps = Object.keys(defaultLayouts || {});
  bps.forEach((bp) => {
    const cols = colsByBp?.[bp] ?? 12;
    const base = Array.isArray(layouts?.[bp]) ? layouts[bp] : [];
    const defMap = defaultsMap(defaultLayouts, bp);

    next[bp] = base.map((it) => {
      const def = defMap.get(it.i);
      const merged = def
        ? {
            ...def,
            ...it,
            // def의 min/max를 우선 유지(강제)
            minW: def.minW ?? it.minW,
            maxW: def.maxW ?? it.maxW,
            minH: def.minH ?? it.minH,
            maxH: def.maxH ?? it.maxH,
          }
        : it;

      return normalizeItem(merged, cols);
    });
  });
  return next;
}

function removeItemFromLayouts(layouts, id) {
  const next = {};
  Object.keys(layouts || {}).forEach((bp) => {
    next[bp] = (layouts[bp] || []).filter((it) => it.i !== id);
  });
  return next;
}

function maxBottomY(layoutArr) {
  if (!layoutArr || layoutArr.length === 0) return 0;
  return Math.max(...layoutArr.map((it) => (it.y || 0) + (it.h || 0)));
}

function addItemToLayouts(layouts, defaultLayouts, colsByBp, id) {
  const next = { ...layouts };
  Object.keys(defaultLayouts).forEach((bp) => {
    const cols = colsByBp?.[bp] ?? 12;
    const arr = Array.isArray(next[bp]) ? next[bp].slice() : [];
    if (arr.some((it) => it.i === id)) {
      next[bp] = arr;
      return;
    }

    const defItem = (defaultLayouts[bp] || []).find((it) => it.i === id);
    if (!defItem) {
      next[bp] = arr;
      return;
    }

    const y = maxBottomY(arr);
    const item = normalizeItem({ ...defItem, y }, cols);
    arr.push(item);
    next[bp] = arr;
  });
  return next;
}

function ensureVisibilityKeys(visibility, defaultVisibility) {
  const next = { ...(visibility || {}) };
  Object.keys(defaultVisibility || {}).forEach((id) => {
    if (next[id] === undefined) next[id] = defaultVisibility[id];
  });
  return next;
}

function ensureAllVisibleItemsPresent(layouts, defaultLayouts, colsByBp, visibility) {
  let next = { ...(layouts || {}) };

  Object.keys(defaultLayouts || {}).forEach((bp) => {
    const cols = colsByBp?.[bp] ?? 12;
    const defMap = defaultsMap(defaultLayouts, bp);
    const arr = Array.isArray(next[bp]) ? next[bp].slice() : [];

    // 보이는 포틀릿은 반드시 존재
    defMap.forEach((def, id) => {
      if (visibility?.[id] === false) return;
      if (!arr.some((it) => it.i === id)) {
        const y = maxBottomY(arr);
        arr.push(normalizeItem({ ...def, y }, cols));
      }
    });

    // 숨김 포틀릿은 제거
    next[bp] = arr.filter((it) => visibility?.[it.i] !== false);
  });

  return next;
}

function getAllIdsFromDefaults(defaultLayouts) {
  const set = new Set();
  Object.keys(defaultLayouts || {}).forEach((bp) => {
    (defaultLayouts[bp] || []).forEach((it) => set.add(it.i));
  });
  return Array.from(set);
}

export function useDashboardGridLayout({
  storageKey,
  defaultLayouts,
  defaultVisibility,
  colsByBp,
}) {
  const fallback = useMemo(
    () => ({
      layouts: defaultLayouts,
      visibility: defaultVisibility,
    }),
    [defaultLayouts, defaultVisibility],
  );

  const [state, setState] = useState(() => loadState(storageKey, fallback));

  // 초기 마이그레이션/정규화(새 포틀릿 추가, 제약 합치기 등)
  useEffect(() => {
    setState((prev) => {
      const nextVis = ensureVisibilityKeys(prev.visibility, defaultVisibility);

      const mergedLayouts = mergeConstraints(prev.layouts || defaultLayouts, defaultLayouts, colsByBp);
      const ensured = ensureAllVisibleItemsPresent(mergedLayouts, defaultLayouts, colsByBp, nextVis);

      return { layouts: ensured, visibility: nextVis };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveState(storageKey, state);
  }, [storageKey, state]);

  const layouts = state.layouts || defaultLayouts;
  const visibility = state.visibility || defaultVisibility;

  const allIds = useMemo(() => getAllIdsFromDefaults(defaultLayouts), [defaultLayouts]);

  const visibleIds = useMemo(() => {
    return allIds.filter((id) => visibility[id] !== false);
  }, [allIds, visibility]);

  const hiddenIds = useMemo(() => {
    return allIds.filter((id) => visibility[id] === false);
  }, [allIds, visibility]);

  const setLayouts = (nextLayouts) => {
    setState((prev) => {
      // 저장 직전에 제약 재합치기(드래그/리사이즈 후에도 강제 유지)
      const merged = mergeConstraints(nextLayouts, defaultLayouts, colsByBp);
      const ensured = ensureAllVisibleItemsPresent(merged, defaultLayouts, colsByBp, prev.visibility);
      return { ...prev, layouts: ensured };
    });
  };

  const toggleVisible = (id) => {
    setState((prev) => {
      const nextVis = { ...(prev.visibility || {}) };
      const nowVisible = nextVis[id] !== false;
      nextVis[id] = nowVisible ? false : true;

      let nextLayouts = prev.layouts || {};
      if (nextVis[id] === false) {
        nextLayouts = removeItemFromLayouts(nextLayouts, id);
      } else {
        nextLayouts = addItemToLayouts(nextLayouts, defaultLayouts, colsByBp, id);
      }

      // 제약/정규화
      nextLayouts = mergeConstraints(nextLayouts, defaultLayouts, colsByBp);
      nextLayouts = ensureAllVisibleItemsPresent(nextLayouts, defaultLayouts, colsByBp, nextVis);

      return { layouts: nextLayouts, visibility: nextVis };
    });
  };

  // half/full 폭 토글: breakpoint별 cols 기준으로 w 변경
  const toggleWidthMode = (id) => {
    setState((prev) => {
      const cur = prev.layouts || {};
      const next = {};

      Object.keys(defaultLayouts || {}).forEach((bp) => {
        const cols = colsByBp?.[bp] ?? 12;
        const arr = Array.isArray(cur[bp]) ? cur[bp].slice() : [];

        const idx = arr.findIndex((it) => it.i === id);
        if (idx < 0) {
          next[bp] = arr;
          return;
        }

        const it = arr[idx];
        const halfRaw = Math.max(1, Math.floor(cols / 2));
        const isFull = (it.w ?? 0) >= cols;
        const targetWRaw = isFull ? halfRaw : cols;

        const minW = it.minW ?? 1;
        const maxW = it.maxW ?? cols;
        const targetW = clamp(targetWRaw, minW, Math.min(maxW, cols));

        let x = it.x ?? 0;
        if (targetW >= cols) x = 0;
        if (x + targetW > cols) x = 0;

        const updated = normalizeItem({ ...it, w: targetW, x }, cols);
        arr[idx] = updated;
        next[bp] = arr;
      });

      const merged = mergeConstraints(next, defaultLayouts, colsByBp);
      const ensured = ensureAllVisibleItemsPresent(merged, defaultLayouts, colsByBp, prev.visibility);

      return { ...prev, layouts: ensured };
    });
  };

  const resetAll = () => {
    setState({
      layouts: defaultLayouts,
      visibility: defaultVisibility,
    });
  };

  return {
    layouts,
    visibility,
    visibleIds,
    hiddenIds,
    setLayouts,
    toggleVisible,
    toggleWidthMode,
    resetAll,
  };
}
