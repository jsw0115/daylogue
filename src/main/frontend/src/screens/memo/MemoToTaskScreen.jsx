// FILE: src/screens/memo/MemoToTaskScreen.jsx
import React from "react";

function MemoToTaskScreen() {
  return (
    <div className="screen memo-inbox-screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">메모 → TO-DO 변환</h1>
          <p className="screen-header__subtitle">
            메모에서 할 일 후보를 뽑아서 Task로 전환해요.
          </p>
        </div>
      </div>
      <div className="dashboard-card">
        <p>AI/규칙 기반으로 문장을 쪼개는 로직은 이후에 붙이면 돼요.</p>
      </div>
    </div>
  );
}

export default MemoToTaskScreen;
