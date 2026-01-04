// src/screens/diary/DailyDiaryScreen.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";

import {
  Button,
  Card,
  Calendar as AntCalendar,
  DatePicker,
  Input,
  List,
  Tag,
  Typography,
  Divider,
  Tooltip,
  Progress,
} from "antd";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import localizedFormat from "dayjs/plugin/localizedFormat";

import {
  ChevronLeft,
  ChevronRight,
  Save,
  List as ListIcon,
  Calendar as CalendarIcon,
  Search,
  SmilePlus,
  Smile,
  Meh,
  Frown,
  Angry,
} from "lucide-react";

import "../../styles/screens/diary.css";
import { safeStorage } from "../../shared/utils/safeStorage";

dayjs.extend(localizedFormat);
dayjs.locale("ko");

const { Title, Text } = Typography;

const MOODS = [
  { id: "great", label: "최고", Icon: SmilePlus },
  { id: "good", label: "좋음", Icon: Smile },
  { id: "soso", label: "보통", Icon: Meh },
  { id: "bad", label: "나쁨", Icon: Frown },
  { id: "terrible", label: "최악", Icon: Angry },
];

const toDateKey = (d) => dayjs(d).format("YYYY-MM-DD");

function loadDiaryMap() {
  return safeStorage.getJSON("diary.entries", {});
}
function saveDiaryMap(map) {
  safeStorage.setJSON("diary.entries", map);
}

function getPlannerSummary(dateKey) {
  const plan = safeStorage.getJSON(`planner.daily.${dateKey}`, null);
  if (!plan) return null;

  const todos = plan.todos || [];
  const routines = plan.routines || [];
  const timeline = plan.timelineItems || [];

  const todoDone = todos.filter((t) => t.done).length;
  const routineDone = routines.filter((r) => r.done).length;

  return {
    todoTotal: todos.length,
    todoDone,
    routineTotal: routines.length,
    routineDone,
    timelineCount: timeline.length,
    topTimeline: timeline.slice(0, 3),
  };
}

function snapDiary(mood, summary, detail, gratitude) {
  return JSON.stringify({
    mood,
    summary: (summary ?? "").trim(),
    detail: (detail ?? "").trim(),
    gratitude: (gratitude ?? "").trim(),
  });
}

export default function DailyDiaryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);

  const [viewMode, setViewMode] = useState("list"); // list | calendar
  const [query, setQuery] = useState("");

  const [diaryMap, setDiaryMap] = useState(() => loadDiaryMap());

  const current = diaryMap[dateKey] || {
    mood: "good",
    summary: "",
    detail: "",
    gratitude: "",
    updatedAt: null,
  };

  const [mood, setMood] = useState(current.mood);
  const [summary, setSummary] = useState(current.summary);
  const [detail, setDetail] = useState(current.detail);
  const [gratitude, setGratitude] = useState(current.gratitude);

  const savedSnapRef = useRef(
    snapDiary(current.mood, current.summary, current.detail, current.gratitude)
  );
  const [lastSavedAt, setLastSavedAt] = useState(current.updatedAt);

  useEffect(() => {
    const map = loadDiaryMap();
    setDiaryMap(map);

    const cur = map[dateKey] || {
      mood: "good",
      summary: "",
      detail: "",
      gratitude: "",
      updatedAt: null,
    };

    setMood(cur.mood);
    setSummary(cur.summary);
    setDetail(cur.detail);
    setGratitude(cur.gratitude);

    savedSnapRef.current = snapDiary(cur.mood, cur.summary, cur.detail, cur.gratitude);
    setLastSavedAt(cur.updatedAt);
  }, [dateKey]);

  const isDirty = useMemo(() => {
    const curSnap = snapDiary(mood, summary, detail, gratitude);
    return curSnap !== savedSnapRef.current;
  }, [mood, summary, detail, gratitude]);

  const saveNow = () => {
    setDiaryMap((prev) => {
      const next = { ...prev };
      const now = Date.now();
      next[dateKey] = { mood, summary, detail, gratitude, updatedAt: now };
      saveDiaryMap(next);
      savedSnapRef.current = snapDiary(mood, summary, detail, gratitude);
      setLastSavedAt(now);
      return next;
    });
  };

  const moveDay = (delta) => setSelectedDate(dayjs(selectedDate).add(delta, "day").toDate());
  const goToday = () => setSelectedDate(new Date());

  const plannerSummary = useMemo(() => getPlannerSummary(dateKey), [dateKey]);

  const entries = useMemo(() => {
    const list = Object.entries(diaryMap)
      .map(([k, v]) => ({ dateKey: k, ...v }))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    if (!query.trim()) return list;

    const q = query.trim().toLowerCase();
    return list.filter((e) => {
      const moodLabel = MOODS.find((m) => m.id === e.mood)?.label || "";
      return (
        e.dateKey.includes(q) ||
        (e.summary || "").toLowerCase().includes(q) ||
        (e.detail || "").toLowerCase().includes(q) ||
        (e.gratitude || "").toLowerCase().includes(q) ||
        moodLabel.includes(q)
      );
    });
  }, [diaryMap, query]);

  const moodByDate = (date) => {
    const key = toDateKey(date);
    const entry = diaryMap[key];
    if (!entry) return null;
    return MOODS.find((x) => x.id === entry.mood) || null;
  };

  const moodMeta = MOODS.find((m) => m.id === mood) || MOODS[1];

  return (
    <div className="screen daily-diary-screen daily-diary-screen--ui">
      {/* Header */}
      <div className="diary-ui__header">
        <div className="diary-ui__title">
          <Title level={3} style={{ margin: 0 }}>
            데일리 다이어리
          </Title>
          <Text type="secondary">오늘의 기분과 하루를 정리하는 공간</Text>
        </div>

        <div className="diary-ui__actions">
          <Tooltip title="이전 날짜">
            <Button icon={<ChevronLeft size={18} />} onClick={() => moveDay(-1)} />
          </Tooltip>

          <div className="diary-ui__dateBlock">
            <div className="diary-ui__dateText">{dayjs(selectedDate).format("YYYY. MM. D (ddd)")}</div>

            <div className="diary-ui__dateRow">
              <Button onClick={goToday}>오늘</Button>

              <DatePicker
                value={dayjs(selectedDate)}
                onChange={(v) => v && setSelectedDate(v.toDate())}
                allowClear={false}
                format="YYYY-MM-DD"
                placeholder="날짜 이동"
              />
            </div>
          </div>

          <Tooltip title="다음 날짜">
            <Button icon={<ChevronRight size={18} />} onClick={() => moveDay(1)} />
          </Tooltip>

          <Divider type="vertical" />

          <Tabs.Root value={viewMode} onValueChange={setViewMode}>
            <Tabs.List className="diary-ui__tabs" aria-label="뷰 모드">
              <Tabs.Trigger className="diary-ui__tab" value="list">
                <ListIcon size={16} />
                <span>목록</span>
              </Tabs.Trigger>
              <Tabs.Trigger className="diary-ui__tab" value="calendar">
                <CalendarIcon size={16} />
                <span>월간</span>
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>

          <Divider orientation="vertical" />

          <Button
            type={isDirty ? "primary" : "default"}
            icon={<Save size={16} />}
            onClick={saveNow}
            disabled={!isDirty}
          >
            저장
          </Button>

          <Text type="secondary" className="diary-ui__savedAt">
            {lastSavedAt ? `마지막 저장: ${dayjs(lastSavedAt).format("MM/DD HH:mm")}` : "저장 기록 없음"}
          </Text>
        </div>
      </div>

      {/* Layout */}
      <div className="diary-ui__layout">
        {/* Editor */}
        <div className="diary-ui__editor">
          <Card className="diary-ui__card" title="오늘의 기분" size="small">
            <div className="diary-ui__moods">
              {MOODS.map((m) => {
                const ActiveIcon = m.Icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={clsx("diary-ui__moodBtn", mood === m.id && "is-active")}
                    onClick={() => setMood(m.id)}
                  >
                    <span className="diary-ui__moodIcon" aria-hidden="true">
                      <ActiveIcon size={18} />
                    </span>
                    <span className="diary-ui__moodLabel">{m.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="diary-ui__moodHint">
              <Tag>
                <moodMeta.Icon size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
                선택됨: {moodMeta.label}
              </Tag>
            </div>
          </Card>

          <Card className="diary-ui__card" title="플래너 요약" size="small">
            {plannerSummary ? (
              <div className="diary-ui__kpis">
                <div className="diary-ui__kpi">
                  <div className="diary-ui__kpiLabel">Todo</div>
                  <Progress
                    percent={
                      plannerSummary.todoTotal
                        ? Math.round((plannerSummary.todoDone / plannerSummary.todoTotal) * 100)
                        : 0
                    }
                    size="small"
                  />
                  <div className="diary-ui__kpiValue">
                    {plannerSummary.todoDone}/{plannerSummary.todoTotal}
                  </div>
                </div>

                <div className="diary-ui__kpi">
                  <div className="diary-ui__kpiLabel">Routine</div>
                  <Progress
                    percent={
                      plannerSummary.routineTotal
                        ? Math.round((plannerSummary.routineDone / plannerSummary.routineTotal) * 100)
                        : 0
                    }
                    size="small"
                  />
                  <div className="diary-ui__kpiValue">
                    {plannerSummary.routineDone}/{plannerSummary.routineTotal}
                  </div>
                </div>

                <div className="diary-ui__kpi">
                  <div className="diary-ui__kpiLabel">Timeline</div>
                  <div className="diary-ui__kpiValue">{plannerSummary.timelineCount}</div>
                </div>

                {plannerSummary.topTimeline?.length ? (
                  <div className="diary-ui__topTimeline">
                    <Divider style={{ margin: "10px 0" }} />
                    <Text type="secondary">상위 3개 타임라인</Text>
                    <div className="diary-ui__timelineList">
                      {plannerSummary.topTimeline.map((t) => (
                        <div key={t.id} className="diary-ui__timelineItem">
                          <div className="diary-ui__timelineTitle">{t.title}</div>
                          <div className="diary-ui__timelineMeta">
                            {t.start}~{t.end} {t.tag ? `· ${t.tag}` : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Text type="secondary">해당 날짜의 플래너 데이터가 없습니다.</Text>
            )}
          </Card>

          <Card className="diary-ui__card" title="하루 한 줄 요약" size="small">
            <Input.TextArea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="오늘을 한 줄로 요약"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Card>

          <Card className="diary-ui__card" title="상세 기록" size="small">
            <Input.TextArea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="오늘 있었던 일, 느낀 점, 배운 점 등"
              autoSize={{ minRows: 6, maxRows: 16 }}
            />
          </Card>

          <Card className="diary-ui__card" title="감사 / 되돌아보기" size="small">
            <Input.TextArea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="감사한 일, 내일을 위한 다짐"
              autoSize={{ minRows: 4, maxRows: 10 }}
            />
          </Card>
        </div>

        {/* Side */}
        <div className="diary-ui__side">
          <Card
            className="diary-ui__card"
            title="작성한 일기"
            size="small"
            extra={
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색(날짜/내용/기분)"
                prefix={<Search size={16} />}
                allowClear
              />
            }
          >
            {viewMode === "calendar" ? (
              <div className="diary-ui__calendarWrap">
                <AntCalendar
                  value={dayjs(selectedDate)}
                  onSelect={(v) => v && setSelectedDate(v.toDate())}
                  // AntD v5 기준: cellRender 사용
                  cellRender={(cur, info) => {
                    if (info.type !== "date") return info.originNode;

                    const meta = moodByDate(cur.toDate());
                    if (!meta) return info.originNode;

                    const Icon = meta.Icon;
                    return (
                      <div className="diary-ui__calCell">
                        {info.originNode}
                        <div className="diary-ui__calBadge" title={meta.label}>
                          <Icon size={14} />
                        </div>
                      </div>
                    );
                  }}
                />
                <Text type="secondary" className="diary-ui__calendarHint">
                  작성된 날짜에 기분 아이콘 표시
                </Text>

                {/* 호환성 메모:
                    만약 antd 버전이 달라 cellRender가 동작 안 하면
                    dateCellRender로 바꿔야 하는 케이스가 있음.
                */}
              </div>
            ) : (
              <List
                dataSource={entries}
                locale={{ emptyText: "아직 작성한 일기가 없습니다." }}
                renderItem={(e) => {
                  const meta = MOODS.find((x) => x.id === e.mood) || null;
                  const Icon = meta?.Icon;

                  return (
                    <List.Item
                      className={clsx("diary-ui__entryItem", e.dateKey === dateKey && "is-active")}
                      onClick={() => setSelectedDate(dayjs(e.dateKey, "YYYY-MM-DD").toDate())}
                      style={{ cursor: "pointer" }}
                    >
                      <List.Item.Meta
                        title={
                          <div className="diary-ui__entryTitle">
                            <span>{e.dateKey}</span>
                            {meta ? (
                              <Tag>
                                {Icon ? <Icon size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} /> : null}
                                {meta.label}
                              </Tag>
                            ) : null}
                          </div>
                        }
                        description={
                          <div className="diary-ui__entryDesc">
                            <div className="diary-ui__entrySummary">{e.summary || "(요약 없음)"}</div>
                            <Text type="secondary">
                              업데이트: {e.updatedAt ? dayjs(e.updatedAt).format("MM/DD HH:mm") : "-"}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
