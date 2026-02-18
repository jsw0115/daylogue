// FILE: src/screens/address/AddressBookScreen.jsx
import React, { useState, useMemo } from "react";
import { 
  Search, Star, UserPlus, MapPin, Mail, Calendar, MessageCircle, 
  X, Edit2, Trash2, FolderPlus, Folder, Settings, Check,
  UserX, Send, HelpCircle, FolderOpen, ArrowUp, ArrowDown, Save 
} from "lucide-react";
import "../../styles/timeflow-ui.css";
import "./AddressBookScreen.css";

// --- Mock Database ---
const SERVER_USERS = [
  { email: "new@test.com", name: "신규유저", avatar: "N", dept: "영업팀" },
  { email: "dev@test.com", name: "개발왕", avatar: "D", dept: "개발팀" },
  { email: "design@test.com", name: "디자인신", avatar: "P", dept: "디자인팀" },
];

const INITIAL_MY_CONTACTS = [
  { id: 1, name: "강민지", nickname: "강디자이너", email: "minji@example.com", status: "online", statusMsg: "오늘도 갓생 🔥", department: "디자인팀", group: "company", isFavorite: true },
  { id: 2, name: "김철수", nickname: "", email: "chulsoo@example.com", status: "focus", statusMsg: "집중 모드 (25:00 남음)", department: "개발팀", group: "company", isFavorite: false },
  { id: 3, name: "이영희", nickname: "", email: "yh@example.com", status: "offline", statusMsg: "", department: "기획팀", group: "study", isFavorite: false },
];

const INITIAL_GROUPS = [
  { id: "company", label: "회사" },
  { id: "study", label: "스터디" },
  { id: "friend", label: "친구" },
];

export default function AddressBookScreen() {
  const [contacts, setContacts] = useState(INITIAL_MY_CONTACTS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  
  const [activeGroup, setActiveGroup] = useState("all"); 
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [targetEmail, setTargetEmail] = useState("");
  const [inviteMode, setInviteMode] = useState(false);

  const [newGroupName, setNewGroupName] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  // ★ New States for Group Editing ★
  const [editingGroupId, setEditingGroupId] = useState(null); // 현재 수정 중인 그룹 ID
  const [tempGroupName, setTempGroupName] = useState(""); // 수정 중인 이름 임시 저장

  // --- Filtering Logic ---
  const filteredList = useMemo(() => {
    return contacts.filter(user => {
      if (activeGroup === "fav") {
        if (!user.isFavorite) return false;
      } else if (activeGroup === "unassigned") {
        if (user.group) return false; 
      } else if (activeGroup !== "all") {
        if (user.group !== activeGroup) return false;
      }
      
      if (searchKeyword) {
        const lowerKey = searchKeyword.toLowerCase();
        const targetName = user.nickname || user.name;
        if (!targetName.toLowerCase().includes(lowerKey) && !user.email.includes(lowerKey)) return false;
      }
      return true;
    }).sort((a, b) => (a.nickname || a.name).localeCompare(b.nickname || b.name));
  }, [contacts, activeGroup, searchKeyword]);

  // --- Handlers: User Actions ---
  const handleToggleFavorite = (id, e) => {
    e?.stopPropagation();
    setContacts(prev => prev.map(u => u.id === id ? { ...u, isFavorite: !u.isFavorite } : u));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("정말 이 연락처를 삭제하시겠습니까?")) {
      setContacts(prev => prev.filter(u => u.id !== id));
      setSelectedUser(null);
    }
  };

  const handleOpenEditUser = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleSaveUserEdit = () => {
    setContacts(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    setShowEditModal(false);
    setSelectedUser(editingUser);
  };

  // --- Handlers: Add / Invite ---
  const handleCheckUser = () => {
    if (!targetEmail.trim()) return;
    const alreadyExists = contacts.find(u => u.email === targetEmail);
    if (alreadyExists) return alert(`이미 '${alreadyExists.name}'님이 주소록에 있습니다.`);

    const found = SERVER_USERS.find(u => u.email === targetEmail);
    if (found) {
      const newContact = { id: Date.now(), ...found, nickname: "", status: "offline", statusMsg: "", group: "", isFavorite: false };
      setContacts([...contacts, newContact]);
      alert(`${found.name}님이 추가되었습니다.`);
      setTargetEmail(""); setShowAddModal(false);
    } else {
      setInviteMode(true);
    }
  };

  const handleSendInvite = () => {
    alert(`${targetEmail}로 초대장을 발송했습니다.`);
    setTargetEmail(""); setInviteMode(false); setShowAddModal(false);
  };

  // --- Handlers: Group Management (New Features) ---
  
  // 1. 그룹 추가
  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    const newId = `grp_${Date.now()}`;
    setGroups([...groups, { id: newId, label: newGroupName }]);
    setNewGroupName("");
  };

  // 2. 그룹 삭제
  const handleDeleteGroup = (groupId) => {
    if (window.confirm("그룹을 삭제하시겠습니까? 멤버들은 '미지정' 상태가 됩니다.")) {
      setGroups(prev => prev.filter(g => g.id !== groupId));
      setContacts(prev => prev.map(u => u.group === groupId ? { ...u, group: "" } : u));
      if (activeGroup === groupId) setActiveGroup("all");
    }
  };

  // 3. 그룹 이름 수정 시작
  const startEditGroup = (group) => {
    setEditingGroupId(group.id);
    setTempGroupName(group.label);
  };

  // 4. 그룹 이름 저장
  const saveEditGroup = () => {
    if (!tempGroupName.trim()) return;
    setGroups(prev => prev.map(g => g.id === editingGroupId ? { ...g, label: tempGroupName } : g));
    setEditingGroupId(null);
    setTempGroupName("");
  };

  // 5. 그룹 순서 변경 (위/아래)
  const moveGroup = (index, direction) => {
    const newGroups = [...groups];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // 범위 체크
    if (targetIndex < 0 || targetIndex >= newGroups.length) return;

    // Swap
    [newGroups[index], newGroups[targetIndex]] = [newGroups[targetIndex], newGroups[index]];
    setGroups(newGroups);
  };

  const renderStatus = (status) => {
    switch(status) {
      case 'online': return <span className="ab-status-dot online" title="온라인"/>;
      case 'focus': return <span className="ab-status-dot focus" title="집중 중"/>;
      case 'busy': return <span className="ab-status-dot busy" title="바쁨"/>;
      default: return <span className="ab-status-dot offline" title="오프라인"/>;
    }
  };

  return (
    <div className="tf-page address-book-page">
      {/* Header */}
      <div className="tf-page__header">
        <div>
          <div className="tf-title">주소록</div>
          <div className="tf-subtitle">함께 성장하는 동료와 친구들을 관리하세요.</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn" onClick={() => alert("링크 복사됨")}>내 명함 공유</button>
          <button className="tf-btn tf-btn--primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={16} style={{marginRight:6}}/> 연락처 추가
          </button>
        </div>
      </div>

      <div className="ab-layout">
        {/* Sidebar */}
        <aside className="ab-sidebar">
          <div className="ab-search-box">
            <Search size={16} className="ab-search-icon"/>
            <input 
              className="ab-search-input" 
              placeholder="이름, 이메일 검색" 
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
            />
          </div>
          
          <div className="ab-group-list">
            <button className={`ab-group-item ${activeGroup === 'all' ? 'active' : ''}`} onClick={() => setActiveGroup('all')}>
              <span className="ab-dot"/> 전체 연락처 <span className="ab-count">{contacts.length}</span>
            </button>
            <button className={`ab-group-item ${activeGroup === 'fav' ? 'active' : ''}`} onClick={() => setActiveGroup('fav')}>
              <Star size={14} fill="#eab308" color="#eab308"/> 즐겨찾기 <span className="ab-count">{contacts.filter(u=>u.isFavorite).length}</span>
            </button>
            <button className={`ab-group-item ${activeGroup === 'unassigned' ? 'active' : ''}`} onClick={() => setActiveGroup('unassigned')}>
              <HelpCircle size={14} className="tf-muted" /> 미지정 <span className="ab-count">{contacts.filter(u=>!u.group).length}</span>
            </button>
            
            <div className="ab-group-divider"></div>
            <div className="ab-group-label-row">
              <span className="ab-group-label">내 그룹</span>
              <button className="ab-group-setting-btn" onClick={() => setShowGroupModal(true)} title="그룹 관리">
                <Settings size={12} />
              </button>
            </div>

            {groups.map(group => (
              <button 
                key={group.id}
                className={`ab-group-item ${activeGroup === group.id ? 'active' : ''}`}
                onClick={() => setActiveGroup(group.id)}
              >
                <Folder size={14} />
                {group.label}
                <span className="ab-count">
                  {contacts.filter(u => u.group === group.id).length}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="ab-content">
          <div className="ab-list-header">
            <span className="ab-total">{filteredList.length}명</span>
            <div className="ab-sort-options">이름순 ▼</div>
          </div>

          <div className="ab-user-grid">
            {filteredList.map(user => (
              <div 
                key={user.id} 
                className={`ab-user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="ab-card-top">
                  <div className="ab-avatar-wrapper">
                    <div className="ab-avatar">{user.avatar || user.name[0]}</div>
                    <div className="ab-status-badge">{renderStatus(user.status)}</div>
                  </div>
                  <button className="ab-fav-btn" onClick={(e) => handleToggleFavorite(user.id, e)}>
                    <Star size={16} fill={user.isFavorite ? "#eab308" : "none"} color={user.isFavorite ? "#eab308" : "#cbd5e1"} />
                  </button>
                </div>
                <div className="ab-user-info">
                  <div className="ab-name-row">
                    <span className="ab-name">{user.nickname || user.name}</span>
                    {user.nickname && <span className="ab-realname">({user.name})</span>}
                  </div>
                  <div className="ab-dept">{user.department}</div>
                  <div className="ab-status-msg">{user.statusMsg || "-"}</div>
                </div>
                <div className="ab-user-tags">
                  <span className={`tf-chip ${!user.group ? 'unassigned' : ''}`}>
                    {groups.find(g => g.id === user.group)?.label || '미지정'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Drawer */}
        <aside className={`ab-drawer ${selectedUser ? 'open' : ''}`}>
          {selectedUser ? (
            <>
              <div className="ab-drawer-header">
                <div className="ab-drawer-title">프로필 상세</div>
                <button className="ab-close-btn" onClick={() => setSelectedUser(null)}><X size={20}/></button>
              </div>
              <div className="ab-drawer-body">
                <div className="ab-profile-hero">
                  <div className="ab-hero-avatar">{selectedUser.avatar || selectedUser.name[0]}</div>
                  <div className="ab-hero-names">
                    <span className="ab-hero-main-name">{selectedUser.nickname || selectedUser.name}</span>
                    {selectedUser.nickname && <span className="ab-hero-sub-name">{selectedUser.name}</span>}
                  </div>
                  <div className="ab-hero-email">{selectedUser.email}</div>
                  <div className="ab-hero-status-pill">
                    {renderStatus(selectedUser.status)} <span>{selectedUser.status}</span>
                  </div>
                </div>
                <div className="ab-quick-actions">
                  <button className="ab-action-btn"><MessageCircle size={20}/><div>채팅</div></button>
                  <button className="ab-action-btn"><Calendar size={20}/><div>초대</div></button>
                  <button className="ab-action-btn" onClick={() => handleOpenEditUser(selectedUser)}><Edit2 size={20}/><div>편집</div></button>
                </div>
                <div className="tf-divider"/>
                <div className="ab-info-section">
                  <div className="ab-label">상세 정보</div>
                  <div className="ab-row"><Mail size={14}/> {selectedUser.email}</div>
                  <div className="ab-row"><MapPin size={14}/> {selectedUser.department || '부서 미정'}</div>
                  <div className="ab-row"><FolderOpen size={14}/> {groups.find(g => g.id === selectedUser.group)?.label || '미지정'}</div>
                </div>
                <div className="ab-drawer-footer">
                  <button className="tf-btn tf-btn--danger full-width" onClick={() => handleDeleteUser(selectedUser.id)}>
                    <Trash2 size={14} style={{marginRight:6}}/> 연락처 삭제
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="ab-drawer-empty">사용자를 선택하세요.</div>
          )}
        </aside>
      </div>

      {/* --- Add Modal --- */}
      {showAddModal && (
        <div className="ab-modal-overlay">
          <div className="ab-modal">
            <div className="ab-modal-header">
              <h3>{inviteMode ? "초대장 발송" : "연락처 추가"}</h3>
              <button onClick={() => {setShowAddModal(false); setInviteMode(false); setTargetEmail("");}}><X size={20}/></button>
            </div>
            <div className="ab-modal-body">
              {!inviteMode ? (
                <>
                  <label className="ab-label">사용자 검색</label>
                  <div className="ab-input-row">
                    <input className="tf-input" placeholder="user@example.com" value={targetEmail} onChange={e => setTargetEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleCheckUser()}/>
                    <button className="tf-btn tf-btn--primary" onClick={handleCheckUser}>확인</button>
                  </div>
                </>
              ) : (
                <div className="ab-invite-view">
                  <UserX size={32} color="#f59e0b" style={{marginBottom:16}}/>
                  <p className="ab-invite-msg"><strong>{targetEmail}</strong> 님은 미가입자입니다.</p>
                  <button className="tf-btn tf-btn--primary full-width" onClick={handleSendInvite}>초대장 보내기</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Group Manage Modal (Updated) --- */}
      {showGroupModal && (
        <div className="ab-modal-overlay">
          <div className="ab-modal" style={{ height: '500px' }}> {/* 높이 증가 */}
            <div className="ab-modal-header">
              <h3>그룹 관리</h3>
              <button onClick={() => {setShowGroupModal(false); setEditingGroupId(null);}}><X size={20}/></button>
            </div>
            <div className="ab-modal-body flex-col">
              {/* 그룹 추가 영역 */}
              <div className="ab-input-row" style={{marginBottom: '16px'}}>
                <input 
                  className="tf-input" 
                  placeholder="새 그룹 이름" 
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                />
                <button className="tf-btn tf-btn--primary" onClick={handleAddGroup} disabled={!newGroupName.trim()}>
                  <FolderPlus size={16}/> 추가
                </button>
              </div>

              {/* 그룹 리스트 (수정/정렬 가능) */}
              <div className="ab-group-manage-list">
                {groups.map((group, index) => (
                  <div key={group.id} className="ab-group-manage-item">
                    {editingGroupId === group.id ? (
                      /* 수정 모드 */
                      <div className="ab-group-edit-mode">
                        <input 
                          className="tf-input small" 
                          value={tempGroupName} 
                          onChange={e => setTempGroupName(e.target.value)}
                          autoFocus
                        />
                        <button className="ab-icon-btn save" onClick={saveEditGroup}><Save size={16}/></button>
                        <button className="ab-icon-btn cancel" onClick={() => setEditingGroupId(null)}><X size={16}/></button>
                      </div>
                    ) : (
                      /* 보기 모드 */
                      <>
                        <span className="ab-group-name-text">{group.label}</span>
                        <div className="ab-group-actions">
                          {/* 정렬 버튼 */}
                          <button 
                            className="ab-icon-btn" 
                            onClick={() => moveGroup(index, 'up')} 
                            disabled={index === 0}
                            title="위로 이동"
                          >
                            <ArrowUp size={14}/>
                          </button>
                          <button 
                            className="ab-icon-btn" 
                            onClick={() => moveGroup(index, 'down')} 
                            disabled={index === groups.length - 1}
                            title="아래로 이동"
                          >
                            <ArrowDown size={14}/>
                          </button>
                          
                          {/* 수정/삭제 버튼 */}
                          <button className="ab-icon-btn edit" onClick={() => startEditGroup(group)} title="이름 변경">
                            <Edit2 size={14}/>
                          </button>
                          <button className="ab-icon-btn del" onClick={() => handleDeleteGroup(group.id)} title="삭제">
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit User Modal --- */}
      {showEditModal && editingUser && (
        <div className="ab-modal-overlay">
          <div className="ab-modal">
            <div className="ab-modal-header">
              <h3>정보 수정</h3>
              <button onClick={() => setShowEditModal(false)}><X size={20}/></button>
            </div>
            <div className="ab-modal-body">
              <div className="ab-field">
                <label className="ab-label">별칭</label>
                <input className="tf-input" value={editingUser.nickname} onChange={e => setEditingUser({...editingUser, nickname: e.target.value})}/>
              </div>
              <div className="ab-field">
                <label className="ab-label">그룹</label>
                <select className="tf-select" value={editingUser.group || ""} onChange={e => setEditingUser({...editingUser, group: e.target.value})}>
                  <option value="">(미지정)</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                </select>
              </div>
              <div className="ab-modal-footer">
                <button className="tf-btn tf-btn--primary full-width" onClick={handleSaveUserEdit}>저장</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}