// src/screens/memo/MemoEditScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/common/Button";
import "../../styles/screens/memo.css";

function MemoEditScreen() {
  return (
    <div className="screen memo-edit-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">메모 작성</h2>
          <p className="screen-header__subtitle">
            지금 떠오른 생각을 간단하게 남겨두세요.
          </p>
        </div>
      </header>

      <DashboardCard title="텍스트 메모" subtitle="간단한 TODO도 괜찮아요.">
        <textarea
          className="home-oneline"
          placeholder="예) SQLD 모의고사 일정 확인, 운동 루틴 정리"
          style={{ minHeight: 120 }}
        />
        <div style={{ marginTop: 10, textAlign: "right" }}>
          <Button className="btn--primary">저장</Button>
        </div>
      </DashboardCard>
    </div>
  );
}

export default MemoEditScreen;
