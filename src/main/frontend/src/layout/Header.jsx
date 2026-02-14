import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TimeFlowLogo from "../shared/ui/TimeFlowLogo";
import "./Header.css";

export default function Header({ 
  user, 
  userLoading, 
  permissions = {}, // 기본값 추가 (에러 방지)
  onLogout 
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // 관리자 여부 체크 (permissions가 undefined여도 안전함)
  const isAdmin = !!permissions?.isAdmin;

  // 외부 클릭 시 메뉴 닫기
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
      <div className="app-header__right" ref={wrapRef}>
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

        {open && (
          <div className="profile-menu">
            <div className="profile-menu__header">
              <div className="pm-name">{displayName}</div>
              <div className="pm-email">{displayEmail}</div>
            </div>
            
            <div className="profile-menu__list">
              {/* 1. 개인 설정 */}
              <button onClick={() => { setOpen(false); navigate("/settings"); }}>
                개인 설정
              </button>
              
              {/* 2. 관리자 설정 (권한 있을 때만) */}
              {isAdmin && (
                <button onClick={() => { setOpen(false); navigate("/admin"); }}>
                  관리자 설정
                </button>
              )}
              
              <div className="pm-divider"/>
              
              {/* 3. 로그아웃 */}
              <button className="pm-logout" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}