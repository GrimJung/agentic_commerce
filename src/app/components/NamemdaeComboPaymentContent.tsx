import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { NamemdaePaymentCompleteBottomSheet } from "./NamemdaePaymentCompleteBottomSheet";

const PURPLE = "#5e2bb8";

function maskBookerName(name: string): string {
  const t = name.trim();
  if (t.length <= 1) return t || "—";
  if (t.length === 2) return `${t[0]}*`;
  return `${t[0]}${"*".repeat(Math.min(2, t.length - 2))}${t[t.length - 1]}`;
}

function formatPhoneDisplay(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("010")) return `${d.slice(0, 3)}-****-${d.slice(7)}`;
  return phone;
}

export interface NamemdaeComboPaymentContentProps {
  totalAmount: number;
  /** 상품 금액 (미입력 시 totalAmount) */
  productAmount?: number;
  discountAmount?: number;
  bookerName: string;
  bookerPhone: string;
  travelerNameKo: string;
  travelerEnLast: string;
  travelerEnFirst: string;
  travelerGenderFemale: boolean;
  travelerBirth: string;
  onPayComplete: () => void;
  /** 결제 완료 시트 닫을 때 — 항공+호텔 시트 닫고 대화로 복귀 등 */
  onClosePaymentSuccess?: () => void;
  /**
   * 카드 분리 승인 안내용 — 1차(항공 등) 승인 금액.
   * 미입력 시 총액을 반반 분할합니다.
   */
  airApprovalAmount?: number;
}

type PayTab = "toss" | "card" | "bank";

export function NamemdaeComboPaymentContent({
  totalAmount,
  productAmount,
  discountAmount = 0,
  bookerName,
  bookerPhone,
  travelerNameKo,
  travelerEnLast,
  travelerEnFirst,
  travelerGenderFemale,
  travelerBirth,
  onPayComplete,
  onClosePaymentSuccess,
  airApprovalAmount,
}: NamemdaeComboPaymentContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [splitCardSheetOpen, setSplitCardSheetOpen] = useState(false);
  const [finalPaymentConfirmOpen, setFinalPaymentConfirmOpen] = useState(false);
  const [paymentCompleteOpen, setPaymentCompleteOpen] = useState(false);
  const [paymentCompleteLoading, setPaymentCompleteLoading] = useState(false);
  const [flightPolicyOpen, setFlightPolicyOpen] = useState(false);
  const [hotelPolicyOpen, setHotelPolicyOpen] = useState(false);
  const [payTab, setPayTab] = useState<PayTab>("card");
  const [cardChoice, setCardChoice] = useState("");
  const [installment, setInstallment] = useState("일시불");
  const [cashReceipt, setCashReceipt] = useState(false);
  const [agreePayTerms, setAgreePayTerms] = useState(false);

  const product = productAmount ?? totalAmount;
  const finalAmount = totalAmount;

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const canSubmit = agreePayTerms && (payTab !== "card" || cardChoice.length > 0);

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

  return (
    <>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[#f8f8f8] px-5 pt-4 pb-36"
      >
        {/* 예약자 */}
        <section className="mb-4 rounded-[12px] border border-[#eee] bg-white p-4">
          <h2 className="mb-3 font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">예약자</h2>
          <div className="space-y-2 text-[14px] font-['Pretendard:Medium',sans-serif]">
            <div className="flex justify-between gap-3">
              <span className="text-[#666] shrink-0">이름</span>
              <span className="text-right text-[#111]">{maskBookerName(bookerName)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[#666] shrink-0">휴대폰</span>
              <span className="text-right text-[#111] tabular-nums">{formatPhoneDisplay(bookerPhone)}</span>
            </div>
          </div>
        </section>

        {/* 여행자 */}
        <section className="mb-4 rounded-[12px] border border-[#eee] bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">여행자 정보</h2>
            <button
              type="button"
              className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#5e2bb8] underline decoration-[#5e2bb8] underline-offset-2"
            >
              여행자 정보 불러오기
            </button>
          </div>
          <p className="mb-3 text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">여행자 1</p>
          <div className="divide-y divide-[#f0f0f0] rounded-[10px] border border-[#f0f0f0] overflow-hidden">
            <Row label="한글 성명" value={travelerNameKo || "—"} />
            <Row
              label="영문 성명"
              value={
                travelerEnLast || travelerEnFirst
                  ? `${travelerEnLast.toUpperCase()} / ${travelerEnFirst.toUpperCase()}`
                  : "—"
              }
            />
            <Row label="성별" value={travelerGenderFemale ? "여" : "남"} />
            <Row label="생년월일" value={travelerBirth || "—"} />
          </div>
        </section>

        {/* 취소 규정 — 접기 */}
        <section className="mb-4 overflow-hidden rounded-[12px] border border-[#eee] bg-white">
          <PolicyToggleRow
            open={flightPolicyOpen}
            onToggle={() => setFlightPolicyOpen((o) => !o)}
            label="항공 취소 규정 및 예약 주의사항"
          />
          {flightPolicyOpen ? (
            <div className="border-t border-[#f0f0f0] px-4 py-3 text-[12px] font-['Pretendard:Medium',sans-serif] leading-[1.55] text-[#555]">
              항공권은 항공사 규정에 따라 취소·환불 수수료가 부과될 수 있으며, 발권 후 변경이 제한될 수 있습니다.
              상세요금은 예약 상세의 항공 요금·환불 규정을 확인해 주세요.
            </div>
          ) : null}
          <PolicyToggleRow
            open={hotelPolicyOpen}
            onToggle={() => setHotelPolicyOpen((o) => !o)}
            label="호텔 취소 규정 및 예약 주의사항"
            borderTop
          />
          {hotelPolicyOpen ? (
            <div className="border-t border-[#f0f0f0] px-4 py-3 text-[12px] font-['Pretendard:Medium',sans-serif] leading-[1.55] text-[#555]">
              호텔 예약은 숙소·객실 규정에 따라 무료 취소 가능 기간 이후 위약금이 발생할 수 있습니다. 노쇼 시
              전액이 청구될 수 있으니 체크인 일정을 확인해 주세요.
            </div>
          ) : null}
        </section>

        {/* 주의사항 박스 */}
        <section className="mb-4 rounded-[12px] bg-[#f8f8f8] px-4 py-3.5">
          <h3 className="mb-2.5 font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111]">주의사항</h3>
          <ul className="space-y-2 text-[12px] font-['Pretendard:Medium',sans-serif] leading-[1.55] text-[#555]">
            <li className="flex gap-2">
              <span className="shrink-0 text-[#999]">•</span>
              <span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#5D40D0]">
                  항공·호텔은 각각 별도 승인
                </span>
                될 수 있으며, 카드사·결제사 정책에 따라 한도·할부 조건이 달라질 수 있습니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 text-[#999]">•</span>
              <span>
                예약 확정 후{" "}
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[#5D40D0]">일정·이름 변경이 제한</span>
                될 수 있으니 결제 전 정보를 다시 확인해 주세요.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 text-[#999]">•</span>
              <span>취소·환불은 각 상품 규정 및 결제 수단 약관을 따릅니다.</span>
            </li>
          </ul>
        </section>

        {/* 결제 수단 */}
        <section className="mb-4 rounded-[12px] border border-[#eee] bg-white p-4">
          <h2 className="mb-3 font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">결제 수단</h2>
          <div className="mb-4 flex border-b border-[#eee]">
            {(
              [
                { id: "toss" as const, label: "토스페이" },
                { id: "card" as const, label: "신용/체크카드" },
                { id: "bank" as const, label: "무통장입금" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPayTab(t.id)}
                className={`min-w-0 flex-1 py-2.5 text-center text-[13px] font-['Pretendard:SemiBold',sans-serif] transition-colors ${
                  payTab === t.id
                    ? "border-b-2 border-[#5e2bb8] font-bold text-[#5e2bb8]"
                    : "border-b-2 border-transparent text-[#666]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {payTab === "toss" ? (
            <p className="text-[13px] font-['Pretendard:Medium',sans-serif] text-[#666]">
              토스페이 앱에서 간편하게 결제할 수 있습니다. (데모 화면)
            </p>
          ) : null}

          {payTab === "card" ? (
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-['Pretendard:Medium',sans-serif] text-[#666]">
                  카드 선택
                </span>
                <select
                  value={cardChoice}
                  onChange={(e) => setCardChoice(e.target.value)}
                  className="w-full appearance-none rounded-[10px] border border-[#e5e5e5] bg-white px-4 py-3 text-[14px] text-[#111]"
                >
                  <option value="">카드를 선택해 주세요</option>
                  <option value="hana">하나카드</option>
                  <option value="shinhan">신한카드</option>
                  <option value="samsung">삼성카드</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-['Pretendard:Medium',sans-serif] text-[#666]">
                  할부
                </span>
                <select
                  value={installment}
                  onChange={(e) => setInstallment(e.target.value)}
                  className="w-full appearance-none rounded-[10px] border border-[#e5e5e5] bg-white px-4 py-3 text-[14px] text-[#111]"
                >
                  <option value="일시불">일시불</option>
                  <option value="2">2개월</option>
                  <option value="3">3개월</option>
                  <option value="6">6개월</option>
                </select>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  checked={cashReceipt}
                  onChange={(e) => setCashReceipt(e.target.checked)}
                  className="size-4 rounded border-[#ccc] accent-[#5e2bb8]"
                />
                <span className="text-[14px] font-['Pretendard:Medium',sans-serif] text-[#111]">
                  현금영수증 신청
                </span>
              </label>
            </div>
          ) : null}

          {payTab === "bank" ? (
            <p className="text-[13px] font-['Pretendard:Medium',sans-serif] text-[#666]">
              입금 계좌 안내는 다음 단계에서 표시됩니다. (데모 화면)
            </p>
          ) : null}
        </section>

        {/* 결제 금액 */}
        <section className="mb-4 rounded-[12px] border border-[#eee] bg-white p-4">
          <h2 className="mb-3 font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">결제 금액</h2>
          <div className="space-y-2.5 text-[14px] font-['Pretendard:Medium',sans-serif]">
            <div className="flex justify-between gap-3 text-[#111]">
              <span>상품 금액</span>
              <span className="tabular-nums">{product.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between gap-3 text-[#111]">
              <span>할인 금액</span>
              <span className="tabular-nums">{discountAmount.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between gap-3 border-t border-[#f0f0f0] pt-3">
              <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">최종 결제금액</span>
              <span
                className="font-['Pretendard:Bold',sans-serif] text-[17px] tabular-nums"
                style={{ color: PURPLE }}
              >
                {finalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </section>

        {/* 약관 동의 */}
        <section className="mb-4 rounded-[12px] bg-[#f4f4f4] p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreePayTerms}
              onChange={(e) => setAgreePayTerms(e.target.checked)}
              className="mt-0.5 size-[18px] shrink-0 rounded border-[#ccc] accent-[#5e2bb8]"
            />
            <span className="text-[14px] font-['Pretendard:SemiBold',sans-serif] leading-snug text-[#111]">
              위 약관에 동의하며 결제를 진행합니다.
            </span>
          </label>
          <ul className="mt-4 space-y-2.5 border-t border-[#e0e0e0] pt-4">
            {[
              "개인정보 수집 및 이용 동의",
              "전자금융거래 이용약관",
              "결제 서비스 이용약관",
            ].map((label) => (
              <li key={label} className="flex items-center justify-between gap-2 text-[13px]">
                <span className="font-['Pretendard:Medium',sans-serif] text-[#333]">{label}</span>
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-[#ddd] bg-white px-2.5 py-1 text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#555]"
                >
                  보기
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* 하단 유의사항 */}
        <div className="pb-4 text-[11px] font-['Pretendard:Medium',sans-serif] leading-[1.6] text-[#888]">
          <p className="mb-2">
            본 결제는 항공·호텔 상품 특성상 일부 요금이 분리 승인될 수 있습니다. 문의는 고객센터(대표번호)로
            연락해 주세요.
          </p>
          <p>
            당사는 통신판매중개자로서 통신판매의 당사자가 아니며, 상품·거래 정보 및 책임은 판매자에게 있습니다.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-32 right-4 z-[55] flex size-11 items-center justify-center rounded-full border border-[#e5e5e5] bg-white text-[#555] shadow-md"
        aria-label="맨 위로"
      >
        <ArrowUp className="size-5" strokeWidth={2} />
      </button>

      <div className="sticky bottom-0 z-50 shrink-0 border-t border-[#f0f0f0] bg-white px-5 py-4">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => setSplitCardSheetOpen(true)}
          className="w-full rounded-[30px] bg-[#5e2bb8] py-4 text-[16px] font-['Pretendard:Bold',sans-serif] text-white transition-colors hover:bg-[rgba(74,33,144,1)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {finalAmount.toLocaleString()}원 결제하기
        </button>
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
                className="min-w-0 flex-1 rounded-[30px] bg-[#5e2bb8] py-3.5 text-[15px] font-['Pretendard:Bold',sans-serif] text-white transition-colors hover:bg-[rgba(74,33,144,1)]"
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
                className="w-full rounded-[30px] bg-[#5e2bb8] py-3.5 text-[16px] font-['Pretendard:Bold',sans-serif] text-white transition-colors hover:bg-[rgba(74,33,144,1)]"
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 bg-white px-3 py-3">
      <span className="w-[88px] shrink-0 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#888]">
        {label}
      </span>
      <span className="min-w-0 flex-1 text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111] break-words">
        {value}
      </span>
    </div>
  );
}

function PolicyToggleRow({
  open,
  onToggle,
  label,
  borderTop,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
  borderTop?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left ${
        borderTop ? "border-t border-[#f0f0f0]" : ""
      }`}
      aria-expanded={open}
    >
      <span className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">{label}</span>
      {open ? (
        <ChevronUp className="size-5 shrink-0 text-[#111]" aria-hidden />
      ) : (
        <ChevronDown className="size-5 shrink-0 text-[#111]" aria-hidden />
      )}
    </button>
  );
}
