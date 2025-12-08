// FILE: src/screens/event/DdayListScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";

/**
 * EVT-004-F01: D-Day 일정 관리
 */

const MOCK_DDAYS = [
  {
    id: 1,
    title: "SQLD 시험",
    date: "2026-01-10",
    dday: "D-35",
    importance: "high",
  },
  {
    id: 2,
    title: "프로젝트 마감",
    date: "2025-12-31",
    dday: "D-25",
    importance: "medium",
  },
];

function DdayListScreen() {
  return (
    <PageContainer
      screenId="EVT-004"
      title="D-Day 목록"
      subtitle="D-Day로 지정한 일정만 모아, 남은 일수와 중요도 기준으로 확인합니다."
    >
      <div className="screen dday-list-screen">
        <section className="dday-list-card">
          <header className="dday-list-card__header">
            <div>
              <h2>다가오는 D-Day</h2>
              <p>중요한 일정들을 놓치지 않도록 한눈에 모아 보여줍니다.</p>
            </div>
            <Button type="button" variant="ghost" size="sm">
              정렬 옵션
            </Button>
          </header>

          {MOCK_DDAYS.length === 0 ? (
            <p className="dday-list-empty">
              등록된 D-Day가 없습니다. 일정에서 D-Day 옵션을 켜보세요.
            </p>
          ) : (
            <ul className="dday-list">
              {MOCK_DDAYS.map((d) => (
                <li key={d.id} className="dday-item">
                  <div className="dday-item__left">
                    <div className="dday-item__title">{d.title}</div>
                    <div className="dday-item__meta">
                      <span>{d.date}</span>
                    </div>
                  </div>
                  <div className="dday-item__right">
                    <span
                      className={
                        "dday-badge " +
                        (d.importance === "high"
                          ? "dday-badge--high"
                          : d.importance === "medium"
                          ? "dday-badge--medium"
                          : "dday-badge--low")
                      }
                    >
                      {d.dday}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageContainer>
  );
}

export default DdayListScreen;
