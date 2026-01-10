// FILE: src/main/frontend/src/shared/hooks/useWorkReportMaster.js
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
          status: "CURRENT", // 기본 진행중
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
    {
      projects: [],
      workTypes: [],
      subCategories: [],
      updatedAt: null,
    }
  );
}

function normalizeMaster(master, fallback) {
  const fb = fallback || { projects: [], workTypes: [], subCategories: [], updatedAt: null };
  const m = master && typeof master === "object" ? master : fb;

  const projects = (Array.isArray(m.projects) ? m.projects : fb.projects)
    .map((p) => ({
      id: String(p?.id || "").trim(),
      name: String(p?.name || "").trim(),
      status: String(p?.status || "CURRENT"), // CURRENT | PLANNED | DONE | HOLD
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

function uniqueId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function hasDup(list, value, exceptId = null) {
  const v = String(value || "").trim().toLowerCase();
  if (!v) return false;

  return (Array.isArray(list) ? list : []).some((x) => {
    const id = String(x?.id ?? x?.code ?? "").trim();
    if (exceptId && id === String(exceptId)) return false;

    const name = String(x?.name ?? x?.label ?? "").trim().toLowerCase();
    return name === v;
  });
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

  const setDefaultsIfEmpty = React.useCallback((defaults) => {
    const cur = loadWorkReportMaster(null);
    if (cur && (cur.projects.length || cur.workTypes.length || cur.subCategories.length)) return cur;
    return saveWorkReportMaster(defaults);
  }, []);

  // Projects CRUD
  const addProject = React.useCallback((name, status) => {
    const cur = loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] });
    const nm = String(name || "").trim();
    if (!nm) throw new Error("ProjectNameRequired");
    if (nm.length > 50) throw new Error("ProjectNameTooLong");
    if (hasDup(cur.projects, nm)) throw new Error("ProjectNameDuplicate");

    saveWorkReportMaster({
      ...cur,
      projects: [...cur.projects, { id: uniqueId("prj"), name: nm, status: String(status || "CURRENT") }],
    });
  }, []);

  const updateProject = React.useCallback((id, patch) => {
    const cur = loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] });
    const pid = String(id || "").trim();
    if (!pid) return;

    const nextName = patch?.name != null ? String(patch.name).trim() : null;
    if (nextName !== null) {
      if (!nextName) throw new Error("ProjectNameRequired");
      if (nextName.length > 50) throw new Error("ProjectNameTooLong");
      if (hasDup(cur.projects, nextName, pid)) throw new Error("ProjectNameDuplicate");
    }

    saveWorkReportMaster({
      ...cur,
      projects: cur.projects.map((p) =>
        p.id === pid
          ? {
              ...p,
              ...patch,
              name: nextName !== null ? nextName : p.name,
              status: patch?.status != null ? String(patch.status) : p.status,
            }
          : p
      ),
    });
  }, []);

  const deleteProject = React.useCallback((id) => {
    const cur = loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] });
    const pid = String(id || "").trim();
    if (!pid) return;

    saveWorkReportMaster({ ...cur, projects: cur.projects.filter((p) => p.id !== pid) });
  }, []);

  // WorkTypes CRUD
  const addWorkType = React.useCallback((label) => {
    const cur = loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] });
    const lb = String(label || "").trim();
    if (!lb) throw new Error("WorkTypeLabelRequired");
    if (lb.length > 40) throw new Error("WorkTypeLabelTooLong");
    if (hasDup(cur.workTypes, lb)) throw new Error("WorkTypeDuplicate");

    saveWorkReportMaster({
      ...cur,
      workTypes: [...cur.workTypes, { code: uniqueId("wt"), label: lb }],
    });
  }, []);

  const updateWorkType = React.useCallback((code, patch) => {
    const cur = loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] });
    const c = String(code || "").trim();
    if (!c) return;

    const nextLabel = patch?.label != null ? String(patch.label).trim() : null;
    if (nextLabel !== null) {
      if (!nextLabel) throw new Error("WorkTypeLabelRequired");
      if (nextLabel.length > 40) throw new Error("WorkTypeLabelTooLong");
      if (hasDup(cur.workTypes, nextLabel, c)) throw new Error("WorkTypeDuplicate");
    }

    saveWorkReportMaster({
      ...cur,
      workTypes: cur.workTypes.map((t) =>
        t.code === c ? { ...t, ...patch, label: nextLabel !== null ? nextLabel : t.label } : t
      ),
    });
  }, []);

  const deleteWorkType = React.useCallback((code) => {
    const cur = loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] });
    const c = String(code || "").trim();
    if (!c) return;

    saveWorkReportMaster({ ...cur, workTypes: cur.workTypes.filter((t) => t.code !== c) });
  }, []);

  // SubCategories CRUD
  const addSubCategory = React.useCallback((name, icon) => {
    const cur = loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] });
    const nm = String(name || "").trim();
    const ic = String(icon || "").trim();
    if (!nm) throw new Error("SubCategoryNameRequired");
    if (nm.length > 40) throw new Error("SubCategoryNameTooLong");
    if (hasDup(cur.subCategories, nm)) throw new Error("SubCategoryDuplicate");

    saveWorkReportMaster({
      ...cur,
      subCategories: [...cur.subCategories, { id: uniqueId("sub"), name: nm, icon: ic }],
    });
  }, []);

  const updateSubCategory = React.useCallback((id, patch) => {
    const cur = loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] });
    const sid = String(id || "").trim();
    if (!sid) return;

    const nextName = patch?.name != null ? String(patch.name).trim() : null;
    if (nextName !== null) {
      if (!nextName) throw new Error("SubCategoryNameRequired");
      if (nextName.length > 40) throw new Error("SubCategoryNameTooLong");
      if (hasDup(cur.subCategories, nextName, sid)) throw new Error("SubCategoryDuplicate");
    }

    saveWorkReportMaster({
      ...cur,
      subCategories: cur.subCategories.map((s) =>
        s.id === sid
          ? {
              ...s,
              ...patch,
              name: nextName !== null ? nextName : s.name,
              icon: patch?.icon != null ? String(patch.icon).trim() : s.icon,
            }
          : s
      ),
    });
  }, []);

  const deleteSubCategory = React.useCallback((id) => {
    const cur = loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] });
    const sid = String(id || "").trim();
    if (!sid) return;

    saveWorkReportMaster({ ...cur, subCategories: cur.subCategories.filter((s) => s.id !== sid) });
  }, []);

  return {
    master,
    reload,
    setDefaultsIfEmpty,

    addProject,
    updateProject,
    deleteProject,

    addWorkType,
    updateWorkType,
    deleteWorkType,

    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
  };
}
