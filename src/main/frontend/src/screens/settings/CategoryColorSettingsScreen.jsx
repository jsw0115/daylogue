// src/main/frontend/src/screens/settings/CategoryColorSettingsScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import { useResponsiveLayout } from "../../shared/hooks/useResponsiveLayout";

const defaultCategories = [
  { id: "study", name: "공부", color: "#4F8BFF", icon: "📚" },
  { id: "work", name: "업무", color: "#3B5BDB", icon: "💼" },
  { id: "health", name: "건강/운동", color: "#22C55E", icon: "💪" },
  { id: "family", name: "가족/연인", color: "#FB7185", icon: "❤️" },
  { id: "friends", name: "친구/약속", color: "#FB923C", icon: "🎉" },
  { id: "rest", name: "휴식/취미", color: "#14B8A6", icon: "🎧" },
  { id: "etc", name: "기타", color: "#9CA3AF", icon: "✨" },
];

const icons = ["📚", "💼", "💪", "❤️", "🎉", "🎧", "✨", "📝", "🌱"];

function CategoryColorSettingsScreen() {
  const viewport = useResponsiveLayout();
  const [categories, setCategories] = useState(defaultCategories);
  const [iconPickerFor, setIconPickerFor] = useState(null);

  const updateCategory = (id, field, value) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  return (
    <AppShell title="카테고리 색/아이콘 설정">
      <div
        className={`screen screen--category-settings screen--${viewport}`}
      >
        <header className="screen-header">
          <div className="screen-header__center">
            <h2>카테고리 스타일</h2>
          </div>
        </header>

        <section className="category-settings">
          <table className="category-table">
            <thead>
              <tr>
                <th>카테고리</th>
                <th>색상</th>
                <th>아이콘/이모지</th>
                <th>미리보기</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>
                    <input
                      type="color"
                      value={c.color}
                      onChange={(e) =>
                        updateCategory(c.id, "color", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="emoji-button"
                      onClick={() =>
                        setIconPickerFor(
                          iconPickerFor === c.id ? null : c.id
                        )
                      }
                    >
                      {c.icon}
                    </button>
                  </td>
                  <td>
                    <span
                      className="category-preview-chip"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.icon} {c.name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {iconPickerFor && (
            <div className="icon-picker">
              <h4>아이콘 선택</h4>
              <div className="icon-picker__grid">
                {icons.map((ic) => (
                  <button
                    key={ic}
                    className="emoji-button"
                    onClick={() => {
                      updateCategory(iconPickerFor, "icon", ic);
                      setIconPickerFor(null);
                    }}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="category-preview">
          <h3>앱 미리보기</h3>
          <div className="preview-row">
            {categories.map((c) => (
              <span
                key={c.id}
                className="category-preview-chip"
                style={{ backgroundColor: c.color }}
              >
                {c.icon} {c.name}
              </span>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default CategoryColorSettingsScreen;
