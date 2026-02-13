import React, { useMemo, useState } from "react";
import {
  Button, Card, Input, Tag, Typography, Divider, Progress, Select, Modal,
  Space, Radio, Tooltip, Empty, message, Segmented, Dropdown
} from "antd";
import {
  Plus, Search, Play, CheckCircle2, Circle, Zap, Battery, MoreHorizontal,
  LayoutList, LayoutGrid, Clock, Sparkles, CalendarDays, Edit, Trash2, Calendar, Hash
} from "lucide-react";
import dayjs from "dayjs";
import "./../../styles/screens/taskList.css";

const { Title, Text } = Typography;

// --- Mock Data ---
const DEFAULT_TASKS = [
  { id: 1, title: "SQLD 1일 1문제 풀기", done: true, durationMin: 30, energy: "low", tags: ["공부"] },
  { id: 2, title: "프로젝트 이슈 리포트 작성", done: false, durationMin: 60, energy: "high", tags: ["업무"] },
];

const ENERGY_OPTIONS = [
  { value: "high", label: "높음", icon: <Zap size={14} color="#f59e0b" /> },
  { value: "medium", label: "보통", icon: <Battery size={14} color="#3b82f6" /> },
  { value: "low", label: "낮음", icon: <Battery size={14} color="#10b981" /> },
];

export default function TaskListScreen() {
  // Ant Design Message Hook (안정적인 알림 표시를 위해 필수)
  const [messageApi, contextHolder] = message.useMessage();

  // --- States ---
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [viewMode, setViewMode] = useState("list"); 
  const [filter, setFilter] = useState("today");
  const [q, setQ] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Input States
  const [newTitle, setNewTitle] = useState("");
  const [newMin, setNewMin] = useState(30);
  const [newEnergy, setNewEnergy] = useState("medium");
  const [newTags, setNewTags] = useState([]);

  // --- Logic ---
  const timeBudget = useMemo(() => {
    const totalMin = tasks.reduce((acc, t) => acc + (t.done ? 0 : t.durationMin), 0);
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    const percent = Math.min(100, Math.round((totalMin / 480) * 100)); 
    return { hours, mins, percent, totalMin };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
  }, [tasks, q]);

  // --- Handlers ---
  const toggleDone = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleSmartInput = (e) => {
    const val = e.target.value;
    setNewTitle(val);
    // 간단한 NLP 시뮬레이션
    if (val.includes("30분")) setNewMin(30);
    if (val.includes("1시간")) setNewMin(60);
  };

  const handleMagicSplit = () => {
    if (!newTitle) {
        messageApi.warning("할 일을 먼저 입력해주세요.");
        return;
    }
    messageApi.loading("AI가 할 일을 쪼개고 있습니다...", 1.0).then(() => {
      setNewTitle(`[세분화] ${newTitle}`);
      messageApi.success("하위 할 일이 생성되었습니다! (Demo)");
    });
  };

  const addTask = () => {
    // 1. 유효성 검사 (제목이 비어있으면 경고)
    if (!newTitle.trim()) {
        messageApi.warning("할 일 제목을 입력해주세요!");
        return;
    }

    // 2. 새 할 일 객체 생성
    const newTask = {
      id: Date.now(),
      title: newTitle,
      done: false,
      durationMin: newMin,
      energy: newEnergy,
      tags: newTags, 
    };

    // 3. 상태 업데이트
    setTasks([newTask, ...tasks]);
    
    // 4. 모달 닫기 및 초기화
    setIsModalOpen(false);
    resetForm();
    messageApi.success("할 일이 계획되었습니다.");
  };

  const resetForm = () => {
    setNewTitle("");
    setNewMin(30);
    setNewEnergy("medium");
    setNewTags([]);
  };

  const getDropdownItems = (taskId) => [
    {
      key: 'edit',
      label: '수정',
      icon: <Edit size={14} />,
      onClick: () => messageApi.info(`할 일 ${taskId} 수정 (미구현)`),
    },
    {
      key: 'reschedule',
      label: '내일로 연기',
      icon: <Calendar size={14} />,
      onClick: () => messageApi.success('내일로 연기되었습니다.'),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: '삭제',
      icon: <Trash2 size={14} />,
      danger: true,
      onClick: () => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        messageApi.info('삭제되었습니다.');
      },
    },
  ];

  const listClass = viewMode === 'matrix' ? 'task-grid-view' : 'task-list-view';

  return (
    <div className="task-screen-container">
      {/* 알림 메시지 표시를 위한 Context Holder */}
      {contextHolder}

      {/* Header */}
      <div className="task-header-section">
        <div className="task-header-top">
          <div>
            <Title level={3} style={{ margin: 0 }}>오늘의 할 일</Title>
            <Text type="secondary">계획된 시간과 실행을 관리하세요.</Text>
          </div>
          <Button type="primary" shape="round" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
            할 일 추가
          </Button>
        </div>

        {/* Time Budget Widget */}
        <Card className="time-budget-card" size="small" bordered={false}>
          <div className="budget-info">
            <div className="budget-label">
              <Clock size={16} /> 
              <span className="label-text">남은 계획 시간</span>
            </div>
            <div className="budget-value">
              {timeBudget.hours > 0 && <span>{timeBudget.hours}시간 </span>}
              <span>{timeBudget.mins}분</span>
            </div>
          </div>
          <Progress 
            percent={timeBudget.percent} 
            strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} 
            status="active" 
            showInfo={false} 
            size="small"
          />
          <div className="budget-desc">
            8시간(가용) 중 {Math.round((timeBudget.totalMin / 60) * 10) / 10}시간 계획됨
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="task-toolbar">
        <Input 
          prefix={<Search size={16} />} 
          placeholder="할 일 검색..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          className="task-search-input"
        />
        <div className="toolbar-right">
          <Radio.Group value={filter} onChange={(e) => setFilter(e.target.value)} buttonStyle="solid">
            <Radio.Button value="today">오늘</Radio.Button>
            <Radio.Button value="week">이번 주</Radio.Button>
          </Radio.Group>
          <Divider type="vertical" />
          <Segmented
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: 'list', icon: <LayoutList size={16} /> },
              { value: 'matrix', icon: <LayoutGrid size={16} /> },
            ]}
          />
        </div>
      </div>

      {/* Task List */}
      <div className={`task-list-wrapper ${listClass}`}>
        {filteredTasks.length === 0 ? (
          <Empty description="등록된 할 일이 없습니다." style={{ marginTop: 40 }} />
        ) : (
          <div className="task-list-scroll">
            {filteredTasks.map((t) => (
              <div key={t.id} className={`task-item ${t.done ? 'is-done' : ''}`}>
                <div className="task-check" onClick={() => toggleDone(t.id)}>
                  {t.done ? <CheckCircle2 size={24} color="#3b82f6" fill="#eff6ff"/> : <Circle size={24} color="#d1d5db" />}
                </div>

                <div className="task-content">
                  <div className="task-title-row">
                    <span className="task-title-text">{t.title}</span>
                    {t.energy === 'high' && <Tooltip title="높은 에너지 필요"><Zap size={14} color="#f59e0b" fill="#f59e0b"/></Tooltip>}
                    {t.energy === 'low' && <Tooltip title="낮은 에너지 가능"><Battery size={14} color="#10b981"/></Tooltip>}
                  </div>
                  <div className="task-meta-row">
                    <span className="task-duration"><Clock size={12}/> {t.durationMin}분</span>
                    {t.tags.map(tag => <Tag key={tag} bordered={false} size="small">#{tag}</Tag>)}
                  </div>
                </div>

                <div className="task-actions">
                  {!t.done && (
                    <Tooltip title="지금 집중 시작">
                      <Button type="text" shape="circle" icon={<Play size={18} fill="currentColor" />} className="btn-play" />
                    </Tooltip>
                  )}
                  <Dropdown menu={{ items: getDropdownItems(t.id) }} trigger={['click']}>
                    <Button type="text" shape="circle" icon={<MoreHorizontal size={16} />} />
                  </Dropdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal
        title={
          <div style={{display:'flex', alignItems:'center', gap: 8}}>
            <CalendarDays size={18}/> 새 할 일 계획
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>취소</Button>,
          <Button key="save" type="primary" onClick={addTask}>계획 추가</Button>,
        ]}
        width={480}
        centered
      >
        <div className="add-task-form">
          <div className="form-group">
            <Text strong>할 일 제목 <span style={{color:'#ff4d4f'}}>*</span></Text>
            <div style={{display:'flex', gap: 8}}>
              <Input 
                placeholder="예) 보고서 작성 30분" 
                value={newTitle} 
                onChange={handleSmartInput} 
                onPressEnter={addTask} // 엔터키로 바로 추가 가능
                autoFocus
              />
              <Tooltip title="AI가 할 일을 더 작게 쪼개줍니다.">
                <Button icon={<Sparkles size={16} color="#8b5cf6"/>} onClick={handleMagicSplit}>
                  쪼개기
                </Button>
              </Tooltip>
            </div>
            {newTitle.includes("30분") && <Text type="success" style={{fontSize: 12}}>✨ '30분'이 감지되어 시간이 자동 설정되었습니다.</Text>}
          </div>

          <div className="form-row">
            <div className="form-group" style={{flex: 1}}>
              <Text strong>예상 소요 (분)</Text>
              <Input 
                type="number" 
                suffix="분" 
                value={newMin} 
                onChange={e => setNewMin(Number(e.target.value))} 
              />
            </div>
            <div className="form-group" style={{flex: 1}}>
              <Text strong>에너지 레벨</Text>
              <Select 
                value={newEnergy} 
                onChange={setNewEnergy} 
                options={ENERGY_OPTIONS}
                style={{width: '100%'}}
              />
            </div>
          </div>
          
          <div className="form-group">
            <Text strong>태그</Text>
            {/* Tag Selection UI */}
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="태그 입력 (예: 업무, 공부) 후 엔터"
              value={newTags}
              onChange={setNewTags}
              tokenSeparators={[',', ' ']}
              suffixIcon={<Hash size={14} />}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}