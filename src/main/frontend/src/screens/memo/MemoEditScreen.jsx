import React, { useState } from "react";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";

function MemoEditScreen() {
  const [memoType, setMemoType] = useState("text");

  return (
    <PageContainer
      screenId="MEMO-002"
      title="메모 작성 / 편집"
      subtitle="번뜩이는 아이디어와 기록들을 텍스트 또는 음성으로 남겨 둡니다."
    >
      <div className="screen memo-edit-screen">
        <div className="memo-edit-layout">
          {/* 텍스트/음성 타입 선택 */}
          <section className="memo-edit-type-card">
            <Select
              label="메모 유형"
              value={memoType}
              onChange={setMemoType}
              options={[
                { value: "text", label: "텍스트 메모" },
                { value: "voice", label: "음성 메모" },
              ]}
            />
            <p className="memo-edit-type-card__hint">
              나중에 메모 인박스에서 STT 변환, 할 일 후보 추출을 할 수 있습니다.
            </p>
          </section>

          {/* 텍스트 메모 입력 */}
          <section className="memo-edit-main-card">
            <header className="memo-edit-main-card__header">
              <h3>
                {memoType === "text" ? "텍스트 메모" : "음성 메모 STT 내용"}
              </h3>
              <span className="memo-edit-main-card__label">
                MEMO-002-F01 / MEMO-003-F01
              </span>
            </header>

            {memoType === "text" ? (
              <form className="memo-edit-form">
                <TextInput label="제목" fullWidth placeholder="메모 제목을 입력해 주세요." />
                <label className="field">
                  <span className="field__label">내용</span>
                  <textarea
                    className="field__control memo-edit-form__textarea"
                    rows={8}
                    placeholder="자유롭게 메모를 남겨 보세요."
                  />
                </label>
                <div className="memo-edit-form__actions">
                  <Button type="button" variant="ghost">
                    취소
                  </Button>
                  <Button type="submit" variant="primary">
                    메모 저장
                  </Button>
                </div>
              </form>
            ) : (
              <div className="memo-edit-voice">
                <div className="memo-edit-voice__recorder">
                  <p className="memo-edit-voice__status">
                    마이크를 사용해 음성 메모를 녹음할 수 있습니다.
                  </p>
                  <div className="memo-edit-voice__buttons">
                    <Button type="button" variant="primary">
                      녹음 시작
                    </Button>
                    <Button type="button" variant="ghost">
                      정지
                    </Button>
                  </div>
                  <p className="memo-edit-voice__hint">
                    실제 녹음/재생 기능은 추후 연동하고, 지금은 UI 뼈대만 제공합니다.
                  </p>
                </div>
                <div className="memo-edit-voice__stt">
                  <label className="field">
                    <span className="field__label">
                      STT 변환 텍스트 (MEMO-003-F01)
                    </span>
                    <textarea
                      className="field__control memo-edit-form__textarea"
                      rows={6}
                      placeholder="녹음이 끝나면 음성을 텍스트로 변환해 이 영역에 표시합니다."
                    />
                  </label>
                  <div className="memo-edit-form__actions">
                    <Button type="button" variant="ghost">
                      삭제
                    </Button>
                    <Button type="button" variant="primary">
                      메모 저장
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

export default MemoEditScreen;
