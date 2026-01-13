// FILE: src/main/frontend/src/screens/plan/_components/DailyTodoList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { safeStorage } from "../../../shared/utils/safeStorage";

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function readList(key) {
  try {
    const raw = safeStorage.getItem(key, "[]");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key, list) {
  safeStorage.setItem(key, JSON.stringify(list ?? []));
}

export default function DailyTodoList({ dateKey }) {
  const storageKey = useMemo(() => `planner.todo.${dateKey}`, [dateKey]);

  const [items, setItems] = useState(() => readList(storageKey));
  const [text, setText] = useState("");

  useEffect(() => {
    setItems(readList(storageKey));
    setText("");
  }, [storageKey]);

  const persist = (next) => {
    setItems(next);
    writeList(storageKey, next);
  };

  const add = () => {
    const t = String(text ?? "").trim();
    if (!t) return;
    const next = [
      ...items,
      { id: makeId(), text: t, done: false, createdAt: Date.now() },
    ];
    persist(next);
    setText("");
  };

  const toggle = (id) => {
    const next = items.map((it) => (it.id === id ? { ...it, done: !it.done } : it));
    persist(next);
  };

  const remove = (id) => {
    const next = items.filter((it) => it.id !== id);
    persist(next);
  };

  return (
    <div className="todoPaper">
      <div className="todoPaper__inputRow">
        <input
          className="todoPaper__input"
          value={text}
          placeholder="할 일을 입력하고 Enter"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
        />
        <button type="button" className="btn btn--sm btn--secondary" onClick={add}>
          추가
        </button>
      </div>

      <div className="todoPaper__list">
        {items.length ? (
          items.map((it) => (
            <div key={it.id} className={"todoPaper__row " + (it.done ? "is-done" : "")}>
              <label className="todoPaper__left">
                <input type="checkbox" checked={!!it.done} onChange={() => toggle(it.id)} />
                <span className="todoPaper__text">{it.text}</span>
              </label>
              <button type="button" className="btn btn--xs btn--ghost" onClick={() => remove(it.id)}>
                삭제
              </button>
            </div>
          ))
        ) : (
          <div className="text-muted font-small">할 일이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
