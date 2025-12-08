import React from "react";

/**
 * 공통 화면 컨테이너
 *
 * props:
 *  - screenId?: string  (예: "PLAN-001")
 *  - title?: string     (화면 제목)
 *  - subtitle?: string  (부제/설명)
 *  - headerRight?: ReactNode (우측 액션 영역 버튼 등)
 *  - children: ReactNode
 *
 *  필요 시 확장을 위해 tabs / activeTabKey / onTabChange 등 추가 가능
 *  (현재는 사용 중인 곳이 없어 기본 헤더만 구현)
 */

function PageContainer({
  screenId,
  title,
  subtitle,
  headerRight,
  children,
}) {
  const hasHeader = screenId || title || subtitle || headerRight;

  return (
    <div className="page-container">
      {hasHeader && (
        <header className="screen-header">
          <div className="screen-header__left">
            {screenId && (
              <div className="screen-header__id">{screenId}</div>
            )}
            {title && (
              <h1 className="screen-header__title">{title}</h1>
            )}
            {subtitle && (
              <p className="screen-header__subtitle">{subtitle}</p>
            )}
          </div>
          {headerRight && (
            <div className="screen-header__right">{headerRight}</div>
          )}
        </header>
      )}

      <div className="screen-body">{children}</div>
    </div>
  );
}

export default PageContainer;
