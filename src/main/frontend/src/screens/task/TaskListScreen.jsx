// src/main/frontend/src/screens/task/TaskListScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import { useResponsiveLayout } from "../../shared/hooks/useResponsiveLayout";

const mockTasks = [
  {
    id: "t1",
    title: "SQLD 1강 듣기",
    categoryId: "study",
    dueDate: "2025-03-16",
    status: "todo",
    priority: "high",
  },
  {
    id: "t2",
    title: "업무 회의록 정리",
    categoryId: "work",
    dueDate: "2025-03-17",
    status: "in_progress",
    priority: "medium",
  },
];

function TaskListScreen() {
  const viewport = useResponsiveLayout();
  const [tasks] = useState(mockTasks);

  return (
    <AppShell title="할 일 리스트">
      <div className={`screen screen--task-list screen--${viewport}`}>
        <header className="screen-header">
          <div className="screen-header__left">
            <h2>할 일</h2>
          </div>
          <div className="screen-header__right">
            <button className="primary-button">+ 새 할 일</button>
          </div>
        </header>

        <section className="task-filters">
          <input type="date" />
          <select defaultValue="">
            <option value="">전체 카테고리</option>
            <option value="study">공부</option>
            <option value="work">업무</option>
            <option value="health">건강</option>
          </select>
          <select defaultValue="">
            <option value="">상태 전체</option>
            <option value="todo">TODO</option>
            <option value="in_progress">진행중</option>
            <option value="done">완료</option>
          </select>
        </section>

        <section className="task-list">
          {tasks.map((task) => (
            <article key={task.id} className="task-card">
              <div className="task-card__main">
                <h3>{task.title}</h3>
                <div className="task-card__meta">
                  <span className={`chip chip--${task.categoryId}`}>
                    {task.categoryId.toUpperCase()}
                  </span>
                  {task.dueDate && (
                    <span className="task-card__due">기한 {task.dueDate}</span>
                  )}
                </div>
              </div>
              <div className="task-card__side">
                <select defaultValue={task.status}>
                  <option value="todo">TODO</option>
                  <option value="in_progress">진행중</option>
                  <option value="done">완료</option>
                  <option value="postponed">연기</option>
                  <option value="canceled">취소</option>
                </select>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default TaskListScreen;
