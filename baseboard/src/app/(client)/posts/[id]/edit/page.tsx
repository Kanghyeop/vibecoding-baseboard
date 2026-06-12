"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { AppHeader } from "@/components/shell";
import { useDialog } from "@/components/dialog";
import { useAuth } from "@/lib/auth";

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { ready, loggedIn, userId } = useAuth();
  const dialog = useDialog();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ready && !loggedIn) {
      router.replace("/");
      return;
    }
    fetch(`/api/posts/${id}`).then(async (r) => {
      if (!r.ok) return router.replace("/");
      const p = await r.json();
      setTitle(p.title);
      setBody(p.body);
      setLoaded(true);
    });
  }, [ready, loggedIn, id, router]);

  const submit = async () => {
    const r = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ userId, title, body }),
    });
    if (r.ok) router.replace(`/posts/${id}`);
    else dialog.alert((await r.json()).error);
  };

  if (!loaded)
    return (
      <>
        <AppHeader title="글 수정" back />
        <p className="py-16 text-center text-[13px] text-faint">불러오는 중...</p>
      </>
    );

  return (
    <>
      <AppHeader title="글 수정" back />
      <main className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-12 rounded-xl bg-soft px-4 text-[16px] font-semibold outline-none focus:ring-1 focus:ring-point"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex-1 resize-none rounded-xl bg-soft p-4 text-[15px] leading-[24px] outline-none focus:ring-1 focus:ring-point"
        />
      </main>
      <div className="shrink-0 border-t border-line-soft bg-white px-5 py-3">
        <button
          onClick={submit}
          disabled={!title.trim() || !body.trim()}
          className="h-12 w-full rounded-xl bg-point text-[15px] font-semibold text-white disabled:bg-disabled"
        >
          수정 완료
        </button>
      </div>
    </>
  );
}
