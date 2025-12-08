// FILE: src/main/frontend/src/screens/admin/AdminUserScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

const MOCK_USERS = [
  {
    id: 1,
    email: "demo@example.com",
    name: "Demo User",
    role: "ADMIN",
    status: "ACTIVE",
    mode: "B",
    createdAt: "2025-01-01",
  },
  {
    id: 2,
    email: "user1@example.com",
    name: "플래너 유저",
    role: "USER",
    status: "ACTIVE",
    mode: "J",
    createdAt: "2025-02-10",
  },
];

function AdminUserScreen() {
  return (
    <PageContainer
      screenId="ADM-001"
      title="관리자 · 사용자 관리"
      subtitle="운영자가 사용자 계정을 검색/조회하고 상태를 관리합니다."
    >
      <div className="screen admin-screen">
        <div className="admin-grid">
          {/* 좌측: 검색 + 목록 */}
          <section className="admin-panel">
            <header className="admin-panel__header">
              <h3 className="admin-panel__title">사용자 목록</h3>
              <p className="admin-panel__subtitle">
                이메일·닉네임·권한·상태 기준으로 검색할 수 있습니다.
              </p>
            </header>

            <form className="admin-filter-row">
              <div className="admin-filter-row__item admin-filter-row__item--grow">
                <TextInput
                  label="검색어"
                  placeholder="이메일 또는 닉네임으로 검색"
                />
              </div>
              <div className="admin-filter-row__item">
                <Select
                  label="권한"
                  options={[
                    { value: "", label: "전체" },
                    { value: "ADMIN", label: "관리자" },
                    { value: "USER", label: "일반 사용자" },
                  ]}
                />
              </div>
              <div className="admin-filter-row__item">
                <Select
                  label="상태"
                  options={[
                    { value: "", label: "전체" },
                    { value: "ACTIVE", label: "활성" },
                    { value: "INACTIVE", label: "비활성" },
                  ]}
                />
              </div>
              <div className="admin-filter-row__item admin-filter-row__item--button">
                <Button type="button" variant="primary" fullWidth>
                  검색
                </Button>
              </div>
            </form>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>이메일</th>
                    <th>닉네임</th>
                    <th>권한</th>
                    <th>상태</th>
                    <th>모드</th>
                    <th>가입일</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.name}</td>
                      <td>{u.role}</td>
                      <td>{u.status === "ACTIVE" ? "활성" : "비활성"}</td>
                      <td>{u.mode}</td>
                      <td>{u.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 우측: 선택된 사용자 요약 (지금은 데모) */}
          <section className="admin-panel admin-panel--secondary">
            <header className="admin-panel__header">
              <h3 className="admin-panel__title">선택된 사용자 상세</h3>
              <p className="admin-panel__subtitle">
                목록에서 사용자를 선택하면 상세 정보와 상태 변경 버튼이
                표시됩니다.
              </p>
            </header>

            <div className="admin-detail-card">
              <div className="admin-detail-card__row">
                <span className="admin-detail-card__label">이메일</span>
                <span className="admin-detail-card__value">
                  demo@example.com
                </span>
              </div>
              <div className="admin-detail-card__row">
                <span className="admin-detail-card__label">닉네임</span>
                <span className="admin-detail-card__value">Demo User</span>
              </div>
              <div className="admin-detail-card__row">
                <span className="admin-detail-card__label">권한</span>
                <span className="admin-detail-card__value">ADMIN</span>
              </div>
              <div className="admin-detail-card__row">
                <span className="admin-detail-card__label">상태</span>
                <span className="admin-detail-card__value">활성</span>
              </div>

              <div className="admin-detail-card__actions">
                <Button type="button" size="sm" variant="ghost">
                  비활성 처리
                </Button>
                <Button type="button" size="sm" variant="primary">
                  권한 변경
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

export default AdminUserScreen;
