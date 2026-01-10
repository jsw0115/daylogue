// FILE: src/main/frontend/src/services/localMockApi.js
// 로컬 개발용 Mock API (localStorage 기반 + 차단 시 메모리 폴백)
// - localStorage 접근이 막힌 환경(iframe sandbox/스토리지 차단 등)에서도 화면이 죽지 않게 방어

const DB_KEY = "timeflow_mock_db_v1";

/** =========================
 *  Storage Safe Layer
 *  ========================= */
const memoryStore = new Map();
let warnedStorageBlocked = false;

function safeGetStorage() {
  // localStorage "프로퍼티 읽기" 자체가 SecurityError를 던질 수 있어서 try/catch로 감싼다.
  try {
    const ls = window.localStorage;
    // 접근 가능 여부를 실제로 확인 (일부 브라우저는 getItem까지는 되는데 setItem에서 터지기도 함)
    const k = "__tf_storage_test__";
    ls.setItem(k, "1");
    ls.removeItem(k);
    return ls;
  } catch (e) {
    if (!warnedStorageBlocked) {
      warnedStorageBlocked = true;
      // 콘솔 경고만 남김 (사용자에게 알림은 화면에서 필요 시 처리)
      // eslint-disable-next-line no-console
      console.warn("[MockApi] localStorage blocked. Fallback to in-memory store.", e);
    }
    return null;
  }
}

function storageGetItem(key) {
  const ls = safeGetStorage();
  if (ls) return ls.getItem(key);
  return memoryStore.get(key) ?? null;
}

function storageSetItem(key, value) {
  const ls = safeGetStorage();
  if (ls) ls.setItem(key, value);
  else memoryStore.set(key, value);
}

/** =========================
 *  Helpers
 *  ========================= */
function nowIso() {
  return new Date().toISOString();
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function parseYmdToLocalDate(ymd) {
  const [yy, mm, dd] = String(ymd || "").slice(0, 10).split("-").map((x) => parseInt(x, 10));
  if (!yy || !mm || !dd) return new Date();
  return new Date(yy, mm - 1, dd, 0, 0, 0, 0);
}

function rangeByScope(scope, baseDateYmd) {
  const d = parseYmdToLocalDate(baseDateYmd);
  const start = new Date(d);
  const end = new Date(d);

  if (scope === "DAY") {
    end.setDate(end.getDate() + 1);
    return { start, end };
  }
  if (scope === "WEEK") {
    // 월요일 시작
    const dow = (start.getDay() + 6) % 7; // Mon=0
    start.setDate(start.getDate() - dow);
    end.setTime(start.getTime());
    end.setDate(end.getDate() + 7);
    return { start, end };
  }
  if (scope === "MONTH") {
    start.setDate(1);
    end.setMonth(end.getMonth() + 1, 1);
    return { start, end };
  }
  // YEAR
  start.setMonth(0, 1);
  end.setFullYear(end.getFullYear() + 1, 0, 1);
  return { start, end };
}

function computeWorkCompare(db, { scope, baseDate, filters }) {
  const baseYmd = String(baseDate || "").slice(0, 10);
  const { start, end } = rangeByScope(scope, baseYmd);

  const f = filters || {};
  const includeNonWork = !!f.includeNonWork;
  const includeUnclassified = f.includeUnclassified !== false;

  const blocks = (db.timeBlocks || []).filter((b) => {
    const dt = new Date(b.date);
    if (!(dt >= start && dt < end)) return false;

    // 업무 외 제외
    if (!includeNonWork && b.categoryMain !== "업무") return false;

    // 하위카테고리 필터
    if (f.subCategoryId && f.subCategoryId !== "ALL") {
      if (b.subCategoryId !== f.subCategoryId) return false;
    }

    // 프로젝트 필터
    if (f.projectId && f.projectId !== "ALL") {
      if (b.projectId !== f.projectId) return false;
    }

    // 업무유형 필터
    if (f.workType && f.workType !== "ALL") {
      if (b.workType !== f.workType) return false;
    }

    // 미분류 제외
    const unclassified = !b.projectId || !b.workType || !b.subCategoryId;
    if (!includeUnclassified && unclassified) return false;

    return true;
  });

  const toHours = (min) => Math.round((min / 60) * 10) / 10;

  const sumPlan = blocks.reduce((a, b) => a + (b.planMinutes || 0), 0);
  const sumActual = blocks.reduce((a, b) => a + (b.actualMinutes || 0), 0);

  const planTotal = toHours(sumPlan);
  const actualTotal = toHours(sumActual);
  const rate = planTotal === 0 ? 0 : Math.round((actualTotal / planTotal) * 100);

  const projectsMap = new Map();
  const typesMap = new Map();
  const subMap = new Map();

  const projName = (id) => (db.workMeta?.projects || []).find((p) => p.id === id)?.name || "미지정";
  const typeName = (code) => (db.workMeta?.workTypes || []).find((t) => t.code === code)?.label || "미지정";
  const subName = (sid, fallback) => {
    if (!sid) return "미분류";
    const work = (db.categories || []).find((c) => c.name === "업무" || c.type === "업무");
    const hit = (work?.children || []).find((x) => x.id === sid);
    return hit?.name || fallback || "미분류";
  };

  blocks.forEach((b) => {
    const pKey = b.projectId || "NONE";
    const tKey = b.workType || "NONE";
    const sKey = b.subCategoryId || "NONE";

    const add = (map, key, name) => {
      const cur = map.get(key) || { key, name, planMinutes: 0, actualMinutes: 0 };
      cur.planMinutes += b.planMinutes || 0;
      cur.actualMinutes += b.actualMinutes || 0;
      map.set(key, cur);
    };

    add(projectsMap, pKey, projName(b.projectId));
    add(typesMap, tKey, typeName(b.workType));
    add(subMap, sKey, subName(b.subCategoryId, b.subCategoryName));
  });

  const toRows = (map) => {
    const rows = Array.from(map.values()).map((x) => {
      const ph = toHours(x.planMinutes);
      const ah = toHours(x.actualMinutes);
      return {
        key: x.key,
        name: x.name,
        planHours: ph,
        actualHours: ah,
        rate: ph === 0 ? 0 : Math.round((ah / ph) * 100),
      };
    });
    rows.sort((a, b) => (b.actualHours || 0) - (a.actualHours || 0));
    return rows;
  };

  return {
    scope,
    baseDate: baseYmd,
    summary: { planTotal, actualTotal, rate },
    byProject: toRows(projectsMap),
    byType: toRows(typesMap),
    bySubCategory: toRows(subMap),
    disclaimer:
      "현재는 Mock timeBlocks 기반 집계입니다. 실제 서비스에서는 타임바/할일/권한/마스킹 기준으로 서버 집계가 필요합니다.",
    _blocks: blocks, // 내부용(초안 생성에 근거 링크 수집)
  };
}


/** =========================
 *  DB Load/Save
 *  ========================= */
function loadDb() {
  const raw = storageGetItem(DB_KEY);
  const db = safeJsonParse(raw, null);
  if (db) return db;

  const seeded = seedDb();
  saveDb(seeded);
  return seeded;
}

function saveDb(db) {
  storageSetItem(DB_KEY, JSON.stringify(db));
}

function seedDb() {
  const g1 = {
    id: uid("grp"),
    name: "아침 30분 운동 인증",
    category: "운동",
    description: "매일 아침 30분 운동 인증해요. 부담 없이 시작.",
    rules: "1) 하루 1회 인증\n2) 서로 비방 금지\n3) 광고 금지",
    maxMembers: 50,
    requireApproval: true,
    isPublic: true,
    recruitEndDate: null,
    createdAt: nowIso(),
    ownerUserId: "me",
    ownerName: "나",
    memberCount: 12,
    pinnedNotice: "환영합니다. 가입 신청 시 간단 소개 부탁해요.",
  };

  const g2 = {
    id: uid("grp"),
    name: "퇴근 후 1시간 공부",
    category: "공부",
    description: "퇴근 후 1시간만. 인증/루틴 공유/피드백.",
    rules: "1) 인증은 간단히\n2) 질문은 예의있게\n3) 무단 홍보 금지",
    maxMembers: 100,
    requireApproval: false,
    isPublic: true,
    recruitEndDate: null,
    createdAt: nowIso(),
    ownerUserId: "me",
    ownerName: "나",
    memberCount: 34,
    pinnedNotice: "오늘 공부 계획을 댓글로 남겨보세요.",
  };

  const meMember = (groupId, role) => ({
    id: uid("mem"),
    groupId,
    userId: "me",
    userName: "나",
    role, // OWNER | MOD | MEMBER
    joinedAt: nowIso(),
  });

  const members = [
    meMember(g1.id, "OWNER"),
    meMember(g2.id, "OWNER"),
    {
      id: uid("mem"),
      groupId: g1.id,
      userId: "u1",
      userName: "민수",
      role: "MEMBER",
      joinedAt: nowIso(),
    },
    {
      id: uid("mem"),
      groupId: g1.id,
      userId: "u2",
      userName: "지연",
      role: "MOD",
      joinedAt: nowIso(),
    },
  ];

  const posts = [
    {
      id: uid("post"),
      groupId: g1.id,
      authorUserId: "u1",
      authorName: "민수",
      type: "checkin", // general | checkin
      content: "오늘은 스트레칭 10분 + 스쿼트 50개 완료",
      tags: ["#운동", "#아침루틴"],
      likeCount: 2,
      likedByMe: false,
      commentCount: 1,
      pinned: false,
      createdAt: nowIso(),
    },
    {
      id: uid("post"),
      groupId: g2.id,
      authorUserId: "u3",
      authorName: "서연",
      type: "general",
      content: "오늘은 CS 1장 정리했어요. 내일은 네트워크!",
      tags: ["#공부", "#CS"],
      likeCount: 1,
      likedByMe: true,
      commentCount: 0,
      pinned: true,
      createdAt: nowIso(),
    },
  ];

  const chats = [
    {
      id: uid("msg"),
      groupId: g1.id,
      senderUserId: "system",
      senderName: "SYSTEM",
      system: true,
      text: "커뮤니티 채팅에 오신 것을 환영합니다.",
      createdAt: nowIso(),
    },
    {
      id: uid("msg"),
      groupId: g1.id,
      senderUserId: "u2",
      senderName: "지연",
      system: false,
      text: "오늘 인증 올리신 분들 최고",
      createdAt: nowIso(),
    },
  ];

  const joinRequests = [
    {
      id: uid("req"),
      groupId: g1.id,
      requesterUserId: "u9",
      requesterName: "현우",
      message: "아침 루틴 만들고 싶어서 신청합니다.",
      status: "PENDING", // PENDING | APPROVED | REJECTED | EXPIRED
      createdAt: nowIso(),
      handledAt: null,
      handledBy: null,
    },
  ];

  const categories = [
    {
      id: uid("cat"),
      type: "업무",
      name: "업무",
      color: "#3b82f6",
      icon: "💼",
      children: [
        { id: uid("sub"), name: "프로젝트", color: "#60a5fa", icon: "📌" },
        { id: uid("sub"), name: "회의", color: "#93c5fd", icon: "🗣️" },
        { id: uid("sub"), name: "표준", color: "#bfdbfe", icon: "📘" },
      ],
    },
    {
      id: uid("cat"),
      type: "공부",
      name: "공부",
      color: "#22c55e",
      icon: "📚",
      children: [],
    },
    {
      id: uid("cat"),
      type: "휴식",
      name: "휴식",
      color: "#f59e0b",
      icon: "☕",
      children: [],
    },
  ];

  const goalsByYear = {};

    /** ===== Work Meta / TimeBlocks (Mock) ===== */
  const workMeta = {
    projects: [
      { id: "p1", name: "고객사 A(운영)" },
      { id: "p2", name: "프로젝트 B(개선)" },
      { id: "p3", name: "사내 표준/문서" },
    ],
    workTypes: [
      { code: "PROJECT", label: "프로젝트" },
      { code: "MEETING", label: "회의" },
      { code: "STANDARD", label: "표준" },
      { code: "VOC", label: "VOC/운영" },
      { code: "DOC", label: "문서화" },
    ],
  };

  // 실제론 타임바(Actual)와 Plan이 별도 엔티티일 수 있음.
  // 여기서는 timeBlocks 한 곳에 actualMinutes/planMinutes를 함께 둔 단순 Mock.
  const today = new Date();
  const mkDate = (offsetDays) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offsetDays);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const findSub = (name) => (categories.find((c) => c.name === "업무")?.children || []).find((s) => s.name === name);

  const subProject = findSub("프로젝트");
  const subMeeting = findSub("회의");
  const subStandard = findSub("표준");

  const timeBlocks = [
    {
      id: uid("tb"),
      date: mkDate(0).toISOString(), // 오늘
      categoryMain: "업무",
      subCategoryId: subProject?.id || null,
      subCategoryName: "프로젝트",
      projectId: "p2",
      workType: "PROJECT",
      memo: "기능 개선 작업",
      actualMinutes: 180,
      planMinutes: 150,
      links: ["https://example.com/pr/123"],
    },
    {
      id: uid("tb"),
      date: mkDate(0).toISOString(),
      categoryMain: "업무",
      subCategoryId: subMeeting?.id || null,
      subCategoryName: "회의",
      projectId: "p2",
      workType: "MEETING",
      memo: "주간 회의 / 액션아이템 정리",
      actualMinutes: 60,
      planMinutes: 60,
      links: [],
    },
    {
      id: uid("tb"),
      date: mkDate(1).toISOString(), // 어제
      categoryMain: "업무",
      subCategoryId: subStandard?.id || null,
      subCategoryName: "표준",
      projectId: "p3",
      workType: "STANDARD",
      memo: "표준 문서 정리",
      actualMinutes: 90,
      planMinutes: 120,
      links: ["https://example.com/doc/standard"],
    },
    {
      id: uid("tb"),
      date: mkDate(2).toISOString(),
      categoryMain: "업무",
      subCategoryId: subProject?.id || null,
      subCategoryName: "프로젝트",
      projectId: "p1",
      workType: "VOC",
      memo: "운영 이슈 대응",
      actualMinutes: 140,
      planMinutes: 120,
      links: [],
    },
    // 미분류(필터 옵션 테스트)
    {
      id: uid("tb"),
      date: mkDate(0).toISOString(),
      categoryMain: "업무",
      subCategoryId: null,
      subCategoryName: null,
      projectId: null,
      workType: null,
      memo: "미분류 작업(태깅 필요)",
      actualMinutes: 45,
      planMinutes: 0,
      links: [],
    },
    // 업무 외(업무 외 포함 토글 테스트)
    {
      id: uid("tb"),
      date: mkDate(0).toISOString(),
      categoryMain: "휴식",
      subCategoryId: null,
      subCategoryName: null,
      projectId: null,
      workType: null,
      memo: "커피/휴식",
      actualMinutes: 30,
      planMinutes: 0,
      links: [],
    },
  ];


  return {
    me: { userId: "me", userName: "나" },
    community: { groups: [g1, g2], members, posts, chats, joinRequests },
    categories,
    goalsByYear,
    workReports: {},
    stats: {},
    aiReports: {},
    workMeta,
    timeBlocks,
  };
}

function delay(ms = 120) {
  return new Promise((r) => setTimeout(r, ms));
}

/** 권한 유틸 */
function getMyRole(db, groupId) {
  const me = db.me?.userId || "me";
  const m = db.community.members.find((x) => x.groupId === groupId && x.userId === me);
  return m?.role || null;
}

function isMember(db, groupId) {
  return !!getMyRole(db, groupId);
}

function canManageGroup(db, groupId) {
  const role = getMyRole(db, groupId);
  return role === "OWNER" || role === "MOD";
}

function normalizeGroupComputed(db, g) {
  const memberCount = db.community.members.filter((m) => m.groupId === g.id).length;
  return { ...g, memberCount };
}

/** Community API */
export const communityApi = {
  async listGroups({ q = "", category = "ALL" } = {}) {
    await delay();
    const db = loadDb();
    const qq = q.trim().toLowerCase();
    let list = db.community.groups.map((g) => normalizeGroupComputed(db, g));
    if (category !== "ALL") list = list.filter((g) => g.category === category);
    if (qq) list = list.filter((g) => (g.name + " " + g.description).toLowerCase().includes(qq));
    list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return list;
  },

  async getGroup(groupId) {
    await delay();
    const db = loadDb();
    const g = db.community.groups.find((x) => x.id === groupId);
    if (!g) return null;
    return normalizeGroupComputed(db, g);
  },

  async createGroup(payload) {
    await delay();
    const db = loadDb();
    const g = {
      id: uid("grp"),
      createdAt: nowIso(),
      ownerUserId: db.me.userId,
      ownerName: db.me.userName,
      memberCount: 1,
      pinnedNotice: "",
      ...payload,
    };
    db.community.groups.push(g);
    db.community.members.push({
      id: uid("mem"),
      groupId: g.id,
      userId: db.me.userId,
      userName: db.me.userName,
      role: "OWNER",
      joinedAt: nowIso(),
    });
    saveDb(db);
    return normalizeGroupComputed(db, g);
  },

  async updateGroup(groupId, patch) {
    await delay();
    const db = loadDb();
    const idx = db.community.groups.findIndex((x) => x.id === groupId);
    if (idx < 0) throw new Error("GroupNotFound");
    db.community.groups[idx] = { ...db.community.groups[idx], ...patch };
    saveDb(db);
    return normalizeGroupComputed(db, db.community.groups[idx]);
  },

  async listMembers(groupId) {
    await delay();
    const db = loadDb();
    const list = db.community.members
      .filter((m) => m.groupId === groupId)
      .map((m) => ({
        ...m,
        isMe: m.userId === db.me.userId,
      }));
    const rank = { OWNER: 0, MOD: 1, MEMBER: 2 };
    list.sort((a, b) => (rank[a.role] ?? 9) - (rank[b.role] ?? 9));
    return list;
  },

  async updateMemberRole(groupId, memberId, role) {
    await delay();
    const db = loadDb();
    if (!canManageGroup(db, groupId)) throw new Error("Forbidden");

    const meRole = getMyRole(db, groupId);
    const targetIdx = db.community.members.findIndex((m) => m.id === memberId && m.groupId === groupId);
    if (targetIdx < 0) throw new Error("MemberNotFound");

    const target = db.community.members[targetIdx];
    if (target.role === "OWNER" && meRole !== "OWNER") throw new Error("Forbidden");

    db.community.members[targetIdx] = { ...target, role };
    saveDb(db);
    return db.community.members[targetIdx];
  },

  async kickMember(groupId, memberId) {
    await delay();
    const db = loadDb();
    if (!canManageGroup(db, groupId)) throw new Error("Forbidden");

    const meRole = getMyRole(db, groupId);
    const target = db.community.members.find((m) => m.id === memberId && m.groupId === groupId);
    if (!target) throw new Error("MemberNotFound");
    if (target.role === "OWNER") throw new Error("CannotKickOwner");
    if (target.role === "MOD" && meRole !== "OWNER") throw new Error("Forbidden");

    db.community.members = db.community.members.filter((m) => m.id !== memberId);
    saveDb(db);
    return true;
  },

  async createJoinRequest(groupId, { message }) {
    await delay();
    const db = loadDb();
    const g = db.community.groups.find((x) => x.id === groupId);
    if (!g) throw new Error("GroupNotFound");
    if (!g.requireApproval) throw new Error("ApprovalNotRequired");
    if (isMember(db, groupId)) throw new Error("AlreadyMember");

    const req = {
      id: uid("req"),
      groupId,
      requesterUserId: db.me.userId,
      requesterName: db.me.userName,
      message: message || "",
      status: "PENDING",
      createdAt: nowIso(),
      handledAt: null,
      handledBy: null,
    };
    db.community.joinRequests.push(req);

    db.community.chats.push({
      id: uid("msg"),
      groupId,
      senderUserId: "system",
      senderName: "SYSTEM",
      system: true,
      text: `가입 신청이 생성되었습니다. (승인 대기)`,
      createdAt: nowIso(),
    });

    saveDb(db);
    return req;
  },

  async listJoinRequests(groupId, { status = "PENDING" } = {}) {
    await delay();
    const db = loadDb();
    if (!canManageGroup(db, groupId)) throw new Error("Forbidden");
    let list = db.community.joinRequests.filter((r) => r.groupId === groupId);
    if (status !== "ALL") list = list.filter((r) => r.status === status);
    list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return list;
  },

  async approveJoinRequest(groupId, requestId) {
    await delay();
    const db = loadDb();
    if (!canManageGroup(db, groupId)) throw new Error("Forbidden");

    const g = db.community.groups.find((x) => x.id === groupId);
    if (!g) throw new Error("GroupNotFound");

    const reqIdx = db.community.joinRequests.findIndex((r) => r.id === requestId && r.groupId === groupId);
    if (reqIdx < 0) throw new Error("RequestNotFound");

    const memberCount = db.community.members.filter((m) => m.groupId === groupId).length;
    if (g.maxMembers && memberCount >= g.maxMembers) throw new Error("MaxMembersExceeded");

    const req = db.community.joinRequests[reqIdx];
    if (req.status !== "PENDING") throw new Error("InvalidStatus");

    db.community.joinRequests[reqIdx] = {
      ...req,
      status: "APPROVED",
      handledAt: nowIso(),
      handledBy: db.me.userId,
    };

    db.community.members.push({
      id: uid("mem"),
      groupId,
      userId: req.requesterUserId,
      userName: req.requesterName,
      role: "MEMBER",
      joinedAt: nowIso(),
    });

    db.community.chats.push({
      id: uid("msg"),
      groupId,
      senderUserId: "system",
      senderName: "SYSTEM",
      system: true,
      text: `${req.requesterName} 님이 승인되어 커뮤니티에 참여했습니다.`,
      createdAt: nowIso(),
    });

    saveDb(db);
    return db.community.joinRequests[reqIdx];
  },

  async rejectJoinRequest(groupId, requestId, reason = "") {
    await delay();
    const db = loadDb();
    if (!canManageGroup(db, groupId)) throw new Error("Forbidden");

    const reqIdx = db.community.joinRequests.findIndex((r) => r.id === requestId && r.groupId === groupId);
    if (reqIdx < 0) throw new Error("RequestNotFound");
    const req = db.community.joinRequests[reqIdx];
    if (req.status !== "PENDING") throw new Error("InvalidStatus");

    db.community.joinRequests[reqIdx] = {
      ...req,
      status: "REJECTED",
      handledAt: nowIso(),
      handledBy: db.me.userId,
      rejectReason: reason || "",
    };

    db.community.chats.push({
      id: uid("msg"),
      groupId,
      senderUserId: "system",
      senderName: "SYSTEM",
      system: true,
      text: `가입 신청이 거절되었습니다.`,
      createdAt: nowIso(),
    });

    saveDb(db);
    return db.community.joinRequests[reqIdx];
  },

  async listPosts(groupId, { q = "", type = "ALL" } = {}) {
    await delay();
    const db = loadDb();
    const qq = q.trim().toLowerCase();
    let list = db.community.posts.filter((p) => p.groupId === groupId);
    if (type !== "ALL") list = list.filter((p) => p.type === type);
    if (qq) list = list.filter((p) => (p.content + " " + (p.tags || []).join(" ")).toLowerCase().includes(qq));
    list.sort((a, b) => {
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
    return list;
  },

  async createPost(groupId, payload) {
    await delay();
    const db = loadDb();
    if (!isMember(db, groupId)) throw new Error("MemberOnly");
    const post = {
      id: uid("post"),
      groupId,
      authorUserId: db.me.userId,
      authorName: db.me.userName,
      type: payload.type || "general",
      content: payload.content || "",
      tags: payload.tags || [],
      likeCount: 0,
      likedByMe: false,
      commentCount: 0,
      pinned: false,
      createdAt: nowIso(),
    };
    db.community.posts.push(post);
    saveDb(db);
    return post;
  },

  async toggleLike(postId) {
    await delay();
    const db = loadDb();
    const idx = db.community.posts.findIndex((p) => p.id === postId);
    if (idx < 0) throw new Error("PostNotFound");
    const p = db.community.posts[idx];
    const liked = !p.likedByMe;
    const likeCount = Math.max(0, (p.likeCount || 0) + (liked ? 1 : -1));
    db.community.posts[idx] = { ...p, likedByMe: liked, likeCount };
    saveDb(db);
    return db.community.posts[idx];
  },

  async togglePin(groupId, postId) {
    await delay();
    const db = loadDb();
    if (!canManageGroup(db, groupId)) throw new Error("Forbidden");
    const idx = db.community.posts.findIndex((p) => p.id === postId && p.groupId === groupId);
    if (idx < 0) throw new Error("PostNotFound");
    db.community.posts[idx] = { ...db.community.posts[idx], pinned: !db.community.posts[idx].pinned };
    saveDb(db);
    return db.community.posts[idx];
  },

  async listChatMessages(groupId) {
    await delay();
    const db = loadDb();
    if (!isMember(db, groupId)) throw new Error("MemberOnly");
    const list = db.community.chats.filter((m) => m.groupId === groupId);
    list.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
    return list;
  },

  async sendChatMessage(groupId, text) {
    await delay();
    const db = loadDb();
    if (!isMember(db, groupId)) throw new Error("MemberOnly");

    const msg = {
      id: uid("msg"),
      groupId,
      senderUserId: db.me.userId,
      senderName: db.me.userName,
      system: false,
      text: (text || "").slice(0, 1000),
      createdAt: nowIso(),
    };
    db.community.chats.push(msg);
    saveDb(db);
    return msg;
  },

  async joinDirect(groupId) {
    await delay();
    const db = loadDb();
    const g = db.community.groups.find((x) => x.id === groupId);
    if (!g) throw new Error("GroupNotFound");
    if (g.requireApproval) throw new Error("ApprovalRequired");
    if (isMember(db, groupId)) return true;

    const memberCount = db.community.members.filter((m) => m.groupId === groupId).length;
    if (g.maxMembers && memberCount >= g.maxMembers) throw new Error("MaxMembersExceeded");

    db.community.members.push({
      id: uid("mem"),
      groupId,
      userId: db.me.userId,
      userName: db.me.userName,
      role: "MEMBER",
      joinedAt: nowIso(),
    });

    db.community.chats.push({
      id: uid("msg"),
      groupId,
      senderUserId: "system",
      senderName: "SYSTEM",
      system: true,
      text: `${db.me.userName} 님이 커뮤니티에 참여했습니다.`,
      createdAt: nowIso(),
    });

    saveDb(db);
    return true;
  },
};

/** Category API */
export const categoryApi = {
  async listCategories() {
    await delay();
    const db = loadDb();
    return db.categories || [];
  },

  async saveCategory(cat) {
    await delay();
    const db = loadDb();
    const idx = db.categories.findIndex((x) => x.id === cat.id);
    if (idx >= 0) db.categories[idx] = { ...db.categories[idx], ...cat };
    else db.categories.push({ ...cat, id: uid("cat"), children: cat.children || [] });
    saveDb(db);
    return true;
  },

  async deleteCategory(catId) {
    await delay();
    const db = loadDb();
    db.categories = (db.categories || []).filter((c) => c.id !== catId);
    saveDb(db);
    return true;
  },

  async addSubCategory(catId, sub) {
    await delay();
    const db = loadDb();
    const idx = db.categories.findIndex((c) => c.id === catId);
    if (idx < 0) throw new Error("CategoryNotFound");
    const children = db.categories[idx].children || [];
    children.push({ id: uid("sub"), name: sub.name, color: sub.color || "#93c5fd", icon: sub.icon || "📌" });
    db.categories[idx] = { ...db.categories[idx], children };
    saveDb(db);
    return db.categories[idx];
  },

  async updateSubCategory(catId, subId, patch) {
    await delay();
    const db = loadDb();
    const idx = db.categories.findIndex((c) => c.id === catId);
    if (idx < 0) throw new Error("CategoryNotFound");
    const children = (db.categories[idx].children || []).map((s) => (s.id === subId ? { ...s, ...patch } : s));
    db.categories[idx] = { ...db.categories[idx], children };
    saveDb(db);
    return db.categories[idx];
  },

  async deleteSubCategory(catId, subId) {
    await delay();
    const db = loadDb();
    const idx = db.categories.findIndex((c) => c.id === catId);
    if (idx < 0) throw new Error("CategoryNotFound");
    const children = (db.categories[idx].children || []).filter((s) => s.id !== subId);
    db.categories[idx] = { ...db.categories[idx], children };
    saveDb(db);
    return db.categories[idx];
  },

  async moveSubCategory(catId, subId, dir) {
    await delay();
    const db = loadDb();
    const idx = db.categories.findIndex((c) => c.id === catId);
    if (idx < 0) throw new Error("CategoryNotFound");
    const children = [...(db.categories[idx].children || [])];
    const i = children.findIndex((s) => s.id === subId);
    if (i < 0) throw new Error("SubNotFound");
    const j = dir === "UP" ? i - 1 : i + 1;
    if (j < 0 || j >= children.length) return db.categories[idx];
    const tmp = children[i];
    children[i] = children[j];
    children[j] = tmp;
    db.categories[idx] = { ...db.categories[idx], children };
    saveDb(db);
    return db.categories[idx];
  },
};

/** Goals/Review API */
export const goalsApi = {
  async getYearData(year) {
    await delay();
    const db = loadDb();
    const y = String(year);
    return db.goalsByYear?.[y] || null;
  },

  async saveYearData(year, data) {
    await delay();
    const db = loadDb();
    const y = String(year);
    db.goalsByYear = db.goalsByYear || {};
    db.goalsByYear[y] = { ...data, updatedAt: nowIso() };
    saveDb(db);
    return db.goalsByYear[y];
  },
};

/** Work Report API */
export const workApi = {
  async listMeta() {
    await delay();
    const db = loadDb();
    return db.workMeta || { projects: [], workTypes: [] };
  },

  async getReport(key) {
    await delay();
    const db = loadDb();
    return db.workReports?.[key] || null;
  },

  async saveReport(key, report) {
    await delay();
    const db = loadDb();
    db.workReports = db.workReports || {};
    const prev = db.workReports[key] || {};
    db.workReports[key] = {
      ...prev,
      ...report,
      updatedAt: nowIso(),
    };
    saveDb(db);
    return db.workReports[key];
  },

  async confirmReport(key) {
    await delay();
    const db = loadDb();
    db.workReports = db.workReports || {};
    const prev = db.workReports[key] || {};
    db.workReports[key] = {
      ...prev,
      confirmedAt: nowIso(),
      updatedAt: nowIso(),
    };
    saveDb(db);
    return db.workReports[key];
  },

  async unconfirmReport(key) {
    await delay();
    const db = loadDb();
    db.workReports = db.workReports || {};
    const prev = db.workReports[key] || {};
    db.workReports[key] = {
      ...prev,
      confirmedAt: null,
      updatedAt: nowIso(),
    };
    saveDb(db);
    return db.workReports[key];
  },

  async generateDraft({ scope = "DAY", baseDate = nowIso(), filters = {} } = {}) {
    await delay(220);
    const db = loadDb();

    // Stats API와 동일한 계산 로직을 재사용 (순환 참조 피하려고 내부 헬퍼를 여기서 간단 구현)
    const res = computeWorkCompare(db, { scope, baseDate, filters });

    const topProject = (res.byProject || [])[0]?.name || "프로젝트";
    const topType = (res.byType || [])[0]?.name || "업무";
    const { planTotal, actualTotal, rate } = res.summary;

    const summaryLines = [
      `- 핵심: ${topProject} 중심으로 ${topType} 비중이 높았습니다.`,
      `- 공수: Actual ${actualTotal}h / Plan ${planTotal}h (달성 ${rate}%)`,
      `- 이슈: 편차가 큰 항목(프로젝트/유형)을 확인하고 원인/대응을 기록하세요.`,
    ].join("\n");

    const evidenceLinks = collectEvidenceFromBlocks(res._blocks || []);

    const scopeTitle = scope === "DAY" ? "일간" : scope === "WEEK" ? "주간" : scope === "MONTH" ? "월간" : "연간";
    return {
      title: `${scopeTitle} 업무 리포트`,
      summary: summaryLines,
      achievements:
        "## Top 업무(공수 기준)\n" +
        (res.byProject || [])
          .slice(0, 5)
          .map((x) => `- ${x.name}: ${x.actualHours}h`)
          .join("\n") +
        "\n\n## 성과(Deliverables)\n- (예) PR/배포/문서 링크를 근거로 남기기",
      issues:
        "## 이슈/리스크\n- (예) 지연 요인/의존 이슈\n\n## 대응/지원 요청\n- (예) 필요한 지원/결정 사항",
      nextPlan:
        "## 다음 계획\n- (예) 미완료 항목 마무리\n- (예) 우선순위 3개 선정\n\n## 리소스/가정\n- ",
      pvaNote:
        `기간: ${scopeTitle} (${String(baseDate).slice(0, 10)})\n` +
        `계획 시간: ${planTotal}h\n실행 시간: ${actualTotal}h\n달성률: ${rate}%\n` +
        `메모: (차이 원인/방해요인/개선점을 기록)\n- `,
      evidenceLinks,
    };
  },
};

function collectEvidenceFromBlocks(blocks) {
  const list = [];
  (blocks || []).forEach((b) => {
    (b.links || []).forEach((u) => {
      if (!u) return;
      list.push({ id: `ev_${u}`, label: b.memo ? `${b.memo}` : u, url: u });
    });
  });
  // 중복 제거
  const map = new Map();
  list.forEach((x) => {
    const url = String(x.url || "").trim();
    if (!url) return;
    map.set(url, { ...x, url });
  });
  return Array.from(map.values());
}


/** Stats/Compare API */
export const statsApi = {
  async getCompare({ period = "WEEK", baseDate = nowIso() } = {}) {
    await delay();
    const db = loadDb();
    const categories = (db.categories || []).map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color,
      icon: c.icon,
    }));

    const rows = categories.slice(0, 6).map((c) => {
      const plan = Math.floor(2 + Math.random() * 12);
      const actual = Math.max(0, plan + Math.floor(-3 + Math.random() * 7));
      const rate = plan === 0 ? 0 : Math.round((actual / plan) * 100);
      return { ...c, planHours: plan, actualHours: actual, rate };
    });

    return {
      period,
      baseDate,
      rows,
      summary: {
        planTotal: rows.reduce((a, r) => a + r.planHours, 0),
        actualTotal: rows.reduce((a, r) => a + r.actualHours, 0),
      },
    };
  },
    async getWorkCompare({ scope = "WEEK", baseDate = nowIso(), filters = {} } = {}) {
    await delay();
    const db = loadDb();
    const res = computeWorkCompare(db, { scope, baseDate, filters });
    return res;
  },
};

/** AI Report API */
export const aiApi = {
  async generate({ scope = "WEEK", baseDate = nowIso() } = {}) {
    await delay(250);
    const db = loadDb();

    const categories = (db.categories || []).slice(0, 5).map((c) => c.name);
    const groups = (db.community.groups || []).slice(0, 2).map((g) => g.name);

    const nextActions = [
      "내일 아침 30분 루틴을 일정으로 고정하기",
      "업무 하위카테고리(프로젝트/회의)로 기록을 분리해 통계를 명확히 하기",
      "이번 주 미달성 항목 1개만 골라 원인(방해요인)을 기록하기",
    ];

    return {
      scope,
      baseDate,
      title: scope === "YEAR" ? "연간 회고 리포트" : scope === "MONTH" ? "월간 요약 리포트" : "주간 요약 리포트",
      highlights: [
        `최근 자주 사용한 카테고리: ${categories.join(", ") || "데이터 없음"}`,
        `커뮤니티 활동: ${groups.join(", ") || "참여 커뮤니티 없음"}`,
        "패턴: 특정 요일에 몰아치는 경향이 있어 분산 계획이 유리합니다.",
      ],
      insights: [
        "Plan 대비 Actual 변동 폭이 큰 구간이 있습니다. 블록 길이를 더 짧게 쪼개면 유지가 쉽습니다.",
        "업무 기록이 한 카테고리에 뭉쳐있다면 하위 카테고리로 분리하는 것이 리포트 품질을 올립니다.",
      ],
      nextActions,
      disclaimer: "현재 화면용 임시 생성 결과입니다. 실제 AI 요약은 서버 데이터 기반으로 생성되어야 합니다.",
      createdAt: nowIso(),
    };
  },
};
