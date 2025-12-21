// FILE: src/components/dashboard/DashboardCard.jsx
import React from "react";

function DashboardCard({ title, subtitle, right, children, className }) {
  return (
    <section className={`dashboard-card ${className || ""}`}>
      <div className="dashboard-card__header">
        <div className="dashboard-card__title-row">
          {title && (
            <h2 className="dashboard-card__title">{title}</h2>
          )}
          {subtitle && (
            <span className="dashboard-card__subtitle">{subtitle}</span>
          )}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export default DashboardCard;
