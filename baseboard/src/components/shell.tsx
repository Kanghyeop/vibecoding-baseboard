"use client";

// 클라이언트 화면 공용 껍데기: 360×800 모바일 프레임, 헤더, 하단 탭, 로그인 모달.
// 어드민(/admin)은 이 프레임을 쓰지 않는다 - 디자인 시스템 "화면 틀" 참조.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { useAuth } from "@/lib/auth";
import { IconBack, IconGoogle, IconHome, IconUser } from "./icons";

/* ---------- 로그인 유도 모달 ---------- */

const LoginGateContext = createContext<{ requireLogin: () => boolean }>({
  requireLogin: () => false,
});

export function useLoginGate() {
  return useContext(LoginGateContext);
}

export function MobileFrame({ children }: { children: React.ReactNode }) {
  const { loggedIn, login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  // 쓰기 행위 직전에 호출. 로그인 상태면 true, 아니면 모달 띄우고 false.
  const requireLogin = () => {
    if (loggedIn) return true;
    setShowLogin(true);
    return false;
  };

  return (
    <div className="min-h-dvh lg:flex lg:justify-center">
      <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-white lg:w-[480px] lg:border-x lg:border-line">
        <LoginGateContext.Provider value={{ requireLogin }}>
          {children}
        </LoginGateContext.Provider>

        {showLogin && (
          <div
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/40"
            onClick={() => setShowLogin(false)}
          >
            <div
              className="sheet-up w-full rounded-t-2xl bg-white p-5 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
              <p className="text-[19px] font-bold leading-[26px]">베이스보드 시작하기</p>
              <p className="mt-2 text-[13px] leading-[18px] text-sub">
                구글 계정으로 3초 만에 시작하고
                <br />
                글쓰기, 댓글, 좋아요를 모두 쓸 수 있어요.
              </p>
              <button
                onClick={() => {
                  login();
                  setShowLogin(false);
                }}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line text-[15px] font-semibold"
              >
                <IconGoogle />
                Google로 시작하기
              </button>
              <p className="mt-3 text-center text-[11px] leading-[14px] text-faint">
                시작하면{" "}
                <Link href="/terms" className="underline" onClick={() => setShowLogin(false)}>
                  이용약관
                </Link>
                과{" "}
                <Link href="/privacy" className="underline" onClick={() => setShowLogin(false)}>
                  개인정보처리방침
                </Link>
                에 동의하게 됩니다
              </p>
              <p className="mt-1 text-center text-[11px] leading-[14px] text-faint">
                지금은 테스트라 로그인이 동작하지 않아요
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- 상단 헤더 ---------- */

export function AppHeader({
  title,
  back,
  right,
}: {
  title: string;
  back?: boolean;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-line-soft bg-white px-5">
      <div className="flex items-center gap-2">
        {back && (
          <button onClick={() => router.back()} aria-label="뒤로가기" className="-ml-2 p-1">
            <IconBack />
          </button>
        )}
        <h1 className="text-[22px] font-bold leading-[30px]">{title}</h1>
      </div>
      {right}
    </header>
  );
}

/* ---------- 액션시트 (글·댓글의 ⋯ 메뉴) ---------- */

export function ActionSheet({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: { label: string; danger?: boolean; onClick: () => void }[];
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div
        className="sheet-up w-full rounded-t-2xl bg-white px-5 pt-3 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 그랩바 */}
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-line" />
        <div className="divide-y divide-line-soft">
          {items.map((it) => (
            <button
              key={it.label}
              onClick={() => {
                onClose();
                it.onClick();
              }}
              className={`block w-full py-4 text-center text-[16px] font-medium active:bg-soft ${
                it.danger ? "text-negative" : ""
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-3 h-12 w-full rounded-xl bg-soft text-[15px] font-semibold"
        >
          취소
        </button>
      </div>
    </div>
  );
}

/* ---------- 푸터 (마이페이지 하단) ---------- */

export function Footer() {
  return (
    <footer className="px-5 py-6">
      <p className="text-[13px] font-semibold leading-[18px] text-sub">베이스보드</p>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] leading-[14px] text-faint">
        <Link href="/terms" className="underline">이용약관</Link>
        <Link href="/privacy" className="font-semibold underline">개인정보처리방침</Link>
        <span>문의 help@baseboard.app</span>
      </div>
      <p className="mt-2 text-[11px] leading-[14px] text-faint">© 2026 Baseboard</p>
    </footer>
  );
}

/* ---------- 하단 탭바 (홈 / 마이) ---------- */

export function BottomTab() {
  const pathname = usePathname();
  const tabs = [
    { href: "/", label: "홈", Icon: IconHome },
    { href: "/my", label: "마이", Icon: IconUser },
  ];
  return (
    <nav className="z-20 flex h-16 shrink-0 border-t border-line-soft bg-white">
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 ${
              active ? "text-point" : "text-faint"
            }`}
          >
            <Icon size={24} filled={active} />
            <span className="text-[11px] leading-[14px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
