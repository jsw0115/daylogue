// FILE: src/main/frontend/src/screens/plan/_components/EventList.jsx
import React from "react";
import { ButtonBase, Box, Chip, Tooltip, IconButton } from "@mui/material";
import { Repeat2, Users, Star, Flag, Clock } from "lucide-react";
import { getDdayLeft } from "../plannerUiUtils";

function VisibilityChip({ visibility }) {
  if (!visibility) return null;
  const map = {
    public: "모두",
    attendees: "참석자만",
    busy: "바쁨만",
    private: "나만",
  };
  const label = map[String(visibility)] ?? String(visibility);
  return <Chip size="small" label={label} variant="outlined" />;
}

export default function EventList({
  events,
  dateKey,
  onClickEvent,
  onPinToTimebar, // 추가: 이벤트→타임바 Plan 저장
  emptyText = "등록된 일정이 없습니다.",
}) {
  const list = Array.isArray(events) ? events : [];

  if (!list.length) {
    return <div className="text-muted font-small">{emptyText}</div>;
  }

  return (
    <Box sx={{ display: "grid", gap: 1 }}>
      {list.map((e) => {
        const sharedCnt = Array.isArray(e?.sharedUserIds) ? e.sharedUserIds.length : 0;
        const isRepeat = Boolean(e?.isOccurrence ?? e?.repeatRule ?? false);
        const isBookmarked = Boolean(e?.bookmarked ?? e?.isBookmarked ?? false);
        const importance = Number.isFinite(Number(e?.importance)) ? Number(e.importance) : null;

        const ddayEnabled = Boolean(e?.ddayEnabled ?? e?.isDday ?? false);
        const ddayLeft = ddayEnabled ? getDdayLeft(e, dateKey) : null;

        const color = e?.colorHex ?? e?.color ?? null;
        const borderColor = color ? color : "rgba(226,232,240,1)";
        const bg = color ? `${color}12` : "rgba(248,250,252,1)";

        const canPin = Boolean(e?.start && e?.end); // HH:mm 있을 때만

        return (
          <div key={e.id} style={{ position: "relative" }}>
            <ButtonBase
              onClick={() => onClickEvent?.(e)}
              style={{
                width: "100%",
                textAlign: "left",
                borderRadius: 12,
                border: `1px solid ${borderColor}`,
                background: bg,
                padding: "10px 12px",
                display: "grid",
                gap: 6,
                justifyItems: "stretch",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {e.title}
                </div>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {importance != null ? (
                    <Tooltip title={`중요도 ${importance}`}>
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        <Flag size={14} />
                      </span>
                    </Tooltip>
                  ) : null}

                  {isBookmarked ? (
                    <Tooltip title="북마크">
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        <Star size={14} />
                      </span>
                    </Tooltip>
                  ) : null}

                  {sharedCnt ? (
                    <Tooltip title={`공유 ${sharedCnt}`}>
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        <Users size={14} />
                      </span>
                    </Tooltip>
                  ) : null}

                  {isRepeat ? (
                    <Tooltip title="반복">
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        <Repeat2 size={14} />
                      </span>
                    </Tooltip>
                  ) : null}

                  {ddayEnabled && ddayLeft != null ? (
                    <Chip
                      size="small"
                      label={ddayLeft === 0 ? "D-Day" : ddayLeft > 0 ? `D-${ddayLeft}` : `D+${Math.abs(ddayLeft)}`}
                    />
                  ) : null}

                  <VisibilityChip visibility={e?.visibility} />
                </Box>
              </Box>

              <div className="text-muted font-small">
                {e.start}~{e.end}
                {e?.timeZone ? ` · ${e.timeZone}` : ""}
                {e?.location ? ` · ${e.location}` : ""}
              </div>
            </ButtonBase>

            {canPin ? (
              <Tooltip title="이 일정을 타임바 Plan(저장)으로 추가">
                <IconButton
                  size="small"
                  onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    onPinToTimebar?.(e);
                  }}
                  style={{ position: "absolute", right: 8, bottom: 8 }}
                >
                  <Clock size={18} />
                </IconButton>
              </Tooltip>
            ) : null}
          </div>
        );
      })}
    </Box>
  );
}
