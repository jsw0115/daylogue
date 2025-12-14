// src/components/common/Modal.jsx
import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import "../../styles/components/modal.css";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md", // sm | md | lg
  className = "",
  closeOnOverlay = true,
  closeOnEsc = true,
}) {
  const portalEl = useMemo(() => {
    if (typeof document === "undefined") return null;
    return document.body;
  }, []);

  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (!open) return;
    // 모달 열릴 때 스크롤 잠금
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !portalEl) return null;

  return createPortal(
    <div
      className="tbModalOverlay"
      onMouseDown={(e) => {
        if (!closeOnOverlay) return;
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="presentation"
    >
      <div className={`tbModal tbModal--${size} ${className}`} role="dialog" aria-modal="true">
        <div className="tbModal__head">
          <div className="tbModal__title">{title}</div>
          <button type="button" className="tbModal__close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="tbModal__body">{children}</div>

        {footer ? <div className="tbModal__foot">{footer}</div> : null}
      </div>
    </div>,
    portalEl
  );
}
