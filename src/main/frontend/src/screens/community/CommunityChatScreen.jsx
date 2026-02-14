import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

export default function CommunityChatScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const listRef = useRef(null);

  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    (async () => {
      const g = await communityApi.getGroup(groupId);
      setGroup(g);
      const m = await communityApi.listMembers(groupId);
      setMembers(m);
      // Mock Messages
      setMessages([
        { id: 1, senderName: "김갓생", text: "오늘도 화이팅입니다!", system: false },
        { id: 2, senderName: "SYSTEM", text: "🔥 박열정님이 [기상 인증]에 성공했습니다!", system: true, type: "verify" },
        { id: 3, senderName: "이새벽", text: "오 대박이네요 ㅋㅋ 저도 곧 따라갑니다.", system: false }
      ]);
    })();
  }, [groupId]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const me = useMemo(() => members.find(m => m.isMe), [members]);

  const handleSend = () => {
    if (!text.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      senderName: me?.userName || "나", 
      senderUserId: me?.userId,
      text, 
      system: false 
    }]);
    setText("");
  };

  return (
    <div className="tf-page" style={{height: '100vh', overflow:'hidden'}}>
      <div className="tf-page__header">
        <div>
          <div className="tf-title">{group?.name || "채팅방"}</div>
          <div className="tf-subtitle">{members.length}명 참여중</div>
        </div>
        <button className="tf-btn" onClick={() => navigate(-1)}>나가기</button>
      </div>

      {/* Chat Container */}
      <div className="tf-chat-container">
        <div className="tf-chat-list" ref={listRef}>
          {messages.map((m) => {
            const isMe = m.senderUserId === me?.userId;
            
            if (m.type === 'verify') {
              return (
                <div key={m.id} className="tf-msg tf-msg--system tf-msg--verify">
                  <div className="tf-msg__bubble">{m.text}</div>
                </div>
              );
            }

            if (m.system) {
              return (
                <div key={m.id} className="tf-msg tf-msg--system">
                  <div className="tf-msg__bubble">{m.text}</div>
                </div>
              );
            }

            return (
              <div key={m.id} className={`tf-msg ${isMe ? 'tf-msg--me' : ''}`}>
                {!isMe && <div className="tf-msg__info">{m.senderName}</div>}
                <div className="tf-msg__bubble">{m.text}</div>
                <div className="tf-msg__info">{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
              </div>
            );
          })}
        </div>

        <div className="tf-chat-input-area">
          <input 
            className="tf-input" 
            placeholder="메시지 입력..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="tf-btn tf-btn--primary" onClick={handleSend}>전송</button>
        </div>
      </div>
    </div>
  );
}