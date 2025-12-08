// FILE: src/main/frontend/src/screens/settings/NotificationSettingsScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import Checkbox from "../../components/common/Checkbox";
import Button from "../../components/common/Button";
import TextInput from "../../components/common/TextInput";

function NotificationSettingsScreen() {
  return (
    <PageContainer
      screenId="SET-004"
      title="알림 설정"
      subtitle="푸시/이메일/앱 내 알림과 조용한 시간을 관리합니다."
    >
      <div className="screen settings-screen settings-screen--notification">
        <div className="settings-card">
          <header className="settings-card__header">
            <h3 className="settings-card__title">알림 종류</h3>
            <p className="settings-card__subtitle">
              중요한 알림만 받도록 조절하면 집중에 도움이 됩니다.
            </p>
          </header>

          <form className="settings-form">
            <Checkbox label="푸시 알림" />
            <Checkbox label="이메일 알림" />
            <Checkbox label="앱 내 알림 (배지/인박스)" />

            <div className="settings-divider" />

            <h4 className="settings-section-title">추천 알림 프리셋</h4>
            <p className="settings-help-text">
              J 모드: 전날 저녁 계획 알림 / P 모드: 하루 마감 회고 알림 등을
              자동으로 설정합니다.
            </p>

            <div className="settings-form__group settings-form__group--inline">
              <Checkbox label="전날 저녁 오늘 할 일 계획 알림" />
              <Checkbox label="자기 전 하루 회고 알림" />
            </div>

            <div className="settings-divider" />

            <h4 className="settings-section-title">조용한 시간 (Do Not Disturb)</h4>
            <p className="settings-help-text">
              지정한 시간 동안은 포커스/위급 알림만 받을 수 있습니다.
            </p>

            <div className="settings-dnd-row">
              <label className="field settings-dnd-field">
                <span className="field__label">시작</span>
                <input
                  type="time"
                  className="field__control"
                  defaultValue="22:00"
                />
              </label>
              <label className="field settings-dnd-field">
                <span className="field__label">종료</span>
                <input
                  type="time"
                  className="field__control"
                  defaultValue="07:00"
                />
              </label>
            </div>

            <TextInput
              label="예외 알림 키워드"
              placeholder="예) 중요한 일정, 시험, 미팅"
            />

            <div className="settings-form__actions">
              <Button type="button" variant="primary">
                알림 설정 저장
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}

export default NotificationSettingsScreen;
