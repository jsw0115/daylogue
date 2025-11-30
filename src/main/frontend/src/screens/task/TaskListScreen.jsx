// src/screens/task/TaskListScreen.jsx
import React, { useState } from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/common/Button";

const SAMPLE_TASKS = [
  {
    id: 1,
    title: "SQLD 2장 강의 완강",
    categoryName: "공부",
    status: "IN_PROGRESS",
    dueDate: "2025-12-06",
  },
  {
    id: 2,
    title: "회의록 정리",
    categoryName: "업무",
    status: "TODO",
    dueDate: "2025-12-06",
  },
  {
    id: 3,
    title: "건강검진 예약 확인",
    categoryName: "생활",
    status: "DONE",
    dueDate: "2025-12-05",
  },
];

function TaskListScreen() {
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedTask, setSelectedTask] = useState(SAMPLE_TASKS[0]);

  const filtered = SAMPLE_TASKS.filter((t) => {
    if (selectedStatus === "ALL") return true;
    return t.status === selectedStatus;
  });

  const renderStatusChip = (status) => {
    const base = "task-row__status";
    if (status === "DONE") return <span className={`${base} ${base}--done`}>완료</span>;
    if (status === "TODO") return <span className={base}>할 일</span>;
    if (status === "IN_PROGRESS") return <span className={base}>진행중</span>;
    if (status === "OVERDUE") return <span className={`${base} ${base}--overdue`}>기한 지남</span>;
    return <span className={base}>{status}</span>;
  };

  return (
    <div className="screen task-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">할 일</h2>
          <p className="screen-header__subtitle">
            오늘과 앞으로 해야 할 일들을 한 곳에서 관리해요.
          </p>
        </div>
        <Button className="btn--primary">+ 새 할 일</Button>
      </header>

      <div className="task-filters">
        <div className="task-filter-chips">
          {[
            { code: "ALL", label: "전체" },
            { code: "TODO", label: "할 일" },
            { code: "IN_PROGRESS", label: "진행중" },
            { code: "DONE", label: "완료" },
          ].map((chip) => (
            <button
              key={chip.code}
              type="button"
              className={
                "task-chip" +
                (selectedStatus === chip.code ? " task-chip--active" : "")
              }
              onClick={() => setSelectedStatus(chip.code)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="task-main">
        <DashboardCard title="할 일 목록" subtitle="기한 순 정렬">
          <table className="task-list">
            <thead>
              <tr>
                <th>제목</th>
                <th>카테고리</th>
                <th>상태</th>
                <th>기한</th>
              </tr>
            </thead>
            <tbody>
              {filtered && filtered.map((task) => (
                <tr
                  key={task.id}
                  className="task-row"
                  onClick={() => setSelectedTask(task)}
                >
                  <td>
                    <div className="task-row__title">{task.title}</div>
                  </td>
                  <td>{task.categoryName}</td>
                  <td>{renderStatusChip(task.status)}</td>
                  <td>{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard>

        <DashboardCard title="상세 보기" subtitle="선택된 할 일">
          {selectedTask ? (
            <div className="task-detail-panel">
              <div className="task-detail-panel__header">
                <div>
                  <h3 className="task-detail-title">{selectedTask.title}</h3>
                  <div className="task-detail-meta">
                    {selectedTask.categoryName} · 기한 {selectedTask.dueDate}
                  </div>
                </div>
                {renderStatusChip(selectedTask.status)}
              </div>

              <textarea
                className="task-detail-notes"
                placeholder="이 할 일에 대한 메모를 남겨보세요."
              />
              <div>
                <Button className="btn--primary">저장</Button>
              </div>
            </div>
          ) : (
            <p className="task-detail-meta">왼쪽 목록에서 할 일을 선택하세요.</p>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}

export default TaskListScreen;
