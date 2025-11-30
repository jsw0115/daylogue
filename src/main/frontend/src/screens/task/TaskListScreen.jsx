import React from "react";

const mockTasks = [
  { id: 1, title: "SQLD 2장 복습", status: "done" },
  { id: 2, title: "운동 30분", status: "pending" },
  { id: 3, title: "프로젝트 이슈 정리", status: "overdue" },
];

function TaskListScreen() {
  return (
    <div className="screen task-screen">
      <div className="screen-header">
        <div className="screen-header__left">
          <h1 className="screen-header__title">할 일</h1>
          <p className="screen-header__subtitle">
            날짜와 카테고리별로 할 일을 관리해요.
          </p>
        </div>
        <button className="btn btn--primary">+ 할 일 추가</button>
      </div>

      <div className="task-main">
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">할 일 목록</h2>
          </div>
          <table className="task-list">
            <thead>
              <tr>
                <th>제목</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {mockTasks.map((t) => (
                <tr key={t.id} className="task-row">
                  <td className="task-row__title">{t.title}</td>
                  <td>
                    <span
                      className={
                        "task-row__status " +
                        (t.status === "done"
                          ? "task-row__status--done"
                          : t.status === "overdue"
                          ? "task-row__status--overdue"
                          : "")
                      }
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="dashboard-card task-detail-panel">
          <p className="task-detail-meta">
            왼쪽에서 할 일을 선택하면 상세 정보가 여기 표시됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}

export default TaskListScreen;
