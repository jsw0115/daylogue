import React, { useState } from "react";
import storage from "../../shared/utils/safeStorage";

export default function DataManagementScreen() {
  const [json, setJson] = useState("");

  const exportData = () => {
    const keys = storage.keys();
    const payload = {
      exportedAt: new Date().toISOString(),
      persistentAvailable: storage.isPersistentAvailable(),
      storage: keys.reduce((acc, k) => {
        acc[k] = storage.get(k);
        return acc;
      }, {}),
    };
    setJson(JSON.stringify(payload, null, 2));
  };

  const importData = () => {
    try {
      const parsed = JSON.parse(json);
      const obj = parsed?.storage;
      if (!obj || typeof obj !== "object") {
        alert("storage 데이터가 없습니다.");
        return;
      }
      Object.keys(obj).forEach((k) => {
        if (typeof obj[k] === "string") storage.set(k, obj[k]);
      });
      alert("가져오기 완료. (localStorage가 차단된 환경이면 새로고침 후 유지되지 않을 수 있습니다)");
    } catch (e) {
      alert("JSON 파싱 실패: " + e.message);
    }
  };

  const clearDashLayout = () => {
    storage.removeItem("timebar.dashboard.layouts.v1");
    storage.removeItem("timebar.dashboard.visible.v1");
    alert("대시보드 레이아웃 초기화 완료. 홈에서 확인하세요.");
  };

  return (
    <div className="data-screen">
      <div className="screen-head">
        <div>
          <div className="screen-title">데이터 관리</div>
          <div className="screen-subtitle">
            내보내기/가져오기/로컬 설정 초기화
            {!storage.isPersistentAvailable() && (
              <span className="muted" style={{ marginLeft: 8 }}>
                (현재 환경은 localStorage 차단 상태일 수 있어요)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="data-actions">
        <button className="btn primary" onClick={exportData} type="button">내보내기</button>
        <button className="btn" onClick={importData} type="button">가져오기</button>
        <button className="btn danger" onClick={clearDashLayout} type="button">대시보드 레이아웃 초기화</button>
      </div>

      <div className="field">
        <div className="label">JSON</div>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={18}
          placeholder="내보내기 결과가 여기에 표시됩니다."
        />
      </div>
    </div>
  );
}
