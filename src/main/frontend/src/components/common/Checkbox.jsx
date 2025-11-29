// src/main/frontend/src/components/common/Checkbox.jsx
import React from "react";
import "../../styles/components.css";

function Checkbox({ label, checked, onChange, className = "", ...rest }) {
  return (
    <label className={`checkbox ${className}`}>
      <input type="checkbox"
        checked={checked}
        onChange={(e) => onChange && onChange(e.target.checked)}
        {...rest}
      />
      <span className="checkbox__box" />
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  );
}

export default Checkbox;

