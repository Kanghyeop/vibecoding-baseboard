import { NextRequest, NextResponse } from "next/server";
import { db, logAdmin } from "@/lib/db";

// 신고 처리: 대상 숨김(resolved) / 기각(dismissed)
export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/admin/reports/[id]">) {
  const { id } = await ctx.params;
  const { action } = await req.json();
  const report = db().reports.find((r) => r.id === id);
  if (!report) return NextResponse.json({ error: "신고를 찾을 수 없습니다" }, { status: 404 });

  if (action === "hide") {
    if (report.targetType === "post") {
      const p = db().posts.find((p) => p.id === report.targetId);
      if (p) p.status = "hidden";
    } else {
      const c = db().comments.find((c) => c.id === report.targetId);
      if (c) c.status = "hidden";
    }
    report.status = "resolved";
  } else if (action === "dismiss") {
    report.status = "dismissed";
  } else {
    return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }

  logAdmin("admin", `report-${action}`, `${report.targetType}:${report.targetId}`);
  return NextResponse.json({ ok: true, status: report.status });
}
