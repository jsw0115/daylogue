import React, { useEffect, useState } from "react";
import { aiApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AiReportScreen() {
  const [scope, setScope] = useState("WEEK"); // WEEK | MONTH | YEAR
  const [baseDate, setBaseDate] = useState(todayStr());
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  async function generate() {
    setLoading(true);
    try {
      const r = await aiApi.generate({ scope, baseDate });
      setReport(r);
    } catch (e) {
      alert(`생성 실패: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // 첫 진입 시 1회 생성
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">AI 리포트</div>
          <div className="tf-subtitle">주/월/년 요약 + 다음 액션 제안 (현재는 임시 생성)</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={generate} disabled={loading}>
            다시 생성
          </button>
          <button className="tf-btn tf-btn--primary" onClick={() => alert("서버 연동 시 저장/공유 기능 확장 예정")}>
            저장(옵션)
          </button>
        </div>
      </div>

      <div className="tf-grid">
        <div className="tf-col-4 tf-card">
          <div className="tf-muted tf-small">설정</div>
          <div className="tf-divider" />

          <div className="tf-small tf-muted">범위</div>
          <select className="tf-select" value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="WEEK">주간</option>
            <option value="MONTH">월간</option>
            <option value="YEAR">연간</option>
          </select>

          <div className="tf-divider" />
          <div className="tf-small tf-muted">기준일</div>
          <input className="tf-input" type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} />

          <div className="tf-divider" />
          <button className="tf-btn tf-btn--primary" onClick={generate} disabled={loading}>
            생성
          </button>

          <div className="tf-divider" />
          <div className="tf-small tf-muted">
            근거 부족 안내: 현재 리포트는 로컬 Mock 데이터를 기반으로 “형태”만 제공합니다.
            실제 AI 요약은 서버에서 타임바/할일/일기/루틴/방해요인 등을 집계해 생성해야 합니다.
          </div>
        </div>

        <div className="tf-col-8 tf-card">
          <div className="tf-muted tf-small">리포트</div>
          <div className="tf-divider" />

          {!report ? (
            <div className="tf-muted tf-small">{loading ? "생성 중..." : "리포트가 없습니다."}</div>
          ) : (
            <>
              <div className="tf-item__title">{report.title}</div>
              <div className="tf-small tf-muted" style={{ marginTop: 6 }}>
                기준일: {baseDate} · 생성: {new Date(report.createdAt).toLocaleString()}
              </div>

              <div className="tf-divider" />

              <div className="tf-muted tf-small">하이라이트</div>
              <div className="tf-list" style={{ marginTop: 10 }}>
                {report.highlights.map((t, i) => (
                  <div key={i} className="tf-item">
                    {t}
                  </div>
                ))}
              </div>

              <div className="tf-divider" />

              <div className="tf-muted tf-small">인사이트</div>
              <div className="tf-list" style={{ marginTop: 10 }}>
                {report.insights.map((t, i) => (
                  <div key={i} className="tf-item">
                    {t}
                  </div>
                ))}
              </div>

              <div className="tf-divider" />

              <div className="tf-muted tf-small">다음 액션(3)</div>
              <div className="tf-list" style={{ marginTop: 10 }}>
                {report.nextActions.map((t, i) => (
                  <div key={i} className="tf-item">
                    {i + 1}. {t}
                  </div>
                ))}
              </div>

              <div className="tf-divider" />
              <div className="tf-small tf-muted">{report.disclaimer}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
