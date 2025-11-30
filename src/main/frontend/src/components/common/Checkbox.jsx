import React from "react";

function Checkbox({ label, ...props }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}

export default Checkbox;
