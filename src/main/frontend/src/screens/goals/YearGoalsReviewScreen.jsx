import React, { useEffect, useMemo, useState } from "react";
import { goalsApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

function yearNow() {
  return new Date().getFullYear();
}

function toClipboard(text) {
  if (!navigator.clipboard) return Promise.reject(new Error("ClipboardNotSupported"));
  return navigator.clipboard.writeText(text);
}

export default function YearGoalsReviewScreen() {
  const [year, setYear] = useState(yearNow());
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    yearGoal: "",
    yearTheme: "",
    keyMetrics: "",
    quarterlyPlan: "",
    reviewHighlights: "",
    reviewRegrets: "",
    lessons: "",
    nextYearDraft: "",
  });

  async function load() {
    setLoading(true);
    try {
      const saved = await goalsApi.getYearData(year);
      if (saved) setData(saved);
      else {
        setData({
          yearGoal: "올해의 목표 3가지를 작성하세요.",
          yearTheme: "올해의 키워드/테마를 1~2개 정하세요.",
          keyMetrics: "- (예) 운동 주 3회\n- (예) 독서 12권\n- (예) 프로젝트 2개 완료",
          quarterlyPlan: "Q1/Q2/Q3/Q4로 나눠 간단히 계획을 적으세요.",
          reviewHighlights: "가장 잘한 점/성과/변화",
          reviewRegrets: "아쉬웠던 점/놓친 기회",
          lessons: "배운 점/원칙/다음에 적용할 규칙",
          nextYearDraft: "내년 목표 초안과 첫 행동(1주 계획)",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  async function save() {
    setLoading(true);
    try {
      await goalsApi.saveYearData(year, data);
      alert("저장되었습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    const text = [
      `# ${year} 신년목표 & 올해 회고`,
      "",
      "## 올해 테마",
      data.yearTheme,
      "",
      "## 올해 목표",
      data.yearGoal,
      "",
      "## 핵심 지표",
      data.keyMetrics,
      "",
      "## 분기 계획(Q1~Q4)",
      data.quarterlyPlan,
      "",
      "## 하이라이트",
      data.reviewHighlights,
      "",
      "## 아쉬운 점",
      data.reviewRegrets,
      "",
      "## 배운 점",
      data.lessons,
      "",
      "## 내년 초안",
      data.nextYearDraft,
    ].join("\n");

    try {
      await toClipboard(text);
      alert("복사되었습니다.");
    } catch {
      alert("복사 실패: 클립보드 권한을 확인하세요.");
    }
  }

  const title = useMemo(() => `${year} 신년목표 / 올해 회고`, [year]);

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">{title}</div>
          <div className="tf-subtitle">연간 목표/회고 템플릿 저장 + 복사</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={load} disabled={loading}>새로고침</button>
          <button className="tf-btn" onClick={copy}>복사</button>
          <button className="tf-btn tf-btn--primary" onClick={save} disabled={loading}>저장</button>
        </div>
      </div>

      <div className="tf-grid">
        <div className="tf-col-4 tf-card">
          <div className="tf-muted tf-small">연도 선택</div>
          <div className="tf-divider" />

          <div className="tf-row" style={{ width: "100%", justifyContent: "space-between" }}>
            <button className="tf-btn" onClick={() => setYear((y) => y - 1)}>←</button>
            <div className="tf-badge">{year}</div>
            <button className="tf-btn" onClick={() => setYear((y) => y + 1)}>→</button>
          </div>

          <div className="tf-divider" />
          <div className="tf-small tf-muted">
            팁: 내년 초안은 “첫 행동 1개”까지 써두면 실제 실행률이 올라갑니다.
          </div>
        </div>

        <div className="tf-col-8 tf-card">
          <div className="tf-muted tf-small">작성</div>
          <div className="tf-divider" />

          <div className="tf-small tf-muted">올해 테마</div>
          <input className="tf-input" value={data.yearTheme} onChange={(e) => setData((p) => ({ ...p, yearTheme: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">올해 목표</div>
          <textarea className="tf-textarea" value={data.yearGoal} onChange={(e) => setData((p) => ({ ...p, yearGoal: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">핵심 지표</div>
          <textarea className="tf-textarea" value={data.keyMetrics} onChange={(e) => setData((p) => ({ ...p, keyMetrics: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">분기 계획(Q1~Q4)</div>
          <textarea className="tf-textarea" value={data.quarterlyPlan} onChange={(e) => setData((p) => ({ ...p, quarterlyPlan: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">하이라이트</div>
          <textarea className="tf-textarea" value={data.reviewHighlights} onChange={(e) => setData((p) => ({ ...p, reviewHighlights: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">아쉬운 점</div>
          <textarea className="tf-textarea" value={data.reviewRegrets} onChange={(e) => setData((p) => ({ ...p, reviewRegrets: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">배운 점</div>
          <textarea className="tf-textarea" value={data.lessons} onChange={(e) => setData((p) => ({ ...p, lessons: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">내년 초안</div>
          <textarea className="tf-textarea" value={data.nextYearDraft} onChange={(e) => setData((p) => ({ ...p, nextYearDraft: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}
