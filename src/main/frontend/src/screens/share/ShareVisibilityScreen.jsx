// FILE: src/main/frontend/src/screens/share/ShareVisibilityScreen.jsx
import React, { useState } from "react";
import PageContainer from "../../layout/PageContainer";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

const VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "모두",
    description: "나와 친구, 그룹 멤버 등 모든 사람이 일정의 세부 내용을 볼 수 있어요.",
  },
  {
    value: "attendees",
    label: "참석자만",
    description: "초대된 참석자만 일정 제목/내용을 확인할 수 있어요.",
  },
  {
    value: "busy",
    label: "바쁨만",
    description:
      "다른 사람에게는 ‘바쁨’ 상태만 보이고, 제목/내용은 숨겨집니다.",
  },
  {
    value: "private",
    label: "나만",
    description: "나만 일정 내용을 볼 수 있고, 다른 사람에게는 표시되지 않아요.",
  },
];

function ShareVisibilityScreen() {
  const [visibility, setVisibility] = useState("attendees");

  const currentOption =
    VISIBILITY_OPTIONS.find((o) => o.value === visibility) ||
    VISIBILITY_OPTIONS[0];

  return (
    <PageContainer
      screenId="SHARE-003"
      title="공유 일정 가시성 설정"
      subtitle="일정별 가시성(모두/참석자만/바쁨만/나만)을 선택합니다."
    >
      <div className="screen share-screen share-screen--visibility">
        <div className="share-card share-card--visibility">
          <form className="share-visibility-form">
            <div className="share-visibility-form__field">
              <Select
                label="가시성"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                options={VISIBILITY_OPTIONS}
              />
            </div>

            <div className="share-visibility-explain">
              <h4 className="share-visibility-explain__title">
                선택한 옵션 설명
              </h4>
              <p className="share-visibility-explain__label">
                {currentOption.label}
              </p>
              <p className="share-visibility-explain__desc">
                {currentOption.description}
              </p>

              <ul className="share-visibility-tips">
                <li>중요 회의나 시험 일정은 “참석자만” 또는 “바쁨만”이 유용해요.</li>
                <li>가족/커플 캘린더처럼 함께 쓰는 캘린더는 “모두” 옵션을 자주 사용해요.</li>
                <li>개인 루틴/다이어리형 일정은 “나만”을 기본값으로 둘 수 있어요.</li>
              </ul>
            </div>

            <div className="share-visibility-footer">
              <label className="share-visibility-default field">
                <input type="checkbox" />
                <span>이 옵션을 새 일정의 기본 가시성으로 사용</span>
              </label>
              <Button type="submit" variant="primary">
                설정 저장
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}

export default ShareVisibilityScreen;
