import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, Bed } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { RoomInfoNoticePopup } from "./RoomInfoNoticePopup";

/** 객실 이미지 기본 URL (미지정 시 사용) */
const DEFAULT_ROOM_IMAGES = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=400&fit=crop",
];

export interface RoomType {
  id: string;
  name: string;
  bedType: string;
  capacity: string;
  size: string;
  price: number;
  /** 개별 객실가 (표시용, 예: 680000 → "680,000원~") */
  priceFrom: number;
  amenities: string[];
  /** 취소 정책 (미지정 시 무료취소) */
  cancelPolicy?: "free" | "nonRefundable" | "partial";
  /** 조식 포함 여부 (미지정 시 true) */
  breakfastIncluded?: boolean;
  /** 객실 이미지 URL (미지정 시 기본 이미지 사용) */
  image?: string;
  /** 특별 배지 (인기, 특가, 프리미엄 등) */
  specialBadge?: "인기" | "특가" | "프리미엄";
}

/** 객실 타입별 상위 그룹 (표시 순서) */
const ROOM_TYPE_GROUPS = [
  "스탠다드룸",
  "슈페리어룸",
  "디럭스룸",
  "트윈/더블룸",
  "패밀리룸",
  "스위트룸",
] as const;

type RoomTypeGroupKey = (typeof ROOM_TYPE_GROUPS)[number];

/** 객실명으로 상위 그룹 판별 */
function getRoomTypeGroup(roomName: string): RoomTypeGroupKey {
  const n = roomName;
  if (/스위트|펜트하우스|로얄|빌라/i.test(n)) return "스위트룸";
  if (/패밀리/i.test(n)) return "패밀리룸";
  if (/스탠다드/i.test(n)) return "스탠다드룸";
  if (/슈페리어/i.test(n)) return "슈페리어룸";
  if (/디럭스/i.test(n)) return "디럭스룸";
  if (/트윈|더블/i.test(n)) return "트윈/더블룸";
  return "스탠다드룸";
}

/** 그룹별로 정렬된 객실 목록 반환 */
function groupRoomsByType(roomTypes: RoomType[]): Map<RoomTypeGroupKey, RoomType[]> {
  const map = new Map<RoomTypeGroupKey, RoomType[]>();
  for (const group of ROOM_TYPE_GROUPS) {
    map.set(group, []);
  }
  for (const room of roomTypes) {
    const group = getRoomTypeGroup(room.name);
    map.get(group)!.push(room);
  }
  return map;
}

/** 객실 카드용 이미지 URL (room.image 또는 기본 이미지) */
function getRoomImage(room: RoomType, index: number): string {
  return room.image ?? DEFAULT_ROOM_IMAGES[index % DEFAULT_ROOM_IMAGES.length];
}

/** 필터 칩에 표시할 그룹 라벨 (슈페리어룸 → 슈페리어 등) */
function getFilterLabel(groupKey: RoomTypeGroupKey): string {
  const map: Record<RoomTypeGroupKey, string> = {
    "스탠다드룸": "스탠다드",
    "슈페리어룸": "슈페리어",
    "디럭스룸": "디럭스",
    "트윈/더블룸": "트윈/더블",
    "패밀리룸": "패밀리",
    "스위트룸": "스위트",
  };
  return map[groupKey] ?? groupKey;
}

interface RoomTypeSelectorProps {
  hotelName: string;
  roomTypes: RoomType[];
  /** 일정 표기 (예: 06.07~06.09 2박) */
  stayDateRange?: string;
  /** 객실/인원 요약 (예: 객실1, 성인1 아동1) */
  roomGuestSummary?: string;
  /** 'booking': 예약하기로 열림, 'change-room': 객실 변경으로 열림 */
  mode?: "booking" | "change-room" | null;
  /** 현재 선택된 객실 ID (변경 모드에서 "선택된 객실" 표시용) */
  selectedRoomId?: string | null;
  onSelect: (roomType: RoomType) => void;
  onClose: () => void;
}

export function RoomTypeSelector({ hotelName, roomTypes, stayDateRange = "06.07~06.09 2박", roomGuestSummary = "객실1, 성인1 아동1", mode, selectedRoomId, onSelect, onClose }: RoomTypeSelectorProps) {
  useLockBodyScroll();
  const grouped = groupRoomsByType(roomTypes);
  const selectedRoomRef = useRef<HTMLDivElement>(null);

  /** 부가서비스 상세정보 팝업에 표시할 객실 (null이면 팝업 숨김) */
  const [benefitsRoom, setBenefitsRoom] = useState<RoomType | null>(null);
  /** 취소불가 객실 예약 확인 팝업 (null이면 미표시) */
  const [nonRefundableConfirmRoom, setNonRefundableConfirmRoom] = useState<RoomType | null>(null);
  /** 객실 안내 팝업 (예약하기 클릭 시 먼저 표시, null이면 미표시) */
  const [roomInfoRoom, setRoomInfoRoom] = useState<RoomType | null>(null);
  /** 필터: 전체 또는 그룹 키 */
  const [activeFilter, setActiveFilter] = useState<RoomTypeGroupKey | "all">("all");
  /** 스크롤로 보이는 구간에 해당하는 그룹 (탭 활성 표시용) */
  const [scrollActiveGroup, setScrollActiveGroup] = useState<RoomTypeGroupKey | null>(null);
  /** 그룹별 더보기 펼침 여부 (펼치면 해당 그룹 객실 전부 표시) */
  const [expandedGroups, setExpandedGroups] = useState<Set<RoomTypeGroupKey>>(new Set());

  const roomsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefsMap = useRef<Map<string, { el: HTMLDivElement; groupKey: RoomTypeGroupKey }>>(new Map());
  const filterChipGroups = ROOM_TYPE_GROUPS.filter((g) => (grouped.get(g)?.length ?? 0) > 0);
  /** 현재 표시할 그룹 목록 (전체일 땐 모든 그룹, 필터 시 해당 그룹만) */
  const groupsToShow: RoomTypeGroupKey[] =
    activeFilter === "all" ? filterChipGroups : activeFilter ? [activeFilter] : [];
  /** 그룹별로 최대 3개 또는 펼침 시 전부 — 실제 렌더용 플랫 목록 */
  const visibleRooms: RoomType[] = groupsToShow.flatMap((g) => {
    const rooms = grouped.get(g) ?? [];
    const isExpanded = expandedGroups.has(g);
    return isExpanded ? rooms : rooms.slice(0, 3);
  });

  useEffect(() => {
    if (selectedRoomId && selectedRoomRef.current) {
      setTimeout(() => {
        selectedRoomRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 350);
    }
  }, [selectedRoomId]);

  useEffect(() => {
    const container = roomsContainerRef.current;
    const map = cardRefsMap.current;
    if (!container || map.size === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (container.scrollTop < 20) {
          setScrollActiveGroup(null);
          return;
        }
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({
            el: e.target as HTMLElement,
            top: (e.target as HTMLElement).getBoundingClientRect().top,
          }));
        if (intersecting.length === 0) return;
        intersecting.sort((a, b) => a.top - b.top);
        const groupKey = intersecting[0].el.getAttribute("data-group") as RoomTypeGroupKey | null;
        if (groupKey) setScrollActiveGroup(groupKey);
      },
      { root: container, rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    map.forEach(({ el }) => observer.observe(el));
    return () => map.forEach(({ el }) => observer.unobserve(el));
  }, [visibleRooms]);

  const handleBook = (room: RoomType) => {
    if (mode === "change-room") {
      onSelect(room);
      return;
    }
    const isNonRefundable = (room.cancelPolicy ?? "free") === "nonRefundable";
    if (isNonRefundable) {
      setNonRefundableConfirmRoom(room);
      return;
    }
    setRoomInfoRoom(room);
  };

  const handleNonRefundableConfirm = () => {
    const room = nonRefundableConfirmRoom;
    if (!room) return;
    setNonRefundableConfirmRoom(null);
    setRoomInfoRoom(room);
  };

  const handleRoomInfoConfirm = () => {
    const room = roomInfoRoom;
    if (!room) return;
    setRoomInfoRoom(null);
    onSelect(room);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end">
        {/* 배경 오버레이 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* 바텀시트 */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full bg-white rounded-t-[24px] max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* 드래그 핸들 */}
          <div className="shrink-0 w-10 h-1 bg-[#d1d5db] rounded-full mx-auto mt-3 mb-2" />

          {/* 헤더: 호텔명 + 예약 정보 + 닫기 */}
          <header className="sticky top-0 z-10 bg-white border-b border-[#e5e7eb] px-5 pb-4 shrink-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h1 className="font-['Pretendard:Bold',sans-serif] text-[22px] text-[#111827] mb-1">
                  {hotelName}
                </h1>
                <p className="text-[13px] text-[#4b5563]">
                  {stayDateRange} · {roomGuestSummary}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 -mr-2 hover:bg-[#f3f4f6] rounded-full transition-colors shrink-0"
              >
                <X className="size-6 text-[#6b7280]" />
              </button>
            </div>

            {/* 필터 칩 */}
            <div className="flex gap-2 overflow-x-auto mt-4 -mx-1 scrollbar-none">
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("all");
                  setScrollActiveGroup(null);
                  roomsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`shrink-0 py-2 px-4 rounded-[20px] text-[14px] font-medium transition-all border ${
                  activeFilter === "all" && !scrollActiveGroup
                    ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                    : "bg-white border-[#d1d5db] text-[#374151] hover:border-[#a78bfa]"
                }`}
              >
                전체
              </button>
              {filterChipGroups.map((groupKey) => {
                const isActive =
                  activeFilter === groupKey || (activeFilter === "all" && scrollActiveGroup === groupKey);
                return (
                  <button
                    key={groupKey}
                    type="button"
                    onClick={() => {
                      setActiveFilter(groupKey);
                      setScrollActiveGroup(groupKey);
                      roomsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`shrink-0 py-2 px-4 rounded-[20px] text-[14px] font-medium transition-all border ${
                      isActive
                        ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                        : "bg-white border-[#d1d5db] text-[#374151] hover:border-[#a78bfa]"
                    }`}
                  >
                    {getFilterLabel(groupKey)}
                  </button>
                );
              })}
            </div>
          </header>

          {/* 객실 카드 목록 (그룹별 3개 + 더보기) */}
          <div
            ref={roomsContainerRef}
            className="flex-1 overflow-y-auto px-5 py-4 pb-24 scrollbar-none"
          >
            {roomTypes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-[#6b7280] text-[15px]">
                <p className="font-medium text-[#374151] mb-1">객실 정보가 없습니다</p>
                <p className="text-[13px]">다른 호텔을 선택해 주세요.</p>
              </div>
            ) : groupsToShow.map((groupKey) => {
              const rooms = grouped.get(groupKey) ?? [];
              const isExpanded = expandedGroups.has(groupKey);
              const displayRooms = isExpanded ? rooms : rooms.slice(0, 3);
              const hasMore = rooms.length > 3;

              return (
                <div key={groupKey} className="mb-6">
                  {displayRooms.map((room, idx) => {
                    const globalIndex = groupsToShow.indexOf(groupKey) * 10 + idx;
                    const policy = room.cancelPolicy ?? "free";
                    const breakfast = room.breakfastIncluded ?? true;
                    const nights = 2;
                    const pricePerNight = Math.round(room.priceFrom / nights);

                    return (
                      <motion.div
                        key={room.id}
                        ref={(el) => {
                          if (el) {
                            cardRefsMap.current.set(room.id, { el: el as HTMLDivElement, groupKey });
                            if (room.id === selectedRoomId) selectedRoomRef.current = el as HTMLDivElement;
                          } else {
                            cardRefsMap.current.delete(room.id);
                            if (room.id === selectedRoomId) selectedRoomRef.current = null;
                          }
                        }}
                        data-group={groupKey}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: globalIndex * 0.05 }}
                        className="bg-white rounded-[16px] mb-5 overflow-hidden border border-[#e5e7eb] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                  {/* 객실 이미지 (디럭스룸은 이미지 없음) */}
                  {groupKey !== "디럭스룸" && (
                    <div className="relative w-full h-[180px] overflow-hidden">
                      <img
                        src={getRoomImage(room, idx)}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <span
                        className={`absolute top-3 left-3 px-3 py-1.5 text-white text-[12px] font-semibold rounded-md ${
                          groupKey === "스위트룸"
                            ? "bg-[#f59e0b]/90"
                            : "bg-[#7C3AED]/90"
                        }`}
                      >
                        {getFilterLabel(groupKey)}
                      </span>
                      {room.specialBadge && (
                        <span className="absolute top-3 right-3 px-3 py-1.5 bg-[#ef4444]/90 text-white text-[12px] font-semibold rounded-md">
                          {room.specialBadge}
                        </span>
                      )}
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 text-white text-[12px] font-medium rounded-md backdrop-blur"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBenefitsRoom(room);
                        }}
                      >
                        📷 {room.amenities.length + 2}+
                      </button>
                    </div>
                  )}

                  <div className="px-4 py-2.5">
                    {groupKey === "디럭스룸" && (
                      <span className="inline-block mb-1 px-2 py-0.5 text-white text-[10px] font-semibold rounded bg-[#3b82f6]">
                        디럭스
                      </span>
                    )}
                    <h3 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111827] mb-1">
                      {room.name}
                    </h3>
                    <p className="text-[13px] text-[#4b5563] mb-1.5 flex items-center gap-1">
                      <Bed className="size-3.5 shrink-0" strokeWidth={2} />
                      {room.bedType}
                    </p>

                    {/* 어메니티 태그 */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {policy === "free" && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white bg-[#10B981]">
                          무료취소 ~05.14
                        </span>
                      )}
                      {policy === "nonRefundable" && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white bg-[#EF4444]">
                          취소불가
                        </span>
                      )}
                      {policy === "partial" && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white bg-[#6b7280]">
                          ~05.10까지
                        </span>
                      )}
                      {breakfast ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white bg-[#F59E0B]">
                          조식포함
                        </span>
                      ) : (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-[#6b7280] bg-[#f3f4f6]">
                          조식 불포함
                        </span>
                      )}
                    </div>

                    {/* 가격 + 예약하기 (가로 배치) */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <span className="text-[11px] text-[#6b7280] mb-0.5">1박 기준</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#7C3AED]">
                            {pricePerNight.toLocaleString()}
                          </span>
                          <span className="text-[12px] text-[#7C3AED] font-medium">원</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBook(room)}
                        disabled={mode === "change-room" && selectedRoomId === room.id}
                        className={`shrink-0 py-2.5 px-6 rounded-[9999px] text-[14px] font-semibold transition-all ${
                          mode === "change-room" && selectedRoomId === room.id
                            ? "bg-[#f0f0f0] text-[#9ca3af] cursor-default"
                            : "bg-[#7C3AED] text-white hover:bg-[#6D28D9] hover:-translate-y-px shadow-md active:translate-y-0"
                        }`}
                      >
                        {mode === "change-room"
                          ? selectedRoomId === room.id
                            ? "선택된 객실"
                            : "변경하기"
                          : "예약하기"}
                      </button>
                    </div>
                  </div>
                      </motion.div>
                    );
                  })}
                  {hasMore && (
                    <button
                      type="button"
                      onClick={() => setExpandedGroups((prev) => {
                        const next = new Set(prev);
                        if (next.has(groupKey)) next.delete(groupKey);
                        else next.add(groupKey);
                        return next;
                      })}
                      className="w-full py-3 rounded-[12px] border border-[#e5e7eb] text-[14px] font-medium text-[#7C3AED] hover:bg-[#f5f3ff] transition-colors"
                    >
                      {isExpanded ? `${getFilterLabel(groupKey)} 숨기기` : `${getFilterLabel(groupKey)} 더보기`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

        </motion.div>

        <RoomInfoNoticePopup
          open={roomInfoRoom !== null}
          onClose={() => setRoomInfoRoom(null)}
          onConfirm={handleRoomInfoConfirm}
        />

        {/* 취소불가 예약 확인 팝업 */}
        <AnimatePresence>
          {nonRefundableConfirmRoom && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/50"
                onClick={() => setNonRefundableConfirmRoom(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-1/2 top-1/2 z-[60] w-full max-w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl px-5 py-6 flex flex-col items-center gap-6"
              >
                <p className="text-[15px] text-[#111] text-center leading-[1.6]">
                  본 예약은 취소마감일이 지난 예약으로 확정 후에는
                  <br />
                  취소 또는 변경이 불가합니다. 계속
                  <br />
                  진행하시겠습니까?
                </p>
                <div className="flex w-full gap-3">
                  <button
                    type="button"
                    onClick={() => setNonRefundableConfirmRoom(null)}
                    className="flex-1 py-2.5 rounded-[12px] border border-[#e0e0e0] bg-white text-[#111] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f9f9f9] transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleNonRefundableConfirm}
                    className="flex-1 py-2.5 rounded-[12px] bg-[#6329C4] text-white text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#4a1f94] transition-colors"
                  >
                    확인
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 부가서비스 상세정보 팝업 */}
        <AnimatePresence>
          {benefitsRoom && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/50"
                onClick={() => setBenefitsRoom(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-1/2 top-1/2 z-[60] w-full max-w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl"
              >
                {/* 팝업 헤더 */}
                <div className="border-b border-[#f0f0f0] px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
                        특별한 혜택
                      </h3>
                      <p className="text-[14px] text-[#111] font-normal">
                        {benefitsRoom.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBenefitsRoom(null)}
                      className="p-2 -mr-2 hover:bg-[#f5f5f5] rounded-full transition-colors shrink-0"
                    >
                      <X className="size-6 text-[#666]" />
                    </button>
                  </div>
                </div>
                {/* 혜택 태그 + 상세 */}
                <div className="px-5 py-4 space-y-4">
                  {benefitsRoom.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {benefitsRoom.amenities.slice(0, 6).map((a, i) => (
                        <span
                          key={i}
                          className="shrink-0 px-3 py-1.5 rounded-full bg-[#f0f0f0] text-[12px] text-[#111] font-normal"
                        >
                          #{a}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="space-y-3">
                    {benefitsRoom.amenities.length > 0 ? (
                      benefitsRoom.amenities.map((amenity, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <p className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#4a1f94]">
                            혜택{i + 1}.
                          </p>
                          <p className="pl-4 text-[13px] text-[#111] font-normal">
                            {amenity}
                          </p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex flex-col gap-1">
                          <p className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#4a1f94]">
                            혜택1.
                          </p>
                          <p className="pl-4 text-[13px] text-[#111] font-normal">
                            객실 무료 업그레이드
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#4a1f94]">
                            혜택2.
                          </p>
                          <p className="pl-4 text-[13px] text-[#111] font-normal">
                            조식 추가
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
