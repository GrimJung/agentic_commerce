import { motion } from "motion/react";

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

const formatDateRange = (departure: string, duration: string): string => {
  const dateMatch = departure.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  const nightsMatch = duration.match(/(\d+)박\s*(\d+)일/);
  if (!dateMatch || !nightsMatch) return `${duration} | ${departure}`;

  const startDate = new Date(+dateMatch[1], +dateMatch[2] - 1, +dateMatch[3]);
  const totalDays = +nightsMatch[2];
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + totalDays - 1);

  const fmt = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${mm}.${dd}(${DAY_NAMES[d.getDay()]})`;
  };

  return `${duration} | ${fmt(startDate)}-${fmt(endDate)}`;
};

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
  availableSeats: number;
  /** 예약된 인원 수 (상세 화면 출발확정 뱃지 영역용) */
  bookedCount?: number;
  /** 최소 출발 인원 (상세 화면 표시용) */
  minDepartureCount?: number;
  highlights: string[];
  recommendReason: string;
  reservationStatus?: '예약가능' | '예약대기' | '예약확정' | '출발예정';
}

interface PackageCardProps {
  package: PackageData;
  onClick: () => void;
  onBooking?: () => void;
  rank?: number;
  /** 상품 구분 라벨 (미지정 시 "패키지") */
  productLabel?: string;
}

export function PackageCard({ package: pkg, onClick, onBooking, rank, productLabel = "패키지" }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[16px] overflow-hidden shadow-sm border border-[#e5e5e5] hover:shadow-md transition-shadow relative"
    >
      {/* 순위 배지 + 상품 구분자 */}
      <div className="flex items-center gap-2 mx-3 mt-3 mb-0">
        {rank && (
          <div className="size-6 rounded-full bg-gradient-to-br from-[#5e2bb8] to-[#b794f6] flex items-center justify-center">
            <span className="text-white text-[13px] font-['Pretendard:Bold',sans-serif]">
              {rank}
            </span>
          </div>
        )}
        <span className="text-[13px] text-[#5e2bb8] font-['Pretendard:Bold',sans-serif]">{productLabel}</span>
      </div>
      <div className="flex gap-2 bg-[#f5f0ff] rounded-[8px] px-3 py-2.5 mx-3 mt-1.5">
        <span className="shrink-0 w-[3px] self-stretch rounded-full bg-[#5e2bb8]" />
        <p className="text-[12px] leading-[1.5] text-[#555] line-clamp-2">
          {pkg.recommendReason}
        </p>
      </div>

      <div className="flex gap-3 p-3">
        {/* 썸네일 - 좌측 */}
        <div className="relative w-[100px] h-[100px] flex-shrink-0 rounded-[12px] overflow-hidden">
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
          {/* 배지 컨테이너 */}
          <div className="absolute top-2 left-2 flex gap-1">
            {/* 좌석수 배지 */}
            <div className="bg-[#e32d1a] px-2 py-[1px] rounded-[3px] grid flex-col">
              <span className="text-[#ffffff] font-['Pretendard:Bold',sans-serif] text-[11px]">
                {pkg.availableSeats}석
              </span>
            </div>
            {/* 예약상태 배지 */}
            <div className={`px-1 py-[1px] rounded-[3px] grid flex-col ${
              (pkg.reservationStatus || '예약가능') === '예약확정' 
                ? 'bg-[#2e7d32]' 
                : (pkg.reservationStatus || '예약가능') === '예약대기'
                ? 'bg-[#e65100]'
                : (pkg.reservationStatus || '예약가능') === '출발예정'
                ? 'bg-[#5e2bb8]'
                : 'bg-[#4585ff]'
            }`}>
              <span className="text-[#ffffff] font-['Pretendard:Bold',sans-serif] text-[11px]">
                {pkg.reservationStatus || '예약가능'}
              </span>
            </div>
          </div>
        </div>

        {/* 정보 - 우측 */}
        <div className="flex-1 flex flex-col min-w-0">
          <h3 className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] mb-1.5 line-clamp-2">
            {pkg.title}
          </h3>

          <div className="flex flex-col gap-0.5 mb-2 text-[12px] text-[#666]">
            <span>
              {pkg.airline} | {pkg.flightType || '직항'} | 호텔 {pkg.hotelGrade}
            </span>
            <span>
              {formatDateRange(pkg.departure, pkg.duration)}
            </span>
          </div>

          {/* 평점 + 가격 한 줄 */}
          <div className="grid grid-cols-[auto_1fr] items-center gap-1 mb-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <svg className="size-3.5 fill-[#FFB800]" viewBox="0 0 16 16">
                  <path d="M8 0L10.472 5.008L16 5.856L12 9.712L12.944 15.232L8 12.616L3.056 15.232L4 9.712L0 5.856L5.528 5.008L8 0Z"/>
                </svg>
                <span className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">
                  {pkg.rating}
                </span>
              </div>
              <span className="text-[11px] text-[#999]">({pkg.reviewCount})</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <span className="text-[11px] text-[#999]">1인</span>
              <span className="font-semibold font-['Pretendard:Bold',sans-serif] text-[17px] text-[#5e2bb8]">
                {pkg.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#999]">~</span>
            </div>
          </div>

        </div>
      </div>

      {/* 버튼 - 전체 너비 */}
      <div className="flex gap-2 px-3 pb-3">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex-1 py-2.5 bg-white border border-[#5e2bb8] text-[#5e2bb8] rounded-[30px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f8f4ff] transition-colors"
        >
          상세보기
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onBooking?.();
          }}
          className="flex-1 py-2.5 bg-[#5e2bb8] text-white rounded-[30px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#5e2bb8] transition-colors"
        >
          예약하기
        </button>
      </div>
    </motion.div>
  );
}