import React from "react";
import "../styles/screens/settings.css";

const DataManagementScreen = () => {
  const handleExport = () => {
    // TODO: 백엔드 API 연동 (예: GET /api/export)
    alert("데이터 내보내기(백업) API와 연동 예정입니다.");
  };

  const handleImport = () => {
    // TODO: 파일 업로드 후 /api/import 연동
    alert("데이터 가져오기(복원) 기능은 추후 구현 예정입니다.");
  };

  const handleReset = () => {
    if (!window.confirm("정말로 모든 데이터를 초기화하시겠습니까?")) return;
    // TODO: DELETE /api/data/reset
    alert("데이터 초기화 API와 연동 예정입니다.");
  };

  return (
    <div className="screen data-management-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">데이터 관리</h1>
          <p className="text-muted font-small">
            백업/복원 및 초기화 기능으로 나의 타임라인 데이터를 관리합니다.
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="dashboard-card__title">백업 및 복원</h2>
        <p className="text-muted font-small mb-3">
          JSON/CSV 형태로 데이터를 내보내고, 다시 불러올 수 있습니다.
        </p>
        <div className="form-row">
          <button className="btn btn--primary" onClick={handleExport}>
            전체 데이터 백업 파일 다운로드
          </button>
        </div>
        <div className="form-row form-row--inline">
          <div>
            <input type="file" className="form-input" />
          </div>
          <button className="btn btn--secondary" onClick={handleImport}>
            선택한 파일로 복원
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <h2 className="dashboard-card__title">데이터 초기화</h2>
        <p className="text-muted font-small">
          모든 일정/할 일/루틴/다이어리/통계 데이터를 삭제합니다. 되돌릴 수
          없으니 신중하게 사용하세요.
        </p>
        <button className="btn btn--danger" onClick={handleReset}>
          전체 데이터 초기화
        </button>
      </div>
    </div>
  );
};

export default DataManagementScreen;
