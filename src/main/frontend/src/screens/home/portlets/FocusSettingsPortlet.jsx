// src/screens/home/portlets/FocusSettingsPortlet.jsx
import React, { useState } from "react";
import safeStorage from "../../../shared/utils/safeStorage";

export default function FocusSettingsPortlet() {
  const [focusMin, setFocusMin] = useState(() => Number(safeStorage.get("tbd.focusMin", "25")));
  const [breakMin, setBreakMin] = useState(() => Number(safeStorage.get("tbd.breakMin", "5")));

  return (
    <div className="portlet">
      <label className="field">
        <span>집중(분)</span>
        <input
          type="number"
          min={1}
          value={focusMin}
          onChange={(e) => {
            const v = Number(e.target.value || 0);
            setFocusMin(v);
            safeStorage.set("tbd.focusMin", String(v));
          }}
        />
      </label>

      <label className="field">
        <span>휴식(분)</span>
        <input
          type="number"
          min={1}
          value={breakMin}
          onChange={(e) => {
            const v = Number(e.target.value || 0);
            setBreakMin(v);
            safeStorage.set("tbd.breakMin", String(v));
          }}
        />
      </label>
    </div>
  );
}
