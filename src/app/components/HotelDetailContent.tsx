"use client";

import { useState, useRef } from "react";
import {
  Bed,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Utensils,
  Dumbbell,
  Bell,
  Luggage,
  CircleParking,
  Cigarette,
  Maximize2,
  Waves,
  Sparkles,
  Megaphone,
  ChevronDown,
  ChevronUp,
  Check,
  Info,
  AlertCircle,
} from "lucide-react";
import { HotelData } from "./HotelCard";
import type { RoomType } from "./RoomTypeSelector";
import { HotelRefundPolicySheet } from "./HotelRefundPolicySheet";

const DEFAULT_HOTEL_YEAR = 2026;

function toDisplayYMD(s: string): string {
  const t = s.trim().replace(/\//g, ".");
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    const [y, m, d] = t.split("-");
    return `${y}.${m}.${d}`;
  }
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(t)) return t;
  return t;
}

function parseTravelDateRangeToStayDates(
  range: string | undefined,
  year: number
): { checkIn: string; checkOut: string } | null {
  if (!range?.includes("~")) return null;
  const parts = range.split("~").map((p) => p.trim());
  if (parts.length !== 2) return null;
  const parsePart = (p: string) => {
    const m = p.match(/^(\d{2})\.(\d{2})/);
    return m ? `${year}.${m[1]}.${m[2]}` : null;
  };
  const checkIn = parsePart(parts[0]);
  const checkOut = parsePart(parts[1]);
  if (!checkIn || !checkOut) return null;
  return { checkIn, checkOut };
}

function parseDurationNights(duration?: string): number | null {
  if (!duration) return null;
  const m = duration.match(/(\d+)박/);
  return m ? parseInt(m[1], 10) : null;
}

function nightsBetweenYMD(checkIn: string, checkOut: string): number {
  const d1 = new Date(checkIn.replace(/\./g, "-"));
  const d2 = new Date(checkOut.replace(/\./g, "-"));
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return 3;
  const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

/** 예: `2026.05.25 ~ 2026.05.28 (3박)` */
function getHotelStayPeriodLabel(hotel: HotelData): string {
  if (hotel.checkInDate && hotel.checkOutDate) {
    const ci = toDisplayYMD(hotel.checkInDate);
    const co = toDisplayYMD(hotel.checkOutDate);
    const nights = hotel.stayNights ?? nightsBetweenYMD(ci, co);
    return `${ci} ~ ${co} (${nights}박)`;
  }
  const parsed = parseTravelDateRangeToStayDates(hotel.travelDateRange, DEFAULT_HOTEL_YEAR);
  if (parsed) {
    const nights =
      hotel.stayNights ??
      parseDurationNights(hotel.duration) ??
      nightsBetweenYMD(parsed.checkIn, parsed.checkOut);
    return `${parsed.checkIn} ~ ${parsed.checkOut} (${nights}박)`;
  }
  return `${DEFAULT_HOTEL_YEAR}.05.25 ~ ${DEFAULT_HOTEL_YEAR}.05.28 (3박)`;
}

/** 취소약관 등 체크인 일자 (YYYY.MM.DD) */
function getHotelCheckInYmd(hotel: HotelData): string {
  if (hotel.checkInDate) return toDisplayYMD(hotel.checkInDate);
  const parsed = parseTravelDateRangeToStayDates(hotel.travelDateRange, DEFAULT_HOTEL_YEAR);
  if (parsed) return parsed.checkIn;
  return `${DEFAULT_HOTEL_YEAR}.05.25`;
}

const FACILITIES: { id: string; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "smoking", label: "흡연불가", Icon: Cigarette },
  { id: "fitness", label: "피트니스 센터", Icon: Dumbbell },
  { id: "frontdesk", label: "프론트 데스크", Icon: Bell },
  { id: "luggage", label: "짐보관 서비스", Icon: Luggage },
  { id: "parking", label: "주차", Icon: CircleParking },
  { id: "wifi", label: "무료 Wi-Fi", Icon: Wifi },
  { id: "breakfast", label: "조식 포함", Icon: Coffee },
  { id: "restaurant", label: "레스토랑", Icon: Utensils },
  { id: "pool", label: "수영장", Icon: Waves },
  { id: "spa", label: "스파", Icon: Sparkles },
];

export interface HotelDetailContentProps {
  hotel: HotelData;
  /** FIT 조합 상세 내부에 넣을 때 true면 하단 예약 버튼 숨김 */
  hideBookingButton?: boolean;
  onBooking?: () => void;
  /** 객실 변경 클릭 시 호출 (호텔 객실선택 팝업 열기) */
  onChangeRoom?: () => void;
  /** 변경된 객실 정보 (있으면 호텔 기본 객실 대신 표시) */
  selectedRoom?: RoomType | null;
  /** 상세보기 클릭 시 추가 동작 (예: 로깅). 기본 바텀시트는 항상 열립니다. */
  onHotelRefundPolicyDetails?: () => void;
}

export function HotelDetailContent({
  hotel,
  hideBookingButton = false,
  onBooking,
  onChangeRoom,
  selectedRoom,
  onHotelRefundPolicyDetails,
}: HotelDetailContentProps) {
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const [noticeExpanded, setNoticeExpanded] = useState(false);
  const [otherInstructionsExpanded, setOtherInstructionsExpanded] = useState(true);
  const [refundPolicyOpen, setRefundPolicyOpen] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  const handleExpandNotice = () => {
    setNoticeExpanded(true);
    requestAnimationFrame(() => {
      noticeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const stayPeriodLabel = getHotelStayPeriodLabel(hotel);

  return (
    <>
      <div className="px-5 py-6">
        <button
          type="button"
          onClick={() => setSectionExpanded(!sectionExpanded)}
          className="w-full flex items-center justify-between gap-2 text-left"
        >
          <div className="flex min-w-0 flex-1 items-center gap-[5px]">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-[8px] bg-[#05bdce] text-[13px] font-bold leading-none text-white font-['Pretendard:Bold',sans-serif]"
              aria-hidden
            >
              2
            </span>
            <Bed className="size-[18px] shrink-0 text-[#05bdce]" strokeWidth={2.25} aria-hidden />
            <h3 className="min-w-0 font-semibold font-['Pretendard:SemiBold',sans-serif] text-[18px] text-[#111]">
              호텔 상세 정보
            </h3>
          </div>
          {sectionExpanded ? <ChevronUp className="size-5 shrink-0 text-[#666]" /> : <ChevronDown className="size-5 shrink-0 text-[#666]" />}
        </button>
        <p className="mt-[5px] mb-2 text-left text-[15px] text-[#05bdce] font-['Pretendard:Medium',sans-serif] tracking-tight">
          {stayPeriodLabel}
        </p>
        {sectionExpanded && (
        <>
        {hotel.image && (
          <div className="w-full h-[200px] bg-gray-200 rounded-[16px] mb-4 overflow-hidden">
            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
          </div>
        )}

        {!hideBookingButton && (
          <div className="flex gap-2 bg-[#f5f0ff] rounded-[8px] px-3 py-2.5 mb-4">
            <span className="shrink-0 w-[3px] self-stretch rounded-full bg-[#7b3ff2]" />
            <p className="text-[13px] leading-[1.5] text-[#555] line-clamp-2">{hotel.recommendReason}</p>
          </div>
        )}

        <div className="mb-[10px]">
          <span className="mb-0 block text-[13px] text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">
            {hotel.grade}
          </span>
          <h3 className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#111] mb-0">{hotel.name}</h3>
          {hotel.nameEn ? <p className="text-[13px] text-[#666] mb-2">{hotel.nameEn}</p> : null}
          <div className="mb-3">
            <p className="text-[#5e2bb8] text-[14px] font-['Pretendard:SemiBold',sans-serif] text-left px-0 py-0.5">
              <span className="text-[22px] leading-none align-middle text-[#5e2bb8]">&ldquo;</span>
              <span className="bg-[#e9e5fb] rounded-[2px] px-0.5 py-0.5">{hotel.location} 부근에 위치</span>
              <span className="text-[22px] leading-none align-middle text-[#5e2bb8]">&rdquo;</span>
            </p>
          </div>
          <div className="flex items-center gap-[5px]">
            <div className="flex items-center gap-1">
              <Star className="size-4 text-[#ffa500] fill-[#ffa500]" />
              <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">4.8</span>
            </div>
            <span className="text-[13px] text-[#999]">(리뷰 152개)</span>
          </div>
        </div>

        <div className="bg-[#f8f9fa] rounded-[16px] p-4 mb-4">
          <p className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#7b3ff2] mb-2">객실 정보</p>
          <ul className="space-y-0 text-[16px] text-[#111] font-medium">
            <li className="text-left mb-0 leading-[20px]">{selectedRoom ? selectedRoom.name : hotel.roomType}, 금연 (No Room Cleaning Service)</li>
            <li className="text-left mb-0">
              <span className="text-[12px] font-normal text-[#111]">객실1, 성인2명, 아동1명</span>
            </li>
            <li className="text-left mb-0 text-[12px] text-[#0fbabf]">
              {selectedRoom
                ? (selectedRoom.cancelPolicy ?? "free") === "free"
                  ? "무료취소(~4월30일까지)"
                  : (selectedRoom.cancelPolicy === "nonRefundable" ? "취소불가" : "부분취소(~4월30일까지)")
                : "무료취소(~4월30일까지)"}
            </li>
            <li className="text-left mb-0 text-[12px]">
              {selectedRoom
                ? (selectedRoom.breakfastIncluded ?? true) ? "조식 포함" : "조식 불포함"
                : "조식 불포함"}
            </li>
          </ul>
          <div className="border-t border-[#e5e5e5] mt-4 pt-[5px]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="text-right flex-1">
                <span className="text-[12px] text-[#666] mr-1">1박 기준</span>
                <span className="font-['Pretendard:Bold',sans-serif] text-[18px] font-semibold text-[#5e2bb8]">
                  {(selectedRoom ? selectedRoom.priceFrom : hotel.price).toLocaleString()}원
                </span>
              </div>
            </div>
            {onChangeRoom && (
              <button
                type="button"
                onClick={onChangeRoom}
                className="w-full py-3 px-4 border border-[#e0e0e0] rounded-[10px] text-[14px] text-[#666] font-['Pretendard:Medium',sans-serif] bg-white hover:bg-[#f0f0f0] transition-colors"
              >
                객실 변경
              </button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="size-4 text-[#666] shrink-0 mt-0.5" />
            <div>
              <span className="text-[14px] text-[#111]">{hotel.address ?? hotel.location}</span>
              <button
                type="button"
                onClick={() => {
                  const addr = hotel.address ?? hotel.location;
                  if (addr && navigator.clipboard) navigator.clipboard.writeText(addr);
                }}
                className="ml-2 text-[13px] text-[#7b3ff2] underline"
              >
                주소 복사
              </button>
            </div>
          </div>
          <div className="relative w-full h-[70px] rounded-[12px] overflow-hidden bg-[#f0f4f0]">
            <div className="absolute inset-0 flex">
              <div className="flex-1 bg-[#d8ecc8]" />
              <div className="w-[15%] bg-[#cfe5fa]" />
            </div>
            <div className="absolute inset-0">
              <div className="absolute top-[15%] left-0 right-0 h-[8%] bg-[#e0e0e0]" />
              <div className="absolute top-[45%] left-0 right-0 h-[6%] bg-[#e0e0e0]" />
              <div className="absolute left-[20%] top-0 bottom-0 w-[4%] bg-[#e0e0e0]" />
              <div className="absolute left-[55%] top-0 bottom-0 w-[3%] bg-[#e0e0e0]" />
            </div>
            <MapPin
              className="absolute bottom-[18%] left-[15%] size-5 text-[#a78bfa] drop-shadow-sm"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
            />
            <MapPin
              className="absolute top-[12%] right-[22%] size-4 text-[#a78bfa] drop-shadow-sm"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
            />
            <MapPin
              className="absolute top-[42%] right-[12%] size-5 text-[#a78bfa] drop-shadow-sm"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
            />
            <button
              type="button"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-1.5 bg-white/90 hover:bg-white transition-colors rounded-[8px] px-3 py-1.5 shadow-md border border-white/50"
            >
              <Maximize2 className="size-4 text-[#111]" />
              <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">지도 보기</span>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] mb-3">편의시설</h4>
          <div className="flex gap-2 overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1 [scrollbar-width:thin]">
            {FACILITIES.map(({ id, label, Icon }) => (
              <div key={id} className="shrink-0 flex flex-col items-center gap-2 w-[72px]">
                <div className="size-12 rounded-full border border-[#e5e5e5] flex items-center justify-center bg-white">
                  <Icon className="size-6 text-[#111]" />
                </div>
                <span className="text-[12px] text-[#111] text-center leading-tight whitespace-pre-line">
                  {label.split(" ").join("\n")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div ref={noticeRef} className="mb-4">
          <h4 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">호텔 공지사항</h4>
          {!noticeExpanded ? (
            <>
              <div className="flex items-start gap-2 mb-3">
                <Megaphone className="size-4 text-[#666] shrink-0 mt-0.5" />
                <span className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">안내사항</span>
              </div>
              <p className="text-[13px] text-[#666] leading-[1.5] mb-2">
                업그레이드 특전은 객실명에 &quot;객실업글&quot; 명시된 요금만 적용 가능합니다.
              </p>
              <div className="relative">
                <div className="text-[13px] text-[#666] leading-[1.5] line-clamp-3 opacity-80">
                  <span className="inline-flex items-center gap-1">
                    <Check className="size-3.5 text-[#7b3ff2] shrink-0" />
                    [주의사항] 4박 이상 검색시에만 업그레이드 된 객실을 조회하실 수 있습니다.
                  </span>
                  <br />
                  일부 날짜 객실 마감으로 검색이 안될 수 있습니다.
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    type="button"
                    onClick={handleExpandNotice}
                    className="inline-flex items-center gap-1 rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] text-[#111] hover:bg-[#f8f9fa] transition-colors"
                  >
                    더보기
                    <ChevronDown className="size-4" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 rounded-[16px] bg-[#f5f5f5] px-4 py-3">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <AlertCircle className="size-[18px] shrink-0 text-[#111]" strokeWidth={2} aria-hidden />
                    <span className="text-[14px] font-['Pretendard:Medium',sans-serif] text-[#111]">
                      호텔 취소/환불 규정
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onHotelRefundPolicyDetails?.();
                      setRefundPolicyOpen(true);
                    }}
                    className="shrink-0 rounded-full border border-[#e0e0e0] bg-white px-3.5 py-1.5 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] hover:bg-[#fafafa] transition-colors"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2 mb-3">
                <Megaphone className="size-4 text-[#666] shrink-0 mt-0.5" />
                <span className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">안내사항</span>
              </div>
              <p className="text-[13px] text-[#666] leading-[1.6] mb-3">
                업그레이드 특전은 객실명에 &quot;객실업글&quot; 명시된 요금만 적용 가능합니다.
              </p>
              <div className="mb-4">
                <p className="flex items-start gap-2 text-[13px] text-[#666] leading-[1.6] mb-2">
                  <Check className="size-3.5 text-[#7b3ff2] shrink-0 mt-1" />
                  <span>
                    <strong className="text-[#111]">[주의사항]</strong> 4박 이상 검색시에만 업그레이드 된 객실을
                    조회하실 수 있습니다.
                  </span>
                </p>
                <p className="flex items-start gap-2 text-[13px] text-[#666] leading-[1.6] mb-2 pl-5">
                  <span>일부 날짜 객실 마감으로 검색이 안될 수 있습니다.</span>
                </p>
                <p className="flex items-start gap-2 text-[13px] text-[#666] leading-[1.6] pl-5">
                  <span>예약 전 각 요금의 [알림]을 반드시 확인 부탁드립니다.</span>
                </p>
              </div>
              <div className="border-t border-[#e5e5e5] pt-4 mb-4">
                <p className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111] mb-3">
                  [호텔 배관 점검 일정 안내]
                </p>
                <ul className="space-y-2 text-[13px] text-[#666] leading-[1.6]">
                  <li>
                    <strong className="text-[#111]">작업내용:</strong> 배관 수리
                  </li>
                  <li>
                    <strong className="text-[#111]">작업기간:</strong> 2025년 10월 6일(월) 부터 순차 진행
                  </li>
                  <li>
                    <strong className="text-[#111]">작업대상:</strong> Ewa Tower 29층부터 (※ Diamond Head Tower는 해당
                    없음)
                  </li>
                  <li>
                    <strong className="text-[#111]">작업시간:</strong> 매일 09:00 ~ 17:00
                  </li>
                  <li>
                    <strong className="text-[#111]">소요시간:</strong> 객실당 약 30~45분
                  </li>
                </ul>
                <ul className="mt-3 space-y-1 text-[13px] text-[#666] leading-[1.6]">
                  <li>* 작업 시간 중 엔지니어링 팀이 객실에 출입할 예정입니다.</li>
                  <li>* 체크인 시 및 객실 내 별도 안내문 제공 예정입니다.</li>
                </ul>
              </div>
              <p className="text-[12px] text-[#999] leading-[1.5] mb-3">
                ※ 해당 점검 일정은 현지 사정에 의해 사전 고지 없이 변동될 수 있습니다.
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setNoticeExpanded(false)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] text-[#111] hover:bg-[#f8f9fa] transition-colors"
                >
                  접기
                  <ChevronUp className="size-4" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mb-4 -mx-5 px-5 mt-6 pt-6 border-t-[8px] border-[#ebebeb]">
          <button
            type="button"
            onClick={() => setOtherInstructionsExpanded(!otherInstructionsExpanded)}
            className="w-full flex items-center justify-between gap-2 text-left mb-3"
          >
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">
              기타 안내사항
            </h4>
            {otherInstructionsExpanded ? (
              <ChevronUp className="size-5 shrink-0 text-[#666]" aria-hidden />
            ) : (
              <ChevronDown className="size-5 shrink-0 text-[#666]" aria-hidden />
            )}
          </button>
          {otherInstructionsExpanded && (
            <div className="rounded-[16px] bg-[#f5f5f5] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Info className="size-[18px] shrink-0 text-[#666]" strokeWidth={2} aria-hidden />
                <p className="text-[14px] font-['Pretendard:SemiBold',sans-serif] font-semibold text-[#111]">
                  아래 내용을 확인해 주세요.
                </p>
              </div>
              <ul className="list-disc list-outside space-y-3 pl-4 text-[13px] text-[#666] leading-[1.6] marker:text-[#bbb]">
                <li>
                  내맘대로 상품으로 예약한 경우, 이는 항공+호텔 결합상품이므로, 항공예약 단독으로는 취소 불가하며 적어도
                  1개의 호텔과 함께 취소 가능합니다.
                </li>
                <li>
                  내맘대로 상품으로 예약한 경우, 내맘대로 상품에서 2개 이상의 호텔 상품을 예약할 경우에 한해 호텔 건별
                  취소가 가능합니다. (단, 최대 2개 호텔까지만 호텔 건별 취소가 가능)
                </li>
                <li>
                  내맘대로 상품으로 예약한 경우, 취소는 1:1 문의로만 요청 가능하며, 수수료 규정에 대한 확인 절차가
                  필요합니다. 이후 최종적으로 고객의 취소 결정 및 동의 득한 후 항공 예약, 호텔예약이 동시에 일괄 취소로
                  진행됩니다. (단, 최대 2개 호텔까지에 대한 호텔 건별 취소는, 각 호텔별 취소 수수료 규정에 의거하여
                  개별적으로 진행됩니다.)
                </li>
                <li>
                  내맘대로 상품의 수수료는 항공, 호텔 각각의 규정이 중복 적용되며 1:1문의로 확인 가능합니다.
                </li>
              </ul>
            </div>
          )}
        </div>
        </>
        )}
      </div>

      {!hideBookingButton && onBooking && (
        <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4">
          <button
            onClick={onBooking}
            className="w-full py-4 bg-[#7b3ff2] text-white rounded-[30px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#5e2bb8] transition-colors"
          >
            객실 선택하기
          </button>
        </div>
      )}

      <HotelRefundPolicySheet
        open={refundPolicyOpen}
        onClose={() => setRefundPolicyOpen(false)}
        hotelName={hotel.name}
        checkInYmd={getHotelCheckInYmd(hotel)}
      />
    </>
  );
}
