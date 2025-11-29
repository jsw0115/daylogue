// src/main/frontend/src/screens/memo/MemoEditScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/memo.css";

function MemoEditScreen() {
  const [text, setText] = useState("");

  return (
    <AppShell title="메모 작성">
      <div className="screen memo-edit-screen">
        <header className="screen-header">
          <h2>메모 작성</h2>
        </header>

        <section className="memo-edit-main">
          <textarea className="memo-edit-textarea"
            placeholder="생각나는 할 일/아이디어를 자유롭게 적어보세요."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </section>

        <section className="memo-edit-actions">
          <button className="primary-button">저장</button>
          <button className="ghost-button">취소</button>
        </section>

        <section className="memo-edit-voice">
          <h3>음성 메모</h3>
          <button className="primary-button">녹음 시작</button>
        </section>
      </div>
    </AppShell>
  );
}

export default MemoEditScreen;

