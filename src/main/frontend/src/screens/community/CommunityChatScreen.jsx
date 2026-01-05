// FILE: src/main/frontend/src/screens/community/CommunityChatScreen.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

export default function CommunityChatScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef(null);

  async function load() {
    setLoading(true);
    try {
      const g = await communityApi.getGroup(groupId);
      setGroup(g);
      const m = await communityApi.listMembers(groupId);
      setMembers(m);
      const list = await communityApi.listChatMessages(groupId);
      setMessages(list);
    } catch (e) {
      alert(`접근 불가: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    // 새 메시지 오면 아래로 스크롤
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const me = useMemo(() => members.find((m) => m.isMe), [members]);

  async function send() {
    const t = text.trim();
    if (!t) return;
    setText("");
    try {
      await communityApi.sendChatMessage(groupId, t);
      await load();
    } catch (e) {
      alert(`전송 실패: ${String(e?.message || e)}`);
    }
  }

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">커뮤니티 채팅</div>
          <div className="tf-subtitle">
            {group ? group.name : ""} · 멤버만 입장 · 실시간(WS)은 서버 연동 시 적용
          </div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={() => navigate(`/community/${groupId}`)}>
            ← 상세
          </button>
          <button className="tf-btn" onClick={() => navigate(`/community/${groupId}/board`)}>
            게시판
          </button>
          <button className="tf-btn" onClick={load} disabled={loading}>
            새로고침
          </button>
        </div>
      </div>

      {group?.pinnedNotice ? (
        <div className="tf-card" style={{ marginBottom: 12 }}>
          <div className="tf-row">
            <span className="tf-badge">공지</span>
            <span className="tf-small">{group.pinnedNotice}</span>
          </div>
        </div>
      ) : null}

      <div className="tf-card">
        <div className="tf-chat">
          <div className="tf-chat__list" ref={listRef}>
            {messages.map((m) => {
              const isMe = m.senderUserId === me?.userId;
              const cls = m.system ? "tf-msg tf-msg--system" : isMe ? "tf-msg tf-msg--me" : "tf-msg";
              return (
                <div key={m.id} className={cls}>
                  <div className="tf-msg__bubble">
                    {!m.system ? (
                      <div className="tf-small" style={{ fontWeight: 900 }}>
                        {m.senderName}
                      </div>
                    ) : null}
                    <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                    <div className="tf-msg__meta">
                      <span>{m.system ? "SYSTEM" : ""}</span>
                      <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {loading ? <div className="tf-muted tf-small">불러오는 중...</div> : null}
          </div>

          <div className="tf-row" style={{ width: "100%" }}>
            <input
              className="tf-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="메시지 입력"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button className="tf-btn tf-btn--primary" onClick={send} disabled={!text.trim()}>
              전송
            </button>
          </div>

          <div className="tf-small tf-muted">
            참고(근거 부족): 읽음 처리, 파일 첨부, 신고/차단, WS 실시간 동기화는 서버/정책 확정 후 구현해야 합니다.
          </div>
        </div>
      </div>
    </div>
  );
}
