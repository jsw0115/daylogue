import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
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

  return (
    <header className="app-header">
      <div className="app-header__left" onClick={() => navigate("/home")} role="button" tabIndex={0}>
        <div className="app-header__brand">Timebar Diary</div>
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
          <span className="profile-btn__name">홍길동</span>
          <span className="profile-btn__email">user@example.com</span>
          <span className="profile-btn__chev">▾</span>
        </button>

        {open && (
          <div className="profile-menu">
            <button className="profile-menu__item" onClick={() => { setOpen(false); navigate("/settings"); }} type="button">
              개인 설정
            </button>
            <button className="profile-menu__item" onClick={() => { setOpen(false); navigate("/admin"); }} type="button">
              관리자 설정
            </button>
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
