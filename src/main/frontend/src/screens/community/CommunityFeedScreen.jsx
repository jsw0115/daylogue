// FILE: src/main/frontend/src/screens/community/CommunityFeedScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

const CATEGORIES = ["ALL", "운동", "공부", "일상", "갓생"];

function Badge({ children }) {
  return <span className="tf-badge">{children}</span>;
}

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

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const filtered = useMemo(() => groups, [groups]);

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">커뮤니티 탐색/피드</div>
          <div className="tf-subtitle">카테고리 필터, 검색, 생성, 상세 진입</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn tf-btn--primary" onClick={() => navigate("/community/new")}>
            + 커뮤니티 만들기
          </button>
          <button className="tf-btn" onClick={load} disabled={loading}>
            새로고침
          </button>
        </div>
      </div>

      <div className="tf-grid">
        <div className="tf-col-12 tf-card">
          <div className="tf-row" style={{ justifyContent: "space-between", width: "100%" }}>
            <div className="tf-row">
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

            <div className="tf-row" style={{ minWidth: 320 }}>
              <input
                className="tf-input"
                placeholder="이름/설명 검색"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") load();
                }}
              />
              <button className="tf-btn tf-btn--primary" onClick={load} disabled={loading}>
                검색
              </button>
            </div>
          </div>

          <div className="tf-divider" />

          <div className="tf-grid">
            {filtered.map((g) => (
              <div key={g.id} className="tf-col-4 tf-item">
                <div className="tf-item__top">
                  <div>
                    <div className="tf-item__title">{g.name}</div>
                    <div className="tf-item__meta">
                      <span className="tf-chip">{g.category}</span>
                      <span className="tf-chip">{g.isPublic ? "공개" : "비공개"}</span>
                      <span className="tf-chip">{g.requireApproval ? "승인 필요" : "즉시 가입"}</span>
                      <span className="tf-chip">멤버 {g.memberCount}/{g.maxMembers || "∞"}</span>
                    </div>
                  </div>

                  <div className="tf-row">
                    <button className="tf-btn" onClick={() => navigate(`/community/${g.id}`)}>
                      상세
                    </button>
                  </div>
                </div>

                <div className="tf-divider" />
                <div className="tf-small tf-muted">{g.description}</div>

                {g.pinnedNotice ? (
                  <>
                    <div className="tf-divider" />
                    <Badge>공지</Badge>
                    <div className="tf-small" style={{ marginTop: 6 }}>
                      {g.pinnedNotice}
                    </div>
                  </>
                ) : null}

                <div className="tf-divider" />
                <div className="tf-row" style={{ justifyContent: "space-between", width: "100%" }}>
                  <div className="tf-small tf-muted">방장: {g.ownerName}</div>
                  <button
                    className="tf-btn tf-btn--primary"
                    onClick={() => navigate(`/community/${g.id}`)}
                  >
                    들어가기
                  </button>
                </div>
              </div>
            ))}

            {!loading && filtered.length === 0 ? (
              <div className="tf-col-12 tf-muted tf-small">
                검색 결과가 없습니다.
              </div>
            ) : null}

            {loading ? (
              <div className="tf-col-12 tf-muted tf-small">
                불러오는 중...
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
