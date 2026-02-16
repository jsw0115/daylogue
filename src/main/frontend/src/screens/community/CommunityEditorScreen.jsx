// FILE: src/main/frontend/src/screens/community/CommunityEditorScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import { 
  Users, Lock, Globe, FileText, checkCircle, 
  AlertCircle, Calendar, Hash, Pin 
} from "lucide-react";
import "../../styles/timeflow-ui.css";
import "./CommunityEditorScreen.css"; // 전용 CSS Import

const CATEGORIES = [
  { id: "운동", label: "🏃 운동/건강" },
  { id: "공부", label: "📚 공부/취업" },
  { id: "일상", label: "☕ 일상/습관" },
  { id: "갓생", label: "🔥 갓생/챌린지" }
];

export default function CommunityEditorScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const isEdit = useMemo(() => !!groupId && groupId !== 'new', [groupId]);

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

  // 데이터 로드
  useEffect(() => {
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
      } catch (e) {
        console.error(e);
        alert("데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [groupId, isEdit]);

  const update = (patch) => setForm(prev => ({ ...prev, ...patch }));

  const validate = () => {
    if (!form.name.trim()) return "커뮤니티 이름은 필수입니다.";
    if (form.name.length < 2) return "이름은 2글자 이상이어야 합니다.";
    if (!form.description.trim()) return "소개글은 필수입니다.";
    const n = Number(form.maxMembers);
    if (isNaN(n) || n < 2) return "정원은 2명 이상이어야 합니다.";
    if (n > 1000) return "정원은 최대 1000명입니다.";
    return null;
  };

  const onSave = async () => {
    const err = validate();
    if (err) return alert(err);

    setLoading(true);
    try {
      const payload = {
        ...form,
        maxMembers: Number(form.maxMembers),
        recruitEndDate: form.recruitEndDate || null,
      };

      let g;
      if (isEdit) {
        g = await communityApi.updateGroup(groupId, payload);
        alert("성공적으로 수정되었습니다. ✨");
      } else {
        g = await communityApi.createGroup(payload);
        alert("새로운 커뮤니티가 생성되었습니다! 🎉");
      }
      navigate(`/community/${g.id}`);
    } catch (e) {
      alert(`저장 실패: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tf-page comm-editor-container">
      {/* Header */}
      <div className="tf-page__header">
        <div>
          <div className="tf-title">{isEdit ? "커뮤니티 설정 수정" : "새 커뮤니티 만들기"}</div>
          <div className="tf-subtitle">함께 성장할 멤버들을 모아보세요.</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={() => navigate(-1)}>취소</button>
          <button className="tf-btn tf-btn--primary" onClick={onSave} disabled={loading}>
            {loading ? "저장 중..." : (isEdit ? "수정 완료" : "커뮤니티 개설")}
          </button>
        </div>
      </div>

      <div className="tf-grid-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
        
        {/* Left Column: 필수 정보 */}
        <div className="tf-col">
          <div className="tf-card">
            <div className="tf-muted tf-small tf-bold" style={{marginBottom: 16}}>기본 정보</div>
            
            {/* 이름 */}
            <div className="comm-input-group">
              <label className="comm-section-label">커뮤니티 이름</label>
              <input
                className="tf-input"
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="예: 미라클 모닝 챌린지 6기"
                autoFocus
              />
            </div>

            {/* 카테고리 (Chips) */}
            <div className="comm-input-group">
              <label className="comm-section-label">카테고리</label>
              <div className="comm-category-list">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    className={`comm-category-chip ${form.category === c.id ? 'active' : ''}`}
                    onClick={() => update({ category: c.id })}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 소개 */}
            <div className="comm-input-group">
              <label className="comm-section-label">소개글</label>
              <textarea
                className="tf-textarea"
                style={{ height: '120px' }}
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="어떤 커뮤니티인가요? 목표와 활동 내용을 적어주세요."
              />
            </div>

            {/* 규칙 */}
            <div className="comm-input-group">
              <label className="comm-section-label">운영 규칙</label>
              <textarea
                className="tf-textarea"
                style={{ height: '100px' }}
                value={form.rules}
                onChange={(e) => update({ rules: e.target.value })}
                placeholder="예: 1. 매일 아침 7시 인증하기 &#10;2. 비속어 사용 금지"
              />
            </div>
          </div>

          <div className="tf-card">
            <div className="tf-muted tf-small tf-bold" style={{marginBottom: 16}}>추가 정보</div>
            <div className="comm-input-group">
              <label className="comm-section-label">
                <Pin size={14} style={{display:'inline', marginRight:4}}/> 상단 고정 공지 (선택)
              </label>
              <textarea
                className="tf-textarea"
                value={form.pinnedNotice}
                onChange={(e) => update({ pinnedNotice: e.target.value })}
                placeholder="멤버들이 들어오자마자 보게 될 공지사항을 입력하세요."
              />
            </div>
          </div>
        </div>

        {/* Right Column: 설정 및 옵션 */}
        <div className="tf-col">
          <div className="tf-card">
            <div className="tf-muted tf-small tf-bold" style={{marginBottom: 16}}>운영 설정</div>

            {/* 정원 */}
            <div className="comm-input-group">
              <label className="comm-section-label">최대 정원</label>
              <div style={{display:'flex', alignItems:'center', gap: 8}}>
                <Users size={18} className="tf-muted"/>
                <input
                  type="number"
                  className="tf-input"
                  min={2}
                  max={1000}
                  value={form.maxMembers}
                  onChange={(e) => update({ maxMembers: e.target.value })}
                />
                <span className="tf-muted tf-small">명</span>
              </div>
            </div>

            {/* 모집 종료일 */}
            <div className="comm-input-group">
              <label className="comm-section-label">모집 마감일 (선택)</label>
              <div style={{display:'flex', alignItems:'center', gap: 8}}>
                <Calendar size={18} className="tf-muted"/>
                <input
                  type="date"
                  className="tf-input"
                  value={form.recruitEndDate}
                  onChange={(e) => update({ recruitEndDate: e.target.value })}
                />
              </div>
            </div>

            <div className="tf-divider"/>

            {/* 공개 여부 토글 */}
            <div className="comm-toggle-row">
              <div className="comm-toggle-info">
                <div className="comm-toggle-title">
                  {form.isPublic ? <Globe size={16}/> : <Lock size={16}/>}
                  {form.isPublic ? "공개 커뮤니티" : "비공개"}
                </div>
                <div className="comm-toggle-desc">
                  {form.isPublic ? "검색 결과에 노출됩니다." : "초대 링크로만 입장 가능합니다."}
                </div>
              </div>
              <button 
                className={`tf-switch ${form.isPublic ? 'checked' : ''}`}
                onClick={() => update({ isPublic: !form.isPublic })}
              >
                <span className="tf-switch-thumb" />
              </button>
            </div>

            {/* 가입 승인 토글 */}
            <div className="comm-toggle-row">
              <div className="comm-toggle-info">
                <div className="comm-toggle-title">
                  <FileText size={16}/> 가입 승인 절차
                </div>
                <div className="comm-toggle-desc">
                  {form.requireApproval ? "방장의 승인이 필요합니다." : "누구나 즉시 가입됩니다."}
                </div>
              </div>
              <button 
                className={`tf-switch ${form.requireApproval ? 'checked' : ''}`}
                onClick={() => update({ requireApproval: !form.requireApproval })}
              >
                <span className="tf-switch-thumb" />
              </button>
            </div>

          </div>

          {/* Help Box */}
          <div className="comm-help-box">
            <AlertCircle size={20} />
            <div>
              커뮤니티 개설 후에도 설정 메뉴에서 정보를 수정할 수 있습니다.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}