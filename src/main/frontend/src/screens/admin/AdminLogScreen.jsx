// src/main/frontend/src/screens/admin/AdminUserScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/admin.css";

function AdminUserScreen() {
  const mockUsers = [
    { id: 1, email: "user1@example.com", nickname: "푸딩곰", status: "ACTIVE" },
    { id: 2, email: "user2@example.com", nickname: "공부햄", status: "INACTIVE" },
  ];

  return (
    <AppShell title="관리자 - 사용자 관리">
      <div className="screen admin-users-screen">
        <header className="screen-header">
          <div className="screen-header__left">
            <h2>사용자 관리</h2>
          </div>
          <div className="screen-header__right">
            <input className="admin-search-input"
              placeholder="이메일 / 닉네임 검색"
            />
          </div>
        </header>

        <section className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>이메일</th>
                <th>닉네임</th>
                <th>상태</th>
                <th>가입일</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers && mockUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.nickname}</td>
                  <td>{u.status}</td>
                  <td>2025-03-01</td>
                  <td>
                    <button className="ghost-button">상세</button>
                    <button className="ghost-button">비활성화</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppShell>
  );
}

export default AdminUserScreen;

