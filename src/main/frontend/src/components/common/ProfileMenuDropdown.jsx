import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { safeStorage } from "../../shared/utils/safeStorage";

export default function ProfileMenuDropdown() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const user = useMemo(() => {
    return safeStorage.getJSON("auth.user", { name: "홍길동", email: "user@example.com" });
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const logout = () => {
    safeStorage.remove("auth.token");
    safeStorage.remove("auth.role");
    safeStorage.remove("auth.user");
    setOpen(false);
    nav("/login");
  };

  return (
    <div className="profileMenu" ref={wrapRef}>
      <button type="button" className="profileMenu__btn" onClick={() => setOpen((v) => !v)}>
        <span className="avatar">{(user.name || "U").slice(0, 1)}</span>
        <span className="profileMenu__meta">
          <span className="profileMenu__name">{user.name}</span>
          <span className="profileMenu__email">{user.email}</span>
        </span>
        <span className="caret">▾</span>
      </button>

      {open ? (
        <div className="profileMenu__dropdown" role="menu">
          <button className="pm-item" type="button" onClick={() => (setOpen(false), nav("/settings"))}>설정</button>
          <button className="pm-item" type="button" onClick={() => (setOpen(false), nav("/admin"))}>관리자 설정</button>
          <div className="pm-sep" />
          <button className="pm-item is-danger" type="button" onClick={logout}>로그아웃</button>
        </div>
      ) : null}
    </div>
  );
}
