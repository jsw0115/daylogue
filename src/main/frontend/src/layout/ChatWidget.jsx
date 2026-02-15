// FILE: src/layout/ChatWidget.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useChat } from '../shared/context/ChatContext';
import { 
  User, MessageCircle, MoreHorizontal, Search, 
  X, ChevronLeft, Send, Bell, Settings, Plus 
} from "lucide-react";
import '../styles/components/ChatWidget.css'; 

// --- Mock Data ---
const MOCK_FRIENDS = [
  { id: 'me', name: '나 (Kim)', status: '오늘도 갓생 살자!', avatar: null, isMe: true },
  { id: 'f1', name: '이개발', status: '코딩 중...', avatar: 'L', isMe: false },
  { id: 'f2', name: '박기획', status: '기획서 마감 ㅠㅠ', avatar: 'P', isMe: false },
  { id: 'f3', name: '최디자인', status: '', avatar: 'C', isMe: false },
];

const MOCK_CHATS = [
  { id: 1, name: '🔥 기상 인증방', lastMsg: '오늘도 완료했습니다!', time: '07:30', unread: 5, avatar: '🔥' },
  { id: 2, name: '이개발', lastMsg: '코드 리뷰 부탁드려요.', time: '어제', unread: 1, avatar: 'L' },
  { id: 3, name: 'TimeFlow 팀', lastMsg: '다음 회의는 월요일입니다.', time: '12/10', unread: 0, avatar: 'T' },
];

export default function ChatWidget({ isOpen, onClose }) {
  const { client, connected, sendMessage } = useChat();
  
  // Tabs: 'friends' | 'chats' | 'more'
  const [activeTab, setActiveTab] = useState('chats'); 
  const [currentRoom, setCurrentRoom] = useState(null); // 채팅방 진입 여부
  
  // Data State
  const [friends] = useState(MOCK_FRIENDS);
  const [chatRooms] = useState(MOCK_CHATS);
  
  // Chat Room State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // 총 안 읽은 메시지 수 계산
  const totalUnread = useMemo(() => 
    chatRooms.reduce((acc, room) => acc + room.unread, 0), 
  [chatRooms]);

  // 스크롤 하단 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentRoom]);

  // 채팅방 진입 시 메시지 로드 (Mock)
  const handleEnterRoom = (room) => {
    setCurrentRoom(room);
    setMessages([
      { id: 1, sender: 'System', text: '채팅방에 입장했습니다.', type: 'system' },
      { id: 2, sender: 'Other', text: room.lastMsg, type: 'msg', time: room.time },
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'Me', text: input, type: 'msg', time: '방금' }]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="chat-widget-overlay">
      <div className="chat-widget-container">
        
        {/* === 1. Left Sidebar (Navigation) === */}
        <nav className="chat-sidebar">
          <div className="chat-sidebar-top">
            <button 
              className={`sidebar-btn ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => { setActiveTab('friends'); setCurrentRoom(null); }}
              title="친구"
            >
              <User size={24} />
            </button>
            
            <button 
              className={`sidebar-btn ${activeTab === 'chats' ? 'active' : ''}`}
              onClick={() => { setActiveTab('chats'); setCurrentRoom(null); }}
              title="채팅"
            >
              <div className="icon-wrapper">
                <MessageCircle size={24} />
                {totalUnread > 0 && <span className="sidebar-badge">{totalUnread}</span>}
              </div>
            </button>

            <button 
              className={`sidebar-btn ${activeTab === 'more' ? 'active' : ''}`}
              onClick={() => { setActiveTab('more'); setCurrentRoom(null); }}
              title="더보기"
            >
              <MoreHorizontal size={24} />
            </button>
          </div>

          <div className="chat-sidebar-bottom">
            <button className="sidebar-btn" title="알림 설정"><Bell size={20} /></button>
            <button className="sidebar-btn" title="설정"><Settings size={20} /></button>
          </div>
        </nav>

        {/* === 2. Right Content Area === */}
        <main className="chat-content">
          
          {/* A. Header (Dynamic) */}
          <header className="chat-header">
            {currentRoom ? (
              // 채팅방 내부 헤더
              <div className="header-room">
                <button onClick={() => setCurrentRoom(null)} className="icon-btn">
                  <ChevronLeft size={22} />
                </button>
                <div className="header-title">
                  <span className="room-name">{currentRoom.name}</span>
                  <span className="room-meta">3명</span>
                </div>
                <button className="icon-btn"><Search size={20} /></button>
              </div>
            ) : (
              // 탭 메인 헤더
              <div className="header-main">
                <span className="header-title-text">
                  {activeTab === 'friends' ? '친구' : activeTab === 'chats' ? '채팅' : '더보기'}
                </span>
                <div className="header-actions">
                  <button className="icon-btn"><Search size={20} /></button>
                  {activeTab === 'chats' && (
                    <button className="icon-btn"><Plus size={22} /></button>
                  )}
                  <button onClick={onClose} className="icon-btn close"><X size={22} /></button>
                </div>
              </div>
            )}
          </header>

          {/* B. Body Content */}
          <div className="chat-body">
            
            {/* View 1: Chat Room (Active) */}
            {currentRoom && (
              <div className="chat-room-view">
                <div className="message-list">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`msg-row ${msg.type} ${msg.sender === 'Me' ? 'me' : 'other'}`}>
                      {msg.type === 'msg' && msg.sender !== 'Me' && (
                        <div className="msg-avatar">{currentRoom.avatar}</div>
                      )}
                      <div className="msg-content">
                        {msg.type === 'msg' && msg.sender !== 'Me' && <div className="msg-name">{msg.sender}</div>}
                        <div className="msg-bubble">{msg.text}</div>
                      </div>
                      {msg.type === 'msg' && <span className="msg-time">{msg.time}</span>}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="chat-input-area">
                  <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="메시지 입력"
                  />
                  <button onClick={handleSend} disabled={!input.trim()} className={`send-btn ${input.trim() ? 'active' : ''}`}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* View 2: Friend List */}
            {!currentRoom && activeTab === 'friends' && (
              <div className="list-view">
                {/* My Profile */}
                <div className="section-title">내 프로필</div>
                <div className="friend-item me">
                  <div className="avatar-lg"></div>
                  <div className="friend-info">
                    <div className="friend-name">{friends[0].name}</div>
                    <div className="friend-status">{friends[0].status}</div>
                  </div>
                </div>
                
                <div className="divider" />

                {/* Friend List */}
                <div className="section-title">친구 {friends.length - 1}</div>
                {friends.slice(1).map(f => (
                  <div key={f.id} className="friend-item">
                    <div className="avatar">{f.avatar}</div>
                    <div className="friend-info">
                      <div className="friend-name">{f.name}</div>
                      <div className="friend-status">{f.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View 3: Chat List */}
            {!currentRoom && activeTab === 'chats' && (
              <div className="list-view">
                {chatRooms.map(room => (
                  <div key={room.id} className="chat-item" onClick={() => handleEnterRoom(room)}>
                    <div className="avatar">{room.avatar}</div>
                    <div className="chat-info">
                      <div className="chat-top">
                        <span className="chat-name">{room.name}</span>
                        <span className="chat-time">{room.time}</span>
                      </div>
                      <div className="chat-bottom">
                        <span className="chat-preview">{room.lastMsg}</span>
                        {room.unread > 0 && <span className="unread-count">{room.unread}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View 4: More */}
            {!currentRoom && activeTab === 'more' && (
              <div className="more-view">
                <div className="more-grid">
                  <div className="more-item"><span>📅</span>캘린더</div>
                  <div className="more-item"><span>📁</span>자료실</div>
                  <div className="more-item"><span>📢</span>공지사항</div>
                  <div className="more-item"><span>🎁</span>선물하기</div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}