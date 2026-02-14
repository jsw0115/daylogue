// src/main/frontend/src/layout/AppShell.jsx
import React, { useEffect, useState, useCallback, useMemo  } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Sidebar from "./MainSidebar";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";

import api from "../api";
import "../styles/appShell.css"; 

import { getCachedMe, setSession, clearSession } from "../shared/auth/sessionStore";
import { fetchMe } from "../shared/api/authApi";

import safeStorage from "../shared/utils/safeStorage";

import QuickMenu from "../components/common/QuickMenu";
import "../styles/components/QuickMenu.css";

// 2026.01.24 @jsw - 정보 가져오기 
async function getUser() {
  // return data
  // 
  console.log("getUser()");
  let session = safeStorage.getJSON("auth.session");
  console.log("session :: " + safeStorage.getJSON("auth.session"));
  if (session) {

    const accessToken = session?.data?.data?.accessToken ?? session?.data?.accessToken;
    const res = await api.get("/api/auth/UserData", accessToken);
    console.log("res :: " + res);

    return session;
  } else {
    throw new Error("연결 필요: axios api 인스턴스에 맞게 구현하세요.");
  }
  
}

function useResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia("(max-width: 960px)");
    const onChange = (e) => setIsMobile(!!e.matches);

    setIsMobile(!!mql.matches);

    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      mql.addListener(onChange);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        mql.removeListener(onChange);
      }
    };
  }, []);

  return { isMobile };
}

/** 메인 화면에 필요한 “앱 기본 데이터”를 한 번에 가져오는 함수 */
async function fetchBootstrap() {
  // 설정 API 목록서 기반
  const [general, theme, categories, sharingDefaults] = await Promise.all([
    api.get("/api/settings/general"),
    api.get("/api/settings/theme"),
    api.get("/api/settings/categories"),
    api.get("/api/settings/sharing-defaults"),
  ]);

  // dash_layout 서버 저장을 쓰려면 이런 API가 필요(예시)
  // - 없다면 일단 localStorage만 쓰고, 나중에 서버 저장 붙일 때 추가하면 됨
  // const layout = await api.get("/api/dashboard/layout?scope=all&bp=lg");

  return {
    general: general?.data?.data ?? general?.data,
    theme: theme?.data?.data ?? theme?.data,
    categories: categories?.data?.data ?? categories?.data,
    sharingDefaults: sharingDefaults?.data?.data ?? sharingDefaults?.data,
    // layout: layout?.data?.data ?? layout?.data,
  };
}

export default function AppShell() {
  const { isMobile } = useResponsiveLayout();

  const navigate = useNavigate();
  const location = useLocation();

  // 캐시된 사용자 정보 
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  // 앱 데이터 
  const [bootstrap, setBootstrap] = useState(null);
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [bootstrapError, setBootstrapError] = useState(null);

  // 권한 정보 
  const permissions = useMemo(() => {
    const role = user?.role; // 예: 'USER' | 'ADMIN'
    return {
      isAdmin: role === "ADMIN",
      canSeeAdminMenu: role === "ADMIN",
    };
  }, [user]);

  // 사용자 재검증 
  const refreshUser = useCallback(async () => {

    setUserLoading(true);
    setUserError(null);

    localStorage.getItem("auth.session");

    try {
      const data = await fetchMe();

      // data가 { me: {...} }일 수도 있고 {...}일 수도 있으니 방어
      const nextUser = data;
      console.log("nextUser :: " + JSON.stringify(nextUser));

      setUser(nextUser || null);

      // getUser();

      // 캐시 업데이트(토큰 저장 X, me만 저장)
      if (nextUser) {
        setSession(nextUser);
      } else { 
        clearSession();
      }
    } catch (e) {
      // 인증이 깨진 경우(401 등)라면 me를 비우고 로그인으로 보낼 수 있음
      setUser(null);
      clearSession();
      setUserError(e);

      // 여기서 바로 navigate("/login")하는 정책은 선택.
      // 이미 너희는 AuthSessionExpiredScreen도 있으니 거기로 보내도 됨.
      // 일단은 현 화면에서 계속 못 쓰게 하려면 아래처럼 처리:
      // navigate("/auth/session-expired", { replace: true });

      // "현재 화면이 /login 등 auth 화면이 아닌데 인증이 깨졌다면"
      if (!location.pathname.startsWith("/login") && !location.pathname.startsWith("/start") && !location.pathname.startsWith("/auth/")) {
        navigate("/auth/session-expired", { replace: true });
      }
    } finally {
      setUserLoading(false);
    }
  }, [navigate, location.pathname]);
  
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);    

  /** 설정/카테고리 등 “앱 기본 데이터” 갱신 */
  const refreshBootstrap = useCallback(async () => {
    setBootstrapLoading(true);
    setBootstrapError(null);

    try {
      const data = await fetchBootstrap();
      setBootstrap(data);
    } catch (e) {
      setBootstrap(null);
      setBootstrapError(e);
    } finally {
      setBootstrapLoading(false);
    }
  }, []);

  // AppShell 진입 시: 1) 사용자 먼저 확정
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // 사용자 확정 후(로그인 상태일 때만): 2) 기본 데이터 로드
  useEffect(() => {
    if (!user) {
      setBootstrap(null);
      setBootstrapLoading(false);
      return;
    }
    refreshBootstrap();
  }, [user, refreshBootstrap]);

  return (
    <div className="app-shell">
      {/* Header에서도 me를 쓰고 싶으면 props로 내려주면 됨 */}
      <Header user={user} userLoading={userLoading} userError={userError} onRefreshUser={refreshUser}
        permissions={permissions} bootstrap={bootstrap} bootstrapLoading={bootstrapLoading} bootstrapError={bootstrapError} onRefreshBootstrap={refreshBootstrap}/>

      <div className="app-shell__body" style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--tf-bg)', color: 'var(--tf-text)' }}>
        {!isMobile && <Sidebar  user={user} userLoading={userLoading} userError={userError} onRefreshUser={refreshUser}
        permissions={permissions} bootstrap={bootstrap} bootstrapLoading={bootstrapLoading} bootstrapError={bootstrapError} onRefreshBootstrap={refreshBootstrap}/>}

        <main className="app-shell__main">
          {/* 자식 화면(HomeDashboardScreen 포함)이 me를 꺼내 쓸 수 있게 Outlet context로 전달 */}
          <Outlet context={{ user, userLoading, userError, refreshUser, permissions, bootstrap, bootstrapLoading, bootstrapError, refreshBootstrap }} />
        </main>
      </div>

      <QuickMenu />

      {isMobile && <MobileBottomNav />}
    </div>
  );
}
