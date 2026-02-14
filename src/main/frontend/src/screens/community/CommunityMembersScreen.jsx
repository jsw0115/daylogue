import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

// 뱃지 컴포넌트
function RoleBadge({ role }) {
  const label = role === "OWNER" ? "👑 방장" : role === "MANAGER" ? "🛡️ 부방장" : "멤버";
  return <span className={`tf-role-badge ${role}`}>{label}</span>;
}

export default function CommunityMembersScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock: 실제 서버에서는 DB에 저장될 경고 횟수
  const [warnings, setWarnings] = useState({}); 

  async function load() {
    setLoading(true);
    try {
      const g = await communityApi.getGroup(groupId);
      setGroup(g);
      const m = await communityApi.listMembers(groupId);
      setMembers(m);
    } catch (e) {
      alert(`접근 불가: ${e.message}`);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [groupId]);

  const me = useMemo(() => members.find((m) => m.isMe), [members]);
  
  // 권한 체크 로직
  const canPromote = me?.role === "OWNER";
  const canKick = (targetRole) => {
    if (me?.role === "OWNER") return true;
    if (me?.role === "MANAGER" && targetRole === "MEMBER") return true;
    return false;
  };
  const canWarn = (targetRole) => {
    if (me?.role === "OWNER") return true;
    if (me?.role === "MANAGER" && targetRole === "MEMBER") return true;
    return false;
  };

  async function handleRoleChange(memberId, newRole) {
    if (!window.confirm("권한을 변경하시겠습니까?")) return;
    try {
      await communityApi.updateMemberRole(groupId, memberId, newRole);
      await load();
    } catch (e) { alert(e.message); }
  }

  async function handleKick(memberId) {
    if (!window.confirm("정말 강퇴하시겠습니까? (되돌릴 수 없습니다)")) return;
    try {
      await communityApi.kickMember(groupId, memberId);
      await load();
    } catch (e) { alert(e.message); }
  }

  // 옐로카드 부여 (Mock Logic)
  function handleWarn(memberId, userName) {
    const current = warnings[memberId] || 0;
    const next = current + 1;
    
    if (next >= 3) {
      if (window.confirm(`${userName}님의 경고가 3회 누적되었습니다. 강퇴하시겠습니까?`)) {
        handleKick(memberId);
      }
    } else {
      if (window.confirm(`${userName}님에게 경고(🟨)를 주시겠습니까? (현재: ${current})`)) {
        setWarnings(prev => ({...prev, [memberId]: next}));
        alert("경고가 부여되었습니다.");
      }
    }
  }

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">멤버 관리</div>
          <div className="tf-subtitle">{group?.name} · 총 {members.length}명</div>
        </div>
        <button className="tf-btn" onClick={() => navigate(`/community/${groupId}`)}>완료</button>
      </div>

      <div className="tf-grid-layout">
        <div className="tf-card">
          <div className="tf-row" style={{justifyContent:'space-between', marginBottom:16}}>
            <h3 style={{margin:0, fontSize:16}}>멤버 리스트</h3>
            <span className="tf-chip">내 권한: {me?.role}</span>
          </div>

          <div className="tf-list">
            {members.map((m) => (
              <div key={m.id} className="tf-item">
                <div className="tf-item__top">
                  <div style={{flex:1}}>
                    <div className="tf-row">
                      <div className="tf-item__title">{m.userName} {m.isMe && "(나)"}</div>
                      <RoleBadge role={m.role} />
                      {(warnings[m.id] || 0) > 0 && (
                        <span className="tf-warn-count">
                           {'🟨'.repeat(warnings[m.id])}
                        </span>
                      )}
                    </div>
                    <div className="tf-item__meta">
                      가입일: {new Date(m.joinedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* 액션 버튼 (본인 제외) */}
                  {!m.isMe && (
                    <div className="tf-actions" style={{flexDirection:'column', alignItems:'flex-end'}}>
                      
                      {/* 권한 변경 (오직 방장만) */}
                      {canPromote && (
                        <select 
                          className="tf-select" 
                          style={{width:100, padding:'6px'}}
                          value={m.role}
                          onChange={(e) => handleRoleChange(m.id, e.target.value)}
                        >
                          <option value="OWNER">방장 위임</option>
                          <option value="MANAGER">부방장</option>
                          <option value="MEMBER">멤버</option>
                        </select>
                      )}

                      <div className="tf-row">
                        {/* 경고 (방장/부방장 -> 멤버) */}
                        {canWarn(m.role) && (
                          <button 
                            className="tf-btn tf-btn--warn" 
                            style={{padding:'6px 10px', fontSize:12}}
                            onClick={() => handleWarn(m.id, m.userName)}
                          >
                            경고
                          </button>
                        )}

                        {/* 강퇴 (권한 있는 경우) */}
                        {canKick(m.role) && (
                          <button 
                            className="tf-btn tf-btn--danger" 
                            style={{padding:'6px 10px', fontSize:12}}
                            onClick={() => handleKick(m.id)}
                          >
                            강퇴
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}