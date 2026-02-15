import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TimeFlowLogo from "../shared/ui/TimeFlowLogo";
import "./Header.css";
import ChatWidget from './ChatWidget';
// 아이콘 추가 (없으면 텍스트로 대체 가능)
import { MessageCircle } from "lucide-react"; 

export default function Header({ 
  user, 
  userLoading, 
  permissions = {}, 
  onLogout 
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  
  // 채팅 상태 관리
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isAdmin = !!permissions?.isAdmin;

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const displayName = useMemo(() => {
    if (userLoading) return "Loading...";
    return user?.nickName || user?.name || "게스트";
  }, [user, userLoading]);

  const displayEmail = user?.email || "";

  const handleLogout = () => {
    setOpen(false);
    if (onLogout) onLogout();
    else alert("로그아웃 API 호출 (기능 미구현)");
  };

  return (
    <>
      <header className="app-header">
        {/* Left: Brand */}
        <div 
          className="app-header__left" 
          onClick={() => navigate("/home")} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <TimeFlowLogo size={40} />
          <div className="auth-brand__name">
            <div className="auth-brand__title">TimeFlow</div>
            <div className="auth-brand__subtitle">Timebar Diary</div>
          </div>
        </div>

        {/* Right: Profile & Actions */}
        <div className="app-header__right" ref={wrapRef} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* [추가됨] 1. 채팅 토글 버튼 */}
          <button 
            className="header-icon-btn" 
            onClick={() => setIsChatOpen(!isChatOpen)}
            title="채팅"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b', // var(--tf-text-muted)
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {/* 아이콘이 없으면 텍스트 '💬' 로 대체 가능 */}
            <MessageCircle size={24} /> 
          </button>

          {/* 2. 프로필 버튼 */}
          <button 
            className="profile-btn" 
            onClick={() => setOpen(!open)}
          >
            <div className="profile-avatar">
              {displayName[0]}
            </div>
            <div className="profile-info">
              <span className="profile-name">{displayName}</span>
            </div>
            <span className="profile-chev">▾</span>
          </button>

          {/* 드롭다운 메뉴 */}
          {open && (
            <div className="profile-menu">
              <div className="profile-menu__header">
                <div className="pm-name">{displayName}</div>
                <div className="pm-email">{displayEmail}</div>
              </div>
              
              <div className="profile-menu__list">
                <button onClick={() => { setOpen(false); navigate("/settings"); }}>
                  개인 설정
                </button>
                
                {isAdmin && (
                  <button onClick={() => { setOpen(false); navigate("/admin"); }}>
                    관리자 설정
                  </button>
                )}
                
                <div className="pm-divider"/>
                
                <button className="pm-logout" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* [위치 변경] ChatWidget은 헤더 레이아웃 바깥(HTML 구조상 아래)에 두는 것이 좋습니다. */}
      {/* 그래야 z-index나 position: fixed가 헤더에 갇히지 않고 화면 전체 기준으로 뜹니다. */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}