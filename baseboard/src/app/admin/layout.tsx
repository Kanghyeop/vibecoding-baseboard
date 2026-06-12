"use client";

// 어드민 껍데기: 회색 배경 위 흰 카드의 표준 SaaS 어드민.
// 데스크톱(lg~): 고정 사이드바 240px. 모바일: 상단 바 + 햄버거 서랍.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconDoc, IconFlag, IconGoogle, IconGrid, IconMenu, IconUser, IconX, IconComment } from "@/components/icons";

const MENU = [
  { href: "/admin", label: "대시보드", Icon: IconGrid },
  { href: "/admin/posts", label: "게시글", Icon: IconDoc },
  { href: "/admin/comments", label: "댓글", Icon: IconComment },
  { href: "/admin/users", label: "유저", Icon: IconUser },
  { href: "/admin/reports", label: "신고", Icon: IconFlag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setAuthed(localStorage.getItem("bb-admin") === "1");
    setReady(true);
  }, []);

  // 경로가 바뀌면 모바일 서랍을 닫는다
  useEffect(() => setDrawer(false), [pathname]);

  if (!ready) return null;

  // 운영자 로그인 게이트 (페이크 - 누르면 운영자로 입장)
  if (!authed)
    return (
      <div className="flex min-h-dvh items-center justify-center bg-soft px-5">
        <div className="w-full max-w-[360px] rounded-2xl border border-line bg-white p-8">
          <p className="text-[13px] font-semibold leading-[18px] text-faint">BASEBOARD</p>
          <h1 className="mt-1 text-[22px] font-bold leading-[30px]">어드민 콘솔</h1>
          <p className="mt-2 text-[13px] leading-[18px] text-sub">
            운영자 계정으로 로그인하세요. 허용된 이메일만 입장할 수 있습니다.
          </p>
          <button
            onClick={() => {
              localStorage.setItem("bb-admin", "1");
              setAuthed(true);
            }}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line text-[15px] font-semibold hover:bg-soft"
          >
            <IconGoogle />
            Google로 계속하기
          </button>
          <p className="mt-3 text-center text-[11px] leading-[14px] text-faint">
            지금은 데모라 버튼을 누르면 운영자로 입장됩니다
          </p>
        </div>
      </div>
    );

  const logout = () => {
    localStorage.removeItem("bb-admin");
    setAuthed(false);
  };

  const nav = (
    <>
      <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold leading-[14px] text-faint">BASEBOARD</p>
          <p className="text-[15px] font-bold leading-[24px]">어드민 콘솔</p>
        </div>
        <button onClick={() => setDrawer(false)} aria-label="메뉴 닫기" className="p-1 text-sub lg:hidden">
          <IconX size={20} />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {MENU.map(({ href, label, Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] ${
                active ? "bg-point-soft font-semibold text-point" : "text-sub hover:bg-soft"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      {/* 운영자 정보 + 로그아웃 */}
      <div className="border-t border-line-soft p-3">
        <div className="flex items-center gap-2.5 rounded-xl px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-soft text-faint">
            <IconUser size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-[18px]">운영자</p>
            <p className="truncate text-[11px] leading-[14px] text-faint">admin@baseboard.app</p>
          </div>
          <button onClick={logout} className="text-[12px] text-sub hover:text-ink">
            로그아웃
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-dvh bg-soft">
      {/* 모바일 상단 바 */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white px-4 lg:hidden">
        <button onClick={() => setDrawer(true)} aria-label="메뉴 열기" className="p-1 text-sub">
          <IconMenu size={22} />
        </button>
        <p className="text-[15px] font-bold leading-[24px]">어드민 콘솔</p>
      </header>

      {/* 데스크톱 사이드바 */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-white lg:flex">
        {nav}
      </aside>

      {/* 모바일 서랍 */}
      {drawer && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setDrawer(false)}>
          <aside
            className="flex h-full w-64 flex-col bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {nav}
          </aside>
        </div>
      )}

      <main className="p-4 sm:p-6 lg:ml-60 lg:p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
