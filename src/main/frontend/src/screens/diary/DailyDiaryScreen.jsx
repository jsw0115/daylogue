import React, { useState } from "react";
import "../../styles/screens/diary.css";

const moods = [
  { id: "great", icon: "😄", label: "최고" },
  { id: "good", icon: "🙂", label: "좋음" },
  { id: "soso", icon: "😐", label: "보통" },
  { id: "bad", icon: "🙁", label: "나쁨" },
  { id: "terrible", icon: "😫", label: "최악" },
];

const DailyDiaryScreen = () => {
  const [mood, setMood] = useState("good");
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");
  const [gratitude, setGratitude] = useState("");

  return (
    <div className="screen daily-diary-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">데일리 다이어리</h1>
          <p className="text-muted font-small">
            오늘의 기분과 하루를 정리하는 공간입니다.
          </p>
        </div>
      </div>

      <div className="diary-grid">
        {/* 기분 이모티콘 선택 */}
        <section className="card">
          <h2 className="dashboard-card__title">오늘의 기분</h2>
          <p className="text-muted font-small mb-2">
            오늘 하루를 대표하는 기분을 선택하세요.
          </p>
          <div className="diary-mood-list">
            {moods.map((m) => (
              <button
                key={m.id}
                type="button"
                className={
                  "diary-mood-item" +
                  (mood === m.id ? " diary-mood-item--active" : "")
                }
                onClick={() => setMood(m.id)}
              >
                <span className="diary-mood-icon">{m.icon}</span>
                <span className="diary-mood-label">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 하루 요약 */}
        <section className="card">
          <h2 className="dashboard-card__title">하루 한 줄 요약</h2>
          <textarea
            className="diary-textarea diary-textarea--summary"
            placeholder="오늘을 한 줄로 요약해보세요."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </section>

        {/* 상세 기록 */}
        <section className="card diary-full-width">
          <h2 className="dashboard-card__title">상세 기록</h2>
          <textarea
            className="diary-textarea"
            placeholder="오늘 있었던 일, 느낀 점, 배운 점 등을 자유롭게 기록해보세요."
            rows={8}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </section>

        {/* 감사/되돌아보기 */}
        <section className="card diary-full-width">
          <h2 className="dashboard-card__title">감사/되돌아보기</h2>
          <textarea
            className="diary-textarea"
            placeholder="오늘 감사했던 일이나 내일을 위한 다짐을 적어보세요."
            rows={4}
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
          />
        </section>
      </div>
    </div>
  );
};

export default DailyDiaryScreen;
