// FILE: src/main/frontend/src/App.jsx
import React from "react";
import AppShell from "./layout/AppShell";
import { AppRoutes } from "./routes";

// ✅ 테마 컨텍스트
import { ThemeProvider } from "./shared/context/ThemeContext";
// ✅ 앱 모드 컨텍스트 (J / P / B 모드)
import { AppModeProvider } from "./shared/context/AppModeContext";

function App() {
  return (
    <ThemeProvider>
      <AppModeProvider>
        <AppShell>
          <AppRoutes />
        </AppShell>
      </AppModeProvider>
    </ThemeProvider>
  );
}

export default App;
