// FILE: src/main/frontend/src/components/category/CategoryIcon.jsx
import React from "react";
import { LUCIDE_ICON_MAP, RADIX_ICON_MAP } from "../../shared/constants/categoryIconOptions";

/**
 * iconKey 규칙:
 * - "lucide:Briefcase"
 * - "radix:HomeIcon"
 * - "emoji:📌"
 * - "" 또는 null -> fallback
 */
export default function CategoryIcon({
  iconKey,
  size = 18,
  className = "",
  fallback = "□",
  title,
}) {
  const key = String(iconKey || "").trim();
  if (!key) {
    return (
      <span className={className} title={title || "category-icon"}>
        {fallback}
      </span>
    );
  }

  const [pack, name] = key.split(":");
  if (pack === "emoji") {
    return (
      <span className={className} title={title || name}>
        {name || fallback}
      </span>
    );
  }

  if (pack === "lucide") {
    const Icon = LUCIDE_ICON_MAP[name];
    if (!Icon) {
      return (
        <span className={className} title={title || "unknown-lucide"}>
          {fallback}
        </span>
      );
    }
    return <Icon className={className} size={size} title={title} aria-label={title || name} />;
  }

  if (pack === "radix") {
    const Icon = RADIX_ICON_MAP[name];
    if (!Icon) {
      return (
        <span className={className} title={title || "unknown-radix"}>
          {fallback}
        </span>
      );
    }
    // Radix 아이콘은 size prop 대신 style로 처리하는 케이스가 많아서 width/height 지정
    return (
      <Icon
        className={className}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        title={title}
        aria-label={title || name}
      />
    );
  }

  // 그 외는 문자열로 렌더
  return (
    <span className={className} title={title || key}>
      {key}
    </span>
  );
}