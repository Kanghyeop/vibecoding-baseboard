import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// 대시보드 숫자 4개
export async function GET() {
  const d = db();
  const dayAgo = Date.now() - 24 * 3600_000;
  return NextResponse.json({
    users: d.users.length,
    posts: d.posts.length,
    comments: d.comments.length,
    todayPosts: d.posts.filter((p) => p.createdAt > dayAgo).length,
    openReports: d.reports.filter((r) => r.status === "open").length,
  });
}
