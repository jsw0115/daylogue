// src/screens/memo/MemoInboxScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/common/Button";
import "../../styles/screens/memo.css";

const SAMPLE_MEMOS = [
  { id: 1, type: "text", title: "내일 은행 가기, 엄마 생신 선물 주문" },
  { id: 2, type: "voice", title: "운동 루틴 아이디어 메모" },
];

function MemoInboxScreen() {
  return (
    <div className="screen memo-inbox-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">메모 인박스</h2>
          <p className="screen-header__subtitle">
            떠오르는 생각을 빠르게 메모하고 나중에 정리해요.
          </p>
        </div>
        <Button className="btn--primary">+ 새 메모</Button>
      </header>

      <div className="memo-grid">
        <DashboardCard title="메모 목록" subtitle="텍스트 / 음성 메모">
          <ul className="memo-list">
            {SAMPLE_MEMOS && SAMPLE_MEMOS.map((m) => (
              <li key={m.id} className="memo-item">
                {m.type === "voice" ? "🎙" : "📝"} {m.title}
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard title="선택된 메모" subtitle="내용 미리보기">
          <p style={{ fontSize: 13, color: "var(--color-muted)" }}>
            왼쪽에서 메모를 선택하면 내용을 여기에 보여줍니다.
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}

export default MemoInboxScreen;
