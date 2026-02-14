import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

// 하위 기능 컴포넌트 import (아래 코드 참조)
import CommunityRaidScreen from "./features/CommunityRaidScreen";
import CommunityDepositScreen from "./features/CommunityDepositScreen";

function TabButton({ active, onClick, children }) {
  return (
    <button 
      className={`tf-btn ${active ? "tf-btn--primary" : ""}`} 
      onClick={onClick}
      style={{ flex: 1 }}
    >
      {children}
    </button>
  );
}

export default function CommunityDetailScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const g = await communityApi.getGroup(groupId);
        setGroup(g);
        if (g) {
          const m = await communityApi.listMembers(groupId);
          setMembers(m);
        }
      } catch (e) { alert(e.message); }
      finally { setLoading(false); }
    })();
  }, [groupId]);

  const me = useMemo(() => members.find((m) => m.isMe), [members]);
  const canManage = me?.role === "OWNER" || me?.role === "MANAGER";

  if (!group) return <div className="tf-page">로딩중...</div>;

  return (
    <div className="tf-page">
      {/* Header */}
      <div className="tf-page__header">
        <div>
          <div className="tf-title">{group.name}</div>
          <div className="tf-subtitle">{group.category} · 멤버 {group.memberCount}명</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={() => navigate("/community")}>목록</button>
          {me ? (
            <>
              <button className="tf-btn tf-btn--primary" onClick={() => navigate(`/community/${groupId}/chat`)}>
                채팅방
              </button>
              {canManage && (
                <button className="tf-btn" onClick={() => navigate(`/community/${groupId}/members`)}>
                  멤버 관리
                </button>
              )}
            </>
          ) : (
            <button className="tf-btn tf-btn--primary">가입하기</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tf-row" style={{marginBottom: 20, overflowX: 'auto'}}>
        <TabButton active={tab === "home"} onClick={() => setTab("home")}>🏠 홈</TabButton>
        <TabButton active={tab === "raid"} onClick={() => setTab("raid")}>⚔️ 레이드</TabButton>
        <TabButton active={tab === "deposit"} onClick={() => setTab("deposit")}>💰 보증금</TabButton>
      </div>

      {/* Tab Contents */}
      {tab === "home" && (
        <div className="tf-grid-layout">
          <div className="tf-card">
            <h3 style={{margin:'0 0 12px 0'}}>📢 공지사항</h3>
            <div style={{whiteSpace:'pre-wrap', fontSize:14}}>{group.pinnedNotice || "등록된 공지가 없습니다."}</div>
          </div>
          
          <div className="tf-card">
            <h3 style={{margin:'0 0 12px 0'}}>🏆 금주 랭킹</h3>
            <div className="tf-list">
              {members.slice(0, 3).map((m, i) => (
                 <div key={m.id} className="tf-row" style={{justifyContent:'space-between', padding:'8px 0', borderBottom:'1px dashed #eee'}}>
                   <span>{i+1}위 {m.userName}</span>
                   <span className="tf-chip">🔥 9{8-i}점</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub Features */}
      {tab === "raid" && <CommunityRaidScreen />}
      {tab === "deposit" && <CommunityDepositScreen />}
    </div>
  );
}