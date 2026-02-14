import React, { useEffect, useMemo, useState } from "react";
// localMockApi 경로가 실제 프로젝트 경로와 맞는지 확인 필요 (서비스 로직)
import { categoryApi, workApi, aiApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";
import "../../styles/work-report.css"; 

// Charts
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";

// Icons
import {
  RefreshCw, Save, Copy, FileText, Plus, Trash2,
  PieChart as PieIcon, AlertTriangle, Github, CheckSquare, Edit3
} from "lucide-react";

// Components
import Modal from "../../components/common/Modal";
import WorkReportMasterModal from "../settings/WorkReportMasterModal";
import {
  useWorkReportMaster,
} from "../../shared/hooks/useWorkReportMaster";

/* --- Utils --- */
function uniqueId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function sumHours(blocks) {
  const arr = Array.isArray(blocks) ? blocks : [];
  return Math.round(arr.reduce((s, b) => s + (Number(b?.hours || 0) || 0), 0) * 10) / 10;
}

function toClipboard(text) {
  if (!navigator.clipboard) return Promise.reject(new Error("ClipboardNotSupported"));
  return navigator.clipboard.writeText(text);
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#64748b"];

/* --- Mock External Data --- */
const MOCK_GITHUB_COMMITS = [
  { id: "c1", msg: "fix: 로그인 세션 만료 버그 수정", time: "2024-02-14 10:30" },
  { id: "c2", msg: "feat: 업무 리포트 차트 추가", time: "2024-02-14 14:20" },
  { id: "c3", msg: "refactor: 모달 컴포넌트 공통화", time: "2024-02-14 16:50" },
  { id: "c4", msg: "style: 메인 대시보드 반응형 스타일 적용", time: "2024-02-14 17:30" },
];

export default function WorkReportScreen() {
  const [loading, setLoading] = useState(false);
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10)); // 기준일

  // Data
  const [report, setReport] = useState({
    title: "",
    blocks: [], // { id, projectId, projectName, hours, itemsText }
    issues: [], // { id, content, status: 'OPEN'|'RESOLVED' }
    memo: "",
  });

  // UI States
  const [openMaster, setOpenMaster] = useState(false);
  const [openGithub, setOpenGithub] = useState(false);
  const [selectedCommits, setSelectedCommits] = useState([]);

  // Master Data Hook
  const { master } = useWorkReportMaster({ subscribe: true });
  const projectsById = useMemo(() => {
    const map = new Map();
    (master?.projects || []).forEach(p => map.set(String(p.id), p));
    return map;
  }, [master]);

  // Load Report (Mock Logic)
  useEffect(() => {
    // 실제로는 API 호출 (workApi.getReport)
    // 여기서는 데모용 초기값 설정
    if (report.blocks.length === 0) {
      setReport(prev => ({
        ...prev,
        title: `${reportDate} 주간 업무 리포트`,
        blocks: [
          { id: uniqueId("blk"), projectName: "쇼핑몰 리뉴얼", projectId: "p1", hours: 12, itemsText: "- 메인 페이지 UI 구현\n- 상품 상세 API 연동" },
          { id: uniqueId("blk"), projectName: "운영 유지보수", projectId: "p2", hours: 4, itemsText: "- 결제 오류 수정\n- 고객 VOC 대응" }
        ],
        issues: [
          { id: uniqueId("iss"), content: "디자인 시안 전달 지연으로 퍼블리싱 대기 중", status: "OPEN" }
        ]
      }));
    }
  }, [reportDate]);

  // --- Handlers ---

  const handleAddBlock = () => {
    setReport(prev => ({
      ...prev,
      blocks: [...prev.blocks, { id: uniqueId("blk"), projectName: "새 프로젝트", projectId: "", hours: 0, itemsText: "" }]
    }));
  };

  const handleUpdateBlock = (id, patch) => {
    setReport(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, ...patch } : b)
    }));
  };

  const handleDeleteBlock = (id) => {
    setReport(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== id) }));
  };

  // Issue Handlers
  const handleAddIssue = () => {
    setReport(prev => ({
      ...prev,
      issues: [...prev.issues, { id: uniqueId("iss"), content: "", status: "OPEN" }]
    }));
  };

  const handleUpdateIssue = (id, patch) => {
    setReport(prev => ({
      ...prev,
      issues: prev.issues.map(i => i.id === id ? { ...i, ...patch } : i)
    }));
  };

  const handleDeleteIssue = (id) => {
    setReport(prev => ({ ...prev, issues: prev.issues.filter(i => i.id !== id) }));
  };

  // Import Github (Mock)
  const handleImportGithub = () => {
    const textToAdd = selectedCommits.map(id => {
      const c = MOCK_GITHUB_COMMITS.find(x => x.id === id);
      return `- ${c.msg}`;
    }).join("\n");

    if (report.blocks.length > 0) {
      const firstId = report.blocks[0].id;
      const prevText = report.blocks[0].itemsText;
      handleUpdateBlock(firstId, { itemsText: prevText ? prevText + "\n" + textToAdd : textToAdd });
    } else {
      setReport(prev => ({
        ...prev,
        blocks: [{ id: uniqueId("blk"), projectName: "개발 업무", hours: 0, itemsText: textToAdd }]
      }));
    }
    setOpenGithub(false);
    setSelectedCommits([]);
  };

  // Copy to Clipboard
  const handleCopy = () => {
    const lines = [
      `# ${report.title}`,
      `기간: ${reportDate} 주간`,
      "",
      "## 📊 업무 비중",
      ...report.blocks.map(b => `- ${b.projectName}: ${b.hours}h`),
      "",
      "## ✅ 진행 업무",
      ...report.blocks.map(b => `### ${b.projectName} (${b.hours}h)\n${b.itemsText}`),
      "",
      "## 🚨 이슈/리스크",
      report.issues.length > 0 ? report.issues.map(i => `- [${i.status}] ${i.content}`).join("\n") : "- 특이사항 없음"
    ];
    
    toClipboard(lines.join("\n"))
      .then(() => alert("리포트가 클립보드에 복사되었습니다."))
      .catch(() => alert("복사 실패"));
  };

  // Chart Data Preparation
  const chartData = useMemo(() => {
    return report.blocks.map(b => ({
      name: b.projectName || "미지정",
      value: Number(b.hours) || 0
    })).filter(x => x.value > 0);
  }, [report.blocks]);

  return (
    <div className="tf-page work-report-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">업무 리포트 작성</div>
          <div className="tf-subtitle">주간/월간 업무를 정리하고 시각화합니다.</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={() => setOpenMaster(true)}>마스터 관리</button>
          <button className="tf-btn" onClick={() => setOpenGithub(true)}><Github size={16}/> GitHub 연동</button>
          <button className="tf-btn" onClick={handleCopy}><Copy size={16}/> 복사</button>
          <button className="tf-btn tf-btn--primary" onClick={() => alert("저장됨(Mock)")}><Save size={16}/> 저장</button>
        </div>
      </div>

      <div className="report-grid">
        {/* Left: Editor */}
        <div className="report-editor">
          <div className="editor-header">
            <input 
              className="report-title-input" 
              value={report.title} 
              onChange={e => setReport(p => ({...p, title: e.target.value}))}
              placeholder="리포트 제목 입력"
            />
            <input 
              type="date" 
              className="date-picker"
              value={reportDate}
              onChange={e => setReportDate(e.target.value)}
            />
          </div>
          
          <div className="tf-divider"/>

          {/* Project Blocks */}
          <div className="section-head">
            <span className="section-title"><CheckSquare size={16}/> 업무 내역</span>
            <button className="tf-btn tf-btn--xs" onClick={handleAddBlock}><Plus size={14}/> 프로젝트 추가</button>
          </div>
          
          <div className="block-list">
            {report.blocks.map((block) => (
              <div key={block.id} className="report-block">
                <div className="block-header">
                  <div className="block-title-row">
                    <select 
                      className="block-project-select"
                      value={block.projectId}
                      onChange={e => {
                        const pid = e.target.value;
                        const pname = projectsById.get(pid)?.name || "새 프로젝트";
                        handleUpdateBlock(block.id, { projectId: pid, projectName: pname });
                      }}
                    >
                      <option value="">프로젝트 선택</option>
                      {master?.projects?.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      className="block-hours"
                      value={block.hours} 
                      onChange={e => handleUpdateBlock(block.id, { hours: e.target.value })}
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                    <span className="unit">시간</span>
                  </div>
                  <button className="icon-btn danger" onClick={() => handleDeleteBlock(block.id)}>
                    <Trash2 size={16}/>
                  </button>
                </div>
                <textarea 
                  className="block-content"
                  value={block.itemsText}
                  onChange={e => handleUpdateBlock(block.id, { itemsText: e.target.value })}
                  placeholder="- 주요 성과 및 진행 내용을 입력하세요."
                />
              </div>
            ))}
          </div>

          <div className="tf-divider"/>

          {/* Issues Section */}
          <div className="section-head">
            <span className="section-title error-text"><AlertTriangle size={16}/> 이슈 / 리스크</span>
            <button className="tf-btn tf-btn--xs" onClick={handleAddIssue}><Plus size={14}/> 이슈 추가</button>
          </div>

          <div className="issue-list">
            {report.issues.length === 0 && <div className="tf-muted tf-small">등록된 이슈가 없습니다.</div>}
            {report.issues.map(issue => (
              <div key={issue.id} className="issue-row">
                <select 
                  className={`issue-status ${issue.status}`}
                  value={issue.status}
                  onChange={e => handleUpdateIssue(issue.id, { status: e.target.value })}
                >
                  <option value="OPEN">진행중</option>
                  <option value="RESOLVED">해결됨</option>
                </select>
                <input 
                  className="issue-content"
                  value={issue.content}
                  onChange={e => handleUpdateIssue(issue.id, { content: e.target.value })}
                  placeholder="이슈 내용 및 해결 방안 입력"
                />
                <button className="icon-btn danger" onClick={() => handleDeleteIssue(issue.id)}>
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dashboard */}
        <div className="report-dashboard">
          {/* Summary Card */}
          <div className="summary-card">
            <div className="card-title"><PieIcon size={16}/> 공수 요약</div>
            <div className="chart-container">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-chart">데이터 없음</div>
              )}
            </div>
            <div className="total-hours">
              <span>총 투입 시간</span>
              <span className="val">{sumHours(report.blocks)}h</span>
            </div>
          </div>

          {/* Guidelines Card */}
          <div className="guide-card">
            <div className="card-title"><FileText size={16}/> 작성 가이드</div>
            <ul className="guide-list">
              <li>성과(Outcome) 위주로 작성하세요.</li>
              <li>이슈는 해결 방안과 함께 적으세요.</li>
              <li>공수는 0.5h 단위로 기록하세요.</li>
              <li>GitHub/Jira 연동으로 자동 채우기 가능</li>
            </ul>
          </div>
        </div>
      </div>

      {/* GitHub Modal */}
      <Modal 
        open={openGithub} 
        onClose={() => setOpenGithub(false)}
        title="GitHub 커밋 불러오기"
        footer={
          <div className="modal-footer">
             <button className="tf-btn" onClick={() => setOpenGithub(false)}>취소</button>
             <button className="tf-btn tf-btn--primary" onClick={handleImportGithub}>선택 항목 적용</button>
          </div>
        }
      >
        <div className="github-list">
          {MOCK_GITHUB_COMMITS.map(c => (
            <label key={c.id} className="github-item">
              <input 
                type="checkbox" 
                checked={selectedCommits.includes(c.id)}
                onChange={e => {
                  if(e.target.checked) setSelectedCommits([...selectedCommits, c.id]);
                  else setSelectedCommits(selectedCommits.filter(id => id !== c.id));
                }}
              />
              <div className="git-info">
                <div className="git-msg">{c.msg}</div>
                <div className="git-time">{c.time}</div>
              </div>
            </label>
          ))}
        </div>
      </Modal>

      {/* Master Modal */}
      <WorkReportMasterModal open={openMaster} onClose={() => setOpenMaster(false)} />
    </div>
  );
}