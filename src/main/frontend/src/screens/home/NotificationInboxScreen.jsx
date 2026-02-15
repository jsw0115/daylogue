import React, { useState } from "react";
import PageContainer from "../../layout/PageContainer";
import { 
  Bell, Calendar, UserPlus, Check, X, 
  ChevronRight, Trash2, CheckCircle2 
} from "lucide-react";
import "../../styles/screens/notification.css"; // 아래 CSS 파일 참조

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "event-invite",
    title: "스터디 모임 일정 초대",
    message: "12/10(수) 20:00 · 온라인 스터디에 초대되었습니다.",
    createdAt: "5분 전",
    isRead: false,
    actions: [{ label: "수락", code: "ACCEPT", style: "primary" }, { label: "거절", code: "DECLINE", style: "ghost" }],
  },
  {
    id: 2,
    type: "friend-request",
    title: "친구 요청",
    message: "김개발 님이 친구로 추가를 요청했습니다.",
    createdAt: "1시간 전",
    isRead: false,
    actions: [{ label: "수락", code: "ACCEPT", style: "primary" }, { label: "거절", code: "DECLINE", style: "ghost" }],
  },
  {
    id: 3,
    type: "system",
    title: "이번 주 갓생 리포트가 준비되었어요",
    message: "지난주 타임바 기록을 분석했습니다. 확인해보세요!",
    createdAt: "어제",
    isRead: true, // 읽은 알림 예시
    actions: [{ label: "리포트 보기", code: "VIEW", style: "link" }],
  },
];

export default function NotificationInboxScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // 알림 삭제/처리 핸들러
  const handleAction = (id, actionCode) => {
    console.log(`Action: ${actionCode} on Noti: ${id}`);
    
    // 예시: 수락/거절 누르면 리스트에서 제거 (또는 상태 변경)
    if (actionCode === "ACCEPT" || actionCode === "DECLINE") {
      setNotifications(prev => prev.filter(n => n.id !== id));
      alert(`${actionCode === 'ACCEPT' ? '수락' : '거절'} 처리되었습니다.`);
    } else if (actionCode === "VIEW") {
      alert("리포트 화면으로 이동합니다. (구현 필요)");
    }
  };

  // 모두 읽음 처리
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // 개별 읽음 처리
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // 아이콘 렌더링 헬퍼
  const getIcon = (type) => {
    switch (type) {
      case "event-invite": return <Calendar size={20} className="noti-icon event" />;
      case "friend-request": return <UserPlus size={20} className="noti-icon friend" />;
      default: return <Bell size={20} className="noti-icon system" />;
    }
  };

  return (
    <PageContainer
      screenId="HOME-002"
      title="알림 센터"
      subtitle="새로운 소식과 요청을 확인하세요."
    >
      <div className="screen notification-screen">
        
        {/* Header Actions */}
        <div className="noti-header">
          <div className="noti-count">
            안 읽음 <span className="highlight">{notifications.filter(n => !n.isRead).length}</span>
          </div>
          {notifications.length > 0 && (
            <button className="text-btn" onClick={markAllRead}>
              <CheckCircle2 size={14} /> 모두 읽음
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="noti-list">
          {notifications.length === 0 ? (
            <div className="noti-empty">
              <Bell size={48} opacity={0.2} />
              <p>새로운 알림이 없습니다.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div 
                key={item.id} 
                className={`noti-item ${item.isRead ? 'read' : 'unread'}`}
                onClick={() => markAsRead(item.id)}
              >
                <div className="noti-item__left">
                  {getIcon(item.type)}
                </div>
                
                <div className="noti-item__content">
                  <div className="noti-item__head">
                    <span className="noti-title">{item.title}</span>
                    <span className="noti-time">{item.createdAt}</span>
                  </div>
                  <div className="noti-message">{item.message}</div>
                  
                  {/* Action Buttons */}
                  {item.actions && item.actions.length > 0 && (
                    <div className="noti-actions">
                      {item.actions.map(act => (
                        <button
                          key={act.code}
                          className={`btn-action ${act.style}`}
                          onClick={(e) => {
                            e.stopPropagation(); // 부모 클릭(읽음처리) 방지
                            handleAction(item.id, act.code);
                          }}
                        >
                          {act.code === 'ACCEPT' && <Check size={14} />}
                          {act.code === 'DECLINE' && <X size={14} />}
                          {act.label}
                          {act.style === 'link' && <ChevronRight size={14} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageContainer>
  );
}