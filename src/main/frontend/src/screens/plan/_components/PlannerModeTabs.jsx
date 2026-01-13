// FILE: src/main/frontend/src/screens/plan/_components/PlannerModeTabs.jsx
import React from "react";

export default function PlannerModeTabs({ value, options, onChange }) {
  const v = value ?? (options?.[0]?.key ?? "");
  return (
    <div className="modeTabs" role="tablist" aria-label="보기 방식">
      {(options || []).map((opt) => {
        const active = String(opt.key) === String(v);
        return (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={"modeTabs__item " + (active ? "is-active" : "")}
            onClick={() => onChange?.(opt.key)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
