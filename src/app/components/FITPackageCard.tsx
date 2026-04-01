import { motion } from "motion/react";
import { Plane, Building2 } from "lucide-react";
import { formatSeatClass } from "./ui/utils";

/** 도시명(한글) → IATA 공항코드(영어) — 코드 없을 때 영어로 표시 */
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

export interface FITPackageData {
  id: string;
  flightInfo: {
    airline: string;
    departure: string;
    arrival: string;
    /** 공항 코드 (예: ICN, CDG) - 있으면 왕복 블록에 노선으로 표시 */
    departureCode?: string;
    arrivalCode?: string;
    departureTime: string;
    arrivalTime: string;
    /** 왕복 오는 편 출발/도착 */
    returnDepartureTime?: string;
    returnArrivalTime?: string;
    /** 편명 (예: KE 123) */
    flightNumber?: string;
    returnFlightNumber?: string;
    /** 가는 편 비행시간 표기 (예: 직항·05시간 50분) */
    flightDurationLabel?: string;
    /** 오는 편 비행시간 표기 (예: 직항·05시간 35분) */
    returnFlightDurationLabel?: string;
    price: number;
    seatClass: string;
    flightDuration: string;
  };
  hotelInfo: {
    name: string;
    grade: string;
    location: string;
    address?: string;
    roomType: string;
    price: number;
  };
  totalPrice: number;
  duration: string;
  /** 여행 기간 날짜 표기 (예: "04.01(월)~04.06(토)") */
  travelDateRange?: string;
  destination: string;
  passengerCount: number;
  recommendReason: string;
}

interface FITPackageCardProps {
  package: FITPackageData;
  rank: number;
  onClick: () => void;
  onBooking: () => void;
}

export function FITPackageCard({
  package: pkg,
  rank,
  onClick,
  onBooking,
}: FITPackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="bg-white rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] overflow-hidden"
    >
      <div className="p-4">
        {/* 순위 배지 */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="size-6 rounded-full bg-gradient-to-br from-[#7b3ff2] to-[#b794f6] flex items-center justify-center">
            <span className="text-white text-[13px] font-['Pretendard:Bold',sans-serif]">
              {rank}
            </span>
          </div>
          <span className="text-[13px] text-[#7b3ff2] font-['Pretendard:Bold',sans-serif]">
            항공+호텔
          </span>
        </div>

        {/* AI 추천 이유 */}
        <div className="flex gap-2 bg-[#f5f0ff] rounded-[8px] px-3 py-2.5 mb-[5px]">
          <span className="shrink-0 w-[3px] self-stretch rounded-full bg-[#7b3ff2]" />
          <p className="text-[13px] leading-[1.5] text-[#555] line-clamp-2">
            {pkg.recommendReason}
          </p>
        </div>

        {/* 일정 · 여행기간 · 인원 (항공 박스 위 여백 영역) */}
        <div className="flex items-start justify-start gap-[3px] px-0 text-[15px] mb-[5px] tracking-[-0.5px]">
          <span className="text-[13px] text-[#666]">
            {pkg.travelDateRange ?? pkg.duration}
          </span>
          <span className="text-[13px] text-[#666] shrink-0">・</span>
          {pkg.travelDateRange ? (
            <>
              <span className="text-[13px] text-[#666] shrink-0">{pkg.duration}</span>
              <span className="text-[13px] text-[#666] shrink-0">・</span>
            </>
          ) : null}
          <span className="text-[13px] text-[#666]">
            성인 {pkg.passengerCount}인 기준
          </span>
        </div>

        {/* 항공 정보 */}
        <div className="bg-[#f8f9fa] rounded-[12px] p-3 mb-1.5">
          <div className="flex items-start justify-start gap-2 mb-[5px]">
            <Plane className="size-4 text-[#7b3ff2]" />
            <span className="text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">
              항공
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-3 mb-[5px]">
            <div className="flex items-center gap-2 font-semibold">
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold">
                {pkg.flightInfo.departure}
              </span>
              <span className="text-[#666]">↔</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold">
                {pkg.flightInfo.arrival}
              </span>
            </div>
            <div className="flex items-center justify-end gap-3">
              <span className="text-[12px] text-[#666]">
                {formatSeatClass(pkg.flightInfo.seatClass)}
              </span>
            </div>
          </div>
          {/* 왕복 시간: 첨부 이미지와 동일 — 좌측 시간·노선·항공사, 우측 비행시간·수하물 */}
          <div className="space-y-3 mb-2">
            {/* 1) 가는 편 */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 mb-0">
                  <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold">
                    {pkg.flightInfo.departureTime}-{pkg.flightInfo.arrivalTime}
                  </span>
                  <span className="text-[12px] text-[#888]">
                    {toAirportCode(pkg.flightInfo.departureCode, pkg.flightInfo.departure)}-
                    {toAirportCode(pkg.flightInfo.arrivalCode, pkg.flightInfo.arrival)}
                  </span>
                </div>
                <p className="text-[12px] text-[#666]">
                  {pkg.flightInfo.airline}
                  {pkg.flightInfo.flightNumber != null ? ` ${pkg.flightInfo.flightNumber}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[12px] text-[#888]">
                  {pkg.flightInfo.flightDurationLabel ?? `직항·${pkg.flightInfo.flightDuration}`}
                </p>
                <p className="text-[11px] text-[#999]">수하물 포함</p>
              </div>
            </div>
            {/* 2) 오는 편 — 항상 표시, 없으면 임의 시간 */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 mb-0">
                  <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold">
                    {pkg.flightInfo.returnDepartureTime != null && pkg.flightInfo.returnArrivalTime != null
                      ? `${pkg.flightInfo.returnDepartureTime}-${pkg.flightInfo.returnArrivalTime}`
                      : "12:00-18:00"}
                  </span>
                  <span className="text-[12px] text-[#888]">
                    {toAirportCode(pkg.flightInfo.arrivalCode, pkg.flightInfo.arrival)}-
                    {toAirportCode(pkg.flightInfo.departureCode, pkg.flightInfo.departure)}
                  </span>
                </div>
                <p className="text-[12px] text-[#666]">
                  {pkg.flightInfo.airline}
                  {pkg.flightInfo.returnFlightNumber != null ? ` ${pkg.flightInfo.returnFlightNumber}` : pkg.flightInfo.flightNumber != null ? ` ${pkg.flightInfo.flightNumber}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[12px] text-[#888]">
                  {pkg.flightInfo.returnFlightDurationLabel ?? pkg.flightInfo.flightDurationLabel ?? `직항·${pkg.flightInfo.flightDuration}`}
                </p>
                <p className="text-[11px] text-[#999]">수하물 포함</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#999] mr-1">
              삼성 iD GLOBAL 카드/성인1
            </span>
            <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#7b3ff2] font-semibold">
              {pkg.flightInfo.price.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 호텔 정보 */}
        <div className="bg-[#f8f9fa] rounded-[12px] p-3 mb-1.5">
          <div className="flex items-start justify-start gap-2 mb-[5px]">
            <Building2 className="size-4 text-[#7b3ff2]" />
            <span className="text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">
              호텔
            </span>
          </div>
          <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] mb-0 font-semibold">
            {pkg.hotelInfo.name}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] text-[#7b3ff2]">
              {pkg.hotelInfo.grade}
            </span>
            <span className="text-[12px] text-[#666]">|</span>
            <span className="text-[12px] text-[#666]">
              {pkg.hotelInfo.location}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#666]">
              {pkg.hotelInfo.roomType}
            </span>
            <div className="text-right">
              <span className="text-[11px] text-[#999] mr-1">
                객실1개 기준
              </span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#7b3ff2] font-semibold">
                {pkg.hotelInfo.price.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 총 가격 */}
        <div className="pt-2 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#666]">
              총 예상 금액
            </span>
            <div className="text-right font-bold">
              <span className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#111]">
                {pkg.totalPrice.toLocaleString()}
              </span>
              <span className="text-[14px] text-[#666]">
                원
              </span>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full py-3 bg-[#5c2bb4] text-white rounded-[35px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#5e2bb8] transition-colors"
        >
          조합 확인하기
        </button>
      </div>
    </motion.div>
  );
}