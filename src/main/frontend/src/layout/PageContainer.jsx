// src/main/frontend/src/layout/PageContainer.jsx
import React from "react";
import "../styles/layout.css";

function PageContainer({ children }) {
  return <div className="page-container">{children}</div>;
}

export default PageContainer;

