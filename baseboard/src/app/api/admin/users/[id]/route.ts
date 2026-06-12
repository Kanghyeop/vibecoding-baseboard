import { NextRequest, NextResponse } from "next/server";
import { db, findUser, logAdmin } from "@/lib/db";

// 유저 상세: 그 사람이 쓴 글·댓글 모아 보기
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/admin/users/[id]">) {
  const { id } = await ctx.params;
  const user = findUser(id);
  if (!user) return NextResponse.json({ error: "유저를 찾을 수 없습니다" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    joinedAt: user.joinedAt,
    status: user.status,
    posts: db()
      .posts.filter((p) => p.authorId === id)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((p) => ({ id: p.id, title: p.title, createdAt: p.createdAt, status: p.status })),
    comments: db()
      .comments.filter((c) => c.authorId === id)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((c) => ({ id: c.id, body: c.body, postId: c.postId, createdAt: c.createdAt, status: c.status })),
  });
}

// 유저 처리: 차단 / 차단 해제 (기존 작성물은 자동으로 숨기지 않음)
export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/admin/users/[id]">) {
  const { id } = await ctx.params;
  const { action } = await req.json();
  const user = findUser(id);
  if (!user) return NextResponse.json({ error: "유저를 찾을 수 없습니다" }, { status: 404 });

  if (action === "block") user.status = "blocked";
  else if (action === "unblock") user.status = "active";
  else return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });

  logAdmin("admin", action, `user:${id}`);
  return NextResponse.json({ ok: true, status: user.status });
}
