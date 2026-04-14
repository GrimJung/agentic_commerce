import { motion } from "motion/react";
import { Check, PencilLine } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { cn } from "./ui/utils";
import { PackageServiceFooter } from "./PackageServiceFooter";

interface BookingConfirmationProps {
  bookingNumber: string;
  packageTitle: string;
  travelers: number;
  amount: number;
  onClose: () => void;
  /** 결제완료 문구용 예약자명 */
  bookerName?: string;
  /** 여행기간 표시 */
  travelPeriod?: string;
  /** 남은 결제금액 (전액 결제 시 0) */
  remainingAmount?: number;
  /** 패키지 결제완료 시에만 하단 법무 푸터 */
  showServiceFooter?: boolean;
}

export function BookingConfirmation({
  bookingNumber,
  packageTitle,
  travelers,
  amount,
  onClose,
  bookerName = "고객",
  travelPeriod,
  remainingAmount = 0,
  showServiceFooter = false,
}: BookingConfirmationProps) {
  useLockBodyScroll();
  const displayName = bookerName.endsWith("님") ? bookerName : `${bookerName}님`;

  const actionButtons = (
    <div className="w-full space-y-2.5 px-4 pt-4 pb-3">
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-[14px] bg-[#3780ff] py-4 text-[15px] font-['Pretendard:SemiBold',sans-serif] text-white transition-colors hover:bg-[#2d6fdf] active:bg-[#256bd0]"
      >
        확인
      </button>
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-[14px] border border-[#e5e5e5] bg-white py-4 text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#555] transition-colors hover:bg-[#f5f5f5]"
      >
        예약 내역 보기
      </button>
    </div>
  );

  const summaryBlock = (
    <>
      {/* 상단 성공 배너 */}
      <div className="w-full bg-[#3780ff] px-5 pt-8 pb-14 flex items-start justify-between gap-4">
        <div>
          <p className="text-white text-[20px] font-['Pretendard:Bold',sans-serif] leading-snug">
            {displayName}
          </p>
          <p className="text-white/90 text-[15px] mt-1.5 leading-snug">
            결제가 완료되었습니다.
          </p>
        </div>
        <div className="size-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
          <svg className="size-7 text-[#3780ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>

      {/* 예약 요약 카드 — 배너와 겹치게 올림 */}
      <div className="w-full px-4 -mt-8 relative z-10">
        <div className="w-full bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.10)] border border-[#eee] overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-[#f5f5f5]">
            <p className="text-[12px] text-[#999] mb-1">예약 상품</p>
            <p className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] leading-snug line-clamp-2">
              {packageTitle}
            </p>
          </div>

          <div className="px-5 py-4 space-y-3">
            <Row label="예약번호" value={bookingNumber} highlight />
            {travelPeriod && <Row label="여행기간" value={travelPeriod} />}
            <Row label="여행인원" value={`성인 ${travelers}명`} />
          </div>

          <div className="px-5 py-4 border-t border-[#f0f0f0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#666]">결제금액</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] tabular-nums">
                {amount.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#666]">남은 결제금액</span>
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111] tabular-nums">
                {remainingAmount.toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="mx-4 mb-5 px-3.5 py-3 bg-[#f8f8f8] rounded-[12px]">
            <p className="text-[12px] text-[#777] leading-relaxed">
              당일 배정된 여행담당자가 있습니다. 궁금하신 사항은 담당자를 통해서 확인하실 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className={cn(
        "fixed inset-0 z-[70] flex h-full min-h-0 w-full flex-col bg-white",
        showServiceFooter ? "max-w-none" : "mx-auto max-w-[390px]",
      )}
    >
      <div className="flex h-[52px] w-full shrink-0 items-center justify-between border-b border-[#f0f0f0] bg-white px-5">
        <h1 className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#111]">
          결제완료
        </h1>
        <button type="button" onClick={onClose} aria-label="홈으로" className="p-1">
          <svg className="size-7" viewBox="0 0 28 28" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12L14 4L24 12V24H17V17H11V24H4V12Z" />
          </svg>
        </button>
      </div>

      {showServiceFooter ? (
        <div className="min-h-0 flex-1 w-full overflow-y-auto pb-2">
          {summaryBlock}
          {actionButtons}
          <PackageCompletionPromoSections />
          <div className="mt-6 w-full bg-white">
            <PackageServiceFooter />
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 w-full overflow-y-auto pb-2">{summaryBlock}</div>
          <div className="w-full shrink-0 border-t border-[#eee] bg-white">{actionButtons}</div>
        </>
      )}
    </motion.div>
  );
}

/** 패키지 결제완료 화면 중간 안내·프로모 블록 (여행자 정보 / 통합회원 / 여행자보험) */
function PackageCompletionPromoSections() {
  return (
    <div className="w-full space-y-4 px-4 pb-6 pt-2">
      {/* 여행자 정보 나중 입력 안내 */}
      <section className="rounded-[16px] border border-[#eee] bg-white px-4 py-5 shadow-sm">
        <p className="mb-3 inline-flex items-center gap-1 rounded-full bg-[#f3f0ff] px-3 py-1 text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#5e2bb8]">
          잠깐만요! <span aria-hidden>🖐️</span>
        </p>
        <h2 className="text-[16px] font-['Pretendard:Bold',sans-serif] leading-snug text-[#111]">
          여행자 정보 나중에 입력하기를 선택하셨네요.
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[#666]">
          여행자 정보는 여행 안내 및 계약서 발송을 위해{" "}
          <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">출발일 3일전까지</span> 입력되어야 합니다.
        </p>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#e0e0e0] bg-white py-3.5 text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#3780ff] transition-colors hover:bg-[#f8fbff]"
        >
          <PencilLine className="size-[18px] shrink-0" strokeWidth={2} />
          여행자정보 입력하기
        </button>
      </section>

      {/* 통합회원 전환 배너 */}
      <section className="relative overflow-hidden rounded-[14px] bg-gradient-to-r from-[#e3efff] to-[#d4e8ff] px-4 py-4">
        <p className="relative z-[1] max-w-[72%] text-[14px] font-['Pretendard:SemiBold',sans-serif] leading-snug text-[#1a3a5c]">
          지금 통합회원으로 전환하고,{" "}
          <span className="font-['Pretendard:Bold',sans-serif] text-[#0d47a1]">결제금액의 1% 적립 받으세요!</span>
        </p>
        <div className="pointer-events-none absolute -right-1 bottom-0 top-0 flex w-[38%] items-center justify-end pr-2">
          <div className="relative flex size-[72px] items-center justify-center">
            <span className="absolute size-14 rounded-full bg-[#3780ff]/25" />
            <span className="absolute right-2 top-2 size-10 rounded-full bg-[#3780ff]/35" />
            <span className="relative flex size-12 items-center justify-center rounded-full bg-[#3780ff] text-[18px] font-bold text-white shadow-md">
              m
            </span>
          </div>
        </div>
      </section>

      {/* 여행자보험 */}
      <section>
        <h2 className="text-[16px] font-['Pretendard:Bold',sans-serif] text-[#111]">
          여행 전, 여행자보험 가입하셨나요?
        </h2>
        <p className="mt-1 text-[13px] text-[#777]">안전한 여행을 위한 필수품, 미리 준비하세요.</p>

        <div className="mt-3 overflow-hidden rounded-[16px] border border-[#f0e6e0] bg-[#fff9f5] p-4">
          <div className="flex gap-3">
            <ul className="min-w-0 flex-1 space-y-2.5 text-[12px] leading-snug text-[#555]">
              {[
                "해외여행 중에만 켜지는 Smart ON",
                "동반 가족도 함께 가입 가능",
                "맞춤 플랜으로 부담 없이 준비",
                "출발 전 간편하게 온라인 가입",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#ff6b2c]" strokeWidth={2.5} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="shrink-0" aria-hidden>
              <div className="flex size-[64px] flex-col items-center justify-center rounded-[12px] bg-white/80 shadow-sm sm:size-[72px]">
                <span className="text-[28px] leading-none sm:text-[32px]">✈️</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-[12px] bg-[#ff6b2c] py-3.5 text-[14px] font-['Pretendard:SemiBold',sans-serif] text-white transition-colors hover:bg-[#f55a1a]"
          >
            여행자보험 가입하기
          </button>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[13px] text-[#999] shrink-0">{label}</span>
      <span className={`text-right text-[13px] leading-snug ${highlight ? "font-['Pretendard:Bold',sans-serif] text-[#3780ff]" : "font-['Pretendard:SemiBold',sans-serif] text-[#111]"}`}>
        {value}
      </span>
    </div>
  );
}
