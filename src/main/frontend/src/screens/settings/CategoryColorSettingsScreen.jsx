// FILE: src/main/frontend/src/screens/settings/CategoryColorSettingsScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { SettingsLayout } from "./SettingsLayout";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";
import Button from "../../components/common/Button";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";

import { Plus, Trash2, ArrowUp, ArrowDown, Copy, Save, RotateCcw, Image as IconImage } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

import CategoryIcon from "../../components/category/CategoryIcon";
import {
  LUCIDE_ICON_OPTIONS,
  RADIX_ICON_OPTIONS,
} from "../../shared/constants/categoryIconOptions";

import "../../styles/timeflow-ui.css";
import "../../styles/category-settings.css";

/** ========= localStorage 차단(SecurityError) 대비 ========= */
const __memStore = new Map();

function safeStorageGet(key) {
  try {
    const ls = window.localStorage;
    return ls.getItem(key);
  } catch {
    return __memStore.get(key) ?? null;
  }
}
function safeStorageSet(key, value) {
  try {
    const ls = window.localStorage;
    ls.setItem(key, value);
    return { ok: true, persisted: true };
  } catch {
    __memStore.set(key, value);
    return { ok: true, persisted: false };
  }
}
function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/** ========= utils ========= */
function genId() {
  return `cat_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

const STORAGE_KEY = "timeflow_categories_v2"; // iconKey 도입 버전

const PALETTE = [
  "#111827", "#374151", "#6B7280",
  "#EF4444", "#F97316", "#F59E0B",
  "#84CC16", "#22C55E", "#10B981",
  "#06B6D4", "#3B82F6", "#6366F1",
  "#8B5CF6", "#EC4899", "#F43F5E",
];

function normalizeCategory(raw) {
  const c = raw || {};
  const id = String(c.id || genId());
  const name = String(c.name || "새 카테고리");
  const color = String(c.color || "#111827");
  const parentId = c.parentId ? String(c.parentId) : "";

  // iconKey 우선. 없으면 기존 icon(이모지) -> emoji: 로 마이그레이션
  let iconKey = "";
  if (c.iconKey) iconKey = String(c.iconKey);
  else if (c.icon) iconKey = `emoji:${String(c.icon)}`;
  else iconKey = "lucide:Folder";

  // 하위 호환용 icon 문자열도 남김(다른 화면이 아직 CategoryIcon으로 렌더하지 않을 수 있음)
  // - emoji면 icon에 그대로 저장
  // - lucide/radix면 placeholder(□) 저장
  let icon = "□";
  if (iconKey.startsWith("emoji:")) {
    icon = iconKey.split(":")[1] || "□";
  }

  return { id, name, color, parentId, iconKey, icon };
}

function IconGrid({ options, activeKey, onPick }) {
  return (
    <div className="ccs-icongrid">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          className={`ccs-icongrid__btn ${activeKey === o.key ? "is-active" : ""}`}
          onClick={() => onPick(o.key)}
          title={o.key}
        >
          <span className="ccs-icongrid__icon">
            <CategoryIcon iconKey={o.key} size={18} />
          </span>
          <span className="ccs-icongrid__label">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function IconSelectDialog({ open, onClose, value, onChange }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>아이콘 선택</DialogTitle>
      <DialogContent>
        <div className="ccs-iconpicker">
          <div className="ccs-iconpicker__preview">
            <div className="ccs-iconpicker__previewBox">
              <CategoryIcon iconKey={value} size={22} />
            </div>
            <div className="ccs-iconpicker__previewText">
              <div className="ccs-iconpicker__previewTitle">현재 선택</div>
              <div className="ccs-iconpicker__previewKey">{value || "(없음)"}</div>
              <div className="ccs-iconpicker__hint">
                근거 부족: 프로젝트의 아이콘 패키지 버전에 따라 일부 아이콘 이름이 다를 수 있습니다.
                import 에러가 나면 옵션에서 해당 아이콘만 제거/대체하면 됩니다.
              </div>
            </div>
          </div>

          <Tabs.Root className="ccs-tabs" defaultValue="lucide">
            <Tabs.List className="ccs-tabs__list" aria-label="icon packs">
              <Tabs.Trigger className="ccs-tabs__trigger" value="lucide">
                Lucide
              </Tabs.Trigger>
              <Tabs.Trigger className="ccs-tabs__trigger" value="radix">
                Radix
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content className="ccs-tabs__content" value="lucide">
              <IconGrid options={LUCIDE_ICON_OPTIONS} activeKey={value} onPick={onChange} />
            </Tabs.Content>

            <Tabs.Content className="ccs-tabs__content" value="radix">
              <IconGrid options={RADIX_ICON_OPTIONS} activeKey={value} onPick={onChange} />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </DialogContent>

      <DialogActions>
        <Button type="button" variant="ghost" onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function CategoryColorSettingsScreen() {
  const [cats, setCats] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [q, setQ] = useState("");
  const [dirty, setDirty] = useState(false);

  const [toast, setToast] = useState({ open: false, type: "info", msg: "" });

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    color: PALETTE[0],
    parentId: "",
    iconKey: "lucide:Folder",
  });

  const [iconDlg, setIconDlg] = useState({ open: false, mode: "edit" }); // edit|add

  /** load */
  useEffect(() => {
    const saved = safeJsonParse(safeStorageGet(STORAGE_KEY), null);
    const base = Array.isArray(saved) && saved.length ? saved : DEFAULT_CATEGORIES;

    const normalized = base.map(normalizeCategory);
    setCats(normalized);
    setSelectedId(normalized[0]?.id || null);
    setDirty(false);
  }, []);

  const selected = useMemo(() => cats.find((c) => c.id === selectedId) || null, [cats, selectedId]);
  const topLevelCats = useMemo(() => cats.filter((c) => !c.parentId), [cats]);

  const filteredCats = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return cats;
    return cats.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const key = (c.iconKey || "").toLowerCase();
      return name.includes(qq) || key.includes(qq);
    });
  }, [cats, q]);

  function showToast(type, msg) {
    setToast({ open: true, type, msg });
  }

  function updateCategory(id, patch) {
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    setDirty(true);
  }

  function moveCategory(id, dir) {
    setCats((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx < 0) return prev;
      const swap = idx + dir;
      if (swap < 0 || swap >= prev.length) return prev;
      const next = [...prev];
      const tmp = next[idx];
      next[idx] = next[swap];
      next[swap] = tmp;
      return next;
    });
    setDirty(true);
  }

  function removeCategory(id) {
    setCats((prev) => {
      const next = prev.filter((c) => c.id !== id);
      // 부모 삭제 시 자식은 최상위로 승격
      return next.map((c) => (c.parentId === id ? { ...c, parentId: "" } : c));
    });
    setDirty(true);

    setSelectedId((prevSel) => {
      if (prevSel !== id) return prevSel;
      const remain = cats.filter((c) => c.id !== id);
      return remain[0]?.id || null;
    });
  }

  function duplicateCategory(id) {
    const src = cats.find((c) => c.id === id);
    if (!src) return;
    const copy = {
      ...src,
      id: genId(),
      name: `${src.name} (복제)`,
    };
    setCats((prev) => [copy, ...prev]);
    setSelectedId(copy.id);
    setDirty(true);
  }

  function resetToDefault() {
    const normalized = DEFAULT_CATEGORIES.map(normalizeCategory);
    setCats(normalized);
    setSelectedId(normalized[0]?.id || null);
    setDirty(true);
    showToast("info", "기본 카테고리로 되돌렸습니다. 저장을 눌러 반영하세요.");
  }

  function saveAll() {
    for (const c of cats) {
      if (!c.id || !String(c.id).trim()) {
        showToast("error", "카테고리 ID가 비어있습니다.");
        return;
      }
      if (!c.name || !String(c.name).trim()) {
        showToast("error", "카테고리 이름이 비어있습니다.");
        return;
      }
    }

    const fixed = cats.map((c) => {
      const iconKey = String(c.iconKey || "lucide:Folder");
      let icon = "□";
      if (iconKey.startsWith("emoji:")) icon = iconKey.split(":")[1] || "□";
      return { ...c, iconKey, icon };
    });

    const res = safeStorageSet(STORAGE_KEY, JSON.stringify(fixed));
    setCats(fixed);
    setDirty(false);

    if (res.persisted) showToast("success", "저장되었습니다.");
    else showToast("warning", "저장 권한이 제한된 환경입니다. 새로고침 시 유실될 수 있습니다.");
  }

  function openAdd() {
    setAddForm({
      name: "",
      color: PALETTE[0],
      parentId: "",
      iconKey: "lucide:Folder",
    });
    setAddOpen(true);
  }

  function submitAdd() {
    const name = String(addForm.name || "").trim();
    if (!name) {
      showToast("error", "카테고리 이름을 입력하세요.");
      return;
    }

    const newCat = normalizeCategory({
      id: genId(),
      name,
      color: addForm.color,
      parentId: addForm.parentId,
      iconKey: addForm.iconKey,
    });

    setCats((prev) => [newCat, ...prev]);
    setSelectedId(newCat.id);
    setAddOpen(false);
    setDirty(true);
    showToast("success", "카테고리가 추가되었습니다.");
  }

  return (
    <SettingsLayout
      title="카테고리 색 / 아이콘 설정"
      description="플래너/통계/캘린더에서 공통으로 사용하는 카테고리 색상과 아이콘을 관리합니다."
    >
      <div className="ccs">
        {/* Top Actions */}
        <div className="ccs__top tf-card">
          <div className="ccs__top-left">
            <div className="ccs__title">카테고리 관리</div>
            <div className="ccs__desc">
              변경 내용은 저장 후 반영됩니다. (근거 부족: 현재는 로컬 저장 기반 UI이며 서버 연동 시 API로 대체)
            </div>
          </div>

          <div className="ccs__top-right">
            <Button type="button" variant="ghost" onClick={openAdd}>
              <Plus size={16} style={{ marginRight: 6 }} />
              카테고리 추가
            </Button>

            <Button type="button" variant="ghost" onClick={resetToDefault}>
              <RotateCcw size={16} style={{ marginRight: 6 }} />
              기본값
            </Button>

            <Button type="button" variant="primary" onClick={saveAll} disabled={!dirty}>
              <Save size={16} style={{ marginRight: 6 }} />
              변경 내용 저장
            </Button>
          </div>
        </div>

        <div className="ccs__grid">
          {/* Left: List */}
          <div className="ccs__left tf-card">
            <div className="ccs__section-head">
              <div className="ccs__section-title">목록</div>
              <input
                className="ccs__search"
                placeholder="검색 (이름/아이콘키)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="ccs__list">
              {filteredCats.map((c) => {
                const isActive = c.id === selectedId;
                const parentBadge = c.parentId ? "하위" : "상위";
                return (
                  <div
                    key={c.id}
                    className={`ccs__item ${isActive ? "is-active" : ""}`}
                    onClick={() => setSelectedId(c.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="ccs__item-left">
                      <span className="ccs__dot" style={{ backgroundColor: c.color }} />
                      <span className="ccs__iconBox">
                        <CategoryIcon iconKey={c.iconKey} size={18} />
                      </span>

                      <div className="ccs__meta">
                        <div className="ccs__name">{c.name}</div>
                        <div className="ccs__sub">
                          <span className={`ccs__badge ${c.parentId ? "ccs__badge--sub" : "ccs__badge--top"}`}>
                            {parentBadge}
                          </span>
                          {c.parentId ? (
                            <span className="ccs__subtext">
                              상위: {cats.find((x) => x.id === c.parentId)?.name || "(알 수 없음)"}
                            </span>
                          ) : (
                            <span className="ccs__subtext">최상위 카테고리</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ccs__item-actions" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="위로">
                        <span>
                          <IconButton size="small" onClick={() => moveCategory(c.id, -1)}>
                            <ArrowUp size={16} />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="아래로">
                        <span>
                          <IconButton size="small" onClick={() => moveCategory(c.id, 1)}>
                            <ArrowDown size={16} />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="복제">
                        <span>
                          <IconButton size="small" onClick={() => duplicateCategory(c.id)}>
                            <Copy size={16} />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="삭제">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (window.confirm(`"${c.name}" 카테고리를 삭제할까요?`)) removeCategory(c.id);
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}

              {filteredCats.length === 0 && <div className="ccs__empty">검색 결과가 없습니다.</div>}
            </div>
          </div>

          {/* Right: Editor */}
          <div className="ccs__right tf-card">
            {!selected ? (
              <div className="ccs__empty">카테고리를 선택하세요.</div>
            ) : (
              <div className="ccs__editor">
                <div className="ccs__editor-head">
                  <div className="ccs__editor-title">상세 편집</div>
                  <div className="ccs__preview">
                    <span className="ccs__dot" style={{ backgroundColor: selected.color }} />
                    <span className="ccs__iconBox">
                      <CategoryIcon iconKey={selected.iconKey} size={18} />
                    </span>
                    <span className="ccs__preview-name">{selected.name}</span>
                  </div>
                </div>

                <div className="ccs__form">
                  <div className="ccs__field">
                    <div className="ccs__label">이름</div>
                    <input
                      className="ccs__input"
                      value={selected.name}
                      onChange={(e) => updateCategory(selected.id, { name: e.target.value })}
                      placeholder="예) 업무, 공부, 운동"
                    />
                  </div>

                  <div className="ccs__field">
                    <div className="ccs__label">아이콘</div>
                    <div className="ccs__row">
                      <div className="ccs__iconSelectPreview">
                        <CategoryIcon iconKey={selected.iconKey} size={20} />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIconDlg({ open: true, mode: "edit" })}
                      >
                        <IconImage size={16} style={{ marginRight: 6 }} />
                        아이콘 선택
                      </Button>
                      <div className="ccs__hint">
                        저장 형식: <span className="ccs__mono">{selected.iconKey}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ccs__field">
                    <div className="ccs__label">색상</div>
                    <div className="ccs__row">
                      <input
                        type="color"
                        className="ccs__color"
                        value={selected.color}
                        onChange={(e) => updateCategory(selected.id, { color: e.target.value })}
                        aria-label="color-picker"
                      />
                      <div className="ccs__palette">
                        {PALETTE.map((p) => (
                          <button
                            key={p}
                            type="button"
                            className={`ccs__swatch ${selected.color === p ? "is-active" : ""}`}
                            style={{ backgroundColor: p }}
                            onClick={() => updateCategory(selected.id, { color: p })}
                            title={p}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="ccs__hint">
                      색상 변경은 플래너/통계/캘린더에 공통 반영되는 것을 전제로 합니다.
                    </div>
                  </div>

                  <div className="ccs__field">
                    <div className="ccs__label">상위 카테고리</div>
                    <select
                      className="ccs__select"
                      value={selected.parentId || ""}
                      onChange={(e) => updateCategory(selected.id, { parentId: e.target.value })}
                    >
                      <option value="">(없음) 최상위</option>
                      {topLevelCats
                        .filter((c) => c.id !== selected.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                    <div className="ccs__hint">
                      하위 카테고리는 “업무(프로젝트/회의/표준)” 같은 구조를 만들 때 사용합니다.
                    </div>
                  </div>

                  <div className="ccs__danger">
                    <div className="ccs__danger-title">위험 작업</div>
                    <div className="ccs__danger-desc">
                      삭제 시 하위 카테고리는 자동으로 최상위로 승격됩니다(현재 UI 정책).
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        if (window.confirm(`"${selected.name}" 카테고리를 삭제할까요?`)) {
                          removeCategory(selected.id);
                        }
                      }}
                    >
                      <Trash2 size={16} style={{ marginRight: 6 }} />
                      이 카테고리 삭제
                    </Button>
                  </div>
                </div>

                <div className="ccs__footer">
                  <Button type="button" variant="primary" onClick={saveAll} disabled={!dirty}>
                    <Save size={16} style={{ marginRight: 6 }} />
                    저장
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Dialog */}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>카테고리 추가</DialogTitle>
          <DialogContent>
            <div className="ccs__dlg">
              <div className="ccs__field">
                <div className="ccs__label">이름</div>
                <input
                  className="ccs__input"
                  value={addForm.name}
                  onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="예) 프로젝트, 회의, 표준"
                />
              </div>

              <div className="ccs__field">
                <div className="ccs__label">아이콘</div>
                <div className="ccs__row">
                  <div className="ccs__iconSelectPreview">
                    <CategoryIcon iconKey={addForm.iconKey} size={20} />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIconDlg({ open: true, mode: "add" })}
                  >
                    <IconImage size={16} style={{ marginRight: 6 }} />
                    아이콘 선택
                  </Button>
                  <div className="ccs__hint">
                    저장 형식: <span className="ccs__mono">{addForm.iconKey}</span>
                  </div>
                </div>
              </div>

              <div className="ccs__field">
                <div className="ccs__label">색상</div>
                <div className="ccs__row">
                  <input
                    type="color"
                    className="ccs__color"
                    value={addForm.color}
                    onChange={(e) => setAddForm((p) => ({ ...p, color: e.target.value }))}
                  />
                  <div className="ccs__palette">
                    {PALETTE.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`ccs__swatch ${addForm.color === p ? "is-active" : ""}`}
                        style={{ backgroundColor: p }}
                        onClick={() => setAddForm((x) => ({ ...x, color: p }))}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="ccs__field">
                <div className="ccs__label">상위 카테고리(선택)</div>
                <select
                  className="ccs__select"
                  value={addForm.parentId}
                  onChange={(e) => setAddForm((p) => ({ ...p, parentId: e.target.value }))}
                >
                  <option value="">(없음) 최상위</option>
                  {topLevelCats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ccs__preview ccs__preview--dlg">
                <span className="ccs__dot" style={{ backgroundColor: addForm.color }} />
                <span className="ccs__iconBox">
                  <CategoryIcon iconKey={addForm.iconKey} size={18} />
                </span>
                <span className="ccs__preview-name">{addForm.name || "새 카테고리"}</span>
              </div>
            </div>
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>
              취소
            </Button>
            <Button type="button" variant="primary" onClick={submitAdd}>
              추가
            </Button>
          </DialogActions>
        </Dialog>

        {/* Icon Picker Dialog */}
        <IconSelectDialog
          open={iconDlg.open}
          onClose={() => setIconDlg({ open: false, mode: "edit" })}
          value={iconDlg.mode === "add" ? addForm.iconKey : selected?.iconKey}
          onChange={(key) => {
            if (iconDlg.mode === "add") {
              setAddForm((p) => ({ ...p, iconKey: key }));
            } else if (selected) {
              updateCategory(selected.id, { iconKey: key });
            }
          }}
        />

        {/* Toast */}
        <Snackbar
          open={toast.open}
          autoHideDuration={2500}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={toast.type}
            variant="filled"
            onClose={() => setToast((t) => ({ ...t, open: false }))}
          >
            {toast.msg}
          </Alert>
        </Snackbar>
      </div>
    </SettingsLayout>
  );
}
