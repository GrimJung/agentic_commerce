import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, CreditCard, Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "./ui/utils";

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

type PaymentMethod = "card" | "kakao" | "payco" | "naver";

type CardOption = "samsung" | "hana" | null;

export function PaymentSheet({ amount, onSuccess, onClose, bookerName = "고객", reservationTitle, completionDetails, isFitCombo = false, skipPayment = false, skipCompletion = false }: PaymentSheetProps) {
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

  const formatPhoneDisplay = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };
  const isCashReceiptPhoneValid = cashReceiptPhone.replace(/\D/g, "").length === 11;

  const totalDiscount = mileageUse;
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[60] flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-h-[90vh] flex flex-col rounded-t-[24px]"
      >
        {isPaymentComplete ? (
          /* 결제완료 화면 — 캡처와 동일 구성 */
          <>
            <div className="shrink-0 border-b border-[#eee]">
              <div className="flex items-center justify-between px-4 py-3">
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
                <div className="py-3 px-4 border-t border-[#f0f0f0]">
                  <div className="flex items-start">
                    <div className="flex flex-col items-center shrink-0">
                      <span className="size-8 rounded-full border border-[#5e2bb8] bg-white flex items-center justify-center text-[#5e2bb8] font-['Pretendard:SemiBold',sans-serif]">
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      </span>
                      <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-1.5 text-center">항공<br />예약완료</span>
                    </div>
                    <div className="flex-1 h-px bg-[#e0e0e0] min-w-[12px] mx-1 mt-4" aria-hidden />
                    <div className="flex flex-col items-center shrink-0">
                      <span className="size-8 rounded-full border border-[#5e2bb8] bg-white flex items-center justify-center text-[#5e2bb8] font-['Pretendard:SemiBold',sans-serif]">
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      </span>
                      <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-1.5 text-center">호텔<br />예약정보입력</span>
                    </div>
                    <div className="flex-1 h-px bg-[#e0e0e0] min-w-[12px] mx-1 mt-4" aria-hidden />
                    <div className="flex flex-col items-center shrink-0">
                      <span className="size-8 rounded-full bg-[#5e2bb8] flex items-center justify-center text-[13px] text-white font-['Pretendard:SemiBold',sans-serif]">3</span>
                      <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#7b3ff2] mt-1.5 text-center">호텔<br />결제완료</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 pb-48">
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
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[#eee]">
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

        <div className="flex-1 overflow-y-auto pb-28">
          {/* 결제 상세 내역 */}
          <section className="p-4 border-b border-[#f0f0f0]">
            <h2 className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111] mb-3">
              결제 상세 내역
            </h2>
            <div className="space-y-2 text-[13px] text-[#333]">
              <div className="flex justify-between items-center">
                <span>총 상품금액</span>
                <span>
                  {amount.toLocaleString()}
                  <span className="font-['Pretendard:Bold',sans-serif]">원</span>
                  <span className="text-[#666] font-normal ml-1">(USD {amountUsd})</span>
                </span>
              </div>
              <div className="flex justify-between items-center pl-3">
                <span className="text-[#666]">ㄴ 상품금액</span>
                <span>{amount.toLocaleString()} 원</span>
              </div>
              <button
                type="button"
                onClick={() => setAmountDetailOpen(!amountDetailOpen)}
                className="flex items-center justify-end gap-0.5 w-full text-[12px] text-[#4585ff] font-['Pretendard:SemiBold',sans-serif] mt-1"
              >
                금액 자세히 보기 {amountDetailOpen ? "^" : "⌄"}
              </button>
              {amountDetailOpen && (
                <div className="pt-2 mt-2 border-t border-[#eee] space-y-1 text-[13px] text-[#666]">
                  <div className="flex justify-between">
                    <span>총 할인금액</span>
                    <span>{totalDiscount.toLocaleString()}원</span>
                  </div>
                </div>
              )}
              <div className="pt-2 mt-2 border-t border-[#eee]">
                <div className="flex justify-between items-center">
                  <span className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#333]">
                    최종 결제금액
                  </span>
                  <span className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#7b3ff2]">
                    {finalAmount.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 결제수단 */}
          <section className="p-4 border-b border-[#f0f0f0]">
            <h2 className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111] mb-3">
              결제수단
            </h2>

            {/* 전체를 감싸는 하나의 박스 */}
            <div className="rounded-[12px] border border-[#e5e5e5] bg-white overflow-hidden">
              {/* 신용카드 */}
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="size-5 text-[#7b3ff2]"
                />
                <CreditCard className="size-5 text-[#666]" />
                <span className="text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">신용카드</span>
              </label>
              <div className="border-t border-[#eee]" />
              {paymentMethod === "card" && (
                <>
                  <div className="px-4 pb-3">
                    <div className="text-center mb-4">
                      <p className="text-[13px] text-[#666] mb-1">
                        오늘도 [하나]같이 특별한 혜택!
                      </p>
                      <button type="button" className="text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">
                        카드 바로 선택하기
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setSelectedCard("samsung")}
                        className={cn(
                          "relative rounded-[10px] border p-4 text-left transition-colors",
                          selectedCard === "samsung" ? "border-[#7b3ff2] bg-[#f9f5ff]" : "border-[#e5e5e5] bg-white"
                        )}
                      >
                        {selectedCard === "samsung" ? (
                          <Check className="absolute top-3 right-3 size-5 text-[#7b3ff2]" />
                        ) : (
                          <div className="absolute top-3 right-3 size-5 rounded-full border-2 border-[#ddd]" />
                        )}
                        <p className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#2563eb] mb-0.5">삼성카드</p>
                        <p className="text-[12px] text-[#333]">하나투어 삼성카드</p>
                        <p className="text-[11px] text-[#666] mt-1">12/24개월 라이트 할부</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCard("hana")}
                        className={cn(
                          "relative rounded-[10px] border p-4 text-left transition-colors",
                          selectedCard === "hana" ? "border-[#7b3ff2] bg-[#f9f5ff]" : "border-[#e5e5e5] bg-white"
                        )}
                      >
                        {selectedCard === "hana" ? (
                          <Check className="absolute top-3 right-3 size-5 text-[#7b3ff2]" />
                        ) : (
                          <div className="absolute top-3 right-3 size-5 rounded-full border-2 border-[#ddd]" />
                        )}
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="flex size-6 items-center justify-center rounded bg-[#00a870] text-[10px] font-bold text-white">하나</span>
                          <span className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">하나카드</span>
                        </div>
                        <p className="text-[12px] text-[#333]">하나카드</p>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[12px] text-[#666] py-2 mb-2">
                      <span>신용카드정보 제공 항목</span>
                      <button type="button" className="text-[#666] underline font-medium">무이자 할부 / 제휴 안내</button>
                    </div>
                    <div className="space-y-2 mb-2">
                      <div className="flex items-center justify-between px-4 py-3 border border-[#e8e8e8] rounded-[10px] bg-white">
                        <span className="text-[14px] text-[#999]">카드사</span>
                        <ChevronDown className="size-5 text-[#999]" />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 border border-[#e8e8e8] rounded-[10px] bg-white">
                        <span className="text-[14px] text-[#999]">할부기간을 선택해 주세요</span>
                        <ChevronDown className="size-5 text-[#999]" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="border-t border-[#eee]" />
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "kakao"}
                  onChange={() => setPaymentMethod("kakao")}
                  className="size-5 text-[#7b3ff2]"
                />
                <span className="text-[14px] font-medium text-[#111]">카카오페이</span>
                <span className="text-[12px] font-bold text-[#fee500] bg-[#3c1e1e] px-1.5 py-0.5 rounded">pay</span>
              </label>
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-t border-[#eee]">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "payco"}
                  onChange={() => setPaymentMethod("payco")}
                  className="size-5 text-[#7b3ff2]"
                />
                <span className="text-[14px] font-medium text-[#111]">페이코</span>
                <span className="text-[11px] font-bold text-[#e53935]">PAYCO</span>
              </label>
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-t border-[#eee]">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "naver"}
                  onChange={() => setPaymentMethod("naver")}
                  className="size-5 text-[#7b3ff2]"
                />
                <span className="text-[14px] font-medium text-[#111]">네이버페이</span>
                <span className="text-[12px] font-bold text-[#03c75a]">N pay</span>
              </label>
            </div>

            {/* 다음에도 이 결제수단 사용 — 박스 밖 */}
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberPaymentMethod}
                  onChange={(e) => setRememberPaymentMethod(e.target.checked)}
                  className="size-5 rounded border-2 border-[#c8c8c8] text-[#7b3ff2] focus:ring-[#7b3ff2]"
                />
                <span className="text-[14px] text-[#111]">다음에도 이 결제수단 사용</span>
              </label>
          </section>

          {/* 현금영수증 등록 관리 — 항공결제 화면과 동일 */}
          <section className="p-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
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
            className="w-full py-4 bg-[#7b3ff2] text-white rounded-[12px] text-[16px] font-['Pretendard:SemiBold',sans-serif] disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
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
    </motion.div>
  );
}
