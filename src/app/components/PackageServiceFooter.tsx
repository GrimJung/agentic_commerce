import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./ui/utils";

/**
 * 패키지 예약·결제·결제완료 플로우 하단 법무/안내 푸터 (하나투어 스타일 목업)
 */
export function PackageServiceFooter({ className }: { className?: string }) {
  const [companyOpen, setCompanyOpen] = useState(false);

  return (
    <footer
      className={cn(
        "w-full bg-white text-[#333] border-t border-black",
        className,
      )}
    >
      <div className="grid grid-cols-3 border-b border-[#eee]">
        {["로그아웃", "공지사항", "고객센터"].map((label) => (
          <button
            key={label}
            type="button"
            className="py-2.5 text-center text-[13px] text-[#444] font-['Pretendard:Medium',sans-serif] border-r border-[#eee] last:border-r-0 hover:bg-[#fafafa] transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-3.5 pt-3 pb-2 space-y-2">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 text-[13px] leading-snug text-[#666]">
          <button type="button" className="text-[13px] hover:underline">
            이용약관
          </button>
          <span className="text-[11px] text-[#ccc]">•</span>
          <button
            type="button"
            className="text-[13px] font-['Pretendard:Bold',sans-serif] text-[#111] hover:underline"
          >
            개인정보처리방침
          </button>
          <span className="text-[11px] text-[#ccc]">•</span>
          <button type="button" className="text-[13px] hover:underline">
            여행약관
          </button>
          <span className="text-[11px] text-[#ccc]">•</span>
          <button type="button" className="text-[13px] hover:underline">
            해외여행자보험
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[13px] leading-snug text-[#666]">
          <button type="button" className="text-[13px] hover:underline">
            마케팅제휴
          </button>
          <span className="text-[11px] text-[#ccc]">•</span>
          <button type="button" className="text-[13px] hover:underline">
            공식인증예약센터 검색
          </button>
        </div>
      </div>

      <div className="px-3.5 pb-2">
        <button
          type="button"
          onClick={() => setCompanyOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 py-1 text-left"
          aria-expanded={companyOpen}
        >
          <span className="text-[16px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">
            (주)하나투어
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-[#bbb] transition-transform",
              companyOpen && "rotate-180",
            )}
          />
        </button>
        {companyOpen && (
          <p className="mt-1 text-[11px] leading-relaxed text-[#888]">
            대표이사: 홍길동 · 서울특별시 종로구 세종대로 00 · 사업자등록번호 000-00-00000 · 통신판매업신고번호 제0000-서울종로-0000호
          </p>
        )}
      </div>

      <div className="px-3.5 pb-3 space-y-2 border-t border-[#f0f0f0] pt-2.5">
        <p className="text-[10px] leading-[1.55] text-[#888]">
          ※ 부득이한 사정에 의해 여행일정이 변경되는 경우 사전 동의를 받습니다.
        </p>
        <p className="text-[10px] leading-[1.55] text-[#888]">
          ※ 하나투어는 개별 항공권, 단품 및 일부 여행상품에 대하여 통신판매중개자로서 통신판매의 당사자가 아니며 해당상품의 거래정보 및 거래등에 대해 책임을 지지 않습니다.
        </p>
      </div>

      <div className="border-t border-[#f0f0f0] px-3.5 py-2.5">
        <p className="text-left text-[10px] font-['Pretendard:Medium',sans-serif] tracking-[0.04em] text-[#aaa]">
          COPYRIGHT ⓒ HANATOUR SERVICE INC.
        </p>
      </div>
    </footer>
  );
}
