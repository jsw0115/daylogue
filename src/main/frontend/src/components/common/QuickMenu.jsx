import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, LayoutDashboard, Inbox, Calendar, CheckSquare, X 
} from "lucide-react";
import "../../styles/components/QuickMenu.css";

export default function QuickMenu() {
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  // 1. 초기 위치 (우측 하단 쯤)
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 150 });
  
  // 2. 상태 관리
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 }); // 드래그 시작 좌표 (클릭 vs 드래그 판별용)

  // 메뉴 아이템 정의
  const MENU_ITEMS = [
    { icon: <LayoutDashboard size={20}/>, label: "홈", path: "/dashboard", color: "#6366f1" },
    { icon: <Inbox size={20}/>, label: "메모", path: "/inbox", color: "#10b981" },
    { icon: <Calendar size={20}/>, label: "일정", path: "/planner", color: "#f59e0b" },
    { icon: <CheckSquare size={20}/>, label: "할일", path: "/tasks", color: "#ef4444" },
  ];

  // --- 드래그 로직 ---
  const handleMouseDown = (e) => {
    // 우클릭 제외
    if (e.button !== 0) return;

    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const onMouseMove = (moveEvent) => {
      // 화면 밖으로 나가지 않게 제한 (Boundary Constraint)
      const newX = Math.min(Math.max(0, moveEvent.clientX - startX), window.innerWidth - 60);
      const newY = Math.min(Math.max(0, moveEvent.clientY - startY), window.innerHeight - 60);
      
      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = (upEvent) => {
      // 드래그 종료
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      // --- 중요: 클릭인지 드래그인지 판별 ---
      // 이동 거리가 5px 미만이면 "클릭"으로 간주
      const dist = Math.sqrt(
        Math.pow(upEvent.clientX - dragStartPos.current.x, 2) +
        Math.pow(upEvent.clientY - dragStartPos.current.y, 2)
      );

      if (dist < 5) {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); // 이동 후 메뉴 닫기
  };

  return (
    <div 
      className="qm-container"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        // 드래그 중엔 transition 끄기 (반응성 향상)
        transition: isDragging ? 'none' : 'top 0.1s, left 0.1s' 
      }}
    >
      {/* 펼쳐지는 메뉴 아이템들 */}
      <div className={`qm-menu ${isOpen ? "open" : ""}`}>
        {MENU_ITEMS.map((item, idx) => (
          <button 
            key={idx}
            className="qm-item"
            style={{ transitionDelay: `${idx * 0.05}s` }}
            onClick={() => handleNavigate(item.path)}
          >
            <span className="qm-label">{item.label}</span>
            <div className="qm-icon" style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>
          </button>
        ))}
      </div>

      {/* 메인 플로팅 버튼 */}
      <button 
        ref={buttonRef}
        className={`qm-fab ${isOpen ? "active" : ""}`}
        onMouseDown={handleMouseDown}
        // 터치 디바이스 지원 (선택 사항)
        // onTouchStart={...} 
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
}