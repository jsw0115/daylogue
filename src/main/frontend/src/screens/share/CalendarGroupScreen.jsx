// FILE: src/main/frontend/src/screens/share/CalendarGroupScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";
import TextInput from "../../components/common/TextInput";

const MOCK_GROUPS = [
  { id: 1, name: "가족 캘린더", members: 3, role: "관리자" },
  { id: 2, name: "스터디 그룹", members: 5, role: "멤버" },
];

function CalendarGroupScreen() {
  return (
    <PageContainer
      screenId="SHARE-002"
      title="캘린더 그룹 관리"
      subtitle="가족/스터디/팀 그룹 캘린더를 생성하고 멤버를 관리합니다."
    >
      <div className="screen share-screen share-screen--groups">
        <div className="share-card">
          <div className="share-card__header">
            <div>
              <h3 className="share-card__title">그룹 캘린더</h3>
              <p className="share-card__subtitle">
                함께 쓰는 캘린더를 만들어 일정과 할 일을 공유해 보세요.
              </p>
            </div>
            <Button type="button" size="sm" variant="primary">
              새 그룹 만들기
            </Button>
          </div>

          <div className="share-groups-toolbar">
            <TextInput
              label="그룹 검색"
              placeholder="그룹 이름으로 검색"
            />
          </div>

          <ul className="share-group-list">
            {MOCK_GROUPS.map((g) => (
              <li key={g.id} className="share-group-item">
                <div className="share-group-item__main">
                  <div className="share-group-item__name">{g.name}</div>
                  <div className="share-group-item__meta">
                    <span>{g.members}명 참여 중</span>
                    <span className="share-group-item__role">
                      내 역할: {g.role}
                    </span>
                  </div>
                </div>
                <div className="share-group-item__actions">
                  <Button type="button" size="xs" variant="ghost">
                    멤버 관리
                  </Button>
                  <Button type="button" size="xs" variant="ghost">
                    설정
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}

export default CalendarGroupScreen;
