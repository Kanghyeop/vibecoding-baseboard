import { AppHeader } from "@/components/shell";

// 개인정보처리방침 (베이스라인용 축약본 - 실서비스에선 법률 검토를 거친 문안으로 교체)
const SECTIONS: [string, string][] = [
  ["1. 수집하는 항목", "구글 로그인 시 이메일 주소와 프로필 이미지를 수집합니다. 그 외 별도의 개인정보는 수집하지 않습니다."],
  ["2. 이용 목적", "수집한 정보는 회원 식별, 서비스 제공, 부정 이용 방지에만 사용합니다. 마케팅 수신에 동의한 경우에 한해 이벤트·혜택 소식을 보냅니다."],
  ["3. 보관과 파기", "개인정보는 회원 탈퇴 시까지 보관하며, 탈퇴 시 지체 없이 파기합니다. 단, 작성한 게시물은 작성자 표시를 익명화한 상태로 남습니다."],
  ["4. 제3자 제공", "법령에 따른 요청을 제외하고 개인정보를 제3자에게 제공하지 않습니다."],
  ["5. 마케팅 수신 동의", "마케팅 수신 동의는 선택 항목이며, 마이페이지 설정에서 언제든지 변경할 수 있습니다. 동의하지 않아도 서비스 이용에 제한이 없습니다."],
  ["6. 문의", "개인정보 관련 문의는 help@baseboard.app으로 보내주세요."],
];

export default function PrivacyPage() {
  return (
    <>
      <AppHeader title="개인정보처리방침" back />
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
