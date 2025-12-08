// FILE: src/main/frontend/src/screens/settings/SecuritySettingsScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";

function SecuritySettingsScreen() {
  return (
    <PageContainer
      screenId="SET-005"
      title="보안 / 로그인 설정"
      subtitle="비밀번호와 소셜 로그인, 로그인 기기를 관리합니다."
    >
      <div className="screen settings-screen settings-screen--security">
        {/* 비밀번호 변경 */}
        <div className="settings-card settings-card--password">
          <header className="settings-card__header">
            <h3 className="settings-card__title">비밀번호 변경</h3>
            <p className="settings-card__subtitle">
              정기적으로 비밀번호를 변경하면 계정을 더 안전하게 지킬 수
              있습니다.
            </p>
          </header>

          <form className="settings-form">
            <TextInput label="현재 비밀번호" type="password" />
            <TextInput label="새 비밀번호" type="password" />
            <TextInput label="새 비밀번호 확인" type="password" />

            <div className="settings-form__actions">
              <Button type="button" variant="primary">
                비밀번호 변경
              </Button>
            </div>
          </form>
        </div>

        {/* 소셜 로그인 연동 */}
        <div className="settings-card settings-card--social">
          <header className="settings-card__header">
            <h3 className="settings-card__title">소셜 로그인 연동</h3>
            <p className="settings-card__subtitle">
              Google / Apple / Kakao 계정을 연결해 더 편하게 로그인합니다.
            </p>
          </header>

          <div className="settings-social-list">
            <div className="settings-social-item">
              <div className="settings-social-item__info">
                <span className="settings-social-item__name">Google</span>
                <span className="settings-social-item__status">
                  아직 연결되지 않음
                </span>
              </div>
              <Button type="button" size="sm" variant="ghost">
                연결하기
              </Button>
            </div>
            <div className="settings-social-item">
              <div className="settings-social-item__info">
                <span className="settings-social-item__name">Apple</span>
                <span className="settings-social-item__status">
                  아직 연결되지 않음
                </span>
              </div>
              <Button type="button" size="sm" variant="ghost">
                연결하기
              </Button>
            </div>
            <div className="settings-social-item">
              <div className="settings-social-item__info">
                <span className="settings-social-item__name">Kakao</span>
                <span className="settings-social-item__status">
                  demo@kakao.com 연결됨
                </span>
              </div>
              <Button type="button" size="sm" variant="ghost">
                연결 해제
              </Button>
            </div>
          </div>
        </div>

        {/* 로그인 기기 관리 */}
        <div className="settings-card settings-card--devices">
          <header className="settings-card__header">
            <h3 className="settings-card__title">로그인 기기 관리</h3>
            <p className="settings-card__subtitle">
              로그인된 기기 목록을 확인하고 필요 시 로그아웃할 수 있습니다.
            </p>
          </header>

          <ul className="settings-device-list">
            <li className="settings-device-item">
              <div className="settings-device-item__info">
                <div className="settings-device-item__name">
                  Chrome · Windows PC
                </div>
                <div className="settings-device-item__meta">
                  마지막 접속: 2025-12-06 19:20
                </div>
              </div>
              <Button type="button" size="sm" variant="ghost">
                이 기기
              </Button>
            </li>
            <li className="settings-device-item">
              <div className="settings-device-item__info">
                <div className="settings-device-item__name">
                  Safari · iPhone
                </div>
                <div className="settings-device-item__meta">
                  마지막 접속: 2025-12-05 23:10
                </div>
              </div>
              <Button type="button" size="sm" variant="ghost">
                로그아웃
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}

export default SecuritySettingsScreen;
