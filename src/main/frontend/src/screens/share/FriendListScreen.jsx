// FILE: src/main/frontend/src/screens/share/FriendListScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";
import TextInput from "../../components/common/TextInput";

const MOCK_FRIENDS = [
  { id: 1, name: "친구 A", status: "accepted", note: "매일 공부 타임 공유" },
  { id: 2, name: "친구 B", status: "pending", note: "초대 보냄 · 대기 중" },
  { id: 3, name: "친구 C", status: "blocked", note: "차단됨" },
];

function FriendListScreen() {
  return (
    <PageContainer
      screenId="SHARE-001"
      title="친구 / 지인 목록"
      subtitle="친구 검색/초대/삭제 및 요청 상태를 관리합니다."
    >
      <div className="screen share-screen share-screen--friends">
        <div className="share-card">
          {/* 상단: 초대 + 검색 */}
          <div className="share-card__header">
            <div>
              <h3 className="share-card__title">친구 관리</h3>
              <p className="share-card__subtitle">
                함께 플래너를 쓰고 싶은 사람을 초대하거나, 기존 친구를 관리할 수
                있어요.
              </p>
            </div>
            <Button type="button" size="sm" variant="primary">
              친구 초대
            </Button>
          </div>

          <div className="share-friends-toolbar">
            <div className="share-friends-search">
              <TextInput
                label="친구 검색"
                placeholder="닉네임 또는 이메일로 검색"
              />
            </div>
            <div className="share-friends-filter">
              <button className="share-segment share-segment--active">
                전체
              </button>
              <button className="share-segment">요청 대기</button>
              <button className="share-segment">친구</button>
              <button className="share-segment">차단</button>
            </div>
          </div>

          {/* 친구 리스트 */}
          <ul className="share-friend-list">
            {MOCK_FRIENDS.map((f) => (
              <li key={f.id} className="share-friend-item">
                <div className="share-friend-item__avatar">
                  <span>{f.name.charAt(0)}</span>
                </div>
                <div className="share-friend-item__info">
                  <div className="share-friend-item__name-row">
                    <span className="share-friend-item__name">{f.name}</span>
                    <span
                      className={`share-status-pill share-status-pill--${f.status}`}
                    >
                      {f.status === "accepted"
                        ? "친구"
                        : f.status === "pending"
                        ? "요청 대기"
                        : "차단됨"}
                    </span>
                  </div>
                  <div className="share-friend-item__meta">
                    <span className="share-friend-item__note">{f.note}</span>
                  </div>
                </div>
                <div className="share-friend-item__actions">
                  {f.status === "pending" && (
                    <>
                      <Button type="button" size="xs" variant="primary">
                        수락
                      </Button>
                      <Button type="button" size="xs" variant="ghost">
                        거절
                      </Button>
                    </>
                  )}
                  {f.status === "accepted" && (
                    <>
                      <Button type="button" size="xs" variant="ghost">
                        프로필
                      </Button>
                      <Button type="button" size="xs" variant="ghost">
                        삭제
                      </Button>
                    </>
                  )}
                  {f.status === "blocked" && (
                    <Button type="button" size="xs" variant="ghost">
                      차단 해제
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}

export default FriendListScreen;
