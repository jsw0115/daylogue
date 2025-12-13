import React from "react";

export default function FocusSessionScreen() {
  return (
    <div className="screen focus-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">포커스</h1>
          <p className="text-muted font-small">포모도로/집중 세션을 관리합니다.</p>
        </div>
      </div>

      <div className="card">
        <div className="text-muted font-small">
          대시보드 포틀릿의 포모도로는 이미 동작합니다.  
          여기서는 세션 히스토리/통계(/api/stats/focus-report) 붙이면 완성됩니다.
        </div>
      </div>
    </div>
  );
}
