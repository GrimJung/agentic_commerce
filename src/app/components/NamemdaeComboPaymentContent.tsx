import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronRight, ChevronUp, CircleAlert, Loader2, X } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { NamemdaePaymentCompleteBottomSheet } from "./NamemdaePaymentCompleteBottomSheet";

export interface NamemdaeComboPaymentContentProps {
  totalAmount: number;
  /** 상품 금액 (미입력 시 totalAmount) */
  productAmount?: number;
  discountAmount?: number;
  /** 결제 완료 시트 등에 표시 */
  bookerName: string;
  onPayComplete: () => void;
  /** 결제 완료 시트 닫을 때 — 항공+호텔 시트 닫고 대화로 복귀 등 */
  onClosePaymentSuccess?: () => void;
  /**
   * 카드 분리 승인 안내용 — 1차(항공 등) 승인 금액.
   * 미입력 시 총액을 반반 분할합니다.
   */
  airApprovalAmount?: number;
}

type CancellationPenaltyInsuranceChoice = "enroll" | "skip";
type CashReceiptRegister = "register" | "unregistered";

export function NamemdaeComboPaymentContent({
  totalAmount,
  productAmount: _productAmount,
  discountAmount = 0,
  bookerName,
  onPayComplete,
  onClosePaymentSuccess,
  airApprovalAmount,
}: NamemdaeComboPaymentContentProps) {
  const [splitCardSheetOpen, setSplitCardSheetOpen] = useState(false);
  const [finalPaymentConfirmOpen, setFinalPaymentConfirmOpen] = useState(false);
  const [paymentCompleteOpen, setPaymentCompleteOpen] = useState(false);
  const [paymentCompleteLoading, setPaymentCompleteLoading] = useState(false);
  const [installment, setInstallment] = useState("");
  const [cardSeg, setCardSeg] = useState(["", "", "", ""]);
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardPwd2, setCardPwd2] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardBirth, setCardBirth] = useState("");
  const [cashReceiptReg, setCashReceiptReg] = useState<CashReceiptRegister>("unregistered");
  const [amountDetailOpen, setAmountDetailOpen] = useState(false);
  const [insuranceChoice, setInsuranceChoice] = useState<"subscribe" | "later">("later");
  const [cancellationPenaltyChoice, setCancellationPenaltyChoice] =
    useState<CancellationPenaltyInsuranceChoice>("skip");
  const [mileageInput, setMileageInput] = useState("");

  const finalAmount = totalAmount;

  const airLineAmount = useMemo(() => {
    if (airApprovalAmount != null && airApprovalAmount > 0) {
      return Math.min(airApprovalAmount, finalAmount);
    }
    return Math.floor(finalAmount / 2);
  }, [airApprovalAmount, finalAmount]);

  const hotelLineAmount = Math.max(0, finalAmount - airLineAmount);
  /** 할인 전 예정 금액 (캡처: 결제 예정 금액) */
  const scheduledPaymentAmount = finalAmount + discountAmount;

  useLockBodyScroll(
    splitCardSheetOpen || finalPaymentConfirmOpen || paymentCompleteOpen || paymentCompleteLoading,
  );

  useEffect(() => {
    if (!paymentCompleteLoading) return;
    const t = window.setTimeout(() => {
      setPaymentCompleteLoading(false);
      setPaymentCompleteOpen(true);
    }, 1500);
    return () => window.clearTimeout(t);
  }, [paymentCompleteLoading]);

  const dismissPaymentComplete = useCallback(() => {
    setPaymentCompleteOpen(false);
    onClosePaymentSuccess?.();
  }, [onClosePaymentSuccess]);

  const backToSplitCardSheet = useCallback(() => {
    setFinalPaymentConfirmOpen(false);
    setSplitCardSheetOpen(true);
  }, []);

  const [approvalAmount1, approvalAmount2] = useMemo(() => {
    const t = finalAmount;
    if (t <= 0) return [0, 0] as const;
    let a1: number;
    if (airApprovalAmount != null && airApprovalAmount > 0) {
      a1 = Math.min(Math.round(airApprovalAmount), Math.max(1, t - 1));
      if (a1 >= t) a1 = Math.floor(t / 2);
    } else {
      a1 = Math.floor(t / 2);
    }
    return [a1, t - a1] as const;
  }, [finalAmount, airApprovalAmount]);

  const setCardSegment = (index: number, raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 4);
    setCardSeg((prev) => {
      const next = [...prev];
      next[index] = d;
      return next;
    });
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto bg-white pb-28">
        <section className="px-5 py-4 border-b border-[#f0f0f0]">
          <h3 className="font-['Pretendard:Bold',sans-serif] text-[18px] font-bold text-[#111] mb-4">
            여행자 보험 가입 선택
          </h3>
          <p className="text-[13px] text-[#666] leading-[1.6] mb-3">
            항공권 구매하면서 안전한 여행을 위해 여행자 보험도 함께 가입해보세요!
          </p>
          <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111] mb-2">상품 선택</p>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-1 py-2.5 border border-[#ddd] rounded-full text-[13px] text-[#444] bg-white hover:bg-[#f9f9f9] transition-colors"
            >
              보장내역 상세보기
              <ChevronRight className="size-4 text-[#888]" />
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-1 py-2.5 border border-[#ddd] rounded-full text-[13px] text-[#444] bg-white hover:bg-[#f9f9f9] transition-colors"
            >
              보험료 상세보기
              <ChevronRight className="size-4 text-[#888]" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setInsuranceChoice("subscribe")}
            className={`w-full text-left rounded-[16px] border-2 p-4 mb-3 transition-colors ${insuranceChoice === "subscribe" ? "border-[#6329C4] bg-white" : "border-[#e5e5e5] bg-white"}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`size-[22px] rounded-full border-2 flex items-center justify-center shrink-0 ${insuranceChoice === "subscribe" ? "border-[#6329C4] bg-[#6329C4]" : "border-[#ccc] bg-white"}`}>
                {insuranceChoice === "subscribe" && (
                  <svg className="size-3.5 text-white" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">여행자 보험 가입하기</span>
            </div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[13px] text-[#555]">총 보험료</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#6329C4]">28,240원</span>
              <span className="text-[#ddd]">|</span>
              <span className="text-[13px] text-[#555]">가입인원</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#6329C4]">2명</span>
              <span className="text-[#ddd]">|</span>
              <span className="text-[13px] text-[#555]">총</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#6329C4]">4일</span>
            </div>
            <p className="text-[12px] text-[#888] mb-3">2026.05.25 00:00 ~ 2026.05.28 23:59</p>
            <div className="bg-[#f8f5ff] rounded-[10px] px-3 py-2.5 space-y-1.5">
              <p className="text-[12px] text-[#666]">
                • 휴대품 분실 한도 <span className="text-[#6329C4]">100만원</span> (1품목 <span className="text-[#6329C4]">20만원</span>)
              </p>
              <p className="text-[12px] text-[#666]">
                • 항공·수하물 지연 <span className="text-[#6329C4]">20만원</span> 한도
              </p>
              <p className="text-[12px] text-[#666]">
                • 해외 상해·질병 의료비 <span className="text-[#6329C4]">5천만원</span> 한도
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setInsuranceChoice("later")}
            className={`w-full text-left rounded-[16px] border-2 p-4 transition-colors ${insuranceChoice === "later" ? "border-[#6329C4] bg-white" : "border-[#e5e5e5] bg-white"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`size-[22px] rounded-full border-2 flex items-center justify-center shrink-0 ${insuranceChoice === "later" ? "border-[#6329C4] bg-[#6329C4]" : "border-[#ccc] bg-white"}`}>
                {insuranceChoice === "later" && (
                  <svg className="size-3.5 text-white" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">보험 나중에 가입하기</span>
            </div>
            <p className="text-[13px] text-[#666] leading-[1.6] pl-8">
              예약 완료 후 마이페이지 예약 내역에서 별도로 가입 가능합니다.
            </p>
          </button>
          <div className="mt-3 bg-[#f8f8f8] rounded-[12px] px-4 py-4">
            <div className="flex items-center gap-1.5 mb-3">
              <svg className="size-4 shrink-0 text-[#555]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#333]">유의사항</span>
            </div>
            <ul className="space-y-2.5">
              <li className="flex gap-2 text-[12px] text-[#555] leading-[1.6]">
                <span className="shrink-0">•</span>
                <span>여행자 보험 관련문의는 보험상담전화 (<span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">1566-0171</span>)으로 하실 수 있습니다. (평일 업무시간 09:00 ~ 18:00 / 주말, 공휴일 제외)</span>
              </li>
              <li className="flex gap-2 text-[12px] leading-[1.6]">
                <span className="shrink-0 text-[#555]">•</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#6329C4]">항공권 변경 및 예약취소 시 여행자 보험은 별도로 변경 및 취소를 진행하셔야 합니다.</span>
              </li>
              <li className="flex gap-2 text-[12px] text-[#555] leading-[1.6]">
                <span className="shrink-0">•</span>
                <span>여행자 보험 확인 및 취소는 마이페이지 예약내역 <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">[여행자 보험 확인/취소]</span> 버튼을 클릭하셔서 확인하시기 바랍니다.</span>
              </li>
              <li className="flex gap-2 text-[12px] text-[#555] leading-[1.6]">
                <span className="shrink-0">•</span>
                <span>여행자 보험은 <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">AXA손해보험</span>과 제휴로 진행되며 하나투어는 해당 상품에 대한 별도의 책임을 지지 않습니다.</span>
              </li>
              <li className="flex gap-2 text-[12px] text-[#555] leading-[1.6]">
                <span className="shrink-0">•</span>
                <span>AXA손해보험과 준법감시필-검-251125-마케팅팀-980(2025.11.25~2026.11.24)</span>
              </li>
              <li className="flex gap-2 text-[12px] text-[#555] leading-[1.6]">
                <span className="shrink-0">•</span>
                <span>자세한 사항은 <span className="text-[#5423AD] underline underline-offset-2 cursor-pointer">보험 가입 시 유의사항</span>을 확인해 주시기 바랍니다.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="px-5 py-4 border-b-8 border-[#f0f0f0]">
          <h3 className="font-['Pretendard:Bold',sans-serif] text-[17px] text-[#111] mb-4">
            항공권 취소 시 위약금 보장 받기 선택
          </h3>
          <div className="mb-3">
            <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111] mb-2">보장내역</p>
            <div className="relative rounded-[12px] overflow-hidden border border-[#eee]">
              <div className="px-4 py-4 space-y-2.5 blur-[3px] select-none pointer-events-none">
                <div className="h-3 bg-[#e0d4f7] rounded-full w-3/4" />
                <div className="h-3 bg-[#e0d4f7] rounded-full w-1/2" />
                <div className="h-3 bg-[#e8e8e8] rounded-full w-2/3" />
                <div className="h-3 bg-[#e8e8e8] rounded-full w-1/3" />
                <div className="h-3 bg-[#e0d4f7] rounded-full w-1/2" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white/90 rounded-full px-5 py-2.5 text-[13px] text-[#555] shadow-sm">
                  <span className="font-['Pretendard:Bold',sans-serif] text-[#6329C4]">가입 버튼 클릭 시</span> 확인 가능해요
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3.5 border border-[#ddd] rounded-full text-[14px] text-[#444] bg-white hover:bg-[#f9f9f9] transition-colors mb-4"
          >
            <span>보장내역 상세보기</span>
            <ChevronRight className="size-4 text-[#888]" />
          </button>
          <button
            type="button"
            onClick={() => setCancellationPenaltyChoice("enroll")}
            className={`w-full text-left rounded-[16px] border-2 p-4 mb-3 transition-colors ${cancellationPenaltyChoice === "enroll" ? "border-[#6329C4]" : "border-[#e5e5e5]"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`size-[22px] rounded-full border-2 flex items-center justify-center shrink-0 ${cancellationPenaltyChoice === "enroll" ? "border-[#6329C4] bg-[#6329C4]" : "border-[#ccc] bg-white"}`}>
                {cancellationPenaltyChoice === "enroll" && (
                  <svg className="size-3.5 text-white" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">항공권 취소 위약금 보상 보험 가입</span>
            </div>
            <p className="text-[13px] text-[#555] pl-8 mb-3">취소 걱정 없이 항공권 구매하세요!</p>
            <div className="flex items-center gap-2 pl-8 flex-wrap">
              <span className="text-[13px] text-[#555]">총 보험료</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#6329C4]">0원</span>
              <span className="text-[#ddd]">|</span>
              <span className="text-[13px] text-[#555]">가입인원</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#6329C4]">2명</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setCancellationPenaltyChoice("skip")}
            className={`w-full text-left rounded-[16px] border-2 p-4 transition-colors ${cancellationPenaltyChoice === "skip" ? "border-[#6329C4]" : "border-[#e5e5e5]"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`size-[22px] rounded-full border-2 flex items-center justify-center shrink-0 ${cancellationPenaltyChoice === "skip" ? "border-[#6329C4] bg-[#6329C4]" : "border-[#ccc] bg-white"}`}>
                {cancellationPenaltyChoice === "skip" && (
                  <svg className="size-3.5 text-white" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">항공권 취소 위약금 보상 보험 미 가입</span>
            </div>
            <p className="text-[13px] text-[#666] leading-[1.6] pl-8">
              발권 완료 후 마이페이지 예약 내역에서 출발 30일 전까지 별도로 가입 가능합니다.<br />
              아래 유의사항을 확인해 주세요.
            </p>
          </button>
          <div className="mt-3 bg-[#f8f8f8] rounded-[12px] px-4 py-4">
            <div className="flex items-center gap-1.5 mb-3">
              <svg className="size-4 shrink-0 text-[#555]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#333]">유의사항</span>
            </div>
            <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#333] mb-1.5">가입 가능 여부</p>
            <p className="text-[12px] text-[#666] leading-[1.6] mb-3">
              발권 완료 후 마이페이지 &gt; 예약내역에서 출발 30일 전까지 가입할 수 있습니다. 출발 30일 이내·발권 이후 일부 조건에서는 가입이 제한될 수 있습니다.
            </p>
            <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#333] mb-1.5">가입 대상 제외</p>
            <ul className="space-y-1.5 mb-3">
              <li className="flex gap-2 text-[12px] text-[#666] leading-[1.6]">
                <span className="shrink-0">•</span>
                <span>만 24개월 미만 영유아, 환불불가(NON-REF) 운임, 재발행·재예약된 항공권 등 일부 조건은 가입 대상에서 제외될 수 있습니다.</span>
              </li>
            </ul>
            <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#333] mb-1.5">해지 및 환불</p>
            <p className="text-[12px] text-[#666] leading-[1.6] mb-3">
              청약일부터 15일 이내 청약철회 시 보험료 전액 환불이 가능합니다. 이후 해지 시에는 약관에 따라 일할 계산 등이 적용될 수 있습니다.
            </p>
            <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#333] mb-1.5">문의처</p>
            <p className="text-[12px] text-[#666] leading-[1.6] mb-3">
              메리츠화재 <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">1566-7711</span> (평일 09:00~18:00, 주말·공휴일 제외)
            </p>
            <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#333] mb-1.5">기타 안내</p>
            <ul className="space-y-1.5">
              <li className="flex gap-2 text-[12px] leading-[1.6]">
                <span className="shrink-0 text-[#666]">•</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#6329C4]">항공권 변경(재발행) 시 보험은 더이상 유효하지 않으며, 직접 취소하셔야 합니다. (취소 후 재가입 불가)</span>
              </li>
              <li className="flex gap-2 text-[12px] text-[#666] leading-[1.6]">
                <span className="shrink-0">•</span>
                <span>환불불가 운임 등 약관상 보장 제외 사유에 해당하는 경우에는 가입하셨더라도 보상이 되지 않을 수 있습니다.</span>
              </li>
              <li className="flex gap-2 text-[12px] text-[#666] leading-[1.6]">
                <span className="shrink-0">•</span>
                <span>가입 여부·보장 내용은 마이페이지 메뉴에서 확인하실 수 있습니다.</span>
              </li>
              <li className="flex gap-2 text-[12px] text-[#666] leading-[1.6]">
                <span className="shrink-0">•</span>
                <span>메리츠화재 준법감시인 심의필-검-마케팅-251125-001 (2025.11.25~2026.11.24)</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="px-5 py-4 border-b-8 border-[#f0f0f0]">
          <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-3">
            할인/혜택 적용
          </h3>

        <div className="flex items-center justify-between py-3 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-[#111]">쿠폰할인</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#999]">0원</span>
            <button
              type="button"
              className="px-3 py-1.5 rounded-full border border-[#ddd] text-[12px] text-[#666] bg-white hover:bg-[#f9f9f9] transition-colors"
            >
              조회
            </button>
          </div>
        </div>

        <div className="border-b border-[#f0f0f0] py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-[#111]">마일리지</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[#4a1f94] tabular-nums font-['Pretendard:Bold',sans-serif]">
                10,000,000m
              </span>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full border border-[#ddd] text-[12px] text-[#666] bg-white hover:bg-[#f9f9f9] transition-colors"
              >
                전액사용
              </button>
            </div>
          </div>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={mileageInput}
            onChange={(e) => setMileageInput(e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            className="mt-3 w-full rounded-[14px] border border-[#d1d5db] bg-white px-4 py-3.5 font-['Pretendard:Medium',sans-serif] text-[15px] tabular-nums text-[#111] placeholder:text-[#ccc] outline-none transition-colors focus:border-[#9ca3af]"
            aria-label="사용 마일리지"
          />
          <p className="mt-2 text-[12px] leading-[1.5] text-[#ababab]">
            1,000 ⓜ 이상 부터 사용 가능, 항공권은 100 ⓜ 단위로 사용 가능
          </p>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-[#f0f0f0]">
          <span className="text-[14px] text-[#111]">상품권</span>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#999]">0원</span>
            <button
              type="button"
              className="px-3 py-1.5 rounded-full border border-[#ddd] text-[12px] text-[#666] bg-white hover:bg-[#f9f9f9] transition-colors"
            >
              조회
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-[#f0f0f0]">
          <span className="text-[14px] text-[#111]">기프트카드</span>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#999]">0원</span>
            <button
              type="button"
              className="px-3 py-1.5 rounded-full border border-[#ddd] text-[12px] text-[#666] bg-white hover:bg-[#f9f9f9] transition-colors"
            >
              조회
            </button>
          </div>
        </div>

        <div className="mt-4 bg-[#f8f8f8] rounded-[12px] px-4 py-4">
          <div className="flex items-center gap-1.5 mb-3">
            <svg className="size-4 shrink-0 text-[#555]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <span className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#333]">안내사항</span>
          </div>
          <ul className="space-y-2.5">
            <li className="flex gap-2 text-[12px] leading-[1.6]">
              <span className="shrink-0 text-[#555]">•</span>
              <span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#4a1f94]">쿠폰은 단독으로만 사용 가능</span>
                <span className="text-[#555]">합니다. 마일리지, 상품권, 기프트 카드와 중복 사용은 불가합니다.</span>
              </span>
            </li>
            <li className="flex gap-2 text-[12px] text-[#555] leading-[1.6]">
              <span className="shrink-0">•</span>
              <span>마일리지로 결제한 항공권을 취소 또는 환불할 경우, 수수료는 마일리지로 차감되지 않으며 별도의 입금 또는 카드 결제가 필요합니다.<br />(홈페이지 하단 이용약관 제9조 참조)</span>
            </li>
            <li className="flex gap-2 text-[12px] text-[#555] leading-[1.6]">
              <span className="shrink-0">•</span>
              <span>마일리지 차감 및 결제 불가 항목: 하나투어 환불대행수수료, 항공사 환불수수료</span>
            </li>
          </ul>
        </div>
        </section>

        <section className="px-5 py-4 border-b-8 border-[#f0f0f0]">
          <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[18px] font-bold text-[#111] mb-3">
            결제 상세 내역
          </h3>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[14px] text-[#333]">결제 예정 금액</span>
            <span className="text-[14px] text-[#111] font-semibold font-['Pretendard:Bold',sans-serif] tabular-nums">
              {scheduledPaymentAmount.toLocaleString()} 원
            </span>
          </div>
          {amountDetailOpen ? (
            <div className="text-[13px] text-[#666] mb-2 pl-0 space-y-1">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#999]">ㄴ 항공권</span>
                <span className="text-[#111] tabular-nums">{airLineAmount.toLocaleString()} 원</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#999]">ㄴ 숙소</span>
                <span className="text-[#111] tabular-nums">{hotelLineAmount.toLocaleString()} 원</span>
              </div>
              {discountAmount > 0 ? (
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#999]">ㄴ 할인</span>
                  <span className="text-[#111] tabular-nums">-{discountAmount.toLocaleString()} 원</span>
                </div>
              ) : null}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setAmountDetailOpen((o) => !o)}
            className="flex items-center justify-end gap-1 w-full text-[12px] text-[#4585ff] font-['Pretendard:SemiBold',sans-serif] mb-3"
          >
            금액 자세히 보기
            {amountDetailOpen ? (
              <ChevronUp className="size-4 shrink-0" aria-hidden />
            ) : (
              <ChevronDown className="size-4 shrink-0" aria-hidden />
            )}
          </button>
          <div className="pt-2 mt-2 border-t border-[#eee] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] font-semibold text-[#111]">
                최종 결제금액
              </span>
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[20px] text-[#4a1f94] tabular-nums">
                {finalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </section>

        <section className="px-5 py-4 border-b border-[#f0f0f0]">
          <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-3">
            결제수단 선택
          </h3>

          <div className="flex items-center justify-between px-4 py-3 border border-[#e8e8e8] rounded-[10px] bg-white mb-3">
            <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">개인</span>
            <ChevronDown className="size-5 text-[#999]" aria-hidden />
          </div>

          <div className="mb-3 grid grid-cols-4 gap-2">
            {cardSeg.map((val, i) => (
              <input
                key={i}
                value={val}
                onChange={(e) => setCardSegment(i, e.target.value)}
                placeholder="0000"
                inputMode="numeric"
                maxLength={4}
                autoComplete="off"
                className="w-full min-w-0 px-2 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] text-center bg-white placeholder:text-[#999] font-['Pretendard:Medium',sans-serif] tabular-nums text-[#111]"
                aria-label={`카드번호 ${i + 1}번째 4자리`}
              />
            ))}
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <input
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
              placeholder="카드 유효기간"
              className="min-w-0 w-full px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] bg-white placeholder:text-[#999] font-['Pretendard:Medium',sans-serif] text-[#111]"
              autoComplete="off"
            />
            <input
              value={cardPwd2}
              onChange={(e) => setCardPwd2(e.target.value.replace(/\D/g, "").slice(0, 2))}
              placeholder="비밀번호 앞 2자리"
              inputMode="numeric"
              type="password"
              maxLength={2}
              className="min-w-0 w-full px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] bg-white placeholder:text-[#999] font-['Pretendard:Medium',sans-serif] text-[#111]"
              autoComplete="off"
            />
          </div>

          <div className="relative mb-3">
            <select
              value={installment}
              onChange={(e) => setInstallment(e.target.value)}
              className="w-full appearance-none rounded-[10px] border border-[#e8e8e8] bg-white px-4 py-3 pr-10 text-[14px] font-['Pretendard:Medium',sans-serif] text-[#111]"
            >
              <option value="" disabled>
                할부기간
              </option>
              <option value="일시불">일시불</option>
              <option value="2">2개월</option>
              <option value="3">3개월</option>
              <option value="6">6개월</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#999]"
              aria-hidden
            />
          </div>

          <input
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            placeholder="카드 소유자 이름"
            className="mb-3 w-full px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] bg-white placeholder:text-[#999] font-['Pretendard:Medium',sans-serif] text-[#111]"
            autoComplete="off"
          />

          <input
            value={cardBirth}
            onChange={(e) => setCardBirth(e.target.value)}
            placeholder="법정 생년월일"
            className="mb-4 w-full px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] bg-white placeholder:text-[#999] font-['Pretendard:Medium',sans-serif] text-[#111]"
            inputMode="numeric"
            autoComplete="off"
          />

          <div className="rounded-[10px] bg-[#f5f5f5] border border-[#eee] px-4 py-4">
            <h4 className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111] mb-3 flex items-center gap-1.5">
              <CircleAlert className="size-5 shrink-0 text-[#666]" aria-hidden />
              주의사항
            </h4>
            <p className="mb-3 text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">승인 정보</p>
            <p className="mb-4 text-[13px] text-[#4a1f94] leading-[1.5] font-['Pretendard:Medium',sans-serif]">
              • 카드정보는 1회 입력이나, 카드 승인금액은 항공, 호텔 각 상품 별도 승인 되오니 이용에 참고해주시기 바랍니다.
            </p>
            <h4 className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111] mb-3">
              신용카드 결제 시 주의사항
            </h4>
            <ul className="space-y-2 text-[13px] text-[#666] leading-[1.5]">
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>항공권 결제는 탑승객 본인 명의 카드로 진행해야 합니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>탑승객과 카드 명의가 다를 경우 가족·법인 등 관계 증빙을 요청받을 수 있습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>제3자 카드 결제는 원칙적으로 불가하며, 이로 인한 문제에 당사는 책임지지 않습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>법인카드(익명) 결제는 제한될 수 있으며, 일부 항공사(예: 에어서울)는 익명 법인카드를 받지 않습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>법인카드에는 프로모션 할인이 적용되지 않을 수 있습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>내맘대로 항공+호텔 조합 상품은 ARS 무이자 할부 기간이 적용될 수 있습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>현대카드는 일부 무이자 할부를 지원하지 않을 수 있습니다.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
              현금영수증 등록 관리
            </h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="namemdaeCashReceipt"
                  checked={cashReceiptReg === "register"}
                  onChange={() => setCashReceiptReg("register")}
                  className="size-5 border-2 border-[#c8c8c8] text-[#6329C4] accent-[#6329C4] focus:ring-[#6329C4]"
                />
                <span className="text-[14px] text-[#111]">등록</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="namemdaeCashReceipt"
                  checked={cashReceiptReg === "unregistered"}
                  onChange={() => setCashReceiptReg("unregistered")}
                  className="size-5 border-2 border-[#c8c8c8] text-[#6329C4] accent-[#6329C4] focus:ring-[#6329C4]"
                />
                <span className="text-[14px] text-[#111]">미등록</span>
              </label>
            </div>
          </div>
        </section>
      </div>

      <div className="shrink-0 border-t border-[#f0f0f0] bg-white px-5 py-4">
        <button
          type="button"
          onClick={() => setSplitCardSheetOpen(true)}
          className="w-full py-4 bg-[#4a1f94] text-white rounded-[30px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#4a2190] transition-colors"
        >
          {finalAmount.toLocaleString()}원 · 결제하기
        </button>
      </div>
      </div>

      {finalPaymentConfirmOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="final-payment-confirm-title"
          onClick={backToSplitCardSheet}
        >
          <div
            className="max-h-[85vh] w-full overflow-y-auto rounded-t-[24px] bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-1">
              <h2
                id="final-payment-confirm-title"
                className="text-left text-[18px] font-['Pretendard:Bold',sans-serif] font-bold leading-snug text-[#111]"
              >
                결제정보 최종 확인
              </h2>
              <button
                type="button"
                onClick={backToSplitCardSheet}
                className="shrink-0 p-1 -mr-1 -mt-0.5 text-[#111]"
                aria-label="닫기"
              >
                <X className="size-5" strokeWidth={2} aria-hidden />
              </button>
            </div>
            <p className="px-5 pt-3 pb-4 text-[14px] font-['Pretendard:Medium',sans-serif] leading-[1.55] text-[#767676]">
              결제요청 이후에는 패널티가 발생 될 수 있으니 반드시 영문명과 일정을 확인하시기 바랍니다. 결제를
              진행하시겠습니까?
            </p>
            <div className="mx-5 rounded-[12px] bg-[#f0f0f0] px-4 py-3.5">
              <ul className="space-y-2.5 text-[12px] font-['Pretendard:Medium',sans-serif] leading-[1.55] text-[#333]">
                <li className="flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>
                    평일 업무시간 (09:00~17:00) 이외에는 취소, 변경, 환불, 상담 등의 업무처리가 불가합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>
                    결제 후 변경 및 취소 항공사의 규정에 따라 취소/변경 수수료가 부과되기에 구매하시는 항공권의
                    항공사 요금 규정 및 이용 약관을 반드시 숙지하셔야 합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>
                    평일 업무시간 (09:00~17:00) 이후 결제 요청시 확인이 필요한 일부 운임의 경우 영업일 내
                    처리되며 항공사 사정에 따라 기존 예약하신 요금이 인상되거나 항공권 발행이 불가할 수 있습니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>
                    여권상의 영문이름과 다를 시 탑승이 불가하며, 예약 후 영문이름 변경이 불가합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>
                    일부 항공권의 경우 당일취소가 불가능하고 정상업무시간에 환불로 접수되므로 결제 진행 시
                    신중하게 결제 부탁드립니다.
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex gap-3 px-5 pb-6 pt-5">
              <button
                type="button"
                onClick={backToSplitCardSheet}
                className="min-w-0 flex-1 rounded-[30px] border border-[#e0e0e0] bg-white py-3.5 text-[15px] font-['Pretendard:Bold',sans-serif] text-[#111] transition-colors hover:bg-[#fafafa]"
              >
                다시 확인하기
              </button>
              <button
                type="button"
                onClick={() => {
                  setFinalPaymentConfirmOpen(false);
                  setSplitCardSheetOpen(false);
                  onPayComplete();
                  setPaymentCompleteLoading(true);
                }}
                className="min-w-0 flex-1 rounded-[30px] py-3.5 text-[15px] font-['Pretendard:Bold',sans-serif] text-white transition-colors hover:bg-[#4a2190] bg-[#4a1f94]"
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      ) : splitCardSheetOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="split-card-consent-title"
          onClick={() => setSplitCardSheetOpen(false)}
        >
          <div
            className="w-full rounded-t-[24px] bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-1">
              <h2
                id="split-card-consent-title"
                className="text-left text-[18px] font-['Pretendard:Bold',sans-serif] font-bold leading-snug text-[#111]"
              >
                카드 분리 승인 동의
              </h2>
              <button
                type="button"
                onClick={() => setSplitCardSheetOpen(false)}
                className="shrink-0 p-1 -mr-1 -mt-0.5 text-[#111]"
                aria-label="닫기"
              >
                <X className="size-5" strokeWidth={2} aria-hidden />
              </button>
            </div>
            <p className="px-5 pt-3 pb-4 text-[14px] font-['Pretendard:Medium',sans-serif] leading-[1.55] text-[#767676]">
              내맘대로 항공+호텔 상품은 선택상품 별 각각 승인 처리가 되는 방식으로, 미동의시 예약진행이 불가합니다.
            </p>
            <div className="mx-5 border-t border-[#f0f0f0]" />
            <div className="px-5 py-4">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <span className="text-[15px] font-['Pretendard:Bold',sans-serif] text-[#111]">총 상품금액</span>
                <span className="text-[15px] font-['Pretendard:Bold',sans-serif] tabular-nums text-[#111]">
                  {finalAmount.toLocaleString()} 원
                </span>
              </div>
              <div className="space-y-2.5 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#767676]">
                <div className="flex justify-between gap-3">
                  <span>ㄴ 선택상품 승인금액 1</span>
                  <span className="shrink-0 tabular-nums">{approvalAmount1.toLocaleString()} 원</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>ㄴ 선택상품 승인금액 2</span>
                  <span className="shrink-0 tabular-nums">{approvalAmount2.toLocaleString()} 원</span>
                </div>
              </div>
            </div>
            <div className="px-5 pb-6 pt-1">
              <button
                type="button"
                onClick={() => {
                  setSplitCardSheetOpen(false);
                  setFinalPaymentConfirmOpen(true);
                }}
                className="w-full rounded-[30px] py-3.5 text-[16px] font-['Pretendard:Bold',sans-serif] text-white transition-colors hover:bg-[#4a2190] bg-[#4a1f94]"
              >
                동의
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {paymentCompleteLoading && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70"
              role="status"
              aria-live="polite"
              aria-busy="true"
              aria-label="결제 처리 중"
            >
              <Loader2 className="size-12 animate-spin text-white" strokeWidth={2} aria-hidden />
              <p className="mt-5 px-6 text-center text-[16px] font-['Pretendard:SemiBold',sans-serif] text-white">
                결제 처리 중입니다…
              </p>
              <p className="mt-2 px-8 text-center text-[13px] font-['Pretendard:Medium',sans-serif] text-white/80">
                잠시만 기다려 주세요.
              </p>
            </div>,
            document.body,
          )
        : null}

      <NamemdaePaymentCompleteBottomSheet
        open={paymentCompleteOpen}
        bookerName={bookerName}
        onDismiss={dismissPaymentComplete}
      />
    </>
  );
}
