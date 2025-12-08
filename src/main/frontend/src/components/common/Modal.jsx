import React from "react";

const Modal = ({ open, title, onClose, children, footer }) => {
  if (!open) return null;

  return (
    <div className="td-modal-backdrop" onClick={onClose}>
      <div
        className="td-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="td-modal__title">{title}</h3>}
        <div className="td-modal__body">{children}</div>
        {footer && <div className="td-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
