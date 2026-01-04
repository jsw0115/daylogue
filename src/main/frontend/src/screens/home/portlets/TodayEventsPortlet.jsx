import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Select,
  Space,
  Tag,
  Tooltip,
} from "antd";

import {
  Bell,
  Bookmark,
  BookmarkCheck,
  Plus,
  Repeat,
  Users,
  Lock,
  Eye,
  EyeOff,
  Pin,
} from "lucide-react";

import { addEvent, getEvents, seedIfEmpty, toggleBookmark } from "./eventMockStore";

const { Option } = Select;

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toMin(hhmm) {
  const [h, m] = (hhmm || "00:00").split(":").map((x) => Number(x));
  return h * 60 + m;
}

function visibilityTag(v) {
  // EVT-003-F03: 공개범위
  if (v === "PUBLIC") return <Tag>모두</Tag>;
  if (v === "PARTICIPANTS") return <Tag>참석자만</Tag>;
  if (v === "BUSY_ONLY") return <Tag>바쁨만</Tag>;
  if (v === "PRIVATE") return <Tag>나만</Tag>;
  return <Tag>-</Tag>;
}

function visibilityIcon(v) {
  if (v === "PUBLIC") return <Eye size={14} />;
  if (v === "PARTICIPANTS") return <Users size={14} />;
  if (v === "BUSY_ONLY") return <EyeOff size={14} />;
  if (v === "PRIVATE") return <Lock size={14} />;
  return null;
}

function importanceTag(level) {
  // EVT-001-F03(정렬)/필터용 중요도 표시
  if (level === "HIGH") return <Tag color="red">중요</Tag>;
  if (level === "LOW") return <Tag color="default">낮음</Tag>;
  return <Tag>보통</Tag>;
}

export default function TodayEventsPortlet() {
  const [dataVersion, setDataVersion] = useState(0);

  // 필터(대시보드 요약용)
  const [q, setQ] = useState("");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [onlyDday, setOnlyDday] = useState(false);
  const [onlyImportant, setOnlyImportant] = useState(false);

  // quick add modal
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    dateKey: todayKey(),
    start: "10:00",
    end: "10:30",
    category: "업무",
    visibility: "PARTICIPANTS",
    importance: "NORMAL",
    isDday: false,
    reminderMin: 10,
    repeatRule: "NONE",
    participantsCount: 1,
    timeZone: "Asia/Seoul",
  });

  useEffect(() => {
    seedIfEmpty();
  }, []);

  const todayEvents = useMemo(() => {
    const all = getEvents().filter((e) => !e.deletedAt);
    const tKey = todayKey();
    let list = all.filter((e) => e.dateKey === tKey);

    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      list = list.filter((e) => {
        const title = (e.title || "").toLowerCase();
        const cat = (e.category || "").toLowerCase();
        return title.includes(qq) || cat.includes(qq);
      });
    }
    if (onlyBookmarked) list = list.filter((e) => e.isBookmarked);
    if (onlyDday) list = list.filter((e) => e.isDday);
    if (onlyImportant) list = list.filter((e) => e.importance === "HIGH");

    return list.sort((a, b) => toMin(a.start) - toMin(b.start));
  }, [dataVersion, q, onlyBookmarked, onlyDday, onlyImportant]);

  const submit = () => {
    if (!form.title.trim()) return;

    addEvent({
      ...form,
      title: form.title.trim(),
      isDday: !!form.isDday,
      participantsCount: Number(form.participantsCount || 1),
      reminderMin: Number(form.reminderMin || 10),
    });

    setDataVersion((v) => v + 1);
    setOpen(false);
    setForm((prev) => ({ ...prev, title: "" }));
  };

  const toggle = (id) => {
    toggleBookmark(id);
    setDataVersion((v) => v + 1);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="검색(제목/카테고리)"
          size="small"
        />
        <Button
          size="small"
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setOpen(true)}
        >
          추가
        </Button>
      </div>

      <Space size={6} wrap style={{ marginBottom: 10 }}>
        <Tag.CheckableTag checked={onlyBookmarked} onChange={setOnlyBookmarked}>
          북마크
        </Tag.CheckableTag>
        <Tag.CheckableTag checked={onlyDday} onChange={setOnlyDday}>
          D-Day
        </Tag.CheckableTag>
        <Tag.CheckableTag checked={onlyImportant} onChange={setOnlyImportant}>
          중요
        </Tag.CheckableTag>
      </Space>

      {todayEvents.length === 0 ? (
        <div className="hd-empty">오늘 일정이 없습니다.</div>
      ) : (
        <div className="evtList">
          {todayEvents.map((e) => (
            <div key={e.id} className="evtRow">
              <div className="evtTime">
                <div className="evtTime__main">{e.start}</div>
                <div className="evtTime__sub">{e.end}</div>
              </div>

              <div className="evtMain">
                <div className="evtTitleRow">
                  <div className="evtTitle">{e.title}</div>

                  <Space size={6}>
                    <Tooltip title={e.isBookmarked ? "북마크 해제" : "북마크"}>
                      <Button
                        size="small"
                        type="text"
                        onClick={() => toggle(e.id)}
                        icon={e.isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      />
                    </Tooltip>
                  </Space>
                </div>

                <div className="evtMeta">
                  <Tag>{e.category || "기타"}</Tag>
                  {importanceTag(e.importance)}
                  {visibilityTag(e.visibility)}
                  <span className="evtMetaIcon">{visibilityIcon(e.visibility)}</span>

                  {e.repeatRule && e.repeatRule !== "NONE" ? (
                    <Tag icon={<Repeat size={14} />}>반복</Tag>
                  ) : null}

                  {typeof e.reminderMin === "number" ? (
                    <Tag icon={<Bell size={14} />}>{e.reminderMin}분 전</Tag>
                  ) : null}

                  {e.participantsCount > 1 ? (
                    <Tag icon={<Users size={14} />}>{e.participantsCount}명</Tag>
                  ) : null}

                  {e.isDday ? (
                    <Tag icon={<Pin size={14} />}>D-Day</Tag>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <Button size="small" type="default" onClick={() => { /* TODO: EVT-001으로 라우팅 */ }}>
          일정 화면으로 이동(추후 EVT-001)
        </Button>
      </div>

      <Modal
        title="일정 추가 (UI 데모)"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        okText="저장"
        cancelText="취소"
      >
        <div className="evtForm">
          <div className="evtField">
            <div className="evtLabel">제목</div>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="예) 프로젝트 회의"
            />
          </div>

          <div className="evtGrid2">
            <div className="evtField">
              <div className="evtLabel">날짜</div>
              <Input
                value={form.dateKey}
                onChange={(e) => setForm((p) => ({ ...p, dateKey: e.target.value }))}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="evtField">
              <div className="evtLabel">타임존(EVT-TZ-F01)</div>
              <Input
                value={form.timeZone}
                onChange={(e) => setForm((p) => ({ ...p, timeZone: e.target.value }))}
                placeholder="Asia/Seoul"
              />
            </div>
          </div>

          <div className="evtGrid2">
            <div className="evtField">
              <div className="evtLabel">시작</div>
              <Input
                value={form.start}
                onChange={(e) => setForm((p) => ({ ...p, start: e.target.value }))}
                placeholder="HH:mm"
              />
            </div>
            <div className="evtField">
              <div className="evtLabel">종료</div>
              <Input
                value={form.end}
                onChange={(e) => setForm((p) => ({ ...p, end: e.target.value }))}
                placeholder="HH:mm"
              />
            </div>
          </div>

          <div className="evtGrid2">
            <div className="evtField">
              <div className="evtLabel">카테고리</div>
              <Input
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                placeholder="업무/공부/건강..."
              />
            </div>

            <div className="evtField">
              <div className="evtLabel">공개범위(EVT-003-F03)</div>
              <Select
                value={form.visibility}
                onChange={(v) => setForm((p) => ({ ...p, visibility: v }))}
                style={{ width: "100%" }}
              >
                <Option value="PUBLIC">모두</Option>
                <Option value="PARTICIPANTS">참석자만</Option>
                <Option value="BUSY_ONLY">바쁨만</Option>
                <Option value="PRIVATE">나만</Option>
              </Select>
            </div>
          </div>

          <div className="evtGrid2">
            <div className="evtField">
              <div className="evtLabel">중요도</div>
              <Select
                value={form.importance}
                onChange={(v) => setForm((p) => ({ ...p, importance: v }))}
                style={{ width: "100%" }}
              >
                <Option value="LOW">낮음</Option>
                <Option value="NORMAL">보통</Option>
                <Option value="HIGH">중요</Option>
              </Select>
            </div>

            <div className="evtField">
              <div className="evtLabel">반복(EVT-005-F01)</div>
              <Select
                value={form.repeatRule}
                onChange={(v) => setForm((p) => ({ ...p, repeatRule: v }))}
                style={{ width: "100%" }}
              >
                <Option value="NONE">없음</Option>
                <Option value="DAILY">매일</Option>
                <Option value="WEEKLY">매주</Option>
                <Option value="MONTHLY">매월</Option>
                <Option value="YEARLY">매년</Option>
              </Select>
            </div>
          </div>

          <div className="evtGrid2">
            <div className="evtField">
              <div className="evtLabel">알림(EVT-006-F01)</div>
              <Input
                value={String(form.reminderMin)}
                onChange={(e) => setForm((p) => ({ ...p, reminderMin: e.target.value }))}
                placeholder="예: 10 (분)"
              />
            </div>
            <div className="evtField">
              <div className="evtLabel">참석자 수(EVT-007-F01)</div>
              <Input
                value={String(form.participantsCount)}
                onChange={(e) => setForm((p) => ({ ...p, participantsCount: e.target.value }))}
                placeholder="예: 3"
              />
            </div>
          </div>

          <div className="evtField" style={{ marginTop: 6 }}>
            <Space>
              <Tag.CheckableTag
                checked={!!form.isDday}
                onChange={(v) => setForm((p) => ({ ...p, isDday: v }))}
              >
                D-Day로 지정(EVT-003-F04)
              </Tag.CheckableTag>
            </Space>
          </div>
        </div>
      </Modal>
    </div>
  );
}
