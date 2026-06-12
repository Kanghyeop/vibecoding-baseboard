"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppHeader, BottomTab, Footer } from "@/components/shell";
import { useDialog } from "@/components/dialog";
import { IconGoogle, IconUser } from "@/components/icons";
import { ME, useAuth } from "@/lib/auth";
import { timeAgo } from "@/lib/util";

interface MyPost {
  id: string;
  title: string;
  createdAt: number;
  likeCount: number;
}

interface Profile {
  nickname: string;
  email: string;
  marketingOptIn: boolean;
  posts: MyPost[];
}

export default function MyPage() {
  const { ready, loggedIn, login, logout } = useAuth();
  const dialog = useDialog();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (loggedIn) fetch(`/api/users/${ME}`).then((r) => r.json()).then(setProfile);
  }, [loggedIn]);

  const saveNickname = async () => {
    if (!nickname.trim()) return;
    await fetch(`/api/users/${ME}`, { method: "PATCH", body: JSON.stringify({ nickname }) });
    setEditing(false);
    fetch(`/api/users/${ME}`).then((r) => r.json()).then(setProfile);
  };

  const withdraw = async () => {
    const ok = await dialog.confirm(
      "정말 탈퇴할까요?\n쓴 글은 남고 작성자가 \"탈퇴한 사용자\"로 표시됩니다.",
      { confirmLabel: "탈퇴" }
    );
    if (!ok) return;
    await fetch(`/api/users/${ME}`, { method: "PATCH", body: JSON.stringify({ action: "leave" }) });
    logout();
  };

  // 비로그인: 시작하기 화면
  if (ready && !loggedIn)
    return (
      <>
        <AppHeader title="마이" />
        <main className="flex flex-1 flex-col items-center justify-center px-5 text-center">
          <h2 className="text-[22px] font-bold leading-[30px]">
            베이스보드
            <br />
            시작하기
          </h2>
          <p className="mt-2 text-[15px] leading-[24px] text-sub">
            이 게시판을 내 서비스로 바꿔보세요.
            <br />
            시작하면 글쓰기, 댓글, 좋아요까지 쓸 수 있어요.
          </p>
          <button
            onClick={login}
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line text-[15px] font-semibold"
          >
            <IconGoogle />
            Google로 시작하기
          </button>
          <p className="mt-3 text-center text-[11px] leading-[14px] text-faint">
            시작하면 <Link href="/terms" className="underline">이용약관</Link>과{" "}
            <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의하게 됩니다
            <br />
            지금은 테스트라 로그인이 동작하지 않아요
          </p>
        </main>
        <Footer />
        <BottomTab />
      </>
    );

  return (
    <>
      <AppHeader title="마이" />
      <main className="flex-1 overflow-y-auto">
        {/* 프로필 */}
        <section className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-soft text-faint">
            <IconUser size={26} />
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="h-9 flex-1 rounded-xl bg-soft px-3 text-[15px] outline-none focus:ring-1 focus:ring-point"
                  autoFocus
                />
                <button onClick={saveNickname} className="text-[13px] font-semibold text-point">
                  저장
                </button>
              </div>
            ) : (
              <>
                <p className="text-[16px] font-semibold leading-[24px]">{profile?.nickname ?? "..."}</p>
                <p className="text-[13px] leading-[18px] text-faint">{profile?.email}</p>
              </>
            )}
          </div>
          {!editing && (
            <button
              onClick={() => {
                setNickname(profile?.nickname ?? "");
                setEditing(true);
              }}
              className="text-[13px] text-sub"
            >
              닉네임 수정
            </button>
          )}
        </section>

        {/* 내가 쓴 글 */}
        <section className="border-t-8 border-line-soft px-5 py-4">
          <p className="text-[16px] font-semibold leading-[24px]">내가 쓴 글 {profile?.posts.length ?? 0}</p>
          {profile && profile.posts.length === 0 && (
            <p className="py-8 text-center text-[13px] text-faint">아직 쓴 글이 없어요</p>
          )}
          <ul>
            {profile?.posts.map((p) => (
              <li key={p.id} className="border-b border-line-soft last:border-0">
                <Link href={`/posts/${p.id}`} className="block py-3">
                  <p className="text-[15px] leading-[24px]">{p.title}</p>
                  <p className="mt-0.5 text-[13px] leading-[18px] text-faint">
                    {timeAgo(p.createdAt)} · 좋아요 {p.likeCount}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 설정 */}
        <section className="border-t-8 border-line-soft px-5 py-4">
          <p className="text-[16px] font-semibold leading-[24px]">설정</p>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-[15px] leading-[24px]">마케팅 수신 동의</p>
              <p className="text-[13px] leading-[18px] text-faint">이벤트·혜택 소식을 받아요</p>
            </div>
            <button
              role="switch"
              aria-checked={profile?.marketingOptIn ?? false}
              onClick={async () => {
                if (!profile) return;
                const next = !profile.marketingOptIn;
                setProfile({ ...profile, marketingOptIn: next });
                await fetch(`/api/users/${ME}`, {
                  method: "PATCH",
                  body: JSON.stringify({ marketing: next }),
                });
              }}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                profile?.marketingOptIn ? "bg-point" : "bg-disabled"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                  profile?.marketingOptIn ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* 계정 */}
        <section className="border-t-8 border-line-soft px-5 py-4">
          <button onClick={logout} className="block py-3 text-[15px] text-sub">
            로그아웃
          </button>
          <button onClick={withdraw} className="block py-3 text-[15px] text-negative">
            회원탈퇴
          </button>
        </section>

        <div className="border-t-8 border-line-soft">
          <Footer />
        </div>
      </main>
      <BottomTab />
    </>
  );
}
