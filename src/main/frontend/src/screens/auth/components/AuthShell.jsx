import React from "react";
import TimeFlowLogo from "./TimeFlowLogo";

export default function AuthShell({ title, subtitle, children, foot }) {
  return (
    <div className="tf-auth-shell">
      <div className="tf-auth-shell__inner">
        {/* Brand panel (desktop only) */}
        <aside className="tf-auth-brand" aria-hidden="true">
          <div className="tf-auth-brand__top">
            <TimeFlowLogo size={52} />
          </div>

          <div className="tf-auth-brand__hero">
            <div className="tf-auth-brand__headline">하루를 ‘흐름’으로 기록하고</div>
            <div className="tf-auth-brand__headline">계획과 실행을 비교해요</div>
            <div className="tf-auth-brand__desc">
              타임라인 · 루틴 · 리포트 초안 · 통계까지 한 번에.
            </div>
          </div>

          <div className="tf-auth-brand__chips">
            <span className="tf-chip">Timeline</span>
            <span className="tf-chip">PvA</span>
            <span className="tf-chip">AI Summary</span>
          </div>
        </aside>

        {/* Form panel */}
        <main className="tf-auth-panel">
          <div className="tf-auth-panel__head">
            <div className="tf-auth-panel__logoMobile">
              <TimeFlowLogo size={44} />
            </div>
            <h1 className="tf-auth-title">{title}</h1>
            {subtitle ? <div className="tf-auth-subtitle">{subtitle}</div> : null}
          </div>

          <div className="tf-auth-card">{children}</div>

          {foot ? <div className="tf-auth-foot">{foot}</div> : null}
        </main>
      </div>
    </div>
  );
}
