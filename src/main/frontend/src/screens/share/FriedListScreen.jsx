// src/screens/share/FriendListScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/common/Button";
import "../../styles/screens/share.css";

const SAMPLE_FRIENDS = [
  { id: 1, name: "지은", status: "수락" },
  { id: 2, name: "민수", status: "요청중" },
];

function FriendListScreen() {
  return (
    <div className="screen share-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">친구/지인</h2>
          <p className="screen-header__subtitle">
            함께 일정을 공유할 친구를 관리해요.
          </p>
        </div>
        <Button className="btn--primary">친구 초대</Button>
      </header>

      <div className="share-grid">
        <DashboardCard title="친구 목록" subtitle="요청/수락 상태 포함">
          <ul className="friend-list">
            {SAMPLE_FRIENDS && SAMPLE_FRIENDS.map((f) => (
              <li key={f.id} className="friend-item">
                <span>{f.name}</span>
                <span
                  style={{ fontSize: 12, color: "var(--color-muted)" }}
                >
                  {f.status}
                </span>
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard title="선택된 친구" subtitle="공유 옵션 설정">
          <p style={{ fontSize: 13, color: "var(--color-muted)" }}>
            친구를 선택하면 공유 캘린더 및 가시성 설정을 여기에 표시합니다.
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}

export default FriendListScreen;
