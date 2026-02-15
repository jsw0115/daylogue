// FILE: src/screens/memo/MemoEditScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { memoApi } from "../../services/localMockApi"; // 가상의 상세 조회 API 필요
import "../../styles/timeflow-ui.css";

export default function MemoEditScreen() {
  const navigate = useNavigate();
  // const { memoId } = useParams(); // 실제 구현 시 사용

  const [content, setContent] = useState("");
  const [type, setType] = useState("text");

  // Mock: 실제로는 API로 데이터 로드
  useEffect(() => {
    setContent("기존 메모 내용 예시입니다.");
  }, []);

  const handleSave = async () => {
    alert("수정되었습니다.");
    navigate("/inbox");
  };

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">메모 편집</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={() => navigate("/inbox")}>취소</button>
          <button className="tf-btn tf-btn--primary" onClick={handleSave}>저장</button>
        </div>
      </div>

      <div className="tf-card" style={{ minHeight: '60vh' }}>
        <div className="tf-row" style={{marginBottom: 16}}>
          <select 
            className="tf-select" 
            style={{width: 150}}
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option value="text">📝 텍스트</option>
            <option value="voice">🎙️ 음성</option>
            <option value="link">🔗 링크</option>
          </select>
        </div>

        <textarea 
          className="tf-textarea"
          style={{ width: '100%', height: '100%', minHeight: '400px', border: 'none', fontSize: '16px', lineHeight: '1.6' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
        />
      </div>
    </div>
  );
}