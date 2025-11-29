// src/main/frontend/src/components/common/Button.jsx
import React from "react";
import "../../styles/components.css";

function Button({
  children,
  type = "button",
  variant = "primary", // 'primary' | 'secondary' | 'ghost'
  size = "md", // 'sm' | 'md' | 'lg'
  fullWidth = false,
  className = "",
  ...rest
}) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
