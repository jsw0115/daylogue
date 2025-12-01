// FILE: src/main/frontend/src/shared/components/Button.jsx
import React from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * 공통 버튼
 *
 * - variant: "primary" | "ghost" | "default"
 * - size   : "sm" | "md" | "lg"
 * - fullWidth: boolean
 * - icon / iconPosition: 아이콘 + 텍스트 버튼
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "left",
  type = "button",
  className,
  disabled = false,
  ...rest
}) {
  const variantClass =
    variant === "primary"
      ? "btn--primary"
      : variant === "ghost"
      ? "btn--ghost"
      : "";

  const sizeClass =
    size === "sm" ? "btn--sm" : size === "lg" ? "btn--lg" : "";

  const widthClass = fullWidth ? "btn--full" : "";

  const iconOnlyClass =
    icon && !children ? "btn--icon-only" : "";

  const classes = cx(
    "btn",
    variantClass,
    sizeClass,
    widthClass,
    iconOnlyClass,
    className
  );

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="btn__icon btn__icon--left">{icon}</span>
      )}
      {children && <span className="btn__label">{children}</span>}
      {icon && iconPosition === "right" && (
        <span className="btn__icon btn__icon--right">{icon}</span>
      )}
    </>
  );

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  );
}

export default Button;
