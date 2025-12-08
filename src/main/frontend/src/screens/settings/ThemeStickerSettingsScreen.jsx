// FILE: src/main/frontend/src/screens/settings/ThemeStickerSettingsScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";

const THEME_PRESETS = [
  {
    id: "light",
    name: "라이트 · 기본",
    description: "밝고 선명한 기본 테마",
  },
  {
    id: "dark",
    name: "다크 · 집중",
    description: "눈부심을 줄여 주는 다크 테마",
  },
  {
    id: "pastel",
    name: "파스텔 · 따뜻함",
    description: "부드러운 파스텔 색감의 감성 테마",
  },
];

function ThemeStickerSettingsScreen() {
  return (
    <PageContainer
      screenId="SET-003"
      title="테마 / 색상 / 스티커"
      subtitle="앱의 분위기를 나에게 맞게 커스터마이징합니다."
    >
      <div className="screen settings-screen settings-screen--theme">
        <div className="settings-card settings-card--theme">
          <header className="settings-card__header">
            <h3 className="settings-card__title">테마 선택</h3>
            <p className="settings-card__subtitle">
              실시간 미리보기를 보면서 테마를 골라 보세요.
            </p>
          </header>

          <div className="settings-theme-grid">
            {THEME_PRESETS.map((theme) => (
              <div
                key={theme.id}
                className="settings-theme-card"
                data-theme-id={theme.id}
              >
                <div className="settings-theme-card__preview" />
                <div className="settings-theme-card__body">
                  <div className="settings-theme-card__name">
                    {theme.name}
                  </div>
                  <div className="settings-theme-card__desc">
                    {theme.description}
                  </div>
                </div>
                <div className="settings-theme-card__footer">
                  <Button type="button" size="sm" variant="ghost">
                    적용
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-card settings-card--sticker">
          <header className="settings-card__header">
            <h3 className="settings-card__title">스티커 / 이모지</h3>
            <p className="settings-card__subtitle">
              다이어리와 타임바에 사용할 스티커 세트를 고릅니다.
            </p>
          </header>

          <div className="settings-sticker-preview">
            <div className="settings-sticker-preview__row">
              <span className="settings-sticker-chip">😊 기분 좋음</span>
              <span className="settings-sticker-chip">🔥 열공 모드</span>
              <span className="settings-sticker-chip">🌿 휴식</span>
              <span className="settings-sticker-chip">🏃 루틴 성공</span>
            </div>
            <div className="settings-sticker-preview__row">
              <span className="settings-sticker-chip">⭐ 중요</span>
              <span className="settings-sticker-chip">☕ 휴식 타임</span>
              <span className="settings-sticker-chip">📚 공부</span>
            </div>
          </div>

          <div className="settings-form__actions">
            <Button type="button" variant="primary">
              테마 / 스티커 적용
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default ThemeStickerSettingsScreen;
