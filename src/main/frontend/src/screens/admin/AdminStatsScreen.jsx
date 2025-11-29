// src/main/frontend/src/screens/admin/AdminNoticeScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/admin.css";

function AdminNoticeScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const mockNotices = [
    { id: 1, title: "3월 업데이트 안내", type: "공지", active: true },
    { id: 2, title: "점검 예정 안내", type: "팝업", active: false },
  ];

  return (
    <AppShell title="관리자 - 공지/팝업 관리">
      <div className="screen admin-notice-screen">
        <header className="screen-header">
          <h2>공지 / 팝업 관리</h2>
        </header>

        <section className="admin-notice-form">
          <h3>새 공지 등록</h3>
          <div className="field-row">
            <input className="field__control"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select>
              <option value="NOTICE">공지</option>
              <option value="POPUP">팝업</option>
              <option value="BANNER">배너</option>
            </select>
          </div>
          <textarea className="field__control"
            rows={4}
            placeholder="내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="admin-notice-actions">
            <button className="primary-button">등록</button>
          </div>
        </section>

        <section className="admin-table-wrapper">
          <h3>등록된 공지 목록</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>유형</th>
                <th>제목</th>
                <th>상태</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {mockNotices.map((n) => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td>{n.type}</td>
                  <td>{n.title}</td>
                  <td>{n.active ? "사용" : "중지"}</td>
                  <td>
                    <button className="ghost-button">편집</button>
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

export default AdminNoticeScreen;

