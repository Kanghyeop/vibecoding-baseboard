import { NextRequest, NextResponse } from "next/server";
import { authorName, db } from "@/lib/db";

// 전체 글 목록 (숨김·삭제 포함, 검색 지원) - 어드민 전용
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase();
  let posts = db().posts.slice().sort((a, b) => b.createdAt - a.createdAt);
  if (q) {
    posts = posts.filter(
      (p) => p.title.toLowerCase().includes(q) || authorName(p.authorId).toLowerCase().includes(q)
    );
  }
  return NextResponse.json(
    posts.map((p) => ({
      id: p.id,
      title: p.title,
      authorName: authorName(p.authorId),
      createdAt: p.createdAt,
      likeCount: p.likes.length,
      commentCount: db().comments.filter((c) => c.postId === p.id).length,
      status: p.status,
    }))
  );
}
