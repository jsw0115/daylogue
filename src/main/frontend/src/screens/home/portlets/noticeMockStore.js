import { safeStorage } from "../../../shared/utils/safeStorage";

const KEY = "notices.mock.v1";

function nid() {
  return `not_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getNotices() {
  return safeStorage.getJSON(KEY, []);
}

export function saveNotices(list) {
  safeStorage.setJSON(KEY, list);
}

export function seedNoticesIfEmpty() {
  const cur = getNotices();
  if (cur.length) return;

  const now = Date.now();
  const demo = [
    {
      id: nid(),
      title: "대시보드 포틀릿 리사이즈 규칙 적용",
      body: "포틀릿별 최소/최대 크기를 강제합니다. (월간 캘린더는 스크롤 방지용 높이 고정)",
      pinned: true,
      read: false,
      createdAt: now - 1000 * 60 * 60 * 24 * 1,
    },
    {
      id: nid(),
      title: "공지 포틀릿 추가",
      body: "중요 공지/업데이트 메시지를 홈에서 바로 확인할 수 있습니다.",
      pinned: false,
      read: false,
      createdAt: now - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: nid(),
      title: "오늘의 루틴 달성 포틀릿 추가",
      body: "오늘 루틴 체크/진행률을 홈에서 확인할 수 있습니다.",
      pinned: false,
      read: true,
      createdAt: now - 1000 * 60 * 60 * 24 * 3,
    },
  ];

  saveNotices(demo);
}

export function addNotice(payload) {
  const list = getNotices();
  const next = [
    {
      id: nid(),
      title: "",
      body: "",
      pinned: false,
      read: false,
      createdAt: Date.now(),
      ...payload,
    },
    ...list,
  ];
  saveNotices(next);
  return next;
}

export function toggleNoticePinned(id) {
  const list = getNotices();
  const next = list.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
  saveNotices(next);
  return next;
}

export function markNoticeRead(id) {
  const list = getNotices();
  const next = list.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotices(next);
  return next;
}
