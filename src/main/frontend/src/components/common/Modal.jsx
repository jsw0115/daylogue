// src/main/frontend/src/components/common/Modal.jsx
import React from "react";
import "../../styles/components.css";

function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <header className="modal__header">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onClose}>
            ✕
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>
  );
}

export default Modal;

