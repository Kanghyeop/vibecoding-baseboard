"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, StatusBadge, TableWrap, table, td, th, trHover } from "@/components/admin-ui";
import { fmtDate } from "@/lib/util";

interface Row {
  id: string;
  nickname: string;
  email: string;
  joinedAt: number;
  postCount: number;
  status: string;
}

export default function AdminUsers() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then(setRows);
  }, []);

  return (
    <div>
      <PageHeader title="유저" desc="닉네임을 누르면 활동 내역과 차단 처리를 볼 수 있습니다" />
      <TableWrap>
        <table className={table}>
          <thead>
            <tr>
              <th className={th}>닉네임</th>
              <th className={th}>이메일</th>
              <th className={th}>가입일</th>
              <th className={th}>쓴 글</th>
              <th className={th}>상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={trHover}>
                <td className={`${td} whitespace-nowrap`}>
                  <Link href={`/admin/users/${r.id}`} className="font-semibold hover:underline">
                    {r.nickname}
                  </Link>
                </td>
                <td className={`${td} whitespace-nowrap text-sub`}>{r.email}</td>
                <td className={`${td} whitespace-nowrap text-sub`}>{fmtDate(r.joinedAt)}</td>
                <td className={td}>{r.postCount}</td>
                <td className={td}><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
    </div>
  );
}
