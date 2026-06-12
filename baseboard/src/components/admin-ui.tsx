// 어드민 공용 조각: 페이지 헤더, 카드, 표 스타일, 작은 버튼, 상태 배지.
// 회색 페이지 배경 위에 흰 카드를 얹는 표준 SaaS 어드민 문법.

export const STATUS_LABEL: Record<string, string> = {
  public: "공개",
  hidden: "숨김",
  deleted: "삭제",
  active: "정상",
  blocked: "차단",
  left: "탈퇴",
};

// 상태 배지는 전부 무채색. 키컬러는 의미 있는 경고(미처리 신고 등)에만 아껴 쓴다.
export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "public" || status === "active"
      ? "bg-soft text-sub"
      : status === "hidden" || status === "blocked"
        ? "bg-ink text-white"
        : "bg-soft text-faint line-through";
  return (
    <span className={`inline-block rounded-lg px-2 py-0.5 text-[12px] ${tone}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function PageHeader({ title, desc, right }: { title: string; desc?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[19px] font-bold leading-[26px]">{title}</h1>
        {desc && <p className="mt-1 text-[13px] leading-[18px] text-sub">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

// 흰색 카드. 표는 이 안에 넣고, 모바일에선 가로 스크롤로 본다.
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-white ${className}`}>
      {children}
    </div>
  );
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <div className="overflow-x-auto">{children}</div>
    </Card>
  );
}

export const table = "w-full border-collapse text-left";
export const th =
  "whitespace-nowrap border-b border-line bg-soft px-4 py-2.5 text-[12px] font-semibold text-sub";
export const td = "border-b border-line-soft px-4 py-3 text-[14px]";
export const trHover = "transition-colors hover:bg-soft/60";

// 표 안 처리 버튼 (밑줄 링크 대신 작은 보더 버튼)
export const btnSm =
  "rounded-lg border border-line bg-white px-2.5 py-1 text-[12px] font-medium text-sub hover:bg-soft";
export const btnSmDanger =
  "rounded-lg border border-line bg-white px-2.5 py-1 text-[12px] font-medium text-negative hover:bg-soft";
