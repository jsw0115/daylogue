// src/main/frontend/src/components/diary/DiaryCard.jsx
import React from "react";
import "../../styles/components.css";

function DiaryCard({ title, placeholder, value, onChange }) {
  return (
    <article className="diary-card">
      <h4>{title}</h4>
      <textarea className="diary-card__textarea"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </article>
  );
}

export default DiaryCard;

