// src/main/frontend/src/screens/memo/MemoInboxScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/memo.css";

function MemoInboxScreen() {
  const mockMemos = [
    {
      id: 1,
      type: "text",
      preview: "내일 9시 팀 회의 준비하기...",
      status: "NEW",
    },
    {
      id: 2,
      type: "voice",
      preview: "주말에 SQLD 모의고사 풀기...",
      status: "PROCESSED",
    },
  ];

  return (
    <AppShell title="메모 인박스">
      <div className="screen memo-inbox-screen">
        <header className="screen-header">
          <h2>메모 인박스</h2>
        </header>

        <section className="memo-filters">
          <select defaultValue="">
            <option value="">전체</option>
            <option value="text">텍스트</option>
            <option value="voice">음성</option>
          </select>
          <select defaultValue="">
            <option value="">상태 전체</option>
            <option value="NEW">새 메모</option>
            <option value="PROCESSED">처리됨</option>
          </select>
        </section>

        <section className="memo-list">
          {mockMemos.map((m) => (
            <div key={m.id} className="memo-item">
              <span className="memo-item__type">{m.type}</span>
              <span className="memo-item__preview">{m.preview}</span>
              <span className="memo-item__status">{m.status}</span>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default MemoInboxScreen;

