import React from "react";

function SvgMail(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M4.5 7.5h15v9a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-9Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m5.2 8.3 6.3 5a1 1 0 0 0 1.2 0l6.3-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SvgLock(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M7.5 11V8.8A4.5 4.5 0 0 1 12 4.3a4.5 4.5 0 0 1 4.5 4.5V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 11h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function SvgUser(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20.2c1.6-3.6 5-5.2 7.5-5.2s5.9 1.6 7.5 5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function SvgPhone(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M8 3.8h8A2.2 2.2 0 0 1 18.2 6v12A2.2 2.2 0 0 1 16 20.2H8A2.2 2.2 0 0 1 5.8 18V6A2.2 2.2 0 0 1 8 3.8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 17.3h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function SvgEye(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 15.2a3.2 3.2 0 1 0-3.2-3.2 3.2 3.2 0 0 0 3.2 3.2Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export const TFIcons = { mail: SvgMail, lock: SvgLock, user: SvgUser, phone: SvgPhone, eye: SvgEye };

export default function AuthField({
  label,
  id,
  icon = "mail",
  right,
  error,
  ...inputProps
}) {
  const Icon = TFIcons[icon] ?? TFIcons.mail;

  return (
    <div className={`tf-field ${error ? "is-error" : ""}`}>
      {label ? (
        <label className="tf-label" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <div className="tf-inputWrap">
        <span className="tf-inputIcon" aria-hidden="true">
          <Icon />
        </span>

        <input id={id} className="tf-input" {...inputProps} />

        {right ? <div className="tf-inputRight">{right}</div> : null}
      </div>

      {error ? <div className="tf-fieldError">{error}</div> : null}
    </div>
  );
}
