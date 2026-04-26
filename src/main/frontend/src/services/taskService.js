import api from "../api";

export const taskService = {
  // 1. 할 일 목록 조회 (GET /api/tasks/)
  listTasks: async (searchParam = {}) => {
    try {
      // 백엔드의 GET 요청이 @RequestBody를 받도록 설계되었으므로 axios의 data 속성 사용
      const response = await api.get("/api/tasks/", { data: searchParam });
      return response.data?.data || [];
    } catch (error) {
      console.error("할 일 목록 조회 실패:", error);
      return [];
    }
  },

  // [추가] 단일 할 일 상세 조회 (GET /api/tasks/{taskId})
  getTaskDetail: async (taskId) => {
    try {
      const response = await api.get(`/api/tasks/${taskId}`, { data: { taskId } });
      return response.data?.data;
    } catch (error) {
      console.error("할 일 상세 조회 실패:", error);
      return null;
    }
  },

  // 2. 할 일 생성 (POST /api/tasks/)
  createTask: async (taskData) => {
    const response = await api.post("/api/tasks/", taskData);
    return response.data?.data;
  },

  // 3. 할 일 수정 (PUT /api/tasks/{taskId})
  updateTask: async (taskData) => {
    const taskId = taskData.id || taskData.taskId;
    const response = await api.put(`/api/tasks/${taskId}`, taskData);
    return response.data?.data;
  },

  // 4. 할 일 삭제 (DELETE /api/tasks/{taskId})
  deleteTask: async (taskId) => {
    // DELETE 역시 @RequestBody를 받고 있으므로 data 속성으로 전달
    const response = await api.delete(`/api/tasks/${taskId}`, { data: { taskId } });
    return response.data?.data;
  },

  // 5. 완료 여부(Status) 토글 (PATCH /api/tasks/{taskId}/status)
  toggleTaskDone: async (taskId, isDone) => {
    const response = await api.patch(`/api/tasks/${taskId}/status`, { done: isDone });
    return response.data?.data;
  },

  // 6. 할 일 순서 일괄 변경 (PUT /api/tasks/reorder)
  reorderTasks: async (taskIds) => {
    const response = await api.put("/api/tasks/reorder", { taskIds });
    return response.data?.data;
  },

  // 7. 할 일 복제 (POST /api/tasks/{taskId}/duplicate)
  duplicateTask: async (taskId) => {
    const response = await api.post(`/api/tasks/${taskId}/duplicate`);
    return response.data?.data;
  }
};