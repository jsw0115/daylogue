// FILE: src/main/frontend/src/screens/settings/SettingsLayout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User, Settings, Palette, Bell, Shield,
  Users, Briefcase, Folder, ChevronRight,
  Crown, LogOut, Monitor, Camera
} from "lucide-react";

import "../../styles/screens/settings.css";
import { safeStorage } from "../../shared/utils/safeStorage";
import AdminOnly from "../../components/common/AdminOnly";
import { useShareUsers } from "../../shared/hooks/useShareUsers";
import { notifySessionChanged } from "../../shared/hooks/useIsAdmin";
import { loadWorkReportMaster, WORK_REPORT_MASTER_EVENT } from "../../shared/hooks/useWorkReportMaster";

const DEFAULT_PROFILE = { name: "홍길동", email: "user@example.com" };

export const SettingsSidebar = ({ activePath }) => {
  const nav = useNavigate();
  const [isAdmin, setIsAdmin] = useState(!!safeStorage.getJSON("session.isAdmin", false));

  // profile
  const profile = safeStorage.getJSON("profile", { ...DEFAULT_PROFILE, bio: "", avatar: null });

  // share users
  const { users: shareUsers } = useShareUsers();

  // work report master
  const [workMasterPreview, setWorkMasterPreview] = useState(() =>
    loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] })
  );

  // 다른 화면에서 저장해도(이벤트) preview 갱신
  useEffect(() => {
    const on = () => setWorkMasterPreview(loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] }));
    window.addEventListener(WORK_REPORT_MASTER_EVENT, on);
    return () => window.removeEventListener(WORK_REPORT_MASTER_EVENT, on);
  }, []);

  // 메뉴 아이템 렌더링 헬퍼
  const MenuLink = ({ icon: Icon, title, desc, to, onClick, badge }) => {
    const isActive = to && activePath === to;
    return (
      <div
        className={`settings-menu-item ${isActive ? "active" : ""}`}
        onClick={onClick ? onClick : () => to && nav(to)}
        role="button"
        tabIndex={0}
      >
        <div className="settings-menu-item__icon">
          <Icon size={20} />
        </div>
        <div className="settings-menu-item__content">
          <div className="settings-menu-item__title">
            {title}
            {badge && <span className="settings-badge">{badge}</span>}
          </div>
          {desc && <div className="settings-menu-item__desc">{desc}</div>}
        </div>
        <div className="settings-menu-item__arrow">
          <ChevronRight size={16} />
        </div>
      </div>
    );
  };

  return (
    <div className="settings-sidebar-col">
      {/* 1. 프로필 카드 */}
      <section className="settings-profile-card" onClick={() => nav("/settings/profile")}>
        <div className="settings-profile-card__avatar">
          {profile.avatar ? (
            <img src={profile.avatar} alt="profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <User size={32} />
          )}
        </div>
        <div className="settings-profile-card__info">
          <div className="settings-profile-card__name">
            {profile.name}
            {isAdmin && <span className="settings-badge settings-badge--admin">ADMIN</span>}
          </div>
          <div className="settings-profile-card__email">{profile.email}</div>
          {profile.bio && <div className="text-muted font-small mt-1">{profile.bio}</div>}
        </div>
        <div className="settings-profile-card__action">
          <button className="btn btn--sm btn--ghost">편집</button>
        </div>
      </section>

      {/* 2. 앱 설정 그룹 */}
      <section className="settings-group">
        <h3 className="settings-group__title">앱 설정</h3>
        <div className="settings-menu">
          <MenuLink
            icon={Settings}
            title="기본 환경"
            desc="시간관리 모드(J/P), 시작 화면, 날짜 포맷"
            to="/settings/general"
          />
          <MenuLink
            icon={Palette}
            title="테마 및 스타일"
            desc="다크 모드, 포인트 컬러, 스티커 설정"
            to="/settings/theme"
          />
          <MenuLink
            icon={Bell}
            title="알림"
            desc="푸시, 이메일, 방해금지 시간(DND)"
            to="/settings/notifications"
          />
        </div>
      </section>

      {/* 3. 데이터 및 관리 그룹 */}
      <section className="settings-group">
        <h3 className="settings-group__title">데이터 및 관리</h3>
        <div className="settings-menu">
          <MenuLink
            icon={Folder}
            title="카테고리 설정"
            desc="일정/할 일 분류를 위한 색상 및 아이콘 관리"
            to="/settings/categories"
          />
          <MenuLink
            icon={Briefcase}
            title="업무보고 마스터"
            desc="프로젝트, 업무 유형, 하위 카테고리 관리"
            to="/settings/work-master"
            badge={workMasterPreview.projects.length > 0 ? "사용중" : ""}
          />
          <MenuLink
            icon={Users}
            title="공유 사용자 (주소록)"
            desc={`일정 공유 대상 관리 (${shareUsers.length}명)`}
            to="/settings/share-users"
          />
        </div>
      </section>

      {/* 4. 계정 및 보안 */}
      <section className="settings-group">
        <h3 className="settings-group__title">계정</h3>
        <div className="settings-menu">
          <MenuLink
            icon={Shield}
            title="보안 및 로그인"
            desc="비밀번호 변경, 소셜 로그인 연동, 기기 관리"
            to="/settings/security"
          />

          {/* 관리자 모드 토글 (개발/데모용) */}
          <div className="settings-menu-item">
            <div className="settings-menu-item__icon">
              <Crown size={20} className={isAdmin ? "text-primary" : "text-muted"} />
            </div>
            <div className="settings-menu-item__content">
              <div className="settings-menu-item__title">관리자 모드</div>
              <div className="settings-menu-item__desc">
                {isAdmin ? "현재 관리자 권한이 활성화되어 있습니다." : "관리자 기능을 활성화합니다."}
              </div>
            </div>
            <div className="settings-menu-item__action">
              <button
                type="button"
                className={"btn btn--sm " + (isAdmin ? "btn--primary" : "btn--secondary")}
                onClick={() => {
                  const next = !isAdmin;
                  setIsAdmin(next);
                  safeStorage.setJSON("session.isAdmin", next);
                  notifySessionChanged();
                }}
              >
                {isAdmin ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <AdminOnly>
        <section className="settings-group">
          <h3 className="settings-group__title">시스템 관리</h3>
          <div className="settings-menu">
            <MenuLink
              icon={Monitor}
              title="관리자 대시보드"
              desc="시스템 설정 및 전체 사용자 관리"
              to="/admin"
            />
          </div>
        </section>
      </AdminOnly>

      <div className="settings-logout-area">
        <button type="button" className="btn btn--ghost text-danger" onClick={() => alert("로그아웃 처리")}>
          <LogOut size={16} style={{ marginRight: 8 }} />
          로그아웃
        </button>
        <div className="settings-version">
          Daylogue v1.0.0
        </div>
      </div>
    </div>
  );
};

export const SettingsLayout = ({ children, title, description }) => {
  const location = useLocation();
  const isRoot = location.pathname === "/settings";

  return (
    <div className="screen settings-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">설정</h1>
          <p className="text-muted font-small">앱 환경 설정 및 계정 관리</p>
        </div>
      </div>

      <div className={`settings-layout ${!isRoot ? "settings-layout--sub" : ""}`}>
        <SettingsSidebar activePath={location.pathname} />

        {/* PC에서는 항상 보이고, 모바일에서는 Root가 아닐 때만 보임 */}
        <div className="settings-content-area">
          {children ? (
            <>
              <div className="settings-content-header">
                <h2 className="settings-content-title">{title}</h2>
                {description && <p className="text-muted font-small">{description}</p>}
              </div>
              {children}
            </>
          ) : (
            <div className="text-muted" style={{ padding: 40, textAlign: "center" }}>
              설정 메뉴를 선택해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};