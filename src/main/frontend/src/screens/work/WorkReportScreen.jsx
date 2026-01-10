// FILE: src/main/frontend/src/screens/work/WorkReportScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { categoryApi, workApi, statsApi, aiApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

// 마스터(프로젝트/유형/하위) 관리: localStorage 기반
import {
  buildDefaultWorkReportMaster,
  loadWorkReportMaster,
  saveWorkReportMaster,
  useWorkReportMaster,
} from "../../shared/hooks/useWorkReportMaster";

// 마스터 관리 UI(탭/CRUD)
import WorkReportMasterModal from "../settings/WorkReportMasterModal";

function parseYmdToLocalDate(ymd) {
  const [yy, mm, dd] = String(ymd || "")
    .split("-")
    .map((x) => parseInt(x, 10));
  if (!yy || !mm || !dd) return new Date();
  return new Date(yy, mm - 1, dd, 0, 0, 0, 0);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toYmd(d) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

function buildKey(scope, baseDateStr) {
  const d = parseYmdToLocalDate(baseDateStr);
  return `${scope}_${toYmd(d)}`;
}

function toClipboard(text) {
  if (!navigator.clipboard) return Promise.reject(new Error("ClipboardNotSupported"));
  return navigator.clipboard.writeText(text);
}

function scopeLabel(scope) {
  return scope === "DAY" ? "일간" : scope === "WEEK" ? "주간" : scope === "MONTH" ? "월간" : "연간";
}

function safeUrl(u) {
  const s = String(u || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.includes(".") && !s.includes(" ")) return `https://${s}`;
  return s;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function uniqueId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function splitNonEmptyLines(text) {
  return String(text || "")
    .split("\n")
    .map((x) => x.replace(/\r/g, "").trim())
    .filter((x) => !!x);
}

function dedupAppendLines(baseText, extraLines) {
  const baseLines = splitNonEmptyLines(baseText);
  const set = new Set(baseLines);
  const add = Array.isArray(extraLines) ? extraLines : [];
  const merged = [...baseLines];
  for (const ln of add) {
    const v = String(ln || "").trim();
    if (!v) continue;
    if (set.has(v)) continue;
    set.add(v);
    merged.push(v);
  }
  return merged.join("\n");
}

function sumHours(blocks) {
  const arr = Array.isArray(blocks) ? blocks : [];
  return Math.round(arr.reduce((s, b) => s + (Number(b?.hours || 0) || 0), 0) * 10) / 10;
}

function startOfWeekMonday(d) {
  const x = new Date(d);
  const day = x.getDay(); // 0 Sun..6 Sat
  const diff = (day + 6) % 7; // Mon=0, Sun=6
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfWeekMonday(d) {
  const s = startOfWeekMonday(d);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  e.setHours(0, 0, 0, 0);
  return e;
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 0, 0, 0, 0);
}

function startOfYear(d) {
  return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
}

function endOfYear(d) {
  return new Date(d.getFullYear(), 11, 31, 0, 0, 0, 0);
}

// "n월 m주차" 계산(월요일 시작). 조직별 정의가 다를 수 있어 조정 포인트.
function weekOfMonthMondayStart(d) {
  const first = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
  const firstDay = first.getDay(); // 0 Sun..6 Sat
  const offset = (firstDay + 6) % 7; // Mon=0..Sun=6
  const wom = Math.ceil((d.getDate() + offset) / 7);
  return clamp(wom, 1, 6);
}

function getScopeRange(scope, baseDateYmd) {
  const base = parseYmdToLocalDate(baseDateYmd);
  if (scope === "DAY") {
    const ymd = toYmd(base);
    return { from: ymd, to: ymd };
  }
  if (scope === "WEEK") {
    const s = startOfWeekMonday(base);
    const e = endOfWeekMonday(base);
    return { from: toYmd(s), to: toYmd(e) };
  }
  if (scope === "MONTH") {
    const s = startOfMonth(base);
    const e = endOfMonth(base);
    return { from: toYmd(s), to: toYmd(e) };
  }
  const s = startOfYear(base);
  const e = endOfYear(base);
  return { from: toYmd(s), to: toYmd(e) };
}

function snapBaseDateForScope(scope, baseDateYmd) {
  const d = parseYmdToLocalDate(baseDateYmd);
  if (scope === "DAY") return toYmd(d);
  if (scope === "WEEK") return toYmd(startOfWeekMonday(d));
  if (scope === "MONTH") return toYmd(startOfMonth(d));
  return toYmd(startOfYear(d));
}

function buildAutoTitle(scope, baseDateYmd) {
  const base = parseYmdToLocalDate(baseDateYmd);

  if (scope === "DAY") {
    return `${toYmd(base)} 일간업무보고`;
  }
  if (scope === "WEEK") {
    const s = startOfWeekMonday(base);
    const y = s.getFullYear();
    const m = s.getMonth() + 1;
    const w = weekOfMonthMondayStart(s);
    return `${y}년 ${m}월 ${w}주차 주간업무보고`;
  }
  if (scope === "MONTH") {
    const y = base.getFullYear();
    const m = base.getMonth() + 1;
    return `${y}년 ${m}월 월간업무보고`;
  }
  return `${base.getFullYear()}년 연간업무보고`;
}

function csvEscape(v) {
  const s = String(v ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(filename, rows) {
  try {
    const bom = "\uFEFF";
    const body = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([bom + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("CSV download failed:", e);
    alert("다운로드 실패: 브라우저 다운로드 권한/설정을 확인하세요.");
  }
}

function makeProjectsById(projects) {
  const map = new Map();
  (Array.isArray(projects) ? projects : []).forEach((p) => map.set(String(p.id), p));
  return map;
}

function groupProjectsByStatus(projects) {
  const arr = Array.isArray(projects) ? projects : [];
  return {
    CURRENT: arr.filter((p) => p.status === "CURRENT"),
    PLANNED: arr.filter((p) => p.status === "PLANNED"),
    DONE: arr.filter((p) => p.status === "DONE"),
    HOLD: arr.filter((p) => p.status === "HOLD"),
  };
}

/**
 * 일간 보고서들로부터 주/월/연 리포트 블록 자동 생성(임시: localStorage 직접 조회)
 * - timeflow_mock_db_v1.workReports 구조를 기준
 * - DAY_YYYY-MM-DD 키의 report.blocks를 집계
 */
function loadAllWorkReportsFromLocalDb() {
  try {
    const raw = window.localStorage.getItem("timeflow_mock_db_v1");
    if (!raw) return [];
    const db = JSON.parse(raw);
    const map = db?.workReports || {};
    return Object.keys(map).map((k) => {
      const [scope, baseDate] = String(k).split("_");
      return { key: k, scope, baseDate, report: map[k] };
    });
  } catch {
    return [];
  }
}

function isYmdInRange(ymd, fromYmd, toYmd) {
  const a = String(ymd || "");
  const f = String(fromYmd || "");
  const t = String(toYmd || "");
  if (!a || !f || !t) return false;
  return a >= f && a <= t;
}

function deriveBlocksFromDailyReports({ fromYmd, toYmd, projectsById }) {
  const all = loadAllWorkReportsFromLocalDb();
  const days = all.filter((x) => x.scope === "DAY" && isYmdInRange(x.baseDate, fromYmd, toYmd));

  const agg = new Map(); // projectId -> { projectId, projectName, hours, lines[] }

  for (const d of days) {
    const blocks = d?.report?.blocks;
    if (!Array.isArray(blocks)) continue;

    for (const b of blocks) {
      const projectId = String(b?.projectId || "").trim();
      if (!projectId) continue;

      const projectName =
        String(b?.projectName || "").trim() ||
        String(projectsById.get(projectId)?.name || "").trim() ||
        projectId;

      const hours = Number(b?.hours || 0) || 0;

      let lines = [];
      if (b?.itemsText != null) {
        lines = splitNonEmptyLines(b.itemsText);
      } else if (Array.isArray(b?.items)) {
        lines = b.items.map((x) => String(x?.text || "").trim()).filter(Boolean);
      }

      const datedLines = lines.map((ln) => {
        const v = String(ln || "").trim();
        if (!v) return "";
        if (v.startsWith("-")) return `- [${d.baseDate}] ${v.replace(/^-+\s*/, "")}`;
        return `- [${d.baseDate}] ${v}`;
      });

      const prev = agg.get(projectId) || { projectId, projectName, hours: 0, lines: [] };
      prev.projectName = projectName || prev.projectName;
      prev.hours = Math.round((prev.hours + hours) * 10) / 10;
      prev.lines.push(...datedLines.filter(Boolean));
      agg.set(projectId, prev);
    }
  }

  return Array.from(agg.values())
    .sort((a, b) => (b.hours || 0) - (a.hours || 0))
    .map((x) => ({
      id: uniqueId("blk"),
      projectId: x.projectId,
      projectName: x.projectName,
      hours: x.hours || 0,
      itemsText: dedupAppendLines("", x.lines),
    }));
}

function mergeBlocks(existingBlocks, derivedBlocks, projectsById) {
  const a = Array.isArray(existingBlocks) ? existingBlocks : [];
  const b = Array.isArray(derivedBlocks) ? derivedBlocks : [];

  const map = new Map(); // projectId -> block
  for (const blk of a) {
    const pid = String(blk?.projectId || "").trim();
    if (!pid) continue;
    map.set(pid, {
      id: blk.id || uniqueId("blk"),
      projectId: pid,
      projectName:
        String(blk.projectName || "").trim() ||
        String(projectsById.get(pid)?.name || "").trim() ||
        pid,
      hours: Number(blk.hours ?? 0),
      itemsText: String(blk.itemsText || ""),
    });
  }

  for (const d of b) {
    const pid = String(d?.projectId || "").trim();
    if (!pid) continue;

    const derivedName =
      String(d.projectName || "").trim() || String(projectsById.get(pid)?.name || "").trim() || pid;

    const derivedHours = Number(d.hours ?? 0);
    const derivedLines = splitNonEmptyLines(d.itemsText);

    if (!map.has(pid)) {
      map.set(pid, {
        id: d.id || uniqueId("blk"),
        projectId: pid,
        projectName: derivedName,
        hours: derivedHours || 0,
        itemsText: splitNonEmptyLines(d.itemsText).join("\n"),
      });
      continue;
    }

    const cur = map.get(pid);

    // 병합 정책:
    // - hours: 사용자가 이미 값(>0)을 넣었다면 유지, 아니면 derived 사용
    const curHours = Number(cur.hours ?? 0) || 0;
    const nextHours = curHours > 0 ? curHours : derivedHours || 0;

    // - items: 기존 + derived 중복 제거 후 append
    const nextItemsText = dedupAppendLines(cur.itemsText, derivedLines);

    map.set(pid, {
      ...cur,
      projectName: cur.projectName || derivedName,
      hours: Math.round(nextHours * 10) / 10,
      itemsText: nextItemsText,
    });
  }

  return Array.from(map.values()).sort((x, y) => (Number(y.hours || 0) || 0) - (Number(x.hours || 0) || 0));
}

export default function WorkReportScreen() {
  const [scope, setScope] = useState("DAY"); // DAY | WEEK | MONTH | YEAR
  const [baseDate, setBaseDate] = useState(() => toYmd(new Date()));
  const [loading, setLoading] = useState(false);

  // 마스터 CRUD는 모달에서, 빠른 추가는 좌측에서
  const [openMaster, setOpenMaster] = useState(false);
  const [quickProjectName, setQuickProjectName] = useState("");
  const [quickProjectStatus, setQuickProjectStatus] = useState("CURRENT");

  // 필터(PvsA 표/집계에만 영향)
  const [filters, setFilters] = useState({
    projectId: "ALL",
    workType: "ALL",
    subCategoryId: "ALL",
    includeNonWork: false,
    includeUnclassified: true,
  });

  // 리포트(저장되는 본문)
  const [report, setReport] = useState({
    title: "",
    blocks: [], // [{ id, projectId, projectName, hours, itemsText }]
    memo: "",
    evidenceLinks: [],
    confirmedAt: null,
    updatedAt: null,
  });

  // 화면용 계산 결과(저장 X)
  const [pva, setPva] = useState({
    summary: { planTotal: 0, actualTotal: 0, rate: 0 },
    byProject: [],
    byType: [],
    bySubCategory: [],
    disclaimer: "",
  });

  // AI 요약(임시 출력)
  const [ai, setAi] = useState(null);

  const snappedBaseDate = useMemo(() => snapBaseDateForScope(scope, baseDate), [scope, baseDate]);
  const key = useMemo(() => buildKey(scope, snappedBaseDate), [scope, snappedBaseDate]);

  const title = useMemo(() => buildAutoTitle(scope, snappedBaseDate), [scope, snappedBaseDate]);
  const range = useMemo(() => getScopeRange(scope, snappedBaseDate), [scope, snappedBaseDate]);

  const isLocked = !!report.confirmedAt;

  // 마스터(프로젝트/유형/하위) 구독
  const { master, reload, addProject } = useWorkReportMaster({ subscribe: true });

  const projectOptions = useMemo(() => master?.projects || [], [master?.projects]);
  const workTypeOptions = useMemo(() => master?.workTypes || [], [master?.workTypes]);
  const subCategoryOptions = useMemo(() => master?.subCategories || [], [master?.subCategories]);
  const projectsById = useMemo(() => makeProjectsById(projectOptions), [projectOptions]);

  const projectGroups = useMemo(() => groupProjectsByStatus(projectOptions), [projectOptions]);

  function normalizeSavedReport(saved, localProjectsById) {
    const base = {
      title,
      blocks: [],
      memo: "",
      evidenceLinks: [],
      confirmedAt: null,
      updatedAt: null,
    };

    if (!saved || typeof saved !== "object") return base;

    const evidenceLinks = Array.isArray(saved.evidenceLinks) ? saved.evidenceLinks : [];
    const blocks = Array.isArray(saved.blocks) ? saved.blocks : [];

    const normalizedBlocks = blocks
      .map((b) => {
        const pid = String(b?.projectId || "").trim();
        if (!pid) return null;

        const pname =
          String(localProjectsById.get(pid)?.name || "").trim() ||
          String(b?.projectName || "").trim() ||
          pid;

        return {
          id: b?.id || uniqueId("blk"),
          projectId: pid,
          projectName: pname,
          hours: Number(b?.hours ?? 0) || 0,
          itemsText: String(b?.itemsText || ""),
        };
      })
      .filter(Boolean);

    return {
      ...base,
      ...saved,
      title, // 타이틀은 항상 자동 생성
      memo: String(saved.memo || ""),
      evidenceLinks,
      blocks: normalizedBlocks,
    };
  }

  async function refreshPva(s, d, f) {
    const r = await statsApi.getWorkCompare({ scope: s, baseDate: d, filters: f });
    setPva(r);
  }

  function ensureMasterInitialized(metaData, categories) {
    const cur = loadWorkReportMaster(null);
    const hasAny =
      !!cur &&
      (Array.isArray(cur.projects) ? cur.projects.length : 0) +
        (Array.isArray(cur.workTypes) ? cur.workTypes.length : 0) +
        (Array.isArray(cur.subCategories) ? cur.subCategories.length : 0) >
        0;

    if (hasAny) return cur;

    const defaults = buildDefaultWorkReportMaster(metaData, categories);
    const saved = saveWorkReportMaster(defaults);
    return saved;
  }

  async function loadAll() {
    setLoading(true);
    try {
      const [cats, metaData, saved] = await Promise.all([
        categoryApi.listCategories(),
        workApi.listMeta(),
        workApi.getReport(key),
      ]);

      // 마스터가 비어있으면 기본값 생성(로컬 저장)
      const masterSnapshot = ensureMasterInitialized(metaData, cats);
      reload();

      const localProjectsById = makeProjectsById(masterSnapshot?.projects || []);

      const normalized = normalizeSavedReport(saved, localProjectsById);

      if (scope === "DAY") {
        const hasBlocks = (normalized.blocks || []).length > 0;
        const firstProject = (masterSnapshot?.projects || [])[0];

        const defaultBlocks = hasBlocks
          ? normalized.blocks
          : firstProject
          ? [
              {
                id: uniqueId("blk"),
                projectId: String(firstProject.id),
                projectName: String(firstProject.name),
                hours: 0,
                itemsText: "- ",
              },
            ]
          : [];

        setReport({
          ...normalized,
          blocks: defaultBlocks,
          title,
        });
      } else {
        // 주/월/연: 일간 기반 자동 집계 -> 병합
        const derived = deriveBlocksFromDailyReports({
          fromYmd: range.from,
          toYmd: range.to,
          projectsById: localProjectsById,
        });

        const mergedBlocks = mergeBlocks(normalized.blocks, derived, localProjectsById);

        setReport({
          ...normalized,
          blocks: mergedBlocks,
          title,
        });
      }

      await refreshPva(scope, snappedBaseDate, filters);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    refreshPva(scope, snappedBaseDate, filters).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, snappedBaseDate, filters]);

  async function save() {
    setLoading(true);
    try {
      const blocks = (report.blocks || []).map((b) => {
        const pid = String(b.projectId || "").trim();
        const pname = String(projectsById.get(pid)?.name || b.projectName || pid).trim() || pid;
        return {
          id: b.id || uniqueId("blk"),
          projectId: pid,
          projectName: pname,
          hours: Number(b.hours ?? 0) || 0,
          itemsText: String(b.itemsText || ""),
        };
      });

      const payload = {
        ...report,
        title, // 항상 자동 생성
        blocks,
      };

      await workApi.saveReport(key, payload);
      alert("저장되었습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function confirm() {
    setLoading(true);
    try {
      const updated = await workApi.confirmReport(key);
      if (updated) setReport((p) => ({ ...p, ...updated, title }));
      alert("확정되었습니다. (옵션: 확정 기간 잠금)");
    } finally {
      setLoading(false);
    }
  }

  async function unconfirm() {
    setLoading(true);
    try {
      const updated = await workApi.unconfirmReport(key);
      if (updated) setReport((p) => ({ ...p, ...updated, title }));
      alert("확정이 취소되었습니다.");
    } finally {
      setLoading(false);
    }
  }

  function mergeEvidence(oldList, newList) {
    const a = Array.isArray(oldList) ? oldList : [];
    const b = Array.isArray(newList) ? newList : [];
    const map = new Map();
    [...a, ...b].forEach((x) => {
      const url = safeUrl(x?.url);
      if (!url) return;
      map.set(url, {
        id: x?.id || `ev_${url}`,
        label: String(x?.label || "").trim() || url,
        url,
      });
    });
    return Array.from(map.values());
  }

  function addEvidenceLink() {
    if (isLocked) return;
    const url = safeUrl(prompt("근거 URL을 입력하세요 (http/https 권장):") || "");
    if (!url) return;
    const label = (prompt("표시 이름(선택):") || "").trim();

    setReport((p) => ({
      ...p,
      evidenceLinks: mergeEvidence(p.evidenceLinks, [{ id: `ev_${Date.now()}`, label, url }]),
    }));
  }

  function removeEvidence(url) {
    if (isLocked) return;
    setReport((p) => ({
      ...p,
      evidenceLinks: (p.evidenceLinks || []).filter((x) => safeUrl(x.url) !== safeUrl(url)),
    }));
  }

  function addProjectBlock() {
    if (isLocked) return;

    const used = new Set((report.blocks || []).map((b) => String(b.projectId)));
    const firstUnused = (projectOptions || []).find((p) => !used.has(String(p.id)));
    const pick = firstUnused || (projectOptions || [])[0];

    if (!pick) {
      alert("프로젝트 마스터가 비어 있습니다. 좌측에서 “마스터 관리”로 프로젝트를 먼저 추가하세요.");
      return;
    }

    setReport((p) => ({
      ...p,
      blocks: [
        ...(p.blocks || []),
        {
          id: uniqueId("blk"),
          projectId: String(pick.id),
          projectName: String(pick.name),
          hours: 0,
          itemsText: "- ",
        },
      ],
    }));
  }

  function removeProjectBlock(blockId) {
    if (isLocked) return;
    setReport((p) => ({
      ...p,
      blocks: (p.blocks || []).filter((b) => b.id !== blockId),
    }));
  }

  function updateBlock(blockId, patch) {
    if (isLocked) return;
    setReport((p) => ({
      ...p,
      blocks: (p.blocks || []).map((b) => (b.id === blockId ? { ...b, ...patch } : b)),
    }));
  }

  function quickAddProject() {
    if (isLocked) return;

    const nm = String(quickProjectName || "").trim();
    if (!nm) return alert("프로젝트명을 입력하세요.");
    if (nm.length > 50) return alert("프로젝트명은 50자 이내로 입력하세요.");

    try {
      // addProject는 localStorage 저장 + 이벤트 발생
      addProject(nm, quickProjectStatus);
      setQuickProjectName("");
      setQuickProjectStatus("CURRENT");
      alert("프로젝트가 추가되었습니다. (마스터에 저장됨)");
    } catch (e) {
      const msg = String(e?.message || e);
      if (msg === "ProjectNameDuplicate") return alert("이미 존재하는 프로젝트명입니다.");
      return alert("프로젝트 추가 실패: 이름을 확인하세요.");
    }
  }

  async function genAi() {
    setLoading(true);
    try {
      const res = await aiApi.generate({ scope, baseDate: snappedBaseDate });
      setAi(res);
    } finally {
      setLoading(false);
    }
  }

  function insertAiToMemo() {
    if (!ai || isLocked) return;
    const lines = [
      "### AI Highlights",
      ...((ai.highlights || []).map((x) => `- ${x}`)),
      "",
      "### AI Insights",
      ...((ai.insights || []).map((x) => `- ${x}`)),
      "",
      "### AI Next Actions",
      ...((ai.nextActions || []).map((x) => `- ${x}`)),
    ].join("\n");
    setReport((p) => ({ ...p, memo: (p.memo ? p.memo + "\n\n" : "") + lines }));
  }

  function rebuildFromDailyAndMerge() {
    if (scope === "DAY") {
      alert("이 기능은 주/월/연에서만 동작합니다.");
      return;
    }
    if (isLocked) return;

    const derived = deriveBlocksFromDailyReports({
      fromYmd: range.from,
      toYmd: range.to,
      projectsById,
    });

    setReport((p) => ({
      ...p,
      title,
      blocks: mergeBlocks(p.blocks, derived, projectsById),
    }));

    alert("일간 업무보고 기반으로 병합되었습니다.");
  }

  function exportCsvSummary() {
    const blocks = Array.isArray(report.blocks) ? report.blocks : [];
    const rows = [
      ["Scope", scope, "BaseDate", snappedBaseDate, "From", range.from, "To", range.to],
      [],
      ["프로젝트", "공수(h)", "항목수"],
      ...blocks.map((b) => {
        const lines = splitNonEmptyLines(b.itemsText);
        return [b.projectName || b.projectId, Number(b.hours ?? 0) || 0, lines.length];
      }),
      [],
      ["총 공수(h)", sumHours(blocks)],
    ];

    downloadCsv(`work_report_summary_${scope}_${snappedBaseDate}.csv`, rows);
  }

  function exportCsvDetails() {
    const blocks = Array.isArray(report.blocks) ? report.blocks : [];
    const rows = [
      ["Scope", scope, "BaseDate", snappedBaseDate, "From", range.from, "To", range.to],
      [],
      ["프로젝트", "공수(h)", "항목"],
    ];

    for (const b of blocks) {
      const pname = b.projectName || b.projectId;
      const hours = Number(b.hours ?? 0) || 0;
      const lines = splitNonEmptyLines(b.itemsText);
      if (lines.length === 0) {
        rows.push([pname, hours, ""]);
      } else {
        for (const ln of lines) rows.push([pname, hours, ln]);
      }
    }

    downloadCsv(`work_report_details_${scope}_${snappedBaseDate}.csv`, rows);
  }

  async function copy() {
    const blocks = Array.isArray(report.blocks) ? report.blocks : [];
    const evidence = (report.evidenceLinks || [])
      .map((e) => `- ${e.label || e.url} (${e.url})`)
      .join("\n");

    const blockText = blocks
      .map((b) => {
        const hrs = Number(b.hours ?? 0) || 0;
        const items = splitNonEmptyLines(b.itemsText);
        const itemsMd = items.length ? items.map((x) => (x.startsWith("-") ? x : `- ${x}`)).join("\n") : "- (없음)";
        return [`## ${b.projectName || b.projectId} : ${hrs}h`, itemsMd].join("\n");
      })
      .join("\n\n");

    const pvaTable = (rows) =>
      (rows || [])
        .map((r) => `- ${r.name}: Plan ${r.planHours}h / Actual ${r.actualHours}h (${r.rate}%)`)
        .join("\n");

    const text = [
      `# ${title}`,
      `- 기준일: ${snappedBaseDate}`,
      `- 기간: ${scopeLabel(scope)} (${range.from} ~ ${range.to})`,
      report.confirmedAt ? `- 확정: ${report.confirmedAt}` : `- 확정: (미확정)`,
      `- 총 공수: ${sumHours(blocks)}h`,
      "",
      blockText || "## (프로젝트 블록 없음)",
      "",
      report.memo ? "## 메모\n" + report.memo : "",
      "",
      "## 근거 링크",
      evidence || "- (없음)",
      "",
      "## PvsA(요약)",
      `- Actual ${pva.summary?.actualTotal ?? 0}h / Plan ${pva.summary?.planTotal ?? 0}h (${pva.summary?.rate ?? 0}%)`,
      "",
      "### PvsA(프로젝트별)",
      pvaTable(pva.byProject),
      "",
      "### PvsA(업무유형별)",
      pvaTable(pva.byType),
      "",
      "### PvsA(하위카테고리별)",
      pvaTable(pva.bySubCategory),
      "",
      pva.disclaimer ? `※ ${pva.disclaimer}` : "",
    ]
      .filter((x) => x !== null && x !== undefined && x !== "")
      .join("\n");

    try {
      await toClipboard(text);
      alert("클립보드에 복사되었습니다.");
    } catch {
      alert("복사 실패: 브라우저 클립보드 권한을 확인하세요.");
    }
  }

  const pvaSummary = useMemo(() => {
    const { planTotal, actualTotal, rate } = pva.summary || { planTotal: 0, actualTotal: 0, rate: 0 };
    const bar = Math.max(0, Math.min(100, rate || 0));
    return { planTotal, actualTotal, rate, bar };
  }, [pva]);

  const duplicateProjectIds = useMemo(() => {
    const ids = (report.blocks || []).map((b) => String(b.projectId || ""));
    const map = new Map();
    ids.forEach((id) => map.set(id, (map.get(id) || 0) + 1));
    return new Set(Array.from(map.entries()).filter(([, c]) => c >= 2).map(([id]) => id));
  }, [report.blocks]);

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">업무 리포트</div>
          <div className="tf-subtitle">
            프로젝트 블록 + 공수(수기) + 항목(텍스트) · 주/월/연은 일간 업무보고 기반 자동 집계/병합 · 마스터(프로젝트/유형/하위) 사용자 관리
          </div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={loadAll} disabled={loading}>
            새로고침
          </button>
          {scope !== "DAY" ? (
            <button className="tf-btn" onClick={rebuildFromDailyAndMerge} disabled={loading || isLocked}>
              일간 기반 병합
            </button>
          ) : null}
          <button className="tf-btn" onClick={genAi} disabled={loading}>
            AI 요약 생성
          </button>
          <button className="tf-btn" onClick={exportCsvSummary} disabled={loading}>
            CSV(요약)
          </button>
          <button className="tf-btn" onClick={exportCsvDetails} disabled={loading}>
            CSV(상세)
          </button>
          <button className="tf-btn" onClick={copy}>
            복사
          </button>
          <button className="tf-btn tf-btn--primary" onClick={save} disabled={loading}>
            저장
          </button>
        </div>
      </div>

      {/* Scope Tabs */}
      <div className="tf-tabs">
        {["DAY", "WEEK", "MONTH", "YEAR"].map((s) => (
          <button
            key={s}
            className={`tf-tab ${scope === s ? "tf-tab--active" : ""}`}
            onClick={() => {
              setScope(s);
              setBaseDate((prev) => snapBaseDateForScope(s, prev));
            }}
            disabled={loading}
            type="button"
          >
            {scopeLabel(s)}
          </button>
        ))}
        <span className="tf-tab-spacer" />
        <span className="tf-badge">
          PvsA {pvaSummary.actualTotal}h / {pvaSummary.planTotal}h ({pvaSummary.rate}%)
        </span>
        <span className="tf-badge">{isLocked ? "확정됨" : "미확정"}</span>
      </div>

      <div className="tf-grid">
        {/* Left */}
        <div className="tf-col-4 tf-card">
          <div className="tf-muted tf-small">설정 / 마스터 / 필터(PvsA용)</div>
          <div className="tf-divider" />

          <div className="tf-small tf-muted">기준일</div>
          <input
            className="tf-input"
            type="date"
            value={snappedBaseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            disabled={loading}
          />

          <div className="tf-divider" />

          <div className="tf-small tf-muted">자동 제목</div>
          <div className="tf-small">{title}</div>
          <div className="tf-small tf-muted" style={{ marginTop: 6 }}>
            기간: {range.from} ~ {range.to}
          </div>

          <div className="tf-divider" />

          {/* 프로젝트 상태(진행중/예정) 칩 */}
          <div className="tf-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div className="tf-small tf-muted">프로젝트(진행중/예정)</div>
            <button className="tf-btn" type="button" disabled={loading} onClick={() => setOpenMaster(true)}>
              마스터 관리
            </button>
          </div>

          <div className="tf-small" style={{ marginTop: 8 }}>
            {projectGroups.CURRENT.length ? (
              <>
                <div className="tf-small tf-muted">진행중</div>
                <div style={{ marginTop: 6 }}>
                  {projectGroups.CURRENT.slice(0, 12).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="tf-chip"
                      style={{ marginRight: 6, marginBottom: 6 }}
                      disabled={loading}
                      onClick={() => setFilters((x) => ({ ...x, projectId: p.id }))}
                      title="클릭하면 필터에 적용"
                    >
                      {p.name}
                    </button>
                  ))}
                  {projectGroups.CURRENT.length > 12 ? (
                    <span className="tf-muted tf-small">+{projectGroups.CURRENT.length - 12}</span>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="tf-muted tf-small" style={{ marginTop: 6 }}>
                진행중 프로젝트 없음
              </div>
            )}

            <div style={{ height: 10 }} />

            {projectGroups.PLANNED.length ? (
              <>
                <div className="tf-small tf-muted">예정</div>
                <div style={{ marginTop: 6 }}>
                  {projectGroups.PLANNED.slice(0, 12).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="tf-chip"
                      style={{ marginRight: 6, marginBottom: 6 }}
                      disabled={loading}
                      onClick={() => setFilters((x) => ({ ...x, projectId: p.id }))}
                      title="클릭하면 필터에 적용"
                    >
                      {p.name}
                    </button>
                  ))}
                  {projectGroups.PLANNED.length > 12 ? (
                    <span className="tf-muted tf-small">+{projectGroups.PLANNED.length - 12}</span>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="tf-muted tf-small">예정 프로젝트 없음</div>
            )}

            <div style={{ height: 10 }} />

            <button
              type="button"
              className="tf-btn"
              disabled={loading}
              onClick={() => setFilters((x) => ({ ...x, projectId: "ALL" }))}
            >
              프로젝트 필터 해제
            </button>
          </div>

          <div className="tf-divider" />

          {/* 빠른 프로젝트 추가(수정/삭제는 “마스터 관리”에서) */}
          <div className="tf-small tf-muted">프로젝트 빠른 추가</div>
          <div className="tf-row" style={{ gap: 8, marginTop: 6 }}>
            <input
              className="tf-input"
              value={quickProjectName}
              onChange={(e) => setQuickProjectName(e.target.value)}
              placeholder="프로젝트명"
              disabled={loading || isLocked}
            />
          </div>
          <div className="tf-row" style={{ gap: 8, marginTop: 6 }}>
            <select
              className="tf-select"
              value={quickProjectStatus}
              onChange={(e) => setQuickProjectStatus(e.target.value)}
              disabled={loading || isLocked}
            >
              <option value="CURRENT">진행중</option>
              <option value="PLANNED">예정</option>
              <option value="DONE">완료</option>
              <option value="HOLD">보류</option>
            </select>
            <button className="tf-btn" type="button" disabled={loading || isLocked} onClick={quickAddProject}>
              추가
            </button>
          </div>

          <div className="tf-divider" />

          {/* 필터 */}
          <div className="tf-small tf-muted">프로젝트(필터)</div>
          <select
            className="tf-select"
            value={filters.projectId}
            onChange={(e) => setFilters((p) => ({ ...p, projectId: e.target.value }))}
            disabled={loading}
          >
            <option value="ALL">전체</option>
            {projectOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="tf-divider" />

          <div className="tf-small tf-muted">업무 유형(필터)</div>
          <select
            className="tf-select"
            value={filters.workType}
            onChange={(e) => setFilters((p) => ({ ...p, workType: e.target.value }))}
            disabled={loading}
          >
            <option value="ALL">전체</option>
            {workTypeOptions.map((t) => (
              <option key={t.code} value={t.code}>
                {t.label}
              </option>
            ))}
          </select>

          <div className="tf-divider" />

          <div className="tf-small tf-muted">업무 하위카테고리(필터)</div>
          <select
            className="tf-select"
            value={filters.subCategoryId}
            onChange={(e) => setFilters((p) => ({ ...p, subCategoryId: e.target.value }))}
            disabled={loading}
          >
            <option value="ALL">전체</option>
            {subCategoryOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {(s.icon || "") + " " + s.name}
              </option>
            ))}
          </select>

          <div className="tf-divider" />

          <div className="tf-row">
            <label className="tf-check">
              <input
                type="checkbox"
                checked={filters.includeNonWork}
                onChange={(e) => setFilters((p) => ({ ...p, includeNonWork: e.target.checked }))}
                disabled={loading}
              />
              <span>업무 외 포함</span>
            </label>

            <label className="tf-check">
              <input
                type="checkbox"
                checked={filters.includeUnclassified}
                onChange={(e) => setFilters((p) => ({ ...p, includeUnclassified: e.target.checked }))}
                disabled={loading}
              />
              <span>미분류 포함</span>
            </label>
          </div>

          <div className="tf-divider" />

          <div className="tf-small tf-muted">공수(PvsA) 진행</div>
          <div className="tf-progress">
            <div style={{ width: `${pvaSummary.bar}%` }} />
          </div>
          <div className="tf-small tf-muted" style={{ marginTop: 6 }}>
            Actual/Plan 달성률 {pvaSummary.rate}% (Mock 집계)
          </div>

          <div className="tf-divider" />

          <div className="tf-row">
            {!isLocked ? (
              <button className="tf-btn tf-btn--primary" onClick={confirm} disabled={loading}>
                확정
              </button>
            ) : (
              <button className="tf-btn tf-btn--danger" onClick={unconfirm} disabled={loading}>
                확정 취소
              </button>
            )}
          </div>

          <div className="tf-divider" />
          <div className="tf-small tf-muted">
            참고: 마스터(프로젝트/유형/하위)는 localStorage 기반입니다. 여러 기기/계정 동기화가 필요하면 서버 테이블+API로 옮겨야 합니다.
            또한 Mock PvsA는 실제 데이터와 매칭되지 않을 수 있어, 사용자 추가 항목은 집계에 바로 반영되지 않을 수 있습니다.
          </div>
        </div>

        {/* Right */}
        <div className="tf-col-8 tf-card">
          <div className="tf-item__top">
            <div>
              <div className="tf-muted tf-small">리포트 본문</div>
              <div className="tf-small tf-muted">
                {isLocked ? "확정됨: 편집 잠금(옵션)" : "편집 가능"} · 총 공수 {sumHours(report.blocks)}h
              </div>
            </div>
            <div className="tf-tags">
              {report.updatedAt ? <span className="tf-tag">업데이트: {report.updatedAt}</span> : null}
              {report.confirmedAt ? <span className="tf-tag">확정: {report.confirmedAt}</span> : null}
            </div>
          </div>

          <div className="tf-divider" />

          <div className="tf-small tf-muted">제목(자동)</div>
          <input className="tf-input" value={title} disabled />

          <div className="tf-divider" />

          <div className="tf-small tf-muted tf-row" style={{ justifyContent: "space-between" }}>
            <span>프로젝트 블록</span>
            <button className="tf-btn" onClick={addProjectBlock} disabled={loading || isLocked} type="button">
              + 프로젝트 추가
            </button>
          </div>

          {(report.blocks || []).length === 0 ? (
            <div className="tf-muted tf-small" style={{ marginTop: 8 }}>
              프로젝트 블록이 없습니다. “+ 프로젝트 추가”로 추가하세요.
            </div>
          ) : (
            <div className="tf-list" style={{ marginTop: 10 }}>
              {(report.blocks || []).map((b) => {
                const dup = duplicateProjectIds.has(String(b.projectId || ""));
                const existsInMaster = projectsById.has(String(b.projectId || ""));
                const safeCurrentOption = existsInMaster ? null : (
                  <option value={String(b.projectId || "")}>
                    (마스터에 없음) {b.projectName || b.projectId}
                  </option>
                );

                return (
                  <div key={b.id} className="tf-item">
                    <div className="tf-item__top" style={{ alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div className="tf-row" style={{ gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div className="tf-small tf-muted">프로젝트</div>
                            <select
                              className="tf-select"
                              value={b.projectId}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (v === "__ADD__") {
                                  const name = prompt("새 프로젝트명을 입력하세요:") || "";
                                  const st = prompt("상태 입력(CURRENT/PLANNED/DONE/HOLD). 비우면 CURRENT:", "") || "";
                                  const status = ["CURRENT", "PLANNED", "DONE", "HOLD"].includes(st.trim().toUpperCase())
                                    ? st.trim().toUpperCase()
                                    : "CURRENT";
                                  try {
                                    addProject(name, status);
                                    const latest = loadWorkReportMaster(null);
                                    const created = (latest?.projects || []).find(
                                      (p) => String(p?.name || "").trim().toLowerCase() === String(name || "").trim().toLowerCase()
                                    );
                                    if (created?.id) {
                                      updateBlock(b.id, { projectId: created.id, projectName: created.name });
                                    }
                                  } catch (err) {
                                    const msg = String(err?.message || err);
                                    if (msg === "ProjectNameDuplicate") return alert("이미 존재하는 프로젝트명입니다.");
                                    return alert("프로젝트 추가 실패: 이름을 확인하세요.");
                                  }
                                  return;
                                }
                                if (v === "__MANAGE__") {
                                  setOpenMaster(true);
                                  return;
                                }

                                const pid = v;
                                const pname = String(projectsById.get(pid)?.name || "").trim() || pid;
                                updateBlock(b.id, { projectId: pid, projectName: pname });
                              }}
                              disabled={loading || isLocked}
                            >
                              {safeCurrentOption}
                              {projectOptions.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                              <option value="__ADD__">+ 새 프로젝트 추가</option>
                              <option value="__MANAGE__">마스터 관리 열기</option>
                            </select>

                            {dup ? (
                              <div className="tf-small tf-muted" style={{ marginTop: 6 }}>
                                동일 프로젝트 블록이 2개 이상입니다. 집계 정확도가 떨어질 수 있어 1개로 합치는 것을 권장합니다.
                              </div>
                            ) : null}

                            {!existsInMaster ? (
                              <div className="tf-small tf-muted" style={{ marginTop: 6 }}>
                                이 블록의 프로젝트가 마스터에서 삭제/변경된 상태입니다. 드롭다운에서 다시 선택하거나 “마스터 관리”에서 복구하세요.
                              </div>
                            ) : null}
                          </div>

                          <div style={{ width: 160 }}>
                            <div className="tf-small tf-muted">공수(h)</div>
                            <input
                              className="tf-input"
                              type="number"
                              min="0"
                              step="0.5"
                              value={Number(b.hours ?? 0)}
                              onChange={(e) => updateBlock(b.id, { hours: Number(e.target.value) || 0 })}
                              disabled={loading || isLocked}
                            />
                          </div>

                          <div style={{ paddingTop: 18 }}>
                            <button
                              className="tf-btn tf-btn--danger"
                              onClick={() => removeProjectBlock(b.id)}
                              disabled={loading || isLocked}
                              type="button"
                            >
                              삭제
                            </button>
                          </div>
                        </div>

                        <div className="tf-divider" style={{ margin: "10px 0" }} />

                        <div className="tf-small tf-muted">항목(한 줄 = 한 항목)</div>
                        <textarea
                          className="tf-textarea"
                          value={b.itemsText || ""}
                          onChange={(e) => updateBlock(b.id, { itemsText: e.target.value })}
                          disabled={loading || isLocked}
                          placeholder="- (예) mariadb 릴리즈 반영 및 QC 요청&#10;- (예) 스케줄러 오류 원인 분석/조치"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="tf-divider" />

          <div className="tf-small tf-muted">메모(선택)</div>
          <textarea
            className="tf-textarea"
            value={report.memo || ""}
            onChange={(e) => setReport((p) => ({ ...p, memo: e.target.value }))}
            disabled={loading || isLocked}
            placeholder="특이사항/회고/지원요청 등을 자유롭게 기록(선택)"
          />

          <div className="tf-divider" />
          <div className="tf-small tf-muted tf-row" style={{ justifyContent: "space-between" }}>
            <span>근거 링크</span>
            <button className="tf-btn" onClick={addEvidenceLink} disabled={loading || isLocked} type="button">
              링크 추가
            </button>
          </div>

          <div className="tf-list">
            {(report.evidenceLinks || []).length === 0 ? (
              <div className="tf-muted tf-small">등록된 근거 링크가 없습니다.</div>
            ) : (
              (report.evidenceLinks || []).map((e) => (
                <div key={e.url} className="tf-item">
                  <div className="tf-item__top">
                    <div>
                      <div className="tf-item__title">{e.label || e.url}</div>
                      <div className="tf-small tf-muted">
                        <a href={safeUrl(e.url)} target="_blank" rel="noreferrer">
                          {safeUrl(e.url)}
                        </a>
                      </div>
                    </div>
                    <button
                      className="tf-btn tf-btn--danger"
                      onClick={() => removeEvidence(e.url)}
                      disabled={loading || isLocked}
                      type="button"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="tf-divider" />

          <div className="tf-small tf-muted">PvsA 상세(표)</div>
          <div className="tf-small tf-muted" style={{ marginTop: 4 }}>
            {pva.disclaimer ? `※ ${pva.disclaimer}` : null}
          </div>

          <div className="tf-grid" style={{ marginTop: 10 }}>
            <div className="tf-col-6">
              <div className="tf-table-title">프로젝트별</div>
              <PvaTable rows={pva.byProject} />
            </div>
            <div className="tf-col-6">
              <div className="tf-table-title">업무유형별</div>
              <PvaTable rows={pva.byType} />
            </div>
            <div className="tf-col-12">
              <div className="tf-table-title">하위카테고리별</div>
              <PvaTable rows={pva.bySubCategory} />
            </div>
          </div>

          <div className="tf-divider" />
          <div className="tf-item">
            <div className="tf-item__top">
              <div>
                <div className="tf-item__title">AI 요약(임시)</div>
                <div className="tf-small tf-muted">현재는 Mock. 생성 후 “메모에 삽입”으로 반영 가능</div>
              </div>
              <div className="tf-row">
                <button className="tf-btn" onClick={insertAiToMemo} disabled={!ai || isLocked} type="button">
                  메모에 삽입
                </button>
              </div>
            </div>

            {!ai ? (
              <div className="tf-muted tf-small" style={{ marginTop: 8 }}>
                아직 생성된 AI 요약이 없습니다. 상단 “AI 요약 생성”을 눌러주세요.
              </div>
            ) : (
              <div style={{ marginTop: 10 }}>
                <div className="tf-badge">{ai.title}</div>
                <div className="tf-divider" />
                <div className="tf-small tf-muted">Highlights</div>
                <ul className="tf-ul">
                  {(ai.highlights || []).map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>

                <div className="tf-small tf-muted">Insights</div>
                <ul className="tf-ul">
                  {(ai.insights || []).map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>

                <div className="tf-small tf-muted">Next Actions</div>
                <ul className="tf-ul">
                  {(ai.nextActions || []).map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>

                {ai.disclaimer ? <div className="tf-small tf-muted">※ {ai.disclaimer}</div> : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 마스터 관리 모달(프로젝트/업무유형/하위 CRUD) */}
      <WorkReportMasterModal open={openMaster} onClose={() => setOpenMaster(false)} />
    </div>
  );
}

function PvaTable({ rows }) {
  const list = Array.isArray(rows) ? rows : [];
  if (list.length === 0) {
    return <div className="tf-muted tf-small">데이터 없음</div>;
  }
  return (
    <div className="tf-table-wrap">
      <table className="tf-table">
        <thead>
          <tr>
            <th>항목</th>
            <th style={{ width: 90 }}>Plan(h)</th>
            <th style={{ width: 90 }}>Actual(h)</th>
            <th style={{ width: 80 }}>달성</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.key || r.name}>
              <td>{r.name}</td>
              <td className="tf-td-num">{r.planHours}</td>
              <td className="tf-td-num">{r.actualHours}</td>
              <td className="tf-td-num">{r.rate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
