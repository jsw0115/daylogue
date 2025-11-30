import React from "react";

function LayoutPreviewScreen() {
  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">레이아웃 프리뷰</h1>
          <p className="screen-header__subtitle">
            모바일/태블릿/데스크톱 레이아웃을 디자인할 때 쓰는 개발용 화면입니다.
          </p>
        </div>
      </div>
      <div className="dashboard-card">
        <p>여기에 Figma에서 만든 레이아웃 샘플들을 넣어가면 돼요.</p>
      </div>
    </div>
  );
}

export default LayoutPreviewScreen;
