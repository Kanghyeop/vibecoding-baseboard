import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// 댓글 삭제 (본인만, soft delete - "삭제된 댓글입니다"로 표시됨)
export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/comments/[id]">) {
  const { id } = await ctx.params;
  const { userId } = await req.json();
  const comment = db().comments.find((c) => c.id === id);
  if (!comment) return NextResponse.json({ error: "댓글을 찾을 수 없습니다" }, { status: 404 });
  if (comment.authorId !== userId)
    return NextResponse.json({ error: "본인 댓글만 삭제할 수 있습니다" }, { status: 403 });

  comment.status = "deleted";
  return NextResponse.json({ ok: true });
}
