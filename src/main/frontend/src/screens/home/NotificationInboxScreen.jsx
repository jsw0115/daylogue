// FILE: src/main/frontend/src/screens/home/NotificationInboxScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";

/**
 * HOME-002-F01: 알림 목록 조회
 * HOME-002-F02: 알림 처리(읽음, 삭제, 수락/거절 등)
 * EVT-007-F01, SHARE-001-F01 등과 연계될 인박스 기본 UI
 */

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "event-invite",
    title: "스터디 모임 일정 초대",
    message: "12/10(수) 20:00 · 온라인 스터디에 초대되었습니다.",
    createdAt: "5분 전",
    actions: ["수락", "거절"],
  },
  {
    id: 2,
    type: "friend-request",
    title: "친구 요청",
    message: "친구 A 님이 친구로 추가를 요청했습니다.",
    createdAt: "1시간 전",
    actions: ["수락", "거절"],
  },
  {
    id: 3,
    type: "system",
    title: "이번 주 갓생 리포트가 준비되었어요",
    message: "이번 주 타임바, 루틴, 포커스 기록을 기반으로 리포트를 만들었어요.",
    createdAt: "어제",
    actions: ["리포트 보기"],
  },
];

function NotificationInboxScreen() {
  const handleAction = (notificationId, action) => {
    // TODO: HOME-002-F02 실제 알림 처리 API 연동
    // eslint-disable-next-line no-console
    console.log("notification action", notificationId, action);
  };

  return (
    <PageContainer
      screenId="HOME-002"
      title="알림 / 인박스"
      subtitle="일정 초대, 친구/그룹 요청, 시스템 알림을 한 곳에서 관리합니다."
    >
      <div className="screen notification-inbox-screen">
        <div className="notification-inbox-header">
          <Button type="button" size="sm" variant="ghost">
            모두 읽음 처리
          </Button>
        </div>

        <ul className="notification-list">
          {MOCK_NOTIFICATIONS.map((item) => (
            <li key={item.id} className="notification-item">
              <div className="notification-item__main">
                <div className="notification-item__title-row">
                  <span className="notification-item__title">
                    {item.title}
                  </span>
                  <span className="notification-item__time">
                    {item.createdAt}
                  </span>
                </div>
                <p className="notification-item__message">{item.message}</p>
              </div>

              <div className="notification-item__actions">
                {item.actions.map((action) => (
                  <Button
                    key={action}
                    type="button"
                    size="sm"
                    variant={action === "거절" ? "ghost" : "primary"}
                    onClick={() => handleAction(item.id, action)}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
}

export default NotificationInboxScreen;
