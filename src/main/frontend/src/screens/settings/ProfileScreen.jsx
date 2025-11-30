import React from "react";

function ProfileScreen() {
  return (
    <div className="screen settings-screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">개인 설정</h1>
          <p className="screen-header__subtitle">
            프로필과 기본 시작 화면을 설정해요.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="dashboard-card settings-section">
          <div className="settings-row">
            <div className="profile-avatar">D</div>
            <div>
              <div style={{ fontWeight: 600 }}>DATA</div>
              <div className="settings-row__desc">관리자 · 기본 계정</div>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row__label">이름</div>
            <div className="settings-row__control">
              <input className="field__control" defaultValue="DATA" />
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row__label">시작 화면</div>
            <div className="settings-row__control">
              <select className="field__control" defaultValue="home">
                <option value="home">홈(오늘 요약)</option>
                <option value="daily">일간 플래너</option>
                <option value="weekly">주간 플래너</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfileScreen;
