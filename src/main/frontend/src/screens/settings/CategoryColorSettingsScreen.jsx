import React from "react";

function CategoryColorSettingsScreen() {
  return (
    <div className="screen settings-screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">카테고리 색/아이콘</h1>
          <p className="screen-header__subtitle">
            공부/업무/가족/건강 등 카테고리 색과 아이콘을 설정해요.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="dashboard-card settings-section">
          <div className="settings-row">
            <div className="settings-row__label">공부</div>
            <div className="settings-row__control">
              <input className="field__control" defaultValue="#6366f1" />
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row__label">운동</div>
            <div className="settings-row__control">
              <input className="field__control" defaultValue="#22c55e" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CategoryColorSettingsScreen;
