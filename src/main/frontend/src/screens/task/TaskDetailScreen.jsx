// src/main/frontend/src/screens/task/TaskDetailScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/task.css";

function TaskDetailScreen() {
  const [title, setTitle] = useState("SQLD 1강 듣기");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("2025-03-16");
  const [category, setCategory] = useState("study");

  return (
    <AppShell title="할 일 상세">
      <div className="screen task-detail-screen">
        <header className="screen-header">
          <h2>할 일 상세</h2>
        </header>

        <section className="task-detail-main">
          <div className="field">
            <label className="field__label">제목</label>
            <input className="field__control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label">설명</label>
            <textarea className="field__control"
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="세부 내용을 적어두면 좋아요."
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field__label">카테고리</label>
              <select className="field__control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="study">공부</option>
                <option value="work">업무</option>
                <option value="health">건강</option>
              </select>
            </div>
            <div className="field">
              <label className="field__label">기한</label>
              <input type="date"
                className="field__control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label">상태</label>
            <select className="field__control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="todo">TODO</option>
              <option value="in_progress">진행중</option>
              <option value="done">완료</option>
              <option value="postponed">연기</option>
              <option value="canceled">취소</option>
            </select>
          </div>
        </section>

        <section className="task-detail-actions">
          <button className="primary-button">저장</button>
          <button className="ghost-button">삭제</button>
        </section>
      </div>
    </AppShell>
  );
}

export default TaskDetailScreen;

