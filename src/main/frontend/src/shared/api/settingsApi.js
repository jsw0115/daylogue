// src/main/frontend/src/shared/api/settingsApi.js
import { get, post } from "./httpClient";

export function fetchSettings() {
  return get("/settings");
}

export function saveSettings(body) {
  return post("/settings", body);
}

export function fetchCategoryStyles() {
  return get("/settings/categories");
}

export function saveCategoryStyles(categories) {
  return post("/settings/categories", { categories });
}

