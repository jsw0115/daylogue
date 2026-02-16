// FILE: src/components/common/AddressBookPicker.jsx
import React, { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import './AddressBookPicker.css'; // 간단한 스타일 필요

export default function AddressBookPicker({ isOpen, onClose, onConfirm, multiple = true }) {
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Mock Users (실제로는 Props나 API로 받음)
  const users = [
    { id: 1, name: "강민지", email: "minji@ex.com" },
    { id: 2, name: "김철수", email: "chulsoo@ex.com" },
    { id: 3, name: "이영희", email: "yh@ex.com" },
  ];

  const toggleUser = (id) => {
    if (multiple) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
    } else {
      setSelectedIds([id]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="picker-overlay">
      <div className="picker-modal">
        <div className="picker-header">
          <h3>사용자 선택</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        
        <div className="picker-search">
          <Search size={16}/>
          <input placeholder="이름 검색..." />
        </div>

        <div className="picker-list">
          {users.map(user => (
            <div 
              key={user.id} 
              className={`picker-item ${selectedIds.includes(user.id) ? 'selected' : ''}`}
              onClick={() => toggleUser(user.id)}
            >
              <div className="picker-avatar">{user.name[0]}</div>
              <div className="picker-info">
                <div className="picker-name">{user.name}</div>
                <div className="picker-email">{user.email}</div>
              </div>
              {selectedIds.includes(user.id) && <Check size={16} color="#6366f1"/>}
            </div>
          ))}
        </div>

        <div className="picker-footer">
          <button className="tf-btn" onClick={onClose}>취소</button>
          <button className="tf-btn tf-btn--primary" onClick={() => onConfirm(selectedIds)}>
            {selectedIds.length}명 선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}