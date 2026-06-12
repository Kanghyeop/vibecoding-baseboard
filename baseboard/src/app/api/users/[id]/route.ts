import { NextRequest, NextResponse } from "next/server";
import { db, findUser } from "@/lib/db";

// 내 프로필 + 내가 쓴 글
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/users/[id]">) {
  const { id } = await ctx.params;
  const user = findUser(id);
  if (!user) return NextResponse.json({ error: "유저를 찾을 수 없습니다" }, { status: 404 });

  const myPosts = db()
    .posts.filter((p) => p.authorId === id && p.status === "public")
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((p) => ({ id: p.id, title: p.title, createdAt: p.createdAt, likeCount: p.likes.length }));

  return NextResponse.json({
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    status: user.status,
    marketingOptIn: user.marketingOptIn,
    posts: myPosts,
  });
}

// 닉네임 수정 · 마케팅 수신 동의 · 탈퇴 · 재가입
export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/users/[id]">) {
  const { id } = await ctx.params;
  const { nickname, action, marketing } = await req.json();
  const user = findUser(id);
  if (!user) return NextResponse.json({ error: "유저를 찾을 수 없습니다" }, { status: 404 });

  if (typeof marketing === "boolean") {
    user.marketingOptIn = marketing;
    return NextResponse.json({ ok: true });
  }

  if (action === "leave") {
    // 탈퇴: 글·댓글은 남고 작성자가 "탈퇴한 사용자"로 표시됨
    user.status = "left";
    return NextResponse.json({ ok: true });
  }
  if (action === "rejoin") {
    // 페이크 로그인 한정: 탈퇴 계정으로 다시 로그인하면 재가입으로 간주
    // (차단 계정은 되살리지 않음 - 차단 데모가 깨지지 않도록)
    if (user.status === "left") user.status = "active";
    return NextResponse.json({ ok: true });
  }
  if (nickname?.trim()) {
    user.nickname = nickname.trim();
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
}
