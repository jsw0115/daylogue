import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

/* 스타일 한 번에 import */
import "./styles/index.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/screens/home.css";
/* 나중에 auth.css, planner.css 등도 필요하면 추가 */

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
