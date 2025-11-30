// src/main/frontend/src/components/timebar/TimebarPreview.jsx
import React from "react";
// ❌ 이 줄은 지우세요
// import "./timebar.css";

const TimebarPreview = ({ variant = "actual" }) => {
  if (variant === "both") {
    return (
      <div className="timebar-stack">
        <div className="timebar-line timebar-line--plan">
          <div className="timebar-block timebar-block--plan" />
        </div>
        <div className="timebar-line timebar-line--actual">
          <div className="timebar-block timebar-block--study" />
          <div className="timebar-block timebar-block--work" />
          <div className="timebar-block timebar-block--health" />
          <div className="timebar-block timebar-block--etc" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "timebar-line " +
        (variant === "plan" ? "timebar-line--plan" : "timebar-line--actual")
      }
    >
      {variant === "plan" ? (
        <div className="timebar-block timebar-block--plan" />
      ) : (
        <>
          <div className="timebar-block timebar-block--study" />
          <div className="timebar-block timebar-block--work" />
          <div className="timebar-block timebar-block--health" />
          <div className="timebar-block timebar-block--etc" />
        </>
      )}
    </div>
  );
};

export default TimebarPreview;
