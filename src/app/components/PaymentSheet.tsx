import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, CreditCard, Check, ChevronDown, ChevronUp, ShieldCheck, X } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { cn } from "./ui/utils";
import { NamemdaeComboStepper } from "./NamemdaeComboStepper";

/** 결제완료 화면에 표시할 예약 상세 (캡처 기준) */
export interface PaymentCompleteDetails {
  /** 호텔/상품명 (예: Candeo Hotels Osaka Namba) */
  reservationTitle: string;
  /** 도시 (예: 오사카) */
  city?: string;
  /** 체크인 날짜 (예: 2024.01.30) */
  checkIn?: string;
  /** 체크아웃 날짜 (예: 2024.01.31) */
  checkOut?: string;
  /** 박수 (예: 1) */
  nights?: number;
  /** 객실 정보 (예: SUPERIOR SOFA QUEEN (2PAX)) */
  roomInfo?: string;
  /** 객실 하위 항목 (예: ["조식 불포함", "성인 2명"]) */
  roomSubItems?: string[];
  /** 요청사항 */
  requests?: string;
  /** 예약채널 (예: 하나투어 닷컴) */
  channel?: string;
  /** 결제수단 표시명 (예: 네이버페이) */
  paymentMethodLabel?: string;
}

interface PaymentSheetProps {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
  /** 결제완료 화면 문구용 예약자명 (예: "이혜선") */
  bookerName?: string;
  /** 결제완료 화면에 표시할 예약 제목 (호텔명 등, completionDetails 없을 때만 사용) */
  reservationTitle?: string;
  /** 결제완료 화면 전체 상세 (캡처와 동일한 항목 표시) */
  completionDetails?: PaymentCompleteDetails;
  /** true면 항공+호텔 FIT 조합 예약 플로우 (호텔 결제완료 타이틀 + 단계 표시) */
  isFitCombo?: boolean;
  /** true면 결제 과정을 건너뛰고 바로 결제완료 화면 표시 */
  skipPayment?: boolean;
  /** true면 결제 후 내부 완료 화면 없이 바로 onSuccess 호출 */
  skipCompletion?: boolean;
}

type PaymentMethod = "card" | "bank" | "kakao" | "payco" | "naver";

type CardOption = "samsung" | "hana" | null;

export function PaymentSheet({
  amount,
  onSuccess,
  onClose,
  bookerName = "고객",
  reservationTitle,
  completionDetails,
  isFitCombo = false,
  skipPayment = false,
  skipCompletion = false,
}: PaymentSheetProps) {
  useLockBodyScroll();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [selectedCard, setSelectedCard] = useState<CardOption>(null);
  const [rememberPaymentMethod, setRememberPaymentMethod] = useState(true);
  const [mileageUse, setMileageUse] = useState(0);
  const [cashReceipt, setCashReceipt] = useState<"등록" | "미등록">("미등록");
  const [cashReceiptPhone, setCashReceiptPhone] = useState("");
  const [isPaymentComplete, setIsPaymentComplete] = useState(skipPayment);
  const [bookingNumber] = useState(() => `HH${Date.now().toString().slice(-10)}`);
  const cashReceiptTypeOptions = [
    "개인소득공제 - 휴대폰번호",
    "개인소득공제 - 현금영수증카드",
    "사업자증빙 - 사업자등록번호",
    "사업자증빙 - 현금영수증카드",
  ] as const;
  type CashReceiptType = (typeof cashReceiptTypeOptions)[number];
  const [cashReceiptType, setCashReceiptType] = useState<CashReceiptType>("개인소득공제 - 휴대폰번호");
  const [cashReceiptTypeDropdownOpen, setCashReceiptTypeDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amountDetailOpen, setAmountDetailOpen] = useState(false);
  const [mileageInput, setMileageInput] = useState("");
  const [couponApplied] = useState(true); // 쿠폰 적용됨 (데모)

  const formatPhoneDisplay = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };
  const isCashReceiptPhoneValid = cashReceiptPhone.replace(/\D/g, "").length === 11;

  const couponDiscount = couponApplied ? 10000 : 0;
  const totalDiscount = couponDiscount + mileageUse;
  const finalAmount = Math.max(0, amount - totalDiscount);
  const amountUsd = (amount / 1493).toFixed(1);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (skipCompletion) {
        onSuccess();
      } else {
        setIsPaymentComplete(true);
      }
    }, 1500);
  };

  const displayName = bookerName.endsWith("님") ? bookerName : `${bookerName}님`;
  const screenTransition = { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const };

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-center bg-black/25"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={screenTransition}
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-full flex flex-col min-h-0 overflow-hidden bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.12)]"
      >
        {isPaymentComplete ? (
          /* 결제완료 화면 — 캡처와 동일 구성 */
          <>
            <div className="w-full self-stretch shrink-0 border-b border-[#eee]">
              <div className="w-full max-w-none flex items-center justify-between px-4 py-3">
                <h1 className="font-['Pretendard:SemiBold',sans-serif] text-[18px] text-[#111]">
                  {isFitCombo ? "호텔 결제완료" : "결제완료"}
                </h1>
                <button
                  type="button"
                  onClick={onSuccess}
                  className="p-2 -mr-2 rounded-full hover:bg-[#f5f5f5] transition-colors"
                  aria-label="닫기"
                >
                  <X className="size-5 text-[#111]" />
                </button>
              </div>
              {isFitCombo && (
                <div className="border-t border-[#f0f0f0]">
                  <NamemdaeComboStepper activeStep={3} />
                </div>
              )}
            </div>
            <div className="w-full self-stretch flex-1 min-h-0 overflow-y-auto px-4 py-6 pb-48">
              {/* 확인 헤더: 회색 원 + 검정 체크, 이름, 완료 문구 — 왼쪽 정렬 */}
              <div className="flex flex-col justify-start items-start text-left mb-6 pb-6 border-b border-[#eee]">
                <span className="size-12 rounded-full border-2 border-[#c8c8c8] bg-white flex items-center justify-center text-[#111] mb-4">
                  <svg className="size-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <p className="font-['Pretendard:Bold',sans-serif] font-semibold text-[18px] text-[#111]">
                  {displayName}
                </p>
                <p className="font-semibold text-[16px] text-[#111] mt-1">
                  {isFitCombo ? "호텔 결제가 완료 되었습니다." : "예약이 완료 되었습니다."}
                </p>
              </div>

              {/* 호텔/상품명 */}
              <h2 className="font-['Pretendard:Bold',sans-serif] font-bold text-[15px] text-[#111] mb-4">
                {completionDetails?.reservationTitle ?? reservationTitle ?? "예약 완료"}
              </h2>

              {/* 예약 상세 목록 (캡처와 동일) */}
              <dl className="space-y-3 text-[14px]">
                <div className="flex justify-between items-start gap-4">
                  <dt className="text-[#666] shrink-0">{isFitCombo ? "호텔 예약번호" : "예약번호"}</dt>
                  <dd className="font-['Pretendard:SemiBold',sans-serif] text-[#111] text-right">{bookingNumber}</dd>
                </div>
                {completionDetails?.city != null && (
                  <div className="flex justify-between items-start gap-4">
                    <dt className="text-[#666] shrink-0">도시</dt>
                    <dd className="text-[#111] text-right">{completionDetails.city}</dd>
                  </div>
                )}
                {(completionDetails?.checkIn != null || completionDetails?.checkOut != null) && (
                  <div className="flex justify-between items-start gap-4">
                    <dt className="text-[#666] shrink-0">체크인 / 체크아웃</dt>
                    <dd className="text-[#111] text-right">
                      {[completionDetails?.checkIn, completionDetails?.checkOut].filter(Boolean).join(" ~ ")}
                      {completionDetails?.nights != null && ` (${completionDetails.nights}박)`}
                    </dd>
                  </div>
                )}
                {(completionDetails?.roomInfo != null || (completionDetails?.roomSubItems?.length ?? 0) > 0) && (
                  <div className="flex justify-between items-start gap-4">
                    <dt className="text-[#666] shrink-0">객실 1정보</dt>
                    <dd className="text-[#111] text-right">
                      <div>{completionDetails?.roomInfo}</div>
                      {completionDetails?.roomSubItems?.map((item, i) => (
                        <div key={i} className="text-[13px] text-[#666] mt-1">
                          · {item}
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between items-start gap-4">
                  <dt className="text-[#666] shrink-0">요청사항</dt>
                  <dd className="text-[#111] text-right">{completionDetails?.requests ?? "-"}</dd>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <dt className="text-[#666] shrink-0">예약채널</dt>
                  <dd className="text-[#111] text-right">{completionDetails?.channel ?? "하나투어 닷컴"}</dd>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <dt className="text-[#666] shrink-0">결제수단</dt>
                  <dd className="text-[#111] text-right">{completionDetails?.paymentMethodLabel ?? "신용카드"}</dd>
                </div>
                <div className="flex justify-between items-start gap-4 pt-2 border-t border-[#eee]">
                  <dt className="text-[#666] shrink-0">결제금액</dt>
                  <dd className="font-['Pretendard:SemiBold',sans-serif] text-[#111] text-right">{finalAmount.toLocaleString()}원</dd>
                </div>
              </dl>
            </div>
            <div className="shrink-0 fixed bottom-0 left-0 right-0 bg-white border-t border-[#eee] p-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={onSuccess}
                className="w-full py-4 bg-[#612bbc] text-white rounded-[30px] text-[16px] font-['Pretendard:SemiBold',sans-serif] hover:opacity-90 transition-opacity"
              >
                확인
              </button>
              <button
                type="button"
                onClick={onSuccess}
                className="w-full py-4 bg-white border border-[#e5e5e5] text-[#555] rounded-[30px] text-[16px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f9f9f9] transition-colors"
              >
                예약 내역 보기
              </button>
            </div>
          </>
        ) : (
          <>
        {/* 헤더 */}
        <div className="shrink-0 w-full flex items-center gap-3 px-4 py-3 border-b border-[#eee]">
          <button
            type="button"
            onClick={onClose}
            className="p-2 -ml-1 hover:bg-[#f5f5f5] rounded-full transition-colors"
          >
            <ArrowLeft className="size-5 text-[#111]" />
          </button>
          <h1 className="font-['Pretendard:SemiBold',sans-serif] text-[18px] text-[#111]">
            결제하기
          </h1>
        </div>

        <div className="flex-1 w-full overflow-y-auto pb-28">
          {/* 할인/혜택 적용 */}
          <section className="p-4 border-b-8 border-[#f0f0f0]">
            <h2 className="text-[17px] font-bold font-['Pretendard:Bold',sans-serif] text-[#111] mb-4">
              할인/혜택 적용
            </h2>

            {/* 쿠폰할인 */}
            <div className="flex items-center justify-between py-3">
              <span className="text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">쿠폰할인</span>
              <div className="flex items-center gap-2">
                {couponApplied ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="inline-flex items-center justify-center size-4 rounded-[3px] bg-[#f43f8c] text-white">
                        <svg className="size-2.5" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-[13px] text-[#f43f8c] font-['Pretendard:SemiBold',sans-serif]">적용됨</span>
                    </div>
                    <span className="text-[15px] font-['Pretendard:Bold',sans-serif] text-[#111]">10,000 원</span>
                  </>
                ) : (
                  <span className="text-[14px] text-[#999]">0원</span>
                )}
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full border border-[#ddd] text-[13px] text-[#444] bg-white hover:bg-[#f9f9f9] transition-colors"
                >
                  변경
                </button>
              </div>
            </div>

            {/* 마일리지 */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">마일리지</span>
                  <button type="button" className="size-5 rounded-full border border-[#ccc] flex items-center justify-center text-[#888] text-[11px] font-bold leading-none">
                    ?
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-['Pretendard:Bold',sans-serif] text-[#7b3ff2]">
                    115,185
                  </span>
                  <span className="inline-flex items-center justify-center size-5 rounded-full border-2 border-[#7b3ff2] text-[#7b3ff2] text-[10px] font-bold">
                    m
                  </span>
                  <button
                    type="button"
                    className="px-4 py-1.5 rounded-full border border-[#7b3ff2] text-[13px] text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif] bg-white hover:bg-[#f5f0ff] transition-colors"
                  >
                    전액사용
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={mileageInput}
                  onChange={(e) => setMileageInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="0"
                  className="w-full rounded-[14px] border border-[#d1d5db] bg-white px-4 py-3.5 text-[16px] tabular-nums text-[#111] placeholder:text-[#ccc] outline-none transition-colors focus:border-[#9ca3af]"
                  aria-label="사용 마일리지"
                />
                <p className="mt-2 text-[12px] text-[#aaa] leading-[1.5]">
                  최소 100 <span className="inline-flex items-center justify-center size-4 rounded-full border border-[#aaa] text-[9px]">m</span> 부터 사용 가능
                </p>
              </div>
            </div>

            {/* 상품권 */}
            <div className="flex items-center justify-between py-3 border-b border-[#f0f0f0]">
              <span className="text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">상품권</span>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-['Pretendard:Bold',sans-serif] text-[#111]">0원</span>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full border border-[#ddd] text-[13px] text-[#444] bg-white hover:bg-[#f9f9f9] transition-colors"
                >
                  조회
                </button>
              </div>
            </div>

            {/* 기프트카드 */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">기프트카드</span>
                <button type="button" className="size-5 rounded-full border border-[#ccc] flex items-center justify-center text-[#888] text-[11px] font-bold leading-none">
                  ?
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-['Pretendard:Bold',sans-serif] text-[#111]">0원</span>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full border border-[#ddd] text-[13px] text-[#444] bg-white hover:bg-[#f9f9f9] transition-colors"
                >
                  조회
                </button>
              </div>
            </div>
          </section>

          {/* 결제 상세 내역 */}
          <section className="px-4 pt-5 pb-4 border-b border-[#f0f0f0]">
            <h2 className="font-bold font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111] mb-4">
              결제 상세 내역
            </h2>

            {/* 총 상품금액 + 금액 자세히 보기 */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-[14px] text-[#555]">총 상품금액</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">
                {amount.toLocaleString()} <span className="text-[14px]">원</span>
              </span>
            </div>
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={() => setAmountDetailOpen(!amountDetailOpen)}
                className="flex items-center gap-1 text-[13px] text-[#4585ff] font-['Pretendard:SemiBold',sans-serif]"
              >
                금액 자세히 보기
                {amountDetailOpen
                  ? <ChevronUp className="size-3.5 shrink-0" />
                  : <ChevronDown className="size-3.5 shrink-0" />}
              </button>
            </div>

            <div className="border-t border-dashed border-[#ddd] mb-3" />

            {/* 전액결제 / 총 할인금액 */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#555]">전액 결제</span>
                <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
                  {amount.toLocaleString()} <span className="font-normal text-[13px]">원</span>
                </span>
              </div>
              {totalDiscount > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] text-[#555]">총 할인금액</span>
                    <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
                      -{totalDiscount.toLocaleString()} <span className="font-normal text-[13px]">원</span>
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between items-center pl-3">
                      <span className="text-[13px] text-[#888]">ㄴ 쿠폰</span>
                      <span className="text-[13px] text-[#888]">-{couponDiscount.toLocaleString()} 원</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 최종 결제금액 */}
            <div className="border-t border-[#eee] pt-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111]">최종 결제금액</span>
                <span className="font-['Pretendard:Bold',sans-serif] font-bold text-[26px] text-[#5e2bb8] leading-none">
                  {finalAmount.toLocaleString()}<span className="text-[18px]">원</span>
                </span>
              </div>
              <div className="flex flex-col items-end mt-1.5 gap-0.5">
                <span className="text-[12px] text-[#aaa]">유류할증료 &amp; 제세공과금 포함</span>
                <span className="text-[12px] text-[#aaa]">
                  하나투어 마일리지 <span className="text-[#f43f8c] font-['Pretendard:SemiBold',sans-serif]">적립 불가</span> 상품
                </span>
              </div>
              <div className="flex items-center justify-end gap-1 mt-2">
                <svg className="size-3.5 shrink-0 text-[#888]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
                <span className="text-[12px] text-[#555]">
                  쿠폰할인은 <span className="font-['Pretendard:Bold',sans-serif] text-[#111]">기본 상품금액 기준</span>으로 계산
                </span>
              </div>
            </div>
          </section>

          {/* 결제수단 */}
          <section className="px-4 pt-4 pb-2 border-b border-[#f0f0f0]">
            <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111] mb-4">
              결제수단
            </h2>
            <div className="rounded-[16px] border border-[#e5e5e5] bg-white overflow-hidden">

              {/* 신용카드 */}
              <label className="flex items-center gap-3 px-4 py-4 cursor-pointer" onClick={() => setPaymentMethod("card")}>
                {/* 커스텀 라디오 */}
                <span className={`shrink-0 size-[22px] rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === "card" ? "border-[#7b3ff2] bg-white" : "border-[#ccc] bg-white"}`}>
                  {paymentMethod === "card" && <span className="size-3 rounded-full bg-[#7b3ff2]" />}
                </span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#7b3ff2]">신용카드</span>
                <CreditCard className="size-5 text-[#7b3ff2]" />
              </label>

              {paymentMethod === "card" && (
                <div className="border-t border-[#eee] px-4 pb-4">
                  <div className="text-center py-3">
                    <p className="text-[13px] text-[#555]">오늘도 <span className="font-['Pretendard:Bold',sans-serif] text-[#111]">[하나]같이</span> 특별한 혜택!</p>
                    <button type="button" className="text-[13px] text-[#555] mt-0.5">카드 바로 선택하기</button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setSelectedCard("samsung")}
                      className={cn(
                        "relative rounded-[12px] border p-4 text-left transition-colors",
                        selectedCard === "samsung" ? "border-[#7b3ff2]" : "border-[#e5e5e5]"
                      )}
                    >
                      <span className={`absolute top-3 right-3 size-5 rounded-full border-2 flex items-center justify-center ${selectedCard === "samsung" ? "border-[#aaa]" : "border-[#ddd]"}`}>
                        {selectedCard === "samsung" && <Check className="size-3 text-[#aaa]" strokeWidth={2.5} />}
                      </span>
                      <p className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#2563eb] mb-1">삼성카드</p>
                      <p className="text-[13px] font-['Pretendard:Bold',sans-serif] text-[#111]">하나투어 삼성카드</p>
                      <p className="text-[11px] text-[#888] mt-1">12/24개월 라이트 할부</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCard("hana")}
                      className={cn(
                        "relative rounded-[12px] border p-4 text-left transition-colors",
                        selectedCard === "hana" ? "border-[#7b3ff2]" : "border-[#e5e5e5]"
                      )}
                    >
                      <span className={`absolute top-3 right-3 size-5 rounded-full border-2 flex items-center justify-center ${selectedCard === "hana" ? "border-[#aaa]" : "border-[#ddd]"}`}>
                        {selectedCard === "hana" && <Check className="size-3 text-[#aaa]" strokeWidth={2.5} />}
                      </span>
                      <div className="flex items-center gap-1 mb-1">
                        <svg viewBox="0 0 20 20" className="size-5 shrink-0" fill="none">
                          <circle cx="10" cy="10" r="10" fill="#00A870"/>
                          <text x="10" y="14" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">하나</text>
                        </svg>
                        <span className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#00a870]">하나카드</span>
                      </div>
                      <p className="text-[13px] font-['Pretendard:Bold',sans-serif] text-[#111]">하나카드</p>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] text-[#666]">신용카드정보 제공 항목</span>
                    <button type="button" className="text-[12px] text-[#333] font-['Pretendard:SemiBold',sans-serif] underline underline-offset-2">무이자 할부 / 제휴 안내</button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-4 py-3.5 border border-[#e0e0e0] rounded-[12px] bg-white">
                      <span className="text-[14px] text-[#aaa]">카드사</span>
                      <ChevronDown className="size-4 text-[#aaa]" />
                    </div>
                    <div className="flex items-center justify-between px-4 py-3.5 border border-[#e0e0e0] rounded-[12px] bg-white">
                      <span className="text-[14px] text-[#aaa]">할부기간을 선택해 주세요</span>
                      <ChevronDown className="size-4 text-[#aaa]" />
                    </div>
                  </div>
                </div>
              )}

              {/* 무통장 입금 */}
              <label className="flex items-center gap-3 px-4 py-4 cursor-pointer border-t border-[#eee]" onClick={() => setPaymentMethod("kakao")}>
                <span className={`shrink-0 size-[22px] rounded-full border-2 flex items-center justify-center ${paymentMethod === "bank" ? "border-[#7b3ff2]" : "border-[#ccc]"}`}>
                  {paymentMethod === "bank" && <span className="size-3 rounded-full bg-[#7b3ff2]" />}
                </span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">무통장 입금</span>
                <svg className="size-6 shrink-0" viewBox="0 0 24 24" fill="none">
                  <ellipse cx="12" cy="8" rx="8" ry="3" fill="#888" opacity="0.3"/>
                  <ellipse cx="12" cy="8" rx="8" ry="3" stroke="#555" strokeWidth="1.2"/>
                  <path d="M4 8v4c0 1.66 3.58 3 8 3s8-1.34 8-3V8" stroke="#555" strokeWidth="1.2" fill="none"/>
                  <path d="M4 12v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" stroke="#555" strokeWidth="1.2" fill="none"/>
                  <circle cx="18" cy="17" r="4" fill="#f59e0b"/>
                  <text x="18" y="20" textAnchor="middle" fontSize="6" fontWeight="bold" fill="white">₩</text>
                </svg>
              </label>

              {/* 카카오페이 */}
              <label className="flex items-center gap-3 px-4 py-4 cursor-pointer border-t border-[#eee]" onClick={() => setPaymentMethod("kakao")}>
                <span className={`shrink-0 size-[22px] rounded-full border-2 flex items-center justify-center ${paymentMethod === "kakao" ? "border-[#7b3ff2]" : "border-[#ccc]"}`}>
                  {paymentMethod === "kakao" && <span className="size-3 rounded-full bg-[#7b3ff2]" />}
                </span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">카카오페이</span>
                <span className="inline-flex items-center gap-0.5 bg-[#1a1200] text-[#fee500] text-[11px] font-bold px-2 py-1 rounded-full">
                  <span className="text-[#fee500] text-[13px]">•</span>pay
                </span>
              </label>

              {/* 페이코 */}
              <label className="flex items-center gap-3 px-4 py-4 cursor-pointer border-t border-[#eee]" onClick={() => setPaymentMethod("payco")}>
                <span className={`shrink-0 size-[22px] rounded-full border-2 flex items-center justify-center ${paymentMethod === "payco" ? "border-[#7b3ff2]" : "border-[#ccc]"}`}>
                  {paymentMethod === "payco" && <span className="size-3 rounded-full bg-[#7b3ff2]" />}
                </span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">페이코</span>
                <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#e53935] tracking-tight">PAYCO</span>
              </label>

              {/* 네이버페이 */}
              <label className="flex items-center gap-3 px-4 py-4 cursor-pointer border-t border-[#eee]" onClick={() => setPaymentMethod("naver")}>
                <span className={`shrink-0 size-[22px] rounded-full border-2 flex items-center justify-center ${paymentMethod === "naver" ? "border-[#7b3ff2]" : "border-[#ccc]"}`}>
                  {paymentMethod === "naver" && <span className="size-3 rounded-full bg-[#7b3ff2]" />}
                </span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">네이버페이</span>
                <span className="inline-flex items-center gap-0.5 bg-[#03c75a] text-white text-[11px] font-bold px-2 py-1 rounded-full">
                  <span className="font-['Pretendard:Bold',sans-serif]">N</span>pay
                </span>
              </label>
            </div>

            <label className="flex items-center gap-3 mt-4 cursor-pointer select-none">
              <input
                type="checkbox"
                className="sr-only"
                checked={rememberPaymentMethod}
                onChange={() => setRememberPaymentMethod((v) => !v)}
              />
              <span
                className={cn(
                  "shrink-0 size-[22px] rounded-full border-2 flex items-center justify-center transition-colors",
                  rememberPaymentMethod ? "border-[#7b3ff2] bg-[#7b3ff2]" : "border-[#ccc] bg-white"
                )}
              >
                {rememberPaymentMethod && <Check className="size-3.5 text-white" strokeWidth={2.5} />}
              </span>
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                다음에도 이 결제수단 사용
              </span>
            </label>

            <div className="mt-4 rounded-2xl bg-[#e8f5f9] px-4 py-4 text-left">
              <div className="flex items-start justify-start gap-2 mb-[5px]">
                <ShieldCheck className="size-5 shrink-0 text-[#0fbfc7]" strokeWidth={2} />
                <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#0fbfc7] font-semibold flex flex-col justify-start items-start">
                  안심결제 캠페인
                </span>
              </div>
              <ul className="space-y-2.5 text-[13px] text-[#444] leading-[1.5]">
                <li className="mb-0">
                  하나. 예약시 안내 받은{" "}
                  <span className="font-['Pretendard:Bold',sans-serif] text-[#111]">[가상계좌]</span>로 결제하세요.
                </li>
                <li className="mb-0">
                  둘. 입금시 예금주가{" "}
                  <span className="font-['Pretendard:Bold',sans-serif] text-[#111]">[하나투어]</span>인지 꼭 확인하세요.
                </li>
                <li className="mb-0">
                  셋. 예금주 하나투어가 아닌 계좌로 입금하실 경우 법적 보호를 받으실 수 없습니다.
                </li>
              </ul>
            </div>
          </section>

          {/* 현금영수증 등록 관리 — 항공결제 화면과 동일 */}
          <section className="p-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-normal font-['Pretendard:Regular',sans-serif] text-[15px] text-[#111]">
                  현금영수증 등록 관리
                </h3>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cashReceipt"
                      value="등록"
                      checked={cashReceipt === "등록"}
                      onChange={() => setCashReceipt("등록")}
                      className="size-5 border-2 border-[#c8c8c8] text-[#7b3ff2] focus:ring-[#7b3ff2]"
                    />
                    <span className="text-[14px] text-[#111]">등록</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cashReceipt"
                      value="미등록"
                      checked={cashReceipt === "미등록"}
                      onChange={() => setCashReceipt("미등록")}
                      className="size-5 border-2 border-[#7b3ff2] text-[#7b3ff2] focus:ring-[#7b3ff2]"
                    />
                    <span className="text-[14px] text-[#111]">미등록</span>
                  </label>
                </div>
              </div>

              {cashReceipt === "등록" && (
                <div className="mt-4 pt-4 border-t border-[#eee] relative">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCashReceiptTypeDropdownOpen(!cashReceiptTypeDropdownOpen)}
                      className="w-full flex items-center justify-between py-2 px-3 rounded-[10px] border border-[#e8e8e8] bg-[#f9f9f9] text-left"
                    >
                      <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                        {cashReceiptType}
                      </span>
                      {cashReceiptTypeDropdownOpen ? (
                        <ChevronUp className="size-5 text-[#666] shrink-0" />
                      ) : (
                        <ChevronDown className="size-5 text-[#666] shrink-0" />
                      )}
                    </button>
                    {cashReceiptTypeDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-10 rounded-[10px] border border-[#e8e8e8] bg-white shadow-lg py-1 max-h-[240px] overflow-y-auto">
                        {cashReceiptTypeOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setCashReceiptType(option);
                              setCashReceiptTypeDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[14px] text-[#111] hover:bg-[#f5f5f5]"
                          >
                            {cashReceiptType === option ? (
                              <Check className="size-4 text-[#7b3ff2] shrink-0" />
                            ) : (
                              <span className="size-4 shrink-0" />
                            )}
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {cashReceiptType === "개인소득공제 - 휴대폰번호" && (
                    <div className="mt-3 space-y-4">
                      <div className="flex gap-2">
                        <div className="flex-1 relative flex items-center">
                          <input
                            type="tel"
                            inputMode="numeric"
                            placeholder="숫자만 입력"
                            value={formatPhoneDisplay(cashReceiptPhone)}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                              setCashReceiptPhone(digits);
                            }}
                            className="w-full px-4 py-3 pr-10 border border-[#e8e8e8] rounded-[10px] text-[14px] bg-white placeholder:text-[#999]"
                          />
                          {cashReceiptPhone.replace(/\D/g, "").length > 0 && (
                            <button
                              type="button"
                              onClick={() => setCashReceiptPhone("")}
                              className="absolute right-2 p-1 rounded-full hover:bg-[#e8e8e8] text-[#666]"
                              aria-label="입력 지우기"
                            >
                              <X className="size-4" />
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          className={`shrink-0 px-4 py-3 rounded-[10px] border border-[#e8e8e8] bg-white text-[14px] font-['Pretendard:SemiBold',sans-serif] ${
                            isCashReceiptPhoneValid ? "text-[#111]" : "text-[#666]"
                          }`}
                        >
                          저장
                        </button>
                      </div>
                      <div className="rounded-[10px] bg-[#f9f9f9] border border-[#eee] px-4 py-3">
                        <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111] mb-2">
                          현금영수증 번호 저장 안내
                        </p>
                        <ul className="space-y-1.5 text-[12px] text-[#666] leading-[1.5] list-disc list-inside">
                          <li>
                            현금영수증 등록 정보가 입력 시 마이페이지에서 확인 및
                            수정 가능합니다.
                          </li>
                          <li>
                            등록된 정보가 있으면 현금영수증 신청 시 자동입력
                            버튼을 통해 자동으로 입력됩니다.
                          </li>
                          <li>
                            현금영수증 발급시 번호를 간편하게 불러올 수 있습니다.
                          </li>
                          <li>
                            출발 15일전부터 현금영수증은 별도로 신청해주셔야
                            합니다. (접수경로 : 예약내역 &gt; 결제내역보기)
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 하단 고정 버튼 */}
        <div className="shrink-0 fixed bottom-0 left-0 right-0 bg-white border-t border-[#eee] p-4">
          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-4 bg-[#7b3ff2] text-white rounded-[30px] text-[16px] font-['Pretendard:SemiBold',sans-serif] disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[rgba(94,43,184,1)] transition-colors"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin size-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                결제 처리 중...
              </span>
            ) : (
              `총 ${finalAmount.toLocaleString()}원 결제하기`
            )}
          </button>
        </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
