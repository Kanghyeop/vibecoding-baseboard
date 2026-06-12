"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader, StatusBadge, TableWrap, btnSm, btnSmDanger, table, td, th, trHover } from "@/components/admin-ui";
import { useDialog } from "@/components/dialog";
import { fmtDate } from "@/lib/util";

interface Row {
  id: string;
  title: string;
  authorName: string;
  createdAt: number;
  likeCount: number;
  commentCount: number;
  status: string;
}

export default function AdminPosts() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const dialog = useDialog();

  const load = useCallback(() => {
    fetch(`/api/admin/posts?q=${encodeURIComponent(q)}`).then((r) => r.json()).then(setRows);
  }, [q]);

  useEffect(load, [load]);

  const act = async (id: string, action: string, label: string) => {
    if (!(await dialog.confirm(`이 글을 ${label} 처리할까요?`, { danger: action === "delete", confirmLabel: label })))
      return;
    await fetch(`/api/admin/posts/${id}`, { method: "PATCH", body: JSON.stringify({ action }) });
    load();
  };

  return (
    <div>
      <PageHeader
        title="게시글"
        desc="숨김·삭제된 글까지 전부 보입니다"
        right={
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="제목·닉네임 검색"
            className="h-9 w-full rounded-xl border border-line bg-white px-3 text-[13px] outline-none focus:border-point sm:w-64"
          />
        }
      />
      <TableWrap>
        <table className={table}>
          <thead>
            <tr>
              <th className={th}>제목</th>
              <th className={th}>작성자</th>
              <th className={th}>작성일</th>
              <th className={th}>좋아요</th>
              <th className={th}>댓글</th>
              <th className={th}>상태</th>
              <th className={th}>처리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={trHover}>
                <td className={`${td} max-w-xs truncate font-medium`}>{r.title}</td>
                <td className={`${td} whitespace-nowrap`}>{r.authorName}</td>
                <td className={`${td} whitespace-nowrap text-sub`}>{fmtDate(r.createdAt)}</td>
                <td className={td}>{r.likeCount}</td>
                <td className={td}>{r.commentCount}</td>
                <td className={td}><StatusBadge status={r.status} /></td>
                <td className={`${td} space-x-1.5 whitespace-nowrap`}>
                  {r.status === "hidden" ? (
                    <button onClick={() => act(r.id, "unhide", "숨김 해제")} className={btnSm}>숨김 해제</button>
                  ) : r.status === "public" ? (
                    <button onClick={() => act(r.id, "hide", "숨김")} className={btnSm}>숨김</button>
                  ) : null}
                  {r.status !== "deleted" && (
                    <button onClick={() => act(r.id, "delete", "삭제")} className={btnSmDanger}>삭제</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="py-10 text-center text-[13px] text-faint">결과가 없습니다</p>}
      </TableWrap>
    </div>
  );
}
