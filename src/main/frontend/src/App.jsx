// FILE: src/App.jsx
import React from "react";
import AppRoutes from "./routes/AppRoutes"; // ✅ 이렇게 명시

import { ThemeProvider } from "./shared/context/ThemeContext";
import { AppModeProvider } from "./shared/context/AppModeContext";
import { ModeProvider } from "./context/ModeContext";

function App() {
  return (
    <ThemeProvider>
      <AppModeProvider>
        <ModeProvider>
          <AppRoutes />
        </ModeProvider>
      </AppModeProvider>
    </ThemeProvider>
  );
}

export default App;
