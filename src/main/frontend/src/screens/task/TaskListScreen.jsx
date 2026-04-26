import React, { useMemo, useState, useEffect } from "react";
import {
  Button, Card, Input, Tag, Typography, Divider, Progress, Select, Modal, Switch,
  Space, Radio, Tooltip, Empty, message, Segmented, Dropdown,
} from "antd";
import {
  Plus, Search, Play, CheckCircle2, Circle, Zap, Battery, MoreHorizontal, Copy,
  LayoutList, LayoutGrid, Clock, Sparkles, CalendarDays, Edit, Trash2, Calendar, RotateCw
} from "lucide-react";
import dayjs from "dayjs";
import "./../../styles/screens/taskList.css";
import { categoryApi } from "../../services/localMockApi";
import { taskService } from "../../services/taskService";
import api from "../../api";

const { Title, Text } = Typography;


const ENERGY_OPTIONS = [
  { value: "high", label: "높음", icon: <Zap size={14} color="#f59e0b" /> },
  { value: "medium", label: "보통", icon: <Battery size={14} color="#3b82f6" /> },
  { value: "low", label: "낮음", icon: <Battery size={14} color="#10b981" /> },
];

const WEEKDAYS = [
  { val: "mon", label: "월" },
  { val: "tue", label: "화" },
  { val: "wed", label: "수" },
  { val: "thu", label: "목" },
  { val: "fri", label: "금" },
  { val: "sat", label: "토" },
  { val: "sun", label: "일" },
];

export default function TaskListScreen() {
  // Ant Design Message Hook (안정적인 알림 표시를 위해 필수)
  const [messageApi, contextHolder] = message.useMessage();

  // --- States ---
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("list"); 
  const [filter, setFilter] = useState("today");
  const [q, setQ] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Input States
  const [tab, setTab] = useState("quick"); // quick | detail
  const [newTitle, setNewTitle] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState(""); // 인라인 카테고리 추가용
  const [newMin, setNewMin] = useState(30);
  const [newEnergy, setNewEnergy] = useState("medium");
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatFreq, setRepeatFreq] = useState("daily");
  const [repeatWeekdays, setRepeatWeekdays] = useState(["mon"]);
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatEndType, setRepeatEndType] = useState("none"); // none | until
  const [repeatEndUntil, setRepeatEndUntil] = useState(dayjs().format("YYYY-MM-DD"));
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  useEffect(() => {
    taskService.listTasks().then(setTasks);
    categoryApi.listCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0) setNewCategoryId(cats[0].id);
    });

    // 주소록(친구 목록) 불러오기
    api.get("/api/share/friends")
      .then(res => setFriends(res.data?.data || []))
      .catch(err => {
        console.error("친구 목록 불러오기 실패:", err);
        // 백엔드 미연결 시 UI 테스트용 임시 데이터
        setFriends([
          { id: "u1", name: "김철수" },
          { id: "u2", name: "이영희" }
        ]);
      });
  }, []);

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
  const toggleDone = async (id) => {
    // setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    // await taskApi.toggleTaskDone(id);
    const task = tasks.find((t) => t.id === id);
    const nextDone = !task?.done;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: nextDone } : t)));
    await taskService.toggleTaskDone(id, nextDone);
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await categoryApi.saveCategory({ name: newCategoryName, type: "CUSTOM", color: "#64748b", icon: "briefcase" });
    setNewCategoryName("");
    const updatedCats = await categoryApi.listCategories();
    setCategories(updatedCats);
    const added = updatedCats.find(c => c.name === newCategoryName);
    if (added) setNewCategoryId(added.id);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const saveTask = async () => {
    // 1. 유효성 검사 (제목이 비어있으면 경고)
    if (!newTitle.trim()) {
        messageApi.warning("할 일 제목을 입력해주세요!");
        return;
    }

    // 2. API로 보낼 데이터 준비
    const taskData = {
      title: newTitle,
      categoryId: newCategoryId,
      durationMin: tab === "detail" ? newMin : 30, // 간단모드는 기본 30분
      energy: tab === "detail" ? newEnergy : "medium",
      sharedUserIds: tab === "detail" ? selectedFriends : [],
      repeatRule: tab === "detail" && repeatEnabled ? { 
        freq: repeatFreq, 
        interval: repeatInterval,
        weekdays: repeatFreq === "weekly" ? repeatWeekdays : [],
        endType: repeatEndType,
        endUntil: repeatEndType === "until" ? repeatEndUntil : null
      } : null
    };
    
    if (editingTaskId) {
      // 할 일 수정 로직
      await taskService.updateTask({ id: editingTaskId, ...taskData });
      setTasks(prev => prev.map(t => t.id === editingTaskId ? { ...t, ...taskData } : t));
      messageApi.success("할 일이 수정되었습니다.");
    } else {
      // 새 할 일 생성 로직
      const newTask = await taskService.createTask(taskData);
      if (newTask) setTasks([newTask, ...tasks]);
      messageApi.success("할 일이 계획되었습니다.");
    }

    // 4. 모달 닫기 및 초기화
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingTaskId(null);
    setTab("quick");
    setNewTitle("");
    setNewMin(30);
    setNewEnergy("medium");
    setRepeatEnabled(false);
    setRepeatFreq("daily");
    setRepeatWeekdays(["mon"]);
    setRepeatInterval(1);
    setRepeatEndType("none");
    setRepeatEndUntil(dayjs().format("YYYY-MM-DD"));
    setSelectedFriends([]);
  };

  const openEditModal = (task) => {
    setEditingTaskId(task.id);
    setNewTitle(task.title);
    setNewCategoryId(task.categoryId || "");
    setNewMin(task.durationMin || 30);
    setNewEnergy(task.energy || "medium");
    setSelectedFriends(task.sharedUserIds || []);
    
    if (task.repeatRule) {
      setRepeatEnabled(true);
      setRepeatFreq(task.repeatRule.freq || "daily");
      setRepeatInterval(task.repeatRule.interval || 1);
      setRepeatWeekdays(task.repeatRule.weekdays || ["mon"]);
      setRepeatEndType(task.repeatRule.endType || "none");
      setRepeatEndUntil(task.repeatRule.endUntil || dayjs().format("YYYY-MM-DD"));
      setTab("detail");
    } else {
      setRepeatEnabled(false);
      setTab("quick");
    }
    setIsModalOpen(true);
  };

  const handleDuplicate = async (taskId) => {
    const duplicated = await taskService.duplicateTask(taskId);
    if (duplicated) {
      setTasks(prev => [duplicated, ...prev]);
      messageApi.success('할 일이 복제되었습니다.');
    }
  };

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = '0.5'; // 드래그 중인 아이템 반투명 처리
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetId) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const oldIdx = tasks.findIndex((t) => t.id === draggedId);
    const newIdx = tasks.findIndex((t) => t.id === targetId);

    const newTasks = [...tasks];
    const [removed] = newTasks.splice(oldIdx, 1);
    newTasks.splice(newIdx, 0, removed);

    setTasks(newTasks);
    await taskService.reorderTasks(newTasks.map(t => t.id)); // 백엔드에 순서 변경 요청
  };

  const getDropdownItems = (task) => [
    {
      key: 'edit',
      label: '수정',
      icon: <Edit size={14} />,
      onClick: () => openEditModal(task),
    },
    {
      key: 'duplicate',
      label: '복제',
      icon: <Copy size={14} />,
      onClick: () => handleDuplicate(task.id),
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
      onClick: async () => {
        setTasks(prev => prev.filter(t => t.id !== task.id));
        await taskService.deleteTask(task.id);
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
          <Button type="primary" shape="round" icon={<Plus size={16} />} onClick={openAddModal}>
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
            {filteredTasks.map((t) => {
              const cat = categories.find(c => c.id === t.categoryId);
              return (
                <div 
                  key={t.id} 
                  className={`task-item ${t.done ? 'is-done' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, t.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, t.id)}
                >
                <div className="task-check" onClick={() => toggleDone(t.id)}>
                  {t.done ? <CheckCircle2 size={24} color="#3b82f6" fill="#eff6ff"/> : <Circle size={24} color="#d1d5db" />}
                </div>

                <div className="task-content">
                  <div className="task-title-row">
                    <span className="task-title-text">{t.title}</span>
                    {t.energy === 'high' && <Tooltip title="높은 에너지 필요"><Zap size={14} color="#f59e0b" fill="#f59e0b"/></Tooltip>}
                    {t.energy === 'low' && <Tooltip title="낮은 에너지 가능"><Battery size={14} color="#10b981"/></Tooltip>}
                    {t.repeatRule && <Tooltip title="반복 할 일"><RotateCw size={14} color="#64748b" style={{marginLeft: 4}}/></Tooltip>}
                  </div>
                  <div className="task-meta-row">
                    <span className="task-duration"><Clock size={12}/> {t.durationMin}분</span>
                    {cat && <Tag color={cat.color} bordered={false} size="small">{cat.name}</Tag>}
                  </div>
                </div>

                <div className="task-actions">
                  {!t.done && (
                    <Tooltip title="지금 집중 시작">
                      <Button type="text" shape="circle" icon={<Play size={18} fill="currentColor" />} className="btn-play" />
                    </Tooltip>
                  )}
                  <Dropdown menu={{ items: getDropdownItems(t) }} trigger={['click']}>
                    <Button type="text" shape="circle" icon={<MoreHorizontal size={16} />} />
                  </Dropdown>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal
        title={
          <div style={{display:'flex', alignItems:'center', gap: 8}}>
            <CalendarDays size={18}/> {editingTaskId ? "할 일 수정" : "새 할 일 계획"}
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>취소</Button>,
          <Button key="save" type="primary" onClick={saveTask}>{editingTaskId ? "수정 완료" : "계획 추가"}</Button>,
        ]}
        width={480}
        centered
      >
        <Segmented
          block
          options={[{ label: '간단 등록', value: 'quick' }, { label: '상세 등록', value: 'detail' }]}
          value={tab}
          onChange={setTab}
          style={{ marginBottom: 16 }}
        />

        <div className="add-task-form">
          {/* 공통 필드 */}
          <div className="form-group">
            <Text strong>할 일 제목 <span style={{color:'#ff4d4f'}}>*</span></Text>
            <div style={{display:'flex', gap: 8}}>
              <Input 
                placeholder="예) 보고서 작성 30분" 
                value={newTitle} 
                onChange={handleSmartInput} 
                onPressEnter={saveTask} // 엔터키로 바로 추가/수정 가능
                autoFocus
              />
              <Tooltip title="AI가 할 일을 더 작게 쪼개줍니다.">
                <Button icon={<Sparkles size={16} color="#8b5cf6"/>} onClick={handleMagicSplit}>
                  쪼개기
                </Button>
              </Tooltip>
            </div>
            {newTitle.includes("30분") && (
              <Text type="success" style={{fontSize: 12, display: 'flex', alignItems: 'center', gap: 4}}><Sparkles size={12} /> '30분'이 감지되어 시간이 자동 설정되었습니다.</Text>
            )}
          </div>

          <div className="form-group">
            <Text strong>카테고리</Text>
            <Select
              style={{ width: '100%' }}
              placeholder="카테고리 선택"
              value={newCategoryId}
              onChange={setNewCategoryId}
              options={categories.map(c => ({ label: c.name, value: c.id }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                      placeholder="새 카테고리 입력"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button type="text" icon={<Plus size={14} />} onClick={handleAddCategory}>추가</Button>
                  </Space>
                </>
              )}
            />
          </div>

          {/* 상세 모드 전용 필드 */}
          {tab === "detail" && (
            <>
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
              
          <div className="form-group" style={{ marginTop: 12 }}>
            <Text strong>함께할 멤버</Text>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%', marginTop: 4 }}
              placeholder="주소록에서 친구 선택..."
              value={selectedFriends}
              onChange={setSelectedFriends}
              options={friends.map(f => ({ label: f.name, value: f.id }))}
            />
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>반복 설정</Text>
              <Switch checked={repeatEnabled} onChange={setRepeatEnabled} size="small" />
            </div>
            {repeatEnabled && (
              <div className="task-repeat-box">
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{fontSize: 12}}>주기</Text>
                    <Select value={repeatFreq} onChange={setRepeatFreq} style={{ width: '100%' }}
                      options={[{ value: 'daily', label: '매일' }, { value: 'weekly', label: '매주' }, { value: 'monthly', label: '매월' }, { value: 'yearly', label: '매년' }]}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{fontSize: 12}}>간격</Text>
                    <Input type="number" min={1} value={repeatInterval} onChange={e => setRepeatInterval(Number(e.target.value))} style={{ width: '100%' }} addonAfter="마다" />
                  </div>
                </div>
                {repeatFreq === 'weekly' && (
                  <div style={{ marginBottom: 12 }}>
                    <Text type="secondary" style={{fontSize: 12, display: 'block', marginBottom: 4}}>요일 선택</Text>
                    <div className="task-weekdays">
                     {WEEKDAYS.map(w => (
                       <button key={w.val} type="button" className={`task-wk-btn ${repeatWeekdays.includes(w.val) ? 'active' : ''}`}
                         onClick={() => setRepeatWeekdays(prev => prev.includes(w.val) ? prev.filter(x => x !== w.val) : [...prev, w.val])}>
                         {w.label}
                       </button>
                     ))}
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{fontSize: 12}}>종료 조건</Text>
                    <Select value={repeatEndType} onChange={setRepeatEndType} style={{ width: '100%' }}
                      options={[{ value: 'none', label: '계속 반복' }, { value: 'until', label: '특정 날짜까지' }]}
                    />
                  </div>
                  {repeatEndType === 'until' && (
                    <div style={{ flex: 1 }}>
                      <Text type="secondary" style={{fontSize: 12}}>종료 날짜</Text>
                      <Input type="date" value={repeatEndUntil} onChange={e => setRepeatEndUntil(e.target.value)} style={{ width: '100%' }} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
        </div>
      </Modal>
    </div>
  );
}