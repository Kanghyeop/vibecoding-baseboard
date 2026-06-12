import { NextRequest, NextResponse } from "next/server";
import { db, logAdmin } from "@/lib/db";

// 글 처리: 숨김 / 숨김 해제 / 삭제 (전부 soft - 데이터 파기 없음)
export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/admin/posts/[id]">) {
  const { id } = await ctx.params;
  const { action } = await req.json();
  const post = db().posts.find((p) => p.id === id);
  if (!post) return NextResponse.json({ error: "글을 찾을 수 없습니다" }, { status: 404 });

  if (action === "hide") post.status = "hidden";
  else if (action === "unhide") post.status = "public";
  else if (action === "delete") post.status = "deleted";
  else return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });

  logAdmin("admin", action, `post:${id}`);
  return NextResponse.json({ ok: true, status: post.status });
}
