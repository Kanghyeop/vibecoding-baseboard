import Link from "next/link";

// 없는 주소로 들어왔을 때. 디자인 시스템의 빈 상태 규칙을 따른다.
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-5">
      <p className="text-[22px] font-bold leading-[30px]">페이지가 없어요</p>
      <p className="text-[13px] leading-[18px] text-faint">
        주소가 잘못되었거나 삭제된 페이지예요
      </p>
      <Link
        href="/"
        className="mt-2 flex h-12 items-center justify-center rounded-xl bg-soft px-6 text-[15px] font-semibold"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
