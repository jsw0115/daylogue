// src/main/frontend/src/shared/api/shareApi.js
import { get, post, del } from "./httpClient";

export function fetchFriends() {
  return get("/share/friends");
}

export function inviteFriend(email) {
  return post("/share/friends/invite", { email });
}

export function removeFriend(id) {
  return del(`/share/friends/${id}`);
}

export function fetchGroups() {
  return get("/share/groups");
}

