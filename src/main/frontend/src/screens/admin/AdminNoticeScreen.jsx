// FILE: src/main/frontend/src/screens/admin/AdminNoticeScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";

const MOCK_NOTICES = [
  {
    id: 1,
    title: "Timebar Diary 베타 오픈 안내",
    period: "2025-12-01 ~ 2026-01-31",
    channel: "웹 · 모바일",
    status: "노출중",
  },
  {
    id: 2,
    title: "점검 안내 – 12/15(월) 02:00~04:00",
    period: "2025-12-10 ~ 2025-12-16",
    channel: "웹",
    status: "예약",
  },
];

function AdminNoticeScreen() {
  return (
    <PageContainer
      screenId="ADM-003"
      title="공지 / 팝업 관리"
      subtitle="공지사항, 배너, 팝업을 등록·수정하고 노출 기간/채널을 관리합니다."
    >
      <div className="screen admin-screen">
        <div className="admin-grid">
          {/* 왼쪽: 등록/수정 폼 */}
          <section className="admin-panel">
            <header className="admin-panel__header">
              <h3 className="admin-panel__title">공지 등록</h3>
              <p className="admin-panel__subtitle">
                제목·내용·노출 기간과 채널을 입력한 뒤 저장합니다.
              </p>
            </header>

            <form className="admin-notice-form">
              <TextInput label="제목" placeholder="공지 제목을 입력하세요" />
              <label className="field">
                <span className="field__label">내용</span>
                <textarea
                  className="field__control"
                  rows={5}
                  placeholder="공지 내용을 입력하세요"
                />
              </label>

              <div className="admin-notice-form__row">
                <TextInput label="노출 시작일" placeholder="YYYY-MM-DD" />
                <TextInput label="노출 종료일" placeholder="YYYY-MM-DD" />
              </div>

              <div className="admin-notice-form__row">
                <TextInput label="채널" placeholder="예) 웹, 모바일 앱" />
                <TextInput label="우선순위" placeholder="숫자가 클수록 상단 노출" />
              </div>

              <div className="admin-notice-form__actions">
                <Button type="button" variant="ghost">
                  초기화
                </Button>
                <Button type="submit" variant="primary">
                  등록
                </Button>
              </div>
            </form>
          </section>

          {/* 오른쪽: 공지 리스트 */}
          <section className="admin-panel admin-panel--secondary">
            <header className="admin-panel__header">
              <h3 className="admin-panel__title">등록된 공지</h3>
              <p className="admin-panel__subtitle">
                노출 상태, 기간, 채널을 한눈에 확인할 수 있습니다.
              </p>
            </header>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>제목</th>
                    <th>기간</th>
                    <th>채널</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_NOTICES.map((n) => (
                    <tr key={n.id}>
                      <td>{n.title}</td>
                      <td>{n.period}</td>
                      <td>{n.channel}</td>
                      <td>{n.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

export default AdminNoticeScreen;
