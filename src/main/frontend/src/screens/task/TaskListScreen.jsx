import React, { useMemo, useState } from "react";
import "./../../styles/screens/taskList.css";

export default function TaskListScreen() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("today"); // today | week
  const [status, setStatus] = useState("all"); // all | open | done

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMin, setNewMin] = useState(30);

  const [tasks, setTasks] = useState([
    { id: 1, title: "SQLD 1일 1문제", done: true, durationMin: 30 },
    { id: 2, title: "프로젝트 이슈 정리", done: false, durationMin: 40 },
  ]);

  const view = useMemo(() => {
    return tasks
      .filter((t) => (status === "all" ? true : status === "done" ? t.done : !t.done))
      .filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
  }, [tasks, status, q]);

  const toggleDone = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const addTask = () => {
    const title = newTitle.trim();
    if (!title) return;
    setTasks((prev) => [{ id: Date.now(), title, done: false, durationMin: newMin }, ...prev]);
    setNewTitle("");
    setNewMin(30);
    setShowAdd(false);
  };

  return (
    <div className="task-screen">
      <div className="task-head">
        <div>
          <div className="screen-title">할 일</div>
          <div className="screen-subtitle">오늘/이번 주 할 일을 빠르게 관리</div>
        </div>

        <button className="btn primary" onClick={() => setShowAdd(true)} type="button">
          + 추가
        </button>
      </div>

      <div className="task-toolbar">
        <input className="task-search" placeholder="검색..." value={q} onChange={(e) => setQ(e.target.value)} />

        <div className="chips">
          <button className={`chip ${filter === "today" ? "is-on" : ""}`} onClick={() => setFilter("today")} type="button">오늘</button>
          <button className={`chip ${filter === "week" ? "is-on" : ""}`} onClick={() => setFilter("week")} type="button">이번 주</button>
        </div>

        <div className="chips">
          <button className={`chip ${status === "all" ? "is-on" : ""}`} onClick={() => setStatus("all")} type="button">전체</button>
          <button className={`chip ${status === "open" ? "is-on" : ""}`} onClick={() => setStatus("open")} type="button">미완료</button>
          <button className={`chip ${status === "done" ? "is-on" : ""}`} onClick={() => setStatus("done")} type="button">완료</button>
        </div>
      </div>

      <div className="task-card">
        {view.length === 0 ? (
          <div className="empty">표시할 항목이 없습니다.</div>
        ) : (
          view.map((t) => (
            <div className="task-row" key={t.id}>
              <button className={`chk ${t.done ? "is-done" : ""}`} onClick={() => toggleDone(t.id)} type="button">
                {t.done ? "✓" : ""}
              </button>
              <div className={`task-title ${t.done ? "is-done" : ""}`}>{t.title}</div>
              <div className="task-meta">{t.durationMin}분</div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <div className="modal-backdrop" onMouseDown={() => setShowAdd(false)} role="presentation">
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal__title">할 일 추가</div>
            <div className="modal__body">
              <div className="field">
                <div className="label">제목</div>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="예) 프로젝트 회의" />
              </div>
              <div className="field">
                <div className="label">예상 시간(분)</div>
                <input type="number" min={5} value={newMin} onChange={(e) => setNewMin(Number(e.target.value || 30))} />
              </div>
            </div>
            <div className="modal__actions">
              <button className="btn" onClick={() => setShowAdd(false)} type="button">취소</button>
              <button className="btn primary" onClick={addTask} type="button">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
