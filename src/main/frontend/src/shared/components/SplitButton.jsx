// src/shared/components/SplitButton.jsx
import React, { useEffect, useRef, useState } from "react";

export default function SplitButton({ label, onPrimary, items = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onDocDown = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  return (
    <div className="tb-split" ref={ref}>
      <button type="button" className="btn btn--sm btn--primary" onClick={onPrimary}>
        {label}
      </button>

      <button
        type="button"
        className="btn btn--sm btn--primary tb-split__caret"
        onClick={() => setOpen((v) => !v)}
        aria-label="more"
      >
        ▼
      </button>

      {open ? (
        <div className="tb-split__menu">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              className="tb-split__item"
              onClick={() => {
                setOpen(false);
                it.onClick?.();
              }}
            >
              <div className="tb-split__item-title">{it.title}</div>
              {it.desc ? <div className="tb-split__item-desc">{it.desc}</div> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
