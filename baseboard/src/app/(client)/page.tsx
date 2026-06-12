"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader, BottomTab, useLoginGate } from "@/components/shell";
import { IconComment, IconHeart, IconPen } from "@/components/icons";
import { timeAgo } from "@/lib/util";

interface PostItem {
  id: string;
  title: string;
  authorName: string;
  createdAt: number;
  likeCount: number;
  commentCount: number;
}

export default function HomePage() {
  const router = useRouter();
  const { requireLogin } = useLoginGate();
  const [posts, setPosts] = useState<PostItem[] | null>(null);

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then(setPosts);
  }, []);

  return (
    <>
      <AppHeader title="홈" />
      <main className="relative flex-1 overflow-y-auto">
        {posts === null ? (
          <p className="py-16 text-center text-[13px] text-faint">불러오는 중...</p>
        ) : posts.length === 0 ? (
          <p className="py-16 text-center text-[13px] text-faint">아직 글이 없어요</p>
        ) : (
          <ul>
            {posts.map((p) => (
              <li key={p.id} className="border-b border-line-soft">
                <Link href={`/posts/${p.id}`} className="block px-5 py-4">
                  <p className="text-[16px] font-semibold leading-[24px]">{p.title}</p>
                  <div className="mt-2 flex items-center gap-2 text-[13px] leading-[18px] text-faint">
                    <span className="text-sub">{p.authorName}</span>
                    <span>{timeAgo(p.createdAt)}</span>
                    <span className="ml-auto flex items-center gap-1">
                      <IconHeart size={14} /> {p.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconComment size={14} /> {p.commentCount}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* 글쓰기 FAB - 로그인 안 했으면 로그인 모달부터 */}
      <button
        onClick={() => requireLogin() && router.push("/write")}
        aria-label="글쓰기"
        className="absolute bottom-20 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-point text-white shadow-lg"
      >
        <IconPen />
      </button>

      <BottomTab />
    </>
  );
}
