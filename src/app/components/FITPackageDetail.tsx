import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { FITPackageData } from "./FITPackageCard";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { cn, formatSeatClass } from "./ui/utils";
import { FlightData } from "./FlightCard";
import { HotelData } from "./HotelCard";
import { FlightDetailContent } from "./FlightDetailContent";
import { HotelDetailContent } from "./HotelDetailContent";
import type { RoomType } from "./RoomTypeSelector";
import { RoomInfoNoticePopup } from "./RoomInfoNoticePopup";

interface FITPackageDetailProps {
  package: FITPackageData;
  onClose: () => void;
  onBooking: () => void;
  /** 객실 변경 클릭 시 호출 (호텔 객실선택 팝업 열기) */
  onChangeRoom?: () => void;
  /** 항공권 변경 클릭 시 호출 (항공권 선택 팝업 열기) */
  onChangeFlight?: () => void;
  /** 변경된 객실 정보 */
  selectedRoomType?: RoomType | null;
}

/** FIT 패키지 데이터를 항공 단독 상세용 FlightData로 변환 */
function toFlightData(pkg: FITPackageData): FlightData {
  const f = pkg.flightInfo;
  return {
    id: `${pkg.id}-flight`,
    airline: f.airline,
    departure: f.departure,
    arrival: f.arrival,
    departureCode: f.departureCode,
    arrivalCode: f.arrivalCode,
    departureTime: f.departureTime,
    arrivalTime: f.arrivalTime,
    flightDuration: f.flightDuration,
    seatClass: f.seatClass,
    price: f.price,
    destination: pkg.destination,
    passengerCount: pkg.passengerCount,
    isDirect: true,
    flightNumber: f.flightNumber ?? "KE123",
    recommendReason: pkg.recommendReason,
  };
}

/** FIT 패키지 데이터를 호텔 단독 상세용 HotelData로 변환 */
function toHotelData(pkg: FITPackageData): HotelData {
  const h = pkg.hotelInfo;
  return {
    id: `${pkg.id}-hotel`,
    name: h.name,
    grade: h.grade,
    location: h.location,
    address: h.address,
    roomType: h.roomType,
    price: h.price,
    destination: pkg.destination,
    passengerCount: pkg.passengerCount,
    recommendReason: pkg.recommendReason,
    travelDateRange: pkg.travelDateRange,
    duration: pkg.duration,
  };
}

export function FITPackageDetail({ package: pkg, onClose, onBooking, onChangeRoom, onChangeFlight, selectedRoomType }: FITPackageDetailProps) {
  useLockBodyScroll();
  const flightSectionRef = useRef<HTMLDivElement>(null);
  const hotelSectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"flight" | "hotel">("flight");
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [includedExpanded, setIncludedExpanded] = useState(true);
  const [showRoomInfoBeforeBooking, setShowRoomInfoBeforeBooking] = useState(false);

  const hotelPrice = selectedRoomType ? selectedRoomType.priceFrom : pkg.hotelInfo.price;
  const totalPrice = pkg.flightInfo.price + hotelPrice;
  const pax = Math.max(1, pkg.passengerCount);
  /** 예시 화면과 동일 비율: 1인당 유류·제세 과금 표기 (인원에 비례) */
  const flightTicketingFee = 0;
  const flightFuelSurcharge = 33000 * pax;
  const flightTaxAndCharges = 48400 * pax;

  const flightData = useMemo(() => toFlightData(pkg), [pkg]);
  const hotelData = useMemo(() => toHotelData(pkg), [pkg]);

  const scrollToSection = (section: "flight" | "hotel") => {
    const el = section === "flight" ? flightSectionRef.current : hotelSectionRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTab(section);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const flightEl = flightSectionRef.current;
    const hotelEl = hotelSectionRef.current;
    if (!flightEl || !hotelEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("data-section");
          if (id === "flight") setActiveTab("flight");
          if (id === "hotel") setActiveTab("hotel");
        });
      },
      { root: container, rootMargin: "-80px 0px 0px 0px", threshold: 0.1 }
    );
    observer.observe(flightEl);
    observer.observe(hotelEl);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-h-[90vh] rounded-t-[24px] flex flex-col overflow-hidden"
      >
        <div className="sticky top-0 z-10 bg-white border-b border-[#f0f0f0] shrink-0">
          <div className="px-5 py-4 flex items-center justify-between h-[55px]">
            <div className="flex items-center gap-2">
              <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">항공+호텔 상세</h2>
              <div className="relative flex flex-col items-center justify-center h-[25px] w-[150px] px-3 py-1.5 bg-[#f3efff] text-[#7b3ff2] rounded-[10px] text-[12px] font-['Pretendard:SemiBold',sans-serif] border border-[#e5e0f5] shadow-sm">
                함께 예약하면 더 저렴해요
                <span
                  className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[5px] border-transparent border-r-[#e5e0f5]"
                  aria-hidden
                />
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors shrink-0">
              <X className="size-5" />
            </button>
          </div>
          {/* 상단 탭: 항공 | 호텔 */}
          <div className="flex border-b border-[#eee] px-5 h-[38px]">
            <button
              type="button"
              onClick={() => scrollToSection("flight")}
              className={cn(
                "flex-1 flex flex-col justify-center items-center py-3 text-[15px] font-['Pretendard:SemiBold',sans-serif] transition-colors border-b-2 -mb-px",
                activeTab === "flight"
                  ? "text-[#7b3ff2] border-[#7b3ff2]"
                  : "text-[#666] border-transparent hover:text-[#111]"
              )}
            >
              항공
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("hotel")}
              className={cn(
                "flex-1 flex flex-col justify-center items-center py-3 text-[15px] font-['Pretendard:SemiBold',sans-serif] transition-colors border-b-2 -mb-px",
                activeTab === "hotel"
                  ? "text-[#7b3ff2] border-[#7b3ff2]"
                  : "text-[#666] border-transparent hover:text-[#111]"
              )}
            >
              호텔
            </button>
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {/* 목적지 헤더 + AI 추천 (상단만 패딩) */}
          <div className="p-5 pb-0">
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2 gap-y-1">
              <h3 className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#111]">
                {pkg.destination} 자유여행
              </h3>
              <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-['Pretendard:SemiBold',sans-serif] bg-[#ede9fe] text-[#5e2bb8]">
                내맘대로
              </span>
            </div>
            <div className="flex items-center gap-1 mt-[5px] text-[14px] text-[#666]">
              <span>{pkg.travelDateRange ?? pkg.duration}</span>
              {pkg.travelDateRange && (
                <>
                  <span>·</span>
                  <span>{pkg.duration}</span>
                </>
              )}
              <span>·</span>
              <span>성인{pkg.passengerCount}</span>
            </div>
          </div>

          {/* AI 추천 이유 */}
          <div className="flex gap-2 bg-[#f5f0ff] rounded-[8px] px-3 py-2.5 mb-2">
            <span className="shrink-0 w-[3px] self-stretch rounded-full bg-[#7b3ff2]" />
            <p className="text-[13px] leading-[1.5] text-[#555] line-clamp-2">
              {pkg.recommendReason}
            </p>
          </div>

          {/* 결제정보 (캡처 UI: 총액 · 항공 부가 항목 · 안내) */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setPriceExpanded(!priceExpanded)}
              className="w-full flex items-center justify-between text-left py-1 px-0"
            >
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">결제정보</span>
              {priceExpanded ? (
                <ChevronUp className="size-5 shrink-0 text-[#666]" aria-hidden />
              ) : (
                <ChevronDown className="size-5 shrink-0 text-[#666]" aria-hidden />
              )}
            </button>
            {priceExpanded && (
              <div className="mt-2 space-y-3">
                <div className="flex items-baseline justify-between gap-3 font-['Pretendard:SemiBold',sans-serif] font-semibold">
                  <span className="text-[17px] text-[#111] shrink-0">총 결제금액</span>
                  <span className="text-[17px] text-[#111] text-right tabular-nums">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
                <p className="text-[13px] text-[#111] leading-[1.45] font-['Pretendard:Regular',sans-serif] mb-0">
                  총 결제 금액은 항공,호텔 합산 비용으로 하기 내용을 포함하고 있습니다.
                </p>
                <div className="space-y-2.5 pt-0.5">
                  <div className="flex items-center justify-between gap-3 text-[12px] mb-0">
                    <span className="min-w-0 text-[#888]">
                      항공권 발권수수료{" "}
                      <span className="text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">X {pax}</span>
                    </span>
                    <span className="shrink-0 font-['Pretendard:SemiBold',sans-serif] tabular-nums text-[#111]">
                      {flightTicketingFee.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[12px] mb-0">
                    <span className="min-w-0 text-[#888]">
                      항공권 유류할증료{" "}
                      <span className="text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">X {pax}</span>
                    </span>
                    <span className="shrink-0 font-['Pretendard:SemiBold',sans-serif] tabular-nums text-[#111]">
                      {flightFuelSurcharge.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[12px] mb-0">
                    <span className="min-w-0 text-[#888]">
                      항공권 제세공과금{" "}
                      <span className="text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">X {pax}</span>
                    </span>
                    <span className="shrink-0 font-['Pretendard:SemiBold',sans-serif] tabular-nums text-[#111]">
                      {flightTaxAndCharges.toLocaleString()}원
                    </span>
                  </div>
                </div>
                <div className="rounded-[12px] bg-[#f8f9fa] px-3.5 py-3.5 mt-1">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">ⓘ 결제 정보</span>
                  </div>
                  <ul className="space-y-2 pl-0.5 text-[12px] leading-[1.5] text-[#666] font-['Pretendard:Regular',sans-serif]">
                    <li className="flex gap-2 mb-0">
                      <span className="shrink-0 text-[#999]">•</span>
                      <span>
                        항공 예약 변경 시 환불 수수료는 별도이며, 일정표 내 &apos;항공요금 환불 규정&apos;을 확인해 주세요.
                      </span>
                    </li>
                    <li className="flex gap-2 mb-0">
                      <span className="shrink-0 text-[#999]">•</span>
                      <span>유류할증료 및 제세공과금은 항공사 정책 및 환율에 따라 일별 변동될 수 있습니다.</span>
                    </li>
                    <li className="flex gap-2 mb-0">
                      <span className="shrink-0 text-[#999]">•</span>
                      <span className="text-[#7b3ff2] font-['Pretendard:Medium',sans-serif]">
                        카드정보는 1회 입력이나, 카드 승인금액은 항공, 호텔 각 상품 별도 승인 되오니 이용에 참고해주시기 바랍니다.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* 포함 사항 (접기/펼침) */}
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setIncludedExpanded(!includedExpanded)}
              className="w-full flex items-center justify-between text-left py-1.5 px-0 text-[14px] text-[#333] font-['Pretendard:SemiBold',sans-serif]"
            >
              <span>포함 사항</span>
              {includedExpanded ? <ChevronUp className="size-5 text-[#666]" /> : <ChevronDown className="size-5 text-[#666]" />}
            </button>
            {includedExpanded && (
              <div className="mt-1 pl-3 pr-3 py-2.5 space-y-1.5 shadow-none bg-[#f5f5f5] mb-5 text-[14px]">
                <div className="flex gap-2 text-[12px]">
                  <span className="text-[#7b3ff2]">✓</span>
                  <span className="text-[#666]">왕복 항공권 ({formatSeatClass(pkg.flightInfo.seatClass)})</span>
                </div>
                <div className="flex gap-2 text-[12px]">
                  <span className="text-[#7b3ff2]">✓</span>
                  <span className="text-[#666]">숙박 ({pkg.hotelInfo.name})</span>
                </div>
                <div className="flex gap-2 text-[12px]">
                  <span className="text-[#7b3ff2]">✓</span>
                  <span className="text-[#666]">여행자 보험</span>
                </div>
              </div>
            )}
          </div>
          </div>

          {/* 항공 상세 (단독 항공 상세와 동일한 내부 정보) */}
          <div ref={flightSectionRef} data-section="flight" className="scroll-mt-4">
            <FlightDetailContent flight={flightData} hideBookingButton onChangeFlight={onChangeFlight} />
          </div>

          {/* 항공/호텔 구분선 */}
          <div className="border-t-8 border-[#ededed] my-0" aria-hidden />

          {/* 호텔 상세 (단독 호텔 상세와 동일한 내부 정보) */}
          <div ref={hotelSectionRef} data-section="hotel" className="scroll-mt-4">
            <HotelDetailContent hotel={hotelData} hideBookingButton onChangeRoom={onChangeRoom} selectedRoom={selectedRoomType} />
          </div>

        </div>

        {/* 하단 플로팅: 이 조합으로 예약하기 */}
        <div className="shrink-0 border-t border-[#f0f0f0] bg-white px-5 pt-3 pb-5">
          <button
            type="button"
            onClick={() => setShowRoomInfoBeforeBooking(true)}
            className="w-full py-4 bg-[rgba(94,43,184,1)] text-white rounded-[30px] text-[16px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[rgba(94,43,184,1)] transition-colors"
          >
            이 조합으로 예약하기
          </button>
        </div>
      </motion.div>

      <RoomInfoNoticePopup
        open={showRoomInfoBeforeBooking}
        onClose={() => setShowRoomInfoBeforeBooking(false)}
        onConfirm={() => {
          setShowRoomInfoBeforeBooking(false);
          onBooking();
        }}
        zClass="z-[100]"
      />
    </motion.div>
  );
}
