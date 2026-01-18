// FILE: src/main/frontend/src/screens/auth/AuthOAuthCallbackScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";

function AuthOAuthCallbackScreen() {
  const navigate = useNavigate();
  const { provider } = useParams(); // google|apple|kakao 등
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("loading"); // loading|success|error
  const [message, setMessage] = useState("");

  const query = useMemo(() => {
    return {
      code: searchParams.get("code"),
      state: searchParams.get("state"),
      error: searchParams.get("error"),
      errorDescription: searchParams.get("error_description"),
    };
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      // 소셜 제공자에서 에러로 돌아온 경우
      if (query.error) {
        if (!mounted) return;
        setStatus("error");
        setMessage(query.errorDescription || "소셜 로그인에 실패했습니다.");
        return;
      }

      if (!query.code) {
        if (!mounted) return;
        setStatus("error");
        setMessage("인증 코드가 없습니다. 다시 시도해 주세요.");
        return;
      }

      try {
        // TODO: AUTH-015-F01 OAuth 콜백 코드 교환 API
        // POST /api/auth/oauth/callback
        // { provider, code, state }
        //
        // const res = await fetch("/api/auth/oauth/callback", {...})
        // if (!res.ok) throw new Error("fail")
        //
        // 성공 시: accessToken/refreshToken 저장 + 사용자 프로필 조회
        // 온보딩 필요 여부에 따라 /auth/onboarding 혹은 /plan/daily 로 이동

        if (!mounted) return;
        setStatus("success");
        setMessage("로그인 처리 중입니다.");

        // (예시) 서버가 onboardingRequired를 내려준다면 분기
        // const onboardingRequired = data.onboardingRequired;
        const onboardingRequired = false;

        navigate(onboardingRequired ? "/auth/onboarding" : "/plan/daily", { replace: true });
      } catch {
        if (!mounted) return;
        setStatus("error");
        setMessage("소셜 로그인 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [navigate, provider, query.code, query.error, query.errorDescription, query.state]);

  const title =
    status === "loading" ? "로그인 처리 중" : status === "success" ? "로그인 성공" : "로그인 실패";

  return (
    <PageContainer
      screenId="AUTH-015"
      title={title}
      subtitle={provider ? `${String(provider).toUpperCase()} 계정으로 로그인 처리합니다.` : "소셜 로그인 처리 중입니다."}
    >
      <div className="screen auth-screen">
        <div className="auth-layout">
          <section className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">{title}</h2>
              <p className="auth-card__subtitle">
                {status === "loading" ? "잠시만 기다려 주세요." : message}
              </p>
            </header>

            {status === "error" ? (
              <div className="auth-form">
                <Button type="button" variant="primary" fullWidth onClick={() => navigate("/auth/login")}>
                  로그인 화면으로
                </Button>
                <Button type="button" variant="ghost" fullWidth onClick={() => navigate("/auth/social-link")}>
                  소셜 연동 관리로
                </Button>
              </div>
            ) : null}
          </section>

          <aside className="auth-side">
            <h3 className="auth-side__title">안내</h3>
            <p className="auth-side__text">
              브라우저 설정/차단 확장 프로그램에 의해 콜백이 실패할 수 있습니다.
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthOAuthCallbackScreen;
