// src/main/frontend/src/components/dashboard/DashboardCard.jsx
import React from "react";
import "../../styles/components.css";

function DashboardCard({ title, subtitle, children }) {
  return (
    <section className="dashboard-card">
      <header className="dashboard-card__header">
        <h3>{title}</h3>
        {subtitle && (
          <span className="dashboard-card__subtitle">{subtitle}</span>
        )}
      </header>
      <div className="dashboard-card__body">{children}</div>
    </section>
  );
}

export default DashboardCard;

