import { useState } from "react";
import { ChevronUp, ChevronDown, Clock, Plane } from "lucide-react";
import { FlightData } from "./FlightCard";
import { formatSeatClass } from "./ui/utils";

/** 공항 문자열에서 코드 추출 (예: "인천국제공항 (ICN)" → "ICN") */
function getAirportCode(airport?: string, fallback?: string): string {
  if (fallback) return fallback;
  const match = airport?.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : "";
}

/** 왕복 중 '오는 편' 표시용 가상 데이터 */
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
    flightDuration: "2시간 40분 소요 (직항)",
    flightNumber: "020177",
    baggage: "기내 수하물 포함 (1개)",
  };
}

export interface FlightDetailContentProps {
  flight: FlightData;
  /** FIT 조합 상세 내부에 넣을 때 true면 하단 예약하기 버튼 숨김 */
  hideBookingButton?: boolean;
  onBooking?: () => void;
  /** 항공권 변경 클릭 시 호출 (항공권 선택 팝업 열기) */
  onChangeFlight?: () => void;
}

export function FlightDetailContent({
  flight,
  hideBookingButton = false,
  onBooking,
  onChangeFlight,
}: FlightDetailContentProps) {
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const [outboundExpanded, setOutboundExpanded] = useState(true);
  const [returnExpanded, setReturnExpanded] = useState(true);

  const depCode = flight.departureCode ?? getAirportCode(flight.departureAirport);
  const arrCode = flight.arrivalCode ?? getAirportCode(flight.arrivalAirport);
  const returnFlight = getReturnFlight(flight);

  /** "약 2시간 30분" → "2시간 30분", "직항, 총 05시간 40분"용 */
  const durationLabel = (dur: string) => dur.replace(/^약\s*/, "").trim();
  const routeLabel = (dep: string, arr: string, dCode: string, aCode: string) =>
    dCode && aCode ? `${dep} - ${arr} ${dCode}-${aCode}` : `${dep} - ${arr}`;

  return (
    <>
      <div className="px-5 pt-0 pb-[5px] flex-1 border-t-8 border-[#ededed]">
        {/* 윗 블록과 구분 + 항공 상세 정보 헤더 */}
        <div className="mt-4 mb-3">
          <button
            type="button"
            onClick={() => setSectionExpanded(!sectionExpanded)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[18px] text-[#111]">항공 상세 정보</h3>
            {sectionExpanded ? <ChevronUp className="size-5 text-[#666]" /> : <ChevronDown className="size-5 text-[#666]" />}
          </button>
        </div>
        {sectionExpanded && (
        <>
        {/* 항공 요약 (FIT 카드와 동일 스타일) */}
        <div className="bg-[#f8f9fa] rounded-[12px] p-3 mb-4">
          {!hideBookingButton && (
            <div className="flex items-start justify-start gap-2 mb-[5px]">
              <Plane className="size-4 text-[#7b3ff2]" />
              <span className="text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">
                항공
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-3 mb-[5px]">
            <div className="flex items-center gap-2 font-semibold">
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold">
                {flight.departure}
              </span>
              <span className="text-[#666]">↔</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold">
                {flight.arrival}
              </span>
            </div>
            <div className="flex items-center justify-end gap-3">
              <span className="text-[12px] text-[#666]">
                {formatSeatClass(flight.seatClass)}
              </span>
            </div>
          </div>
          <div className="space-y-3 mb-2">
            {/* 가는 편 */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 mb-0">
                  <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold">
                    {flight.departureTime}-{flight.arrivalTime}
                  </span>
                  <span className="text-[12px] text-[#888]">
                    {depCode}-{arrCode}
                  </span>
                </div>
                <p className="text-[12px] text-[#666]">
                  {flight.airline}
                  {flight.flightNumber != null ? ` ${flight.flightNumber}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[12px] text-[#888]">
                  직항·{durationLabel(flight.flightDuration)}
                </p>
                <p className="text-[11px] text-[#999]">수하물 포함</p>
              </div>
            </div>
            {/* 오는 편 */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 mb-0">
                  <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold">
                    {returnFlight.departureTime}-{returnFlight.arrivalTime}
                  </span>
                  <span className="text-[12px] text-[#888]">
                    {returnFlight.departureCode ?? arrCode}-{returnFlight.arrivalCode ?? depCode}
                  </span>
                </div>
                <p className="text-[12px] text-[#666]">
                  {returnFlight.airline} {returnFlight.flightNumber != null ? returnFlight.flightNumber : flight.flightNumber ?? ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[12px] text-[#888]">
                  직항·{durationLabel(returnFlight.flightDuration.replace(" 소요", "").replace(/\(직항\)/, "").trim())}
                </p>
                <p className="text-[11px] text-[#999]">수하물 포함</p>
              </div>
            </div>
          </div>
          <div className="border-t border-[#e8e8e8] pt-3 mb-0" aria-hidden="true" />
          <div className="text-right mb-3">
            <span className="text-[11px] text-[#999] mr-1">
              성인{flight.passengerCount}인 기준
            </span>
            <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#7b3ff2] font-semibold">
              {flight.price.toLocaleString()}원
            </span>
          </div>
          <button
            type="button"
            onClick={onChangeFlight}
            className="w-full py-2.5 border border-[#e0e0e0] rounded-[10px] text-[14px] text-[#666] font-['Pretendard:Medium',sans-serif] bg-white hover:bg-[#f0f0f0] transition-colors"
          >
            항공권 변경
          </button>
        </div>

        {/* 가는 항공편 — 타임라인 레이아웃 */}
        <div className="border border-[#eee] rounded-[12px] overflow-hidden mb-4">
          <button
            type="button"
            className="w-full px-4 py-3 flex items-center justify-between bg-white text-left"
            onClick={() => setOutboundExpanded(!outboundExpanded)}
          >
            <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">가는 항공편</span>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#888]">예약가능 9석</span>
              {outboundExpanded ? (
                <ChevronUp className="size-5 text-[#666]" />
              ) : (
                <ChevronDown className="size-5 text-[#666]" />
              )}
            </div>
          </button>
          {outboundExpanded && (
            <div className="px-4 pb-4 pt-0 border-t border-[#f0f0f0]">
              <div className="flex flex-wrap gap-2 mb-3 mt-3">
                <span className="flex flex-col justify-center items-center h-5 text-[11px] px-2 py-1 rounded border border-[#0d9488] text-[#0d9488] font-['Pretendard:SemiBold',sans-serif]">
                  예약가능
                </span>
                <span className="flex flex-col justify-center items-center h-5 text-[11px] px-2 py-1 rounded border border-[#0d9488] text-[#0d9488] font-['Pretendard:SemiBold',sans-serif]">
                  요금확정
                </span>
              </div>
              <p className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-0.5">
                {routeLabel(flight.departure, flight.arrival, depCode, arrCode)}
              </p>
              <p className="text-[13px] text-[#666] mb-4">
                직항, 총 {durationLabel(flight.flightDuration)}
              </p>
              {/* 타임라인 */}
              <div className="relative border-l-2 border-[#2563eb] pl-4 ml-1">
                {/* 출발 */}
                <div className="flex gap-3 pb-3">
                  <div className="shrink-0 w-12 text-left">
                    <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#2563eb]">{flight.departureTime}</p>
                    <p className="text-[11px] text-[#666]">05.12(금)</p>
                  </div>
                  <div>
                    <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111]">
                      {flight.departure} 출발 ({depCode || "—"})
                    </p>
                    <p className="text-[12px] text-[#888]">
                      {flight.departureAirport || `${flight.departure} 국제공항`} - 터미널1
                    </p>
                  </div>
                </div>
                {/* 항공편 카드 */}
                <div className="rounded-[8px] bg-[#f5f5f5] p-3 mb-3">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111] mb-1">
                    {flight.airline} {flight.flightNumber ?? ""}
                  </p>
                  <p className="text-[12px] text-[#666] mb-0.5">
                    {flight.baggage ?? "기내식, 위탁 수하물 포함 (1개)"}
                  </p>
                  <p className="text-[12px] text-[#666] mb-1">{formatSeatClass(flight.seatClass)}</p>
                  <p className="flex items-center gap-1.5 text-[12px] text-[#888]">
                    <Clock className="size-3.5" />
                    {durationLabel(flight.flightDuration)} 비행
                  </p>
                </div>
                {/* 도착 */}
                <div className="flex gap-3">
                  <div className="shrink-0 w-12 text-left">
                    <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#2563eb]">{flight.arrivalTime}</p>
                    <p className="text-[11px] text-[#666]">05.12(금)</p>
                  </div>
                  <div>
                    <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111]">
                      {flight.arrival} 도착 ({arrCode || "—"})
                    </p>
                    <p className="text-[12px] text-[#888]">
                      {flight.arrivalAirport || `${flight.arrival} 공항`} - 터미널1
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 오는 항공편 — 타임라인 레이아웃 */}
        <div className="border border-[#eee] rounded-[12px] overflow-hidden mb-4">
          <button
            type="button"
            className="w-full px-4 py-3 flex items-center justify-between bg-white text-left"
            onClick={() => setReturnExpanded(!returnExpanded)}
          >
            <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">오는 항공편</span>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#888]">예약가능 9석</span>
              {returnExpanded ? (
                <ChevronUp className="size-5 text-[#666]" />
              ) : (
                <ChevronDown className="size-5 text-[#666]" />
              )}
            </div>
          </button>
          {returnExpanded && (
            <div className="px-4 pb-4 pt-0 border-t border-[#f0f0f0]">
              <div className="flex flex-wrap gap-2 mb-3 mt-3">
                <span className="flex flex-col justify-center items-center h-5 text-[11px] px-2 py-1 rounded border border-[#0d9488] text-[#0d9488] font-['Pretendard:SemiBold',sans-serif]">
                  예약가능
                </span>
                <span className="flex flex-col justify-center items-center h-5 text-[11px] px-2 py-1 rounded border border-[#0d9488] text-[#0d9488] font-['Pretendard:SemiBold',sans-serif]">
                  요금확정
                </span>
              </div>
              <p className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-0.5">
                {routeLabel(returnFlight.departure, returnFlight.arrival, returnFlight.departureCode ?? "", returnFlight.arrivalCode ?? "")}
              </p>
              <p className="text-[13px] text-[#666] mb-4">
                직항, 총 {durationLabel(returnFlight.flightDuration.replace(" 소요", "").replace(/\(직항\)/, "").trim())}
              </p>
              <div className="relative border-l-2 border-[#2563eb] pl-4 ml-1">
                <div className="flex gap-3 pb-3">
                  <div className="shrink-0 w-12 text-left">
                    <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#2563eb]">{returnFlight.departureTime}</p>
                    <p className="text-[11px] text-[#666]">05.14(목)</p>
                  </div>
                  <div>
                    <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111]">
                      {returnFlight.departure} 출발 ({returnFlight.departureCode || "—"})
                    </p>
                    <p className="text-[12px] text-[#888]">
                      {returnFlight.departureAirport || `${returnFlight.departure} 공항`} - 터미널1
                    </p>
                  </div>
                </div>
                <div className="rounded-[8px] bg-[#f5f5f5] p-3 mb-3">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111] mb-1">
                    {returnFlight.airline} {returnFlight.flightNumber ?? ""}
                  </p>
                  <p className="text-[12px] text-[#666] mb-0.5">
                    {returnFlight.baggage ?? "기내식, 기내 수하물 포함 (1개)"}
                  </p>
                  <p className="text-[12px] text-[#666] mb-1">{formatSeatClass(flight.seatClass)}</p>
                  <p className="flex items-center gap-1.5 text-[12px] text-[#888]">
                    <Clock className="size-3.5" />
                    {durationLabel(returnFlight.flightDuration.replace(" 소요", "").replace(/\(직항\)/, "").trim())} 비행
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-12 text-left">
                    <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#2563eb]">{returnFlight.arrivalTime}</p>
                    <p className="text-[11px] text-[#666]">05.14(목)</p>
                  </div>
                  <div>
                    <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111]">
                      {returnFlight.arrival} 도착 ({returnFlight.arrivalCode || "—"})
                    </p>
                    <p className="text-[12px] text-[#888]">
                      {returnFlight.arrivalAirport || `${returnFlight.arrival} 국제공항`} - 터미널1
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 items-start mb-6">
          <p className="text-[13px] text-[#666] leading-[1.5]">
            해당 항공권은 유류할증료 및 세금 포함이며, 유류할증료는 실시간으로 변동될 수 있습니다.
          </p>
        </div>
        </>
        )}
      </div>

      {!hideBookingButton && onBooking && (
        <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4 shrink-0">
          <button
            onClick={onBooking}
            className="w-full py-4 bg-[#7b3ff2] text-white rounded-[12px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#6930d9] transition-colors"
          >
            예약하기
          </button>
        </div>
      )}
    </>
  );
}
