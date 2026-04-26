import React, { useState, useEffect } from "react";
import api from "../../api"; // 기존 설정된 api.js 활용

export default function TaskMemberSelector({ selectedMembers, onChange }) {
  const [friends, setFriends] = useState([]);

  // 주소록(친구 목록) 불러오기 (API 엔드포인트는 실제 프로젝트 구조에 맞게 수정 필요)
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await api.get("/api/share/friends");
        setFriends(res.data.data || []);
      } catch (error) {
        console.error("친구 목록을 불러오는데 실패했습니다.", error);
      }
    };
    fetchFriends();
  }, []);

  const handleSelect = (e) => {
    const friendId = e.target.value;
    if (!friendId) return;
    
    const friend = friends.find((f) => f.id === friendId);
    if (friend && !selectedMembers.find((m) => m.id === friendId)) {
      onChange([...selectedMembers, friend]);
    }
  };

  const handleRemove = (friendId) => {
    onChange(selectedMembers.filter((m) => m.id !== friendId));
  };

  return (
    <div className="task-member-section">
      <label className="field__label">함께할 멤버 추가</label>
      <select className="field__control" onChange={handleSelect} defaultValue="">
        <option value="">주소록에서 선택...</option>
        {friends.map((friend) => (
          <option key={friend.id} value={friend.id}>{friend.name}</option>
        ))}
      </select>
      <div className="task-member-list">
        {selectedMembers.map((member) => (
          <div key={member.id} className="task-member-badge">
            {member.name}
            <span className="task-member-badge__remove" onClick={() => handleRemove(member.id)}>✕</span>
          </div>
        ))}
      </div>
    </div>
  );
}