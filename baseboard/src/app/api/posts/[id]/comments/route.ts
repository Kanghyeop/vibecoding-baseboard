import { NextRequest, NextResponse } from "next/server";
import { db, nextId, writableError } from "@/lib/db";

// 댓글 작성
export async function POST(req: NextRequest, ctx: RouteContext<"/api/posts/[id]/comments">) {
  const { id } = await ctx.params;
  const { userId, body } = await req.json();
  const err = writableError(userId);
  if (err) return NextResponse.json({ error: err }, { status: 403 });
  if (!body?.trim()) return NextResponse.json({ error: "내용을 입력해주세요" }, { status: 400 });

  const post = db().posts.find((p) => p.id === id && p.status === "public");
  if (!post) return NextResponse.json({ error: "글을 찾을 수 없습니다" }, { status: 404 });

  db().comments.push({
    id: nextId("c"),
    postId: id,
    authorId: userId,
    body: body.trim(),
    createdAt: Date.now(),
    status: "public",
  });
  return NextResponse.json({ ok: true });
}
