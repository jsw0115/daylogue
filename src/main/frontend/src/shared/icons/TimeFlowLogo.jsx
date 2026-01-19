import React from "react";

/**
 * TimeFlow 로고(인라인 SVG)
 * - currentColor 사용: CSS로 색상 제어
 */
export default function TimeFlowLogo({ size = 36, className = "", title = "TimeFlow" }) {
  const s = Number(size) || 36;

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.12" />

      <path
        d="M12 36c8-14 18-20 28-18 8 2 12 10 12 18 0 12-8 18-18 18-10 0-18-8-18-18"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.9"
      />

      <circle cx="32" cy="32" r="12" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.9" />
      <path
        d="M32 32V24M32 32L39 35"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      <circle cx="50" cy="20" r="3" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
