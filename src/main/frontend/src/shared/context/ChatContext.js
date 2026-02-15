// FILE: src/shared/context/ChatContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

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
        console.log('✅ Chat Connected!');
        setConnected(true);
        // 여기서 글로벌 구독(나에게 온 알림 등)을 수행할 수 있음
        // clientRef.current.subscribe('/user/queue/errors', (msg) => ...);
      },
      onDisconnect: () => {
        console.log('❌ Chat Disconnected');
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

  return (
    <ChatContext.Provider value={{ client: clientRef.current, connected, connect, disconnect, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat= () => {
    const context = useContext(ChatContext);
    if (!context) {
      // Provider 없이 사용할 경우 명확한 에러를 던짐
      throw new Error("useChat must be used within a ChatProvider. 앱을 <ChatProvider>로 감쌌는지 확인하세요.");
    }
    return context;
  };