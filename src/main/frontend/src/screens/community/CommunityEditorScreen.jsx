// FILE: src/main/frontend/src/screens/community/CommunityEditorScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

const CATEGORIES = ["운동", "공부", "일상", "갓생"];

export default function CommunityEditorScreen() {
  const { groupId } = useParams(); // new는 "/community/new"로 진입한다고 가정
  const navigate = useNavigate();
  const isEdit = useMemo(() => !!groupId, [groupId]);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "운동",
    description: "",
    rules: "",
    maxMembers: 50,
    isPublic: true,
    requireApproval: true,
    recruitEndDate: "",
    pinnedNotice: "",
  });

  async function load() {
    if (!isEdit) return;
    setLoading(true);
    try {
      const g = await communityApi.getGroup(groupId);
      if (g) {
        setForm({
          name: g.name || "",
          category: g.category || "운동",
          description: g.description || "",
          rules: g.rules || "",
          maxMembers: g.maxMembers ?? 50,
          isPublic: !!g.isPublic,
          requireApproval: !!g.requireApproval,
          recruitEndDate: g.recruitEndDate || "",
          pinnedNotice: g.pinnedNotice || "",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  function update(patch) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function validate() {
    if (!form.name.trim()) return "커뮤니티 이름은 필수입니다.";
    if (!form.description.trim()) return "설명은 필수입니다.";
    if (!CATEGORIES.includes(form.category)) return "카테고리를 선택하세요.";
    const n = Number(form.maxMembers);
    if (Number.isNaN(n) || n < 2) return "정원은 2 이상으로 입력하세요.";
    return null;
  }

  async function onSave() {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        const g = await communityApi.updateGroup(groupId, {
          ...form,
          maxMembers: Number(form.maxMembers),
          recruitEndDate: form.recruitEndDate || null,
        });
        alert("수정되었습니다.");
        navigate(`/community/${g.id}`);
      } else {
        const g = await communityApi.createGroup({
          ...form,
          maxMembers: Number(form.maxMembers),
          recruitEndDate: form.recruitEndDate || null,
        });
        alert("생성되었습니다.");
        navigate(`/community/${g.id}`);
      }
    } catch (e) {
      alert(`저장 실패: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">{isEdit ? "커뮤니티 수정" : "커뮤니티 생성"}</div>
          <div className="tf-subtitle">카테고리/정원/모집정책/공개범위/규칙/공지</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={() => navigate(isEdit ? `/community/${groupId}` : "/community")}>
            취소
          </button>
          <button className="tf-btn tf-btn--primary" onClick={onSave} disabled={loading}>
            {isEdit ? "저장" : "생성"}
          </button>
        </div>
      </div>

      <div className="tf-grid">
        <div className="tf-col-8 tf-card">
          <div className="tf-muted tf-small">기본 정보</div>
          <div className="tf-divider" />

          <div className="tf-grid">
            <div className="tf-col-12">
              <div className="tf-small tf-muted">이름</div>
              <input
                className="tf-input"
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="예: 퇴근 후 1시간 공부"
              />
            </div>

            <div className="tf-col-6">
              <div className="tf-small tf-muted">카테고리</div>
              <select className="tf-select" value={form.category} onChange={(e) => update({ category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="tf-col-6">
              <div className="tf-small tf-muted">정원 (maxMembers)</div>
              <input
                className="tf-input"
                type="number"
                min={2}
                value={form.maxMembers}
                onChange={(e) => update({ maxMembers: e.target.value })}
              />
            </div>

            <div className="tf-col-12">
              <div className="tf-small tf-muted">설명</div>
              <textarea
                className="tf-textarea"
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="커뮤니티 소개/목표/운영방식"
              />
            </div>

            <div className="tf-col-12">
              <div className="tf-small tf-muted">규칙</div>
              <textarea
                className="tf-textarea"
                value={form.rules}
                onChange={(e) => update({ rules: e.target.value })}
                placeholder="예: 1) 하루 1회 인증  2) 비방 금지  3) 광고 금지"
              />
            </div>
          </div>
        </div>

        <div className="tf-col-4 tf-card">
          <div className="tf-muted tf-small">설정</div>
          <div className="tf-divider" />

          <div className="tf-list">
            <label className="tf-item">
              <div className="tf-item__top">
                <div>
                  <div className="tf-item__title">공개/비공개</div>
                  <div className="tf-small tf-muted">비공개면 탐색 목록에서 숨길 수 있습니다.</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => update({ isPublic: e.target.checked })}
                />
              </div>
            </label>

            <label className="tf-item">
              <div className="tf-item__top">
                <div>
                  <div className="tf-item__title">가입 정책: 승인 필요</div>
                  <div className="tf-small tf-muted">승인 필요 시 가입 신청/요청함 플로우 사용</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.requireApproval}
                  onChange={(e) => update({ requireApproval: e.target.checked })}
                />
              </div>
            </label>

            <div className="tf-item">
              <div className="tf-item__title">모집 종료일(옵션)</div>
              <div className="tf-small tf-muted">종료 후 신청 불가(정책 확장 가능)</div>
              <div style={{ marginTop: 8 }}>
                <input
                  className="tf-input"
                  type="date"
                  value={form.recruitEndDate || ""}
                  onChange={(e) => update({ recruitEndDate: e.target.value })}
                />
              </div>
            </div>

            <div className="tf-item">
              <div className="tf-item__title">공지(핀)</div>
              <div className="tf-small tf-muted">상세 화면 상단에 노출됩니다.</div>
              <div style={{ marginTop: 8 }}>
                <textarea
                  className="tf-textarea"
                  value={form.pinnedNotice}
                  onChange={(e) => update({ pinnedNotice: e.target.value })}
                  placeholder="예: 가입 신청 시 간단 소개 부탁해요."
                />
              </div>
            </div>
          </div>

          <div className="tf-divider" />
          <div className="tf-small tf-muted">
            참고: 실제 서비스에서는 수정/생성 권한(OWNER/MOD) 검증이 서버에서 다시 수행되어야 합니다.
          </div>
        </div>
      </div>
    </div>
  );
}
