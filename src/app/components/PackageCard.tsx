import { useState } from "react";
import { motion } from "motion/react";
import icLikeFilled from "../../assets/icons/ic-like.svg?url";
import icLikeOutline from "../../assets/icons/ic-like-1.svg?url";

export interface PackageData {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  airline: string;
  flightType?: string;
  hotel: string;
  hotelGrade: string;
  departure: string;
  /** 인천출발 일정 요약(가는편·오는편 시각). 미입력 시 20:30 / 12:30 */
  outboundFlightTime?: string;
  returnFlightTime?: string;
  availableSeats: number;
  /** 예약된 인원 수 (상세 화면 출발확정 뱃지 영역용) */
  bookedCount?: number;
  /** 최소 출발 인원 (상세 화면 표시용) */
  minDepartureCount?: number;
  /** 인라인 상세 카드에서 평점 옆에 붙는 짧은 요약 문구 */
  ratingSnippet?: string;
  /** 자유일정 표기 (예: 있음 / 없음) */
  freeSchedule?: string;
  /** 쇼핑 일정 표기 (예: 없음 / 2회) */
  shopping?: string;
  highlights: string[];
  recommendReason: string;
  reservationStatus?: '예약가능' | '예약대기' | '예약확정' | '출발예정';
}

interface PackageCardProps {
  package: PackageData;
  onClick: () => void;
  onBooking?: () => void;
}

export function PackageCard({ package: pkg, onClick, onBooking }: PackageCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-2 bg-white rounded-[16px] overflow-hidden border border-[#e8e8e8] shadow-sm"
    >
      <div className="flex gap-3 p-3">
        {/* 좌측: 세로로 긴 이미지 */}
        <div className="relative h-[140px] w-[108px] shrink-0 overflow-hidden rounded-[12px]">
          <img src={pkg.image} alt={pkg.title} className="size-full object-cover" />
          <div className="absolute top-1 left-2">
            <span className="inline-block rounded-[5px] bg-[#ede8ff] px-[7px] pt-0.5 pb-px text-[10px] font-['Pretendard:Bold',sans-serif] text-[#6b4cc9]">
              패키지
            </span>
          </div>
          <button
            type="button"
            aria-label={liked ? "찜 해제" : "찜하기"}
            onClick={(e) => {
              e.stopPropagation();
              setLiked((v) => !v);
            }}
            className="absolute bottom-1.5 right-1.5 flex size-8 items-center justify-center rounded-full bg-transparent p-0 transition-opacity hover:opacity-90 active:opacity-80"
          >
            <img
              src={liked ? icLikeFilled : icLikeOutline}
              alt=""
              width={24}
              height={24}
              className="size-6 select-none pointer-events-none"
              draggable={false}
            />
          </button>
        </div>

        {/* 우측: 텍스트 + 버튼 한 섹션 */}
        <div className="flex min-h-[140px] min-w-0 flex-1 flex-col">
          <h3 className="line-clamp-2 font-['Pretendard:Bold',sans-serif] text-[14px] leading-snug text-[#111]">
            {pkg.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-1">
            <svg className="size-[14px] shrink-0 text-[#5e2bb8]" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 0L10.472 5.008L16 5.856L12 9.712L12.944 15.232L8 12.616L3.056 15.232L4 9.712L0 5.856L5.528 5.008L8 0Z" />
            </svg>
            <span className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#444] tabular-nums">
              {pkg.rating}
            </span>
          </div>
          <p className="mt-1 w-full text-right font-['Pretendard:Bold',sans-serif] font-semibold text-[16px] tabular-nums text-[#111]">
            {pkg.price.toLocaleString()}원~
          </p>

          <div className="mt-auto flex gap-2 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="flex-1 rounded-full border border-[#e0e0e0] bg-white py-1.5 font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#444] transition-colors hover:bg-[#f9f9f9]"
            >
              더 알아보기
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBooking?.();
              }}
              className="flex-1 rounded-full border border-[#e0e0e0] bg-white py-1.5 font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#444] transition-colors hover:bg-[#f9f9f9]"
            >
              예약하기
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
