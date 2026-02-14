import React, { useState } from "react";
import "../../styles/timeflow-ui.css";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";

export default function MoneyLogScreen() {
  const [logs, setLogs] = useState([
    { id: 1, date: "2026-02-14", desc: "점심 식사", amount: -12000, category: "식비" },
    { id: 2, date: "2026-02-14", desc: "중고거래 판매", amount: 35000, category: "수입" },
  ]);

  const total = logs.reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">머니로그</div>
          <div className="tf-subtitle">시간과 돈을 한 번에 관리하세요.</div>
        </div>
        <div className="tf-actions">
          <button className="tf-btn tf-btn--primary"><Plus size={16}/> 내역 추가</button>
        </div>
      </div>

      <div className="tf-grid-layout">
        {/* Summary */}
        <div className="tf-card">
          <div className="tf-small tf-muted">이번 달 누적</div>
          <div style={{fontSize: 28, fontWeight: 900, marginTop: 4, color: total >= 0 ? '#10b981' : '#ef4444'}}>
            {total > 0 ? "+" : ""}{total.toLocaleString()} 원
          </div>
        </div>

        {/* Daily List */}
        <div className="tf-card">
          <div className="tf-list">
            {logs.map(log => (
              <div key={log.id} className="tf-row" style={{justifyContent: 'space-between', padding:'12px 0', borderBottom:'1px dashed #eee'}}>
                <div style={{display:'flex', gap:12, alignItems:'center'}}>
                  <div style={{
                    background: log.amount > 0 ? '#dcfce7' : '#fee2e2', 
                    padding: 8, borderRadius: 8, color: log.amount > 0 ? '#166534' : '#991b1b'
                  }}>
                    {log.amount > 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                  </div>
                  <div>
                    <div className="tf-bold">{log.desc}</div>
                    <div className="tf-small tf-muted">{log.category} · {log.date}</div>
                  </div>
                </div>
                <div className="tf-bold" style={{color: log.amount > 0 ? '#166534' : '#1e293b'}}>
                  {log.amount > 0 ? "+" : ""}{log.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}