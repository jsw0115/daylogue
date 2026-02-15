// FILE: src/screens/memo/MemoInboxScreen.jsx
import React, { useState } from "react";
import { 
  Inbox, Send, Mic, Image as ImageIcon, 
  CheckSquare, Calendar, Trash2, Link as LinkIcon 
} from "lucide-react";
import "../../styles/timeflow-ui.css"; // 공통 스타일

// Mock Data
const MOCK_MEMOS = [
  { id: "m1", content: "다음 주 워크샵 장소 예약하기\n강남역 근처로 알아볼 것", type: "text", createdAt: "2026-02-14 10:00" },
  { id: "m2", content: "https://velog.io/@trend/react-query-v5", type: "link", createdAt: "2026-02-14 11:30" },
  { id: "m3", content: "집 가는 길에 세탁소 들르기", type: "text", createdAt: "2026-02-14 18:00" },
];

export default function MemoInboxScreen() {
  const [memos, setMemos] = useState(MOCK_MEMOS);
  const [input, setInput] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const handleSave = () => {
    if (!input.trim()) return;
    const newMemo = {
      id: Date.now().toString(),
      content: input,
      type: input.startsWith("http") ? "link" : "text",
      createdAt: new Date().toISOString(),
    };
    setMemos([newMemo, ...memos]);
    setInput("");
  };

  const handleAiSort = () => {
    setIsAiProcessing(true);
    setTimeout(() => {
      alert("🤖 AI가 메모를 분석하여 [할 일] 2건을 추출했습니다.");
      setIsAiProcessing(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    if(window.confirm("삭제하시겠습니까?")) {
      setMemos(memos.filter(m => m.id !== id));
    }
  };

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">인박스 (Inbox)</div>
          <div className="tf-subtitle">머릿속의 모든 생각을 일단 여기에 쏟아내세요.</div>
        </div>
        <button 
          className="tf-btn tf-btn--primary" 
          onClick={handleAiSort}
          disabled={isAiProcessing || memos.length === 0}
        >
          {isAiProcessing ? "정리 중..." : "✨ AI 자동 정리"}
        </button>
      </div>

      <div className="tf-grid-layout" style={{ gridTemplateColumns: "1fr", gap: 24 }}>
        
        {/* Quick Capture */}
        <div className="tf-card">
          <textarea
            className="tf-textarea"
            placeholder="할 일, 아이디어, 링크 무엇이든 적으세요. (Ctrl+Enter 저장)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.ctrlKey && e.key === "Enter") handleSave(); }}
            style={{ minHeight: 80, border: "none", resize: "none", fontSize: 16, width: "100%", outline: "none" }}
          />
          <div className="tf-divider" />
          <div className="tf-row" style={{ justifyContent: "space-between" }}>
            <div className="tf-actions">
              <button className="tf-btn tf-btn--icon" title="음성 메모"><Mic size={18} /></button>
              <button className="tf-btn tf-btn--icon" title="사진 첨부"><ImageIcon size={18} /></button>
            </div>
            <button className="tf-btn tf-btn--primary" onClick={handleSave} disabled={!input.trim()}>
              <Send size={16} style={{ marginRight: 6 }} /> 기록하기
            </button>
          </div>
        </div>

        {/* Memo Grid */}
        <div className="tf-card-grid">
          {memos.map((memo) => (
            <div key={memo.id} className="tf-card tf-memo-card">
              <div className="tf-memo-header">
                <span className={`tf-chip ${memo.type === 'link' ? 'link' : ''}`}>
                  {memo.type === 'link' ? <LinkIcon size={12}/> : null}
                  {memo.type === 'link' ? ' 링크' : ' 메모'}
                </span>
                <button className="tf-btn--icon" onClick={() => handleDelete(memo.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="tf-memo-content">
                {memo.type === 'link' ? (
                  <a href={memo.content} target="_blank" rel="noreferrer" style={{ color: 'var(--tf-primary)', wordBreak: 'break-all' }}>
                    {memo.content}
                  </a>
                ) : (
                  memo.content
                )}
              </div>

              <div className="tf-memo-footer">
                <span className="tf-small tf-muted">
                  {new Date(memo.createdAt).toLocaleDateString()}
                </span>
                <div className="tf-actions">
                  <button className="tf-btn--icon" title="할 일로 변환"><CheckSquare size={16} /></button>
                  <button className="tf-btn--icon" title="일정으로 등록"><Calendar size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {memos.length === 0 && (
          <div className="tf-empty-state">
            <Inbox size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>인박스가 비어있습니다.<br/>머릿속의 생각을 퀵 캡처로 비워보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}