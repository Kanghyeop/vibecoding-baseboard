"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/shell";
import { useDialog } from "@/components/dialog";
import { useAuth } from "@/lib/auth";

export default function WritePage() {
  const router = useRouter();
  const { ready, loggedIn, userId } = useAuth();
  const dialog = useDialog();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  // 직접 URL로 들어온 비로그인 유저는 홈으로
  useEffect(() => {
    if (ready && !loggedIn) router.replace("/");
  }, [ready, loggedIn, router]);

  const submit = async () => {
    if (!title.trim() || !body.trim() || saving) return;
    setSaving(true);
    const r = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ userId, title, body }),
    });
    if (r.ok) {
      const { id } = await r.json();
      router.replace(`/posts/${id}`);
    } else {
      dialog.alert((await r.json()).error);
      setSaving(false);
    }
  };

  return (
    <>
      <AppHeader title="글쓰기" back />
      <main className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="h-12 rounded-xl bg-soft px-4 text-[16px] font-semibold outline-none focus:ring-1 focus:ring-point"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="내용을 입력하세요"
          className="flex-1 resize-none rounded-xl bg-soft p-4 text-[15px] leading-[24px] outline-none focus:ring-1 focus:ring-point"
        />
      </main>
      <div className="shrink-0 border-t border-line-soft bg-white px-5 py-3">
        <button
          onClick={submit}
          disabled={!title.trim() || !body.trim() || saving}
          className="h-12 w-full rounded-xl bg-point text-[15px] font-semibold text-white disabled:bg-disabled"
        >
          등록
        </button>
      </div>
    </>
  );
}
