"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { Card, PageHeader, StatusBadge, TableWrap, btnSm, btnSmDanger, table, td, th, trHover } from "@/components/admin-ui";
import { useDialog } from "@/components/dialog";
import { fmtDate } from "@/lib/util";

interface Detail {
  id: string;
  nickname: string;
  email: string;
  joinedAt: number;
  status: string;
  posts: { id: string; title: string; createdAt: number; status: string }[];
  comments: { id: string; body: string; postId: string; createdAt: number; status: string }[];
}

export default function AdminUserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<Detail | null>(null);
  const dialog = useDialog();

  const load = useCallback(() => {
    fetch(`/api/admin/users/${id}`).then((r) => r.json()).then(setUser);
  }, [id]);

  useEffect(load, [load]);

  const act = async (action: "block" | "unblock") => {
    const label = action === "block" ? "차단" : "차단 해제";
    if (!(await dialog.confirm(`이 유저를 ${label}할까요?`, { danger: action === "block", confirmLabel: label })))
      return;
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", body: JSON.stringify({ action }) });
    load();
  };

  if (!user) return <p className="text-[13px] text-faint">불러오는 중...</p>;

  return (
    <div>
      <Link href="/admin/users" className="text-[13px] text-sub hover:underline">
        ← 유저 목록
      </Link>

      <Card className="mt-3 mb-6 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[19px] font-bold leading-[26px]">{user.nickname}</h1>
          <StatusBadge status={user.status} />
          <div className="ml-auto">
            {user.status === "blocked" ? (
              <button onClick={() => act("unblock")} className={btnSm}>차단 해제</button>
            ) : user.status === "active" ? (
              <button onClick={() => act("block")} className={btnSmDanger}>차단</button>
            ) : null}
          </div>
        </div>
        <p className="mt-1 text-[13px] leading-[18px] text-sub">
          {user.email} · 가입 {fmtDate(user.joinedAt)}
        </p>
      </Card>

      <PageHeader title={`쓴 글 ${user.posts.length}`} />
      <TableWrap>
        <table className={table}>
          <thead>
            <tr>
              <th className={th}>제목</th>
              <th className={th}>작성일</th>
              <th className={th}>상태</th>
            </tr>
          </thead>
          <tbody>
            {user.posts.map((p) => (
              <tr key={p.id} className={trHover}>
                <td className={`${td} max-w-xs truncate`}>{p.title}</td>
                <td className={`${td} whitespace-nowrap text-sub`}>{fmtDate(p.createdAt)}</td>
                <td className={td}><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {user.posts.length === 0 && <p className="py-8 text-center text-[13px] text-faint">쓴 글이 없습니다</p>}
      </TableWrap>

      <div className="mt-6">
        <PageHeader title={`쓴 댓글 ${user.comments.length}`} />
        <TableWrap>
          <table className={table}>
            <thead>
              <tr>
                <th className={th}>내용</th>
                <th className={th}>작성일</th>
                <th className={th}>상태</th>
              </tr>
            </thead>
            <tbody>
              {user.comments.map((c) => (
                <tr key={c.id} className={trHover}>
                  <td className={`${td} max-w-xs truncate`}>{c.body}</td>
                  <td className={`${td} whitespace-nowrap text-sub`}>{fmtDate(c.createdAt)}</td>
                  <td className={td}><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {user.comments.length === 0 && <p className="py-8 text-center text-[13px] text-faint">쓴 댓글이 없습니다</p>}
        </TableWrap>
      </div>
    </div>
  );
}
