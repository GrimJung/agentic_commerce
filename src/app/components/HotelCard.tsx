import { motion } from "motion/react";
import { Building2 } from "lucide-react";

export interface HotelData {
  id: string;
  name: string;
  nameEn?: string;
  grade: string;
  location: string;
  address?: string;
  roomType: string;
  price: number;
  destination: string;
  passengerCount: number;
  /** 여행 기간 날짜 표기 (예: "04.01(월)~04.06(토)") */
  travelDateRange?: string;
  /** 여행 기간 (예: "4박 6일") */
  duration?: string;
  /** 체크인 일자 (상세 헤더 투숙기간 표시용, 예: "2026-05-25") */
  checkInDate?: string;
  /** 체크아웃 일자 */
  checkOutDate?: string;
  /** 박 수 (명시 시 duration/일수 계산보다 우선) */
  stayNights?: number;
  image?: string;
  recommendReason: string;
}

interface HotelCardProps {
  hotel: HotelData;
  rank: number;
  onClick: () => void;
  onBooking: () => void;
}

export function HotelCard({ hotel, rank, onClick, onBooking }: HotelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="bg-white rounded-[16px] p-4 shadow-sm border border-[#e5e5e5] cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-[#7b3ff2] flex items-center justify-center text-white text-[12px] font-['Pretendard:Bold',sans-serif]">
            {rank}
          </div>
          <span className="text-[12px] text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">추천 호텔</span>
        </div>
      </div>

      {/* AI 추천 이유 */}
      <div className="flex gap-2 bg-[#f5f0ff] rounded-[8px] px-3 py-2.5 mb-[5px]">
        <span className="shrink-0 w-[3px] self-stretch rounded-full bg-[#7b3ff2]" />
        <p className="text-[13px] leading-[1.5] text-[#555] line-clamp-2">
          {hotel.recommendReason}
        </p>
      </div>

      {/* 일정 · 여행기간 · 인원 */}
      {(hotel.travelDateRange != null || hotel.duration != null || hotel.passengerCount != null) && (
        <div className="flex items-start justify-start gap-[3px] px-0 text-[15px] mb-[5px] tracking-[-0.5px]">
          {hotel.travelDateRange != null && (
            <>
              <span className="text-[13px] text-[#666]">{hotel.travelDateRange}</span>
              {hotel.duration != null && <span className="text-[13px] text-[#666] shrink-0">・</span>}
            </>
          )}
          {hotel.duration != null && (
            <>
              <span className="text-[13px] text-[#666] shrink-0">{hotel.duration}</span>
              <span className="text-[13px] text-[#666] shrink-0">・</span>
            </>
          )}
          <span className="text-[13px] text-[#666]">성인 {hotel.passengerCount}인 기준</span>
        </div>
      )}

      {/* 호텔 정보 */}
      <div className="bg-[#f8f9fa] rounded-[12px] p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="size-4 text-[#7b3ff2]" />
          <span className="text-[13px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">호텔</span>
        </div>
        <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-1 font-semibold">
          {hotel.name}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] text-[#7b3ff2]">{hotel.grade}</span>
          <span className="text-[12px] text-[#666]">|</span>
          <span className="text-[12px] text-[#666]">{hotel.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#666]">{hotel.roomType}</span>
          <div className="text-right">
            <span className="text-[11px] text-[#999] mr-1">객실1 기준</span>
            <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#7b3ff2]">
              {hotel.price.toLocaleString()}원
            </span>
          </div>
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
