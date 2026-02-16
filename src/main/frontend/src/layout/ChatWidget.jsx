// FILE: src/layout/ChatWidget.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useChat } from '../shared/context/ChatContext';
import {
  User, MessageCircle, MoreHorizontal, Search,
  X, ChevronLeft, Send, Bell, BellOff, Settings, Plus,
  Menu, Edit2, LogOut, UserPlus, Check,
  Trash2, CornerDownLeft, Image
} from "lucide-react";
import AddressBookPicker from "../components/common/AddressBookPicker";
import '../styles/components/ChatWidget.css';

// --- Mock Data ---
const MOCK_FRIENDS = [
  { id: 'me', name: '나 (Kim)', status: 'online', statusMsg: '오늘도 갓생 살자!', avatar: null, isMe: true },
  { id: 'f1', name: '이개발', status: 'focus', statusMsg: '코딩 중...', avatar: 'L', isMe: false },
  { id: 'f2', name: '박기획', status: 'busy', statusMsg: '기획서 마감 ㅠㅠ', avatar: 'P', isMe: false },
  { id: 'f3', name: '최디자인', status: 'offline', statusMsg: '', avatar: 'C', isMe: false },
];

const MOCK_CHATS = [
  {
    id: 1,
    name: '🔥 기상 인증방',
    lastMsg: '오늘도 완료했습니다!',
    time: '07:30',
    unread: 5,
    avatar: '🔥',
    participants: ['me', 'f1', 'f2'],
    muted: false // 채팅방 별 알림 설정
  },
  {
    id: 2,
    name: '이개발',
    lastMsg: '코드 리뷰 부탁드려요.',
    time: '어제',
    unread: 1,
    avatar: 'L',
    participants: ['me', 'f1'],
    muted: true // 이 방은 알림 꺼짐
  },
];

export default function ChatWidget({ isOpen, onClose }) {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('chats');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Data State
  const [friends] = useState(MOCK_FRIENDS);
  const [chatRooms, setChatRooms] = useState(MOCK_CHATS);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Settings State
  const [enterToSend, setEnterToSend] = useState(true); // Enter로 전송 여부
  const [myStatus, setMyStatus] = useState('online');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [showInvitePicker, setShowInvitePicker] = useState(false);

  // --- Derived State ---
  const totalUnread = useMemo(() => chatRooms.reduce((acc, room) => acc + room.unread, 0), [chatRooms]);

  const currentParticipants = useMemo(() => {
    if (!currentRoom) return [];
    return currentRoom.participants.map(pid => friends.find(f => f.id === pid)).filter(Boolean);
  }, [currentRoom, friends]);

  // --- Effects ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentRoom, isInfoOpen]);

  // --- Handlers ---

  const handleEnterRoom = (room) => {
    setCurrentRoom(room);
    setIsInfoOpen(false);
    // 입장 시 메시지 로드 (Mock)
    setMessages([
      { id: 100, sender: 'System', text: '채팅방에 입장했습니다.', type: 'system', timestamp: Date.now() },
      { id: 101, sender: 'Other', text: room.lastMsg, type: 'msg', time: room.time, timestamp: Date.now() - 100000 },
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Me',
      text: input,
      type: 'msg',
      time: '방금',
      timestamp: Date.now() // 삭제 가능 시간 체크용
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  // 키보드 핸들러 (Enter 전송 / Shift+Enter 줄바꿈)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (enterToSend && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  // 메시지 삭제 (5분 제한)
  const handleDeleteMessage = (msgId) => {
    if (window.confirm("메시지를 삭제하시겠습니까? (상대방에게도 삭제됩니다)")) {
      setMessages(prev => prev.filter(m => m.id !== msgId));
    }
  };

  // 채팅방 이름 변경
  const handleUpdateRoomName = () => {
    if (newRoomName.trim()) {
      const updated = { ...currentRoom, name: newRoomName };
      setChatRooms(prev => prev.map(r => r.id === currentRoom.id ? updated : r));
      setCurrentRoom(updated);
    }
    setIsEditingName(false);
  };

  // 채팅방 알림 토글
  const handleToggleRoomMute = () => {
    const updated = { ...currentRoom, muted: !currentRoom.muted };
    setChatRooms(prev => prev.map(r => r.id === currentRoom.id ? updated : r));
    setCurrentRoom(updated);
  };

  // 초대하기
  const handleInviteUsers = (selectedIds) => {
    if (selectedIds.length === 0) return;
    const updatedParticipants = [...new Set([...currentRoom.participants, ...selectedIds])];
    const updatedRoom = { ...currentRoom, participants: updatedParticipants };
    setChatRooms(prev => prev.map(r => r.id === currentRoom.id ? updatedRoom : r));
    setCurrentRoom(updatedRoom);

    const newNames = friends.filter(f => selectedIds.includes(f.id)).map(f => f.name).join(", ");
    setMessages(prev => [...prev, { id: Date.now(), sender: 'System', text: `${newNames}님을 초대했습니다.`, type: 'system' }]);
    setShowInvitePicker(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="chat-widget-overlay">
        <div className="chat-widget-container">

          {/* === 1. Sidebar === */}
          <nav className="chat-sidebar">
            <div className="chat-sidebar-top">
              <button
                className={`sidebar-btn ${activeTab === 'friends' && !currentRoom ? 'active' : ''}`}
                onClick={() => { setActiveTab('friends'); setCurrentRoom(null); }} title="친구"
              >
                <User size={24} />
              </button>
              <button
                className={`sidebar-btn ${activeTab === 'chats' && !currentRoom ? 'active' : ''}`}
                onClick={() => { setActiveTab('chats'); setCurrentRoom(null); }} title="채팅"
              >
                <div className="icon-wrapper">
                  <MessageCircle size={24} />
                  {totalUnread > 0 && <span className="sidebar-badge">{totalUnread}</span>}
                </div>
              </button>
              <button
                className={`sidebar-btn ${activeTab === 'more' && !currentRoom ? 'active' : ''}`}
                onClick={() => { setActiveTab('more'); setCurrentRoom(null); }} title="더보기"
              >
                <MoreHorizontal size={24} />
              </button>
            </div>
            <div className="chat-sidebar-bottom">
              <button
                className={`sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => { setActiveTab('settings'); setCurrentRoom(null); }} title="설정"
              >
                <Settings size={20} />
              </button>
            </div>
          </nav>

          {/* === 2. Content Area === */}
          <main className="chat-content">

            {/* Header */}
            <header className="chat-header">
              {currentRoom ? (
                <div className="header-room">
                  <button onClick={() => setCurrentRoom(null)} className="icon-btn">
                    <ChevronLeft size={24} />
                  </button>
                  <div className="header-title room">
                    <div className="room-title-row">
                      <span className="room-name">{currentRoom.name}</span>
                      {currentRoom.muted && <BellOff size={12} color="#94a3b8" />}
                    </div>
                    <span className="room-meta">{currentRoom.participants.length}명</span>
                  </div>
                  <button className={`icon-btn ${isInfoOpen ? 'active' : ''}`} onClick={() => setIsInfoOpen(!isInfoOpen)}>
                    <Menu size={20} />
                  </button>
                </div>
              ) : (
                <div className="header-main">
                  <span className="header-title-text">
                    {activeTab === 'friends' ? '친구' : activeTab === 'chats' ? '채팅' : activeTab === 'settings' ? '설정' : '더보기'}
                  </span>
                  {activeTab !== 'settings' && (
                    <div className="header-actions">
                      <button className="icon-btn"><Search size={20} /></button>
                      {activeTab === 'chats' && (
                        <button className="icon-btn" onClick={() => setShowInvitePicker(true)}><Plus size={24} /></button>
                      )}
                      <button onClick={onClose} className="icon-btn close"><X size={24} /></button>
                    </div>
                  )}
                  {activeTab === 'settings' && (
                    <div className="header-actions"><button onClick={onClose} className="icon-btn close"><X size={24} /></button></div>
                  )}
                </div>
              )}
            </header>

            {/* Body */}
            <div className="chat-body">

              {/* --- View 1: Chat Room --- */}
              {currentRoom && (
                <div className="chat-room-layout">
                  <div className={`chat-room-view ${isInfoOpen ? 'shrink' : ''}`}>
                    <div className="message-list">
                      {messages.map((msg) => {
                        // 5분 이내인지 확인 (300,000ms)
                        const isDeletable = msg.sender === 'Me' && (Date.now() - msg.timestamp < 300000);

                        return (
                          <div key={msg.id} className={`msg-row ${msg.type} ${msg.sender === 'Me' ? 'me' : 'other'}`}>
                            {msg.type === 'msg' && msg.sender !== 'Me' && (
                              <div className="msg-avatar">{currentRoom.avatar}</div>
                            )}
                            <div className="msg-content-wrapper">
                              {msg.type === 'msg' && msg.sender !== 'Me' && <div className="msg-name">{msg.sender}</div>}

                              <div className="msg-bubble-group">
                                {/* 삭제 버튼 (호버 시 등장) */}
                                {isDeletable && (
                                  <button className="msg-delete-btn" onClick={() => handleDeleteMessage(msg.id)} title="삭제">
                                    <Trash2 size={12} />
                                  </button>
                                )}
                                <div className="msg-bubble">{msg.text}</div>
                              </div>
                            </div>
                            {msg.type === 'msg' && <span className="msg-time">{msg.time}</span>}
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                      <button className="attach-btn"><Plus size={20} /></button>
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={enterToSend ? "메시지 입력 (Enter로 전송)" : "메시지 입력"}
                      />
                      <button onClick={handleSend} disabled={!input.trim()} className={`send-btn ${input.trim() ? 'active' : ''}`}>
                        <Send size={18} />
                      </button>
                    </div>
                  </div>

                  {/* ★ Room Info Drawer ★ */}
                  <div className={`chat-room-info-panel ${isInfoOpen ? 'open' : ''}`}>
                    <div className="info-section">
                      <div className="info-label">채팅방 설정</div>

                      {/* 방제 변경 */}
                      {isEditingName ? (
                        <div className="info-edit-row">
                          <input className="info-input" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} placeholder={currentRoom.name} autoFocus />
                          <button className="info-icon-btn check" onClick={handleUpdateRoomName}><Check size={16} /></button>
                        </div>
                      ) : (
                        <div className="info-row">
                          <span className="info-text">{currentRoom.name}</span>
                          <button className="info-icon-btn" onClick={() => { setNewRoomName(currentRoom.name); setIsEditingName(true); }}>
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}

                      {/* ★ 채팅방 별 알림 토글 ★ */}
                      <div className="info-toggle-row">
                        <div className="toggle-label">
                          {currentRoom.muted ? <BellOff size={16} /> : <Bell size={16} />}
                          <span>알림 {currentRoom.muted ? '꺼짐' : '켜짐'}</span>
                        </div>
                        <button
                          className={`toggle-switch ${!currentRoom.muted ? 'on' : ''}`}
                          onClick={handleToggleRoomMute}
                        >
                          <div className="toggle-thumb" />
                        </button>
                      </div>
                    </div>

                    <div className="info-section">
                      <div className="info-label-row">
                        <span className="info-label">대화상대 ({currentParticipants.length})</span>
                        <button className="info-invite-btn" onClick={() => setShowInvitePicker(true)}><UserPlus size={14} /> 초대</button>
                      </div>
                      <ul className="participant-list">
                        {currentParticipants.map(user => (
                          <li key={user.id} className="participant-item">
                            <div className="participant-avatar">{user.avatar || user.name[0]}</div>
                            <div className="participant-info">
                              <div className="participant-name">{user.name}</div>
                              {user.isMe && <span className="participant-me">(나)</span>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="info-footer">
                      <button className="chat-leave-btn" onClick={() => { /*나가기 로직*/ }}><LogOut size={16} /> 나가기</button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- View 2: Lists (Friends / Chats) --- */}
              {!currentRoom && activeTab === 'friends' && (
                <div className="list-view">
                  <div className="section-title">내 프로필</div>
                  <div className="friend-item me">
                    <div className="avatar-lg">{friends[0].name[0]}</div>
                    <div className="friend-info">
                      <div className="friend-name">{friends[0].name}</div>
                      <div className="friend-status">{friends[0].status}</div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="section-title">친구 {friends.length - 1}</div>
                  {friends.slice(1).map(f => (
                    <div key={f.id} className="friend-item">
                      <div className="avatar">{f.avatar || f.name[0]}</div>
                      <div className="friend-info">
                        <div className="friend-name">{f.name}</div>
                        <div className="friend-status">{f.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!currentRoom && activeTab === 'chats' && (
                <div className="list-view">
                  {chatRooms.map(room => (
                    <div key={room.id} className="chat-item" onClick={() => handleEnterRoom(room)}>
                      <div className="avatar">{room.avatar}</div>
                      <div className="chat-info">
                        <div className="chat-top">
                          <span className="chat-name">{room.name}</span>
                          {room.muted && <BellOff size={12} color="#94a3b8" style={{ marginLeft: 4 }} />}
                          <span className="chat-time" style={{ marginLeft: 'auto' }}>{room.time}</span>
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

              {/* --- View 3: Settings (개편됨) --- */}
              {!currentRoom && activeTab === 'settings' && (
                <div className="settings-view">
                  <div className="settings-group">
                    <div className="settings-label">내 상태</div>
                    <div className="status-grid">
                      {['online', 'focus', 'busy', 'offline'].map(st => (
                        <button key={st} className={`status-chip ${st} ${myStatus === st ? 'active' : ''}`} onClick={() => setMyStatus(st)}>
                          <span className="dot" /> {st.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="settings-divider" />

                  <div className="settings-group">
                    <div className="settings-label">채팅 옵션</div>
                    {/* Enter로 전송 설정 */}
                    <div className="settings-item-row">
                      <div className="row-left"><CornerDownLeft size={18} /> Enter키로 메시지 전송</div>
                      <button
                        className={`toggle-switch ${enterToSend ? 'on' : ''}`}
                        onClick={() => setEnterToSend(!enterToSend)}
                      >
                        <div className="toggle-thumb" />
                      </button>
                    </div>
                    {/* 사진 자동 다운로드 (예시) */}
                    <div className="settings-item-row">
                      <div className="row-left"><Image size={18} /> 사진 자동 다운로드</div>
                      <button className="toggle-switch"><div className="toggle-thumb" /></button>
                    </div>
                  </div>

                  <div className="settings-info-text">Version 2.2.0</div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>

      <AddressBookPicker
        isOpen={showInvitePicker}
        onClose={() => setShowInvitePicker(false)}
        onConfirm={handleInviteUsers}
        multiple={true}
      />
    </>
  );
}