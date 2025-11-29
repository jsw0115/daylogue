// src/main/frontend/src/components/common/DatePicker.jsx
import React from "react";
import "../../styles/components.css";

function DatePicker({ label, value, onChange, className = "", ...rest }) {
  return (
    <div className={`field ${className}`}>
      {label && <label className="field__label">{label}</label>}
      <input type="date"
        className="field__control field__control--date"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...rest}
      />
    </div>
  );
}

export default DatePicker;

