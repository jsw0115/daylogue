import React, { useMemo } from "react";
import { TextField, MenuItem, FormControl, Select, InputLabel, Chip, Box, IconButton, Tooltip } from "@mui/material";
import { X, Filter, Star, Users, AlarmClock } from "lucide-react";
import { buildCategoryOptions } from "../plannerUiUtils";

export default function EventQueryBar({
  eventsSource,
  value,
  onChange,
  dense = false,
}) {
  const v = value ?? {};
  const categories = useMemo(() => buildCategoryOptions(eventsSource), [eventsSource]);

  const set = (patch) => onChange?.({ ...v, ...patch });

  const activeChips = [
    v.onlyDday ? { key: "dday", label: "D-Day" } : null,
    v.onlyBookmarked ? { key: "bm", label: "북마크" } : null,
    v.onlyShared ? { key: "sh", label: "공유" } : null,
    v.categoryId && v.categoryId !== "all" ? { key: "cat", label: `카테고리: ${v.categoryId}` } : null,
    v.visibility && v.visibility !== "all" ? { key: "vis", label: `공개: ${v.visibility}` } : null,
    v.keyword ? { key: "kw", label: `검색: ${v.keyword}` } : null,
  ].filter(Boolean);

  const height = dense ? 36 : 40;

  return (
    <Box sx={{ display: "grid", gap: 1 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 1, alignItems: "center" }}>
        <TextField
          size={dense ? "small" : "medium"}
          placeholder="제목/메모/태그/참석자 검색"
          value={v.keyword ?? ""}
          onChange={(e) => set({ keyword: e.target.value })}
          sx={{
            "& .MuiInputBase-root": { height },
          }}
        />

        <FormControl size={dense ? "small" : "medium"}>
          <InputLabel>정렬</InputLabel>
          <Select
            label="정렬"
            value={v.sortKey ?? "priority"}
            onChange={(e) => set({ sortKey: e.target.value })}
            sx={{ height }}
          >
            <MenuItem value="priority">우선순위</MenuItem>
            <MenuItem value="start">시작시간</MenuItem>
            <MenuItem value="importance">중요도</MenuItem>
          </Select>
        </FormControl>

        <FormControl size={dense ? "small" : "medium"}>
          <InputLabel>카테고리</InputLabel>
          <Select
            label="카테고리"
            value={v.categoryId ?? "all"}
            onChange={(e) => set({ categoryId: e.target.value })}
            sx={{ height }}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Tooltip title="D-Day만">
          <IconButton size="small" onClick={() => set({ onlyDday: !v.onlyDday })}>
            <AlarmClock size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="북마크만">
          <IconButton size="small" onClick={() => set({ onlyBookmarked: !v.onlyBookmarked })}>
            <Star size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="공유 일정만">
          <IconButton size="small" onClick={() => set({ onlyShared: !v.onlyShared })}>
            <Users size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="필터(공개범위)">
          <IconButton size="small">
            <Filter size={18} />
          </IconButton>
        </Tooltip>

        <FormControl size={dense ? "small" : "medium"} sx={{ minWidth: 160 }}>
          <InputLabel>공개범위</InputLabel>
          <Select
            label="공개범위"
            value={v.visibility ?? "all"}
            onChange={(e) => set({ visibility: e.target.value })}
            sx={{ height }}
          >
            <MenuItem value="all">전체</MenuItem>
            <MenuItem value="public">모두</MenuItem>
            <MenuItem value="attendees">참석자만</MenuItem>
            <MenuItem value="busy">바쁨만</MenuItem>
            <MenuItem value="private">나만</MenuItem>
          </Select>
        </FormControl>

        {activeChips.length ? (
          <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", alignItems: "center" }}>
            {activeChips.map((c) => (
              <Chip key={c.key} size="small" label={c.label} />
            ))}
            <Chip
              size="small"
              label="초기화"
              onClick={() =>
                onChange?.({
                  keyword: "",
                  sortKey: "priority",
                  categoryId: "all",
                  visibility: "all",
                  onlyDday: false,
                  onlyBookmarked: false,
                  onlyShared: false,
                })
              }
              deleteIcon={<X size={14} />}
              onDelete={() =>
                onChange?.({
                  keyword: "",
                  sortKey: "priority",
                  categoryId: "all",
                  visibility: "all",
                  onlyDday: false,
                  onlyBookmarked: false,
                  onlyShared: false,
                })
              }
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
