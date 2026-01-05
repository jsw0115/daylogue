// FILE: src/main/frontend/src/screens/community/CommunityJoinRequestScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

export default function CommunityJoinRequestScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    const g = await communityApi.getGroup(groupId);
    setGroup(g);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  async function submit() {
    if (!agree) {
      alert("규칙 동의가 필요합니다.");
      return;
    }
    if (!message.trim()) {
      alert("신청 사유/소개를 입력하세요.");
      return;
    }

    setLoading(true);
    try {
      await communityApi.createJoinRequest(groupId, { message });
      alert("가입 신청이 접수되었습니다.");
      navigate(`/community/${groupId}`);
    } catch (e) {
      alert(`신청 실패: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  if (!group) {
    return (
      <div className="tf-page">
        <div className="tf-muted">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">가입 신청</div>
          <div className="tf-subtitle">
            {group.name} · 승인 필요 커뮤니티
          </div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={() => navigate(`/community/${groupId}`)}>
            취소
          </button>
          <button className="tf-btn tf-btn--primary" onClick={submit} disabled={loading}>
            신청하기
          </button>
        </div>
      </div>

      <div className="tf-grid">
        <div className="tf-col-8 tf-card">
          <div className="tf-muted tf-small">신청 내용</div>
          <div className="tf-divider" />

          <div className="tf-small tf-muted">신청 사유/간단 소개</div>
          <textarea
            className="tf-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="예: 아침 루틴을 만들고 싶어서 신청합니다. 주 5회 인증 목표입니다."
          />

          <div className="tf-divider" />
          <label className="tf-row">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span className="tf-small">커뮤니티 규칙을 읽었고 동의합니다.</span>
          </label>
        </div>

        <div className="tf-col-4 tf-card">
          <div className="tf-muted tf-small">규칙</div>
          <div className="tf-divider" />
          <div style={{ whiteSpace: "pre-wrap" }}>{group.rules || "규칙이 없습니다."}</div>

          <div className="tf-divider" />
          <div className="tf-small tf-muted">
            참고(근거 부족): 실제 서비스에서 “방장 DM 자동 생성/상태 메시지”는 서버+WS가 필요합니다.
            현재는 Mock에서 시스템 메시지로만 모사합니다.
          </div>
        </div>
      </div>
    </div>
  );
}
