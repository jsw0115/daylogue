// src/screens/settings/ProfileScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";
import "../../styles/screens/settings.css";

function ProfileScreen() {
  return (
    <div className="screen settings-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">내 프로필</h2>
          <p className="screen-header__subtitle">
            계정 정보를 확인하고 닉네임, 프로필 이미지를 수정할 수 있어요.
          </p>
        </div>
      </header>

      <div className="settings-grid">
        <DashboardCard title="기본 정보">
          <div className="settings-section">
            <div className="settings-row">
              <div className="settings-row__label">프로필 이미지</div>
              <div className="settings-row__control">
                <div className="profile-avatar">😊</div>
                <Button className="btn--ghost">이미지 변경</Button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row__label">이메일</div>
              <div className="settings-row__control">
                <TextInput
                  value="user@example.com"
                  disabled
                  fullWidth
                />
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row__label">닉네임</div>
              <div className="settings-row__control">
                <TextInput
                  value="푸딩곰"
                  placeholder="표시할 닉네임을 입력하세요."
                  fullWidth
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, textAlign: "right" }}>
            <Button className="btn--primary">변경사항 저장</Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

export default ProfileScreen;
