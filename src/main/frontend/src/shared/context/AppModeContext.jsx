// src/main/frontend/src/shared/context/AppModeContext.jsx
import React, { createContext, useContext, useState } from "react";

export const APP_MODES = {
  J: "J",       // 계획형
  P: "P",       // 플로우형
  B: "B",       // 밸런스형
};

const AppModeContext = createContext(null);

export const AppModeProvider = ({ children }) => {
  // 👉 MVP에서는 일단 B 모드(Plan + Actual 같이 보는 모드)를 기본값으로
  const [mode, setMode] = useState(APP_MODES.B);

  const value = {
    mode,
    setMode,
  };

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
