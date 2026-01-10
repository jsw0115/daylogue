// FILE: src/main/frontend/src/screens/settings/WorkReportMasterModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../components/common/Modal";
import { categoryApi, workApi } from "../../services/localMockApi";
import {
  buildDefaultWorkReportMaster,
  loadWorkReportMaster,
  saveWorkReportMaster,
  useWorkReportMaster,
} from "../../shared/hooks/useWorkReportMaster";

function groupProjects(list) {
  const arr = Array.isArray(list) ? list : [];
  return {
    current: arr.filter((p) => p.status === "CURRENT"),
    planned: arr.filter((p) => p.status === "PLANNED"),
    done: arr.filter((p) => p.status === "DONE"),
    hold: arr.filter((p) => p.status === "HOLD"),
  };
}

export default function WorkReportMasterModal({ open, onClose }) {
  const [tab, setTab] = useState("PROJECTS"); // PROJECTS | TYPES | SUBS
  const [loading, setLoading] = useState(false);

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectStatus, setNewProjectStatus] = useState("CURRENT");

  const [newTypeLabel, setNewTypeLabel] = useState("");

  const [newSubIcon, setNewSubIcon] = useState("");
  const [newSubName, setNewSubName] = useState("");

  const {
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
  } = useWorkReportMaster({ subscribe: true });

  const grouped = useMemo(() => groupProjects(master?.projects), [master?.projects]);

  useEffect(() => {
    if (!open) return;

    (async () => {
      setLoading(true);
      try {
        const cur = loadWorkReportMaster(null);
        if (cur && (cur.projects.length || cur.workTypes.length || cur.subCategories.length)) return;

        const [cats, meta] = await Promise.all([categoryApi.listCategories(), workApi.listMeta()]);
        const defaults = buildDefaultWorkReportMaster(meta, cats);
        setDefaultsIfEmpty(defaults);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onReset = async () => {
    const ok = window.confirm("기본값으로 초기화할까요? (사용자 추가/수정 내용이 사라집니다)");
    if (!ok) return;

    setLoading(true);
    try {
      const [cats, meta] = await Promise.all([categoryApi.listCategories(), workApi.listMeta()]);
      const defaults = buildDefaultWorkReportMaster(meta, cats);
      saveWorkReportMaster(defaults);
      reload();
      setTab("PROJECTS");
    } finally {
      setLoading(false);
    }
  };

  const onAddProject = () => {
    try {
      addProject(newProjectName, newProjectStatus);
      setNewProjectName("");
      setNewProjectStatus("CURRENT");
    } catch (e) {
      const msg = String(e?.message || e);
      if (msg === "ProjectNameDuplicate") return alert("이미 존재하는 프로젝트명입니다.");
      if (msg === "ProjectNameTooLong") return alert("프로젝트명은 50자 이내로 입력하세요.");
      return alert("프로젝트 추가 실패: 이름을 확인하세요.");
    }
  };

  const onAddType = () => {
    try {
      addWorkType(newTypeLabel);
      setNewTypeLabel("");
    } catch (e) {
      const msg = String(e?.message || e);
      if (msg === "WorkTypeDuplicate") return alert("이미 존재하는 업무 유형입니다.");
      if (msg === "WorkTypeLabelTooLong") return alert("업무 유형명은 40자 이내로 입력하세요.");
      return alert("업무 유형 추가 실패: 이름을 확인하세요.");
    }
  };

  const onAddSub = () => {
    try {
      addSubCategory(newSubName, newSubIcon);
      setNewSubName("");
      setNewSubIcon("");
    } catch (e) {
      const msg = String(e?.message || e);
      if (msg === "SubCategoryDuplicate") return alert("이미 존재하는 하위카테고리입니다.");
      if (msg === "SubCategoryNameTooLong") return alert("하위카테고리명은 40자 이내로 입력하세요.");
      return alert("하위카테고리 추가 실패: 이름을 확인하세요.");
    }
  };

  return (
    <Modal
      open={open}
      title="업무보고 마스터 관리"
      onClose={onClose}
      width={860}
      footer={
        <div className="tb-modal__actions">
          <button type="button" className="btn btn--sm btn--ghost" onClick={onClose} disabled={loading}>
            닫기
          </button>
          <button type="button" className="btn btn--sm btn--secondary" onClick={onReset} disabled={loading}>
            기본값 초기화
          </button>
        </div>
      }
    >
      <div className="tb-form">
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            className={"btn btn--sm " + (tab === "PROJECTS" ? "btn--primary" : "btn--secondary")}
            onClick={() => setTab("PROJECTS")}
          >
            프로젝트
          </button>
          <button
            type="button"
            className={"btn btn--sm " + (tab === "TYPES" ? "btn--primary" : "btn--secondary")}
            onClick={() => setTab("TYPES")}
          >
            업무 유형
          </button>
          <button
            type="button"
            className={"btn btn--sm " + (tab === "SUBS" ? "btn--primary" : "btn--secondary")}
            onClick={() => setTab("SUBS")}
          >
            업무 하위카테고리
          </button>
          <div style={{ marginLeft: "auto" }} className="text-muted font-small">
            저장: 브라우저 localStorage 기반
          </div>
        </div>

        {tab === "PROJECTS" ? (
          <>
            <div className="text-muted font-small" style={{ marginBottom: 8 }}>
              진행중/예정 칩은 업무보고 화면 좌측 표시용입니다.
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                className="field-input"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="프로젝트명"
                disabled={loading}
              />
              <select
                className="field-input"
                value={newProjectStatus}
                onChange={(e) => setNewProjectStatus(e.target.value)}
                style={{ width: 140 }}
                disabled={loading}
              >
                <option value="CURRENT">진행중</option>
                <option value="PLANNED">예정</option>
                <option value="DONE">완료</option>
                <option value="HOLD">보류</option>
              </select>
              <button type="button" className="btn btn--sm btn--secondary" onClick={onAddProject} disabled={loading}>
                추가
              </button>
            </div>

            <div style={{ height: 12 }} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="settings-chip">진행중 {grouped.current.length}</span>
              <span className="settings-chip">예정 {grouped.planned.length}</span>
              <span className="settings-chip">완료 {grouped.done.length}</span>
              <span className="settings-chip">보류 {grouped.hold.length}</span>
            </div>

            <div style={{ height: 12 }} />

            {(master?.projects || []).length ? (
              <div className="settings-shareList">
                {(master.projects || []).map((p) => (
                  <div key={p.id} className="settings-shareRow" style={{ alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <input
                        className="field-input"
                        value={p.name}
                        disabled={loading}
                        onChange={(e) => updateProject(p.id, { name: e.target.value })}
                      />
                      <div className="text-muted font-small" style={{ marginTop: 4 }}>
                        id: {p.id}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <select
                        className="field-input"
                        value={p.status || "CURRENT"}
                        disabled={loading}
                        onChange={(e) => updateProject(p.id, { status: e.target.value })}
                        style={{ width: 120 }}
                      >
                        <option value="CURRENT">진행중</option>
                        <option value="PLANNED">예정</option>
                        <option value="DONE">완료</option>
                        <option value="HOLD">보류</option>
                      </select>
                      <button
                        type="button"
                        className="btn btn--sm btn--ghost"
                        disabled={loading}
                        onClick={() => {
                          const ok = window.confirm(`프로젝트 "${p.name}" 삭제할까요?`);
                          if (!ok) return;
                          deleteProject(p.id);
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted font-small">프로젝트가 없습니다.</div>
            )}
          </>
        ) : null}

        {tab === "TYPES" ? (
          <>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                className="field-input"
                value={newTypeLabel}
                onChange={(e) => setNewTypeLabel(e.target.value)}
                placeholder="업무 유형 (예: 개발/운영/회의)"
                disabled={loading}
              />
              <button type="button" className="btn btn--sm btn--secondary" onClick={onAddType} disabled={loading}>
                추가
              </button>
            </div>

            <div style={{ height: 12 }} />

            {(master?.workTypes || []).length ? (
              <div className="settings-shareList">
                {(master.workTypes || []).map((t) => (
                  <div key={t.code} className="settings-shareRow" style={{ alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <input
                        className="field-input"
                        value={t.label}
                        disabled={loading}
                        onChange={(e) => updateWorkType(t.code, { label: e.target.value })}
                      />
                      <div className="text-muted font-small" style={{ marginTop: 4 }}>
                        code: {t.code}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn--sm btn--ghost"
                      disabled={loading}
                      onClick={() => {
                        const ok = window.confirm(`업무 유형 "${t.label}" 삭제할까요?`);
                        if (!ok) return;
                        deleteWorkType(t.code);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted font-small">업무 유형이 없습니다.</div>
            )}
          </>
        ) : null}

        {tab === "SUBS" ? (
          <>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                className="field-input"
                value={newSubIcon}
                onChange={(e) => setNewSubIcon(e.target.value)}
                placeholder="아이콘(선택) 예: 🔧"
                style={{ width: 160 }}
                disabled={loading}
              />
              <input
                className="field-input"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="하위카테고리명"
                disabled={loading}
              />
              <button type="button" className="btn btn--sm btn--secondary" onClick={onAddSub} disabled={loading}>
                추가
              </button>
            </div>

            <div style={{ height: 12 }} />

            {(master?.subCategories || []).length ? (
              <div className="settings-shareList">
                {(master.subCategories || []).map((s) => (
                  <div key={s.id} className="settings-shareRow" style={{ alignItems: "center" }}>
                    <div style={{ flex: 1, display: "flex", gap: 8 }}>
                      <input
                        className="field-input"
                        value={s.icon || ""}
                        disabled={loading}
                        onChange={(e) => updateSubCategory(s.id, { icon: e.target.value })}
                        style={{ width: 120 }}
                      />
                      <input
                        className="field-input"
                        value={s.name}
                        disabled={loading}
                        onChange={(e) => updateSubCategory(s.id, { name: e.target.value })}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn--sm btn--ghost"
                      disabled={loading}
                      onClick={() => {
                        const ok = window.confirm(`하위카테고리 "${(s.icon || "") + " " + s.name}" 삭제할까요?`);
                        if (!ok) return;
                        deleteSubCategory(s.id);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted font-small">업무 하위카테고리가 없습니다.</div>
            )}
          </>
        ) : null}

        <div style={{ height: 8 }} />
        <div className="text-muted font-small">
          마지막 업데이트: {master?.updatedAt ? new Date(master.updatedAt).toLocaleString() : "-"}
        </div>
      </div>
    </Modal>
  );
}
