// FILE: src/main/frontend/src/screens/community/features/CommunityShareModal.jsx
import React from "react";
import "../../../styles/timeflow-ui.css";

// 인스타 공유 감성을 위한 Modal
export default function CommunityShareModal({ open, onClose, groupName }) {
  if (!open) return null;

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

  return (
    <div className="tf-modal-overlay" onMouseDown={onClose}>
      <div className="tf-modal" onMouseDown={e => e.stopPropagation()} style={{maxWidth: 360, background:'transparent', boxShadow:'none', border:'none'}}>
        
        {/* Receipt UI */}
        <div className="tf-receipt">
          <div style={{textAlign:'center', marginBottom:20}}>
            <h2 style={{margin:0, fontSize:24, fontWeight:900}}>GOD-SAENG</h2>
            <div style={{fontSize:12, marginTop:4}}>OFFICIAL RECEIPT</div>
            <div style={{fontSize:12, marginTop:4}}>{today}</div>
          </div>

          <div className="tf-receipt-line">
            <span>GROUP</span>
            <span>{groupName}</span>
          </div>
          <div className="tf-receipt-line">
            <span>USER</span>
            <span>ME (Level.5)</span>
          </div>

          <div style={{margin:'20px 0'}}>
            <div className="tf-receipt-line">
              <span>Morning Miracle</span>
              <span>1.0 hr</span>
            </div>
            <div className="tf-receipt-line">
              <span>Reading Book</span>
              <span>0.5 hr</span>
            </div>
            <div className="tf-receipt-line">
              <span>Coding Study</span>
              <span>2.5 hr</span>
            </div>
          </div>

          <div className="tf-receipt-total">
            <span>TOTAL TIME</span>
            <span>4.0 HRS</span>
          </div>

          <div style={{textAlign:'center', marginTop:24}}>
            <div style={{fontSize:10}}>THANK YOU FOR YOUR EFFORT</div>
            <div style={{marginTop:8, height:30, background:`repeating-linear-gradient(90deg, #000 0, #000 2px, #fff 2px, #fff 4px)`}}></div>
            <div style={{fontSize:10, marginTop:4}}>1234-5678-9000</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{marginTop:16, display:'flex', gap:8, justifyContent:'center'}}>
          <button className="tf-btn" style={{background:'white'}} onClick={onClose}>닫기</button>
          <button 
            className="tf-btn tf-btn--primary" 
            style={{background:'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', border:'none'}}
            onClick={() => alert("이미지가 저장되었습니다! (인스타 스토리에 공유하세요)")}
          >
            Instagram 공유
          </button>
        </div>

      </div>
    </div>
  );
}