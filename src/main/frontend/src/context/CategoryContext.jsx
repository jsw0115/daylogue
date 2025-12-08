// src/main/frontend/src/context/CategoryContext.jsx

import React, { createContext, useState, useContext } from 'react';

// PLAN-CAT-F01, SET-006: 카테고리 정의 및 색상 전역 관리
const CategoryContext = createContext();

// 초기 카테고리 목록 (색상은 16진수 코드로 관리)
const initialCategories = [
    { id: 'work', name: '업무', color: '#1A531D', icon: '💼' },
    { id: 'study', name: '공부', color: '#00BFFF', icon: '📚' },
    { id: 'health', name: '건강', color: '#DC3545', icon: '💪' },
    { id: 'family', name: '가족', color: '#FF5733', icon: '👨‍👩‍👧‍👦' },
    { id: 'rest', name: '휴식', color: '#FFD700', icon: '🛌' },
    { id: 'etc', name: '기타', color: '#A9A9A9', icon: '❓' },
];

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState(initialCategories);

    // 카테고리 추가, 수정, 삭제 함수 (SET-006-F01, F02 구현 시 사용)
    const getCategoryColor = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.color : '#CCCCCC'; // 기본 색상
    };

    return (
        <CategoryContext.Provider value={{ categories, getCategoryColor, setCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    return useContext(CategoryContext);
};