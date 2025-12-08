import React, { useMemo, useState } from "react";
import PageContainer from "../../layout/PageContainer";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

const SAMPLE_MEMOS = [
  {
    id: 1,
    type: "text",
    status: "pending",
    title: "Timebar Diary API 명세 아이디어 정리",
    createdAt: "2025-12-06 10:12",
    tags: ["할 일 후보", "기획"],
  },
  {
    id: 2,
    type: "voice",
    status: "processed",
    title: "출근길에 떠올랐던 공부 루틴 개선 메모",
    createdAt: "2025-12-05 08:40",
    tags: ["루틴", "STT 완료"],
  },
  {
    id: 3,
    type: "text",
    status: "processed",
    title: "집중 모드 화면 UX 메모",
    createdAt: "2025-12-04 22:15",
    tags: ["포커스", "디자인"],
  },
];

function MemoInboxScreen() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filteredMemos = useMemo(
    () =>
      SAMPLE_MEMOS.filter((m) => {
        if (typeFilter !== "all" && m.type !== typeFilter) return false;
        if (statusFilter !== "all" && m.status !== statusFilter) return false;
        if (
          query &&
          !m.title.toLowerCase().includes(query.toLowerCase())
        ) {
          return false;
        }
        return true;
      }),
    [typeFilter, statusFilter, query]
  );

  return (
    <PageContainer
      screenId="MEMO-001"
      title="메모 인박스"
      subtitle="텍스트·음성 메모를 모아서 관리하고, 할 일 후보를 뽑아낼 수 있습니다."
    >
      <div className="screen memo-inbox-screen">
        {/* 필터 영역 */}
        <div className="memo-inbox-filters">
          <Select
            label="종류"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "all", label: "전체" },
              { value: "text", label: "텍스트 메모" },
              { value: "voice", label: "음성 메모" },
            ]}
          />
          <Select
            label="상태"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "전체" },
              { value: "pending", label: "미처리" },
              { value: "processed", label: "처리 완료" },
            ]}
          />
          <div className="field memo-inbox-search">
            <label className="field__label">검색어</label>
            <input
              className="field__control"
              placeholder="메모 내용을 검색해 주세요."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="memo-inbox-filters__actions">
            <Button type="button" size="sm" variant="ghost">
              필터 초기화
            </Button>
            <Button type="button" size="sm" variant="primary">
              새 메모 작성
            </Button>
          </div>
        </div>

        {/* 목록 영역 */}
        <div className="memo-inbox-list">
          {filteredMemos.length === 0 ? (
            <div className="memo-inbox-empty">
              <p>조건에 맞는 메모가 없습니다.</p>
              <p>새 메모를 작성해 보세요.</p>
            </div>
          ) : (
            <ul className="memo-inbox-items">
              {filteredMemos.map((memo) => (
                <li key={memo.id} className="memo-inbox-item">
                  <div className="memo-inbox-item__header">
                    <span className="memo-inbox-item__type">
                      {memo.type === "voice" ? "음성 메모" : "텍스트 메모"}
                    </span>
                    <span
                      className={
                        "memo-inbox-item__status memo-inbox-item__status--" +
                        memo.status
                      }
                    >
                      {memo.status === "pending" ? "미처리" : "처리 완료"}
                    </span>
                  </div>
                  <h3 className="memo-inbox-item__title">{memo.title}</h3>
                  <div className="memo-inbox-item__meta">
                    <span className="memo-inbox-item__date">
                      {memo.createdAt}
                    </span>
                    <div className="memo-inbox-item__tags">
                      {memo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="memo-inbox-item__tag"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="memo-inbox-item__actions">
                    <Button type="button" size="sm" variant="ghost">
                      상세 보기
                    </Button>
                    <Button type="button" size="sm" variant="ghost">
                      할 일 후보 추출
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default MemoInboxScreen;
