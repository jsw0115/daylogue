// src/shared/components/Modal.jsx
import React, { useEffect } from "react";

export default function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  width = 560,
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="tb-modal__backdrop" onMouseDown={onClose} role="presentation">
      <div
        className="tb-modal__panel"
        style={{ width }}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title || "modal"}
      >
        <div className="tb-modal__head">
          <div className="tb-modal__title">{title}</div>
          <button type="button" className="tb-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="tb-modal__body">{children}</div>

        {footer ? <div className="tb-modal__foot">{footer}</div> : null}
      </div>
    </div>
  );
}
