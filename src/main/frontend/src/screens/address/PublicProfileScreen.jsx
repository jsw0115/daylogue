import React from "react";
import { UserPlus, Copy, Download } from "lucide-react";
import TimeFlowLogo from "../../shared/ui/TimeFlowLogo";
import "../../styles/timeflow-ui.css";
import "./PublicProfileScreen.css"; // 아래 CSS 참조

export default function PublicProfileScreen() {
  // 실제로는 URL 파라미터로 user ID를 받아 API 호출
  const mockUser = {
    name: "강민지",
    email: "minji@example.com",
    bio: "오늘도 갓생 사는 중 🔥 | UI/UX 디자이너",
    tags: ["#디자인", "#운동", "#미라클모닝"],
    avatar: null
  };

  const handleAddToContacts = () => {
    // 1. 앱이 설치되어 있으면 앱으로 이동 (Deep Link)
    // 2. 웹이면 로그인 페이지 이동 후 자동 추가 로직
    alert(`'${mockUser.name}'님을 주소록에 추가합니다.`);
  };

  return (
    <div className="public-profile-screen">
      <div className="public-card">
        {/* Brand Header */}
        <div className="public-brand">
          <TimeFlowLogo size={32} />
          <span className="brand-text">TimeFlow</span>
        </div>

        {/* Profile Info */}
        <div className="public-avatar-area">
          <div className="public-avatar">
            {mockUser.avatar ? <img src={mockUser.avatar} alt="profile" /> : mockUser.name[0]}
          </div>
        </div>

        <h1 className="public-name">{mockUser.name}</h1>
        <p className="public-email">{mockUser.email}</p>
        <p className="public-bio">{mockUser.bio}</p>

        <div className="public-tags">
          {mockUser.tags.map(tag => <span key={tag} className="tf-chip">{tag}</span>)}
        </div>

        {/* Actions */}
        <div className="public-actions">
          <button className="tf-btn tf-btn--primary full-width" onClick={handleAddToContacts}>
            <UserPlus size={18} style={{ marginRight: 8 }} />
            주소록에 추가하기
          </button>
          
          <div className="secondary-actions">
            <button className="tf-btn icon-only" title="링크 복사">
              <Copy size={18} />
            </button>
            <button className="tf-btn icon-only" title="연락처 저장 (vCard)">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="public-footer">
          TimeFlow에서 {mockUser.name}님과 함께<br/>시간을 관리해보세요.
        </div>
      </div>
    </div>
  );
}