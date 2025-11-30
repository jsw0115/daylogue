import React from "react";

function MemoInboxScreen() {
  return (
    <div className="screen memo-inbox-screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">메모 인박스</h1>
          <p className="screen-header__subtitle">
            떠오르는 생각을 빠르게 적어두는 메모 공간입니다.
          </p>
        </div>
      </div>
      <div className="memo-grid">
        <section className="dashboard-card">
          <h2 className="dashboard-card__title">메모 리스트</h2>
          <ul className="memo-list">
            <li className="memo-item">예시 메모 1</li>
            <li className="memo-item">예시 메모 2</li>
          </ul>
        </section>
        <section className="dashboard-card">
          <h2 className="dashboard-card__title">선택된 메모</h2>
          <p>왼쪽에서 메모를 선택하면 내용이 여기 표시됩니다.</p>
        </section>
      </div>
    </div>
  );
}

export default MemoInboxScreen;
