import React, { useMemo, useState } from "react";
import { 
  Button, Input, Space, Tag, Typography, 
  Empty, Tooltip, Popover, List 
} from "antd";
import { 
  LifeBuoy, Search, RefreshCw, Send, CheckCircle, 
  Clock, AlertCircle, User, FileText 
} from "lucide-react";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Mock Tickets
const SEED_TICKETS = [
  { 
    id: "T-1001", status: "WAITING", type: "SYNC", userId: "user_01", 
    title: "구글 캘린더 연동이 안돼요", 
    preview: "설정에서 구글 연동 버튼을 눌렀는데...",
    createdAt: "2026-02-14 11:02",
    messages: [{ sender: "user", text: "연동 버튼 반응이 없어요.", time: "11:02" }]
  },
  { 
    id: "T-1002", status: "IN_PROGRESS", type: "PAYMENT", userId: "user_vip", 
    title: "결제 취소 요청합니다", 
    preview: "실수로 1년 구독을 눌렀어요...",
    createdAt: "2026-02-14 09:40",
    messages: [
      { sender: "user", text: "실수로 결제했습니다. 환불해주세요.", time: "09:40" },
      { sender: "agent", text: "확인 중입니다.", time: "09:55" },
    ]
  },
];

const STATUS_MAP = {
  WAITING: { color: "red", label: "대기중", icon: AlertCircle },
  IN_PROGRESS: { color: "blue", label: "처리중", icon: Clock },
  RESOLVED: { color: "green", label: "완료됨", icon: CheckCircle },
};

// [NEW] 자주 쓰는 답변 템플릿 데이터
const REPLY_TEMPLATES = [
  { title: "기본 인사", content: "안녕하세요, TimeFlow 고객센터입니다. 문의해 주셔서 감사합니다. 무엇을 도와드릴까요?" },
  { title: "환불 규정 안내", content: "결제일로부터 7일 이내 사용 이력이 없는 경우 전액 환불이 가능합니다. 확인 후 처리해 드리겠습니다." },
  { title: "동기화 오류 가이드", content: "설정 > 데이터 관리 > 캐시 삭제 후 다시 시도해 보시기 바랍니다. 그래도 해결되지 않으면 로그아웃 후 재로그인 해주세요." },
  { title: "상담 종료", content: "추가로 궁금한 점이 있으시면 언제든 문의해 주세요. 감사합니다. 좋은 하루 보내세요!" },
];

export default function AdminCsScreen() {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [templateVisible, setTemplateVisible] = useState(false); // 팝오버 제어

  const filteredData = useMemo(() => {
    return SEED_TICKETS.filter((t) => {
      const matchStatus = filterStatus === "ALL" || t.status === filterStatus;
      const matchKey = !keyword || t.title.includes(keyword) || t.userId.includes(keyword);
      return matchStatus && matchKey;
    });
  }, [filterStatus, keyword]);

  const selectedTicket = useMemo(() => 
    SEED_TICKETS.find(t => t.id === selectedId), 
  [selectedId]);

  const handleSendReply = () => {
    if(!replyText.trim()) return;
    alert(`[전송 완료] ${replyText}`);
    setReplyText("");
  };

  // [NEW] 템플릿 적용 함수
  const applyTemplate = (content) => {
    setReplyText((prev) => (prev ? prev + "\n" + content : content));
    setTemplateVisible(false); // 닫기
  };

  // [NEW] 템플릿 팝오버 콘텐츠
  const templateContent = (
    <List
      size="small"
      dataSource={REPLY_TEMPLATES}
      renderItem={(item) => (
        <List.Item 
          onClick={() => applyTemplate(item.content)}
          style={{ cursor: 'pointer', padding: '8px 4px' }}
          className="cs-template-item" // hover effect용 클래스 (CSS 필요 시)
        >
          <div style={{width:'100%'}}>
            <div style={{fontWeight: 600, fontSize: 13}}>{item.title}</div>
            <div style={{fontSize: 12, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240}}>
              {item.content}
            </div>
          </div>
        </List.Item>
      )}
      style={{ width: 260, maxHeight: 300, overflowY: 'auto' }}
    />
  );

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>CS 티켓 관리</Title>
          <Text type="secondary">문의 접수 및 실시간 응대</Text>
        </div>
        <Button icon={<RefreshCw size={16} />}>새로고침</Button>
      </div>

      <div className="admin-cs-wrapper">
        {/* Left List */}
        <div className="admin-cs-list-card">
          <div className="admin-cs-list-header">
            <Space direction="vertical" style={{width: '100%'}} size={12}>
              <Input prefix={<Search size={16} className="text-gray-400"/>} placeholder="검색..." value={keyword} onChange={e => setKeyword(e.target.value)} allowClear />
              <div style={{display:'flex', gap: 4}}>
                {['ALL', 'WAITING', 'IN_PROGRESS'].map(s => (
                  <Button 
                    key={s} size="small" 
                    type={filterStatus === s ? 'primary' : 'default'} 
                    onClick={() => setFilterStatus(s)}
                  >
                    {s === 'ALL' ? '전체' : STATUS_MAP[s]?.label || s}
                  </Button>
                ))}
              </div>
            </Space>
          </div>
          <div className="admin-cs-list-body">
            {filteredData.map(ticket => {
              const S = STATUS_MAP[ticket.status];
              return (
                <div key={ticket.id} className={`cs-ticket-item ${selectedId === ticket.id ? 'active' : ''}`} onClick={() => setSelectedId(ticket.id)}>
                  <div className="cs-ticket-top">
                    <Space size={6}><S.icon size={14} color={S.color} /><span style={{fontSize:12, fontWeight:700}}>{S.label}</span></Space>
                    <Text type="secondary" style={{fontSize:11}}>#{ticket.id}</Text>
                  </div>
                  <div className="cs-ticket-title">{ticket.title}</div>
                  <div className="cs-ticket-desc">{ticket.preview}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail */}
        <div className="admin-cs-detail-card">
          {selectedTicket ? (
            <>
              <div style={{padding: 20, borderBottom: '1px solid #f0f0f0'}}>
                <Title level={4} style={{margin: '0 0 8px 0'}}>{selectedTicket.title}</Title>
                <Space><Tag>{selectedTicket.type}</Tag><Text type="secondary">User: {selectedTicket.userId}</Text></Space>
              </div>
              <div style={{flex: 1, padding: 20, overflowY: 'auto', background: '#fafafa'}}>
                {selectedTicket.messages.map((msg, idx) => (
                  <div key={idx} style={{display:'flex', justifyContent: msg.sender==='agent'?'flex-end':'flex-start', marginBottom: 16}}>
                    <div style={{
                      padding: '12px 16px', borderRadius: 12,
                      background: msg.sender==='agent'?'#6366f1':'#fff',
                      color: msg.sender==='agent'?'#fff':'#333',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      maxWidth: '70%'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding: 20, borderTop: '1px solid #f0f0f0', background: '#fff'}}>
                <TextArea 
                  rows={4} value={replyText} onChange={e => setReplyText(e.target.value)} 
                  placeholder="답변을 입력하세요..." 
                  style={{marginBottom: 12}} 
                />
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <Space>
                    {/* [NEW] 템플릿 팝오버 연결 */}
                    <Popover 
                      content={templateContent} 
                      title="답변 템플릿 선택" 
                      trigger="click" 
                      open={templateVisible} 
                      onOpenChange={setTemplateVisible}
                      placement="topLeft"
                    >
                      <Tooltip title="자주 쓰는 답변 불러오기">
                        <Button size="small" icon={<FileText size={14}/>}>템플릿</Button>
                      </Tooltip>
                    </Popover>
                    <Button size="small">파일 첨부</Button>
                  </Space>
                  <Button type="primary" icon={<Send size={14}/>} onClick={handleSendReply}>전송</Button>
                </div>
              </div>
            </>
          ) : (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color: '#94a3b8'}}>
              <LifeBuoy size={64} style={{opacity:0.2}}/>
              <div style={{marginTop:16}}>문의 내역을 선택해주세요</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}