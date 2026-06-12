import { NextResponse } from "next/server";
import { authorName, db } from "@/lib/db";

// 전체 댓글 목록 (숨김·삭제 포함) - 어드민 전용
export async function GET() {
  const comments = db()
    .comments.slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((c) => {
      const post = db().posts.find((p) => p.id === c.postId);
      return {
        id: c.id,
        body: c.body,
        authorName: authorName(c.authorId),
        postId: c.postId,
        postTitle: post?.title ?? "(삭제된 글)",
        createdAt: c.createdAt,
        status: c.status,
      };
    });
  return NextResponse.json(comments);
}
