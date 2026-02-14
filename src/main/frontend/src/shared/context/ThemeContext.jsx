// FILE: src/main/frontend/src/shared/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

// 기본값
const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
});

export function ThemeProvider({ children }) {
  // 테마 상태
  const [theme, setTheme] = useState(() => localStorage.getItem("app-theme") || "light");
  // 스티커 팩 상태 추가 (basic | emoji | pixel)
  const [stickerPack, setStickerPack] = useState(() => localStorage.getItem("app-sticker") || "basic");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const changeStickerPack = (packId) => {
    setStickerPack(packId);
    localStorage.setItem("app-sticker", packId);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, stickerPack, setStickerPack: changeStickerPack }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};