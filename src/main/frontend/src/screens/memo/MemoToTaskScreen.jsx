// src/screens/memo/MemoToTaskScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/common/Button";
import "../../styles/screens/memo.css";

const SAMPLE_CANDIDATES = [
  { id: 1, title: "SQLD 인강 2강 듣기", categoryName: "공부" },
  { id: 2, title: "은행 가서 통장 정리", categoryName: "생활" },
];

function MemoToTaskScreen() {
  return (
    <div className="screen memo-to-task-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">메모 → 할 일 변환</h2>
          <p className="screen-header__subtitle">
            메모 내용을 분석해서 할 일 후보를 추천해요.
          </p>
        </div>
      </header>

      <DashboardCard
        title="할 일 후보"
        subtitle="선택한 항목을 Task로 생성합니다."
      >
        <ul className="memo-to-task-list">
          {SAMPLE_CANDIDATES && SAMPLE_CANDIDATES.map((c) => (
            <li key={c.id} className="memo-to-task-item">
              <div>
                <div style={{ fontSize: 13 }}>{c.title}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--color-muted)",
                  }}
                >
                  카테고리 추천: {c.categoryName}
                </div>
              </div>
              <Button className="btn--secondary">추가</Button>
            </li>
          ))}
        </ul>
      </DashboardCard>
    </div>
  );
}

export default MemoToTaskScreen;
