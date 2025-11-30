// src/main/frontend/src/screens/dev/LayoutPreviewScreen.jsx
import React from "react";
import HomeDashboardScreen from "../home/HomeDashboardScreen";

function LayoutPreviewScreen() {
  return (
    <div className="screen layout-preview-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">레이아웃 프리뷰</h2>
          <p className="screen-header__subtitle">
            하나의 화면(Home)을 모바일 / 태블릿 / 데스크탑 프레임으로 동시에 확인합니다.
          </p>
        </div>
      </header>

      <div className="layout-preview-grid">
        <div className="layout-preview-device layout-preview-device--mobile">
          <div className="layout-preview-device__label">모바일 (약 390px)</div>
          <div className="layout-preview-device__frame">
            <HomeDashboardScreen />
          </div>
        </div>

        <div className="layout-preview-device layout-preview-device--tablet">
          <div className="layout-preview-device__label">태블릿 (약 768px)</div>
          <div className="layout-preview-device__frame">
            <HomeDashboardScreen />
          </div>
        </div>

        <div className="layout-preview-device layout-preview-device--desktop">
          <div className="layout-preview-device__label">데스크탑 (약 1440px)</div>
          <div className="layout-preview-device__frame">
            <HomeDashboardScreen />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayoutPreviewScreen;
