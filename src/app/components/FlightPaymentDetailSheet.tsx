"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, CreditCard, ChevronDown, ChevronUp, CircleAlert, X, Check } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

interface FlightPaymentDetailSheetProps {
  totalAmount: number;
  onBack: () => void;
  onComplete: () => void;
}

export function FlightPaymentDetailSheet({
  totalAmount,
  onBack,
  onComplete,
}: FlightPaymentDetailSheetProps) {
  useLockBodyScroll();
  const [amountDetailOpen, setAmountDetailOpen] = useState(false);
  const [cardCompany, setCardCompany] = useState("");
  const [cardNumber, setCardNumber] = useState(["", "", "", ""]);
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [installment, setInstallment] = useState("");
  const [cardOwner, setCardOwner] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cashReceipt, setCashReceipt] = useState<"등록" | "미등록">("미등록");
  const [cashReceiptPhone, setCashReceiptPhone] = useState("");
  const cashReceiptTypeOptions = [
    "개인소득공제 - 휴대폰번호",
    "개인소득공제 - 현금영수증카드",
    "사업자증빙 - 사업자등록번호",
    "사업자증빙 - 현금영수증카드",
  ] as const;
  type CashReceiptType = (typeof cashReceiptTypeOptions)[number];
  const [cashReceiptType, setCashReceiptType] = useState<CashReceiptType>(
    "개인소득공제 - 휴대폰번호"
  );
  const [cashReceiptTypeDropdownOpen, setCashReceiptTypeDropdownOpen] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discountAmount = 0;
  const insuranceAmount = 9720;
  const productAmount = Math.max(0, totalAmount - insuranceAmount);
  const finalAmount = totalAmount - discountAmount;

  const formatPhoneDisplay = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const isCashReceiptPhoneValid = cashReceiptPhone.replace(/\D/g, "").length === 11;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/50 z-[60] flex items-end"
        onClick={onBack}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-white w-full rounded-t-[24px] max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-4 py-3 flex items-center justify-start gap-2 z-10 shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="size-6 text-[#111]" />
            </button>
            <h1 className="font-['Pretendard:SemiBold',sans-serif] text-[18px] text-[#111]">
              항공 결제하기
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto pb-28">
            {/* 결제 상세 내역 */}
            <section className="px-5 py-4 border-b border-[#f0f0f0]">
              <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-3">
                결제 상세 내역
              </h3>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[14px] text-[#333]">결제 예정 금액</span>
                <span className="text-[14px] text-[#111] font-['Pretendard:Bold',sans-serif]">
                  {totalAmount.toLocaleString()} 원
                </span>
              </div>
              {amountDetailOpen && (
                <div className="text-[13px] text-[#666] mb-2 pl-0">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#999]">ㄴ 총 상품 금액</span>
                    <span className="text-[#111]">{productAmount.toLocaleString()} 원</span>
                  </div>
                  <div className="flex justify-end py-0.5">
                    <button type="button" className="text-base text-[#111] hover:underline">
                      인원 별 운임 정보 &gt;
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#999]">ㄴ 여행자보험 금액</span>
                    <span className="text-[#111]">{insuranceAmount.toLocaleString()} 원</span>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setAmountDetailOpen(!amountDetailOpen)}
                className="flex items-center justify-end gap-1 w-full text-[12px] text-[#4585ff] font-['Pretendard:SemiBold',sans-serif] mb-3"
              >
                금액 자세히 보기
                {amountDetailOpen ? (
                  <ChevronUp className="size-4 shrink-0" aria-hidden />
                ) : (
                  <ChevronDown className="size-4 shrink-0" aria-hidden />
                )}
              </button>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#eee]">
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111]">
                  최종 결제금액
                </span>
                <span className="font-['Pretendard:SemiBold',sans-serif] text-[20px] text-[#5e2bb8]">
                  {finalAmount.toLocaleString()}원
                </span>
              </div>
            </section>

            {/* 결제수단 */}
            <section className="px-5 py-4 border-b border-[#f0f0f0]">
              <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-1">
                결제수단
              </h3>
              <p className="text-[13px] text-[#666] mb-3">결제 조건 변경</p>
              <div className="rounded-[10px] border border-[#eee] bg-[#f5f5f5] px-4 py-3 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#111]">성인 1인</span>
                  <ChevronDown className="size-5 text-[#666]" />
                </div>
              </div>
              {/* 신용카드 ~ 주의사항 통합 박스 */}
              <div className="rounded-[10px] bg-white border border-[#eee] px-4 py-4 mt-3">
                <label className="flex items-center gap-3 py-3 cursor-pointer border-b border-[#eee]">
                  <input
                    type="radio"
                    name="payMethod"
                    defaultChecked
                    className="size-5 text-[#7b3ff2]"
                  />
                  <span className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#5e2bb8]">
                    신용카드
                  </span>
                  <CreditCard className="size-5 text-[#5e2bb8] shrink-0" />
                </label>
                <div className="flex items-center justify-between text-[12px] text-[#666] py-2">
                  <span>신용카드정보 제공 항목</span>
                  <span className="text-[#666] underline font-medium">무이자 할부/제휴 안내</span>
                </div>

                {/* 신용카드 정보 입력 */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between px-4 py-3 border border-[#e8e8e8] rounded-[10px] bg-white">
                    <span className="text-[14px] text-[#999]">개인</span>
                    <ChevronDown className="size-5 text-[#999]" />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border border-[#e8e8e8] rounded-[10px] bg-white">
                    <span className="text-[14px] text-[#999]">
                      {cardCompany || "카드사"}
                    </span>
                    <ChevronDown className="size-5 text-[#999]" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={4}
                        placeholder="0000"
                        value={cardNumber[i] || ""}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          const next = [...cardNumber];
                          next[i] = v;
                          setCardNumber(next);
                        }}
                        className="w-full min-w-0 px-2 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] text-center bg-white placeholder:text-[#999]"
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="카드 유효기간(MM/YYYY)"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] placeholder:text-[#999] bg-white"
                  />
                  <input
                    type="password"
                    maxLength={2}
                    placeholder="비밀번호 앞 2자리"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    className="w-full px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] placeholder:text-[#999] bg-white"
                  />
                  <div className="flex items-center justify-between px-4 py-3 border border-[#e8e8e8] rounded-[10px] bg-white">
                    <span className="text-[14px] text-[#999]">
                      {installment || "할부기간"}
                    </span>
                    <ChevronDown className="size-5 text-[#999]" />
                  </div>
                  <input
                    type="text"
                    placeholder="카드 소유자 이름"
                    value={cardOwner}
                    onChange={(e) => setCardOwner(e.target.value)}
                    className="w-full px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] placeholder:text-[#999] bg-white"
                  />
                  <input
                    type="text"
                    placeholder="법정 생년월일"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    className="w-full px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] placeholder:text-[#999] bg-white"
                  />
                </div>

                {/* 신용카드 결제 시 주의사항 - 회색 음영 박스 */}
                <div className="mt-4 rounded-[10px] bg-[#f5f5f5] border border-[#eee] px-4 py-4">
                  <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111] mb-3 flex items-center gap-1.5">
                    <span
                      className="inline-flex items-center justify-center text-[#666] cursor-help"
                      title="신용카드 결제 시 유의사항을 확인해 주세요."
                    >
                      <CircleAlert className="size-5 shrink-0" aria-hidden />
                    </span>
                    신용카드 결제 시 주의사항
                  </h3>
                  <ul className="space-y-2 text-[13px] text-[#666] leading-[1.5] list-disc list-inside">
                    <li>항공권 카드 결제는 본인에 한해 가능합니다.</li>
                    <li>
                      본인이 아닌 경우 항공사에서 증명 서류 요청이 있을 수 있습니다.
                    </li>
                    <li>원칙적으로 3자 카드 결제는 불가합니다.</li>
                    <li>
                      무기명 법인카드 결제 시 예약 내역에서 증빙 서류 첨부 요청
                      (예: 사업자등록증, 명함, 재직증명서, 카드 앞/뒷면 복사본)이 있을
                      수 있습니다.
                    </li>
                    <li>
                      신용카드 프로모션 특별 할인 운임은 법인카드 적용이 불가할 수
                      있습니다.
                    </li>
                  </ul>
                </div>
              </div>

              {/* 현금영수증 등록 관리 */}
              <div className="mt-4">
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

                {/* 등록 선택 시: 현금영수증 유형 선택 및 휴대폰번호 입력 */}
                {cashReceipt === "등록" && (
                  <div className="mt-4 pt-4 border-t border-[#eee] relative">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setCashReceiptTypeDropdownOpen(!cashReceiptTypeDropdownOpen)
                        }
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

          {/* 하단 고정 결제 버튼 */}
          <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4 shrink-0">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-[#5e2bb8] text-white rounded-[30px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#4a2190] transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin size-5"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  결제 처리 중...
                </span>
              ) : (
                `${finalAmount.toLocaleString()}원 결제하기`
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
