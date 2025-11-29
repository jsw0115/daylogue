// src/main/frontend/src/screens/share/FriedListScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/share.css";

function FriedListScreen() {
  const friends = [
    { id: 1, name: "친구1", status: "ACCEPTED" },
    { id: 2, name: "친구2", status: "PENDING" },
  ];

  return (
    <AppShell title="친구 / 지인">
      <div className="screen share-friend-list-screen">
        <header className="screen-header">
          <h2>친구 / 지인 목록</h2>
        </header>

        <section className="share-friend-search">
          <input className="field__control"
            placeholder="이메일 또는 닉네임으로 친구 검색"
          />
          <button className="primary-button">초대</button>
        </section>

        <section className="share-friend-list">
          {friends.map((f) => (
            <div key={f.id} className="friend-item">
              <span className="friend-item__name">{f.name}</span>
              <span className="friend-item__status">{f.status}</span>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default FriedListScreen;

