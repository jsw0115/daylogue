// FILE: src/main/frontend/src/shared/context/AppModeContext.jsx
import React, { createContext, useContext, useState } from "react";

export const APP_MODES = {
  J: "J",
  P: "P",
  B: "B",
};

const AppModeContext = createContext(null);

export const AppModeProvider = ({ children }) => {
  const [mode, setMode] = useState(APP_MODES.B);
  const value = { mode, setMode };
  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  );
};

export const useAppMode = () => {
  const ctx = useContext(AppModeContext);
  if (!ctx) {
    throw new Error("useAppMode must be used within AppModeProvider");
  }
  return ctx;
};
