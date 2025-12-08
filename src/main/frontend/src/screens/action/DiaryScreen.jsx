// src/main/frontend/src/screens/diary/DailyDiaryScreen.jsx

import React, { useState } from 'react';

const DailyDiaryScreen = () => {
    const [diaryText, setDiaryText] = useState("");
    const date = "2025. 12. 7 (일)";

    return (
        <div>
            <div className="screen-header">
                <div className="screen-header__title">일간 다이어리/회고</div>
                <button className="primary-button">저장</button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-primary">{date}</h3>
                <span className="text-muted">오늘의 기분: 😃</span>
            </div>

            <div className="card p-4 flex-col">
                <h4 className="dashboard-card__title mb-3">오늘의 일기</h4>
                
                <textarea 
                    className="field__control memo-textarea" 
                    placeholder="오늘 하루 있었던 일, 느낀 점, 감사한 점을 기록하세요."
                    rows="15"
                    value={diaryText}
                    onChange={(e) => setDiaryText(e.target.value)}
                ></textarea>
                
                <div className="flex justify-end mt-3">
                    <button className="btn btn--sm btn--primary">일기 저장</button>
                </div>
            </div>

            <div className="card mt-4 p-4">
                <h4 className="dashboard-card__title">최근 일기 목록</h4>
                <p className="text-muted">2025. 12. 6: 프로젝트 마일스톤 달성 (매우 만족)</p>
                <p className="text-muted">2025. 12. 5: 새로운 알고리즘 학습 시작 (흥미로움)</p>
            </div>
        </div>
    );
}

export default DailyDiaryScreen;