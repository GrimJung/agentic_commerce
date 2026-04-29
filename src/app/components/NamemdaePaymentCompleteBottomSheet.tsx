import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";

export interface NamemdaePaymentCompleteBottomSheetProps {
  open: boolean;
  /** 예: 김하나 — 뒤에 "님" 붙임 */
  bookerName: string;
  combinedReservationNo?: string;
  flightReservationNo?: string;
  hotelReservationNo?: string;
  onDismiss: () => void;
}

export function NamemdaePaymentCompleteBottomSheet({
  open,
  bookerName,
  combinedReservationNo = "ZZ991238123",
  flightReservationNo = "HA12345678910",
  hotelReservationNo = "HH12345678910",
  onDismiss,
}: NamemdaePaymentCompleteBottomSheetProps) {
  if (!open || typeof document === "undefined") return null;

  const displayName = bookerName.trim() || "고객";

  return createPortal(
    <div
      className="fixed inset-0 z-[101] flex items-end bg-black/65"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-complete-title"
      onClick={onDismiss}
    >
      <div
        className="flex max-h-[96vh] min-h-[90vh] w-full flex-col overflow-hidden rounded-t-[24px] bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 블루 헤더 */}
        <div className="relative shrink-0 rounded-t-[24px] bg-[#2f80ed] px-5 pb-16 pt-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2
              id="payment-complete-title"
              className="text-[17px] font-['Pretendard:Bold',sans-serif] font-bold text-white"
            >
              결제 완료
            </h2>
            <button
              type="button"
              onClick={onDismiss}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10"
              aria-label="닫기"
            >
              <X className="size-6" strokeWidth={2} aria-hidden />
            </button>
          </div>
          <div className="flex items-start justify-between gap-3 pr-1">
            <p className="max-w-[min(100%,240px)] text-[20px] font-['Pretendard:Bold',sans-serif] font-bold leading-[1.35] text-white">
              {displayName}님, 항공+호텔 예약이 완료되었어요.
            </p>
            <div
              className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[#b3d4ff]"
              aria-hidden
            >
              <Check className="size-7 text-[#1e5bb8]" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* 카드 — 헤더와 겹침 */}
        <div className="relative z-[1] -mt-10 mx-5 shrink-0 rounded-[16px] border border-[#eee] bg-white px-4 py-4 shadow-md">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">
              통합예약번호
            </span>
            <span className="text-[15px] font-['Pretendard:Bold',sans-serif] tabular-nums text-[#111]">
              {combinedReservationNo}
            </span>
          </div>
          <div className="my-3 border-t border-dashed border-[#ddd]" />
          <div className="space-y-2.5 text-[13px] font-['Pretendard:Medium',sans-serif]">
            <div className="flex justify-between gap-2">
              <span className="text-[#888]">항공예약번호</span>
              <span className="tabular-nums text-[#666]">{flightReservationNo}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#888]">호텔예약번호</span>
              <span className="tabular-nums text-[#666]">{hotelReservationNo}</span>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <ul className="space-y-3 text-[12px] font-['Pretendard:Medium',sans-serif] leading-[1.55] text-[#767676]">
            <li className="flex gap-2">
              <span className="shrink-0">•</span>
              <span>
                일부 항공권의 경우 당일 예약취소가 불가능하고 평일 업무시간(09:00~17:00) 에 환불로 접수되므로
                확인하시기 바랍니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">•</span>
              <span>예약내역 상세에서 항공 여정, 규정 및 결제시한 등 확인하시기 바랍니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">•</span>
              <span>
                국가/지역별로 입국 제한 및 자가격리, PCR 음성 확인서가 필요할 수 있습니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">•</span>
              <span>
                일부 부정기편은 대한민국 여권 소지자만 가능하며 외국 국적에 대한 탑승 제한 및 가능 예외 사항이
                있으니 자세한 사항은 외교부, 항공사, 대사관 등을 통해 확인 후 문제 없도록 준비하시기 바랍니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">•</span>
              <span>
                여권정보, 체류지정보 등록을 완료하지 않은 경우, 출발일 72시간 전까지 반드시 등록하셔야 합니다.
              </span>
            </li>
          </ul>
          <div className="mt-8 flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={onDismiss}
              className="w-full rounded-[30px] border border-[#e0e0e0] bg-white py-3.5 text-[14px] font-['Pretendard:Bold',sans-serif] text-[#111] transition-colors hover:bg-[#fafafa]"
            >
              확인
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="w-full rounded-[30px] bg-[#4a1f94] py-3.5 text-[14px] font-['Pretendard:Bold',sans-serif] text-white transition-colors hover:bg-[rgba(74,33,144,1)]"
            >
              예약내역 확인하기
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
