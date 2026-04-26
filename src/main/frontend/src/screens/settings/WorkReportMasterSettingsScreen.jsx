// FILE: src/main/frontend/src/screens/settings/WorkReportMasterSettingsScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { SettingsLayout } from "./SettingsLayout";
import { categoryApi, workApi } from "../../services/localMockApi";
import {
  buildDefaultWorkReportMaster,
  loadWorkReportMaster,
  saveWorkReportMaster,
  useWorkReportMaster,
} from "../../shared/hooks/useWorkReportMaster";
import Button from "../../components/common/Button";
import TextInput from "../../components/common/TextInput";
import { Checkbox } from "../../components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

function groupProjects(list) {
  const arr = Array.isArray(list) ? list : [];
  return {
    current: arr.filter((p) => p.status === "CURRENT"),
    planned: arr.filter((p) => p.status === "PLANNED"),
    done: arr.filter((p) => p.status === "DONE"),
    hold: arr.filter((p) => p.status === "HOLD"),
  };
}

export default function WorkReportMasterSettingsScreen() {
  const [tab, setTab] = useState("PROJECTS"); // PROJECTS | TYPES | SUBS
  const [loading, setLoading] = useState(false);

  // Inputs
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

  // 프로젝트 상태 
  const statusOptions = [
    { value: "CURRENT", label: "진행중" },
    { value: "PLANNED", label: "예정" },
    { value: "DONE", label: "완료" },
    { value: "HOLD", label: "보류" }
  ];
  const [status, setStatus] = useState("PLANNED");
  useEffect(() => {
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
  }, [setDefaultsIfEmpty]);

  const onReset = async () => {
    if (!window.confirm("기본값으로 초기화할까요?")) return;
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

  return (
    <SettingsLayout title="업무보고 마스터 관리" description="프로젝트, 업무 유형, 하위 카테고리를 관리합니다.">
        <div className="settings-tab-group">
          {["PROJECTS", "TYPES", "SUBS"].map((t) => (
            <button
              key={t}
              className={`settings-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "PROJECTS" ? "프로젝트" : t === "TYPES" ? "업무 유형" : "하위 카테고리"}
            </button>
          ))}
          <div className="ml-auto">
            <Button size="sm" variant="ghost" onClick={onReset} disabled={loading}>초기화</Button>
          </div>
        </div>

        {tab === "PROJECTS" && (
          <>
            <div className="settings-input-row">
              <div className="flex-1">
                <div className="field">
                  <label className="field__label">새 프로젝트</label>
                  <input className="field__control"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="프로젝트명 입력"
                  />
                </div>
              </div>
              <div className="settings-row__control">
                {/*<Select
                  label="상태"
                  value={newProjectStatus}
                  onChange={(e) => setNewProjectStatus(e.target.value)}
                  options={[
                    { value: "CURRENT", label: "진행중" },
                    { value: "PLANNED", label: "예정" },
                    { value: "DONE", label: "완료" },
                    { value: "HOLD", label: "보류" },
                  ]}
                />*/}
                {/* 3. shadcn/ui Select 컴포넌트 구조 */}
                <Select onValueChange={setNewProjectStatus} value={newProjectStatus}>
                  {/* 트리거: 클릭했을 때 보이는 버튼 영역 */}
                  <SelectTrigger className="w-full bg-background border-primary">
                    <SelectValue placeholder="프로젝트 상태" />
                  </SelectTrigger>

                  {/* 컨텐츠: 클릭 시 열리는 드롭다운 목록 */}
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => {
                  if (newProjectName.trim()) { addProject(newProjectName, newProjectStatus); setNewProjectName(""); setNewProjectStatus("CURRENT"); }
                }}>추가</Button>
            </div>

            <div className="flex gap-2 mb-4 text-xs text-muted">
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">진행중 {grouped.current.length}</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">예정 {grouped.planned.length}</span>
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded">완료 {grouped.done.length}</span>
            </div>

            <div className="space-y-2">
              {master?.projects?.map((p) => (
                <div key={p.id} className="settings-list-item">
                  <div className="flex-1">
                    <input
                      className="w-full font-medium bg-transparent border-none focus:ring-0 p-0 text-slate-700 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded px-2 py-1 transition-all"
                      value={p.name}
                      onChange={(e) => updateProject(p.id, { name: e.target.value })}
                    />
                  </div>
                  {/* 3. shadcn/ui Select 컴포넌트 구조 */}
                  <Select onValueChange={(newStatus) => updateProject(p.id, { status: newStatus })} value={p.status}>
                    {/* 트리거: 클릭했을 때 보이는 버튼 영역 */}
                    <SelectTrigger className="w-[120px] bg-background border-primary">
                      <SelectValue placeholder="상태" />
                    </SelectTrigger>
                    {/* 컨텐츠: 클릭 시 열리는 드롭다운 목록 */}
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="ghost" onClick={() => deleteProject(p.id)}>삭제</Button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "TYPES" && (
          <>
            <div className="settings-input-row">
              <div className="flex-1">
                <div className="field">
                  <label className="field__label">새 업무 유형</label>
                  <input className="field__control"
                    value={newTypeLabel}
                    onChange={(e) => setNewTypeLabel(e.target.value)}
                    placeholder="예: 개발, 디자인, 회의"
                  />
                </div>
              </div>
              <Button onClick={() => { addWorkType(newTypeLabel); setNewTypeLabel(""); }}>추가</Button>
            </div>

            <div className="space-y-2">
              {master?.workTypes?.map((t) => (
                <div key={t.code} className="settings-list-item">
                  <div className="flex-1">
                    <input
                      className="w-full font-medium bg-transparent border-none focus:ring-0 p-0 text-slate-700 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded px-2 py-1 transition-all"
                      value={t.label}
                      onChange={(e) => updateWorkType(t.code, { label: e.target.value })}
                    />
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => deleteWorkType(t.code)}>삭제</Button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "SUBS" && (
          <>
            <div className="settings-input-row">
              <div className="w-20">
                <div className="field">
                  <label className="field__label">아이콘</label>
                  <input className="field__control text-center"
                    value={newSubIcon}
                    onChange={(e) => setNewSubIcon(e.target.value)}
                    placeholder="🔧"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="field">
                  <label className="field__label">하위 카테고리명</label>
                  <input className="field__control"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder="예: 백엔드, 프론트엔드"
                  />
                </div>
              </div>
              <Button onClick={() => { addSubCategory(newSubName, newSubIcon); setNewSubName(""); setNewSubIcon(""); }}>추가</Button>
            </div>

            <div className="space-y-2">
              {master?.subCategories?.map((s) => (
                <div key={s.id} className="settings-list-item">
                  <div className="w-10 text-center text-lg">
                    <input
                      className="w-full text-center bg-transparent border-none focus:ring-0 p-0 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded transition-all"
                      value={s.icon || ""}
                      onChange={(e) => updateSubCategory(s.id, { icon: e.target.value })}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      className="w-full font-medium bg-transparent border-none focus:ring-0 p-0 text-slate-700 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded px-2 py-1 transition-all"
                      value={s.name}
                      onChange={(e) => updateSubCategory(s.id, { name: e.target.value })}
                    />
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => deleteSubCategory(s.id)}>삭제</Button>
                </div>
              ))}
            </div>
          </>
        )}
    </SettingsLayout>
  );
}