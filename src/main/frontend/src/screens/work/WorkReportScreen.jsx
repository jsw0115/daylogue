import React, { useState, useMemo, useEffect, useCallback } from "react";
import PageContainer from "../../layout/PageContainer";
import TabBar from "../../components/common/TabBar";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { workApi, taskApi } from "../../services/localMockApi"; // Mock API
import "../../styles/work-report.css"; // Reuse and extend existing styles
import { Calendar, ListTodo, CheckCircle2, Circle, Bot, Save, RotateCw, FileText, CheckSquare, CalendarDays } from "lucide-react";

// Shadcn UI 컴포넌트를 사용한다고 가정합니다. 실제 프로젝트에 맞게 Button, Textarea를 임포트하세요.
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";

// 임시 컴포넌트
const Button = ({ children, className, ...props }) => (
  <button className={`btn ${className || ''}`} {...props}>{children}</button>
);

const Textarea = ({ className, ...props }) => (
  <textarea className={`report-textarea ${className || ''}`} {...props} />
);


const REPORT_TABS = [
  { key: "daily", label: "일간 리포트" },
  { key: "weekly", label: "주간 리포트" },
  { key: "monthly", label: "월간 리포트" },
  { key: "quarterly", label: "분기 리포트" },
  { key: "yearly", label: "연간 리포트" },
];

const SCOPE_MAP = {
  daily: "DAY",
  weekly: "WEEK",
  monthly: "MONTH",
  quarterly: "QUARTER",
  yearly: "YEAR",
};

// Main Component
function WorkReportScreen() {
  const [activeTab, setActiveTab] = useState("daily");
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };

  return (
    <PageContainer
      screenId="REPORT-001"
      title="업무 리포트"
      subtitle="일일 업무를 기록하고, 주간/월간/연간 성과를 정리하여 커리어 자산을 만드세요."
    >
      <div className="report-header-controls">
        <TabBar
          tabs={REPORT_TABS}
          activeKey={activeTab}
          onChange={setActiveTab}
        />
        <div className="date-selector">
          <label htmlFor="report-date">기준 날짜:</label>
          <input type="date" id="report-date" value={currentDate} onChange={handleDateChange} />
        </div>
      </div>
      <div className="report-grid" style={{marginTop: '20px'}}>
        {activeTab === 'daily' ? (
          <DailyReportView date={currentDate} />
        ) : (
          <AggregatedReportView
            scope={activeTab}
            date={currentDate}
            key={`${activeTab}-${currentDate}`} // 탭 또는 날짜 변경 시 컴포넌트 리마운트
          />
        )}
      </div>
    </PageContainer>
  );
}

// Daily Report View
function DailyReportView({ date }) {
  const targetDate = new Date(date);
  const month = targetDate.getMonth() + 1;
  const firstDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1).getDay();
  const weekOfMonth = Math.ceil((targetDate.getDate() + firstDayOfMonth) / 7);

  const [todos, setTodos] = useState("");
  const [done, setDone] = useState("");
  const [weeklyTodos, setWeeklyTodos] = useState([]);
  const [monthlyEvents, setMonthlyEvents] = useState([]);
  const [isLoadingLog, setIsLoadingLog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const handleLoadTodayLog = useCallback(async () => {
    setIsLoadingLog(true);
    try {
      const blocks = await workApi.getTodayTimeBlocks({ date });
      const toHours = (min) => Math.round((min / 60) * 10) / 10;
      const doneText = blocks
        .map(b => `- [x] ${b.memo} (${toHours(b.actualMinutes)}h)`)
        .join('\n');
      if (doneText) {
        setDone(prev => prev ? `${prev}\n${doneText}` : doneText);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLog(false);
    }
  }, [date]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await workApi.saveReport(`daily-${date}`, { todos, done });
      alert("일간 리포트가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error(error);
      alert("일간 리포트 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }, [date, todos, done]);

  const handleToggleTask = useCallback(async (id) => {
    setWeeklyTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    await taskApi.toggleTaskDone(id);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setIsInitialLoading(true);
      try {
        const savedReport = await workApi.getReport(`daily-${date}`);
        if (!mounted) return;
        
        if (savedReport) {
          setTodos(savedReport.todos || "");
          setDone(savedReport.done || "");
        } else {
          setTodos("");
          setDone("");
        }
        
        // '업무' 태그가 달린 할 일 목록 불러오기
        const workTasks = await taskApi.listTasks({ categoryName: "업무" });
        setWeeklyTodos(workTasks);

        setMonthlyEvents([
          { id: 1, day: 10, text: `${month}월 프로젝트 마일스톤 점검` },
          { id: 2, day: 28, text: "월간 회고 및 다음달 목표 수립" }
        ]);
      } catch(e) {
        console.error(e);
      } finally {
        if (mounted) setIsInitialLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [date, month, weekOfMonth]);

  return (
    <>
      <div className="report-editor">
        <div className="editor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 className="report-title-input" style={{ margin: 0, fontSize: '20px' }}>일간 업무 기록</h2>
          <div className="editor-actions">
            <Button onClick={handleSave} disabled={isSaving || isInitialLoading} className="btn--primary btn--sm">
              <Save size={14} /> {isSaving ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </div>
        
        {isInitialLoading ? (
          <div className="report-textarea report-loading" style={{ minHeight: '300px', borderRadius: '16px', border: 'none' }}>
            <RotateCw className="animate-spin" size={24} />
            <span>데이터를 불러오는 중입니다...</span>
          </div>
        ) : (
          <>
            <DashboardCard title={<span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><ListTodo size={18} /> 오늘 해야할 일</span>}>
              <Textarea value={todos} onChange={(e) => setTodos(e.target.value)} placeholder="오늘 완료해야 할 업무 목록을 마크다운 형식으로 작성하세요..."/>
            </DashboardCard>
            <DashboardCard title={<span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><CheckCircle2 size={18} /> 오늘 한 일</span>}>
              <Textarea value={done} onChange={(e) => setDone(e.target.value)} placeholder="오늘 완료한 업무와 성과를 기록하세요..."/>
              <Button onClick={handleLoadTodayLog} disabled={isLoadingLog} className="btn--secondary btn--sm" style={{marginTop: '12px'}}>
                <RotateCw size={14} className={isLoadingLog ? "animate-spin" : ""} />
                {isLoadingLog ? "불러오는 중..." : "오늘의 업무 기록 불러오기"}
              </Button>
            </DashboardCard>
          </>
        )}
      </div>
      <div className="report-dashboard">
        <DashboardCard title={<span style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b'}}><ListTodo size={18} color="#3b82f6" /> {month}월 {weekOfMonth}주차 할 일</span>}>
          <ul className="side-task-list">
            {weeklyTodos.map((item) => (
              <li key={item.id} className={item.done ? 'task-done' : ''}>
                <div className="task-check" onClick={() => handleToggleTask(item.id)}>
                  {item.done ? <CheckCircle2 size={16} color="#3b82f6" fill="#eff6ff" /> : <Circle size={16} color="#cbd5e1" />}
                </div>
                <span className="task-text">{item.title}</span>
              </li>
            ))}
          </ul>
        </DashboardCard>
        <DashboardCard title={<span style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b'}}><CalendarDays size={18} color="#3b82f6" /> {month}월 주요 일정</span>}>
           <ul className="side-event-list">
            {monthlyEvents.map((item) => (
              <li key={item.id}>
                <span className="event-date">{item.day}일</span>
                <span className="event-text">{item.text}</span>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </>
  );
}

// Aggregated Report View (for Weekly, Monthly, etc.)
function AggregatedReportView({ scope, date }) {
  const [reportContent, setReportContent] = useState("");
  const [sourceReports, setSourceReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const reportKey = useMemo(() => {
    const d = new Date(date);
    const year = d.getFullYear();
    if (scope === 'weekly') {
      const startOfYear = new Date(year, 0, 1);
      const pastDaysOfYear = (d - startOfYear) / 86400000;
      const weekNo = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
      return `weekly-${year}-W${String(weekNo).padStart(2, '0')}`;
    }
    if (scope === 'monthly') return `monthly-${year}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (scope === 'quarterly') return `quarterly-${year}-Q${Math.floor(d.getMonth() / 3) + 1}`;
    if (scope === 'yearly') return `yearly-${year}`;
    return `${scope}-${date}`;
  }, [scope, date]);

  const scopeLabel = REPORT_TABS.find(t => t.key === scope)?.label || "";

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    try {
      const draft = await workApi.generateDraft({ scope: SCOPE_MAP[scope], baseDate: date });
      setReportContent(draft.achievements + "\n\n" + draft.issues);
    } catch (error) {
      console.error("Failed to generate draft:", error);
      setReportContent("AI 추천 내용 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [scope, date]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await workApi.saveReport(reportKey, { content: reportContent });
      alert("리포트가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("Failed to save report:", error);
      alert("리포트 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }, [reportKey, reportContent]);
  
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const savedReport = await workApi.getReport(reportKey);
        if (!mounted) return;
        
        if (savedReport?.content) {
          setReportContent(savedReport.content);
        } else {
          await handleGenerate(); // 새 초안 생성
        }
        
        setSourceReports([ 
          { title: "월요일 리포트", content: "기능 설계 완료..." }, 
          { title: "화요일 리포트", content: "API 개발 시작..." }, 
          { title: "수요일 리포트", content: "프론트엔드 연동..." } 
        ]);
      } catch(e) {
        console.error(e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [reportKey, handleGenerate]);

  return (
    <div className="report-editor" style={{ gridColumn: '1 / -1' }}>
      <DashboardCard>
        <div className="editor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
          <h2 className="report-title-input" style={{ margin: 0, fontSize: '20px' }}>{scopeLabel}</h2>
          <div className="editor-actions" style={{ display: 'flex', gap: '8px' }}>
            <Button onClick={handleGenerate} disabled={isLoading} className="btn--secondary btn--sm">
              <Bot size={14} /> {isLoading ? "AI 요약 생성 중..." : "AI 추천으로 새로고침"}
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="btn--primary btn--sm">
              <Save size={14} /> {isSaving ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="report-textarea large report-loading" style={{ border: 'none', background: 'transparent' }}>
            <RotateCw className="animate-spin" size={24} />
            <span>리포트를 불러오는 중입니다...</span>
          </div>
        ) : (
          <Textarea value={reportContent} onChange={(e) => setReportContent(e.target.value)} className="large" placeholder={`${scopeLabel} 내용을 작성하거나 AI 추천을 받아보세요.`} style={{ border: 'none', padding: '0', backgroundColor: 'transparent' }}/>
        )}
      </DashboardCard>

      <DashboardCard title={<span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><FileText size={18} /> 기반 리포트 내역</span>}>
        <div className="source-reports-list" style={{ marginTop: '12px' }}>
          {sourceReports.map((r, i) => (
            <div key={i} className="source-report-item">
              <strong>{r.title}</strong>
              <p>{r.content}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

export default WorkReportScreen;