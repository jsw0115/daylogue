import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// 전역 스타일
import "./styles/index.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/screens/planner.css";
import "./styles/screens/home.css";
import "./styles/screens/task.css";
import "./styles/screens/routine.css";
import "./styles/screens/diary.css";
import "./styles/screens/memo.css";
import "./styles/screens/stat.css";
import "./styles/screens/settings.css";
import "./styles/screens/admin.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
