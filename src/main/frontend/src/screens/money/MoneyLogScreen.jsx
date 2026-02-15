// FILE: src/screens/money/MoneyLogScreen.jsx
import React, { useState, useMemo } from "react";
import { 
  Wallet, Plus, TrendingUp, TrendingDown, 
  DollarSign 
} from "lucide-react";
import "../../styles/timeflow-ui.css";
import "./MoneyLogScreen.css";

// Mock Data
const MOCK_TRANSACTIONS = [
  { id: "t1", title: "인프런 강의 결제", amount: -55000, category: "공부", date: "2026-02-14", type: "expense" },
  { id: "t2", title: "점심 식사", amount: -12000, category: "식비", date: "2026-02-14", type: "expense" },
  { id: "t3", title: "중고책 판매", amount: 15000, category: "기타", date: "2026-02-13", type: "income" },
];

export default function MoneyLogScreen() {
  const [logs, setLogs] = useState(MOCK_TRANSACTIONS);
  const [form, setForm] = useState({ title: "", amount: "", category: "식비", type: "expense" });

  const totalExpense = useMemo(() => 
    logs.filter(l => l.type === 'expense').reduce((sum, l) => sum + Math.abs(l.amount), 0), 
  [logs]);

  const totalIncome = useMemo(() => 
    logs.filter(l => l.type === 'income').reduce((sum, l) => sum + l.amount, 0), 
  [logs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    const newLog = {
      id: Date.now().toString(),
      title: form.title,
      amount: form.type === 'expense' ? -Number(form.amount) : Number(form.amount),
      category: form.category,
      type: form.type,
      date: new Date().toISOString().split('T')[0]
    };

    setLogs([newLog, ...logs]);
    setForm({ title: "", amount: "", category: "식비", type: "expense" });
  };

  return (
    <div className="tf-page">
      <div className="tf-page__header">
        <div>
          <div className="tf-title">머니로그 (Money Log)</div>
          <div className="tf-subtitle">시간과 돈의 흐름을 함께 관리하세요.</div>
        </div>
      </div>

      <div className="money-grid">
        {/* 1. Summary Cards */}
        <div className="tf-card money-card highlight">
          <div className="money-card__icon"><TrendingDown size={20} /></div>
          <div className="money-card__label">이번 달 지출</div>
          <div className="money-card__value">
            {totalExpense.toLocaleString()} <span className="unit">원</span>
          </div>
        </div>
        
        <div className="tf-card money-card">
          <div className="money-card__icon income"><TrendingUp size={20} /></div>
          <div className="money-card__label">수입</div>
          <div className="money-card__value">
            {totalIncome.toLocaleString()} <span className="unit">원</span>
          </div>
        </div>

        {/* 2. Input Form */}
        <div className="tf-card money-input-card">
          <h3 className="tf-item__title">내역 추가</h3>
          <form className="money-form" onSubmit={handleSubmit}>
            <div className="tf-row">
              <select 
                className="tf-select" 
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
                style={{width: 100}}
              >
                <option value="expense">지출 (-)</option>
                <option value="income">수입 (+)</option>
              </select>
              <input 
                className="tf-input" 
                placeholder="내용 (예: 점심)" 
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                style={{flex: 2}}
              />
            </div>
            <div className="tf-row">
              <select 
                className="tf-select"
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                style={{flex: 1}}
              >
                <option>식비</option>
                <option>교통</option>
                <option>공부</option>
                <option>취미</option>
                <option>기타</option>
              </select>
              <input 
                type="number" 
                className="tf-input" 
                placeholder="금액" 
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
                style={{flex: 1}}
              />
              <button type="submit" className="tf-btn tf-btn--primary">
                <Plus size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* 3. Transaction List */}
        <div className="tf-card money-list-card">
          <h3 className="tf-item__title">최근 내역</h3>
          <div className="money-list">
            {logs.map(log => (
              <div key={log.id} className="money-item">
                <div className="money-item__left">
                  <div className={`money-category-icon ${log.category === '공부' ? 'study' : ''}`}>
                    {log.category[0]}
                  </div>
                  <div>
                    <div className="money-item__title">{log.title}</div>
                    <div className="money-item__date">{log.date} · {log.category}</div>
                  </div>
                </div>
                <div className={`money-item__amount ${log.type}`}>
                  {log.amount > 0 ? "+" : ""}{log.amount.toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}