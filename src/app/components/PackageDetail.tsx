import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { PackageData } from "./PackageCard";
import { X, ChevronRight } from "lucide-react";

const DETAIL_TABS = ["핵심포인트", "관광", "호텔", "식사", "교통", "인솔자"] as const;
const SLIDE_GAP = 12;

interface PackageDetailProps {
  package: PackageData;
  onClose: () => void;
  onBooking: () => void;
}

export function PackageDetail({ package: pkg, onClose, onBooking }: PackageDetailProps) {
  useLockBodyScroll();
  const [activeTab, setActiveTab] = useState<(typeof DETAIL_TABS)[number]>("핵심포인트");
  const [airlinePopupOpen, setAirlinePopupOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isScrollingByUser = useRef(false);

  const scrollToSlide = useCallback((index: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const slideW = (el.scrollWidth - SLIDE_GAP * (DETAIL_TABS.length - 1)) / DETAIL_TABS.length;
    const left = index * (slideW + SLIDE_GAP);
    isScrollingByUser.current = true;
    el.scrollTo({ left, behavior: "smooth" });
    setActiveTab(DETAIL_TABS[index]);
    setTimeout(() => { isScrollingByUser.current = false; }, 400);
  }, []);

  const handleSliderScroll = useCallback(() => {
    if (isScrollingByUser.current) return;
    const el = sliderRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth } = el;
    const slideW = (scrollWidth - SLIDE_GAP * (DETAIL_TABS.length - 1)) / DETAIL_TABS.length;
    const index = Math.round(scrollLeft / (slideW + SLIDE_GAP));
    const clamped = Math.max(0, Math.min(index, DETAIL_TABS.length - 1));
    if (DETAIL_TABS[clamped] !== activeTab) setActiveTab(DETAIL_TABS[clamped]);
  }, [activeTab]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleSliderScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleSliderScroll);
  }, [handleSliderScroll]);

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
        className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-[24px] relative"
      >
        {/* 항공사 정보 팝업 (중앙 모달) */}
        <AnimatePresence>
          {airlinePopupOpen && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              onClick={() => setAirlinePopupOpen(false)}
              aria-hidden="false"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50"
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[360px] max-h-[85vh] overflow-y-auto bg-white rounded-[24px] shadow-xl p-5"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">일정 및 교통편</h3>
                  <button
                    type="button"
                    onClick={() => setAirlinePopupOpen(false)}
                    className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <div className="rounded-[16px] border border-[#e8e8e8] bg-white shadow-sm p-4">
                  {/* 가는 날 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[14px] text-[#3780ff] font-['Pretendard:SemiBold',sans-serif]">가는 날</p>
                      <p className="text-[14px] text-[#111]">25년 11월 21일 (금)</p>
                    </div>
                    <p className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] font-bold">20:50 - 인천(ICN) 출발</p>
                    <p className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] font-bold mb-1">17:20 - 프랑크푸르트 (FRA) 도착</p>
                    <p className="text-[13px] text-[#666]">대한항공 KE0945 | 직항 | 13시간 55분</p>
                  </div>
                  <div className="border-t border-dashed border-[#e0e0e0] my-4" />
                  {/* 오는 날 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[14px] text-[#3780ff] font-['Pretendard:SemiBold',sans-serif]">오는 날</p>
                      <p className="text-[14px] text-[#111]">25년 11월 27일 (목)</p>
                    </div>
                    <p className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] font-bold">20:50 - 인천(ICN) 출발</p>
                    <p className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] font-bold mb-1">
                      17:20 - 프랑크푸르트 (FRA) 도착 <span className="text-[#3780ff]">+1</span>
                    </p>
                    <p className="text-[13px] text-[#666]">대한항공 KE0945 | 직항 | 13시간 55분</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="sticky top-0 z-10 bg-white border-b border-[#f0f0f0] px-5 py-4 flex items-center justify-between">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">상품 상세</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="relative w-full h-[200px] rounded-[16px] overflow-hidden mb-4">
            <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
            {/* 좌측 상단 태그: pill 형태 */}
            <div className="absolute top-2 left-2 flex items-center gap-1">
              <span className="px-[7px] py-1 rounded-full bg-[#5e2bb8] text-white text-[10px] font-['Pretendard:Bold',sans-serif] font-bold">
                하나팩2.0
              </span>
              <span className="px-[7px] py-1 rounded-full bg-[#eaaa14] text-white text-[10px] font-['Pretendard:Bold',sans-serif] font-bold">
                프리미엄
              </span>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/55 text-white">
              <svg className="w-[14px] h-[14px] fill-[#FFB800]" viewBox="0 0 16 16">
                <path d="M8 0L10.472 5.008L16 5.856L12 9.712L12.944 15.232L8 12.616L3.056 15.232L4 9.712L0 5.856L5.528 5.008L8 0Z"/>
              </svg>
              <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif]">{pkg.rating}</span>
              <span className="text-[12px] text-white/90">후기 {pkg.reviewCount}개</span>
            </div>
          </div>

          <h3 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111] mb-4 font-bold">
            {pkg.title}
          </h3>

          {/* 출발확정 + 예약/잔여 인원 */}
          <div className="flex items-center gap-2 w-full rounded-[12px] bg-white border border-[#eee] px-4 py-3 mb-4">
            <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#ffebee] text-[#c62828] text-[12px] font-['Pretendard:SemiBold',sans-serif]">
              출발확정
            </span>
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] font-bold">
                예약 {pkg.bookedCount ?? 6}명 / 잔여 {pkg.availableSeats}명
              </span>
              <span className="text-[12px] text-[#999] font-normal shrink-0">
                (최소출발 {pkg.minDepartureCount ?? 8}명)
              </span>
            </div>
            <ChevronRight className="size-5 text-[#999] shrink-0" />
          </div>

          {/* 여행 정보 3그리드: 라벨(회색) + 값(굵은 검정) */}
          <div className="bg-[#f5f5f5] rounded-[12px] p-4 mb-4 grid grid-cols-3 gap-x-3 gap-y-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#999] font-normal">전체일정</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] font-bold">{pkg.duration}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#999] font-normal">출발일</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] font-bold">{pkg.departure}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#999] font-normal">직항</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setAirlinePopupOpen(true); }}
                className="flex items-center gap-0.5 w-full text-left hover:opacity-80 transition-opacity"
              >
                <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] font-bold">{pkg.airline}</span>
                <ChevronRight className="size-4 text-[#111] shrink-0" />
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#999] font-normal">가이드경비</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] font-bold">USD 40</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#999] font-normal">쇼핑</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] font-bold">3회</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#999] font-normal">호텔</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] font-bold">4~5성급</span>
            </div>
          </div>

          <div className="border-t border-[#eee] my-0 mb-4" aria-hidden />

          {/* 일정 난이도 및 활동 강도 */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold">
                일정 난이도 및 활동 강도
              </h4>
              <button
                type="button"
                className="text-[12px] text-[#9c9ea0] font-medium hover:text-[#3780ff] hover:underline"
              >
                난이도 측정기준 &gt;
              </button>
            </div>
            <div className="flex items-center gap-2 mb-[5px] text-left justify-center">
              <span className="text-[18px]" aria-hidden>🧐</span>
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#3780ff] font-semibold">
                핵심 관광 집중형
              </span>
            </div>
            <div className="mb-4">
              <div className="flex w-full h-[30px] rounded-full overflow-visible justify-center items-start flex-wrap">
                {/* 관광: 파란 세그먼트, 오른쪽 둥근 끝이 청록 위로 겹침 */}
                <div
                  className="h-full bg-[#4585ff] rounded-l-full rounded-r-full flex items-center justify-start shrink-0 pl-[10px] -mr-3 z-10"
                  style={{ width: "70%" }}
                >
                  <span className="text-[13px] font-medium text-white">관광</span>
                </div>
                {/* 휴식: 청록 세그먼트, 오른쪽만 둥글게 */}
                <div
                  className="h-full bg-[#03bdce] rounded-r-full flex items-center justify-end shrink-0"
                  style={{ width: "30%" }}
                >
                  <span className="text-[12px] font-medium text-white pl-[10px] pr-[10px]">휴식</span>
                </div>
              </div>
              <div className="flex w-full mt-2 text-[12px]">
                <span className="flex-[0_0_70%] pr-1 text-[#4585ff]">일정의 70%가 관광 및 이동에 집중</span>
                <span className="flex-[0_0_30%] text-right pr-[10px] text-[#03bdce] whitespace-nowrap">30% 자유시간 보장</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-[5px]">
              <p className="flex gap-[5px] text-[14px] text-[#333] leading-[1.5] mt-1">
                <span className="w-[80px] text-[10px] text-[#05bdce] font-medium bg-[#eefbfb] h-[18px] inline-flex items-center">H-AI 요약 </span>
                {pkg.recommendReason}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-200 my-5" aria-hidden />

          {/* 핵심정보: 탭 + 핵심포인트 콘텐츠 (캡처 화면 구조) */}
          <div className="mb-4">
            <h4 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-3 font-bold">
              핵심정보
            </h4>
            {/* 탭 네비게이션 — 클릭 시 해당 슬라이드로 이동 */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
              {DETAIL_TABS.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => scrollToSlide(index)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-[#5e2bb8] text-white"
                      : "bg-white text-[#666] border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* 슬라이드 6장 = 탭 6개와 1:1 매칭, 스와이프 시 해당 탭 활성화 */}
            <div
              ref={sliderRef}
              className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            >
              {/* 슬라이드 0: 핵심포인트 */}
              <div className="shrink-0 w-[calc(100%-24px)] max-w-[320px] snap-center snap-always rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h5 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] font-bold mb-1">
                  하나투어 차별점
                </h5>
                <h6 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111] font-bold mb-3">
                  하나팩 2.0 스탠다드
                </h6>
                <div className="text-[14px] text-[#333] leading-[1.6] space-y-1 mb-3">
                  {pkg.highlights.length > 0
                    ? pkg.highlights.map((line, i) => <p key={i}>{line}</p>)
                    : <p>{pkg.recommendReason}</p>}
                </div>
                <img src={pkg.image} alt="상품 이미지" className="w-full rounded-[12px] object-cover aspect-[16/10]" />
              </div>
              {/* 슬라이드 1: 관광 */}
              <div className="shrink-0 w-[calc(100%-24px)] max-w-[320px] snap-center snap-always rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h6 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold mb-3">관광</h6>
                <div className="space-y-2">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-[#3780ff] text-[14px]">•</span>
                      <span className="text-[14px] text-[#666]">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* 슬라이드 2: 호텔 */}
              <div className="shrink-0 w-[calc(100%-24px)] max-w-[320px] snap-center snap-always rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h6 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold mb-3">호텔</h6>
                <p className="text-[14px] text-[#333] leading-[1.6]">{pkg.hotel} (4~5성급)</p>
                <img src={pkg.image} alt="호텔" className="w-full rounded-[12px] object-cover aspect-[16/10] mt-3" />
              </div>
              {/* 슬라이드 3: 식사 */}
              <div className="shrink-0 w-[calc(100%-24px)] max-w-[320px] snap-center snap-always rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h6 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold mb-3">식사</h6>
                <p className="text-[14px] text-[#333] leading-[1.6]">일정표상 식사 포함 여부는 상품별로 상이합니다.</p>
              </div>
              {/* 슬라이드 4: 교통 */}
              <div className="shrink-0 w-[calc(100%-24px)] max-w-[320px] snap-center snap-always rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h6 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold mb-3">교통</h6>
                <p className="text-[14px] text-[#333] leading-[1.6]">{pkg.airline} · {pkg.duration}</p>
              </div>
              {/* 슬라이드 5: 인솔자 */}
              <div className="shrink-0 w-[calc(100%-24px)] max-w-[320px] snap-center snap-always rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h6 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] font-bold mb-3">인솔자</h6>
                <p className="text-[14px] text-[#333] leading-[1.6]">{pkg.recommendReason}</p>
              </div>
            </div>
          </div>

          {/* 여행 일정표 보기 */}
          <button
            type="button"
            className="w-full py-3 px-4 rounded-xl border border-gray-200 text-[14px] font-medium text-[#333] bg-white hover:bg-gray-50 flex items-center justify-center gap-2 my-5"
          >
            여행 일정표 보기
          </button>

          {/* 구분선: 여행 하이라이트 ↔ 포함/불포함/선택경비 정보 */}
          <div className="w-full h-px bg-gray-200 my-5" aria-hidden />

          {/* 포함/불포함/선택경비 정보 */}
          <div className="mb-6">
            <h4 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] mb-4">
              포함/불포함/선택경비 정보
            </h4>

            {/* 포함내역 */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2563EB] text-white text-[12px] font-bold shrink-0">
                  ✓
                </span>
                <h5 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] font-semibold">포함내역</h5>
              </div>
              <ul className="space-y-1.5 text-[14px] text-[#333] pl-1">
                <li className="flex gap-2">
                  <span className="text-[#666] shrink-0">•</span>
                  <span>왕복항공권, 전용</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#666] shrink-0">•</span>
                  <span>국내공항세, 현지공항세, 관광진흥개발기금, 전쟁보험료, 유류할증료, 투어리스트 텍스</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#666] shrink-0">•</span>
                  <span>숙박 ({pkg.hotel}), 일정표상 모든 식사, 전문 가이드 및 차량, 여행자 보험</span>
                </li>
              </ul>
            </div>

            {/* 불포함내역 */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#DC2626] text-white text-[12px] font-bold shrink-0">
                  ✕
                </span>
                <h5 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] font-semibold">불포함내역</h5>
              </div>
              <ul className="space-y-2 text-[14px] text-[#333] pl-1">
                <li className="flex gap-2">
                  <span className="text-[#666] shrink-0">•</span>
                  <span>가이드/기사 경비 : 인당 CHF 90 (단, 15명 미만시 20~30 유로 추가 지불)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#666] shrink-0">•</span>
                  <span>기타 : 가격문의 (자유시간 시 식사비 (총3회))</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#666] shrink-0">•</span>
                  <span>개인 여행경비(물값, 자유시간시 개인비용 등)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#666] shrink-0">•</span>
                  <span>각종 매너팁(테이블팁, 객실팁, 포터비, 마사지팁 등)</span>
                </li>
              </ul>
            </div>

            {/* 선택경비 */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2563EB] text-white text-[14px] font-bold shrink-0">
                  !
                </span>
                <h5 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] font-semibold">선택경비</h5>
              </div>
              <ul className="space-y-1.5 text-[14px] text-[#333] pl-1">
                <li className="flex gap-2">
                  <span className="text-[#666] shrink-0">•</span>
                  <span>항공리턴변경(문의)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#666] shrink-0">•</span>
                  <span>객실 1인 사용 시 싱글베드 추가요금</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 w-full px-5 flex items-end justify-between py-0 pb-[10px] mb-0 border-t border-[#f0f0f0] bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div>
            <span className="text-[13px] text-[#666] block mb-0 mt-[10px]">성인 1명, 소아 1명</span>
            <span className="font-['Pretendard:Bold',sans-serif] font-bold text-[24px] text-[#5e2bb8]">
              {pkg.price.toLocaleString('ko-KR')}<span className="text-[14px] font-['Pretendard:Bold',sans-serif] text-[#666]">원</span>
            </span>
          </div>
          <button
            onClick={onBooking}
            className="w-[200px] px-6 py-3 bg-[#5e2bb8] text-white rounded-[30px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#5e2bb8] transition-colors"
          >
            예약하기
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
