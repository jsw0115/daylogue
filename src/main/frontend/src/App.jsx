import React from "react";
import AppShell from "./layout/AppShell";
import { AppRoutes } from "./routes";

function App() {
  return (
    <AppShell>
      <AppRoutes />
    </AppShell>
  );
}

export default App;
