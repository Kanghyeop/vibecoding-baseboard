import { NextRequest, NextResponse } from "next/server";
import { db, writableError } from "@/lib/db";

// 좋아요 토글 (1인 1회)
export async function POST(req: NextRequest, ctx: RouteContext<"/api/posts/[id]/like">) {
  const { id } = await ctx.params;
  const { userId } = await req.json();
  const err = writableError(userId);
  if (err) return NextResponse.json({ error: err }, { status: 403 });

  const post = db().posts.find((p) => p.id === id && p.status === "public");
  if (!post) return NextResponse.json({ error: "글을 찾을 수 없습니다" }, { status: 404 });

  const i = post.likes.indexOf(userId);
  if (i >= 0) post.likes.splice(i, 1);
  else post.likes.push(userId);
  return NextResponse.json({ liked: i < 0, likeCount: post.likes.length });
}
