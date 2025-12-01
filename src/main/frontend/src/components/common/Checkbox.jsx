// FILE: src/main/frontend/src/shared/components/Checkbox.jsx
import React, { useState } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * 공통 체크박스
 *
 * - controlled: checked + onChange(nextChecked)
 * - uncontrolled: defaultChecked
 * - label / description 지원
 */
export function Checkbox({
  id,
  name,
  value,
  label,
  description,
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  className,
  ...rest
}) {
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked
  );

  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e) => {
    const next = e.target.checked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    if (onChange) {
      onChange(next, e);
    }
  };

  const rootClass = cx(
    "checkbox",
    isChecked && "checkbox--checked",
    disabled && "checkbox--disabled",
    className
  );

  return (
    <label className={rootClass}>
      <span className="checkbox__control">
        <input
          id={id}
          name={name}
          value={value}
          type="checkbox"
          className="checkbox__input"
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          aria-checked={isChecked}
          aria-disabled={disabled}
          {...rest}
        />
        <span
          className={cx(
            "checkbox__box",
            isChecked && "checkbox__box--checked"
          )}
        >
          {isChecked && <span className="checkbox__icon" />}
        </span>
      </span>

      {(label || description) && (
        <span className="checkbox__text">
          {label && (
            <span className="checkbox__label">{label}</span>
          )}
          {description && (
            <span className="checkbox__description">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
}

export default Checkbox;
