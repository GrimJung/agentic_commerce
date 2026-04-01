import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { FlightData } from "./FlightCard";
import type { BookingFormData } from "./BookingForm";
import { formatSeatClass } from "./ui/utils";

interface FlightReservationSheetProps {
  flight: FlightData;
  onClose: () => void;
  onProceedToPayment: (data: BookingFormData) => void;
  /** true면 바깥 배경/시트 래퍼 없이 내용만 렌더 (통합 시트 내부 삽입용) */
  embedded?: boolean;
  /** true면 항공+호텔 FIT 조합 플로우 (4단계 표시) */
  isFitCombo?: boolean;
}

/** 공항 코드 추출 */
function getAirportCode(airport?: string): string {
  const match = airport?.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : "";
}

/** 오는 편 표시용 */
function getReturnFlight(outbound: FlightData): FlightData {
  const depCode = outbound.departureCode ?? getAirportCode(outbound.departureAirport);
  const arrCode = outbound.arrivalCode ?? getAirportCode(outbound.arrivalAirport);
  return {
    ...outbound,
    id: outbound.id + "-return",
    departure: outbound.arrival,
    arrival: outbound.departure,
    departureTime: "01:30",
    arrivalTime: "04:10",
    departureAirport: outbound.arrivalAirport,
    arrivalAirport: outbound.departureAirport,
    departureCode: arrCode,
    arrivalCode: depCode,
    flightNumber: "020177",
  };
}

export function FlightReservationSheet({
  flight,
  onClose,
  onProceedToPayment,
  embedded = false,
  isFitCombo = false,
}: FlightReservationSheetProps) {
  useLockBodyScroll(!embedded);
  const [agreeAll, setAgreeAll] = useState(true);
  const [agree1, setAgree1] = useState(true);
  const [agree2, setAgree2] = useState(true);
  const [agree3, setAgree3] = useState(true);
  const [agree4, setAgree4] = useState(true);
  const [agree5, setAgree5] = useState(true);
  const [agree6, setAgree6] = useState(true);
  const [agree7, setAgree7] = useState(true);
  const [agree8, setAgree8] = useState(true);
  const [agree9, setAgree9] = useState(true);
  const [paymentInfoExpanded, setPaymentInfoExpanded] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [outboundExpanded, setOutboundExpanded] = useState(true);

  const returnFlight = getReturnFlight(flight);
  const totalPrice = flight.price;
  const feeTotal = 10000; // 발권대행 수수료
  const fuelAmount = 0;
  const taxAmount = Math.round((totalPrice - feeTotal) * 0.33);
  const baseFare = totalPrice - feeTotal - taxAmount;
  const displayTotal = totalPrice;

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgree1(checked);
    setAgree2(checked);
    setAgree3(checked);
    setAgree4(checked);
    setAgree5(checked);
    setAgree6(checked);
    setAgree7(checked);
    setAgree8(checked);
    setAgree9(checked);
  };

  const handleProceedToPayment = () => {
    if (!agree1 || !agree2 || !agree3 || !agree4 || !agree5 || !agree6 || !agree7 || !agree8 || !agree9) return;
    onProceedToPayment({
      name: "홍길동",
      phone: "010-0000-0000",
      email: "hana@hanatour.com",
      birthDate: "1990-01-01",
      passportNumber: "",
      travelers: 2,
      agreeTerms: true,
      agreeCancellation: true,
    });
  };

  const canProceed = agree1 && agree2 && agree3 && agree4 && agree5 && agree6 && agree7 && agree8 && agree9;

  const content = (
    <>
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-4 py-3 flex items-center justify-between z-10 shrink-0">
          <h1 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
            항공 약관동의
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="size-10 flex items-center justify-center rounded-full text-[#666] hover:bg-[#f0f0f0] hover:text-[#111] transition-colors"
            aria-label="닫기"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 단계 표시 */}
        <div className="py-[10px] px-4 border-b border-[#f0f0f0]">
          {isFitCombo ? (
            <div className="flex items-start">
              <div className="flex flex-col items-center shrink-0">
                <span className="size-[25px] rounded-full bg-[#5e2bb8] flex items-center justify-center text-[13px] text-white font-['Pretendard:SemiBold',sans-serif]">1</span>
                <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] font-bold text-[#5e2bb8] mt-[5px] mb-[5px] leading-[1.2] text-center">항공<br />약관동의</span>
              </div>
              <div className="flex-1 h-px bg-[#e0e0e0] min-w-[12px] mx-1 mt-4" aria-hidden />
              <div className="flex flex-col items-center shrink-0">
                <span className="size-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center text-[13px] text-[#c8c8c8] font-['Pretendard:SemiBold',sans-serif]">2</span>
                <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2] text-center">항공<br />예약정보입력</span>
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
                <span className="size-[25px] rounded-full bg-[#5e2bb8] flex items-center justify-center text-[13px] text-white font-['Pretendard:SemiBold',sans-serif]">1</span>
                <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] font-bold text-[#5e2bb8] mt-[5px] mb-[5px] leading-[1.2]">약관동의</span>
              </div>
              <div className="flex-1 h-px bg-[#e0e0e0] min-w-[24px] mx-1 mt-4" aria-hidden />
              <div className="flex flex-col items-center shrink-0">
                <span className="size-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center text-[13px] text-[#c8c8c8] font-['Pretendard:SemiBold',sans-serif]">2</span>
                <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2]">예약정보입력</span>
              </div>
              <div className="flex-1 h-px bg-[#e0e0e0] min-w-[24px] mx-1 mt-4" aria-hidden />
              <div className="flex flex-col items-center shrink-0">
                <span className="size-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center text-[13px] text-[#c8c8c8] font-['Pretendard:SemiBold',sans-serif]">3</span>
                <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2]">예약완료</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 flex-1 overflow-y-auto pb-[30px]">
          {/* AI 취소수수료 안내 */}
          <div className="mb-4 space-y-2">
            <div className="flex items-start gap-3 bg-[#e8f0fe] rounded-[12px] px-4 py-3">
              <svg className="size-5 shrink-0 mt-0.5 text-[#2d6fdf]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <p className="text-[14px] text-[#1a3a6e] leading-[1.6] font-['Pretendard:Medium',sans-serif]">
                <span className="font-['Pretendard:Bold',sans-serif] text-[#4585ff] font-semibold">2026년 03월 31일 23:56까지</span> 취소 완료 시,<br />
                항공사 취소수수료가 없어요.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-[#f5f5f5] rounded-[12px] px-4 py-3">
              <svg className="size-5 shrink-0 mt-0.5 text-[#888]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              <p className="text-[14px] text-[#444] leading-[1.6] font-['Pretendard:Medium',sans-serif]">
                이후 취소 수수료는<br />
                <span className="text-[#2d6fdf] underline underline-offset-2 cursor-pointer">AI 항공사 취소수수료</span> 안내를 확인해 보세요.
              </p>
            </div>
            <p className="text-[13px] text-[#e03131] pl-1">
              • 단, 발권 대행 수수료는 환불되지 않습니다.
            </p>
          </div>

          <div className="border-t border-[#e5e5e5] mb-4" />

          {/* 가는 항공편 (첨부 이미지 UI) */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
                가는 항공편
              </h3>
              <button
                type="button"
                className="p-1"
                aria-label={outboundExpanded ? "접기" : "펼치기"}
                onClick={() => setOutboundExpanded(!outboundExpanded)}
              >
                {outboundExpanded ? (
                  <ChevronUp className="size-5 text-[#666]" />
                ) : (
                  <ChevronDown className="size-5 text-[#666]" />
                )}
              </button>
            </div>
            {outboundExpanded && (
              <>
            <div className="flex gap-2 mb-3 h-6">
              <span className="text-[12px] px-2.5 py-1 rounded border border-[#90caf9] text-[#1976d2] font-['Pretendard:SemiBold',sans-serif]">
                예약가능
              </span>
              <span className="text-[12px] px-2.5 py-1 rounded border border-[#90caf9] text-[#1976d2] font-['Pretendard:SemiBold',sans-serif]">
                요금확정
              </span>
            </div>
            <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-0.5 font-bold">
              {flight.departure}({(flight.departureCode ?? getAirportCode(flight.departureAirport)) || "—"}) → {flight.arrival}({(flight.arrivalCode ?? getAirportCode(flight.arrivalAirport)) || "—"})
            </p>
            <p className="text-[13px] text-[#666] mb-4">
              {flight.flightDuration} (직항)
            </p>
            {/* 타임라인: 시간은 선 왼쪽, 점은 선 양 끝 */}
            <div className="relative flex gap-0">
              {/* 왼쪽: 시간 컬럼 (세로선 왼쪽) */}
              <div className="w-11 shrink-0 flex flex-col pr-3 mr-[15px]">
                <div className="text-[14px] font-['Pretendard:Bold',sans-serif] text-[#111] leading-tight pt-0.5">
                  {flight.departureTime}
                  <span className="block text-[11px] font-normal text-[#888] mt-0.5">05/12(화)</span>
                </div>
                <div className="flex-1 min-h-[72px]" aria-hidden />
                <div className="text-[14px] font-['Pretendard:Bold',sans-serif] text-[#111] leading-tight pt-0.5">
                  {flight.arrivalTime}
                  <span className="block text-[11px] font-normal text-[#888] mt-0.5">05/12(화)</span>
                </div>
              </div>
              {/* 오른쪽: 세로선 + 양 끝 점 + 내용 */}
              <div className="relative flex-1 min-w-0 pl-[20px]">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-[#e0e0e0]" />
                <span className="absolute left-[-4px] top-1.5 size-2 rounded-full bg-[#bdbdbd] z-10" aria-hidden />
                <span className="absolute left-[-4px] bottom-1.5 size-2 rounded-full bg-[#bdbdbd] z-10" aria-hidden />
                {/* 출발 */}
                <div className="pb-4">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111] font-bold">
                    {flight.departure}({(flight.departureCode ?? getAirportCode(flight.departureAirport)) || "—"}) 출발
                  </p>
                  <p className="text-[13px] text-[#666] mt-0.5">
                    {flight.departureAirport || `${flight.departure} 국제공항`}
                  </p>
                </div>
                <div className="pb-2">
                  <p className="text-[13px] text-[#666]">
                    {flight.airline} {flight.flightNumber}
                  </p>
                  <p className="text-[13px] text-[#666] mt-0.5">
                    {formatSeatClass(flight.seatClass)} ㆍ 위탁 수하물 포함(15kg)
                  </p>
                  <p className="text-[13px] text-[#2d6fdf] mt-1">
                    {flight.flightDuration?.replace(/약\s*/, "").replace(/\s*소요\s*\([^)]*\)?/, "").trim() || flight.flightDuration} 비행
                  </p>
                </div>
                {/* 도착 */}
                <div>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111] font-bold">
                    {flight.arrival}({(flight.arrivalCode ?? getAirportCode(flight.arrivalAirport)) || "—"}) 도착
                  </p>
                  <p className="text-[13px] text-[#666] mt-0.5">
                    {flight.arrivalAirport || `${flight.arrival} 공항`}
                  </p>
                </div>
              </div>
            </div>
              </>
            )}
          </section>

          <div className="h-px bg-[#e8e8e8] my-4" role="separator" aria-hidden />

          {/* 오는 항공편 (동일 UI) */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
                오는 항공편
              </h3>
              <button type="button" className="p-1" aria-label="접기">
                <ChevronUp className="size-5 text-[#666]" />
              </button>
            </div>
            <div className="flex gap-2 mb-3 h-6">
              <span className="text-[12px] px-2.5 py-1 rounded border border-[#90caf9] text-[#1976d2] font-['Pretendard:SemiBold',sans-serif]">
                예약가능
              </span>
              <span className="text-[12px] px-2.5 py-1 rounded border border-[#90caf9] text-[#1976d2] font-['Pretendard:SemiBold',sans-serif]">
                요금확정
              </span>
            </div>
            <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-0.5 font-bold">
              {returnFlight.departure}({(returnFlight.departureCode ?? getAirportCode(returnFlight.departureAirport)) || "—"}) → {returnFlight.arrival}({(returnFlight.arrivalCode ?? getAirportCode(returnFlight.arrivalAirport)) || "—"})
            </p>
            <p className="text-[13px] text-[#666] mb-4">
              {returnFlight.flightDuration} (직항)
            </p>
            {/* 타임라인: 시간은 선 왼쪽, 점은 선 양 끝 */}
            <div className="relative flex gap-0">
              <div className="w-11 shrink-0 flex flex-col pr-3 mr-[15px]">
                <div className="text-[14px] font-['Pretendard:Bold',sans-serif] text-[#111] leading-tight pt-0.5">
                  {returnFlight.departureTime}
                  <span className="block text-[11px] font-normal text-[#888] mt-0.5">05/14(목)</span>
                </div>
                <div className="flex-1 min-h-[72px]" aria-hidden />
                <div className="text-[14px] font-['Pretendard:Bold',sans-serif] text-[#111] leading-tight pt-0.5">
                  {returnFlight.arrivalTime}
                  <span className="block text-[11px] font-normal text-[#888] mt-0.5">05/14(목)</span>
                </div>
              </div>
              <div className="relative flex-1 min-w-0 pl-[20px]">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-[#e0e0e0]" />
                <span className="absolute left-[-4px] top-1.5 size-2 rounded-full bg-[#bdbdbd] z-10" aria-hidden />
                <span className="absolute left-[-4px] bottom-1.5 size-2 rounded-full bg-[#bdbdbd] z-10" aria-hidden />
                <div className="pb-4">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111] font-bold">
                    {returnFlight.departure}({(returnFlight.departureCode ?? getAirportCode(returnFlight.departureAirport)) || "—"}) 출발
                  </p>
                  <p className="text-[13px] text-[#666] mt-0.5">
                    {returnFlight.departureAirport || `${returnFlight.departure} 국제공항`}
                  </p>
                </div>
                <div className="pb-2">
                  <p className="text-[13px] text-[#666]">
                    {returnFlight.airline} {returnFlight.flightNumber}
                  </p>
                  <p className="text-[13px] text-[#666] mt-0.5">
                    {formatSeatClass(returnFlight.seatClass)} ㆍ 위탁 수하물 포함(15kg)
                  </p>
                  <p className="text-[13px] text-[#2d6fdf] mt-1">
                    {returnFlight.flightDuration?.replace(/약\s*/, "").replace(/\s*소요\s*\([^)]*\)?/, "").trim() || returnFlight.flightDuration} 비행
                  </p>
                </div>
                <div>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111] font-bold">
                    {returnFlight.arrival}({(returnFlight.arrivalCode ?? getAirportCode(returnFlight.arrivalAirport)) || "—"}) 도착
                  </p>
                  <p className="text-[13px] text-[#666] mt-0.5">
                    {returnFlight.arrivalAirport || `${returnFlight.arrival} 공항`}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 상품결제정보 (펼침/접힘) */}
          <section className="mb-4">
            <button
              type="button"
              className="w-full flex items-center justify-between text-left py-2 -mx-1 rounded-[8px]"
              onClick={() => setPaymentInfoExpanded(!paymentInfoExpanded)}
            >
              <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                상품결제정보
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
                  {displayTotal.toLocaleString()}원
                </span>
                {paymentInfoExpanded ? (
                  <ChevronUp className="size-5 text-[#666]" />
                ) : (
                  <ChevronDown className="size-5 text-[#666]" />
                )}
              </div>
            </button>
            {paymentInfoExpanded && (
              <>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#666]">기본운임(성인) X 1</span>
                    <span>{baseFare.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#666]">유류할증료 X 1</span>
                    <span>{fuelAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#666]">제세공과금 X 1</span>
                    <span>{taxAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#666]">발권대행 수수료 X 1</span>
                    <span>{feeTotal.toLocaleString()}원</span>
                  </div>
                </div>
                <div className="rounded-[10px] bg-[#f5f5f5] px-4 py-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111]">결제예정금액</span>
                    <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#5e2bb8] font-bold">
                      {displayTotal.toLocaleString()}원
                    </span>
                  </div>
                  <p className="text-[12px] text-[#888] mt-1 text-right">유류할증료/제세공과금 포함</p>
                </div>
                <ul className="mt-4 text-[12px] text-[#5e2bb8] leading-[1.6] space-y-2 list-none pl-0">
                  <li>* 유류할증료/제세공과금은 항공사 사정 및 환율변동에 의해 매일 변경되며 발권 당일 환율에 따라 적용됩니다.</li>
                  <li>* 여행사 발권대행 수수료는 항공료에 포함되며, 항공권 예약, 상담, 발권 업무의 서비스를 탑승자에게 제공하고 서비스의 대가로 받는 취급수수료입니다.</li>
                  <li>* 신용카드 결제 시 발권대행 수수료 금액은 항공권 결제 후 하나투어로 별도 승인됩니다.</li>
                  <li>* 발권대행 수수료는 10,000원이 적용됩니다.(1인 기준, 성인/소아 적용)</li>
                  <li>* 결제된 발권대행 수수료는 환불 되지 않습니다.</li>
                </ul>
              </>
            )}
          </section>

          <div className="h-px bg-[#e8e8e8] my-4" role="separator" aria-hidden />

          {/* 유의사항 (기본 접힘, 펼치면 상세 안내) */}
          <section className="mb-4">
            <button
              type="button"
              className="w-full flex items-center justify-between text-left py-2 -mx-1 rounded-[8px]"
              onClick={() => setNotesExpanded(!notesExpanded)}
            >
              <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                유의사항
              </h3>
              {notesExpanded ? (
                <ChevronUp className="size-5 text-[#666]" />
              ) : (
                <ChevronDown className="size-5 text-[#666]" />
              )}
            </button>
            {notesExpanded && (
              <div className="mt-2 space-y-4 text-[13px] text-[#333] leading-[1.65]">
                <div>
                  <p className="mb-2">
                    국가/지역별로 입국 제한, 자가격리, PCR 음성 확인서 등이 필요할 수 있습니다. 일부 부정기편은 대한민국 여권 소지자만 탑승 가능하며, 외국 국적에 대한 탑승 제한 및 예외 사항은 외교부, 항공사, 대사관을 통해 확인 후 준비하시기 바랍니다.
                  </p>
                  <p className="mb-2">
                    출국 전 경유지 및 목적지 국가의 비자 필요 여부를 직접 확인하고 비자를 준비해 주세요. 비자 미소지로 인한 출국/입국 거절, 발생 비용, 항공권 환불 수수료는 당사에서 책임지지 않습니다.
                  </p>
                  <p className="mb-2">
                    편도 항공권 구매 시 입국 국적의 비자를 반드시 소지해야 하며, 비자 미소지 시 출국이 거부될 수 있습니다. (일부 국적은 복편 항공권이 없으면 탑승 수속이 거절될 수 있으니 유의하시기 바랍니다.)
                  </p>
                  <p>
                    무비자 입국이 가능한 국가라도 편도 항공권으로 입국은 불가할 수 있으므로, 해당 국적 대사관을 통해 입국 조건을 미리 확인해 주세요.
                  </p>
                </div>
                <div>
                  <p className="mb-2">
                    유류할증료/제세공과금은 항공사 사정 및 환율 변동에 의해 매일 변경되며, 발권 당일 환율에 따라 적용됩니다.
                  </p>
                  <p>
                    항공권 취소 수수료는 항공사마다 규정이 다르므로 해당 운임의 요금 규정을 반드시 확인해 주세요.
                  </p>
                </div>
                <div>
                  <p>
                    환불 소요 시간은 여행사에서 항공사로 환불 접수 후 평균적으로 2주 이내 심사/승인이 소요되며, 카드 결제 건의 경우 카드사의 이용 내역을 통해 확인할 수 있습니다. (일부 항공사의 심사/승인 절차로 인해 안내된 기간보다 길어지는 경우에는 별도로 안내될 예정입니다.)
                  </p>
                </div>
              </div>
            )}
          </section>

          <div className="h-px bg-[#e8e8e8] my-4" role="separator" aria-hidden />

          {/* 약관 동의 */}
          <section className="mb-4">
            <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-3 -ml-1">
              약관 동의
            </h3>
            <label className="flex items-center gap-3 py-0 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeAll}
                onChange={(e) => handleAgreeAll(e.target.checked)}
                className="size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]"
              />
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111]">전체 동의</span>
            </label>
            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={agree1} onChange={(e) => setAgree1(e.target.checked)} className="size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]" />
                <span className="text-[13px] text-[#666]">요금 / 환불 규정 안내 (필수)</span>
              </label>
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={agree2} onChange={(e) => setAgree2(e.target.checked)} className="size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]" />
                <span className="text-[13px] text-[#666]">개인정보 수집 및 이용 동의 (필수)</span>
              </label>
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={agree3} onChange={(e) => setAgree3(e.target.checked)} className="size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]" />
                <span className="text-[13px] text-[#666]">개인정보 제3자 제공 동의 (필수)</span>
              </label>
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={agree4} onChange={(e) => setAgree4(e.target.checked)} className="size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]" />
                <span className="text-[13px] text-[#666]">개인정보 국외 이전 동의 (필수)</span>
              </label>
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={agree5} onChange={(e) => setAgree5(e.target.checked)} className="size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]" />
                <span className="text-[13px] text-[#666]">고유식별정보 수집 및 처리 동의 (필수)</span>
              </label>
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={agree6} onChange={(e) => setAgree6(e.target.checked)} className="size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]" />
                <span className="text-[13px] text-[#666]">결제 및 발권동의 (필수)</span>
              </label>
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={agree7} onChange={(e) => setAgree7(e.target.checked)} className="size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]" />
                <span className="text-[13px] text-[#666]">발권수수료 (필수)</span>
              </label>
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={agree8} onChange={(e) => setAgree8(e.target.checked)} className="size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]" />
                <span className="text-[13px] text-[#666]">하나투어 항공 일반규정 (필수)</span>
              </label>
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={agree9} onChange={(e) => setAgree9(e.target.checked)} className="size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]" />
                <span className="text-[13px] text-[#666]">항공사 정보 동의 (필수)</span>
              </label>
            </div>

          </section>
        </div>

        {/* 하단 고정 다음단계 버튼 */}
        <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4 shrink-0">
          <button
            type="button"
            onClick={handleProceedToPayment}
            disabled={!canProceed}
            className="w-full py-4 bg-[#5e2bb8] text-white rounded-[30px] text-[16px] font-['Pretendard:Bold',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5e2bb8] transition-colors"
          >
            다음단계
          </button>
        </div>
    </>
  );

  if (embedded) return content;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
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
  );
}
