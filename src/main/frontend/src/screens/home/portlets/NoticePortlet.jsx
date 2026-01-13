import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Space, Tag, Tooltip } from "antd";
import { Pin, PinOff, Plus, CheckCircle2 } from "lucide-react";
import {
  addNotice,
  getNotices,
  seedNoticesIfEmpty,
  toggleNoticePinned,
  markNoticeRead,
} from "./noticeMockStore";

function fmtYmd(ts) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function NoticePortlet() {
  const [ver, setVer] = useState(0);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({ title: "", body: "" });

  useEffect(() => {
    seedNoticesIfEmpty();
  }, []);

  const rows = useMemo(() => {
    const all = getNotices();
    const qq = q.trim().toLowerCase();

    let list = all;
    if (qq) {
      list = list.filter((n) => {
        const t = (n.title || "").toLowerCase();
        const b = (n.body || "").toLowerCase();
        return t.includes(qq) || b.includes(qq);
      });
    }

    return list
      .slice()
      .sort((a, b) => {
        const pa = a.pinned ? 0 : 1;
        const pb = b.pinned ? 0 : 1;
        if (pa !== pb) return pa - pb;
        return (b.createdAt || 0) - (a.createdAt || 0);
      })
      .slice(0, 8);
  }, [q, ver]);

  const submit = () => {
    const title = form.title.trim();
    if (!title) return;

    addNotice({
      title,
      body: (form.body || "").trim(),
    });

    setVer((v) => v + 1);
    setOpen(false);
    setForm({ title: "", body: "" });
  };

  const togglePin = (id) => {
    toggleNoticePinned(id);
    setVer((v) => v + 1);
  };

  const markRead = (id) => {
    markNoticeRead(id);
    setVer((v) => v + 1);
  };

  return (
    <div>
      <div className="noticeTop">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="검색(제목/내용)"
          size="small"
          allowClear
        />
        <Button size="small" type="primary" icon={<Plus size={16} />} onClick={() => setOpen(true)}>
          추가
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="hd-empty">공지 항목이 없습니다.</div>
      ) : (
        <div className="noticeList">
          {rows.map((n) => (
            <div key={n.id} className="noticeRow">
              <div style={{ minWidth: 0 }}>
                <div className="noticeTitle">{n.title}</div>
                <div className="noticeMeta">
                  <span>{fmtYmd(n.createdAt || Date.now())}</span>
                  {n.pinned ? <Tag>핀</Tag> : null}
                  {n.read ? null : <Tag color="blue">NEW</Tag>}
                </div>
                {n.body ? <div className="noticeBody">{n.body}</div> : null}
              </div>

              <Space size={6}>
                {!n.read ? (
                  <Tooltip title="읽음 처리">
                    <Button
                      size="small"
                      type="text"
                      icon={<CheckCircle2 size={16} />}
                      onClick={() => markRead(n.id)}
                    />
                  </Tooltip>
                ) : null}

                <Tooltip title={n.pinned ? "핀 해제" : "핀 고정"}>
                  <Button
                    size="small"
                    type="text"
                    icon={n.pinned ? <Pin size={16} /> : <PinOff size={16} />}
                    onClick={() => togglePin(n.id)}
                  />
                </Tooltip>
              </Space>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="공지 추가 (UI 데모)"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        okText="저장"
        cancelText="취소"
      >
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 6 }}>
              제목
            </div>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="예) v0.3 업데이트 안내"
            />
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 6 }}>
              내용(선택)
            </div>
            <Input.TextArea
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="예) 대시보드 포틀릿 크기 제한 기능이 추가되었습니다."
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </div>
        </Space>
      </Modal>
    </div>
  );
}
