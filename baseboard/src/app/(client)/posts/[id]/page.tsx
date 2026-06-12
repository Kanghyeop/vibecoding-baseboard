"use client";

import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { ActionSheet, AppHeader, useLoginGate } from "@/components/shell";
import { useDialog } from "@/components/dialog";
import { IconHeart, IconMore } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { timeAgo } from "@/lib/util";

interface CommentItem {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: number;
  deleted: boolean;
}

interface PostDetail {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  edited: boolean;
  likes: string[];
  comments: CommentItem[];
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { userId } = useAuth();
  const { requireLogin } = useLoginGate();
  const dialog = useDialog();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [comment, setComment] = useState("");
  // ⋯ 메뉴(액션시트) 대상: 글 자체 또는 특정 댓글
  const [sheet, setSheet] = useState<null | { type: "post" } | { type: "comment"; cid: string; mine: boolean }>(null);
  // 신고 사유 선택 시트 대상
  const [reportTarget, setReportTarget] = useState<null | { targetType: "post" | "comment"; targetId: string }>(null);

  const load = useCallback(() => {
    fetch(`/api/posts/${id}`).then(async (r) => {
      if (!r.ok) return setNotFound(true);
      setPost(await r.json());
    });
  }, [id]);

  useEffect(load, [load]);

  const toggleLike = async () => {
    if (!requireLogin()) return;
    await fetch(`/api/posts/${id}/like`, { method: "POST", body: JSON.stringify({ userId }) });
    load();
  };

  const submitComment = async () => {
    if (!requireLogin() || !comment.trim()) return;
    await fetch(`/api/posts/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ userId, body: comment }),
    });
    setComment("");
    load();
  };

  const deleteComment = async (cid: string) => {
    if (!(await dialog.confirm("댓글을 삭제할까요?", { confirmLabel: "삭제" }))) return;
    await fetch(`/api/comments/${cid}`, { method: "DELETE", body: JSON.stringify({ userId }) });
    load();
  };

  const deletePost = async () => {
    if (!(await dialog.confirm("글을 삭제할까요?", { confirmLabel: "삭제" }))) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE", body: JSON.stringify({ userId }) });
    router.replace("/");
  };

  const startReport = (targetType: "post" | "comment", targetId: string) => {
    if (!requireLogin()) return;
    setReportTarget({ targetType, targetId });
  };

  const submitReport = async (reason: string) => {
    if (!reportTarget) return;
    await fetch("/api/reports", {
      method: "POST",
      body: JSON.stringify({ userId, ...reportTarget, reason }),
    });
    setReportTarget(null);
    dialog.alert("신고가 접수되었어요.\n운영팀이 확인 후 처리할게요.");
  };

  if (notFound)
    return (
      <>
        <AppHeader title="" back />
        <p className="py-16 text-center text-[13px] text-faint">글을 찾을 수 없어요</p>
      </>
    );
  if (!post)
    return (
      <>
        <AppHeader title="" back />
        <p className="py-16 text-center text-[13px] text-faint">불러오는 중...</p>
      </>
    );

  const liked = !!userId && post.likes.includes(userId);
  const mine = userId === post.authorId;

  return (
    <>
      <AppHeader
        title=""
        back
        right={
          <button onClick={() => setSheet({ type: "post" })} aria-label="더보기" className="-mr-1 p-1 text-sub">
            <IconMore />
          </button>
        }
      />
      <main className="flex-1 overflow-y-auto">
        <article className="px-5 py-4">
          <h2 className="text-[19px] font-bold leading-[26px]">{post.title}</h2>
          <p className="mt-2 text-[13px] leading-[18px] text-faint">
            <span className="text-sub">{post.authorName}</span> · {timeAgo(post.createdAt)}
            {post.edited && <span className="ml-1 text-[11px]">수정됨</span>}
          </p>
          <p className="mt-4 whitespace-pre-wrap text-[15px] leading-[24px]">{post.body}</p>

          <button
            onClick={toggleLike}
            className={`mt-6 flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[13px] ${
              liked ? "border-point bg-point-soft text-point" : "border-line text-sub"
            }`}
          >
            <IconHeart size={16} filled={liked} />
            좋아요 {post.likes.length}
          </button>
        </article>

        <div className="mt-2 border-t-8 border-line-soft px-5 py-4">
          <p className="text-[16px] font-semibold leading-[24px]">댓글 {post.comments.filter((c) => !c.deleted).length}</p>
          <ul className="mt-2">
            {post.comments.map((c) => (
              <li key={c.id} className="border-b border-line-soft py-3 last:border-0">
                {c.deleted ? (
                  <p className="text-[13px] text-faint">삭제된 댓글입니다</p>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-[13px] leading-[18px]">
                      <span className="font-semibold">{c.authorName}</span>
                      <span className="text-faint">{timeAgo(c.createdAt)}</span>
                      <button
                        onClick={() => setSheet({ type: "comment", cid: c.id, mine: c.authorId === userId })}
                        aria-label="댓글 더보기"
                        className="ml-auto p-0.5 text-faint"
                      >
                        <IconMore size={16} />
                      </button>
                    </div>
                    <p className="mt-1 text-[15px] leading-[24px]">{c.body}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* 댓글 입력바 */}
      <div className="flex shrink-0 items-center gap-2 border-t border-line-soft bg-white px-5 py-3">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && submitComment()}
          onFocus={() => requireLogin()}
          placeholder="댓글을 입력하세요"
          className="h-10 flex-1 rounded-xl bg-soft px-3 text-[15px] outline-none focus:ring-1 focus:ring-point"
        />
        <button
          onClick={submitComment}
          disabled={!comment.trim()}
          className="h-10 rounded-xl bg-point px-4 text-[13px] font-semibold text-white disabled:bg-disabled"
        >
          등록
        </button>
      </div>

      {/* ⋯ 메뉴: 본인 것이면 수정·삭제, 남의 것이면 신고 */}
      <ActionSheet
        open={sheet !== null}
        onClose={() => setSheet(null)}
        items={
          sheet?.type === "post"
            ? mine
              ? [
                  { label: "수정", onClick: () => router.push(`/posts/${id}/edit`) },
                  { label: "삭제", danger: true, onClick: deletePost },
                ]
              : [{ label: "신고하기", danger: true, onClick: () => startReport("post", id) }]
            : sheet?.type === "comment"
              ? sheet.mine
                ? [{ label: "삭제", danger: true, onClick: () => deleteComment(sheet.cid) }]
                : [{ label: "신고하기", danger: true, onClick: () => startReport("comment", sheet.cid) }]
              : []
        }
      />

      {/* 신고 사유 선택 */}
      <ActionSheet
        open={reportTarget !== null}
        onClose={() => setReportTarget(null)}
        items={["스팸·홍보", "욕설·비방", "음란물", "기타"].map((reason) => ({
          label: reason,
          onClick: () => submitReport(reason),
        }))}
      />
    </>
  );
}
