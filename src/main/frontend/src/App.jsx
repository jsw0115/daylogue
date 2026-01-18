// FILE: src/App.jsx
import React from "react";
import AppRoutes from "./routes/AppRoutes";

import { ThemeProvider } from "./shared/context/ThemeContext";
import { AppModeProvider } from "./shared/context/AppModeContext";
import { ModeProvider } from "./context/ModeContext";
import "antd/dist/reset.css";

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
