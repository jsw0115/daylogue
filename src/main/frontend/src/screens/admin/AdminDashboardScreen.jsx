// src/screens/admin/AdminDashboardScreen.jsx
import React from "react";
import "../../styles/screens/admin.css";
import AdminOnly from "../../components/common/AdminOnly";

export default function AdminDashboardScreen() {
  return (
    <AdminOnly fallback={<div className="screen"><div className="card">권한이 없습니다.</div></div>}>
      <div className="screen admin-screen">
        <div className="screen-header">
          <div>
            <h1 className="screen-header__title">관리자</h1>
            <p className="text-muted font-small">운영/정책/공용 데이터 관리</p>
          </div>
        </div>

        <div className="admin-grid">
          <section className="card admin-card">
            <div className="admin-card__title">사용자/권한</div>
            <div className="text-muted font-small">서버 사용자 검색 기반으로 연결 예정</div>
            <button type="button" className="btn btn--sm btn--secondary" onClick={() => alert("추후 구현")}>
              열기
            </button>
          </section>

          <section className="card admin-card">
            <div className="admin-card__title">공용 카테고리</div>
            <div className="text-muted font-small">조직 공용 태그 관리</div>
            <button type="button" className="btn btn--sm btn--secondary" onClick={() => alert("설정 화면의 공용 카테고리로 우선 관리")}>
              안내
            </button>
          </section>

          <section className="card admin-card">
            <div className="admin-card__title">공유 정책</div>
            <div className="text-muted font-small">기본 공유 범위/제한</div>
            <button type="button" className="btn btn--sm btn--secondary" onClick={() => alert("추후 구현")}>
              열기
            </button>
          </section>

          <section className="card admin-card">
            <div className="admin-card__title">로그/감사</div>
            <div className="text-muted font-small">공유/수정 이력 조회</div>
            <button type="button" className="btn btn--sm btn--secondary" onClick={() => alert("추후 구현")}>
              열기
            </button>
          </section>
        </div>
      </div>
    </AdminOnly>
  );
}
