import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

const CATEGORIES = ["ALL", "운동", "공부", "일상", "갓생"];

export default function CommunityFeedScreen() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("ALL");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  async function load() {
    setLoading(true);
    try {
      const list = await communityApi.listGroups({ q, category });
      setGroups(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [category]);

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">커뮤니티</div>
          <div className="tf-subtitle">함께하는 갓생, 성장의 즐거움</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={load} disabled={loading}>🔄 새로고침</button>
          <button className="tf-btn tf-btn--primary" onClick={() => navigate("/community/new")}>
            + 그룹 만들기
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="tf-card">
        <div className="tf-row" style={{justifyContent: 'space-between'}}>
          <div className="tf-row" style={{overflowX: 'auto', paddingBottom: 4}}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`tf-btn ${category === c ? "tf-btn--primary" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c === "ALL" ? "전체" : c}
              </button>
            ))}
          </div>
          
          <div className="tf-row" style={{flex: 1, minWidth: 200}}>
            <input
              className="tf-input"
              placeholder="그룹 검색..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
            <button className="tf-btn" onClick={load}>🔍</button>
          </div>
        </div>
      </div>

      {/* Grid Layout (Responsive) */}
      <div className="tf-card-grid">
        {groups.map((g) => (
          <div key={g.id} className="tf-card" style={{display:'flex', flexDirection:'column', height:'100%', marginBottom:0}}>
            <div style={{flex:1}}>
              <div className="tf-row" style={{justifyContent:'space-between', marginBottom:8}}>
                <div className="tf-badge">{g.category}</div>
                <div className="tf-chip">👥 {g.memberCount}/{g.maxMembers || "∞"}</div>
              </div>
              <div className="tf-item__title" style={{fontSize: 18}}>{g.name}</div>
              <div className="tf-small tf-muted tf-ellipsis" style={{marginTop: 8, WebkitLineClamp: 2, display:'-webkit-box', WebkitBoxOrient:'vertical', whiteSpace:'normal'}}>
                {g.description}
              </div>
            </div>
            
            <div className="tf-divider"/>
            
            <div className="tf-row" style={{justifyContent:'space-between'}}>
              <div className="tf-small tf-muted">방장 {g.ownerName}</div>
              <button className="tf-btn tf-btn--primary" onClick={() => navigate(`/community/${g.id}`)}>
                입장하기
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {!loading && groups.length === 0 && (
        <div className="tf-card" style={{textAlign:'center', padding: 40}}>
          <div className="tf-muted">조건에 맞는 커뮤니티가 없습니다.</div>
        </div>
      )}
    </div>
  );
}