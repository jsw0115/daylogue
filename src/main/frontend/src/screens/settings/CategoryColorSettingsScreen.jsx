// FILE: src/main/frontend/src/screens/settings/CategoryColorSettingsScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";
import Button from "../../components/common/Button";

function CategoryColorSettingsScreen() {
  return (
    <PageContainer
      screenId="SET-006"
      title="카테고리 색 / 아이콘 설정"
      subtitle="플래너와 통계에서 사용할 카테고리 색상과 아이콘을 정합니다."
    >
      <div className="screen settings-screen settings-screen--category">
        <div className="settings-card settings-card--category">
          <header className="settings-card__header">
            <h3 className="settings-card__title">카테고리 목록</h3>
            <p className="settings-card__subtitle">
              색상을 바꾸면 모든 타임바·통계·캘린더에 즉시 반영됩니다.
            </p>
          </header>

          <div className="settings-category-table-wrapper">
            <table className="settings-category-table">
              <thead>
                <tr>
                  <th>카테고리</th>
                  <th>색상</th>
                  <th>아이콘 / 이모지</th>
                </tr>
              </thead>
              <tbody>
                {DEFAULT_CATEGORIES.map((cat) => (
                  <tr key={cat.id}>
                    <td className="settings-category-name-cell">
                      <span
                        className="settings-category-color-dot"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="settings-category-name">
                        {cat.name}
                      </span>
                    </td>
                    <td>
                      <input
                        type="color"
                        className="settings-category-color-input"
                        defaultValue={cat.color}
                      />
                    </td>
                    <td>
                      <span className="settings-category-icon">
                        {cat.icon || "□"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="settings-category-actions">
            <Button type="button" variant="ghost">
              카테고리 추가
            </Button>
            <Button type="button" variant="primary">
              변경 내용 저장
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default CategoryColorSettingsScreen;
