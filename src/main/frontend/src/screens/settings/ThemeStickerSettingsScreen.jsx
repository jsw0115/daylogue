// FILE: src/main/frontend/src/screens/settings/ThemeStickerSettingsScreen.jsx
import React from "react";
import { SettingsLayout } from "./SettingsLayout";
import { Button } from "../../components/ui/button";
import { 
  Smile, Flame, Coffee, Star, BookOpen, Activity, Leaf, Zap 
} from "lucide-react";
import { useTheme } from "../../shared/context/ThemeContext";

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
  const { theme: currentTheme, setTheme } = useTheme();

  return (
    <SettingsLayout
      title="테마 / 색상 / 스티커"
      description="앱의 분위기와 글자 크기 등을 나에게 맞게 커스터마이징합니다."
    >
        <div className="settings-form">
          <div className="settings-section">
          <div className="settings-section-title">테마 선택</div>

          <div className="settings-theme-grid">
            {THEME_PRESETS.map((t) => {
              const isActive = currentTheme === t.id;
              return (
                <div
                  key={t.id}
                  className={`settings-theme-card ${isActive ? "ring-2 ring-primary" : ""}`}
                  data-theme-id={t.id}
                >
                  <div className={`settings-theme-card__preview ${t.id === 'dark' ? 'bg-slate-900' : t.id === 'pastel' ? 'bg-[#FFFBF0]' : 'bg-white'}`} />
                  <div className="settings-theme-card__body">
                    <div className="settings-theme-card__name">
                      {t.name}
                    </div>
                    <div className="settings-theme-card__desc">
                      {t.description}
                    </div>
                  </div>
                  <div className="settings-theme-card__footer">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => setTheme(t.id)}
                    >
                      {isActive ? "사용 중" : "적용"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          </div>

          <hr className="settings-divider" />

          <div className="settings-section">
          <div className="settings-section-title">화면 스타일</div>
            <div className="field">
              <label className="field__label">글자 크기</label>
              <div className="flex items-center gap-4">
                <span className="text-xs">가</span>
                <input type="range" min="1" max="3" step="1" className="flex-1" defaultValue="2" />
                <span className="text-lg">가</span>
              </div>
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>작게</span><span>보통</span><span>크게</span>
              </div>
            </div>
          </div>

          <hr className="settings-divider" />

          <div className="settings-section">
          <div className="settings-section-title">스티커 / 이모지 (Lucide Icons)</div>

          <div className="settings-sticker-preview">
            <div className="settings-sticker-preview__row">
              <span className="settings-sticker-chip">
                <Smile size={16} style={{ marginRight: 6 }} /> 기분 좋음
              </span>
              <span className="settings-sticker-chip">
                <Flame size={16} style={{ marginRight: 6 }} /> 열공 모드
              </span>
              <span className="settings-sticker-chip">
                <Leaf size={16} style={{ marginRight: 6 }} /> 휴식
              </span>
              <span className="settings-sticker-chip">
                <Activity size={16} style={{ marginRight: 6 }} /> 루틴 성공
              </span>
            </div>
            <div className="settings-sticker-preview__row">
              <span className="settings-sticker-chip">
                <Star size={16} style={{ marginRight: 6 }} /> 중요
              </span>
              <span className="settings-sticker-chip">
                <Coffee size={16} style={{ marginRight: 6 }} /> 휴식 타임
              </span>
              <span className="settings-sticker-chip">
                <BookOpen size={16} style={{ marginRight: 6 }} /> 공부
              </span>
              <span className="settings-sticker-chip">
                <Zap size={16} style={{ marginRight: 6 }} /> 에너지
              </span>
            </div>
          </div>
          </div>

          <div className="settings-actions-right">
            <Button type="button" variant="default">
              테마 / 스티커 적용
            </Button>
          </div>
        </div>
    </SettingsLayout>
  );
}

export default ThemeStickerSettingsScreen;
