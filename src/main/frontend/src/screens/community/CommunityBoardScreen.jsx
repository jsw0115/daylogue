// FILE: src/main/frontend/src/screens/community/CommunityBoardScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="tf-modal-overlay" onMouseDown={onClose}>
      <div className="tf-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="tf-row" style={{ justifyContent: "space-between" }}>
          <div className="tf-item__title">{title}</div>
          <button className="tf-btn" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="tf-divider" />
        {children}
      </div>
    </div>
  );
}

export default function CommunityBoardScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const [openWrite, setOpenWrite] = useState(false);
  const [write, setWrite] = useState({ type: "general", content: "", tags: "" });

  async function load() {
    setLoading(true);
    try {
      const g = await communityApi.getGroup(groupId);
      setGroup(g);
      const m = await communityApi.listMembers(groupId);
      setMembers(m);
      const list = await communityApi.listPosts(groupId, { q, type });
      setPosts(list);
    } catch (e) {
      alert(`접근 불가: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, type]);

  const me = useMemo(() => members.find((m) => m.isMe), [members]);
  const canManage = useMemo(() => me?.role === "OWNER" || me?.role === "MOD", [me]);

  async function toggleLike(postId) {
    try {
      await communityApi.toggleLike(postId);
      await load();
    } catch (e) {
      alert(`처리 실패: ${String(e?.message || e)}`);
    }
  }

  async function togglePin(postId) {
    try {
      await communityApi.togglePin(groupId, postId);
      await load();
    } catch (e) {
      alert(`핀 실패: ${String(e?.message || e)}`);
    }
  }

  async function submitPost() {
    if (!write.content.trim()) {
      alert("내용을 입력하세요.");
      return;
    }
    try {
      await communityApi.createPost(groupId, {
        type: write.type,
        content: write.content,
        tags: write.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setOpenWrite(false);
      setWrite({ type: "general", content: "", tags: "" });
      await load();
    } catch (e) {
      alert(`작성 실패: ${String(e?.message || e)}`);
    }
  }

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">커뮤니티 게시판</div>
          <div className="tf-subtitle">{group ? group.name : ""} · 글/댓글/좋아요/핀</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={() => navigate(`/community/${groupId}`)}>
            ← 상세
          </button>
          <button className="tf-btn" onClick={() => navigate(`/community/${groupId}/chat`)}>
            채팅
          </button>
          <button className="tf-btn tf-btn--primary" onClick={() => setOpenWrite(true)}>
            + 글쓰기
          </button>
        </div>
      </div>

      <div className="tf-card">
        <div className="tf-row" style={{ justifyContent: "space-between", width: "100%" }}>
          <div className="tf-row">
            {["ALL", "general", "checkin"].map((t) => (
              <button
                key={t}
                className={`tf-btn ${type === t ? "tf-btn--primary" : ""}`}
                onClick={() => setType(t)}
              >
                {t === "ALL" ? "전체" : t === "general" ? "일반" : "인증"}
              </button>
            ))}
          </div>

          <div className="tf-row" style={{ minWidth: 320 }}>
            <input
              className="tf-input"
              placeholder="내용/태그 검색"
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

        <div className="tf-list">
          {posts.map((p) => (
            <div key={p.id} className="tf-item">
              <div className="tf-item__top">
                <div>
                  <div className="tf-item__title">
                    {p.pinned ? "📌 " : ""}
                    {p.type === "checkin" ? "[인증] " : ""}
                    {p.authorName}
                  </div>
                  <div className="tf-item__meta">
                    <span className="tf-chip">{new Date(p.createdAt).toLocaleString()}</span>
                    <span className="tf-chip">좋아요 {p.likeCount}</span>
                    <span className="tf-chip">댓글 {p.commentCount}</span>
                  </div>
                </div>

                <div className="tf-row">
                  <button className="tf-btn" onClick={() => toggleLike(p.id)}>
                    {p.likedByMe ? "좋아요 취소" : "좋아요"}
                  </button>
                  {canManage ? (
                    <button className="tf-btn" onClick={() => togglePin(p.id)}>
                      {p.pinned ? "핀 해제" : "핀"}
                    </button>
                  ) : null}
                  <button
                    className="tf-btn"
                    onClick={() => alert("신고/숨김은 관리자 정책(ADM-008) 확정 후 연동 예정")}
                  >
                    신고
                  </button>
                </div>
              </div>

              <div className="tf-divider" />
              <div style={{ whiteSpace: "pre-wrap" }}>{p.content}</div>

              {(p.tags || []).length ? (
                <>
                  <div className="tf-divider" />
                  <div className="tf-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="tf-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          ))}

          {!loading && posts.length === 0 ? (
            <div className="tf-muted tf-small">게시글이 없습니다.</div>
          ) : null}
          {loading ? <div className="tf-muted tf-small">불러오는 중...</div> : null}
        </div>
      </div>

      <Modal open={openWrite} title="새 게시글" onClose={() => setOpenWrite(false)}>
        <div className="tf-grid">
          <div className="tf-col-6">
            <div className="tf-muted tf-small">타입</div>
            <select
              className="tf-select"
              value={write.type}
              onChange={(e) => setWrite((p) => ({ ...p, type: e.target.value }))}
            >
              <option value="general">일반</option>
              <option value="checkin">인증</option>
            </select>
          </div>

          <div className="tf-col-6">
            <div className="tf-muted tf-small">태그(쉼표로 구분)</div>
            <input
              className="tf-input"
              value={write.tags}
              onChange={(e) => setWrite((p) => ({ ...p, tags: e.target.value }))}
              placeholder="#운동, #공부"
            />
          </div>

          <div className="tf-col-12">
            <div className="tf-muted tf-small">내용</div>
            <textarea
              className="tf-textarea"
              value={write.content}
              onChange={(e) => setWrite((p) => ({ ...p, content: e.target.value }))}
              placeholder="내용을 입력하세요."
            />
          </div>

          <div className="tf-col-12">
            <div className="tf-row" style={{ justifyContent: "flex-end", width: "100%" }}>
              <button className="tf-btn" onClick={() => setOpenWrite(false)}>
                취소
              </button>
              <button className="tf-btn tf-btn--primary" onClick={submitPost}>
                등록
              </button>
            </div>
          </div>

          <div className="tf-col-12 tf-small tf-muted">
            참고(근거 부족): 첨부/댓글/도배 제한/금칙어/신고 처리(ADM-008)는 서버 정책과 함께 확장해야 합니다.
          </div>
        </div>
      </Modal>
    </div>
  );
}
