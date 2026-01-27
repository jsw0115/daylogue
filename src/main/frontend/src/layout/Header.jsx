import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import TimeFlowLogo from "../shared/ui/TimeFlowLogo";

const Header = ({
  user = null, userLoading = false, userError = null, permissions = null,
  bootstrap = null, bootstrapLoading = false, bootstrapError = null, 
  onRefreshUser, onRefreshBootstrap, onLogout, // (옵션) 로그아웃 핸들러를 AppShell에서 내려주면 여기서 호출
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const isAdmin = !!permissions?.isAdmin;
  const displayName = useMemo(() => {
    if (userLoading) return "불러오는 중…";
    if (!user) return "게스트";
    return user.nickName || user.name || user.email || "사용자";
  }, [user, userLoading]);

  const displayEmail = useMemo(() => {
    if (userLoading) return "";
    if (!user) return "";
    return user.email || "";
  }, [user, userLoading]);

  // bootstrap에서 테마/DND 같은 “헤더에 표시할 값”만 추출
  const themeId = useMemo(() => {
    return (
      bootstrap?.general?.themeId ||
      bootstrap?.theme?.currentThemeId ||
      null
    );
  }, [bootstrap]);

  const dndText = useMemo(() => {
    const s = bootstrap?.notifications?.dndStart;
    const e = bootstrap?.notifications?.dndEnd;
    if (!s || !e) return null;
    return `${s}~${e}`;
  }, [bootstrap]);

  const hasError = !!userError || !!bootstrapError;
  const hasLoading = !!userLoading || !!bootstrapLoading;

  const goHome = () => navigate("/home");

  const onKeyDownBrand = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goHome();
    }
  };

  const closeAnd = (fn) => {
    setOpen(false);
    fn?.();
  };

  const handleLogout = () => {
    setOpen(false);
    if (typeof onLogout === "function") {
      onLogout();
      return;
    }
    alert("로그아웃은 API 연결 후 처리"); // 기존 동작 유지(임시)
  };

  return (
    <header className="app-header">
      <div className="app-header__left" onClick={() => navigate("/home")} role="button" tabIndex={0}>
        {/*<div className="app-header__brand">Timebar Diary</div>*/}
        <div className="auth-brand__logoRow">
          <TimeFlowLogo size={44} />
          <div className="auth-brand__name">
            <div className="auth-brand__title">TimeFlow</div>
            <div className="auth-brand__subtitle">Timebar Diary</div>
          </div>
        </div>
      </div>

      {/* 
      <nav className="app-header__nav">
        <NavLink className="topnav__link" to="/planner/daily">일간</NavLink>
        <NavLink className="topnav__link" to="/planner/weekly">주간</NavLink>
        <NavLink className="topnav__link" to="/planner/monthly">월간</NavLink>
        <NavLink className="topnav__link" to="/planner/yearly">연간</NavLink>
      </nav>
       */}

      <div className="app-header__right" ref={wrapRef}>
        <button className="profile-btn" onClick={() => setOpen((v) => !v)} type="button">
          <span className="profile-btn__name">{displayName}</span>
          <span className="profile-btn__email">{displayEmail}</span>
          <span className="profile-btn__chev">▾</span>
        </button>

        {open && (
          <div className="profile-menu">
            <button className="profile-menu__item" onClick={() => { setOpen(false); navigate("/settings"); }} type="button">
              개인 설정
            </button>
            {isAdmin && (
              <button className="profile-menu__item" onClick={() => { setOpen(false); navigate("/admin"); }} type="button">
                관리자 설정
              </button>
            )}
            <div className="profile-menu__sep" />
            <button className="profile-menu__item danger" onClick={() => { setOpen(false); alert("로그아웃은 API 연결 후 처리"); }} type="button">
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
