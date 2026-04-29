import { useState } from "react";
import { ChevronUp, ChevronDown, Clock, Plane, Info } from "lucide-react";
import { FlightData } from "./FlightCard";
import { formatSeatClass } from "./ui/utils";
import { FlightFareRefundPolicySheet } from "./FlightFareRefundPolicySheet";

const DEFAULT_FLIGHT_YEAR = 2026;

/** YYYY-MM-DD / YYYY.MM.DD → YYYY.MM.DD */
function toDisplayYMD(s: string): string {
  const t = s.trim().replace(/\//g, ".");
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    const [y, m, d] = t.split("-");
    return `${y}.${m}.${d}`;
  }
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(t)) return t;
  return t;
}

/**
 * travelDateRange 예: "04.01(월)~04.06(토)" → 가는편/오는편 YYYY.MM.DD
 */
function parseTravelDateRangeToYMD(
  travelDateRange: string | undefined,
  year: number
): { outbound: string; inbound: string } | null {
  if (!travelDateRange?.includes("~")) return null;
  const parts = travelDateRange.split("~").map((p) => p.trim());
  if (parts.length !== 2) return null;
  const parsePart = (p: string) => {
    const m = p.match(/^(\d{2})\.(\d{2})/);
    return m ? `${year}.${m[1]}.${m[2]}` : null;
  };
  const outbound = parsePart(parts[0]);
  const inbound = parsePart(parts[1]);
  if (!outbound || !inbound) return null;
  return { outbound, inbound };
}

function getOutboundInboundDisplayDates(flight: FlightData): { outbound: string; inbound: string } {
  if (flight.outboundDate && flight.returnDate) {
    return {
      outbound: toDisplayYMD(flight.outboundDate),
      inbound: toDisplayYMD(flight.returnDate),
    };
  }
  const parsed = parseTravelDateRangeToYMD(flight.travelDateRange, DEFAULT_FLIGHT_YEAR);
  if (parsed) return parsed;
  return {
    outbound: `${DEFAULT_FLIGHT_YEAR}.01.01`,
    inbound: `${DEFAULT_FLIGHT_YEAR}.01.08`,
  };
}

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
  /** 결제조건변경 클릭 시 호출. 제공되면 버튼이 '결제조건변경'으로 바뀜 */
  onChangePaymentCondition?: () => void;
  /** 결제조건 선택 후 표시할 조정된 가격 */
  priceOverride?: number;
  /** 결제조건 선택 후 표시할 카드명 */
  cardLabel?: string;
  /** 상세보기 클릭 시 추가 동작. 기본 바텀시트는 항상 열립니다. */
  onFlightFareRefundPolicyDetails?: () => void;
}

export function FlightDetailContent({
  flight,
  hideBookingButton = false,
  onBooking,
  onChangeFlight,
  onChangePaymentCondition,
  priceOverride,
  cardLabel,
  onFlightFareRefundPolicyDetails,
}: FlightDetailContentProps) {
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const [outboundExpanded, setOutboundExpanded] = useState(true);
  const [returnExpanded, setReturnExpanded] = useState(true);
  const [fareRefundPolicyOpen, setFareRefundPolicyOpen] = useState(false);

  const depCode = flight.departureCode ?? getAirportCode(flight.departureAirport);
  const arrCode = flight.arrivalCode ?? getAirportCode(flight.arrivalAirport);
  const returnFlight = getReturnFlight(flight);
  const { outbound: outboundDateStr, inbound: inboundDateStr } = getOutboundInboundDisplayDates(flight);

  /** "약 2시간 30분" → "2시간 30분", "직항, 총 05시간 40분"용 */
  const durationLabel = (dur: string) => dur.replace(/^약\s*/, "").trim();
  const routeLabel = (dep: string, arr: string, dCode: string, aCode: string) =>
    dCode && aCode ? `${dep} - ${arr} ${dCode}-${aCode}` : `${dep} - ${arr}`;

  const airportLine = (f: FlightData) =>
    `${f.departureAirport ?? `${f.departure} 국제공항`}-${f.arrivalAirport ?? `${f.arrival} 공항`}`;
  const outboundScheduleLine = airportLine(flight);
  const inboundScheduleLine = airportLine(returnFlight);

  return (
    <>
      <div className="px-5 pt-0 pb-[5px] flex-1 border-t-8 border-[#ededed]">
        {/* 윗 블록과 구분 + 항공 상세 정보 헤더 */}
        <div className="mt-4 mb-3">
          <button
            type="button"
            onClick={() => setSectionExpanded(!sectionExpanded)}
            className="w-full flex items-center justify-between gap-2 text-left"
          >
            <div className="flex min-w-0 flex-1 items-center gap-[5px]">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-[8px] bg-[rgb(69,132,255)] text-[13px] font-bold leading-none text-white font-['Pretendard:Bold',sans-serif]"
                aria-hidden
              >
                1
              </span>
              <Plane className="size-[18px] shrink-0 text-[rgb(69,132,255)]" strokeWidth={2.25} aria-hidden />
              <h3 className="min-w-0 font-semibold font-['Pretendard:SemiBold',sans-serif] text-[18px] text-[#111]">
                항공 상세 정보
              </h3>
            </div>
            {sectionExpanded ? <ChevronUp className="size-5 shrink-0 text-[#666]" /> : <ChevronDown className="size-5 shrink-0 text-[#666]" />}
          </button>
          <p className="mt-[5px] text-left text-[15px] text-[rgb(69,132,255)] font-['Pretendard:Medium',sans-serif] tracking-tight">
            가는편 : {outboundDateStr} | 오는편 : {inboundDateStr}
          </p>
        </div>
        {sectionExpanded && (
        <>
        {/* 항공 요약 (FIT 카드와 동일 스타일) */}
        <div className="bg-[#f8f9fa] rounded-[12px] p-3 mb-4">
          {!hideBookingButton && (
            <div className="flex items-start justify-start gap-2 mb-[5px]">
              <Plane className="size-4 text-[#6329C4]" />
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
          <div className="mb-3">
            <div className="flex items-center justify-end gap-2 flex-wrap mt-1">
              <span className="text-[11px] text-[#999]">
                {cardLabel ?? "삼성 iD GLOBAL 카드"}/성인{flight.passengerCount}인 기준
              </span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#6329C4] font-semibold tabular-nums">
                {(priceOverride ?? flight.price).toLocaleString()}원
              </span>
              {onChangePaymentCondition ? (
                <button
                  type="button"
                  onClick={onChangePaymentCondition}
                  className="shrink-0 py-1.5 px-2.5 rounded-[8px] text-[12px] text-[#666] font-['Pretendard:Medium',sans-serif] border border-[#e0e0e0] bg-white hover:bg-[#f5f5f5] transition-colors"
                >
                  결제조건변경
                </button>
              ) : null}
            </div>
          </div>
          {onChangeFlight ? (
            <button
              type="button"
              onClick={onChangeFlight}
              className="w-full py-2.5 border border-[#e0e0e0] rounded-[10px] text-[14px] text-[#666] font-['Pretendard:Medium',sans-serif] bg-white hover:bg-[#f0f0f0] transition-colors"
            >
              항공권 변경
            </button>
          ) : null}
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
              <div className="relative border-l-2 border-[#5423AD] pl-4 ml-1">
                {/* 출발 */}
                <div className="flex gap-3 pb-3">
                  <div className="shrink-0 w-12 text-left">
                    <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#5423AD]">{flight.departureTime}</p>
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
                    <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#5423AD]">{flight.arrivalTime}</p>
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
              <div className="relative border-l-2 border-[#5423AD] pl-4 ml-1">
                <div className="flex gap-3 pb-3">
                  <div className="shrink-0 w-12 text-left">
                    <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#5423AD]">{returnFlight.departureTime}</p>
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
                    <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#5423AD]">{returnFlight.arrivalTime}</p>
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

        <div className="mb-6 rounded-[16px] bg-[#f5f5f5] p-4">
          <div className="flex items-center justify-between gap-3 mb-0">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Info className="size-[18px] shrink-0 text-[#111]" strokeWidth={2} aria-hidden />
              <span className="text-[14px] font-['Pretendard:Medium',sans-serif] font-medium text-[#111]">
                항공 요금/환불 규정
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onFlightFareRefundPolicyDetails?.();
                setFareRefundPolicyOpen(true);
              }}
              className="shrink-0 rounded-full border border-[#e0e0e0] bg-white px-3.5 py-1.5 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] hover:bg-[#fafafa] transition-colors"
            >
              상세보기
            </button>
          </div>
          <ul className="list-disc list-outside space-y-0 pl-4 text-[13px] text-[#666] leading-[1.6] marker:text-[#bbb] [&>li]:mb-0">
            <li>결제된 발권대행 수수료는 환불되지 않습니다.</li>
            <li>유류할증료 및 제세공과금은 항공사 사정 및 환율변동에 의해 매일 변경될 수 있습니다.</li>
            <li>예약변경 및 환불 수수료는 별도이며, 상세내용은 요금/환불 규정을 확인바랍니다.</li>
          </ul>
        </div>
        </>
        )}
      </div>

      {!hideBookingButton && onBooking && (
        <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4 shrink-0">
          <button
            onClick={onBooking}
            className="w-full py-4 bg-[#6329C4] text-white rounded-[12px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#5423AD] transition-colors"
          >
            예약하기
          </button>
        </div>
      )}

      <FlightFareRefundPolicySheet
        open={fareRefundPolicyOpen}
        onClose={() => setFareRefundPolicyOpen(false)}
        airline={flight.airline}
        outboundSchedule={outboundScheduleLine}
        inboundSchedule={inboundScheduleLine}
      />
    </>
  );
}
