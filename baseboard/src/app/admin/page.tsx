"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader } from "@/components/admin-ui";

interface Stats {
  users: number;
  posts: number;
  comments: number;
  todayPosts: number;
  openReports: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, []);

  const cards = [
    { label: "총 유저", value: stats?.users },
    { label: "총 게시글", value: stats?.posts },
    { label: "총 댓글", value: stats?.comments },
    { label: "오늘 새 글", value: stats?.todayPosts },
    { label: "미처리 신고", value: stats?.openReports, alert: (stats?.openReports ?? 0) > 0 },
  ];

  return (
    <div>
      <PageHeader title="대시보드" desc="서비스 현황을 한눈에 봅니다" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label} className="p-4 sm:p-5">
            <p className="text-[12px] leading-[18px] text-sub">{c.label}</p>
            <p className={`mt-1.5 text-[26px] font-bold leading-[32px] ${c.alert ? "text-point" : ""}`}>
              {c.value ?? "-"}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
