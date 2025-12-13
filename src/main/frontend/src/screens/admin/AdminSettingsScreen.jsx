import React, { useState } from "react";
import "./../../styles/screens/admin.css";

const TABS = [
  { key: "users", label: "사용자/권한" },
  { key: "sharedCategories", label: "공용 카테고리" },
  { key: "policy", label: "공유/권한 정책" },
  { key: "banner", label: "공지/배너" },
  { key: "logs", label: "로그/에러" },
];

export default function AdminSettingsScreen() {
  const [tab, setTab] = useState("users");

  return (
    <div className="admin-screen">
      <div className="screen-head">
        <div>
          <div className="screen-title">관리자 설정</div>
          <div className="screen-subtitle">
            (권한 체크 OFF) 라우팅/화면 확인용 — 운영에서는 서버 권한으로 보호하세요.
          </div>
        </div>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidenav">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`admin-tab ${tab === t.key ? "is-active" : ""}`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </aside>

        <section className="admin-panel">
          {tab === "users" && (
            <div className="panel-card">
              <div className="panel-title">사용자 목록(목업)</div>
              <div className="muted">실구현: /api/admin/users, /api/admin/roles</div>
              <table className="admin-table">
                <thead>
                  <tr><th>ID</th><th>이름</th><th>이메일</th><th>역할</th><th>상태</th></tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>홍길동</td><td>user@example.com</td><td>ADMIN</td><td>ACTIVE</td></tr>
                  <tr><td>2</td><td>김철수</td><td>user2@example.com</td><td>USER</td><td>ACTIVE</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {tab === "sharedCategories" && (
            <div className="panel-card">
              <div className="panel-title">공용 카테고리</div>
              <div className="muted">실구현: /api/admin/categories/shared</div>
              <div className="empty">공용 카테고리 없음</div>
            </div>
          )}

          {tab === "policy" && (
            <div className="panel-card">
              <div className="panel-title">공유/권한 정책</div>
              <div className="muted">실구현: /api/admin/policies/sharing</div>
              <div className="empty">정책 UI는 다음 단계에서 폼으로 확장</div>
            </div>
          )}

          {tab === "banner" && (
            <div className="panel-card">
              <div className="panel-title">공지/배너</div>
              <div className="muted">실구현: /api/admin/banners</div>
              <div className="empty">등록된 배너 없음</div>
            </div>
          )}

          {tab === "logs" && (
            <div className="panel-card">
              <div className="panel-title">로그/에러(목업)</div>
              <div className="muted">실구현: /api/admin/logs + 레벨/기간/traceId 필터</div>
              <div className="empty">로그 조회 UI는 다음 단계에서 테이블+필터로 확장</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
