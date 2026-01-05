// FILE: src/main/frontend/src/screens/community/CommunityMembersScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

export default function CommunityMembersScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const g = await communityApi.getGroup(groupId);
      setGroup(g);
      const m = await communityApi.listMembers(groupId);
      setMembers(m);
    } catch (e) {
      alert(`접근 불가: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const me = useMemo(() => members.find((m) => m.isMe), [members]);
  const canManage = useMemo(() => me?.role === "OWNER" || me?.role === "MOD", [me]);

  async function setRole(memberId, role) {
    try {
      await communityApi.updateMemberRole(groupId, memberId, role);
      await load();
    } catch (e) {
      alert(`역할 변경 실패: ${String(e?.message || e)}`);
    }
  }

  async function kick(memberId) {
    if (!window.confirm("정말 강퇴할까요?")) return;
    try {
      await communityApi.kickMember(groupId, memberId);
      await load();
    } catch (e) {
      alert(`강퇴 실패: ${String(e?.message || e)}`);
    }
  }

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">멤버/권한 관리</div>
          <div className="tf-subtitle">
            {group ? group.name : ""} · OWNER/MOD 권한으로 관리
          </div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={() => navigate(`/community/${groupId}`)}>
            ← 상세
          </button>
          <button className="tf-btn" onClick={load} disabled={loading}>
            새로고침
          </button>
        </div>
      </div>

      <div className="tf-card">
        <div className="tf-row" style={{ justifyContent: "space-between", width: "100%" }}>
          <div className="tf-row">
            <span className="tf-badge">
              내 역할: {me ? me.role : "비회원"}
            </span>
            <span className="tf-badge">
              멤버 수: {members.length}
            </span>
          </div>
          <div className="tf-small tf-muted">
            정책: MOD는 OWNER 변경/강퇴 불가 (Mock에 반영)
          </div>
        </div>

        <div className="tf-divider" />

        <div className="tf-list">
          {members.map((m) => (
            <div key={m.id} className="tf-item">
              <div className="tf-item__top">
                <div>
                  <div className="tf-item__title">
                    {m.userName} {m.isMe ? "(나)" : ""}
                  </div>
                  <div className="tf-item__meta">
                    <span className="tf-chip">{m.role}</span>
                    <span className="tf-chip">가입 {new Date(m.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {canManage ? (
                  <div className="tf-row">
                    <select
                      className="tf-select"
                      style={{ width: 160 }}
                      value={m.role}
                      onChange={(e) => setRole(m.id, e.target.value)}
                      disabled={m.role === "OWNER" && me?.role !== "OWNER"}
                    >
                      <option value="OWNER">OWNER</option>
                      <option value="MOD">MOD</option>
                      <option value="MEMBER">MEMBER</option>
                    </select>

                    <button
                      className="tf-btn tf-btn--danger"
                      onClick={() => kick(m.id)}
                      disabled={m.role === "OWNER"}
                      title={m.role === "OWNER" ? "OWNER는 강퇴할 수 없습니다." : ""}
                    >
                      강퇴
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {loading ? <div className="tf-muted tf-small">불러오는 중...</div> : null}
        </div>
      </div>
    </div>
  );
}
