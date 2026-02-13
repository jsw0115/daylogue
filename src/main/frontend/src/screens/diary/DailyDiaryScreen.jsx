import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";

import {
  Button,
  Card,
  Calendar as AntCalendar,
  DatePicker,
  Input,
  List,
  Tag,
  Typography,
  Divider,
  Tooltip,
  Progress,
  Select,
  Space,
  Badge,
  message,
} from "antd";

import dayjs from "dayjs";
import "dayjs/locale/ko";

import {
  ChevronLeft,
  ChevronRight,
  Save,
  List as ListIcon,
  Calendar as CalendarIcon,
  Search,
  SmilePlus,
  Smile,
  Meh,
  Frown,
  Angry,
  Sparkles,
  Link as LinkIcon,
  Hash,
  Edit3,
  CheckCircle2,
  Repeat
} from "lucide-react";

import "../../styles/screens/diary.css";
import { safeStorage } from "../../shared/utils/safeStorage";

dayjs.locale("ko");

const { Title, Text } = Typography;

// --- 상수 데이터 ---
const MOODS = [
  { id: "great", label: "최고", Icon: SmilePlus, color: "#10b981" },
  { id: "good", label: "좋음", Icon: Smile, color: "#3b82f6" },
  { id: "soso", label: "보통", Icon: Meh, color: "#f59e0b" },
  { id: "bad", label: "나쁨", Icon: Frown, color: "#f97316" },
  { id: "terrible", label: "최악", Icon: Angry, color: "#ef4444" },
];

const TEMPLATES = [
  {
    label: "KPT 회고",
    text: "Keep (좋았던 점):\n- \n\nProblem (아쉬운 점):\n- \n\nTry (시도할 점):\n- ",
  },
  {
    label: "4Ls 회고",
    text: "Liked (좋았던 것):\n- \n\nLearned (배운 것):\n- \n\nLacked (부족했던 것):\n- \n\nLonged for (바라는 것):\n- ",
  },
  {
    label: "감사 일기",
    text: "1. \n2. \n3. ",
  },
];

const toDateKey = (d) => dayjs(d).format("YYYY-MM-DD");

// --- 데이터 로직 ---
function loadDiaryMap() {
  return safeStorage.getJSON("diary.entries", {});
}
function saveDiaryMap(map) {
  safeStorage.setJSON("diary.entries", map);
}

function getPlannerSummary(dateKey) {
  const plan = safeStorage.getJSON(`planner.daily.${dateKey}`, null);
  if (!plan) return null;

  const todos = plan.todos || [];
  const routines = plan.routines || [];
  const timeline = plan.timelineItems || [];

  const todoDone = todos.filter((t) => t.done).length;
  const routineDone = routines.filter((r) => r.done).length;

  return {
    todoTotal: todos.length,
    todoDone,
    routineTotal: routines.length,
    routineDone,
    timelineCount: timeline.length,
    topTimeline: timeline.slice(0, 5),
  };
}

function snapDiary(data) {
  return JSON.stringify({
    mood: data.mood,
    summary: (data.summary ?? "").trim(),
    detail: (data.detail ?? "").trim(),
    tags: (data.tags ?? []).sort(),
  });
}

export default function DailyDiaryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);

  const [viewMode, setViewMode] = useState("list");
  const [query, setQuery] = useState("");
  const [diaryMap, setDiaryMap] = useState(() => loadDiaryMap());

  const current = diaryMap[dateKey] || {
    mood: "good",
    summary: "",
    detail: "",
    tags: [],
    updatedAt: null,
  };

  const [mood, setMood] = useState(current.mood);
  const [summary, setSummary] = useState(current.summary);
  const [detail, setDetail] = useState(current.detail);
  const [tags, setTags] = useState(current.tags || []);

  const savedSnapRef = useRef(snapDiary(current));
  
  useEffect(() => {
    const map = loadDiaryMap();
    setDiaryMap(map);
    const cur = map[dateKey] || { mood: "good", summary: "", detail: "", tags: [] };
    setMood(cur.mood);
    setSummary(cur.summary);
    setDetail(cur.detail);
    setTags(cur.tags || []);
    savedSnapRef.current = snapDiary(cur);
  }, [dateKey]);

  const isDirty = useMemo(() => {
    return snapDiary({ mood, summary, detail, tags }) !== savedSnapRef.current;
  }, [mood, summary, detail, tags]);

  const saveNow = () => {
    setDiaryMap((prev) => {
      const next = { ...prev };
      next[dateKey] = { mood, summary, detail, tags, updatedAt: Date.now() };
      saveDiaryMap(next);
      savedSnapRef.current = snapDiary({ mood, summary, detail, tags });
      return next;
    });
    message.success("저장되었습니다.");
  };

  const moveDay = (delta) => setSelectedDate(dayjs(selectedDate).add(delta, "day").toDate());
  const goToday = () => setSelectedDate(new Date());

  const plannerSummary = useMemo(() => getPlannerSummary(dateKey), [dateKey]);

  const entries = useMemo(() => {
    const list = Object.entries(diaryMap)
      .map(([k, v]) => ({ dateKey: k, ...v }))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter((e) => 
      e.dateKey.includes(q) || 
      (e.summary || "").includes(q) || 
      (e.tags || []).some(t => t.includes(q))
    );
  }, [diaryMap, query]);

  const moodByDate = (date) => {
    const entry = diaryMap[toDateKey(date)];
    return entry ? MOODS.find((x) => x.id === entry.mood) : null;
  };

  const applyTemplate = (text) => {
    if (detail && !window.confirm("내용 끝에 템플릿을 추가하시겠습니까?")) return;
    setDetail((prev) => (prev ? prev + "\n\n" + text : text));
  };

  const linkPlannerItem = (itemTitle) => {
    setDetail((prev) => prev + `\n[참조: ${itemTitle}] `);
    message.info("참조가 추가되었습니다.");
  };

  return (
    <div className="screen daily-diary-screen daily-diary-screen--ui">
      {/* Header */}
      <header className="diary-ui__header">
        <div className="diary-ui__titleBlock">
          <Title level={3} style={{ margin: 0 }}>데일리 다이어리</Title>
          <Text type="secondary">하루의 맥락을 연결하고 기록합니다.</Text>
        </div>

        <div className="diary-ui__actions">
          <Space>
            <Button icon={<ChevronLeft size={16} />} onClick={() => moveDay(-1)} />
            <DatePicker
              value={dayjs(selectedDate)}
              onChange={(v) => v && setSelectedDate(v.toDate())}
              allowClear={false}
              format="YYYY. MM. DD (ddd)"
              style={{ width: 150, fontWeight: 600 }}
              suffixIcon={<CalendarIcon size={14} />}
            />
            <Button icon={<ChevronRight size={16} />} onClick={() => moveDay(1)} />
            <Button size="small" type="text" onClick={goToday}>오늘</Button>
          </Space>

          <Divider type="vertical" />

          <Tabs.Root value={viewMode} onValueChange={setViewMode}>
            <Tabs.List className="diary-ui__tabs">
              <Tabs.Trigger className="diary-ui__tab" value="list"><ListIcon size={14} /> 목록</Tabs.Trigger>
              <Tabs.Trigger className="diary-ui__tab" value="calendar"><CalendarIcon size={14} /> 달력</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>

          <Button
            type="primary"
            icon={<Save size={16} />}
            onClick={saveNow}
            disabled={!isDirty}
            className={isDirty ? "animate-pulse" : ""}
          >
            저장
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="diary-ui__layout">
        
        {/* Editor Column */}
        <div className="diary-ui__editorCol">
          <Card size="small" className="diary-ui__card">
            <div className="diary-ui__moodSection">
              <Text strong style={{ marginBottom: 8, display: 'block' }}>오늘의 기분</Text>
              <div className="diary-ui__moods">
                {MOODS.map((m) => {
                  const isActive = mood === m.id;
                  const ActiveIcon = m.Icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      className={clsx("diary-ui__moodBtn", isActive && "is-active")}
                      onClick={() => setMood(m.id)}
                      style={{ color: isActive ? m.color : undefined, borderColor: isActive ? m.color : undefined }}
                    >
                      <ActiveIcon size={20} />
                      <span className="diary-ui__moodLabel">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <Divider style={{ margin: "16px 0" }} />

            <div className="diary-ui__summarySection">
               <Text strong><Edit3 size={14} style={{marginRight: 4, verticalAlign:'middle'}}/>하루 한 줄 요약</Text>
               <Input
                 value={summary}
                 onChange={(e) => setSummary(e.target.value)}
                 placeholder="오늘 가장 기억에 남는 일은 무엇인가요?"
                 style={{ marginTop: 8 }}
               />
            </div>
          </Card>

          <Card size="small" className="diary-ui__card" title={
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span>상세 기록</span>
              <Space size="small">
                {TEMPLATES.map((tpl) => (
                  <Button 
                    key={tpl.label} 
                    size="small" 
                    icon={<Sparkles size={12}/>} 
                    onClick={() => applyTemplate(tpl.text)}
                  >
                    {tpl.label}
                  </Button>
                ))}
              </Space>
            </div>
          }>
            <Input.TextArea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="오늘 있었던 일, 감정, 배운 점 등을 자유롭게 기록하세요."
              autoSize={{ minRows: 10, maxRows: 20 }}
              className="diary-ui__textarea"
            />
            
            <div style={{ marginTop: 12 }}>
              <Text strong style={{ marginRight: 8 }}><Hash size={14} style={{verticalAlign:'middle'}}/> 태그</Text>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="태그 입력 (예: 피곤, 성취감)"
                value={tags}
                onChange={setTags}
                suffixIcon={<Hash size={14} />}
              />
            </div>
          </Card>
        </div>

        {/* Side Column */}
        <div className="diary-ui__sideCol">
          
          {/* Context Card */}
          <Card size="small" className="diary-ui__card diary-ui__contextCard" title="오늘의 활동 (Context)">
            {plannerSummary ? (
              <div className="diary-ui__context">
                <div className="diary-ui__kpiRow">
                  <div className="diary-ui__kpiItem">
                    <span className="label"><CheckCircle2 size={12}/> Todo</span>
                    <span className="value">{plannerSummary.todoDone}/{plannerSummary.todoTotal}</span>
                    <Progress percent={plannerSummary.todoTotal ? (plannerSummary.todoDone/plannerSummary.todoTotal)*100 : 0} showInfo={false} size="small" strokeColor="#3b82f6" />
                  </div>
                  <div className="diary-ui__kpiItem">
                    <span className="label"><Repeat size={12}/> Routine</span>
                    <span className="value">{plannerSummary.routineDone}/{plannerSummary.routineTotal}</span>
                    <Progress percent={plannerSummary.routineTotal ? (plannerSummary.routineDone/plannerSummary.routineTotal)*100 : 0} showInfo={false} size="small" strokeColor="#10b981" />
                  </div>
                </div>

                <Divider style={{ margin: "12px 0" }} />
                
                <Text type="secondary" style={{ fontSize: 12 }}>타임라인 (클릭하여 참조)</Text>
                <div className="diary-ui__timelineLinkList">
                  {plannerSummary.topTimeline?.length > 0 ? (
                    plannerSummary.topTimeline.map((t, idx) => (
                      <div key={idx} className="diary-ui__timelineLink" onClick={() => linkPlannerItem(t.title)}>
                        <LinkIcon size={12} className="icon" />
                        <span className="time">{t.start}</span>
                        <span className="title">{t.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="diary-ui__emptyState">기록된 타임라인이 없습니다.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="diary-ui__emptyState">플래너 데이터가 없습니다.</div>
            )}
          </Card>

          {/* Mini Calendar / History */}
          <Card 
            size="small" 
            className="diary-ui__card diary-ui__historyCard" 
            title="기록 탐색"
            extra={
               <Input 
                 placeholder="검색" 
                 prefix={<Search size={12} />} 
                 style={{ width: 100 }} 
                 value={query}
                 onChange={e => setQuery(e.target.value)}
               />
            }
          >
            {viewMode === "calendar" ? (
              <div className="diary-ui__miniCalendarWrapper">
                <AntCalendar
                  fullscreen={false}
                  value={dayjs(selectedDate)}
                  onSelect={(v) => setSelectedDate(v.toDate())}
                  headerRender={() => null} 
                  dateFullCellRender={(date) => {
                     const moodItem = moodByDate(date.toDate());
                     const isSelected = toDateKey(date) === dateKey;
                     return (
                       <div className={clsx("diary-mini-cell", isSelected && "selected")}>
                         <span className="day-text">{date.date()}</span>
                         {moodItem && <span className="mood-dot" style={{backgroundColor: moodItem.color}} />}
                       </div>
                     );
                  }}
                />
                <div className="mini-cal-nav" style={{textAlign:'center', marginTop: 8}}>
                  <Text strong>{dayjs(selectedDate).format("YYYY년 M월")}</Text>
                </div>
              </div>
            ) : (
              <List
                className="diary-ui__historyList"
                dataSource={entries}
                size="small"
                locale={{ emptyText: "기록 없음" }}
                renderItem={(item) => {
                   const m = MOODS.find(x => x.id === item.mood);
                   const MIcon = m?.Icon || Smile;
                   return (
                     <List.Item 
                       className={clsx("diary-ui__historyItem", item.dateKey === dateKey && "is-active")}
                       onClick={() => setSelectedDate(dayjs(item.dateKey).toDate())}
                     >
                       <div className="history-row">
                         <div className="history-meta">
                           <span className="date">{dayjs(item.dateKey).format("MM.DD")}</span>
                           {m && <Tag color={m.color} icon={<MIcon size={12}/>} style={{marginRight:0}} bordered={false}>{m.label}</Tag>}
                         </div>
                         <div className="history-summary">{item.summary || "내용 없음"}</div>
                       </div>
                     </List.Item>
                   )
                }}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}