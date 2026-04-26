import React, { useState } from "react";
import TaskQuickModal from "../../components/task/TaskQuickModal"; // 실제 TaskQuickModal이 위치한 경로로 수정해주세요.
import "../../styles/screens/task.css";

export default function TaskScreen() {
  // 모달 열림/닫힘 상태를 관리하는 State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  // 모달 열기 핸들러
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 모달에서 '저장' 버튼을 눌렀을 때 실행되는 핸들러
  const handleSaveTask = (payload) => {
    console.log("새 할 일 저장 데이터:", payload);
    // TODO: 백엔드 API (api.post('/api/tasks', payload))를 호출하여 데이터를 저장하세요.
    
    // 임시로 화면에 추가된 목록을 보여주기 위한 로직 (API 연동 후 수정 필요)
    setTasks((prev) => [...prev, { id: Date.now(), ...payload }]);
    
    // 저장 후 모달 닫기
    setIsModalOpen(false);
  };

  return (
    <div className="task-screen" style={{ padding: "24px" }}>
      <div className="screen-header">
        <h2>할 일 관리</h2>
        {/* 할 일 추가 버튼 */}
        <button className="tqm-btn tqm-btnPrimary" onClick={handleOpenModal}>
          + 새 할 일 추가
        </button>
      </div>

      <div className="task-main">
        <div className="task-list-card">
          <table className="task-list">
            <thead>
              <tr>
                <th>할 일 이름</th>
                <th>참여 멤버</th>
                <th>반복 여부</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>등록된 할 일이 없습니다.</td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="task-row">
                    <td>{task.name}</td>
                    <td>{task.members?.map(m => m.name).join(", ") || "없음"}</td>
                    <td>{task.repeatConfig?.isRepeat ? task.repeatConfig.repeatType : "없음"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 작성된 TaskQuickModal 컴포넌트 렌더링 */}
      <TaskQuickModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
      />
    </div>
  );
}