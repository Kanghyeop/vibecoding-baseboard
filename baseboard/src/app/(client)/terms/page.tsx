import { AppHeader } from "@/components/shell";

// 이용약관 (베이스라인용 축약본 - 실서비스에선 법률 검토를 거친 문안으로 교체)
const SECTIONS: [string, string][] = [
  ["제1조 (목적)", "이 약관은 베이스보드(이하 \"서비스\")의 이용 조건과 운영에 관한 기본적인 사항을 정합니다."],
  ["제2조 (계정)", "서비스 가입은 구글 계정 로그인으로 이루어지며, 최초 로그인 시 회원으로 등록됩니다. 닉네임은 자동 생성되며 마이페이지에서 변경할 수 있습니다."],
  ["제3조 (게시물)", "회원이 작성한 글과 댓글의 책임은 작성자 본인에게 있습니다. 타인의 권리를 침해하거나 법령에 위반되는 게시물은 사전 통보 없이 숨김 또는 삭제될 수 있습니다."],
  ["제4조 (이용 제한)", "운영 정책을 위반한 계정은 쓰기 기능(글·댓글·좋아요)이 제한될 수 있습니다. 제한된 계정은 열람만 가능합니다."],
  ["제5조 (탈퇴)", "회원은 언제든지 마이페이지에서 탈퇴할 수 있습니다. 탈퇴 후 작성한 게시물은 남되 작성자는 \"탈퇴한 사용자\"로 표시됩니다."],
  ["제6조 (약관의 변경)", "약관이 변경되는 경우 서비스 내 공지로 알립니다. 변경 후에도 서비스를 계속 이용하면 변경된 약관에 동의한 것으로 봅니다."],
];

export default function TermsPage() {
  return (
    <>
      <AppHeader title="이용약관" back />
      <main className="flex-1 overflow-y-auto px-5 py-4">
        {SECTIONS.map(([title, body]) => (
          <section key={title} className="mb-4">
            <h2 className="text-[16px] font-semibold leading-[24px]">{title}</h2>
            <p className="mt-1 text-[15px] leading-[24px] text-sub">{body}</p>
          </section>
        ))}
        <p className="mt-6 text-[11px] leading-[14px] text-faint">시행일: 2026년 1월 1일</p>
      </main>
    </>
  );
}
