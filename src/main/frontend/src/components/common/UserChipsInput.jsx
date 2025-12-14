// FILE: src/components/common/UserChipsInput.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/components/chips-input.css";

export default function UserChipsInput({
  value = [],
  onChange,
  placeholder = "사용자 입력 후 Enter",
  suggestions = [],
  onAddNewSuggestion,
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const normalized = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return [];
    return suggestions
      .filter((s) => String(s).toLowerCase().includes(qq))
      .filter((s) => !normalized.includes(s))
      .slice(0, 8);
  }, [q, suggestions, normalized]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const add = (raw) => {
    const v = String(raw || "").trim();
    if (!v) return;
    if (normalized.includes(v)) {
      setQ("");
      return;
    }
    const next = [...normalized, v];
    onChange?.(next);
    onAddNewSuggestion?.(v);
    setQ("");
    setActiveIdx(0);
    setOpen(false);
    inputRef.current?.focus();
  };

  const remove = (v) => {
    const next = normalized.filter((x) => x !== v);
    onChange?.(next);
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "Backspace" && !q && normalized.length) {
      e.preventDefault();
      remove(normalized[normalized.length - 1]);
      return;
    }
    if (e.key === "ArrowDown" && filtered.length) {
      e.preventDefault();
      setOpen(true);
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp" && filtered.length) {
      e.preventDefault();
      setOpen(true);
      setActiveIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (open && filtered.length) {
        add(filtered[activeIdx]);
      } else {
        add(q);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="chips" ref={wrapRef} onClick={() => inputRef.current?.focus()}>
      <div className="chips__list">
        {normalized.map((u) => (
          <span className="chips__chip" key={u}>
            <span className="chips__chipText">{u}</span>
            <button className="chips__chipX" type="button" onClick={() => remove(u)} aria-label="삭제">
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          className="chips__input"
          value={q}
          placeholder={normalized.length ? "" : placeholder}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActiveIdx(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </div>

      {open && filtered.length ? (
        <div className="chips__dropdown">
          {filtered.map((s, idx) => (
            <button
              type="button"
              key={s}
              className={"chips__item " + (idx === activeIdx ? "is-active" : "")}
              onClick={() => add(s)}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
