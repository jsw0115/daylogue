// FILE: src/shared/ui/auth/AuthShell.jsx
import React from "react";
import TimeFlowLogo from "../TimeFlowLogo";

export default function AuthShell({
  title = "TimeFlow",
  subtitle = "Timebar Diary",
  badge = "Plan • Actual • Review",
  children,
  footer,
}) {
  return (
    <div className="auth-screen">
      <div className="auth-shell">
        <section className="auth-brand" aria-label="TimeFlow">
          <div className="auth-brand__top">
            <div className="auth-brand__logoRow">
              <TimeFlowLogo size={44} />
              <div className="auth-brand__name">
                <div className="auth-brand__title">{title}</div>
                <div className="auth-brand__subtitle">{subtitle}</div>
              </div>
            </div>
            <div className="auth-brand__badge">{badge}</div>
          </div>

          <div className="auth-brand__copy">
            <div className="auth-brand__headline">오늘의 시간을 기록하고, 내일의 흐름을 만든다</div>
            <div className="auth-brand__desc">
              타임바 기반 플래너 + 루틴 + 리포트까지 한 곳에서.
            </div>
          </div>

          <div className="auth-brand__bottom">
            <div className="auth-brand__mini">Secure Session • JWT • Refresh</div>
          </div>
        </section>

        <main className="auth-card">{children}</main>

        {footer ? <div className="auth-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
