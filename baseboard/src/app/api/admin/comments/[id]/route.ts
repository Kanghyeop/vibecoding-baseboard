import { NextRequest, NextResponse } from "next/server";
import { db, logAdmin } from "@/lib/db";

// 댓글 처리: 숨김 / 숨김 해제 / 삭제 (규칙은 글과 동일)
export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/admin/comments/[id]">) {
  const { id } = await ctx.params;
  const { action } = await req.json();
  const comment = db().comments.find((c) => c.id === id);
  if (!comment) return NextResponse.json({ error: "댓글을 찾을 수 없습니다" }, { status: 404 });

  if (action === "hide") comment.status = "hidden";
  else if (action === "unhide") comment.status = "public";
  else if (action === "delete") comment.status = "deleted";
  else return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });

  logAdmin("admin", action, `comment:${id}`);
  return NextResponse.json({ ok: true, status: comment.status });
}
