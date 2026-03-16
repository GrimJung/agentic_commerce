import { motion } from "motion/react";
import { formatSeatClass } from "./ui/utils";

const CITY_TO_AIRPORT_CODE: Record<string, string> = {
  인천: "ICN",
  파리: "CDG",
  도쿄: "NRT",
  발리: "DPS",
  방콕: "BKK",
  싱가포르: "SIN",
  홍콩: "HKG",
  오사카: "KIX",
  다낭: "DAD",
  세부: "CEB",
  산토리니: "JTR",
};

function toAirportCode(code: string | undefined, cityName: string): string {
  if (code != null && code !== "") return code;
  return CITY_TO_AIRPORT_CODE[cityName] ?? cityName;
}

export interface FlightData {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  flightDuration: string;
  seatClass: string;
  price: number;
  destination: string;
  passengerCount: number;
  /** 여행 기간 날짜 표기 (예: "04.01(월)~04.06(토)") */
  travelDateRange?: string;
  /** 여행 기간 (예: "4박 6일") */
  duration?: string;
  isDirect: boolean; // 직항 여부
  departureAirport?: string; // 출발 공항 상세
  arrivalAirport?: string; // 도착 공항 상세
  departureCode?: string; // 출발 공항 코드 (예: ICN)
  arrivalCode?: string; // 도착 공항 코드 (예: HND)
  baggage?: string; // 수하물 규정
  flightNumber?: string; // 항공편명
  recommendReason: string;
}

interface FlightCardProps {
  flight: FlightData;
  rank: number;
  onClick: () => void;
  onBooking: () => void;
}

export function FlightCard({ flight, rank, onClick, onBooking }: FlightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="bg-white rounded-[16px] p-4 shadow-sm border border-[#e5e5e5] cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-[#7b3ff2] flex items-center justify-center text-white text-[12px] font-['Pretendard:Bold',sans-serif]">
            {rank}
          </div>
          <span className="text-[12px] text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">추천 항공편</span>
        </div>
      </div>

      {/* AI 추천 이유 */}
      <div className="flex gap-2 bg-[#f5f0ff] rounded-[8px] px-3 py-2.5 mb-[5px]">
        <span className="shrink-0 w-[3px] self-stretch rounded-full bg-[#7b3ff2]" />
        <p className="text-[13px] leading-[1.5] text-[#555] line-clamp-2">
          {flight.recommendReason}
        </p>
      </div>

      {/* 일정 · 여행기간 · 인원 */}
      {(flight.travelDateRange != null || flight.duration != null || flight.passengerCount != null) && (
        <div className="flex items-start justify-start gap-[3px] px-0 text-[15px] mb-[5px] tracking-[-0.5px]">
          {flight.travelDateRange != null && (
            <>
              <span className="text-[13px] text-[#666]">{flight.travelDateRange}</span>
              {flight.duration != null && <span className="text-[13px] text-[#666] shrink-0">・</span>}
            </>
          )}
          {flight.duration != null && (
            <>
              <span className="text-[13px] text-[#666] shrink-0">{flight.duration}</span>
              <span className="text-[13px] text-[#666] shrink-0">・</span>
            </>
          )}
          <span className="text-[13px] text-[#666]">성인 {flight.passengerCount}인 기준</span>
        </div>
      )}

      {/* 항공 정보 */}
      <div className="bg-[#f8f9fa] rounded-[12px] p-3 mb-3">
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
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2 mb-0">
                <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold">
                  {flight.departureTime}-{flight.arrivalTime}
                </span>
                <span className="text-[12px] text-[#888]">
                  {toAirportCode(flight.departureCode, flight.departure)}-
                  {toAirportCode(flight.arrivalCode, flight.arrival)}
                </span>
              </div>
              <p className="text-[12px] text-[#666]">
                {flight.airline}
                {flight.flightNumber != null ? ` ${flight.flightNumber}` : ""}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[12px] text-[#888]">
                {flight.isDirect ? "직항" : "경유"}·{flight.flightDuration.replace(/^약\s*/, "").replace(/\s*\(\d+회\s*경유\)/, "")}
              </p>
              {flight.baggage && (
                <p className="text-[11px] text-[#999]">{flight.baggage}</p>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#999] mr-1">성인1 기준</span>
          <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#7b3ff2] font-semibold">
            {flight.price.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 상세보기 / 예약하기 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex-1 py-2.5 bg-white border border-[#2d6fdf] text-[#2d6fdf] rounded-[30px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f8f4ff] transition-colors"
        >
          상세보기
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBooking();
          }}
          className="flex-1 py-2.5 bg-[#7b3ff2] text-white rounded-[30px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
        >
          예약하기
        </button>
      </div>
    </motion.div>
  );
}
