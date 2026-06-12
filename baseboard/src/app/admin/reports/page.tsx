"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader, TableWrap, btnSm, btnSmDanger, table, td, th, trHover } from "@/components/admin-ui";
import { useDialog } from "@/components/dialog";
import { fmtDate } from "@/lib/util";

interface Row {
  id: string;
  targetType: "post" | "comment";
  targetId: string;
  postId: string;
  summary: string;
  reason: string;
  reporterName: string;
  createdAt: number;
  status: "open" | "resolved" | "dismissed";
}

// 미처리만 검정 배지로 도드라지게, 처리된 건 회색
const STATUS: Record<Row["status"], { label: string; tone: string }> = {
  open: { label: "미처리", tone: "bg-ink text-white" },
  resolved: { label: "숨김 처리", tone: "bg-soft text-sub" },
  dismissed: { label: "기각", tone: "bg-soft text-faint" },
};

export default function AdminReports() {
  const [rows, setRows] = useState<Row[]>([]);
  const dialog = useDialog();

  const load = useCallback(() => {
    fetch("/api/admin/reports").then((r) => r.json()).then(setRows);
  }, []);

  useEffect(load, [load]);

  const act = async (id: string, action: "hide" | "dismiss") => {
    const label = action === "hide" ? "대상을 숨김 처리" : "신고를 기각";
    if (!(await dialog.confirm(`${label}할까요?`, { danger: action === "hide", confirmLabel: "확인" }))) return;
    await fetch(`/api/admin/reports/${id}`, { method: "PATCH", body: JSON.stringify({ action }) });
    load();
  };

  return (
    <div>
      <PageHeader title="신고" desc="신고가 들어와도 자동으로 숨기지 않습니다. 판단은 항상 운영자가 합니다" />
      <TableWrap>
        <table className={table}>
          <thead>
            <tr>
              <th className={th}>유형</th>
              <th className={th}>대상 내용</th>
              <th className={th}>사유</th>
              <th className={th}>신고자</th>
              <th className={th}>접수일</th>
              <th className={th}>상태</th>
              <th className={th}>처리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={trHover}>
                <td className={`${td} whitespace-nowrap`}>{r.targetType === "post" ? "글" : "댓글"}</td>
                <td className={`${td} max-w-xs truncate`}>
                  {r.postId ? (
                    <a href={`/posts/${r.postId}`} target="_blank" className="underline">
                      {r.summary}
                    </a>
                  ) : (
                    r.summary
                  )}
                </td>
                <td className={`${td} whitespace-nowrap`}>{r.reason}</td>
                <td className={`${td} whitespace-nowrap`}>{r.reporterName}</td>
                <td className={`${td} whitespace-nowrap text-sub`}>{fmtDate(r.createdAt)}</td>
                <td className={td}>
                  <span className={`inline-block whitespace-nowrap rounded-lg px-2 py-0.5 text-[12px] ${STATUS[r.status].tone}`}>
                    {STATUS[r.status].label}
                  </span>
                </td>
                <td className={`${td} space-x-1.5 whitespace-nowrap`}>
                  {r.status === "open" && (
                    <>
                      <button onClick={() => act(r.id, "hide")} className={btnSmDanger}>대상 숨김</button>
                      <button onClick={() => act(r.id, "dismiss")} className={btnSm}>기각</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="py-10 text-center text-[13px] text-faint">신고가 없습니다</p>}
      </TableWrap>
    </div>
  );
}
