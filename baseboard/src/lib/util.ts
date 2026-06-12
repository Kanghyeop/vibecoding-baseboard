export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}일 전`;
  return new Date(ts).toLocaleDateString("ko-KR");
}

export function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}
