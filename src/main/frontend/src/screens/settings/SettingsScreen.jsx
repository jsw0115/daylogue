// FILE: src/main/frontend/src/screens/settings/SettingsScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../../styles/screens/settings.css";
import { safeStorage } from "../../shared/utils/safeStorage";
import Modal from "../../components/common/Modal";
import { useNavigate } from "react-router-dom";
import AdminOnly from "../../components/common/AdminOnly";
import { useShareUsers } from "../../shared/hooks/useShareUsers";
import { notifySessionChanged } from "../../shared/hooks/useIsAdmin";

import WorkReportMasterModal from "./WorkReportMasterModal";
import { loadWorkReportMaster, WORK_REPORT_MASTER_EVENT } from "../../shared/hooks/useWorkReportMaster";

function loadCategories(key, fallback) {
  return safeStorage.getJSON(key, fallback);
}
function saveCategories(key, value) {
  safeStorage.setJSON(key, value);
}

const DEFAULT_PERSONAL = [
  { id: "p-1", name: "업무" },
  { id: "p-2", name: "공부" },
  { id: "p-3", name: "건강" },
  { id: "p-4", name: "휴식" },
];

const DEFAULT_PROFILE = { name: "홍길동", email: "user@example.com" };

export default function SettingsScreen() {
  const nav = useNavigate();

  const [isAdmin, setIsAdmin] = useState(!!safeStorage.getJSON("session.isAdmin", false));

  // profile
  const [profile, setProfile] = useState(() => safeStorage.getJSON("profile", DEFAULT_PROFILE));
  const [openProfile, setOpenProfile] = useState(false);
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");

  // categories
  const [openCategories, setOpenCategories] = useState(false);
  const [personalCats, setPersonalCats] = useState(loadCategories("categories.personal", DEFAULT_PERSONAL));
  const [sharedCats, setSharedCats] = useState(loadCategories("categories.shared", []));
  const allCats = useMemo(() => [...sharedCats, ...personalCats], [sharedCats, personalCats]);

  const [newCatName, setNewCatName] = useState("");
  const [newCatScope, setNewCatScope] = useState("personal"); // personal | shared

  // share users
  const { users: shareUsers, addUser, removeUser } = useShareUsers();
  const [openShareUsers, setOpenShareUsers] = useState(false);
  const [newShareName, setNewShareName] = useState("");
  const [newShareEmail, setNewShareEmail] = useState("");

  // work report master
  const [openWorkMaster, setOpenWorkMaster] = useState(false);
  const [workMasterPreview, setWorkMasterPreview] = useState(() =>
    loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] })
  );

  // 모달 열고/닫을 때 preview 갱신
  useEffect(() => {
    setWorkMasterPreview(loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] }));
  }, [openWorkMaster]);

  // 다른 화면에서 저장해도(이벤트) preview 갱신
  useEffect(() => {
    const on = () => setWorkMasterPreview(loadWorkReportMaster({ projects: [], workTypes: [], subCategories: [] }));
    window.addEventListener(WORK_REPORT_MASTER_EVENT, on);
    return () => window.removeEventListener(WORK_REPORT_MASTER_EVENT, on);
  }, []);

  const openProfileModal = () => {
    const latest = safeStorage.getJSON("profile", DEFAULT_PROFILE);
    setProfile(latest);
    setName(latest.name || "");
    setEmail(latest.email || "");
    setOpenProfile(true);
  };

  const saveProfile = () => {
    const next = { name: name.trim(), email: email.trim() };
    safeStorage.setJSON("profile", next);
    setProfile(next);
    setOpenProfile(false);
  };

  const addCategory = () => {
    const nm = newCatName.trim();
    if (!nm) return;

    if (newCatScope === "shared") {
      if (!isAdmin) return;
      const next = [...sharedCats, { id: `s-${Date.now()}`, name: nm }];
      setSharedCats(next);
      saveCategories("categories.shared", next);
    } else {
      const next = [...personalCats, { id: `p-${Date.now()}`, name: nm }];
      setPersonalCats(next);
      saveCategories("categories.personal", next);
    }

    setNewCatName("");
    setNewCatScope("personal");
  };

  const removeCategory = (scope, id) => {
    if (scope === "shared") {
      if (!isAdmin) return;
      const next = sharedCats.filter((c) => c.id !== id);
      setSharedCats(next);
      saveCategories("categories.shared", next);
    } else {
      const next = personalCats.filter((c) => c.id !== id);
      setPersonalCats(next);
      saveCategories("categories.personal", next);
    }
  };

  const addShareUser = () => {
    const nm = newShareName.trim();
    const em = newShareEmail.trim();
    if (!nm) return;
    addUser({ id: `u-${Date.now()}`, name: nm, email: em });
    setNewShareName("");
    setNewShareEmail("");
  };

  return (
    <div className="screen settings-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">설정</h1>
          <p className="text-muted font-small">앱 환경 및 계정 관리</p>
        </div>

        <div className="settings-adminToggle">
          <label className="settings-adminToggle__label text-muted font-small">관리자 모드</label>
          <button
            type="button"
            className={"btn btn--sm " + (isAdmin ? "btn--primary" : "btn--secondary")}
            onClick={() => {
              const next = !isAdmin;
              setIsAdmin(next);
              safeStorage.setJSON("session.isAdmin", next);
              notifySessionChanged();
            }}
          >
            {isAdmin ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="settings-grid">
        <section className="card settings-card">
          <div className="settings-card__head">
            <div className="settings-card__titleRow">
              <div className="settings-card__title">계정 및 프로필</div>
              <div className="text-muted font-small">사용자 이름, 이메일 설정</div>
            </div>

            <button type="button" className="btn btn--sm btn--primary" onClick={openProfileModal}>
              프로필 편집
            </button>
          </div>

          <div className="settings-card__body">
            <div className="settings-kv">
              <div className="settings-kv__k">이름</div>
              <div className="settings-kv__v">{profile.name}</div>
            </div>
            <div className="settings-kv">
              <div className="settings-kv__k">이메일</div>
              <div className="settings-kv__v">{profile.email}</div>
            </div>
          </div>
        </section>

        <section className="card settings-card">
          <div className="settings-card__head">
            <div className="settings-card__titleRow">
              <div className="settings-card__title">공유 사용자</div>
              <div className="text-muted font-small">일정 공유 대상 목록 관리</div>
            </div>

            <button type="button" className="btn btn--sm btn--secondary" onClick={() => setOpenShareUsers(true)}>
              관리
            </button>
          </div>

          <div className="settings-card__body">
            <div className="settings-chipRow">
              {shareUsers.slice(0, 8).map((u) => (
                <span key={u.id} className="settings-chip">{u.name}</span>
              ))}
              {shareUsers.length > 8 ? (
                <span className="text-muted font-small">+{shareUsers.length - 8}</span>
              ) : null}
              {!shareUsers.length ? <span className="text-muted font-small">등록된 사용자가 없습니다.</span> : null}
            </div>
          </div>
        </section>

        <section className="card settings-card">
          <div className="settings-card__head">
            <div className="settings-card__titleRow">
              <div className="settings-card__title">카테고리 관리</div>
              <div className="text-muted font-small">일정/할일/타임라인/루틴 태그에 사용</div>
            </div>

            <button type="button" className="btn btn--sm btn--secondary" onClick={() => setOpenCategories(true)}>
              관리 열기
            </button>
          </div>

          <div className="settings-card__body">
            <div className="settings-chipRow">
              {allCats.slice(0, 10).map((c) => (
                <span key={c.id} className="settings-chip">{c.name}</span>
              ))}
              {allCats.length > 10 ? (
                <span className="text-muted font-small">+{allCats.length - 10}</span>
              ) : null}
            </div>
          </div>
        </section>

        {/* 업무보고 마스터 */}
        <section className="card settings-card">
          <div className="settings-card__head">
            <div className="settings-card__titleRow">
              <div className="settings-card__title">업무보고 마스터 관리</div>
              <div className="text-muted font-small">프로젝트/업무유형/업무하위 항목 관리</div>
            </div>

            <button type="button" className="btn btn--sm btn--secondary" onClick={() => setOpenWorkMaster(true)}>
              관리 열기
            </button>
          </div>

          <div className="settings-card__body">
            <div className="settings-chipRow">
              <span className="settings-chip">프로젝트 {workMasterPreview.projects.length}</span>
              <span className="settings-chip">업무유형 {workMasterPreview.workTypes.length}</span>
              <span className="settings-chip">하위 {workMasterPreview.subCategories.length}</span>

              {workMasterPreview.projects.slice(0, 6).map((p) => (
                <span key={p.id} className="settings-chip">{p.name}</span>
              ))}
              {workMasterPreview.projects.length > 6 ? (
                <span className="text-muted font-small">+{workMasterPreview.projects.length - 6}</span>
              ) : null}
            </div>
          </div>
        </section>

        <AdminOnly>
          <section className="card settings-card">
            <div className="settings-card__head">
              <div className="settings-card__titleRow">
                <div className="settings-card__title">관리자 설정</div>
                <div className="text-muted font-small">공용 데이터/운영/정책 관리</div>
              </div>

              <button type="button" className="btn btn--sm btn--primary" onClick={() => nav("/admin")}>
                열기
              </button>
            </div>
          </section>
        </AdminOnly>
      </div>

      {/* 프로필 모달 */}
      <Modal
        open={openProfile}
        title="프로필 편집"
        onClose={() => setOpenProfile(false)}
        footer={
          <div className="tb-modal__actions">
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => setOpenProfile(false)}>
              취소
            </button>
            <button type="button" className="btn btn--sm btn--primary" onClick={saveProfile}>
              저장
            </button>
          </div>
        }
      >
        <div className="tb-form">
          <label className="tb-label">이름</label>
          <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} />

          <label className="tb-label">이메일</label>
          <input className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </Modal>

      {/* 공유 사용자 모달 */}
      <Modal
        open={openShareUsers}
        title="공유 사용자 관리"
        onClose={() => setOpenShareUsers(false)}
        width={720}
        footer={
          <div className="tb-modal__actions">
            <button type="button" className="btn btn--sm btn--secondary" onClick={addShareUser}>
              추가
            </button>
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => setOpenShareUsers(false)}>
              닫기
            </button>
          </div>
        }
      >
        <div className="tb-form">
          <div className="tb-grid2">
            <div>
              <label className="tb-label">이름</label>
              <input className="field-input" value={newShareName} onChange={(e) => setNewShareName(e.target.value)} placeholder="예) 김철수" />
            </div>
            <div>
              <label className="tb-label">이메일(선택)</label>
              <input className="field-input" value={newShareEmail} onChange={(e) => setNewShareEmail(e.target.value)} placeholder="user@example.com" />
            </div>
          </div>

          <div style={{ height: 10 }} />

          {shareUsers.length ? (
            <div className="settings-shareList">
              {shareUsers.map((u) => (
                <div key={u.id} className="settings-shareRow">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                    <div className="text-muted font-small">{u.email || ""}</div>
                  </div>
                  <button type="button" className="btn btn--sm btn--ghost" onClick={() => removeUser(u.id)}>
                    삭제
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted font-small">등록된 공유 사용자가 없습니다.</div>
          )}
        </div>
      </Modal>

      {/* 카테고리 모달 */}
      <Modal
        open={openCategories}
        title="카테고리 관리"
        onClose={() => setOpenCategories(false)}
        width={720}
        footer={
          <div className="tb-modal__actions">
            <button type="button" className="btn btn--sm btn--secondary" onClick={addCategory}>
              추가
            </button>
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => setOpenCategories(false)}>
              닫기
            </button>
          </div>
        }
      >
        <div className="settings-cat">
          <div className="settings-cat__add">
            <div className="settings-cat__row">
              <input
                className="field-input"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="카테고리 이름"
              />
              <select className="field-input" value={newCatScope} onChange={(e) => setNewCatScope(e.target.value)}>
                <option value="personal">개인</option>
                <option value="shared" disabled={!isAdmin}>
                  공용(관리자)
                </option>
              </select>
            </div>
            {!isAdmin ? (
              <div className="text-muted font-small">공용 카테고리는 관리자 모드에서만 추가/삭제 가능</div>
            ) : null}
          </div>

          <div className="settings-cat__grid">
            <div className="settings-cat__col">
              <div className="settings-cat__title">공용(관리자)</div>
              <div className="settings-cat__list">
                {sharedCats.length ? (
                  sharedCats.map((c) => (
                    <div key={c.id} className="settings-cat__item">
                      <span>{c.name}</span>
                      <button
                        type="button"
                        className="btn btn--sm btn--ghost"
                        disabled={!isAdmin}
                        onClick={() => removeCategory("shared", c.id)}
                      >
                        삭제
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-muted font-small">공용 카테고리 없음</div>
                )}
              </div>
            </div>

            <div className="settings-cat__col">
              <div className="settings-cat__title">개인</div>
              <div className="settings-cat__list">
                {personalCats.length ? (
                  personalCats.map((c) => (
                    <div key={c.id} className="settings-cat__item">
                      <span>{c.name}</span>
                      <button type="button" className="btn btn--sm btn--ghost" onClick={() => removeCategory("personal", c.id)}>
                        삭제
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-muted font-small">개인 카테고리 없음</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* 업무보고 마스터 모달 */}
      <WorkReportMasterModal open={openWorkMaster} onClose={() => setOpenWorkMaster(false)} />
    </div>
  );
}
