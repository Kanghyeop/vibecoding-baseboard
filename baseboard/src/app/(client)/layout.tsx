import { MobileFrame } from "@/components/shell";

// 유저 화면 전체를 360×800 모바일 프레임으로 감싼다.
// 어드민(/admin)은 이 그룹 밖이라 프레임 없이 데스크톱으로 렌더된다.
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <MobileFrame>{children}</MobileFrame>;
}
