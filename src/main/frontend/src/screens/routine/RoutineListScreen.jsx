import React, { useMemo, useState } from "react";
import {
  Button, Card, Input, Tag, Typography, Divider, Select, Modal,
  Space, Tooltip, Empty, message, Segmented
} from "antd";
import {
  Plus, Search, Edit, Trash2, Clock, Zap
} from "lucide-react";
import "../../styles/screens/routine.css";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

const { Title, Text } = Typography;

// --- 상수 데이터 ---
const WEEK_DAYS = [
  { value: "mon", label: "월" },
  { value: "tue", label: "화" },
  { value: "wed", label: "수" },
  { value: "thu", label: "목" },
  { value: "fri", label: "금" },
  { value: "sat", label: "토" },
  { value: "sun", label: "일" },
];

const REMINDER_OPTIONS = [
  { value: "0m", label: "정시" },
  { value: "5m", label: "5분 전" },
  { value: "10m", label: "10분 전" },
  { value: "30m", label: "30분 전" },
];

const GOAL_TYPE_OPTIONS = [
  { value: "check", label: "체크(1회)" },
  { value: "count", label: "횟수 목표" },
  { value: "minutes", label: "시간(분) 목표" },
];

const initialRoutines = [
  {
    id: 1,
    name: "아침 스트레칭",
    icon: "✨",
    categoryId: "health",
    active: true,
    scheduleType: "daily",
    time: "07:00",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    intervalDays: 2,
    goalType: "minutes",
    goalValue: 10,
    notify: true,
    reminders: ["10m"],
    pauseUntil: "",
    streak: 15,
  },
  {
    id: 2,
    name: "SQLD 공부",
    icon: "📘",
    categoryId: "study",
    active: true,
    scheduleType: "weekly",
    time: "21:00",
    days: ["mon", "wed", "fri"],
    intervalDays: 2,
    goalType: "minutes",
    goalValue: 60,
    notify: true,
    reminders: ["30m", "10m"],
    pauseUntil: "",
    streak: 3,
  },
];

function makeDefaultDraft() {
  const firstCat = (DEFAULT_CATEGORIES?.[0]?.id) || "health";
  const allDays = WEEK_DAYS.map((d) => d.value);
  return {
    name: "",
    icon: "✨",
    categoryId: firstCat,
    active: true,
    scheduleType: "daily",
    time: "07:00",
    days: allDays,
    intervalDays: 2,
    goalType: "check",
    goalValue: 1,
    notify: true,
    reminders: ["10m"],
    pauseUntil: "",
  };
}

export default function RoutineListScreen() {
  // 메시지 훅 사용 (안정성 확보)
  const [messageApi, contextHolder] = message.useMessage();

  const [routines, setRoutines] = useState(initialRoutines);
  const [q, setQ] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("all");
  
  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("quick"); // quick | detail
  const [draft, setDraft] = useState(() => makeDefaultDraft());
  const [editingId, setEditingId] = useState(null);

  const categoryOptions = useMemo(() => {
    return [{ value: "all", label: "전체" }, ...DEFAULT_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))];
  }, []);

  const filteredRoutines = useMemo(() => {
    const text = q.trim().toLowerCase();
    return routines.filter((r) => {
      if (text) {
        const base = `${r.name} ${r.icon} ${r.categoryId}`.toLowerCase();
        if (!base.includes(text)) return false;
      }
      if (filterCategoryId !== "all" && r.categoryId !== filterCategoryId) return false;
      return true;
    });
  }, [routines, q, filterCategoryId]);

  const openCreateModal = () => {
    setMode("quick");
    setDraft(makeDefaultDraft());
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (routine) => {
    setMode("detail");
    setDraft({ ...routine });
    setEditingId(routine.id);
    setModalOpen(true);
  };

  const handleSave = () => {
    // 1. 유효성 검사
    if (!draft.name.trim()) {
      messageApi.warning("루틴 이름을 입력해주세요!");
      return;
    }

    // 2. 페이로드 생성
    const payload = {
      ...draft,
      id: editingId ?? Date.now(),
      // 간단 모드일 경우 매일 반복으로 설정 (필요 시 로직 변경 가능)
      days: mode === "quick" ? WEEK_DAYS.map(d => d.value) : draft.days,
    };

    // 3. 상태 업데이트
    setRoutines((prev) => {
      if (editingId == null) return [...prev, payload];
      return prev.map((r) => (r.id === editingId ? payload : r));
    });

    // 4. 종료
    setModalOpen(false);
    messageApi.success(editingId ? "루틴이 수정되었습니다." : "새 루틴이 생성되었습니다.");
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "루틴 삭제",
      content: "정말로 이 루틴을 삭제하시겠습니까?",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk: () => {
        setRoutines((prev) => prev.filter((r) => r.id !== id));
        messageApi.success("삭제되었습니다.");
      }
    });
  };

  const toggleDay = (value) => {
    setDraft((prev) => {
      const days = prev.days || [];
      const newDays = days.includes(value) ? days.filter(d => d !== value) : [...days, value];
      return { ...prev, days: newDays };
    });
  };

  return (
    <div className="screen routine-list-screen">
      {contextHolder}

      {/* Header */}
      <div className="screen-header">
        <div>
          <Title level={3} style={{margin:0}}>루틴 관리</Title>
          <Text type="secondary">나만의 루틴을 만들고 습관을 형성하세요.</Text>
        </div>
        <Button type="primary" icon={<Plus size={16}/>} onClick={openCreateModal}>
          새 루틴 추가
        </Button>
      </div>

      {/* Filter */}
      <Card className="filter-card" size="small" bordered={false}>
        <Space>
          <Input 
            prefix={<Search size={14}/>} 
            placeholder="검색..." 
            value={q} 
            onChange={e => setQ(e.target.value)} 
            style={{width: 200}}
          />
          <Select 
            value={filterCategoryId} 
            onChange={setFilterCategoryId} 
            options={categoryOptions} 
            style={{width: 120}}
          />
        </Space>
      </Card>

      {/* Routine List Grid */}
      <div className="routine-list-grid">
        {filteredRoutines.map(r => (
          <Card key={r.id} className="routine-card" bordered={false} hoverable>
            <div className="routine-card-header">
              <div className="routine-icon">{r.icon}</div>
              <div className="routine-info">
                <Text strong className="routine-name">{r.name}</Text>
                <div className="routine-meta">
                  <Tag bordered={false}>{r.categoryId}</Tag>
                  <Text type="secondary" style={{fontSize:12}}>
                    <Clock size={10} style={{marginRight:4}}/>
                    {r.scheduleType === 'anytime' ? '언제든' : r.time}
                  </Text>
                </div>
              </div>
              <div className="routine-streak">
                <Tooltip title="현재 연속 달성일">
                  <div className="streak-badge">
                    <Zap size={12} fill="orange" color="orange"/>
                    <span>{r.streak || 0}일</span>
                  </div>
                </Tooltip>
              </div>
            </div>
            
            <Divider style={{margin:'12px 0'}}/>
            
            <div className="routine-card-footer">
              <div className="routine-days">
                {r.scheduleType === 'daily' ? (
                  <span className="day-dot daily">매일</span>
                ) : (
                  WEEK_DAYS.map(d => (
                    <span key={d.value} className={`day-dot ${r.days.includes(d.value) ? 'active' : ''}`}>
                      {d.label}
                    </span>
                  ))
                )}
              </div>
              <Space>
                <Tooltip title="수정">
                  <Button type="text" size="small" icon={<Edit size={14}/>} onClick={() => openEditModal(r)}/>
                </Tooltip>
                <Tooltip title="삭제">
                  <Button type="text" size="small" danger icon={<Trash2 size={14}/>} onClick={() => handleDelete(r.id)}/>
                </Tooltip>
              </Space>
            </div>
          </Card>
        ))}
        
        {filteredRoutines.length === 0 && (
          <Empty description="등록된 루틴이 없습니다." style={{gridColumn: '1 / -1', padding: 40}}/>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        title={editingId ? "루틴 수정" : "새 루틴 추가"}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>취소</Button>,
          <Button key="save" type="primary" onClick={handleSave}>저장</Button>
        ]}
        width={520}
        destroyOnClose // 모달 닫을 때 상태 초기화
      >
        <div className="routine-modal-content">
          {/* 모드 전환 탭 (disabled 제거됨) */}
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { label: '간단 설정', value: 'quick' },
              { label: '상세 설정', value: 'detail' } 
            ]}
            block
            style={{marginBottom: 16}}
          />

          <div className="form-group">
            <Text strong>루틴 이름 <span style={{color:'red'}}>*</span></Text>
            <Input 
              placeholder="예) 아침 물 마시기" 
              value={draft.name} 
              onChange={e => setDraft({...draft, name: e.target.value})} 
              prefix={<span>{draft.icon}</span>}
              autoFocus // 모달 열리면 자동 포커스
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <Text strong>시간</Text>
              <Input type="time" value={draft.time} onChange={e => setDraft({...draft, time: e.target.value})}/>
            </div>
            <div className="form-group">
              <Text strong>카테고리</Text>
              <Select 
                value={draft.categoryId} 
                onChange={v => setDraft({...draft, categoryId: v})}
                options={categoryOptions.filter(o => o.value !== 'all')}
                style={{width:'100%'}}
              />
            </div>
          </div>

          {/* 상세 설정 모드일 때만 표시 */}
          {mode === 'detail' && (
            <>
              <Divider dashed style={{margin: '12px 0'}}/>
              
              <div className="form-group">
                <Text strong>반복 요일</Text>
                <div className="weekday-selector">
                  {WEEK_DAYS.map(d => (
                    <button 
                      key={d.value}
                      type="button"
                      className={`day-btn ${draft.days.includes(d.value) ? 'active' : ''}`}
                      onClick={() => toggleDay(d.value)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Text strong>목표 설정</Text>
                  <Space.Compact style={{width: '100%'}}>
                    <Select 
                      value={draft.goalType} 
                      onChange={v => setDraft({...draft, goalType: v})}
                      options={GOAL_TYPE_OPTIONS}
                      style={{width: '60%'}}
                    />
                    <Input 
                      type="number" 
                      min={1}
                      value={draft.goalValue} 
                      onChange={e => setDraft({...draft, goalValue: e.target.value})}
                      disabled={draft.goalType === 'check'}
                      style={{width: '40%'}}
                    />
                  </Space.Compact>
                </div>
                <div className="form-group">
                  <Text strong>알림</Text>
                  <Select
                    mode="multiple"
                    value={draft.reminders}
                    onChange={v => setDraft({...draft, reminders: v})}
                    options={REMINDER_OPTIONS}
                    placeholder="알림 선택"
                    maxTagCount={1}
                    style={{width: '100%'}}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}