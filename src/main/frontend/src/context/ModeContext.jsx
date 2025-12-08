// src/main/frontend/src/context/ModeContext.jsx

import React, { createContext, useState, useContext } from 'react';

// MODE-001-F01: J/P/B 모드 상태 전역 관리
const ModeContext = createContext(null);

// 임시 카테고리 (지금은 사용 안 하지만 추후 SET-006 등과 연동 가능)
const initialCategories = [
  { id: 'work', name: '업무', color: '#1A531D', icon: '💼' },
  { id: 'study', name: '공부', color: '#00BFFF', icon: '📚' },
  { id: 'health', name: '건강', color: '#DC3545', icon: '💪' },
  { id: 'rest', name: '휴식', color: '#FFD700', icon: '🛌' },
];

export const ModeProvider = ({ children }) => {
  // 초기 모드는 'J' (계획형)
  const [currentMode, setCurrentMode] = useState('J');

  // 모드 변경 (J / P / B 외 값은 무시)
  const setMode = (mode) => {
    if (['J', 'P', 'B'].includes(mode)) {
      setCurrentMode(mode);
      console.log(`Mode changed to: ${mode}. (Need to save preset via API)`);
    } else {
      console.warn(`Invalid mode: ${mode}`);
    }
  };

  return (
    <ModeContext.Provider value={{ currentMode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const ctx = useContext(ModeContext);
  if (!ctx) {
    // Provider 밖에서 쓰이면 바로 원인 알 수 있게 에러
    throw new Error('useMode must be used within a ModeProvider');
  }
  return ctx;
};
