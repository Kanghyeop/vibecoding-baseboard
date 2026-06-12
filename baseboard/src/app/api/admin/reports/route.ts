import { NextResponse } from "next/server";
import { authorName, db } from "@/lib/db";

// 신고 목록 (미처리 우선, 최신순) - 어드민 전용
export async function GET() {
  const rows = db()
    .reports.slice()
    .sort((a, b) => (a.status === "open" ? 0 : 1) - (b.status === "open" ? 0 : 1) || b.createdAt - a.createdAt)
    .map((r) => {
      let summary = "(삭제된 대상)";
      let postId = "";
      if (r.targetType === "post") {
        const p = db().posts.find((p) => p.id === r.targetId);
        if (p) {
          summary = p.title;
          postId = p.id;
        }
      } else {
        const c = db().comments.find((c) => c.id === r.targetId);
        if (c) {
          summary = c.body;
          postId = c.postId;
        }
      }
      return {
        id: r.id,
        targetType: r.targetType,
        targetId: r.targetId,
        postId,
        summary,
        reason: r.reason,
        reporterName: authorName(r.reporterId),
        createdAt: r.createdAt,
        status: r.status,
      };
    });
  return NextResponse.json(rows);
}
