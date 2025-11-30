// src/main/frontend/src/screens/plan/PlannerTemplateScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/planner.css";

function PlannerTemplateScreen() {
  const templates = [
    { id: 1, name: "시험기간 주간 템플릿", scope: "week" },
    { id: 2, name: "업무 집중 주간 템플릿", scope: "week" },
    { id: 3, name: "월간 회고 템플릿", scope: "month" },
  ];

  return (
    <AppShell title="플래너 템플릿">
      <div className="screen planner-template-screen">
        <header className="screen-header">
          <h2>플래너 템플릿 관리</h2>
        </header>

        <section className="planner-template-list">
          {templates && templates.map((t) => (
            <div key={t.id} className="template-item">
              <div className="template-item__main">
                <strong>{t.name}</strong>
                <span className="template-item__scope">
                  {t.scope === "week" ? "주간" : "월간"}
                </span>
              </div>
              <div className="template-item__actions">
                <button className="ghost-button">적용</button>
                <button className="ghost-button">편집</button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default PlannerTemplateScreen;

