// FILE: src/main/frontend/src/screens/auth/AuthSessionExpiredScreen.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../../shared/ui/auth/AuthShell";
import Button from "../../components/common/Button";
import Icon from "../../shared/ui/Icon";
import safeStorage from "../../shared/utils/safeStorage";

export default function AuthSessionExpiredScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // 세션 만료 전 접근하려던 경로
  const from = location?.state?.from || "/plan/daily";

  const goLogin = () => {
    // (권장) 만료 시점에서 세션을 확실히 비움
    safeStorage.removeItem("auth.session");

    // 라우트는 프로젝트 기준으로 통일 필요:
    // - 너가 기존에 /login 쓰고 있으니 /login으로 보냄
    // - 만약 라우터가 /auth/login이면 여기만 바꾸면 됨
    navigate("/login", { replace: true, state: { from } });
  };

  const goHome = () => {
    safeStorage.removeItem("auth.session");
    navigate("/", { replace: true });
  };

  return (
    <AuthShell
      badge="Session expired"
      footer={
        <div className="auth-footer__note">
          보안상 로그인이 필요합니다. 문제가 반복되면 새로고침 후 다시 시도해 주세요.
        </div>
      }
    >
      <div className="auth-title">세션 만료</div>
      <div className="auth-subtitle">보안을 위해 다시 로그인해 주세요.</div>

      <div className="auth-alert" style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 4 }}>다시 로그인 필요</div>
        <div style={{ lineHeight: 1.5 }}>
          로그인 정보가 만료되었거나 다른 기기에서 로그아웃되었을 수 있어요.
          <br />
          <span className="auth-session__from">이전 경로: {from}</span>
        </div>
      </div>

      <div className="auth-session__actions">
        <Button
          variant="primary"
          className="btn--full"
          icon={<Icon name="arrowRight" size={18} />}
          iconPosition="right"
          onClick={goLogin}
        >
          로그인으로 이동
        </Button>

        <Button variant="ghost" className="btn--full" onClick={goHome}>
          홈으로 이동
        </Button>
      </div>

      <div className="auth-session__tip">
        <div className="auth-session__tipTitle">팁</div>
        <div className="auth-session__tipText">
          공용 기기에서는 사용 후 로그아웃을 권장합니다.
        </div>
      </div>
    </AuthShell>
  );
}
