import React, { useEffect, useMemo, useState } from "react";
import { categoryApi, workApi, statsApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";

function buildKey(scope, baseDateStr) {
  const d = new Date(baseDateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${scope}_${y}-${m}-${day}`;
}

function toClipboard(text) {
  if (!navigator.clipboard) return Promise.reject(new Error("ClipboardNotSupported"));
  return navigator.clipboard.writeText(text);
}

export default function WorkReportScreen() {
  const [scope, setScope] = useState("DAY"); // DAY | WEEK | MONTH | YEAR
  const [baseDate, setBaseDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [report, setReport] = useState({
    title: "",
    summary: "",
    achievements: "",
    issues: "",
    nextPlan: "",
    pvaNote: "",
  });

  const key = useMemo(() => buildKey(scope, baseDate), [scope, baseDate]);

  async function load() {
    setLoading(true);
    try {
      const cats = await categoryApi.listCategories();
      setCategories(cats);
      const saved = await workApi.getReport(key);
      if (saved) {
        setReport(saved);
      } else {
        setReport({
          title: `${scope === "DAY" ? "일간" : scope === "WEEK" ? "주간" : scope === "MONTH" ? "월간" : "연간"} 업무 리포트`,
          summary: "이번 기간의 핵심 업무를 3줄로 요약하세요.",
          achievements: "- (예) 기능 개발/배포\n- (예) 성능 개선\n- (예) 이슈 대응",
          issues: "- (예) 리스크/지연 요소\n- (예) 의존 이슈",
          nextPlan: "- (예) 다음 기간 계획\n- (예) 우선순위",
          pvaNote: "Plan vs Actual 차이를 간단히 기록하세요.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  async function save() {
    setLoading(true);
    try {
      await workApi.saveReport(key, report);
      alert("저장되었습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function autoFillPva() {
    // 실제론 업무 카테고리 기반 타임블록(Actual) + 계획(Plan)을 서버 집계로 받아야 함
    // 현재는 UI 검증용 더미 비교
    setLoading(true);
    try {
      const compare = await statsApi.getCompare({ period: scope === "DAY" ? "DAY" : scope, baseDate });
      const { planTotal, actualTotal } = compare.summary;

      const rate = planTotal === 0 ? 0 : Math.round((actualTotal / planTotal) * 100);
      setReport((p) => ({
        ...p,
        pvaNote: `기간: ${scope}\n계획 시간: ${planTotal}h\n실행 시간: ${actualTotal}h\n달성률: ${rate}%\n메모: (차이 원인/방해요인/개선점을 기록)`,
      }));
      alert("PvsA 요약(더미)이 채워졌습니다.");
    } catch (e) {
      alert(`생성 실패: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    const text = [
      `# ${report.title}`,
      `- 기준일: ${baseDate}`,
      "",
      "## 요약",
      report.summary,
      "",
      "## 성과",
      report.achievements,
      "",
      "## 이슈/리스크",
      report.issues,
      "",
      "## 다음 계획",
      report.nextPlan,
      "",
      "## Plan vs Actual",
      report.pvaNote,
    ].join("\n");

    try {
      await toClipboard(text);
      alert("클립보드에 복사되었습니다.");
    } catch {
      alert("복사 실패: 브라우저 클립보드 권한을 확인하세요.");
    }
  }

  const workCat = useMemo(() => categories.find((c) => c.type === "업무" || c.name === "업무"), [categories]);

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">업무 리포트</div>
          <div className="tf-subtitle">일/주/월/연 템플릿 + PvsA 요약 + 복사</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={load} disabled={loading}>새로고침</button>
          <button className="tf-btn" onClick={autoFillPva} disabled={loading}>PvsA 요약 생성</button>
          <button className="tf-btn" onClick={copy}>복사</button>
          <button className="tf-btn tf-btn--primary" onClick={save} disabled={loading}>저장</button>
        </div>
      </div>

      <div className="tf-grid">
        <div className="tf-col-4 tf-card">
          <div className="tf-muted tf-small">설정</div>
          <div className="tf-divider" />

          <div className="tf-small tf-muted">기간</div>
          <select className="tf-select" value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="DAY">일간</option>
            <option value="WEEK">주간</option>
            <option value="MONTH">월간</option>
            <option value="YEAR">연간</option>
          </select>

          <div className="tf-divider" />
          <div className="tf-small tf-muted">기준일</div>
          <input className="tf-input" type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">업무 하위카테고리</div>
          <div className="tf-small">
            {workCat ? (workCat.children || []).map((s) => (
              <span key={s.id} className="tf-chip" style={{ marginRight: 6 }}>
                {s.icon || ""} {s.name}
              </span>
            )) : <span className="tf-muted tf-small">업무 카테고리가 없습니다.</span>}
          </div>

          <div className="tf-divider" />
          <div className="tf-small tf-muted">
            참고(근거 부족): 실제 리포트 자동 생성은 타임바/할일/이슈 데이터를 서버에서 집계해 템플릿에 주입해야 합니다.
          </div>
        </div>

        <div className="tf-col-8 tf-card">
          <div className="tf-muted tf-small">리포트 본문</div>
          <div className="tf-divider" />

          <div className="tf-small tf-muted">제목</div>
          <input className="tf-input" value={report.title} onChange={(e) => setReport((p) => ({ ...p, title: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">요약</div>
          <textarea className="tf-textarea" value={report.summary} onChange={(e) => setReport((p) => ({ ...p, summary: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">성과</div>
          <textarea className="tf-textarea" value={report.achievements} onChange={(e) => setReport((p) => ({ ...p, achievements: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">이슈/리스크</div>
          <textarea className="tf-textarea" value={report.issues} onChange={(e) => setReport((p) => ({ ...p, issues: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">다음 계획</div>
          <textarea className="tf-textarea" value={report.nextPlan} onChange={(e) => setReport((p) => ({ ...p, nextPlan: e.target.value }))} />

          <div className="tf-divider" />
          <div className="tf-small tf-muted">Plan vs Actual</div>
          <textarea className="tf-textarea" value={report.pvaNote} onChange={(e) => setReport((p) => ({ ...p, pvaNote: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}
