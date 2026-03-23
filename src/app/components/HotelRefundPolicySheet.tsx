"use client";

import { motion, AnimatePresence } from "motion/react";
import { Info, X } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

export interface HotelRefundPolicySheetProps {
  open: boolean;
  onClose: () => void;
  hotelName: string;
  /** 체크인 YYYY.MM.DD */
  checkInYmd: string;
}

function ymdToKoreanLong(ymd: string): string {
  const parts = ymd.split(".").map((s) => parseInt(s, 10));
  if (parts.length !== 3 || parts.some(Number.isNaN)) return ymd;
  const [y, m, d] = parts;
  return `${y}년 ${String(m).padStart(2, "0")}월 ${String(d).padStart(2, "0")}일`;
}

function addDaysYmd(ymd: string, deltaDays: number): string {
  const [y, m, d] = ymd.split(".").map((s) => parseInt(s, 10));
  if ([y, m, d].some(Number.isNaN)) return ymd;
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + deltaDays);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

export function HotelRefundPolicySheet({
  open,
  onClose,
  hotelName,
  checkInYmd,
}: HotelRefundPolicySheetProps) {
  useLockBodyScroll(open);

  const checkInLabel = ymdToKoreanLong(checkInYmd);
  const d6 = ymdToKoreanLong(addDaysYmd(checkInYmd, -6));
  const d5 = ymdToKoreanLong(addDaysYmd(checkInYmd, -5));
  const d1 = ymdToKoreanLong(addDaysYmd(checkInYmd, -1));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="hotel-refund-backdrop"
            role="presentation"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 overscroll-none touch-none"
            onClick={onClose}
          />
          <motion.div
            key="hotel-refund-sheet"
            role="dialog"
            aria-modal
            aria-labelledby="hotel-refund-policy-title"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none overscroll-none"
          >
            <div
              className="pointer-events-auto bg-white w-full max-w-[390px] max-h-[85vh] rounded-[24px] flex flex-col overflow-hidden shadow-xl min-h-0 overscroll-contain"
              onWheel={(e) => e.stopPropagation()}
            >
            <div className="shrink-0 flex items-start justify-between gap-3 px-5 pt-5 pb-2">
              <h2
                id="hotel-refund-policy-title"
                className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111] min-w-0 flex-1 leading-snug"
              >
                {hotelName}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 p-2 -mr-2 -mt-1 rounded-full hover:bg-[#f5f5f5] transition-colors"
                aria-label="닫기"
              >
                <X className="size-5 text-[#111]" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 pt-0 pb-2 touch-pan-y">
              <p className="text-[13px] text-[#666] leading-[1.5] mb-5">
                {checkInLabel} 체크인 예약에 대한 취소약관
              </p>

              <ul className="space-y-3 mb-4 text-[13px] leading-[1.55]">
                <li>
                  <span className="text-[#5e2bb8] font-['Pretendard:SemiBold',sans-serif]">
                    {d6} 16시 까지
                  </span>
                  <br />
                  <span className="text-[#111]">취소수수료 없음</span>
                </li>
                <li>
                  <span className="text-[#5e2bb8] font-['Pretendard:SemiBold',sans-serif]">
                    {d5} 16시 까지 취소 시,
                  </span>
                  <br />
                  <span className="text-[#111]">취소수수료 546원 부과</span>
                </li>
                <li>
                  <span className="text-[#5e2bb8] font-['Pretendard:SemiBold',sans-serif]">
                    {d1} 16시 까지 취소 시,
                  </span>
                  <br />
                  <span className="text-[#111]">취소수수료 1,092원 부과</span>
                </li>
                <li>
                  <span className="text-[#5e2bb8] font-['Pretendard:SemiBold',sans-serif]">
                    {checkInLabel} 16시 까지 취소 시,
                  </span>
                  <br />
                  <span className="text-[#111]">취소수수료 전액 부과</span>
                </li>
              </ul>

              <p className="text-[12px] text-[#999] leading-[1.5] mb-5">
                취소수수료는 마일리지로 결제할 수 없으며, 자세한 사항은 사이트 이용약관 제9조를 참고해 주세요.
              </p>

              <div className="rounded-[16px] bg-[#f5f5f5] p-4 mb-2">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="size-[18px] shrink-0 text-[#111]" strokeWidth={2} aria-hidden />
                  <span className="text-[14px] font-['Pretendard:Bold',sans-serif] text-[#111]">주의사항</span>
                </div>

                <p className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111] mb-2">
                  예약처리사항
                </p>
                <ul className="list-disc list-outside space-y-2 pl-4 text-[12px] text-[#666] leading-[1.55] marker:text-[#bbb] mb-4">
                  <li>예약 확정 후 성명·일정·객실타입 변경은 불가합니다.</li>
                  <li>
                    취소 마감 이후 취소 또는 노쇼(No-show) 시 환불되지 않습니다. (After the cancellation deadline,
                    cancellations or no-shows are non-refundable. Name, date, and room type changes are not allowed
                    after confirmation.)
                  </li>
                </ul>

                <p className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111] mb-2">
                  환불 불가 요금 관련 규정
                </p>
                <ul className="list-disc list-outside space-y-2 pl-4 text-[12px] text-[#666] leading-[1.55] marker:text-[#bbb]">
                  <li>
                    공정거래위원회 고시에 따라 환불 불가 요금은 별도 고지·동의 절차를 거칩니다.
                  </li>
                  <li>
                    체크인 120일 이전 요청 시 무료 변경·환불이 가능할 수 있으며, 그 외에는 약관상 수수료가 적용됩니다.
                  </li>
                  <li>취소 약관상의 날짜는 모두 한국시간 기준입니다.</li>
                </ul>
              </div>
            </div>

            <div className="shrink-0 px-5 py-4 border-t border-[#f0f0f0] bg-white">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 bg-[#6332c1] text-white rounded-[30px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#5429a8] transition-colors"
              >
                확인
              </button>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
