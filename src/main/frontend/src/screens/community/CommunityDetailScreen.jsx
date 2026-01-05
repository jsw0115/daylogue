// FILE: src/main/frontend/src/screens/community/CommunityDetailScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

function TabButton({ active, onClick, children }) {
  return (
    <button className={`tf-btn ${active ? "tf-btn--primary" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function CommunityDetailScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [tab, setTab] = useState("intro");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function load() {
    setLoading(true);
    setErrorText("");
    try {
      const g = await communityApi.getGroup(groupId);
      setGroup(g);
      if (g) {
        const m = await communityApi.listMembers(groupId);
        setMembers(m);
      }
    } catch (e) {
      setErrorText(String(e?.message || e));
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

  async function joinOrRequest() {
    if (!group) return;

    try {
      if (group.requireApproval) {
        navigate(`/community/${group.id}/join`);
      } else {
        await communityApi.joinDirect(group.id);
        await load();
        alert("가입되었습니다.");
      }
    } catch (e) {
      alert(`처리 실패: ${String(e?.message || e)}`);
    }
  }

  if (!group && loading) {
    return (
      <div className="tf-page">
        <div className="tf-muted">불러오는 중...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="tf-page">
        <div className="tf-title">커뮤니티 상세</div>
        <div className="tf-muted tf-small" style={{ marginTop: 8 }}>
          존재하지 않거나 접근할 수 없습니다.
        </div>
        {errorText ? <div className="tf-muted tf-small">{errorText}</div> : null}
        <div className="tf-actions" style={{ marginTop: 12 }}>
          <button className="tf-btn" onClick={() => navigate("/community")}>
            목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">{group.name}</div>
          <div className="tf-subtitle">
            {group.category} · {group.isPublic ? "공개" : "비공개"} ·{" "}
            {group.requireApproval ? "승인 필요" : "즉시 가입"} · 멤버 {group.memberCount}/
            {group.maxMembers || "∞"}
          </div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={() => navigate("/community")}>
            ← 목록
          </button>

          {me ? (
            <>
              <button className="tf-btn" onClick={() => navigate(`/community/${group.id}/board`)}>
                게시판
              </button>
              <button className="tf-btn tf-btn--primary" onClick={() => navigate(`/community/${group.id}/chat`)}>
                채팅
              </button>
            </>
          ) : (
            <button className="tf-btn tf-btn--primary" onClick={joinOrRequest}>
              {group.requireApproval ? "가입 신청" : "즉시 가입"}
            </button>
          )}

          {canManage ? (
            <>
              <button className="tf-btn" onClick={() => navigate(`/community/${group.id}/requests`)}>
                요청함
              </button>
              <button className="tf-btn" onClick={() => navigate(`/community/${group.id}/members`)}>
                멤버 관리
              </button>
              <button className="tf-btn" onClick={() => navigate(`/community/${group.id}/edit`)}>
                설정
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="tf-card">
        {group.pinnedNotice ? (
          <>
            <div className="tf-row">
              <span className="tf-badge">공지</span>
              <span className="tf-small">{group.pinnedNotice}</span>
            </div>
            <div className="tf-divider" />
          </>
        ) : null}

        <div className="tf-row">
          <TabButton active={tab === "intro"} onClick={() => setTab("intro")}>
            소개
          </TabButton>
          <TabButton active={tab === "rules"} onClick={() => setTab("rules")}>
            규칙
          </TabButton>
          <TabButton active={tab === "members"} onClick={() => setTab("members")}>
            멤버
          </TabButton>
          <TabButton active={tab === "board"} onClick={() => setTab("board")}>
            게시판
          </TabButton>
          <TabButton active={tab === "challenge"} onClick={() => setTab("challenge")}>
            챌린지
          </TabButton>
        </div>

        <div className="tf-divider" />

        {tab === "intro" ? (
          <div className="tf-grid">
            <div className="tf-col-12">
              <div className="tf-muted tf-small">설명</div>
              <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{group.description}</div>
            </div>
          </div>
        ) : null}

        {tab === "rules" ? (
          <div className="tf-grid">
            <div className="tf-col-12">
              <div className="tf-muted tf-small">규칙</div>
              <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{group.rules || "규칙이 없습니다."}</div>
            </div>
          </div>
        ) : null}

        {tab === "members" ? (
          <div className="tf-grid">
            <div className="tf-col-12">
              <div className="tf-muted tf-small">멤버 미리보기</div>
              <div className="tf-list" style={{ marginTop: 10 }}>
                {members.slice(0, 6).map((m) => (
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
                        <button className="tf-btn" onClick={() => navigate(`/community/${group.id}/members`)}>
                          관리로 이동
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {tab === "board" ? (
          <div className="tf-grid">
            <div className="tf-col-12">
              <div className="tf-muted tf-small">게시판은 전용 화면으로 이동합니다.</div>
              <div className="tf-actions" style={{ marginTop: 10 }}>
                <button className="tf-btn tf-btn--primary" onClick={() => navigate(`/community/${group.id}/board`)}>
                  게시판 열기
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "challenge" ? (
          <div className="tf-grid">
            <div className="tf-col-12">
              <div className="tf-muted tf-small">
                챌린지 기능은 UI 슬롯만 확보했습니다. (서버 모델/정책 확정 후 확장)
              </div>
              <div className="tf-card" style={{ marginTop: 10 }}>
                <div className="tf-item__title">예시 챌린지</div>
                <div className="tf-small tf-muted" style={{ marginTop: 6 }}>
                  7일 연속 인증 / 주 3회 운동 / 1시간 집중 등
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {loading ? <div className="tf-muted tf-small" style={{ marginTop: 10 }}>불러오는 중...</div> : null}
    </div>
  );
}
