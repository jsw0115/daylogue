// src/main/frontend/src/screens/settings/ThemeStickerSettingsScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/settings.css";

const themes = [
  { id: "light", label: "라이트" },
  { id: "dark", label: "다크" },
  { id: "pastel", label: "파스텔" },
];

const stickerPacks = [
  { id: "basic", label: "기본" },
  { id: "study", label: "공부모드" },
  { id: "cute", label: "귀여운 스티커" },
];

function ThemeStickerSettingsScreen() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedSticker, setSelectedSticker] = useState("basic");

  return (
    <AppShell title="테마 / 스티커">
      <div className="screen settings-theme-sticker-screen">
        <header className="screen-header">
          <h2>테마 & 스티커 설정</h2>
        </header>

        <section className="settings-section">
          <h3>앱 테마</h3>
          <div className="theme-grid">
            {themes.map((t) => (
              <button key={t.id}
                type="button"
                className={
                  selectedTheme === t.id
                    ? "theme-card theme-card--active"
                    : "theme-card"
                }
                onClick={() => setSelectedTheme(t.id)}
              >
                <span className="theme-card__preview" />
                <span className="theme-card__label">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h3>스티커 팩</h3>
          <div className="sticker-grid">
            {stickerPacks.map((s) => (
              <button key={s.id}
                type="button"
                className={
                  selectedSticker === s.id
                    ? "sticker-card sticker-card--active"
                    : "sticker-card"
                }
                onClick={() => setSelectedSticker(s.id)}
              >
                <span className="sticker-card__preview">✨</span>
                <span className="sticker-card__label">{s.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default ThemeStickerSettingsScreen;

