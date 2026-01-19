import React from "react";

export default function TimeFlowLogo({ size = 44 }) {
  const s = Number(size) || 44;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        {/* outer ring */}
        <rect x="6" y="6" width="52" height="52" rx="16" fill="currentColor" opacity="0.12" />
        <rect x="10" y="10" width="44" height="44" rx="14" stroke="currentColor" opacity="0.28" />

        {/* timebar */}
        <rect x="18" y="30" width="28" height="6" rx="3" fill="currentColor" opacity="0.75" />
        <rect x="18" y="40" width="18" height="6" rx="3" fill="currentColor" opacity="0.45" />
        <circle cx="44" cy="33" r="4" fill="currentColor" opacity="0.9" />

        {/* clock hand hint */}
        <path d="M32 18v10l7 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
      </svg>

      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>TimeFlow</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>Plan · Track · Reflect</div>
      </div>
    </div>
  );
}
