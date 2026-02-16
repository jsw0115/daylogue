// FILE: src/shared/context/ChatContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false); // 채팅 위젯 열림 상태 전역 관리
  const [targetRoomId, setTargetRoomId] = useState(null); // 특정 방 바로 열기용

  // 소켓 연결 (로그인 직후 호출 권장)
  const connect = () => {
    if (clientRef.current?.active) return;

    clientRef.current = new Client({
      // Spring Boot 엔드포인트 (WebSocketConfig 참고)
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),

      // JWT 토큰이 있다면 헤더에 추가
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },

      onConnect: () => {
        console.log('Chat Connected!');
        setConnected(true);
        // 여기서 글로벌 구독(나에게 온 알림 등)을 수행할 수 있음
        // clientRef.current.subscribe('/user/queue/errors', (msg) => ...);
      },
      onDisconnect: () => {
        console.log('Chat Disconnected');
        setConnected(false);
      },
      // 디버그용 로그 (운영 배포시 주석 처리)
      // debug: (str) => console.log(str),
    });

    clientRef.current.activate();
  };

  const disconnect = () => {
    if (clientRef.current) {
      clientRef.current.deactivate();
    }
  };

  // 메시지 전송 헬퍼 함수
  const sendMessage = (roomId, message) => {
    if (!clientRef.current?.active) return;

    clientRef.current.publish({
      destination: `/app/chat/send`, // Spring Controller 매핑
      body: JSON.stringify({ roomId, message }),
    });
  };

  // 앱 시작 시(또는 로그인 시) 연결 시도
  useEffect(() => {
    // 실제로는 토큰이 있을 때만 connect() 호출
    // connect(); 
    return () => disconnect();
  }, []);

  // ★ [추가] 특정 유저와의 채팅방 열기 (주소록 연동용)
  const openChatWithUser = (userId) => {
    setIsOpen(true);
    // 실제로는 API로 "나-상대방"의 방 ID를 조회해야 함.
    // 여기서는 Mock 로직으로 처리: userId가 포함된 방을 찾거나 임시 방 ID 설정
    console.log(`Open chat with user: ${userId}`);

    // 위젯이 열린 후 useEffect에서 감지하여 해당 방으로 이동하도록 ID 세팅
    // (실제 구현에선 API 호출 후 방 ID를 받아와야 함)
    const mockRoomId = userId === 'f1' ? 2 : 999; // 예시 로직
    setTargetRoomId(mockRoomId);
  };

  const closeChat = () => {
    setIsOpen(false);
    setTargetRoomId(null);
  };

  return (
    <ChatContext.Provider value={{
      isOpen,
      openChatWithUser,
      closeChat,
      targetRoomId, // ChatWidget에서 감지할 변수
      setTargetRoomId, // 처리 후 초기화용
      client: clientRef.current, connected, connect, disconnect, sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    // Provider 없이 사용할 경우 명확한 에러를 던짐
    throw new Error("useChat must be used within a ChatProvider. 앱을 <ChatProvider>로 감쌌는지 확인하세요.");
  }
  return context;
};