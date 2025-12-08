// src/main/frontend/src/App.jsx

import React from "react";
import AppShell from "./layout/AppShell";

// 테마 컨텍스트
import { ThemeProvider } from "./shared/context/ThemeContext";
// 기존 앱 모드 컨텍스트 (J / P / B 메타 레벨 모드)
import { AppModeProvider } from "./shared/context/AppModeContext";
// 헤더에서 사용하는 J/P/B 모드 컨텍스트 (MODE-001-F01)
import { ModeProvider } from "./context/ModeContext";

function App() {
  return (
    <ThemeProvider>
      <AppModeProvider>
        <ModeProvider>
          <AppShell />
        </ModeProvider>
      </AppModeProvider>
    </ThemeProvider>
  );
}

export default App;
