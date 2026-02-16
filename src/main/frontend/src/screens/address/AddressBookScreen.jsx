// FILE: src/screens/address/AddressBookScreen.jsx
import React, { useState, useMemo } from "react";
import {
    Search, Star, MoreHorizontal, UserPlus,
    MapPin, Mail, Phone, Calendar, MessageCircle,
    X, Edit2, Trash2, FolderPlus, Folder, Settings, Check
} from "lucide-react";
import "../../styles/timeflow-ui.css";
import "./AddressBookScreen.css";
import { useChat } from "../../shared/context/ChatContext";

// --- Mock Database (서버에 있는 전체 유저 풀) ---
const SERVER_USERS = [
    { email: "new@test.com", name: "신규유저", avatar: "N", dept: "영업팀" },
    { email: "dev@test.com", name: "개발왕", avatar: "D", dept: "개발팀" },
];

// --- Initial Local Data (내 주소록) ---
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
    // --- States ---
    const [contacts, setContacts] = useState(INITIAL_MY_CONTACTS);
    const [groups, setGroups] = useState(INITIAL_GROUPS);

    const [activeGroup, setActiveGroup] = useState("all"); // 'all', 'fav', or groupID
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedUser, setSelectedUser] = useState(null); // Drawer Target

    // Modals State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // For User Edit

    // Temporary State for Inputs
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newGroupName, setNewGroupName] = useState("");
    const [editingUser, setEditingUser] = useState(null); // 편집 중인 유저 데이터

    const { openChatWithUser } = useChat();

    // --- Logic: Filtering ---
    const filteredList = useMemo(() => {
        return contacts.filter(user => {
            // 1. Group Filter
            if (activeGroup === "fav") {
                if (!user.isFavorite) return false;
            } else if (activeGroup !== "all") {
                if (user.group !== activeGroup) return false;
            }
            // 2. Search Filter
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
        setEditingUser({ ...user }); // 복사본 생성
        setShowEditModal(true);
    };

    const handleSaveUserEdit = () => {
        setContacts(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
        setShowEditModal(false);
        setSelectedUser(editingUser); // 드로어 정보 갱신
    };

    // --- Handlers: Add Contact ---
    const handleAddContact = () => {
        // 1. 이미 있는지 체크
        if (contacts.find(u => u.email === newUserEmail)) {
            alert("이미 등록된 사용자입니다.");
            return;
        }
        // 2. 서버 풀에서 검색 (시뮬레이션)
        const found = SERVER_USERS.find(u => u.email === newUserEmail);
        if (found) {
            const newContact = {
                id: Date.now(),
                ...found,
                nickname: "",
                status: "offline",
                statusMsg: "",
                group: "friend", // 기본 그룹
                isFavorite: false
            };
            setContacts([...contacts, newContact]);
            alert(`${found.name}님을 추가했습니다.`);
            setNewUserEmail("");
            setShowAddModal(false);
        } else {
            alert("사용자를 찾을 수 없습니다. (테스트용: new@test.com 입력해보세요)");
        }
    };

    // --- Handlers: Group Management ---
    const handleAddGroup = () => {
        if (!newGroupName.trim()) return;
        const newId = `grp_${Date.now()}`;
        setGroups([...groups, { id: newId, label: newGroupName }]);
        setNewGroupName("");
    };

    const handleDeleteGroup = (groupId) => {
        if (window.confirm("그룹을 삭제하시겠습니까? 해당 그룹의 멤버는 '미지정' 처리됩니다.")) {
            setGroups(prev => prev.filter(g => g.id !== groupId));
            setContacts(prev => prev.map(u => u.group === groupId ? { ...u, group: null } : u));
            if (activeGroup === groupId) setActiveGroup("all");
        }
    };

    // --- Helper: Status Dot ---
    const renderStatus = (status) => {
        switch (status) {
            case 'online': return <span className="ab-status-dot online" title="온라인" />;
            case 'focus': return <span className="ab-status-dot focus" title="집중 중" />;
            case 'busy': return <span className="ab-status-dot busy" title="바쁨" />;
            default: return <span className="ab-status-dot offline" title="오프라인" />;
        }
    };

    // --- Handlers ---
    const handleStartChat = (user) => {
        // 1. 주소록 드로어 닫기 (선택 사항)
        setSelectedUser(null);

        // 2. 채팅 위젯 열면서 해당 유저와 대화 시작
        openChatWithUser(user.id);
    };

    return (
        <div className="tf-page address-book-page">
            {/* 1. Header */}
            <div className="tf-page__header">
                <div>
                    <div className="tf-title">주소록 (Connections)</div>
                    <div className="tf-subtitle">함께 성장하는 동료와 친구들을 관리하세요.</div>
                </div>
                <div className="tf-actions">
                    <button className="tf-btn" onClick={() => alert("내 명함 링크가 클립보드에 복사되었습니다.")}>내 명함 공유</button>
                    <button className="tf-btn tf-btn--primary" onClick={() => setShowAddModal(true)}>
                        <UserPlus size={16} style={{ marginRight: 6 }} /> 연락처 추가
                    </button>
                </div>
            </div>

            <div className="ab-layout">
                {/* 2. Left Sidebar (Group Filter) */}
                <aside className="ab-sidebar">
                    <div className="ab-search-box">
                        <Search size={16} className="ab-search-icon" />
                        <input
                            className="ab-search-input"
                            placeholder="이름, 이메일 검색"
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                        />
                    </div>

                    <div className="ab-group-list">
                        <button className={`ab-group-item ${activeGroup === 'all' ? 'active' : ''}`} onClick={() => setActiveGroup('all')}>
                            <span className="ab-dot" /> 전체 연락처 <span className="ab-count">{contacts.length}</span>
                        </button>
                        <button className={`ab-group-item ${activeGroup === 'fav' ? 'active' : ''}`} onClick={() => setActiveGroup('fav')}>
                            <Star size={14} fill="#eab308" color="#eab308" /> 즐겨찾기 <span className="ab-count">{contacts.filter(u => u.isFavorite).length}</span>
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

                {/* 3. Main List Grid */}
                <main className="ab-content">
                    <div className="ab-list-header">
                        <span className="ab-total">총 {filteredList.length}명</span>
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
                                    <button
                                        className="ab-fav-btn"
                                        onClick={(e) => handleToggleFavorite(user.id, e)}
                                    >
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
                                    <span className="tf-chip">{groups.find(g => g.id === user.group)?.label || '미지정'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* 4. Right Drawer (Details) */}
                <aside className={`ab-drawer ${selectedUser ? 'open' : ''}`}>
                    {selectedUser ? (
                        <>
                            <div className="ab-drawer-header">
                                <div className="ab-drawer-title">프로필 상세</div>
                                <button className="ab-close-btn" onClick={() => setSelectedUser(null)}><X size={20} /></button>
                            </div>

                            <div className="ab-drawer-body">
                                <div className="ab-profile-hero">
                                    <div className="ab-hero-avatar">{selectedUser.avatar || selectedUser.name[0]}</div>
                                    <div className="ab-hero-names">
                                        <span className="ab-hero-main-name">{selectedUser.nickname || selectedUser.name}</span>
                                        {selectedUser.nickname && <span className="ab-hero-sub-name">{selectedUser.name}</span>}
                                    </div>
                                    <div className="ab-hero-email">{selectedUser.email}</div>
                                    <div className={`ab-hero-status-pill ${selectedUser.status}`}>
                                        {renderStatus(selectedUser.status)}
                                        <span>{selectedUser.status === 'focus' ? '집중 중' : selectedUser.status}</span>
                                    </div>
                                </div>

                                <div className="ab-quick-actions">
                                    <button className="ab-action-btn" onClick={() => handleStartChat(selectedUser)}>
                                        <MessageCircle size={20} /><div>채팅</div>
                                    </button>
                                    <button className="ab-action-btn" onClick={() => alert(`[초대] ${selectedUser.name}님을 일정에 초대합니다.`)}>
                                        <Calendar size={20} /><div>초대</div>
                                    </button>
                                    <button className="ab-action-btn" onClick={() => handleOpenEditUser(selectedUser)}>
                                        <Edit2 size={20} /><div>편집</div>
                                    </button>
                                </div>

                                <div className="tf-divider" />

                                <div className="ab-info-section">
                                    <div className="ab-label">상세 정보</div>
                                    <div className="ab-row"><Mail size={14} /> {selectedUser.email}</div>
                                    <div className="ab-row"><MapPin size={14} /> {selectedUser.department || '부서 미정'}</div>
                                    <div className="ab-row"><Folder size={14} /> {groups.find(g => g.id === selectedUser.group)?.label || '그룹 없음'}</div>
                                </div>

                                <div className="ab-drawer-footer">
                                    <button className="tf-btn tf-btn--danger full-width" onClick={() => handleDeleteUser(selectedUser.id)}>
                                        <Trash2 size={14} style={{ marginRight: 6 }} /> 연락처 삭제
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="ab-drawer-empty">
                            사용자를 선택하면<br />상세 정보가 표시됩니다.
                        </div>
                    )}
                </aside>
            </div>

            {/* --- Modals --- */}

            {/* 1. Add User Modal */}
            {showAddModal && (
                <div className="ab-modal-overlay">
                    <div className="ab-modal">
                        <div className="ab-modal-header">
                            <h3>연락처 추가</h3>
                            <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
                        </div>
                        <div className="ab-modal-body">
                            <label className="ab-label">이메일 검색</label>
                            <div className="ab-input-row">
                                <input
                                    className="tf-input"
                                    placeholder="user@example.com"
                                    value={newUserEmail}
                                    onChange={e => setNewUserEmail(e.target.value)}
                                />
                                <button className="tf-btn tf-btn--primary" onClick={handleAddContact}>추가</button>
                            </div>
                            <p className="ab-help-text">* 테스트용: new@test.com 또는 dev@test.com</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Group Manage Modal */}
            {showGroupModal && (
                <div className="ab-modal-overlay">
                    <div className="ab-modal">
                        <div className="ab-modal-header">
                            <h3>그룹(폴더) 관리</h3>
                            <button onClick={() => setShowGroupModal(false)}><X size={20} /></button>
                        </div>
                        <div className="ab-modal-body">
                            <div className="ab-input-row">
                                <input
                                    className="tf-input"
                                    placeholder="새 그룹 이름"
                                    value={newGroupName}
                                    onChange={e => setNewGroupName(e.target.value)}
                                />
                                <button className="tf-btn" onClick={handleAddGroup} disabled={!newGroupName.trim()}>
                                    <FolderPlus size={16} />
                                </button>
                            </div>
                            <div className="ab-group-manage-list">
                                {groups.map(group => (
                                    <div key={group.id} className="ab-group-manage-item">
                                        <span>{group.label}</span>
                                        <button onClick={() => handleDeleteGroup(group.id)} className="ab-del-btn"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Edit User Modal */}
            {showEditModal && editingUser && (
                <div className="ab-modal-overlay">
                    <div className="ab-modal">
                        <div className="ab-modal-header">
                            <h3>정보 수정</h3>
                            <button onClick={() => setShowEditModal(false)}><X size={20} /></button>
                        </div>
                        <div className="ab-modal-body">
                            <div className="ab-field">
                                <label className="ab-label">원래 이름</label>
                                <input className="tf-input" value={editingUser.name} disabled style={{ background: '#f1f5f9' }} />
                            </div>
                            <div className="ab-field">
                                <label className="ab-label">별칭 (내가 보는 이름)</label>
                                <input
                                    className="tf-input"
                                    value={editingUser.nickname}
                                    onChange={e => setEditingUser({ ...editingUser, nickname: e.target.value })}
                                    placeholder="예: 김팀장님"
                                />
                            </div>
                            <div className="ab-field">
                                <label className="ab-label">그룹(폴더) 이동</label>
                                <select
                                    className="tf-select"
                                    value={editingUser.group || ""}
                                    onChange={e => setEditingUser({ ...editingUser, group: e.target.value })}
                                >
                                    <option value="">미지정</option>
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