import { useEffect, useMemo, useState } from "react";

function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

function safeSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function useDashboardLayout(storageKey, defaultLayout) {
  const [layout, setLayout] = useState(() => safeLoad(storageKey, defaultLayout));

  // defaultLayout에 새 포틀릿이 추가되면 자동으로 합치기(기존 사용자 레이아웃 보존)
  useEffect(() => {
    setLayout((prev) => {
      const prevIds = new Set(prev.map((x) => x.id));
      const merged = [...prev];
      defaultLayout.forEach((x) => {
        if (!prevIds.has(x.id)) merged.push(x);
      });
      return merged;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    safeSave(storageKey, layout);
  }, [layout, storageKey]);

  const orderedVisibleLayout = useMemo(() => {
    return layout
      .filter((x) => x.visible)
      .slice()
      .sort((a, b) => a.order - b.order);
  }, [layout]);

  const toggleVisible = (id) => {
    setLayout((prev) =>
      prev.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x)),
    );
  };

  const moveUp = (id) => {
    setLayout((prev) => {
      const visible = prev.filter((x) => x.visible).sort((a, b) => a.order - b.order);
      const idx = visible.findIndex((x) => x.id === id);
      if (idx <= 0) return prev;

      const a = visible[idx - 1];
      const b = visible[idx];

      return prev.map((x) => {
        if (x.id === a.id) return { ...x, order: b.order };
        if (x.id === b.id) return { ...x, order: a.order };
        return x;
      });
    });
  };

  const moveDown = (id) => {
    setLayout((prev) => {
      const visible = prev.filter((x) => x.visible).sort((a, b) => a.order - b.order);
      const idx = visible.findIndex((x) => x.id === id);
      if (idx < 0 || idx >= visible.length - 1) return prev;

      const a = visible[idx];
      const b = visible[idx + 1];

      return prev.map((x) => {
        if (x.id === a.id) return { ...x, order: b.order };
        if (x.id === b.id) return { ...x, order: a.order };
        return x;
      });
    });
  };

  const resetLayout = () => {
    setLayout(defaultLayout);
  };

  return {
    layout,
    orderedVisibleLayout,
    toggleVisible,
    moveUp,
    moveDown,
    resetLayout,
  };
}
