// FILE: src/screens/task/TaskDetailScreen.jsx
import React, { useState } from "react";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Select from "../../components/common/Select";
import DatePicker from "../../components/common/DatePicker";
import Checkbox from "../../components/common/Checkbox";
import Button from "../../components/common/Button";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

/**
 * TASK-002-F01: 할 일 생성/수정/삭제
 * TASK-002-F02: 할 일과 일정 연동 (UI 뼈대)
 * TASK-006-F01: 학습/복습 패턴 설정
 */

const REVIEW_PATTERNS = [
  { value: "none", label: "복습 없음" },
  { value: "1-3-7-30", label: "1/3/7/30일 복습" },
  { value: "weekly", label: "매주 복습" },
  { value: "monthly", label: "매월 복습" },
];

function TaskDetailScreen() {
  const [isStudyTask, setIsStudyTask] = useState(true);
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("study");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [reviewPattern, setReviewPattern] = useState("1-3-7-30");

  const categoryOptions = DEFAULT_CATEGORIES.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: TASK-002-F01/F02/F06 API 연동
  };

  return (
    <PageContainer
      screenId="TASK-002"
      title="할 일 상세 / 편집"
      subtitle="Task의 세부 정보와 학습/복습 패턴을 설정합니다."
    >
      <div className="screen task-detail-screen">
        <form className="task-detail-form" onSubmit={handleSubmit}>
          <section className="task-detail-section">
            <h2 className="task-detail-section__title">기본 정보</h2>
            <TextInput
              label="제목"
              placeholder="예: 네트워크 강의 1강 수강"
              fullWidth
              required
            />
            <label className="field">
              <span className="field__label">설명</span>
              <textarea
                className="field__control"
                rows={3}
                placeholder="할 일에 대한 간단한 설명을 남겨 주세요."
              />
            </label>
            <div className="task-detail-grid">
              <DatePicker
                label="마감일"
                value={dueDate}
                onChange={setDueDate}
              />
              <Select
                label="카테고리"
                value={category}
                onChange={setCategory}
                options={categoryOptions}
              />
              <Select
                label="상태"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "todo", label: "할 일" },
                  { value: "doing", label: "진행 중" },
                  { value: "done", label: "완료" },
                  { value: "postponed", label: "연기" },
                  { value: "canceled", label: "취소" },
                ]}
              />
              <Select
                label="우선순위"
                value={priority}
                onChange={setPriority}
                options={[
                  { value: "high", label: "높음" },
                  { value: "medium", label: "보통" },
                  { value: "low", label: "낮음" },
                ]}
              />
            </div>
          </section>

          <section className="task-detail-section">
            <h2 className="task-detail-section__title">일정(Event) 연동</h2>
            <p className="task-detail-helper">
              이 Task를 특정 일정과 연결하면, 일정 상세 화면에서 서로를 함께
              확인할 수 있습니다.
            </p>
            <div className="task-detail-grid">
              <TextInput
                label="연결된 일정"
                placeholder="연결된 일정이 없습니다."
                fullWidth
              />
              <Button type="button" variant="ghost">
                일정 선택
              </Button>
            </div>
          </section>

          <section className="task-detail-section">
            <h2 className="task-detail-section__title">학습 / 복습 패턴</h2>
            <Checkbox
              label="이 Task는 학습/공부와 관련 있습니다."
              checked={isStudyTask}
              onChange={setIsStudyTask}
            />
            {isStudyTask && (
              <div className="task-detail-grid">
                <Select
                  label="복습 패턴"
                  value={reviewPattern}
                  onChange={setReviewPattern}
                  options={REVIEW_PATTERNS}
                />
                <p className="task-detail-helper">
                  예: 1/3/7/30 패턴은 오늘 학습 후 1일, 3일, 7일, 30일 뒤에
                  복습 Task를 자동으로 생성합니다.
                </p>
              </div>
            )}
          </section>

          <footer className="task-detail-footer">
            <Button type="submit" variant="primary">
              저장
            </Button>
            <Button type="button" variant="ghost">
              삭제
            </Button>
          </footer>
        </form>
      </div>
    </PageContainer>
  );
}

export default TaskDetailScreen;
