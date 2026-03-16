import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserPlus, ChevronUp, ChevronDown, ChevronRight, ArrowLeft, X } from "lucide-react";
import { FlightData } from "./FlightCard";
import type { BookingFormData } from "./BookingForm";
import { PassengerFormSheet } from "./PassengerFormSheet";
import { FlightPaymentDetailSheet } from "./FlightPaymentDetailSheet";

interface FlightPaymentSheetProps {
  flight: FlightData;
  bookingData: BookingFormData;
  onBack: () => void;
  /** 완료 시 호출. isPayLater true면 나중에 결제 후 예약완료(예약완료 화면 문구 구분용) */
  onProceedToPayment: (isPayLater?: boolean) => void;
  /** true면 바깥 배경/시트 래퍼 없이 내용만 렌더 (통합 시트 내부 삽입용) */
  embedded?: boolean;
  /** true면 항공+호텔 FIT 조합 플로우 (4단계 표시) */
  isFitCombo?: boolean;
}

export function FlightPaymentSheet({
  flight,
  bookingData,
  onBack,
  onProceedToPayment,
  embedded = false,
  isFitCombo = false,
}: FlightPaymentSheetProps) {
  const [paymentType, setPaymentType] = useState<"immediate" | "later">("immediate");
  const [usageGuideOpen, setUsageGuideOpen] = useState(false);
  const [paymentInfoOpen, setPaymentInfoOpen] = useState(false);
  const [showPassengerSheet, setShowPassengerSheet] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showPaymentDetailSheet, setShowPaymentDetailSheet] = useState(false);

  const totalPrice = flight.price;

  const content = (
    <>
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-4 py-3 flex items-center justify-start gap-2 z-10 shrink-0">
          <button onClick={onBack} className="p-2 -ml-2" aria-label="뒤로 가기">
            <ArrowLeft className="size-6 text-[#111]" />
          </button>
          <h1 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
            예약정보입력
          </h1>
        </div>

        {/* 단계 표시 */}
        <div className="py-[10px] px-4 border-b border-[#f0f0f0]">
          {isFitCombo ? (
            <div className="flex items-start">
              <div className="flex flex-col items-center shrink-0">
                <span className="size-[25px] rounded-full border border-[#5e2bb8] bg-white flex items-center justify-center text-[#5e2bb8] font-['Pretendard:SemiBold',sans-serif]">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </span>
                <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2] text-center">항공<br />약관동의</span>
              </div>
              <div className="flex-1 h-px bg-[#e0e0e0] min-w-[12px] mx-1 mt-4" aria-hidden />
              <div className="flex flex-col items-center shrink-0">
                <span className="size-[25px] rounded-full bg-[#5e2bb8] flex items-center justify-center text-[13px] text-white font-['Pretendard:SemiBold',sans-serif]">2</span>
                <span className="text-[12px] font-bold font-['Pretendard:SemiBold',sans-serif] text-[#5e2bb8] mt-[5px] mb-[5px] leading-[1.2] text-center">항공<br />예약정보입력</span>
              </div>
              <div className="flex-1 h-px bg-[#e0e0e0] min-w-[12px] mx-1 mt-4" aria-hidden />
              <div className="flex flex-col items-center shrink-0">
                <span className="size-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center text-[13px] text-[#c8c8c8] font-['Pretendard:SemiBold',sans-serif]">3</span>
                <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2] text-center">항공<br />예약완료</span>
              </div>
              <div className="flex-1 h-px bg-[#e0e0e0] min-w-[12px] mx-1 mt-4" aria-hidden />
              <div className="flex flex-col items-center shrink-0">
                <span className="size-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center text-[13px] text-[#c8c8c8] font-['Pretendard:SemiBold',sans-serif]">4</span>
                <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2] text-center">호텔예약</span>
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              <div className="flex flex-col items-center shrink-0">
                <span className="size-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center text-[13px] text-[#c8c8c8] font-['Pretendard:SemiBold',sans-serif]">1</span>
                <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2]">약관동의</span>
              </div>
              <div className="flex-1 h-px bg-[#e0e0e0] min-w-[24px] mx-1 mt-4" aria-hidden />
              <div className="flex flex-col items-center shrink-0">
                <span className="size-[25px] rounded-full bg-[#5e2bb8] flex items-center justify-center text-[13px] text-white font-['Pretendard:SemiBold',sans-serif]">2</span>
                <span className="text-[12px] font-bold font-['Pretendard:SemiBold',sans-serif] text-[#5e2bb8] mt-[5px] mb-[5px] leading-[1.2]">예약정보 입력</span>
              </div>
              <div className="flex-1 h-px bg-[#e0e0e0] min-w-[24px] mx-1 mt-4" aria-hidden />
              <div className="flex flex-col items-center shrink-0">
                <span className="size-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center text-[13px] text-[#c8c8c8] font-['Pretendard:SemiBold',sans-serif]">3</span>
                <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2]">예약완료</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 flex-1 overflow-y-auto pb-28">
          {/* 예약자 정보 (로그인 회원 기반, 읽기 전용 딤 처리 · 2열: 라벨 | 입력) */}
          <section className="mb-5">
            <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-3">
              예약자 정보
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="shrink-0 w-[88px] text-[13px] text-[#666]">이름</label>
                <input
                  type="text"
                  readOnly
                  value={bookingData?.name ?? "홍길동"}
                  className="flex-1 min-w-0 px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] bg-[#f5f5f5] text-[#888] cursor-default"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="shrink-0 w-[88px] text-[13px] text-[#666]">생년월일</label>
                <input
                  type="text"
                  readOnly
                  value={bookingData?.birthDate?.replace(/-/g, ".") ?? "1990.01.01"}
                  className="flex-1 min-w-0 px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] bg-[#f5f5f5] text-[#888] cursor-default"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="shrink-0 w-[88px] text-[13px] text-[#666]">이메일</label>
                <input
                  type="email"
                  readOnly
                  value={bookingData?.email ?? "hana@hanatour.com"}
                  className="flex-1 min-w-0 px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] bg-[#f5f5f5] text-[#888] cursor-default"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="shrink-0 w-[88px] text-[13px] text-[#666]">휴대폰 번호</label>
                <input
                  type="text"
                  readOnly
                  value={bookingData?.phone ?? "010-0000-0000"}
                  className="flex-1 min-w-0 px-4 py-3 border border-[#e8e8e8] rounded-[10px] text-[14px] bg-[#f5f5f5] text-[#888] cursor-default"
                />
              </div>
            </div>
          </section>

          {/* 탑승자 정보 */}
          <section className="mb-5 pt-5 border-t border-[#f0f0f0]">
            <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-2">
              탑승자 정보
            </h3>
            <button
              type="button"
              onClick={() => setShowPassengerSheet(true)}
              className="w-full py-3.5 border border-[#eee] rounded-[10px] flex items-center justify-center gap-2 text-[14px] text-[#4585ff] font-['Pretendard:Medium',sans-serif] hover:bg-[#f9f9f9]"
            >
              <UserPlus className="size-5 text-[#4585ff]" />
              탑승자 정보 입력하기
            </button>
          </section>

          {/* 이용안내 (접기/펼치기) */}
          <section className="mb-5 pt-5 border-t border-[#f0f0f0]">
            <button
              type="button"
              className="w-full flex items-center justify-between py-2 text-left"
              onClick={() => setUsageGuideOpen(!usageGuideOpen)}
            >
              <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                이용안내
              </h3>
              {usageGuideOpen ? <ChevronUp className="size-5 text-[#666]" /> : <ChevronDown className="size-5 text-[#666]" />}
            </button>
            {usageGuideOpen && (
              <div className="text-[13px] text-[#666] leading-[1.6] space-y-2">
                <p>항공사 사정에 따라 취소 및 시간 변경 수수료가 발생할 수 있습니다.</p>
                <p>환불/변경 시 수수료 부과 시점은 운송약관을 확인해 주세요.</p>
                <p><span className="text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">항공권 결제 완료 시 마이페이지에서 확인 가능</span>합니다.</p>
                <p>운영시간 외 예약은 익일 처리될 수 있습니다.</p>
              </div>
            )}
          </section>

          {/* 운임상세일정 */}
          <section className="mb-5 pt-5 border-t border-[#f0f0f0]">
            <h3 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
              운임상세일정
            </h3>
            <button
              type="button"
              className="w-full py-3 px-4 border border-[#e0e0e0] rounded-[10px] bg-white text-[14px] text-[#111] font-['Pretendard:Medium',sans-serif] hover:bg-[#f9f9f9]"
            >
              요금 / 환불 규정 및 상세일정 보기
            </button>
          </section>

          {/* 예약취소수수료 규정 */}
          <section className="mb-5 pt-5 border-t border-[#f0f0f0]">
            <div className="space-y-2 mb-2">
              <div className="rounded-[10px] bg-[#f0f7ff] px-4 py-3">
                <p className="text-[13px]">
                  <span className="font-['Pretendard:SemiBold',sans-serif] font-medium text-[#4585ff]">2024년 03월 10일 23:59</span>
                  <span className="text-[#666]">까지 취소/환불 시 취소수수료가 없습니다.</span>
                </p>
              </div>
              <div className="rounded-[10px] border border-[#eee] bg-[#f5f5f5] px-4 py-3">
                <p className="text-[13px] text-[#666]">
                  이후 취소 수수료는{" "}
                  <span className="underline text-[12px] text-[#4585ff] font-['Pretendard:SemiBold',sans-serif]">AI 항공사 취소수수료</span>
                  {" "}안내를 확인해 보세요.
                </p>
              </div>
            </div>
            <p className="text-[12px] text-[#e53935]">단, 발권 대행 수수료는 환불되지 않습니다.</p>
          </section>

          {/* 결제방식 선택 */}
          <section className="mb-5 pt-5 border-t border-[#f0f0f0]">
            <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-3">
              결제방식 선택
            </h3>
            <div className="space-y-3">
              <label className={`flex items-start gap-3 p-4 rounded-[12px] border cursor-pointer ${paymentType === "immediate" ? "border-[#7b3ff2] bg-white" : "border-[#eee] bg-white"}`}>
                <input
                  type="radio"
                  name="paymentType"
                  checked={paymentType === "immediate"}
                  onChange={() => setPaymentType("immediate")}
                  className="mt-0.5 size-5 text-[#7b3ff2]"
                />
                <div>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#5e2bb8]">즉시결제</p>
                  <p className="text-[12px] text-[#666] mt-0.5">결제 완료 후 예약이 확정되며, 예약 확인서와 E-티켓이 발행됩니다.</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 p-4 rounded-[12px] border cursor-pointer ${paymentType === "later" ? "border-[#7b3ff2] bg-white" : "border-[#eee] bg-white"}`}>
                <input
                  type="radio"
                  name="paymentType"
                  checked={paymentType === "later"}
                  onChange={() => setPaymentType("later")}
                  className="mt-0.5 size-5 text-[#7b3ff2]"
                />
                <div>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#5e2bb8]">나중에결제</p>
                  <p className="text-[12px] text-[#666] mt-0.5">예약 완료 후 24시간 내 결제할 수 있으며, 기간 내 미결제 시 예약이 자동 취소됩니다.</p>
                </div>
              </label>
            </div>
          </section>

          {/* 상품결제정보 (펼침/접힘) */}
          <section className="mb-4 pt-5 border-t border-[#f0f0f0]">
            <button
              type="button"
              className="w-full flex items-center justify-between py-2 text-left"
              onClick={() => setPaymentInfoOpen(!paymentInfoOpen)}
            >
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                상품결제정보
              </span>
              <span className="flex items-center gap-1.5">
                {!paymentInfoOpen && (
                  <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#7b3ff2]">
                    {totalPrice.toLocaleString()}원
                  </span>
                )}
                {paymentInfoOpen ? <ChevronUp className="size-5 text-[#666]" /> : <ChevronDown className="size-5 text-[#666]" />}
              </span>
            </button>
            {paymentInfoOpen && (
              <div className="pt-1 flex flex-col items-end text-right">
                <p className="font-['Pretendard:SemiBold',sans-serif] text-[20px] text-[#5e2bb8]">
                  {totalPrice.toLocaleString()}원
                </p>
                <p className="text-[13px] text-[#888] mt-0.5">유류할증료/제세공과금 포함</p>
              </div>
            )}
          </section>

          {/* 결제수단 선택 */}
          <section className="mb-5 pt-5 border-t border-[#f0f0f0]">
            <label className="block font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111] mb-1">
              결제수단 선택
            </label>
            <p className="text-[12px] text-[#888] mb-2">결제조건 변경</p>
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 border border-[#eee] rounded-[10px] text-[14px] text-[#111]"
            >
              <span>신한</span>
              <ChevronRight className="size-5 text-[#999]" />
            </button>
          </section>
        </div>

        {/* 하단 고정: 금액 · 결제하기 / 예약하기 — 즉시결제/나중에결제 모두 먼저 예약 최종 확인 팝업 표시 */}
        <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4 shrink-0">
          <button
            type="button"
            onClick={() => setShowConfirmPopup(true)}
            className="w-full py-4 bg-[#5e2bb8] text-white rounded-[30px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#4a2190] transition-colors flex items-center justify-center"
          >
            {paymentType === "later"
              ? "예약하기"
              : `${totalPrice.toLocaleString()}원 · 결제하기`}
          </button>
        </div>
    </>
  );

  const passengerSheet = showPassengerSheet && (
    <PassengerFormSheet
      onClose={() => setShowPassengerSheet(false)}
      bookerName={bookingData?.name ?? "홍길동"}
      bookerBirthDate={bookingData?.birthDate?.replace(/-/g, ".") ?? "1990.01.01"}
      bookerPhone={bookingData?.phone ?? "010-0000-0000"}
      bookerEmail={bookingData?.email ?? "hana@hanatour.com"}
    />
  );

  const birthDateDisplay = bookingData?.birthDate ?? "1990-01-11";
  const confirmPopup = (
    <AnimatePresence>
      {showConfirmPopup && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-end"
          onClick={() => setShowConfirmPopup(false)}
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
            <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-4 py-3 flex items-center justify-between shrink-0 z-10">
              <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
                예약내역 최종 확인
              </h2>
              <button
                type="button"
                onClick={() => setShowConfirmPopup(false)}
                className="p-2 -mr-2 text-[#666] hover:text-[#111]"
                aria-label="닫기"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="px-5 py-4 flex-1 overflow-y-auto pb-28">
              {/* 탑승자정보 */}
              <section className="mb-5">
                <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-2">
                  탑승자정보 총 1명
                </h3>
                <div className="rounded-[10px] border border-[#eee] overflow-hidden">
                  <table className="w-full text-left text-[14px]">
                    <thead>
                      <tr className="bg-[#f9f9f9] border-b border-[#eee]">
                        <th className="px-3 py-2.5 text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">영문 성</th>
                        <th className="px-3 py-2.5 text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">영문 이름</th>
                        <th className="px-3 py-2.5 text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">생년월일</th>
                        <th className="px-3 py-2.5 text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">성별</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#f0f0f0] last:border-b-0">
                        <td className="px-3 py-2.5 text-[#111]">JUNG</td>
                        <td className="px-3 py-2.5 text-[#111]">GRIM</td>
                        <td className="px-3 py-2.5 text-[#111]">{birthDateDisplay}</td>
                        <td className="px-3 py-2.5 text-[#111]">여</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <ul className="mt-3 space-y-1.5 text-[12px] text-[#666] leading-[1.5] list-disc list-inside">
                  <li>예약 완료 후에는 탑승자 정보 변경이 불가능하므로, 영문 철자와 성-이름 순서가 정확한지 확인해 주세요.</li>
                  <li>영문 성/이름 입력 시 띄어쓰기나 &quot;-&quot; 표시 없이 영문 스펠링만 입력해 주세요.</li>
                  <li>탑승자 영문 성명, 생년월일, 성별이 여권과 동일해야 하며, 다를 경우 탑승이 거절될 수 있습니다.</li>
                </ul>
              </section>

              {/* 예약자 연락정보 확인 */}
              <section className="mb-5">
                <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-2">
                  예약자 연락정보 확인
                </h3>
                <div className="rounded-[10px] border border-[#eee] overflow-hidden">
                  <table className="w-full text-left text-[14px]">
                    <tbody>
                      <tr className="border-b border-[#f0f0f0]">
                        <td className="px-3 py-2.5 text-[#666] w-[100px] shrink-0">휴대폰 번호</td>
                        <td className="px-3 py-2.5 text-[#111]">{bookingData?.phone ?? "010-6624-5390"}</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2.5 text-[#666]">이메일</td>
                        <td className="px-3 py-2.5 text-[#111]">{bookingData?.email ?? "jung90111@gmail.com"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[12px] text-[#666] leading-[1.5]">
                  예약 및 발권 진행 현황 알림과 예약 상담을 위해 정확한 연락 정보를 입력했는지 확인해 주세요.
                </p>
              </section>
            </div>

            {/* 하단 버튼: 나중에결제는 예약 완료로, 즉시결제는 결제 상세 시트로 */}
            <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4 shrink-0 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmPopup(false)}
                className="flex-1 py-3.5 border border-[#e0e0e0] rounded-[12px] text-[15px] text-[#666] font-['Pretendard:SemiBold',sans-serif] bg-white hover:bg-[#f9f9f9] transition-colors"
              >
                다시 확인하기
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmPopup(false);
                  if (paymentType === "later") {
                    onProceedToPayment(true);
                  } else {
                    setShowPaymentDetailSheet(true);
                  }
                }}
                className="flex-1 py-3.5 bg-[#7b3ff2] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
              >
                확인 완료
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const paymentDetailSheet =
    showPaymentDetailSheet && (
      <FlightPaymentDetailSheet
        totalAmount={totalPrice}
        onBack={() => setShowPaymentDetailSheet(false)}
        onComplete={() => {
          setShowPaymentDetailSheet(false);
          onProceedToPayment(false);
        }}
      />
    );

  if (embedded)
    return (
      <>
        {content}
        {passengerSheet}
        {confirmPopup}
        {paymentDetailSheet}
      </>
    );
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onBack}>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-white w-full rounded-t-[24px] max-h-[85vh] overflow-y-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </motion.div>
      </div>
      {passengerSheet}
      {confirmPopup}
    </>
  );
}
