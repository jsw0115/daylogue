// FILE: src/App.jsx
import React from "react";
import AppRoutes from "./routes/AppRoutes";

import { ThemeProvider } from "./shared/context/ThemeContext";
import { AppModeProvider } from "./shared/context/AppModeContext";
import { ModeProvider } from "./context/ModeContext";
import "antd/dist/reset.css";
import { ChatProvider } from "./shared/context/ChatContext";

function App() {

  return (
    <ThemeProvider>
      <ChatProvider>
        <AppModeProvider>
          <ModeProvider>
            <AppRoutes />
          </ModeProvider>
        </AppModeProvider>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
