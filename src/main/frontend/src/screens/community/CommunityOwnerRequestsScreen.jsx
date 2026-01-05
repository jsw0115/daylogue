// FILE: src/main/frontend/src/screens/community/CommunityOwnerRequestsScreen.jsx
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

export default function CommunityOwnerRequestsScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  async function load() {
    setLoading(true);
    try {
      const g = await communityApi.getGroup(groupId);
      setGroup(g);
      const reqs = await communityApi.listJoinRequests(groupId, { status });
      setList(reqs);
    } catch (e) {
      alert(`요청함 접근 불가: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, status]);

  const statusLabel = useMemo(() => {
    if (status === "PENDING") return "대기";
    if (status === "APPROVED") return "승인";
    if (status === "REJECTED") return "거절";
    return "전체";
  }, [status]);

  async function approve(id) {
    try {
      await communityApi.approveJoinRequest(groupId, id);
      alert("승인 처리되었습니다.");
      setSelected(null);
      await load();
    } catch (e) {
      alert(`승인 실패: ${String(e?.message || e)}`);
    }
  }

  async function reject(id) {
    try {
      await communityApi.rejectJoinRequest(groupId, id, rejectReason);
      alert("거절 처리되었습니다.");
      setSelected(null);
      setRejectReason("");
      await load();
    } catch (e) {
      alert(`거절 실패: ${String(e?.message || e)}`);
    }
  }

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">방장 요청함</div>
          <div className="tf-subtitle">
            {group ? group.name : ""} · 가입 신청 승인/거절 · 정원 재검증
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
        <div className="tf-row" style={{ justifyContent: "space-between" }}>
          <div className="tf-row">
            {["PENDING", "APPROVED", "REJECTED", "ALL"].map((s) => (
              <button
                key={s}
                className={`tf-btn ${status === s ? "tf-btn--primary" : ""}`}
                onClick={() => setStatus(s)}
              >
                {s === "PENDING" ? "대기" : s === "APPROVED" ? "승인" : s === "REJECTED" ? "거절" : "전체"}
              </button>
            ))}
          </div>
          <div className="tf-small tf-muted">현재 필터: {statusLabel}</div>
        </div>

        <div className="tf-divider" />

        <div className="tf-list">
          {list.map((r) => (
            <div key={r.id} className="tf-item">
              <div className="tf-item__top">
                <div>
                  <div className="tf-item__title">
                    {r.requesterName} · {r.status}
                  </div>
                  <div className="tf-item__meta">
                    <span className="tf-chip">요청일 {new Date(r.createdAt).toLocaleString()}</span>
                    {r.handledAt ? <span className="tf-chip">처리 {new Date(r.handledAt).toLocaleString()}</span> : null}
                  </div>
                </div>
                <div className="tf-row">
                  <button className="tf-btn" onClick={() => setSelected(r)}>
                    상세
                  </button>
                </div>
              </div>

              <div className="tf-divider" />
              <div className="tf-small" style={{ whiteSpace: "pre-wrap" }}>
                {r.message || "(메시지 없음)"}
              </div>
            </div>
          ))}

          {!loading && list.length === 0 ? (
            <div className="tf-muted tf-small">요청이 없습니다.</div>
          ) : null}
          {loading ? <div className="tf-muted tf-small">불러오는 중...</div> : null}
        </div>
      </div>

      <Modal
        open={!!selected}
        title="가입 신청 상세"
        onClose={() => {
          setSelected(null);
          setRejectReason("");
        }}
      >
        {selected ? (
          <div className="tf-grid">
            <div className="tf-col-12">
              <div className="tf-muted tf-small">신청자</div>
              <div style={{ marginTop: 6, fontWeight: 900 }}>{selected.requesterName}</div>
            </div>

            <div className="tf-col-12">
              <div className="tf-muted tf-small">메시지</div>
              <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{selected.message || "(없음)"}</div>
            </div>

            <div className="tf-col-12">
              <div className="tf-divider" />
              {selected.status === "PENDING" ? (
                <>
                  <div className="tf-row" style={{ justifyContent: "flex-end", width: "100%" }}>
                    <button className="tf-btn tf-btn--primary" onClick={() => approve(selected.id)}>
                      승인
                    </button>
                  </div>

                  <div className="tf-divider" />

                  <div className="tf-muted tf-small">거절 사유(옵션)</div>
                  <input
                    className="tf-input"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="예: 모집이 마감되었습니다."
                  />
                  <div className="tf-row" style={{ justifyContent: "flex-end", width: "100%", marginTop: 10 }}>
                    <button className="tf-btn tf-btn--danger" onClick={() => reject(selected.id)}>
                      거절
                    </button>
                  </div>

                  <div className="tf-divider" />
                  <div className="tf-small tf-muted">
                    승인 순간에 정원(maxMembers)을 재검증하도록 Mock에 반영되어 있습니다.
                  </div>
                </>
              ) : (
                <div className="tf-small tf-muted">이미 처리된 요청입니다.</div>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
