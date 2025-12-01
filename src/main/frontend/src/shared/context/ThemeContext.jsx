// FILE: src/main/frontend/src/shared/context/ThemeContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "app-theme";

// localStorage 접근을 항상 안전하게 처리하는 헬퍼
function safeGetTheme() {
  if (typeof window === "undefined") return "light";

  try {
    // 여기서도 window.localStorage 접근 자체를 try 안에서 처리
    const ls = window.localStorage;
    if (!ls) return "light";

    const saved = ls.getItem(STORAGE_KEY);
    return saved || "light";
  } catch (e) {
    // SecurityError 등 모든 에러 무시하고 기본값 사용
    return "light";
  }
}

function safeSetTheme(theme) {
  if (typeof window === "undefined") return;

  try {
    const ls = window.localStorage;
    if (!ls) return;
    ls.setItem(STORAGE_KEY, theme);
  } catch (e) {
    // 저장 실패해도 앱 동작에는 영향 없도록 그냥 무시
  }
}

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
});

/**
 * ThemeProvider
 * - theme 상태를 관리하고
 * - documentElement 에 data-theme 를 세팅해서 CSS 테마가 동작하도록 함
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => safeGetTheme());

  // theme 변경 시 DOM, localStorage 반영
  useEffect(() => {
    // data-theme 속성 세팅 (CSS에서 :root[data-theme="..."] 로 사용)
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }

    safeSetTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
