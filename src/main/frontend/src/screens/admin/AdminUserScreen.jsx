import React from "react";

function AdminUserScreen() {
  return (
    <div className="screen admin-screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">관리자 · 사용자 관리</h1>
          <p className="screen-header__subtitle">
            운영자용 사용자 리스트/권한 관리 화면입니다.
          </p>
        </div>
      </div>

      <div className="admin-grid">
        <section className="dashboard-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>이메일</th>
                <th>닉네임</th>
                <th>권한</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>demo@example.com</td>
                <td>Demo User</td>
                <td>ADMIN</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default AdminUserScreen;
