import { NextRequest, NextResponse } from "next/server";
import { authorName, db, nextId, writableError } from "@/lib/db";

// 글 목록 (공개 글만, 최신순)
export async function GET() {
  const posts = db()
    .posts.filter((p) => p.status === "public")
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((p) => ({
      id: p.id,
      title: p.title,
      authorName: authorName(p.authorId),
      createdAt: p.createdAt,
      likeCount: p.likes.length,
      commentCount: db().comments.filter((c) => c.postId === p.id && c.status === "public").length,
    }));
  return NextResponse.json(posts);
}

// 글 작성
export async function POST(req: NextRequest) {
  const { userId, title, body } = await req.json();
  const err = writableError(userId);
  if (err) return NextResponse.json({ error: err }, { status: 403 });
  if (!title?.trim() || !body?.trim())
    return NextResponse.json({ error: "제목과 본문을 입력해주세요" }, { status: 400 });

  const post = {
    id: nextId("p"),
    authorId: userId,
    title: title.trim(),
    body: body.trim(),
    createdAt: Date.now(),
    edited: false,
    status: "public" as const,
    likes: [],
  };
  db().posts.push(post);
  return NextResponse.json({ id: post.id });
}
