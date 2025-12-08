// FILE: src/main/frontend/src/screens/auth/AuthSocialLinkScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";
import Checkbox from "../../components/common/Checkbox";

function AuthSocialLinkScreen() {
  // TODO: AUTH-004-F01 실제 소셜 연동 상태는 API로 받아오도록 교체
  const linked = {
    google: true,
    apple: false,
    kakao: false,
  };

  const handleLink = (provider) => {
    // TODO: 소셜 연동/해제 API 연결
    // eslint-disable-next-line no-console
    console.log("toggle social link:", provider);
  };

  return (
    <PageContainer
      screenId="AUTH-004"
      title="소셜 로그인 연동"
      subtitle="자주 사용하는 계정을 연결해 더 편하게 로그인할 수 있어요."
    >
      <div className="screen auth-screen">
        <div className="auth-layout">
          <section className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">연동된 계정 관리</h2>
              <p className="auth-card__subtitle">
                연결된 계정으로 로그인하거나, 더 이상 사용하지 않는 계정은
                해제할 수 있습니다.
              </p>
            </header>

            <div className="auth-social-list">
              <div className="auth-social-item">
                <div className="auth-social-item__info">
                  <span className="auth-social-item__provider">Google</span>
                  <span className="auth-social-item__desc">
                    Gmail, Google 캘린더와 함께 사용하는 경우 추천
                  </span>
                </div>
                <Checkbox
                  label={linked.google ? "연결됨" : "연결 안 됨"}
                  checked={linked.google}
                  onChange={() => handleLink("google")}
                />
              </div>

              <div className="auth-social-item">
                <div className="auth-social-item__info">
                  <span className="auth-social-item__provider">Apple</span>
                  <span className="auth-social-item__desc">
                    Apple ID로 로그인 및 iOS 기기 간 동기화에 유용
                  </span>
                </div>
                <Checkbox
                  label={linked.apple ? "연결됨" : "연결 안 됨"}
                  checked={linked.apple}
                  onChange={() => handleLink("apple")}
                />
              </div>

              <div className="auth-social-item">
                <div className="auth-social-item__info">
                  <span className="auth-social-item__provider">Kakao</span>
                  <span className="auth-social-item__desc">
                    카카오 계정과 친구 초대/공유 기능을 함께 쓰고 싶을 때
                  </span>
                </div>
                <Checkbox
                  label={linked.kakao ? "연결됨" : "연결 안 됨"}
                  checked={linked.kakao}
                  onChange={() => handleLink("kakao")}
                />
              </div>
            </div>

            <div className="auth-social-footer">
              <Button type="button" variant="primary">
                변경 사항 저장
              </Button>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthSocialLinkScreen;
