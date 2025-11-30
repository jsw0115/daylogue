import React from "react";
import clsx from "clsx";

function Button({ variant = "primary", fullWidth, className, ...props }) {
  const base = "btn";
  const variantClass =
    variant === "primary"
      ? "btn--primary"
      : variant === "ghost"
      ? "btn--ghost"
      : "";
  const full = fullWidth ? "btn--full" : "";

  return (
    <button
      className={clsx(base, variantClass, full, className)}
      {...props}
    />
  );
}

export default Button;
