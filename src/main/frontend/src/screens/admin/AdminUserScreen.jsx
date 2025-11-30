// src/screens/admin/AdminUserScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import "../../styles/screens/admin.css";

function AdminUserScreen() {
  return (
    <div className="screen admin-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">사용자 관리</h2>
          <p className="screen-header__subtitle">
            서비스에 가입한 사용자의 기본 정보를 조회/관리합니다.
          </p>
        </div>
      </header>

      <div className="admin-grid">
        <DashboardCard title="사용자 목록" subtitle="검색/필터 가능">
          <table className="admin-table">
            <thead>
              <tr>
                <th>이메일</th>
                <th>닉네임</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>user@example.com</td>
                <td>성원</td>
                <td>활성</td>
              </tr>
            </tbody>
          </table>
        </DashboardCard>

        <DashboardCard title="선택된 사용자" subtitle="상세 정보">
          <p style={{ fontSize: 13, color: "var(--color-muted)" }}>
            왼쪽 목록에서 사용자를 선택하면 여기에서 상세 정보를 확인할 수
            있습니다.
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}

export default AdminUserScreen;
