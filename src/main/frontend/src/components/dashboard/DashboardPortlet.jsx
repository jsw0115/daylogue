import React from "react";

export default function DashboardPortlet({
  title,
  children,
  isEditMode,
  isVisible,
  onToggleVisible,
  onToggleWidth,
  widthModeLabel,
}) {
  return (
    <section className="card dashboard-portlet">
      <div className="dashboard-portlet__header">
        <div className="dashboard-portlet__left">
          <div
            className={"dashboard-portlet__draghandle" + (isEditMode ? " is-edit" : "")}
            title={isEditMode ? "드래그해서 이동" : undefined}
            aria-hidden="true"
          >
            ⋮⋮
          </div>
          <div className="dashboard-portlet__title">{title}</div>
        </div>

        {isEditMode && (
          <div className="dashboard-portlet__actions">
            <button
              type="button"
              className="btn btn--xs btn--ghost"
              onClick={onToggleWidth}
              title="폭 변경(half/full)"
            >
              폭: {widthModeLabel}
            </button>

            <button
              type="button"
              className={"btn btn--xs " + (isVisible ? "btn--secondary" : "btn--primary")}
              onClick={onToggleVisible}
              title={isVisible ? "숨기기" : "보이기"}
            >
              {isVisible ? "숨김" : "표시"}
            </button>
          </div>
        )}
      </div>

      <div className="dashboard-portlet__body">{children}</div>
    </section>
  );
}
