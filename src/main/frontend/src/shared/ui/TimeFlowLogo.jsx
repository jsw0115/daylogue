// FILE: src/shared/ui/TimeFlowLogo.jsx
import React from "react";

export default function TimeFlowLogo({ size = 44, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="tfG" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(124,58,237,1)" />
          <stop offset="1" stopColor="rgba(99,102,241,1)" />
        </linearGradient>
        <radialGradient id="tfBg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 20) rotate(90) scale(38 38)">
          <stop stopColor="rgba(124,58,237,0.22)" />
          <stop offset="1" stopColor="rgba(124,58,237,0)" />
        </radialGradient>
      </defs>

      <circle cx="32" cy="32" r="28" fill="url(#tfBg)" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="url(#tfG)" strokeWidth="3" />

      {/* timebar + flow */}
      <path
        d="M20 33c5-10 10 10 15 0s10 10 9 0"
        fill="none"
        stroke="url(#tfG)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M32 18v10"
        fill="none"
        stroke="url(#tfG)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="32" cy="18" r="3" fill="url(#tfG)" />
    </svg>
  );
}
