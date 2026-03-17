import { motion } from "motion/react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

interface BookingConfirmationProps {
  bookingNumber: string;
  packageTitle: string;
  travelers: number;
  amount: number;
  onClose: () => void;
  /** 결제완료 문구용 예약자명 (예: "정그림님") */
  bookerName?: string;
  /** 여행기간 표시 (예: "2026.04.01-2026.04.03 / 2박 3일") */
  travelPeriod?: string;
  /** 남은 결제금액 (전액 결제 시 0) */
  remainingAmount?: number;
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
}: BookingConfirmationProps) {
  useLockBodyScroll();
  const displayName = bookerName.endsWith("님") ? bookerName : `${bookerName}님`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[70] flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-white w-full max-h-[90vh] flex flex-col justify-center items-center rounded-t-[24px] overflow-hidden"
      >
        {/* 헤더: 결제완료 */}
        <div className="shrink-0 flex items-center px-4 py-3 border-b border-[#eee]">
          <h1 className="font-['Pretendard:SemiBold',sans-serif] text-[18px] text-[#111]">
            결제완료
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          {/* 파란 성공 배너 */}
          <div className="bg-[#3780ff] px-4 pt-6 pb-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-white text-[18px] font-['Pretendard:SemiBold',sans-serif]">
                {displayName}
              </p>
              <p className="text-white text-[16px] mt-1">
                결제가 완료되었습니다.
              </p>
            </div>
            <div className="size-12 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg className="size-7 text-[#3780ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>

          {/* 흰색 결제 요약 카드 (배너와 겹치도록 위로 당김) */}
          <div className="px-4 -mt-6 relative z-10">
            <div className="bg-white rounded-[20px] shadow-lg border border-[#eee] overflow-hidden p-5">
              <h2 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-4 line-clamp-2">
                {packageTitle}
              </h2>
              <dl className="space-y-2.5 text-[13px]">
                <div className="flex justify-between">
                  <dt className="text-[#666]">예약번호</dt>
                  <dd className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{bookingNumber}</dd>
                </div>
                {travelPeriod && (
                  <div className="flex justify-between">
                    <dt className="text-[#666]">여행기간</dt>
                    <dd className="text-[#111]">{travelPeriod}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[#666]">여행인원</dt>
                  <dd className="text-[#111]">성인 {travelers}, 아동 0, 유아 0</dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#f0f0f0]">
                  <dt className="text-[#666]">결제금액</dt>
                  <dd className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{amount.toLocaleString()}원</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#666]">남은 결제금액</dt>
                  <dd className="text-[#111]">{remainingAmount.toLocaleString()}원</dd>
                </div>
              </dl>
              <div className="mt-4 p-3 bg-[#f5f5f5] rounded-[12px] text-[12px] text-[#666] leading-relaxed">
                당일 배정된 여행담당자가 있습니다. 궁금하신 사항은 담당자를 통해서 확인하실 수 있어요.
              </div>
            </div>
          </div>

          {/* 확인 / 예약 내역 보기 버튼 */}
          <div className="px-4 pt-6 pb-8 space-y-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 bg-[#3780ff] text-white rounded-[12px] text-[16px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2d6fdf] transition-colors"
            >
              확인
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 bg-white border border-[#e5e5e5] text-[#555] rounded-[12px] text-[16px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f9f9f9] transition-colors"
            >
              예약 내역 보기
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
