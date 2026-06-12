import { NextRequest, NextResponse } from "next/server";
import { authorName, db, writableError } from "@/lib/db";

// 글 상세 (+ 댓글)
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/posts/[id]">) {
  const { id } = await ctx.params;
  const post = db().posts.find((p) => p.id === id && p.status === "public");
  if (!post) return NextResponse.json({ error: "글을 찾을 수 없습니다" }, { status: 404 });

  const comments = db()
    .comments.filter((c) => c.postId === id && c.status !== "hidden")
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((c) => ({
      id: c.id,
      authorId: c.authorId,
      authorName: authorName(c.authorId),
      body: c.status === "deleted" ? "" : c.body,
      createdAt: c.createdAt,
      deleted: c.status === "deleted",
    }));

  return NextResponse.json({
    id: post.id,
    title: post.title,
    body: post.body,
    authorId: post.authorId,
    authorName: authorName(post.authorId),
    createdAt: post.createdAt,
    edited: post.edited,
    likes: post.likes,
    comments,
  });
}

// 글 수정 (본인만)
export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/posts/[id]">) {
  const { id } = await ctx.params;
  const { userId, title, body } = await req.json();
  const err = writableError(userId);
  if (err) return NextResponse.json({ error: err }, { status: 403 });

  const post = db().posts.find((p) => p.id === id && p.status === "public");
  if (!post) return NextResponse.json({ error: "글을 찾을 수 없습니다" }, { status: 404 });
  if (post.authorId !== userId)
    return NextResponse.json({ error: "본인 글만 수정할 수 있습니다" }, { status: 403 });

  post.title = title?.trim() || post.title;
  post.body = body?.trim() || post.body;
  post.edited = true;
  return NextResponse.json({ ok: true });
}

// 글 삭제 (본인만, soft delete)
export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/posts/[id]">) {
  const { id } = await ctx.params;
  const { userId } = await req.json();
  const post = db().posts.find((p) => p.id === id);
  if (!post) return NextResponse.json({ error: "글을 찾을 수 없습니다" }, { status: 404 });
  if (post.authorId !== userId)
    return NextResponse.json({ error: "본인 글만 삭제할 수 있습니다" }, { status: 403 });

  post.status = "deleted";
  return NextResponse.json({ ok: true });
}
