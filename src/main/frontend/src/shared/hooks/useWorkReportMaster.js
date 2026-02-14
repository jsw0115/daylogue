import React from "react";
import { safeStorage } from "../utils/safeStorage";

export const WORK_REPORT_MASTER_KEY = "workReport.master.v1";
export const WORK_REPORT_MASTER_EVENT = "timeflow.workReportMaster.changed";

export function notifyWorkReportMasterChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(WORK_REPORT_MASTER_EVENT));
}

export function loadWorkReportMaster(fallback = null) {
  const raw = safeStorage.getJSON(WORK_REPORT_MASTER_KEY, fallback);
  return normalizeMaster(raw, fallback);
}

export function saveWorkReportMaster(master) {
  const next = normalizeMaster(master, {
    projects: [],
    workTypes: [],
    subCategories: [],
    updatedAt: null,
  });
  next.updatedAt = new Date().toISOString();
  safeStorage.setJSON(WORK_REPORT_MASTER_KEY, next);
  notifyWorkReportMasterChanged();
  return next;
}

export function buildDefaultWorkReportMaster(metaData, categories) {
  const projects = Array.isArray(metaData?.projects) ? metaData.projects : [];
  const workTypes = Array.isArray(metaData?.workTypes) ? metaData.workTypes : [];

  const cats = Array.isArray(categories) ? categories : [];
  const workCat = cats.find((c) => c?.type === "업무" || c?.name === "업무");
  const sub = Array.isArray(workCat?.children) ? workCat.children : [];

  return normalizeMaster(
    {
      projects: projects
        .map((p) => ({
          id: String(p?.id || "").trim(),
          name: String(p?.name || "").trim(),
          status: "CURRENT",
        }))
        .filter((x) => x.id && x.name),

      workTypes: workTypes
        .map((t) => ({
          code: String(t?.code || "").trim(),
          label: String(t?.label || "").trim(),
        }))
        .filter((x) => x.code && x.label),

      subCategories: sub
        .map((s) => ({
          id: String(s?.id || "").trim(),
          name: String(s?.name || "").trim(),
          icon: String(s?.icon || "").trim(),
        }))
        .filter((x) => x.id && x.name),

      updatedAt: new Date().toISOString(),
    },
    { projects: [], workTypes: [], subCategories: [], updatedAt: null }
  );
}

function normalizeMaster(master, fallback) {
  const fb = fallback || { projects: [], workTypes: [], subCategories: [], updatedAt: null };
  const m = master && typeof master === "object" ? master : fb;

  const projects = (Array.isArray(m.projects) ? m.projects : fb.projects)
    .map((p) => ({
      id: String(p?.id || "").trim(),
      name: String(p?.name || "").trim(),
      status: String(p?.status || "CURRENT"),
    }))
    .filter((x) => x.id && x.name);

  const workTypes = (Array.isArray(m.workTypes) ? m.workTypes : fb.workTypes)
    .map((t) => ({
      code: String(t?.code || "").trim(),
      label: String(t?.label || "").trim(),
    }))
    .filter((x) => x.code && x.label);

  const subCategories = (Array.isArray(m.subCategories) ? m.subCategories : fb.subCategories)
    .map((s) => ({
      id: String(s?.id || "").trim(),
      name: String(s?.name || "").trim(),
      icon: String(s?.icon || "").trim(),
    }))
    .filter((x) => x.id && x.name);

  return {
    projects,
    workTypes,
    subCategories,
    updatedAt: m.updatedAt || fb.updatedAt || null,
  };
}

export function useWorkReportMaster({ subscribe = true } = {}) {
  const [master, setMaster] = React.useState(() => loadWorkReportMaster(null));

  const reload = React.useCallback(() => {
    setMaster(loadWorkReportMaster(null));
  }, []);

  React.useEffect(() => {
    if (!subscribe || typeof window === "undefined") return;
    const on = () => reload();
    window.addEventListener(WORK_REPORT_MASTER_EVENT, on);
    return () => window.removeEventListener(WORK_REPORT_MASTER_EVENT, on);
  }, [subscribe, reload]);

  return { master, reload };
}