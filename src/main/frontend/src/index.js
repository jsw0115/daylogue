// src/main/frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// ❌ 기존: import "./index.css";
// ✅ 새로 만든 CSS 구조 사용
import "./styles/index.css";
import "./styles/layout.css";
import "./styles/components.css";

/* 테마 */
import "./styles/theme/light.css";
import "./styles/theme/dark.css";
import "./styles/theme/pastel.css";

/* 화면별 스타일 */
import "./styles/screens/home.css";
import "./styles/screens/planner.css";
import "./styles/screens/task.css";
import "./styles/screens/stat.css";
import "./styles/screens/diary.css";
import "./styles/screens/memo.css";
import "./styles/screens/routine.css";
import "./styles/screens/focus.css";
import "./styles/screens/share.css";
import "./styles/screens/settings.css";
import "./styles/screens/admin.css";
import "./styles/screens/dev.css";

import "./styles/screens/homeDashboard.css";
import "./styles/screens/taskList.css"; // TaskList 개선 버전 쓰면

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
