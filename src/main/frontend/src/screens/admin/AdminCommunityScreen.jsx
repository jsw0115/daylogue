import React, { useState, useMemo } from "react";
import { 
  Table, Tag, Button, Card, Space, Tabs, Input, Modal, 
  Form, Select, Checkbox, Typography, Avatar, Tooltip, Badge 
} from "antd";
import { 
  MessageSquareWarning, Pin, Plus, Trash2, 
  UserCog, Megaphone, Search, ShieldCheck 
} from "lucide-react";

const { Title, Text } = Typography;

// --- Mock Data ---

// 1. 신고 내역
const MOCK_REPORTS = [
  { id: 1, targetType: "POST", targetId: "P-1023", reason: "욕설/비방", reporter: "userA", status: "대기", content: "이런 X같은 앱이...", createdAt: "2026-02-14 10:00" },
  { id: 2, targetType: "COMMENT", targetId: "C-5512", reason: "광고/스팸", reporter: "userB", status: "처리완료", content: "카지노 사이트 가입하세요", createdAt: "2026-02-13 15:30" },
];

// 2. 게시글 및 공지 (시스템 공지 + 커뮤니티 매니저 공지)
const MOCK_POSTS = [
  { id: 101, type: "NOTICE", title: "[전체] 서비스 이용 수칙", author: "Admin(시스템)", authorRole: "SUPER_ADMIN", isPinned: true, views: 1250, createdAt: "2025-12-01" },
  { id: 102, type: "NOTICE", title: "1월 챌린지 당첨자 발표", author: "Manager_Kim", authorRole: "COMMUNITY_MANAGER", isPinned: true, views: 430, createdAt: "2026-01-15" },
  { id: 103, type: "NORMAL", title: "오늘 공부 인증합니다", author: "StudyKing", authorRole: "USER", isPinned: false, views: 55, createdAt: "2026-02-14" },
  { id: 104, type: "NORMAL", title: "질문있습니다", author: "Newbie", authorRole: "USER", isPinned: false, views: 12, createdAt: "2026-02-14" },
];

// 3. 커뮤니티 매니저 목록
const MOCK_MANAGERS = [
  { id: "U-1005", nickname: "Manager_Kim", email: "kim@example.com", assignedAt: "2025-11-20", activityScore: 95 },
  { id: "U-1099", nickname: "Helper_Lee", email: "lee@example.com", assignedAt: "2026-01-10", activityScore: 82 },
];

export default function AdminCommunityScreen() {
  const [tab, setTab] = useState("reports"); // reports | posts | managers

  // --- State ---
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [managers, setManagers] = useState(MOCK_MANAGERS);
  
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [managerForm] = Form.useForm();

  // --- Handlers: Post/Notice ---
  const handleAddNotice = (values) => {
    const newPost = {
      id: posts.length + 100,
      type: "NOTICE",
      title: values.title,
      author: "Admin(시스템)", // 실제로는 로그인한 관리자 ID
      authorRole: "SUPER_ADMIN",
      isPinned: values.isPinned,
      views: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPosts([newPost, ...posts]);
    setIsNoticeModalOpen(false);
    form.resetFields();
  };

  const togglePin = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p));
  };

  const deletePost = (id) => {
    if(window.confirm("게시글을 삭제하시겠습니까? (복구 불가)")) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  // --- Handlers: Manager ---
  const handleAddManager = (values) => {
    // 실제로는 API로 유저 검색 후 권한 부여
    const newManager = {
      id: `U-${Math.floor(Math.random()*1000)}`,
      nickname: values.nickname,
      email: `${values.nickname}@example.com`,
      assignedAt: new Date().toISOString().split('T')[0],
      activityScore: 0
    };
    setManagers([...managers, newManager]);
    setIsManagerModalOpen(false);
    managerForm.resetFields();
  };

  const revokeManager = (id) => {
    if(window.confirm("매니저 권한을 해제하시겠습니까?")) {
      setManagers(managers.filter(m => m.id !== id));
    }
  };

  // --- Columns ---
  const reportColumns = [
    { title: "유형", dataIndex: "targetType", width: 80, render: t => <Tag>{t}</Tag> },
    { title: "내용(미리보기)", dataIndex: "content", ellipsis: true },
    { title: "사유", dataIndex: "reason", width: 120 },
    { title: "신고자", dataIndex: "reporter", width: 100 },
    { title: "상태", dataIndex: "status", width: 100, render: s => <Tag color={s==='대기'?'red':'green'}>{s}</Tag> },
    { title: "관리", width: 140, render: () => (
      <Space><Button size="small" danger>삭제</Button><Button size="small">반려</Button></Space>
    )},
  ];

  const postColumns = [
    { title: "타입", dataIndex: "type", width: 90, render: t => 
      t === "NOTICE" ? <Tag color="blue">공지</Tag> : <Tag>일반</Tag> 
    },
    { title: "제목", dataIndex: "title", render: (t, r) => (
      <Space>
        {r.isPinned && <Tag color="orange" icon={<Pin size={10}/>}>Pin</Tag>}
        <span style={{fontWeight: r.type==='NOTICE' ? 600 : 400}}>{t}</span>
      </Space>
    )},
    { title: "작성자", dataIndex: "author", render: (t, r) => (
      <Space>
        <span>{t}</span>
        {r.authorRole === "SUPER_ADMIN" && <ShieldCheck size={14} color="#6366f1" />}
        {r.authorRole === "COMMUNITY_MANAGER" && <UserCog size={14} color="#10b981" />}
      </Space>
    )},
    { title: "작성일", dataIndex: "createdAt", width: 110 },
    { title: "관리", width: 160, render: (_, r) => (
      <Space>
        <Tooltip title={r.isPinned ? "고정 해제" : "상단 고정"}>
          <Button size="small" onClick={() => togglePin(r.id)} icon={<Pin size={12} fill={r.isPinned?"currentColor":"none"} />} />
        </Tooltip>
        <Button size="small" danger icon={<Trash2 size={12}/>} onClick={() => deletePost(r.id)} />
      </Space>
    )},
  ];

  const managerColumns = [
    { title: "ID", dataIndex: "id", width: 100 },
    { title: "닉네임", dataIndex: "nickname", render: t => <span style={{fontWeight:600}}>{t}</span> },
    { title: "이메일", dataIndex: "email" },
    { title: "임명일", dataIndex: "assignedAt", width: 120 },
    { title: "활동점수", dataIndex: "activityScore", width: 100, render: s => <Badge status={s>80?"success":"warning"} text={s} /> },
    { title: "관리", width: 100, render: (_, r) => (
      <Button size="small" danger onClick={() => revokeManager(r.id)}>해임</Button>
    )},
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>커뮤니티 관리</Title>
          <Text type="secondary">게시글/공지 관리, 신고 처리, 커뮤니티 매니저 권한 부여</Text>
        </div>
      </div>

      <Card>
        <Tabs activeKey={tab} onChange={setTab}>
          
          {/* 1. 게시글 및 공지 관리 */}
          <Tabs.TabPane 
            tab={<Space><Megaphone size={16}/><span>게시글/공지</span></Space>} 
            key="posts"
          >
            <div style={{marginBottom: 16, display:'flex', justifyContent:'space-between'}}>
              <Space>
                <Select defaultValue="ALL" style={{width: 120}} options={[{value:'ALL', label:'전체'}, {value:'NOTICE', label:'공지사항'}, {value:'NORMAL', label:'일반글'}]} />
                <Input prefix={<Search size={14}/>} placeholder="제목/작성자 검색" style={{width: 200}} />
              </Space>
              <Button type="primary" icon={<Plus size={16}/>} onClick={() => setIsNoticeModalOpen(true)}>
                시스템 공지 등록
              </Button>
            </div>
            <Table columns={postColumns} dataSource={posts} rowKey="id" pagination={{pageSize: 8}} />
          </Tabs.TabPane>

          {/* 2. 매니저 관리 */}
          <Tabs.TabPane 
            tab={<Space><UserCog size={16}/><span>매니저(완장) 관리</span></Space>} 
            key="managers"
          >
            <div style={{marginBottom: 16, display:'flex', justifyContent:'flex-end'}}>
              <Button onClick={() => setIsManagerModalOpen(true)}>매니저 추가</Button>
            </div>
            <Table columns={managerColumns} dataSource={managers} rowKey="id" />
          </Tabs.TabPane>

          {/* 3. 신고 접수 */}
          <Tabs.TabPane 
            tab={<Space><MessageSquareWarning size={16}/><span>신고 접수</span></Space>} 
            key="reports"
          >
            <div style={{marginBottom: 16}}>
              <Select defaultValue="wait" style={{width: 120}} options={[{value:'all', label:'전체'}, {value:'wait', label:'대기중'}]} />
            </div>
            <Table columns={reportColumns} dataSource={MOCK_REPORTS} rowKey="id" />
          </Tabs.TabPane>

        </Tabs>
      </Card>

      {/* 시스템 공지 등록 모달 */}
      <Modal
        title="시스템 공지 등록"
        open={isNoticeModalOpen}
        onCancel={() => setIsNoticeModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddNotice}>
          <Form.Item label="제목" name="title" rules={[{required: true}]}>
            <Input placeholder="[공지] 제목을 입력하세요" />
          </Form.Item>
          <Form.Item label="내용" name="content" rules={[{required: true}]}>
            <Input.TextArea rows={6} placeholder="내용을 입력하세요" />
          </Form.Item>
          <Form.Item name="isPinned" valuePropName="checked">
            <Checkbox>상단 고정 (시스템 전체)</Checkbox>
          </Form.Item>
          <div style={{display:'flex', justifyContent:'flex-end', gap: 8}}>
            <Button onClick={() => setIsNoticeModalOpen(false)}>취소</Button>
            <Button type="primary" htmlType="submit">등록</Button>
          </div>
        </Form>
      </Modal>

      {/* 매니저 추가 모달 */}
      <Modal
        title="커뮤니티 매니저 임명"
        open={isManagerModalOpen}
        onCancel={() => setIsManagerModalOpen(false)}
        footer={null}
      >
        <Form form={managerForm} layout="vertical" onFinish={handleAddManager}>
          <div style={{marginBottom:16, padding:12, background:'#f0f9ff', borderRadius:6, fontSize:12, color:'#0369a1'}}>
            매니저는 커뮤니티 내 공지 작성, 댓글 삭제, 사용자 차단(Community Ban) 권한을 가집니다.
          </div>
          <Form.Item label="대상 사용자 닉네임" name="nickname" rules={[{required: true}]}>
            <Input placeholder="유저 닉네임 검색" />
          </Form.Item>
          <div style={{display:'flex', justifyContent:'flex-end', gap: 8}}>
            <Button onClick={() => setIsManagerModalOpen(false)}>취소</Button>
            <Button type="primary" htmlType="submit">임명</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}