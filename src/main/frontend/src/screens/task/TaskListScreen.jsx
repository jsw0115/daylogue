import React, { useState } from "react";
import "../../styles/screens/task.css";
import Modal from "../../components/common/Modal";

const initialTasks = [
  { id: 1, title: "SQLD 1강 복습", category: "공부", done: false },
  { id: 2, title: "프로젝트 요구사항 정리", category: "업무", done: true },
];

const TaskListScreen = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    category: "기타",
  });

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const handleCreate = () => {
    if (!newTask.title.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title: newTask.title.trim(), category: newTask.category, done: false },
    ]);
    setNewTask({ title: "", category: "기타" });
    setModalOpen(false);
    // TODO: backend POST /api/tasks 로 연동
  };

  return (
    <div className="screen task-list-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">할 일 목록</h1>
          <p className="text-muted font-small">
            오늘/이번 주에 해야 할 일을 관리합니다.
          </p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => setModalOpen(true)}
        >
          + 새 할 일 추가
        </button>
      </div>

      <div className="card">
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <label className="task-item__left">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                />
                <span
                  className={
                    "task-item__title" +
                    (task.done ? " task-item__title--done" : "")
                  }
                >
                  {task.title}
                </span>
              </label>
              <span className="task-item__category">{task.category}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 새 할 일 추가 모달 */}
      <Modal
        open={modalOpen}
        title="새 할 일 추가"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              취소
            </button>
            <button
              className="btn btn--primary btn--sm"
              type="button"
              onClick={handleCreate}
            >
              저장
            </button>
          </>
        }
      >
        <div className="form-row">
          <label className="form-label">제목</label>
          <input
            type="text"
            className="form-input"
            value={newTask.title}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="예) SQLD 1강 복습"
          />
        </div>
        <div className="form-row">
          <label className="form-label">카테고리</label>
          <select
            className="form-input"
            value={newTask.category}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="업무">업무</option>
            <option value="공부">공부</option>
            <option value="건강">건강</option>
            <option value="개인">개인</option>
            <option value="기타">기타</option>
          </select>
        </div>
      </Modal>
    </div>
  );
};

export default TaskListScreen;
