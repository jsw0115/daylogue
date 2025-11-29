// src/main/frontend/src/shared/api/eventApi.js
import { get, post, put, del } from "./httpClient";

export function fetchEvents(params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/events?${query}`);
}

export function fetchEvent(id) {
  return get(`/events/${id}`);
}

export function saveEvent(body) {
  if (body.id) {
    return put(`/events/${body.id}`, body);
  }
  return post("/events", body);
}

export function deleteEvent(id) {
  return del(`/events/${id}`);
}

export function fetchDdayList() {
  return get("/events/dday");
}

