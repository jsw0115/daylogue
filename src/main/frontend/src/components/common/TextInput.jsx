import React from "react";

function TextInput({ label, fullWidth, ...props }) {
  return (
    <div className="field" style={fullWidth ? { width: "100%" } : {}}>
      {label && <label className="field__label">{label}</label>}
      <input className="field__control" {...props} />
    </div>
  );
}

export default TextInput;
