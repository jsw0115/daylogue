// FILE: src/main/frontend/src/components/timebar/TimeEntryFormModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  normalizeTimeEntry,
  parseHHMMToMinutes,
  minutesToHHMM,
  snapMinutes,
} from "../../shared/utils/timeEntryStore";

export default function TimeEntryFormModal({
  open,
  onClose,
  dateKey,
  initialEntry,
  events = [],
  onSave,
  onDelete,
  readOnly = false,
}) {
  const isEdit = Boolean(initialEntry?.id);

  const [type, setType] = useState("actual");
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("09:30");
  const [snap15, setSnap15] = useState(true);
  const [linkEventId, setLinkEventId] = useState("");

  useEffect(() => {
    if (!open) return;
    const e = initialEntry || null;
    setType(e?.type === "plan" ? "plan" : "actual");
    setTitle(String(e?.title ?? ""));
    setCategoryId(e?.categoryId ? String(e.categoryId) : "");
    setDescription(String(e?.description ?? ""));
    setStart(String(e?.start ?? "09:00"));
    setEnd(String(e?.end ?? "09:30"));
    setLinkEventId(String(e?.link?.eventId ?? ""));
    setSnap15(true);
  }, [open, initialEntry]);

  const eventOptions = useMemo(() => {
    const list = Array.isArray(events) ? events : [];
    return list.map((e) => ({
      id: String(e.id),
      title: String(e?.title ?? "(제목 없음)"),
      start: String(e?.start ?? ""),
      end: String(e?.end ?? ""),
    }));
  }, [events]);

  const error = useMemo(() => {
    const s = parseHHMMToMinutes(start);
    const en = parseHHMMToMinutes(end);
    if (s == null || en == null) return "시작/종료 시간을 확인해 주세요.";
    if (en <= s) return "종료 시간이 시작 시간보다 늦어야 합니다.";
    return "";
  }, [start, end]);

  const applySnap = (nextStart, nextEnd) => {
    const s = parseHHMMToMinutes(nextStart);
    const e = parseHHMMToMinutes(nextEnd);
    if (s == null || e == null) return { nextStart, nextEnd };
    const ns = snap15 ? snapMinutes(s, 15) : s;
    const ne = snap15 ? snapMinutes(e, 15) : e;
    const fixedEnd = Math.max(ne, ns + 1);
    return { nextStart: minutesToHHMM(ns), nextEnd: minutesToHHMM(fixedEnd) };
  };

  const handleSave = () => {
    if (readOnly) return;
    if (error) return;

    const base = initialEntry || {};
    const snapped = applySnap(start, end);

    const payload = normalizeTimeEntry(dateKey, {
      ...base,
      type,
      title,
      categoryId,
      description,
      start: snapped.nextStart,
      end: snapped.nextEnd,
      link: { ...(base?.link || {}), eventId: linkEventId || "" },
      source: base?.source || "manual",
    });

    onSave?.(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{readOnly ? "타임블록 보기" : isEdit ? "타임블록 편집" : "타임블록 추가"}</DialogTitle>

      <DialogContent sx={{ display: "grid", gap: 1.5, pt: 1 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>유형</InputLabel>
            <Select
              label="유형"
              value={type}
              disabled={readOnly}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="plan">Plan</MenuItem>
              <MenuItem value="actual">Actual</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={<Switch checked={snap15} onChange={(e) => setSnap15(e.target.checked)} />}
            label="15분 스냅"
            disabled={readOnly}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <TextField
            size="small"
            label="시작"
            value={start}
            disabled={readOnly}
            onChange={(e) => setStart(e.target.value)}
            placeholder="09:00"
          />
          <TextField
            size="small"
            label="종료"
            value={end}
            disabled={readOnly}
            onChange={(e) => setEnd(e.target.value)}
            placeholder="09:30"
          />
        </div>

        <TextField
          size="small"
          label="제목"
          value={title}
          disabled={readOnly}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 개발 / 운동 / 회의"
        />

        <TextField
          size="small"
          label="카테고리 ID(옵션)"
          value={categoryId}
          disabled={readOnly}
          onChange={(e) => setCategoryId(e.target.value)}
          placeholder="예: work / study / health"
        />

        <TextField
          size="small"
          label="설명(옵션)"
          value={description}
          disabled={readOnly}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={3}
          placeholder="메모를 남길 수 있어요."
        />

        <Divider />

        <FormControl size="small">
          <InputLabel>연결된 일정(옵션)</InputLabel>
          <Select
            label="연결된 일정(옵션)"
            value={linkEventId}
            disabled={readOnly}
            onChange={(e) => setLinkEventId(e.target.value)}
          >
            <MenuItem value="">(없음)</MenuItem>
            {eventOptions.map((o) => (
              <MenuItem key={o.id} value={o.id}>
                {o.title} {o.start && o.end ? `(${o.start}~${o.end})` : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {error ? <div style={{ color: "var(--color-danger, #ef4444)", fontSize: 12 }}>{error}</div> : null}
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, display: "flex", justifyContent: "space-between" }}>
        <div>
          {!readOnly && isEdit ? (
            <Button
              color="error"
              variant="outlined"
              onClick={() => onDelete?.(initialEntry?.id)}
            >
              삭제
            </Button>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outlined" onClick={onClose}>닫기</Button>
          {!readOnly ? (
            <Button variant="contained" onClick={handleSave} disabled={Boolean(error)}>
              저장
            </Button>
          ) : null}
        </div>
      </DialogActions>
    </Dialog>
  );
}
