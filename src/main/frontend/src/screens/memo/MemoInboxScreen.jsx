import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { memoApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";
import { 
  Inbox, Send, Mic, Image as ImageIcon, 
  Sparkles, Trash2, CheckSquare, Calendar, MoreHorizontal 
} from "lucide-react";

export default function MemoInboxScreen() {
  const navigate = useNavigate();
  const [memos, setMemos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Load
  const load = async () => {
    setLoading(true);
    try {
      const list = await memoApi.listMemos();
      setMemos(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Quick Capture
  const handleSave = async () => {
    if (!input.trim()) return;
    try {
      // 링크 감지 로직 (간단 예시)
      const type = input.startsWith("http") ? "link" : "text";
      await memoApi.createMemo({ content: input, type });
      setInput("");
      load();
    } catch (e) {
      alert("저장 실패");
    }
  };

  // AI Sort (Magic)
  const handleAiSort = async () => {
    setIsAiProcessing(true);
    try {
      const res = await memoApi.aiSortMemos();
      alert(`🤖 AI 정리 완료!\n${res.message}`);
      // 실제로는 여기서 할 일 목록으로 이동하거나 메모 상태가 업데이트 되어야 함
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("삭제하시겠습니까?")) return;
    await memoApi.deleteMemo(id);
    load();
  };

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">인박스 (Inbox)</div>
          <div className="tf-subtitle">떠오르는 모든 것을 일단 여기에 던져두세요. 정리는 나중에 합니다.</div>
        </div>
        <div className="tf-actions">
          <button 
            className="tf-btn tf-btn--primary" 
            onClick={handleAiSort} 
            disabled={isAiProcessing || memos.length === 0}
          >
            {isAiProcessing ? "정리 중..." : "✨ AI 자동 정리"}
          </button>
        </div>
      </div>

      <div className="tf-grid-layout" style={{ gridTemplateColumns: "1fr" }}>
        
        {/* 1. Quick Capture Input */}
        <div className="tf-card" style={{ padding: "16px" }}>
          <div className="tf-row" style={{ alignItems: "flex-start", gap: 12 }}>
            <textarea
              className="tf-textarea"
              placeholder="할 일, 아이디어, 링크, 무엇이든 입력하세요... (Ctrl+Enter)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.ctrlKey && e.key === "Enter") handleSave(); }}
              style={{ minHeight: 60, border: "none", background: "transparent", fontSize: 16, resize:'none' }}
            />
          </div>
          <div className="tf-divider" style={{ margin: "8px 0" }} />
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

        {/* 2. Memo Grid (Masonry 느낌) */}
        <div className="tf-card-grid">
          {memos.map((memo) => (
            <div key={memo.id} className="tf-card tf-memo-card">
              <div className="tf-memo-header">
                <span className={`tf-badge ${memo.type}`}>
                  {memo.type === 'link' ? '🔗 링크' : memo.type === 'voice' ? '🎙️ 음성' : '📝 메모'}
                </span>
                <button className="tf-btn--icon" onClick={() => handleDelete(memo.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="tf-memo-content">
                {memo.type === 'link' ? (
                  <a href={memo.content} target="_blank" rel="noreferrer" style={{color:'var(--tf-primary)'}}>
                    {memo.content}
                  </a>
                ) : (
                  memo.content
                )}
              </div>

              <div className="tf-memo-footer">
                <div className="tf-small tf-muted">
                  {new Date(memo.createdAt).toLocaleDateString()}
                </div>
                <div className="tf-memo-actions">
                  <button className="tf-btn--icon" title="할 일로 변환">
                    <CheckSquare size={16} />
                  </button>
                  <button className="tf-btn--icon" title="일정으로 등록">
                    <Calendar size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {memos.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
            <Inbox size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p>인박스가 비어있습니다.<br/>머릿속의 생각을 퀵 캡처로 비워보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}