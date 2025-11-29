// src/main/frontend/src/screens/plan/CanvasBoardScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/planner.css";

function CanvasBoardScreen() {
  return (
    <AppShell title="캔버스 보드">
      <div className="screen canvas-board-screen">
        <header className="screen-header">
          <h2>연간 / 프로젝트 캔버스</h2>
        </header>

        <section className="canvas-board">
          <div className="canvas-column">
            <h3>하고 싶은 것</h3>
            <textarea placeholder="올해 꼭 해보고 싶은 것들을 자유롭게 적어보세요." />
          </div>
          <div className="canvas-column">
            <h3>진행 중인 것</h3>
            <textarea placeholder="현재 진행 중인 프로젝트/공부" />
          </div>
          <div className="canvas-column">
            <h3>완료한 것</h3>
            <textarea placeholder="완료한 것들을 기록해두면 동기 부여가 됩니다." />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default CanvasBoardScreen;

