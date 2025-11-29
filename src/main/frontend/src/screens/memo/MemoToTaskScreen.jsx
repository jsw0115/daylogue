// src/main/frontend/src/screens/memo/MemoToTaskScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import { useResponsiveLayout } from "../../shared/hooks/useResponsiveLayout";

const initialCandidates = [
  {
    id: "c1",
    text: "내일 9시에 팀 회의 준비 자료 정리하기",
    checked: true,
  },
  {
    id: "c2",
    text: "주말에 SQLD 2회차 모의고사 풀기",
    checked: false,
  },
];

function MemoToTaskScreen() {
  const viewport = useResponsiveLayout();
  const [candidates, setCandidates] = useState(initialCandidates);

  const toggleChecked = (id) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, checked: !c.checked } : c
      )
    );
  };

  const updateCandidate = (id, field, value) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  return (
    <AppShell title="메모 → TO-DO 변환">
      <div className={`screen screen--memo-to-task screen--${viewport}`}>
        <header className="screen-header">
          <div className="screen-header__center">
            <h2>메모에서 할 일 만들기</h2>
          </div>
        </header>

        <section className="memo-original">
          <h3>원본 메모</h3>
          <p className="memo-original__text">
            내일 9시에 팀 회의 준비하고, 주말엔 SQLD 2회차 모의고사를 꼭 풀자.
          </p>
        </section>

        <section className="memo-candidates">
          <h3>추출된 할 일 후보</h3>
          <ul className="candidate-list">
            {candidates.map((c) => (
              <li key={c.id} className="candidate-item">
                <div className="candidate-item__main">
                  <label>
                    <input
                      type="checkbox"
                      checked={c.checked}
                      onChange={() => toggleChecked(c.id)}
                    />
                    <span>{c.text}</span>
                  </label>
                </div>
                <div className="candidate-item__meta">
                  <select
                    value={c.categoryId || ""}
                    onChange={(e) =>
                      updateCandidate(c.id, "categoryId", e.target.value)
                    }
                  >
                    <option value="">카테고리</option>
                    <option value="work">업무</option>
                    <option value="study">공부</option>
                    <option value="health">건강</option>
                  </select>
                  <input
                    type="date"
                    value={c.dueDate || ""}
                    onChange={(e) =>
                      updateCandidate(c.id, "dueDate", e.target.value)
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="memo-actions">
          <button className="primary-button">
            선택한 항목 To-do로 생성
          </button>
        </section>
      </div>
    </AppShell>
  );
}

export default MemoToTaskScreen;
