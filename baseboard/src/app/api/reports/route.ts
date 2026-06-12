import { NextRequest, NextResponse } from "next/server";
import { db, nextId, writableError } from "@/lib/db";

// 신고 접수 (글·댓글 공용, 로그인 필요)
export async function POST(req: NextRequest) {
  const { userId, targetType, targetId, reason } = await req.json();
  const err = writableError(userId);
  if (err) return NextResponse.json({ error: err }, { status: 403 });
  if (!["post", "comment"].includes(targetType) || !targetId || !reason?.trim())
    return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });

  const exists =
    targetType === "post"
      ? db().posts.some((p) => p.id === targetId)
      : db().comments.some((c) => c.id === targetId);
  if (!exists) return NextResponse.json({ error: "대상을 찾을 수 없습니다" }, { status: 404 });

  // 같은 사람이 같은 대상을 중복 신고하면 기존 접수로 갈음
  const dup = db().reports.find(
    (r) => r.reporterId === userId && r.targetType === targetType && r.targetId === targetId
  );
  if (!dup) {
    db().reports.push({
      id: nextId("r"),
      targetType,
      targetId,
      reporterId: userId,
      reason: reason.trim(),
      createdAt: Date.now(),
      status: "open",
    });
  }
  return NextResponse.json({ ok: true });
}
