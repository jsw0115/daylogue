// src/main/frontend/src/components/common/TextInput.jsx
import React from "react";
import "../../styles/components.css";

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
  ...rest
}) {
  return (
    <div className={`field ${className}`}>
      {label && <label className="field__label">{label}</label>}
      <input type={type}
        className="field__control"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}

export default TextInput;

