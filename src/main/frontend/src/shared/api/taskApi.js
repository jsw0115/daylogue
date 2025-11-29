// src/main/frontend/src/shared/api/taskApi.js
import { get, post, put, del } from "./httpClient";

export function fetchTasks(params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/tasks?${query}`);
}

export function fetchTask(id) {
  return get(`/tasks/${id}`);
}

export function createTask(body) {
  return post("/tasks", body);
}

export function updateTask(id, body) {
  return put(`/tasks/${id}`, body);
}

export function deleteTask(id) {
  return del(`/tasks/${id}`);
}

