// 인메모리 데이터 저장소.
// 나중에 Supabase로 갈아끼울 자리 - API 라우트만 이 모듈을 import하고,
// 화면(클라이언트)은 절대 직접 import하지 않는다.

export type UserStatus = "active" | "blocked" | "left";
export type ContentStatus = "public" | "hidden" | "deleted";

export interface User {
  id: string;
  nickname: string;
  email: string;
  joinedAt: number;
  status: UserStatus;
  marketingOptIn: boolean; // 마케팅 수신 동의 (마이페이지에서 토글)
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  body: string;
  createdAt: number;
  edited: boolean;
  status: ContentStatus;
  likes: string[]; // 좋아요 누른 userId 목록 (1인 1회 토글)
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: number;
  status: ContentStatus;
}

export type ReportStatus = "open" | "resolved" | "dismissed";

export interface Report {
  id: string;
  targetType: "post" | "comment";
  targetId: string;
  reporterId: string;
  reason: string; // 스팸·홍보 / 욕설·비방 / 음란물 / 기타
  createdAt: number;
  status: ReportStatus; // open(미처리) → resolved(대상 숨김) | dismissed(기각)
}

export interface AdminLog {
  at: number;
  actor: string;
  action: string;
  target: string;
}

interface DB {
  users: User[];
  posts: Post[];
  comments: Comment[];
  reports: Report[];
  adminLogs: AdminLog[];
  seq: number;
}

const h = 3600_000;
const now = Date.now();

function seed(): DB {
  const users: User[] = [
    { id: "u1", nickname: "졸린 쿠키", email: "me@example.com", joinedAt: now - 240 * h, status: "active", marketingOptIn: false },
    { id: "u2", nickname: "느린 거북", email: "turtle@example.com", joinedAt: now - 700 * h, status: "active", marketingOptIn: true },
    { id: "u3", nickname: "매운 감자", email: "potato@example.com", joinedAt: now - 500 * h, status: "active", marketingOptIn: false },
    { id: "u4", nickname: "조용한 파도", email: "wave@example.com", joinedAt: now - 320 * h, status: "active", marketingOptIn: true },
    { id: "u5", nickname: "바쁜 토끼", email: "rabbit@example.com", joinedAt: now - 100 * h, status: "active", marketingOptIn: false },
  ];
  const P = (id: string, authorId: string, title: string, body: string, ago: number, likes: string[] = []): Post => ({
    id, authorId, title, body, createdAt: now - ago * h, edited: false, status: "public", likes,
  });
  const C = (id: string, postId: string, authorId: string, body: string, ago: number): Comment => ({
    id, postId, authorId, body, createdAt: now - ago * h, status: "public",
  });
  return {
    users,
    posts: [
      P("p1", "u2", "다들 출근길에 뭐 들으세요?", "요즘 팟캐스트 들을 게 없어서 노래만 돌려 듣는데, 추천 좀 받아봅니다. 장르 안 가립니다.", 2, ["u1", "u3"]),
      P("p2", "u3", "근처에 새로 생긴 빵집 후기", "소금빵이 진짜 맛있습니다. 오픈 시간 맞춰 가면 갓 나온 거 살 수 있어요. 주차는 어렵습니다.", 5, ["u2", "u4", "u5"]),
      P("p3", "u1", "첫 글 써봅니다", "가입하고 처음 써보는 글이네요. 잘 부탁드립니다.", 9, ["u2"]),
      P("p4", "u4", "모니터 암 쓰시는 분 계신가요", "책상이 좁아서 고민 중인데 실제로 써보니 어떤지 궁금합니다. 장단점 알려주세요.", 26, []),
      P("p5", "u5", "주말에 비 온다는데", "약속을 미뤄야 하나 고민이네요. 다들 비 오는 주말엔 뭐 하시나요.", 30, ["u1"]),
      P("p6", "u2", "키보드 청소 꿀팁 공유", "키캡 다 뽑아서 미지근한 물에 담가두고, 보드는 에어건으로 불어내면 새것 됩니다. 반나절이면 충분해요.", 49, ["u3", "u5"]),
      P("p7", "u3", "요즘 읽는 책 이야기", "퇴근하고 30분씩 읽고 있는데 생각보다 진도가 안 나가네요. 다들 책 읽는 시간을 어떻게 내시는지.", 73, []),
      P("p8", "u1", "동네 산책 코스 추천", "강변 따라 한 바퀴 도는 코스인데 야경이 좋습니다. 한 시간 정도 걸려요.", 96, ["u4"]),
      P("p9", "u5", "냉장고 정리하다가 깨달은 것", "유통기한은 생각보다 빨리 온다. 소스류는 반도 못 쓰고 버리게 되네요. 작은 용량 삽시다.", 120, ["u1", "u2"]),
      P("p10", "u4", "이 게시판 분위기 좋네요", "눈팅만 하다가 글 남깁니다. 다들 친절하셔서 보기 좋습니다.", 150, ["u1", "u2", "u3", "u5"]),
    ],
    comments: [
      C("c1", "p1", "u1", "저는 라디오 다시듣기 들어요. 시간 잘 갑니다.", 1),
      C("c2", "p1", "u4", "출근길엔 그냥 무음이 최고더라고요.", 1.5),
      C("c3", "p2", "u5", "오 위치가 어디인가요? 저도 가보고 싶네요.", 4),
      C("c4", "p2", "u2", "소금빵 인정합니다. 두 개씩 사세요.", 4.5),
      C("c5", "p3", "u2", "환영합니다!", 8),
      C("c6", "p5", "u3", "비 오면 집에서 영화 봅니다.", 28),
      C("c7", "p6", "u1", "에어건 없으면 드라이기 찬바람으로도 됩니다.", 47),
      C("c8", "p9", "u2", "공감합니다. 마요네즈 큰 통은 절대 못 비워요.", 110),
      C("c9", "p10", "u1", "어서 오세요. 자주 글 남겨주세요.", 140),
    ],
    reports: [
      // 어드민 신고 메뉴가 비어 보이지 않도록 미처리 1건을 시드로 둠
      { id: "r1", targetType: "post", targetId: "p9", reporterId: "u3", reason: "기타", createdAt: now - 20 * h, status: "open" },
    ],
    adminLogs: [],
    seq: 100,
  };
}

// dev 핫리로드에도 데이터가 유지되도록 globalThis에 보관
const g = globalThis as unknown as { __baseboardDB?: DB };
export function db(): DB {
  if (!g.__baseboardDB) g.__baseboardDB = seed();
  return g.__baseboardDB;
}

export function nextId(prefix: string): string {
  return `${prefix}${++db().seq}`;
}

export function findUser(id: string | undefined | null): User | undefined {
  return db().users.find((u) => u.id === id);
}

// 쓰기 행위 공통 가드: 로그인 안 함 / 차단 / 탈퇴
export function writableError(userId: string | undefined | null): string | null {
  const u = findUser(userId);
  if (!u || u.status === "left") return "로그인이 필요합니다";
  if (u.status === "blocked") return "이용이 제한된 계정입니다";
  return null;
}

export function authorName(userId: string): string {
  const u = findUser(userId);
  if (!u || u.status === "left") return "탈퇴한 사용자";
  return u.nickname;
}

export function logAdmin(actor: string, action: string, target: string) {
  db().adminLogs.push({ at: Date.now(), actor, action, target });
}
