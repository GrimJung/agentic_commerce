import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, ChevronUp, CircleAlert, Info, Loader2, X } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { NamemdaePaymentCompleteBottomSheet } from "./NamemdaePaymentCompleteBottomSheet";

const PURPLE = "rgba(94, 43, 184, 1)";

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
      <div className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pt-3 pb-4">
        {/* 여행자 보험 가입 선택 — 박스 없이 구간 구분선 */}
        <div className="mb-1">
          <h2 className="mb-2 font-['Pretendard:Bold',sans-serif] text-[17px] leading-snug text-[#111]">
            여행자 보험 가입 선택
          </h2>
          <p className="text-[13px] font-['Pretendard:Medium',sans-serif] leading-relaxed text-[#666]">
            항공권 구매하면서 안전한 여행을 위해 여행자 보험도 함께 가입해 보세요!
          </p>
        </div>

        <div>
          <p className="mb-3 font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111]">상품 선택</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="min-w-0 flex-1 rounded-[10px] border border-[#e0e0e0] bg-white py-2.5 text-center text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#333] transition-colors hover:bg-[#fafafa]"
            >
              보장내역 상세보기 &gt;
            </button>
            <button
              type="button"
              className="min-w-0 flex-1 rounded-[10px] border border-[#e0e0e0] bg-white py-2.5 text-center text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#333] transition-colors hover:bg-[#fafafa]"
            >
              보험료 상세보기 &gt;
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setInsuranceChoice("subscribe")}
          className={`flex w-full gap-3 py-4 text-left transition-colors ${
            insuranceChoice === "subscribe"
              ? "mt-4 rounded-[20px] border border-[#e0e0e0] bg-white pl-3"
              : "hover:bg-white/60"
          }`}
        >
          {insuranceChoice === "subscribe" ? (
            <span
              className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2563eb]"
              aria-hidden
            >
              <Check className="size-3 text-white" strokeWidth={3} />
            </span>
          ) : (
            <span className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-[#ccc] bg-white" aria-hidden />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">여행자 보험 가입하기</p>
            <p className="mt-2 text-[12px] font-['Pretendard:Medium',sans-serif] leading-relaxed text-[#444]">
              총 보험료{" "}
              <span className="font-['Pretendard:Bold',sans-serif]" style={{ color: PURPLE }}>
                28,240원
              </span>{" "}
              | 가입인원{" "}
              <span className="font-['Pretendard:Bold',sans-serif]" style={{ color: PURPLE }}>
                2명
              </span>{" "}
              | 총{" "}
              <span className="font-['Pretendard:Bold',sans-serif]" style={{ color: PURPLE }}>
                4일
              </span>
            </p>
            <p className="mt-1 text-[12px] font-['Pretendard:Medium',sans-serif] tabular-nums text-[#666]">
              2026.05.25 00:00 ~ 2026.05.28 23:59
            </p>
            <ul className="mt-3 space-y-1.5 text-[11px] font-['Pretendard:Medium',sans-serif] leading-relaxed text-[#555]">
              <li>
                • 휴대품 분실: 한도{" "}
                <span className="font-['Pretendard:Bold',sans-serif]" style={{ color: PURPLE }}>
                  100만원
                </span>{" "}
                (1품목{" "}
                <span className="font-['Pretendard:Bold',sans-serif]" style={{ color: PURPLE }}>
                  20만원
                </span>
                )
              </li>
              <li>
                • 항공·수하물 지연:{" "}
                <span className="font-['Pretendard:Bold',sans-serif]" style={{ color: PURPLE }}>
                  20만원
                </span>{" "}
                한도
              </li>
              <li>
                • 해외 상해·질병:{" "}
                <span className="font-['Pretendard:Bold',sans-serif]" style={{ color: PURPLE }}>
                  5천만원
                </span>{" "}
                한도
              </li>
            </ul>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setInsuranceChoice("later")}
          className={`flex w-full gap-3 py-4 text-left transition-colors ${
            insuranceChoice === "later"
              ? "rounded-[20px] border border-[#e0e0e0] bg-white pl-3"
              : "hover:bg-white/60"
          }`}
        >
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center" aria-hidden>
            {insuranceChoice === "later" ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#2563eb]">
                <Check className="size-3 text-white" strokeWidth={3} />
              </span>
            ) : (
              <span className="size-5 rounded-full border-2 border-[#ccc] bg-white" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">보험 나중에 가입하기</p>
            <p className="mt-2 text-[12px] font-['Pretendard:Medium',sans-serif] leading-relaxed text-[#666]">
              예약 완료 후 마이페이지 예약 내역에서 별도로 가입 가능합니다.
            </p>
          </div>
        </button>

        <div className="mb-4 rounded-[12px] bg-[#f5f5f5] p-4">
            <p className="mb-2.5 flex items-center gap-1.5 font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111]">
              <CircleAlert className="size-4 shrink-0 text-[#888]" strokeWidth={2} aria-hidden />
              유의사항
            </p>
            <ul className="space-y-2.5 text-[11px] font-['Pretendard:Medium',sans-serif] leading-relaxed text-[#666666]">
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>
                  여행자 보험 관련문의는 보험상담전화 (
                  <strong className="font-['Pretendard:Bold',sans-serif] text-[#666666]">1566-0171</strong>
                  )으로 하실 수 있습니다. (평일 업무시간{" "}
                  <strong className="font-['Pretendard:Bold',sans-serif] text-[#666666]">09:00 ~ 18:00</strong> / 주말,
                  공휴일 제외)
                </span>
              </li>
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#5e2bb8]">
                  항공권 변경 및 예약취소 시 여행자 보험은 별도로 변경 및 취소를 진행하셔야 합니다.
                </span>
              </li>
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>
                  여행자 보험 확인 및 취소는 마이페이지 예약내역{" "}
                  <strong className="font-['Pretendard:Bold',sans-serif] text-[#666666]">
                    [여행자 보험 확인/취소]
                  </strong>{" "}
                  버튼을 클릭하셔서 확인하시기 바랍니다.
                </span>
              </li>
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>
                  여행자 보험은{" "}
                  <span className="font-['Pretendard:Bold',sans-serif] text-[#5e2bb8]">AXA손해보험</span>과 제휴로
                  진행되며 하나투어는 해당 상품에 대한 별도의 책임을 지지 않습니다.
                </span>
              </li>
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>
                  AXA손해보험과 준법감시필-검-251125-마케팅팀-980(2025.11.25~2026.11.24)
                </span>
              </li>
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>
                  자세한 사항은{" "}
                  <span className="font-['Pretendard:Bold',sans-serif] text-[#5e2bb8]">보험 가입 시 유의사항</span>을
                  확인해 주시기 바랍니다.
                </span>
              </li>
            </ul>
        </div>

        {/* 항공권 취소 시 위약금 보장 — 박스 없이 */}
        <div className="mb-1">
          <h2 className="mb-4 font-['Pretendard:Bold',sans-serif] text-[18px] leading-snug text-[#111]">
            항공권 취소 시 위약금 보장 받기 선택
          </h2>

          <h3 className="mb-2 font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111]">보장내역</h3>
          <div className="-mx-4 relative mb-3 min-h-[80px] overflow-hidden bg-[#e4e4e4]">
            <div
              className="pointer-events-none select-none px-3 py-3 text-[11px] font-['Pretendard:Medium',sans-serif] leading-relaxed text-[#bbb]"
              style={{ filter: "blur(5px)" }}
              aria-hidden
            >
              <p>항공권 취소로 인한 위약금(항공사 규정에 따른 취소 수수료)을 보장합니다.</p>
              <p className="mt-1">보장 한도 및 면책 사항은 약관 및 상품설명서를 참고해 주세요.</p>
              <p className="mt-1">일부 운임·조건에서는 가입이 제한될 수 있습니다.</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center px-2">
              <span className="max-w-[280px] rounded-full border border-[#e8e4f5] bg-white/95 px-4 py-2.5 text-center text-[11px] font-['Pretendard:SemiBold',sans-serif] leading-snug text-[#555] shadow-sm [box-shadow:inset_4px_0_0_0_#e9e5fb]">
                가입 버튼 클릭 시 확인 가능해요
              </span>
            </div>
          </div>
          <button
            type="button"
            className="w-full rounded-[10px] border border-[#e0e0e0] bg-white py-3 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#666] transition-colors hover:bg-[#fafafa]"
          >
            보장내역 상세보기 &gt;
          </button>
        </div>

        <button
          type="button"
          onClick={() => setCancellationPenaltyChoice("enroll")}
          className={`flex w-full gap-3 py-4 text-left transition-colors ${
            cancellationPenaltyChoice === "enroll"
              ? "rounded-[20px] border border-[#e0e0e0] bg-white pl-3"
              : "hover:bg-white/60"
          }`}
        >
          {cancellationPenaltyChoice === "enroll" ? (
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2563eb]">
              <Check className="size-3 text-white" strokeWidth={3} />
            </span>
          ) : (
            <span className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-[#ccc] bg-white" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
              항공권 취소 위약금 보상 보험 가입
            </p>
            <p className="mt-1.5 text-[12px] font-['Pretendard:Medium',sans-serif] text-[#888]">
              취소 걱정 없이 항공권 구매하세요!
            </p>
            <p className="mt-3 text-[12px] font-['Pretendard:Medium',sans-serif] text-[#555]">
              총 보험료{" "}
              <span className="font-['Pretendard:Bold',sans-serif]" style={{ color: PURPLE }}>
                0원
              </span>
              {" | "}가입인원{" "}
              <span className="font-['Pretendard:Bold',sans-serif]" style={{ color: PURPLE }}>
                2명
              </span>
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setCancellationPenaltyChoice("skip")}
          className={`flex w-full gap-3 py-4 text-left transition-colors ${
            cancellationPenaltyChoice === "skip"
              ? "rounded-[20px] border border-[#e0e0e0] bg-white pl-3"
              : "hover:bg-white/60"
          }`}
        >
          {cancellationPenaltyChoice === "skip" ? (
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2563eb]">
              <Check className="size-3 text-white" strokeWidth={3} />
            </span>
          ) : (
            <span className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-[#ccc] bg-white" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
              항공권 취소 위약금 보상 보험 미 가입
            </p>
            <p className="mt-2 text-[12px] font-['Pretendard:Medium',sans-serif] leading-relaxed text-[#888]">
              발권 완료 후 마이페이지 예약 내역에서 출발 30일 전까지 별도로 가입 가능합니다.
            </p>
            <p className="mt-1.5 text-[12px] font-['Pretendard:Medium',sans-serif] text-[#888]">
              아래 유의사항을 확인해 주세요.
            </p>
          </div>
        </button>

        <div className="mb-4 rounded-[12px] bg-[#f5f5f5] p-4">
          <p className="mb-3 flex items-center gap-1.5 font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111]">
            <Info className="size-4 shrink-0 text-[#888]" strokeWidth={2} aria-hidden />
            유의사항
          </p>
          <div className="space-y-3 text-[11px] font-['Pretendard:Medium',sans-serif] leading-relaxed text-[#666666]">
            <div>
              <p className="mb-1 font-['Pretendard:Bold',sans-serif] text-[#111]">가입 가능 여부</p>
              <p>
                발권 완료 후 마이페이지 &gt; 예약내역에서 출발 30일 전까지 가입할 수 있습니다. 출발 30일 이내·발권
                이후 일부 조건에서는 가입이 제한될 수 있습니다.
              </p>
            </div>
            <div>
              <p className="mb-1 font-['Pretendard:Bold',sans-serif] text-[#111]">가입 대상 제외</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>만 24개월 미만 영유아, 환불불가(NON-REF) 운임, 재발행·재예약된 항공권 등 일부 조건은 가입 대상에서 제외될 수 있습니다.</li>
              </ul>
            </div>
            <div>
              <p className="mb-1 font-['Pretendard:Bold',sans-serif] text-[#111]">해지 및 환불</p>
              <p>
                청약일부터 15일 이내 청약철회 시 보험료 전액 환불이 가능합니다. 이후 해지 시에는 약관에 따라
                일할 계산 등이 적용될 수 있습니다.
              </p>
            </div>
            <div>
              <p className="mb-1 font-['Pretendard:Bold',sans-serif] text-[#111]">문의처</p>
              <p>
                메리츠화재 <strong className="font-['Pretendard:Bold',sans-serif] text-[#666666]">1566-7711</strong>{" "}
                (평일 09:00~18:00, 주말·공휴일 제외)
              </p>
            </div>
            <div>
              <p className="mb-1 font-['Pretendard:Bold',sans-serif] text-[#111]">기타 안내</p>
              <p className="mb-2 font-['Pretendard:Bold',sans-serif] text-[#7b3ff2]">
                항공권 변경(재발행) 시 보험은 더이상 유효하지 않으며, 직접 취소하셔야 합니다. (취소 후 재가입 불가)
              </p>
              <ul className="list-disc space-y-1.5 pl-4">
                <li>
                  환불불가 운임 등 약관상 보장 제외 사유에 해당하는 경우에는 가입하셨더라도 보상이 되지 않을 수
                  있습니다.
                </li>
                <li>
                  가입 여부·보장 내용은 마이페이지 메뉴에서 확인하실 수 있습니다.
                </li>
              </ul>
              <p className="mt-2 text-[10px] text-[#999]">
                메리츠화재 준법감시인 심의필-검-마케팅-251125-001 (2025.11.25~2026.11.24)
              </p>
            </div>
          </div>
        </div>

        {/* 결제 상세 내역 — 박스 없이 */}
        <div className="mb-1">
          <h2 className="mb-4 font-['Pretendard:Bold',sans-serif] text-[17px] leading-tight text-[#111]">
            결제 상세 내역
          </h2>
        </div>

        <div className="flex items-start justify-between gap-3">
          <span className="text-[14px] font-['Pretendard:Medium',sans-serif] text-[#666]">결제 예정 금액</span>
          <div className="min-w-0 text-right">
            <p className="font-['Pretendard:Bold',sans-serif] text-[15px] tabular-nums text-[#111]">
              {scheduledPaymentAmount.toLocaleString()} 원
            </p>
            <button
              type="button"
              onClick={() => setAmountDetailOpen((o) => !o)}
              className="mt-1 inline-flex items-center gap-0.5 text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#2563eb]"
            >
              금액 자세히 보기
              {amountDetailOpen ? (
                <ChevronUp className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
              ) : (
                <ChevronDown className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
              )}
            </button>
          </div>
        </div>

        {amountDetailOpen ? (
          <div className="mt-3 space-y-2 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#444]">
            <div className="flex justify-between gap-3">
              <span>항공권</span>
              <span className="tabular-nums">{airLineAmount.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>숙소</span>
              <span className="tabular-nums">{hotelLineAmount.toLocaleString()} 원</span>
            </div>
            {discountAmount > 0 ? (
              <div className="flex justify-between gap-3">
                <span>할인</span>
                <span className="tabular-nums">-{discountAmount.toLocaleString()} 원</span>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex items-baseline justify-between gap-3 pb-1">
          <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">최종 결제금액</span>
          <span
            className="font-['Pretendard:Bold',sans-serif] text-[20px] tabular-nums leading-none"
            style={{ color: PURPLE }}
          >
            {finalAmount.toLocaleString()} 원
          </span>
        </div>

        <div
          className="-mx-4 mb-4 mt-3 h-px w-[calc(100%+2rem)] max-w-none shrink-0 bg-[#e8e8e8]"
          aria-hidden
          role="presentation"
        />

        {/* 결제수단 선택 · 주의사항(회색 박스) · 현금영수증 */}
        <div className="mb-1">
          <h2 className="mb-4 font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">결제수단 선택</h2>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span
            className="flex size-[18px] shrink-0 items-center justify-center rounded-full border-2"
            style={{ borderColor: PURPLE, backgroundColor: PURPLE }}
            aria-hidden
          >
            <span className="size-2 rounded-full bg-white" />
          </span>
          <span className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">개인</span>
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
              className="min-w-0 rounded-[8px] border border-[#e0e0e0] bg-white py-2.5 text-center text-[14px] font-['Pretendard:Medium',sans-serif] tabular-nums text-[#111] placeholder:text-[#ccc]"
              aria-label={`카드번호 ${i + 1}번째 4자리`}
            />
          ))}
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <input
            value={cardExpiry}
            onChange={(e) => setCardExpiry(e.target.value)}
            placeholder="카드 유효기간"
            className="min-w-0 rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2.5 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] placeholder:text-[#bbb]"
            autoComplete="off"
          />
          <input
            value={cardPwd2}
            onChange={(e) => setCardPwd2(e.target.value.replace(/\D/g, "").slice(0, 2))}
            placeholder="비밀번호 앞 2자리"
            inputMode="numeric"
            type="password"
            maxLength={2}
            className="min-w-0 rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2.5 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] placeholder:text-[#bbb]"
            autoComplete="off"
          />
        </div>

        <div className="relative mb-3">
          <select
            value={installment}
            onChange={(e) => setInstallment(e.target.value)}
            className="w-full appearance-none rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2.5 pr-9 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111]"
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
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#999]"
            aria-hidden
          />
        </div>

        <input
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          placeholder="카드 소유자 이름"
          className="mb-3 w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2.5 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] placeholder:text-[#bbb]"
          autoComplete="off"
        />

        <input
          value={cardBirth}
          onChange={(e) => setCardBirth(e.target.value)}
          placeholder="법정 생년월일"
          className="w-full rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2.5 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] placeholder:text-[#bbb]"
          inputMode="numeric"
          autoComplete="off"
        />

        <div className="mb-4 mt-4 rounded-[12px] bg-[#f5f5f5] p-4">
          <p className="mb-3 flex items-center gap-1.5 font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111]">
            <Info className="size-4 shrink-0 text-[#888]" strokeWidth={2} aria-hidden />
            주의사항
          </p>
          <div className="mb-3">
            <p className="mb-1.5 text-[12px] font-['Pretendard:Bold',sans-serif] text-[#111]">승인 정보</p>
            <p className="text-[11px] font-['Pretendard:Medium',sans-serif] leading-relaxed" style={{ color: PURPLE }}>
              • 카드정보는 1회 입력이나, 카드 승인금액은 항공, 호텔 각 상품 별도 승인 되오니 이용에 참고해주시기
              바랍니다.
            </p>
          </div>
          <div>
            <p className="mb-2 text-[12px] font-['Pretendard:Bold',sans-serif] text-[#111]">
              신용카드 결제 시 주의사항
            </p>
            <ul className="space-y-2 text-[11px] font-['Pretendard:Medium',sans-serif] leading-relaxed text-[#666]">
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>항공권 결제는 탑승객 본인 명의 카드로 진행해야 합니다.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>탑승객과 카드 명의가 다를 경우 가족·법인 등 관계 증빙을 요청받을 수 있습니다.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>제3자 카드 결제는 원칙적으로 불가하며, 이로 인한 문제에 당사는 책임지지 않습니다.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>법인카드(익명) 결제는 제한될 수 있으며, 일부 항공사(예: 에어서울)는 익명 법인카드를 받지 않습니다.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>법인카드에는 프로모션 할인이 적용되지 않을 수 있습니다.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>내맘대로 항공+호텔 조합 상품은 ARS 무이자 할부 기간이 적용될 수 있습니다.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="shrink-0 text-[#aaa]">•</span>
                <span>현대카드는 일부 무이자 할부를 지원하지 않을 수 있습니다.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pb-1">
          <span className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">현금영수증 등록 관리</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCashReceiptReg("register")}
              className="flex items-center gap-2"
            >
              <span
                className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                  cashReceiptReg === "register" ? "" : "border-[#ccc] bg-white"
                }`}
                style={
                  cashReceiptReg === "register"
                    ? { borderColor: PURPLE, backgroundColor: PURPLE }
                    : undefined
                }
                aria-hidden
              >
                {cashReceiptReg === "register" ? (
                  <span className="size-2 rounded-full bg-white" />
                ) : null}
              </span>
              <span className="text-[13px] font-['Pretendard:Medium',sans-serif] text-[#333]">등록</span>
            </button>
            <button
              type="button"
              onClick={() => setCashReceiptReg("unregistered")}
              className="flex items-center gap-2"
            >
              <span
                className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                  cashReceiptReg === "unregistered" ? "" : "border-[#ccc] bg-white"
                }`}
                style={
                  cashReceiptReg === "unregistered"
                    ? { borderColor: PURPLE, backgroundColor: PURPLE }
                    : undefined
                }
                aria-hidden
              >
                {cashReceiptReg === "unregistered" ? (
                  <span className="size-2 rounded-full bg-white" />
                ) : null}
              </span>
              <span className="text-[13px] font-['Pretendard:Medium',sans-serif] text-[#333]">미등록</span>
            </button>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#f0f0f0] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setSplitCardSheetOpen(true)}
          className="w-full rounded-[30px] py-4 text-[16px] font-['Pretendard:Bold',sans-serif] text-white transition-colors hover:opacity-95"
          style={{ backgroundColor: PURPLE }}
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
                className="min-w-0 flex-1 rounded-[30px] py-3.5 text-[15px] font-['Pretendard:Bold',sans-serif] text-white transition-colors hover:opacity-95"
                style={{ backgroundColor: PURPLE }}
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
                className="w-full rounded-[30px] py-3.5 text-[16px] font-['Pretendard:Bold',sans-serif] text-white transition-colors hover:opacity-95"
                style={{ backgroundColor: PURPLE }}
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
