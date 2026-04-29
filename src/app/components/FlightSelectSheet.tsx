import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { FlightData } from "./FlightCard";

const fallbackFlights: FlightData[] = [
  {
    id: "fs-1",
    airline: "아시아나항공",
    departure: "인천",
    arrival: "오사카",
    departureTime: "20:40",
    arrivalTime: "22:30",
    price: 389000,
    seatClass: "이코노미",
    flightDuration: "약 1시간 50분",
    destination: "오사카, 일본",
    passengerCount: 2,
    isDirect: true,
    departureAirport: "인천국제공항 (ICN)",
    arrivalAirport: "간사이국제공항 (KIX)",
    departureCode: "ICN",
    arrivalCode: "KIX",
    baggage: "23kg 1개",
    flightNumber: "OZ 0118",
    recommendReason: "직항 최저가 항공편이에요.",
  },
  {
    id: "fs-2",
    airline: "제주항공",
    departure: "김포",
    arrival: "오사카",
    departureTime: "08:10",
    arrivalTime: "10:00",
    price: 427000,
    seatClass: "이코노미",
    flightDuration: "약 1시간 50분",
    destination: "오사카, 일본",
    passengerCount: 2,
    isDirect: true,
    departureAirport: "김포국제공항 (GMP)",
    arrivalAirport: "간사이국제공항 (KIX)",
    departureCode: "GMP",
    arrivalCode: "KIX",
    baggage: "15kg 1개",
    flightNumber: "7C 1325",
    recommendReason: "오전 출발로 도착 후 일정 활용이 좋아요.",
  },
  {
    id: "fs-3",
    airline: "대한항공",
    departure: "인천",
    arrival: "오사카",
    departureTime: "09:30",
    arrivalTime: "11:25",
    price: 456000,
    seatClass: "이코노미",
    flightDuration: "약 1시간 55분",
    destination: "오사카, 일본",
    passengerCount: 2,
    isDirect: true,
    departureAirport: "인천국제공항 (ICN)",
    arrivalAirport: "간사이국제공항 (KIX)",
    departureCode: "ICN",
    arrivalCode: "KIX",
    baggage: "23kg 2개",
    flightNumber: "KE 723",
    recommendReason: "대한항공 직항, 수하물 23kg 2개 포함.",
  },
  {
    id: "fs-4",
    airline: "피치항공",
    departure: "인천",
    arrival: "오사카",
    departureTime: "14:20",
    arrivalTime: "16:15",
    price: 312000,
    seatClass: "이코노미",
    flightDuration: "약 1시간 55분",
    destination: "오사카, 일본",
    passengerCount: 2,
    isDirect: true,
    departureAirport: "인천국제공항 (ICN)",
    arrivalAirport: "간사이국제공항 (KIX)",
    departureCode: "ICN",
    arrivalCode: "KIX",
    flightNumber: "MM 014",
    recommendReason: "최저가 LCC 항공편이에요.",
  },
  {
    id: "fs-5",
    airline: "베트남항공",
    departure: "인천",
    arrival: "오사카",
    departureTime: "18:05",
    arrivalTime: "10:50",
    price: 345000,
    seatClass: "이코노미",
    flightDuration: "약 18시간 45분 (경유1회)",
    destination: "오사카, 일본",
    passengerCount: 2,
    isDirect: false,
    departureAirport: "인천국제공항 (ICN)",
    arrivalAirport: "간사이국제공항 (KIX)",
    departureCode: "ICN",
    arrivalCode: "KIX",
    baggage: "23kg 1개",
    flightNumber: "VN 0415",
    recommendReason: "경유 1회, 저렴한 가격이 장점이에요.",
  },
  {
    id: "fs-6",
    airline: "진에어",
    departure: "인천",
    arrival: "오사카",
    departureTime: "07:00",
    arrivalTime: "08:55",
    price: 335000,
    seatClass: "이코노미",
    flightDuration: "약 1시간 55분",
    destination: "오사카, 일본",
    passengerCount: 2,
    isDirect: true,
    departureAirport: "인천국제공항 (ICN)",
    arrivalAirport: "간사이국제공항 (KIX)",
    departureCode: "ICN",
    arrivalCode: "KIX",
    baggage: "15kg 1개",
    flightNumber: "LJ 201",
    recommendReason: "이른 아침 출발로 하루를 알차게 활용 가능.",
  },
];

interface FlightSelectSheetProps {
  flights: FlightData[];
  selectedFlight?: FlightData | null;
  onSelect: (flight: FlightData) => void;
  onClose: () => void;
}

function getAirportCode(airport?: string, fallback?: string): string {
  if (fallback) return fallback;
  const match = airport?.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : "";
}

function getReturnFlight(outbound: FlightData): {
  departureTime: string;
  arrivalTime: string;
  depCode: string;
  arrCode: string;
  airline: string;
  flightNumber: string;
  duration: string;
  hasBaggage: boolean;
  isDirect: boolean;
  stopCount?: number;
} {
  const depCode = outbound.arrivalCode ?? getAirportCode(outbound.arrivalAirport);
  const arrCode = outbound.departureCode ?? getAirportCode(outbound.departureAirport);
  return {
    departureTime: "01:30",
    arrivalTime: "04:10",
    depCode,
    arrCode,
    airline: outbound.airline,
    flightNumber: String(Number(outbound.flightNumber ?? "0") + 1).padStart(3, "0"),
    duration: "02시간 40분",
    hasBaggage: !!outbound.baggage,
    isDirect: outbound.isDirect,
  };
}

function parseDuration(dur: string): string {
  const cleaned = dur.replace(/^약\s*/, "").replace(/\s*소요/, "").replace(/\(.*?\)/, "").trim();
  const hMatch = cleaned.match(/(\d+)\s*시간/);
  const mMatch = cleaned.match(/(\d+)\s*분/);
  const h = hMatch ? hMatch[1].padStart(2, "0") : "00";
  const m = mMatch ? mMatch[1].padStart(2, "0") : "00";
  return `${h}시간 ${m}분`;
}

export function FlightSelectSheet({
  flights,
  selectedFlight,
  onSelect,
  onClose,
}: FlightSelectSheetProps) {
  useLockBodyScroll();
  const [activeFilter, setActiveFilter] = useState<string | null>("직항");

  const effectiveFlights = flights.length > 0 ? flights : fallbackFlights;

  const totalCount = useMemo(() => {
    const base = Math.max(effectiveFlights.length, 50);
    return Math.round(base + Math.random() * 100);
  }, [effectiveFlights.length]);

  const selectedId = selectedFlight?.id ?? effectiveFlights[0]?.id;

  const sortedFlights = useMemo(() => {
    const selected = effectiveFlights.find((f) => f.id === selectedId);
    const others = effectiveFlights.filter((f) => f.id !== selectedId);
    others.sort((a, b) => a.price - b.price);
    return selected ? [selected, ...others] : others;
  }, [effectiveFlights, selectedId]);

  const selectedPrice = selectedFlight?.price ?? effectiveFlights[0]?.price ?? 0;

  const filters = [
    { id: "filter", label: "필터열기", icon: true },
    { id: "직항", label: "직항" },
    { id: "수하물", label: "무료수하물 포함" },
    { id: "공동운항", label: "공동운항제외" },
  ];

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
        className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-[24px] flex flex-col"
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] shrink-0 z-10">
          <div className="px-5 py-4 flex items-center justify-between">
            <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
              항공권 변경
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
              aria-label="닫기"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* 필터 칩 */}
          <div className="px-5 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => f.id !== "filter" && setActiveFilter(activeFilter === f.id ? null : f.id)}
                className={`relative shrink-0 flex items-center gap-1.5 h-[36px] px-3.5 rounded-full border text-[13px] font-['Pretendard:Medium',sans-serif] transition-colors ${
                  activeFilter === f.id
                    ? "border-[#111] bg-[#111] text-white"
                    : "border-[#e0e0e0] bg-white text-[#333]"
                }`}
              >
                {f.icon && <SlidersHorizontal className="size-3.5" />}
                {f.label}
                {f.badge != null && (
                  <span className="absolute -top-1 -right-1 size-[18px] rounded-full bg-[#ff4444] text-white text-[10px] flex items-center justify-center font-bold">
                    {f.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 총 개수 + 정렬 */}
        <div className="px-5 py-3 flex items-center justify-between">
          <p className="text-[14px] text-[#111]">
            총 <span className="font-['Pretendard:Bold',sans-serif] text-[#6329C4]">{totalCount}</span>개
          </p>
          <button type="button" className="flex items-center gap-1 text-[13px] text-[#666]">
            가격 낮은순 <span className="text-[12px]">↕</span>
          </button>
        </div>

        {/* 항공권 리스트 */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">
          {sortedFlights.length === 0 ? (
            <p className="text-[14px] text-[#666] py-8 text-center">
              선택 가능한 항공권이 없습니다.
            </p>
          ) : (
            sortedFlights.map((flight, index) => {
              const isSelected = flight.id === selectedId;
              const depCode = flight.departureCode ?? getAirportCode(flight.departureAirport);
              const arrCode = flight.arrivalCode ?? getAirportCode(flight.arrivalAirport);
              const ret = getReturnFlight(flight);
              const priceDiff = flight.price - selectedPrice;
              const hasBaggage = !!flight.baggage;

              return (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-[16px] overflow-hidden border ${
                    isSelected ? "border-[#6329C4] border-[1.5px]" : "border-[#e5e5e5]"
                  }`}
                >
                  {/* 선택된 항공권 헤더 */}
                  {isSelected && (
                    <div className="bg-[#6329C4] px-4 py-2.5 flex items-center gap-2">
                      <div className="size-[18px] rounded-full bg-white flex items-center justify-center">
                        <svg className="size-3 text-[#6329C4]" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-white text-[13px] font-['Pretendard:SemiBold',sans-serif]">선택된 항공권</span>
                    </div>
                  )}

                  <div className="bg-white px-4 py-3">
                    {/* 가는 편 */}
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">
                          {flight.departureTime}-{flight.arrivalTime}
                        </span>
                        <span className="text-[12px] text-[#888]">
                          {depCode}-{arrCode}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px] text-[#888]">
                          {flight.isDirect ? "직항" : `경유${flight.flightDuration.includes("1회") ? "1회" : ""}`} · {parseDuration(flight.flightDuration)}
                        </p>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#888] mb-3">
                      {flight.airline}, {flight.flightNumber ?? ""}
                    </p>
                    <p className="text-[12px] ml-[30px] mb-3 -mt-2">
                      <span className={hasBaggage ? "text-[#2e7d32]" : "text-[#ff6b35]"}>
                        {hasBaggage ? "수하물 포함" : "수하물 미포함"}
                      </span>
                    </p>

                    {/* 오는 편 */}
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">
                          {ret.departureTime}-{ret.arrivalTime}
                        </span>
                        <span className="text-[12px] text-[#888]">
                          {ret.depCode}-{ret.arrCode}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px] text-[#888]">
                          {ret.isDirect ? "직항" : "경유1회"} · {ret.duration}
                        </p>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#888] ml-[30px] mb-1">
                      {ret.airline}, {ret.flightNumber}
                    </p>
                    <p className="text-[12px] ml-[30px] mb-3">
                      <span className={ret.hasBaggage ? "text-[#2e7d32]" : "text-[#ff6b35]"}>
                        {ret.hasBaggage ? "수하물 포함" : "수하물 미포함"}
                      </span>
                    </p>

                    {/* 비선택 항공권: 가격 차이 + 변경하기 */}
                    {!isSelected && (
                      <div className="pt-2 border-t border-[#f0f0f0]">
                        <p className="text-[12px] text-[#888] mb-0">삼성 iD GLOBAL 카드 결제 시</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {Math.abs(priceDiff) < 50000 && (
                              <span className="flex items-center gap-0.5 text-[11px] text-[#ff4444] font-['Pretendard:SemiBold',sans-serif]">
                                <span className="size-[14px] rounded-full bg-[#ff4444] text-white text-[9px] flex items-center justify-center">!</span>
                                마감임박
                              </span>
                            )}
                            <span className={`font-['Pretendard:Bold',sans-serif] text-[18px] ${priceDiff <= 0 ? "text-[#2e7d32]" : "text-[#ff4444]"}`}>
                              {priceDiff <= 0 ? "" : "+"}{priceDiff.toLocaleString()}원~
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(flight);
                            }}
                            className="px-5 py-2 bg-[#6329C4] text-white rounded-full text-[13px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#5423AD] transition-colors flex flex-col items-center justify-center"
                          >
                            변경하기
                          </button>
                        </div>
                        <p className="text-[11px] text-[#999] mt-0.5">현재 선택한 항공편과 차액 총액</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
