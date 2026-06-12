import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// 전체 유저 목록 (가입 최신순) - 어드민 전용
export async function GET() {
  const users = db()
    .users.slice()
    .sort((a, b) => b.joinedAt - a.joinedAt)
    .map((u) => ({
      id: u.id,
      nickname: u.nickname,
      email: u.email,
      joinedAt: u.joinedAt,
      postCount: db().posts.filter((p) => p.authorId === u.id).length,
      status: u.status,
    }));
  return NextResponse.json(users);
}
