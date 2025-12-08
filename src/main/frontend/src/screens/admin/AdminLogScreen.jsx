// FILE: src/main/frontend/src/screens/admin/AdminLogScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import Select from "../../components/common/Select";
import DatePicker from "../../components/common/DatePicker";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";

const MOCK_LOGS = [
  {
    id: 1,
    time: "2025-12-06 10:15:23",
    level: "ERROR",
    source: "PlannerApi",
    message: "일간 플래너 조회 중 예외 발생",
  },
  {
    id: 2,
    time: "2025-12-06 10:12:01",
    level: "WARN",
    source: "AuthApi",
    message: "만료 임박 토큰 자동 재발급",
  },
  {
    id: 3,
    time: "2025-12-06 09:58:44",
    level: "INFO",
    source: "FocusService",
    message: "포커스 세션 종료 · 25분",
  },
];

function AdminLogScreen() {
  return (
    <PageContainer
      screenId="ADM-002"
      title="로그 / 에러 모니터링"
      subtitle="시스템 로그와 에러를 조회·필터링합니다."
    >
      <div className="screen admin-screen">
        <div className="admin-grid">
          {/* 왼쪽: 필터 */}
          <section className="admin-panel admin-panel--secondary">
            <header className="admin-panel__header">
              <h3 className="admin-panel__title">검색 조건</h3>
              <p className="admin-panel__subtitle">
                기간, 로그 레벨, 서비스명을 기준으로 필터링합니다.
              </p>
            </header>

            <form className="admin-filter-column">
              <DatePicker label="시작일" />
              <DatePicker label="종료일" />
              <Select
                label="레벨"
                options={[
                  { value: "", label: "전체" },
                  { value: "ERROR", label: "ERROR" },
                  { value: "WARN", label: "WARN" },
                  { value: "INFO", label: "INFO" },
                ]}
              />
              <TextInput label="서비스 / 소스" placeholder="예) PlannerApi" />
              <TextInput label="메시지 검색어" placeholder="키워드 검색" />
              <Button type="button" variant="primary">
                검색
              </Button>
            </form>
          </section>

          {/* 오른쪽: 로그 테이블 */}
          <section className="admin-panel">
            <header className="admin-panel__header">
              <h3 className="admin-panel__title">최근 로그</h3>
              <p className="admin-panel__subtitle">
                최근 발생한 로그를 시간 역순으로 보여줍니다.
              </p>
            </header>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>시간</th>
                    <th>레벨</th>
                    <th>서비스</th>
                    <th>메시지</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_LOGS.map((log) => (
                    <tr key={log.id}>
                      <td>{log.time}</td>
                      <td>{log.level}</td>
                      <td>{log.source}</td>
                      <td>{log.message}</td>
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

export default AdminLogScreen;
