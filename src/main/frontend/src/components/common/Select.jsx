// src/main/frontend/src/components/common/Select.jsx
import React from "react";
import "../../styles/components.css";

function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = "선택하세요",
  className = "",
  ...rest
}) {
  return (
    <div className={`field ${className}`}>
      {label && <label className="field__label">{label}</label>}
      <select className="field__control"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options && options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;

