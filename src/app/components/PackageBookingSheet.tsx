import { useState } from "react";
import { motion } from "motion/react";
import { ChevronUp, ChevronDown, ArrowLeft, Info, User } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { PackageData } from "./PackageCard";
import type { BookingFormData } from "./BookingForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn } from "./ui/utils";
import { PACKAGE_PREVIEW_COUPON_DISCOUNT } from "./PackageBookingPricePreview";
import { PackageServiceFooter } from "./PackageServiceFooter";

const DEPOSIT_AMOUNT = 100_000;

interface PackageBookingSheetProps {
  package: PackageData;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
  /** 예약금/총액 버튼 클릭 시 결제하기 화면으로 이동할 때 호출 (금액 전달) */
  onRequestPayment: (amount: number) => void;
  /** 미지정 시 성인 1·아동 0 (1인 기준 상품가) */
  travelerAdults?: number;
  travelerChildren?: number;
}

// 목업 예약자 정보
const defaultBooker = {
  name: "정그림",
  gender: "여",
  birthDate: "1990.01.31",
  phone: "010-0024-5590",
};

// 출발일을 "26.03.15(토)" 형식으로 표시
function formatDepartureDisplay(departure: string): string {
  const parsed = departure.replace(/\s/g, "").match(/(\d{4}|\d{2})\.(\d{1,2})\.(\d{1,2}).*?(\([일월화수목금토]\))?/);
  if (!parsed) return departure;
  const [, y, m, d, w] = parsed;
  const year = (y?.length === 4 ? y?.slice(-2) : y) ?? "26";
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  let dayStr = w ?? "";
  if (!dayStr && y && m && d) {
    const date = new Date(`${y?.length === 2 ? `20${y}` : y}-${m}-${d}`);
    dayStr = `(${weekdays[date.getDay()]})`;
  }
  return `${year}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}${dayStr}`;
}

// 출발일 기준 종료일 계산 (duration "5박6일" 등 파싱)
function parseEndDate(departure: string, duration: string): string {
  const match = duration.match(/(\d+)박/);
  const nights = match ? parseInt(match[1], 10) : 1;
  try {
    const d = departure.replace(/[^0-9.]/g, "").split(".");
    const year = d[0]?.length === 2 ? `20${d[0]}` : d[0] ?? "2026";
    const month = d[1] ?? "04";
    const day = d[2] ?? "05";
    const date = new Date(`${year}-${month}-${day}`);
    date.setDate(date.getDate() + nights);
    const y = date.getFullYear().toString().slice(-2);
    const m = date.getMonth() + 1;
    const da = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const w = weekdays[date.getDay()];
    return `${y}.${String(m).padStart(2, "0")}.${String(da).padStart(2, "0")}(${w})`;
  } catch {
    return departure;
  }
}

// "4박 5일" → "4박5일" (띄어쓰기 제거)
function formatDurationBadge(duration: string): string {
  return duration.replace(/\s/g, "") || duration;
}

function buildDefaultBookingData(): BookingFormData {
  return {
    name: defaultBooker.name,
    phone: defaultBooker.phone.replace(/-/g, ""),
    email: "user@example.com",
    birthDate: defaultBooker.birthDate.replace(/\./g, "-"),
    passportNumber: "",
    travelers: 1,
    agreeTerms: true,
    agreeCancellation: true,
  };
}

export function PackageBookingSheet({
  package: pkg,
  onClose,
  onSubmit,
  onRequestPayment,
  travelerAdults,
  travelerChildren,
}: PackageBookingSheetProps) {
  useLockBodyScroll();
  const [travelerTab, setTravelerTab] = useState<"now" | "later">("now");
  const [sameAsBooker, setSameAsBooker] = useState(true);
  const [travelerGender, setTravelerGender] = useState<"남" | "여" | null>(null);
  const [agreeAll, setAgreeAll] = useState(true);
  const [agreeOverseasTravel, setAgreeOverseasTravel] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [agreeUniqueId, setAgreeUniqueId] = useState(true);
  const [agreeThirdParty, setAgreeThirdParty] = useState(true);
  const [agreeSensitive, setAgreeSensitive] = useState(true);
  const [agreeLocation, setAgreeLocation] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFlightDetail, setShowFlightDetail] = useState(true);

  const endDate = parseEndDate(pkg.departure, pkg.duration);
  const adultCount = Math.max(1, travelerAdults ?? 1);
  const childCount = Math.max(0, travelerChildren ?? 0);
  const childRate = 0.75;
  const grossTotal = pkg.price * adultCount + Math.round(pkg.price * childRate) * childCount;
  const discountAmount = Math.min(Math.floor(grossTotal * 0.05), 50000);
  const couponDiscount = PACKAGE_PREVIEW_COUPON_DISCOUNT;
  const finalPrice = Math.max(0, grossTotal - discountAmount - couponDiscount);
  const travelerSummary =
    childCount > 0
      ? `성인 ${adultCount}명, 아동 ${childCount}명`
      : adultCount > 1
        ? `성인 ${adultCount}명`
        : "성인 1";

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeOverseasTravel(checked);
    setAgreePrivacy(checked);
    setAgreeUniqueId(checked);
    setAgreeThirdParty(checked);
    setAgreeSensitive(checked);
    setAgreeLocation(checked);
  };

  const allRequiredAgreed = agreeOverseasTravel && agreePrivacy && agreeUniqueId && agreeThirdParty && agreeSensitive;

  const submitBookingAndRequestPayment = (amount: number) => {
    if (!allRequiredAgreed) return;
    const data: BookingFormData = {
      ...buildDefaultBookingData(),
      agreeTerms: agreeAll,
    };
    onSubmit(data);
    onRequestPayment(amount);
  };

  const handlePayFull = () => submitBookingAndRequestPayment(finalPrice);
  const handlePayDeposit = () => submitBookingAndRequestPayment(DEPOSIT_AMOUNT);

  const screenTransition = { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black/25"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={screenTransition}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.12)]"
      >
        {/* 헤더: 뒤로 + 예약하기 (캡처 기준) */}
        <div className="w-full shrink-0 flex items-center gap-1 bg-white px-2 py-3 border-b border-[#eee]">
          <button
            type="button"
            onClick={onClose}
            className="p-2 -ml-0.5 shrink-0 rounded-full text-[#111] hover:bg-[#f5f5f5] transition-colors"
            aria-label="뒤로"
          >
            <ArrowLeft className="size-5 text-[#111]" strokeWidth={2} />
          </button>
          <h1 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111] leading-tight">
            예약하기
          </h1>
        </div>

        <div
          data-package-booking-scroll
          className="min-h-0 flex-1 w-full overflow-y-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            setShowScrollTop(el.scrollTop > 400);
          }}
        >
          {/* 상품 요약 (캡처 화면 기준) */}
          <div className="w-full p-4 border-b-8 border-[#f0f0f0]">
            {/* 패키지 제목 + 해시태그 + 썸네일 */}
            <div className="flex gap-2 items-center min-h-[72px]">
              <div className="flex-1 min-w-0 flex items-center">
                <p className="font-['Pretendard:SemiBold',sans-serif] text-[18px] font-semibold text-[#111] leading-snug line-clamp-2 tracking-[-1px]">
                  [{(pkg.reservationStatus === "출발예정" || pkg.reservationStatus === "예약확정") ? "출발확정" : (pkg.reservationStatus ?? "출발확정")}] {pkg.destination.split(",")[0]?.trim() ?? pkg.title.split(" ")[0]} {pkg.duration.replace(/\s/g, "").replace(/\d+박(\d+)일/, "$1일")}
                  {(pkg.highlights?.length ?? 0) > 0 && (
                    <> {" "}
                      {pkg.highlights!.slice(0, 4).map((h) => `#${h.replace(/\s+/g, " ")}`).join(" ")}
                      {(pkg.highlights?.length ?? 0) > 4 ? "..." : ""}
                    </>
                  )}
                </p>
              </div>
              <div className="w-[72px] h-[72px] rounded-[10px] overflow-hidden shrink-0 flex-shrink-0">
                <img src={pkg.image} alt="" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* 인원 */}
            <div className="mt-3 px-3 py-2 rounded-[10px] bg-[#f5f5f5] text-[13px]">
              <span className="text-[#888]">인원</span>
              <span className="text-[#333] ml-1.5">{travelerSummary}</span>
            </div>

            {/* 출발일 · 기간 · 도착일 카드 */}
            <div className="mt-3 rounded-[12px] border border-[#eee] bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-center flex-1 min-w-0">
                  <p className="text-[11px] text-[#888] mb-1">출발일</p>
                  <p className="font-['Pretendard:Bold',sans-serif] text-[16px] font-semibold text-[#111]">
                    {formatDepartureDisplay(pkg.departure)}
                  </p>
                </div>
                <span className="h-[25px] px-3 flex flex-col items-center justify-center rounded-full bg-[#5e2bb8] text-white text-[13px] font-['Pretendard:SemiBold',sans-serif] shrink-0">
                  {formatDurationBadge(pkg.duration)}
                </span>
                <div className="text-center flex-1 min-w-0">
                  <p className="text-[11px] text-[#888] mb-1">도착일</p>
                  <p className="font-['Pretendard:Bold',sans-serif] text-[16px] font-semibold text-[#111]">
                    {endDate}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-dashed border-[#ddd]" />

              {showFlightDetail ? (
                <>
                  {/* 항공 상세: 항공 정보 / 항공 출발 / 항공 도착 */}
                  <div className="mt-3 space-y-2.5 text-[13px]">
                    {/* 항공 정보 */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#888] shrink-0 w-[60px]">항공 정보</span>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e8001c] text-white text-[8px] font-bold">A</span>
                          <span className="font-['Pretendard:SemiBold',sans-serif] text-[#111]">{pkg.airline}</span>
                        </div>
                        <p className="text-[#666] mt-0.5">
                          서울(ICN) ⇌ {pkg.destination.split(",")[0]?.trim() ?? pkg.destination}
                        </p>
                      </div>
                    </div>
                    {/* 항공 출발 */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#888] shrink-0 w-[60px]">항공 출발</span>
                      <p className="text-[#111] text-right">
                        {formatDepartureDisplay(pkg.departure)} 08:20
                        <span className="text-[#ccc] mx-1.5">|</span>
                        항공편 ZE0593
                      </p>
                    </div>
                    {/* 항공 도착 */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#888] shrink-0 w-[60px]">항공 도착</span>
                      <p className="text-[#111] text-right">
                        {endDate} 07:20
                        <span className="text-[#ccc] mx-1.5">|</span>
                        항공편 ZE0594
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-dashed border-[#ddd]" />
                  <div className="flex justify-center mt-2">
                    <button
                      type="button"
                      onClick={() => setShowFlightDetail(false)}
                      className="text-[15px] font-normal text-[#2d6fdf] font-['Pretendard:Regular',sans-serif]"
                    >
                      항공정보닫기
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center mt-2">
                  <button
                    type="button"
                    onClick={() => setShowFlightDetail(true)}
                    className="text-[13px] text-[#2d6fdf] font-['Pretendard:SemiBold',sans-serif]"
                  >
                    항공정보확인
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 아코디언: 섹션 구분선은 시트 전폭 — 패딩은 트리거·콘텐츠에만 */}
          <Accordion type="multiple" defaultValue={["hotel", "booker", "traveler", "terms", "payment"]} className="w-full">
            <AccordionItem value="hotel" className="w-full border-b border-[#eee]">
              <AccordionTrigger className="group w-full px-4 py-4 text-[18px] font-bold font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:no-underline flex items-center justify-between [&>svg]:hidden">
                <span>이용호텔 및 선택관광</span>
                <span className="flex items-center gap-1 shrink-0">
                  <span className="text-[14px] font-['Pretendard:Medium',sans-serif] text-[#5e2bb8]">선택가능</span>
                  <ChevronDown className="size-4 text-[#111] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 border-0 border-b border-b-[#f0f0f0]">
                {/* 이용호텔 */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] text-[#888]">이용호텔</p>
                    <p className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111] mt-0.5">호텔 예정</p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 w-[60px] h-[30px] px-0 py-0 flex flex-col justify-center items-center rounded-full bg-transparent border border-[#f5f5f5] text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] transition-colors"
                  >
                    상세
                  </button>
                </div>
                {/* 선택관광 */}
                <div className="flex items-center justify-between gap-3 mt-4">
                  <div>
                    <p className="text-[12px] text-[#888]">선택관광</p>
                    <p className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111] mt-0.5">선택관광을 선택하실 수 있습니다.</p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 h-[30px] w-[60px] flex items-center justify-center rounded-full bg-transparent border border-[#f5f5f5] text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] transition-colors"
                  >
                    추가
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="booker" className="w-full border-b border-[#eee]">
              <AccordionTrigger className="group w-full px-4 py-4 text-[18px] font-bold font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:no-underline flex items-center justify-between [&>svg]:hidden">
                <span className="flex items-center gap-2 text-[18px] font-bold">
                  예약자정보
                  <span className="px-1.5 py-0.5 rounded-[8px_8px_8px_0] bg-[#5e2bb8] text-white text-[11px] font-medium">필수</span>
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  <span className="text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#8b6fd4]">{defaultBooker.name}</span>
                  <ChevronDown className="size-4 text-[#111] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-[13px] border-b-8 border-[#f0f0f0]">
                <div className="space-y-2 text-[13px]">
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <span className="shrink-0 text-[#999] font-['Pretendard:Regular',sans-serif]">이름/성별</span>
                    <span className="min-w-0 text-right font-['Pretendard:SemiBold',sans-serif] font-semibold text-[#111]">
                      {defaultBooker.name} / {defaultBooker.gender}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <span className="shrink-0 text-[#999] font-['Pretendard:Regular',sans-serif]">생년월일</span>
                    <span className="min-w-0 text-right font-['Pretendard:SemiBold',sans-serif] font-semibold text-[#111] tabular-nums">
                      {defaultBooker.birthDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <span className="shrink-0 text-[#999] font-['Pretendard:Regular',sans-serif]">휴대폰번호</span>
                    <span className="min-w-0 text-right font-['Pretendard:SemiBold',sans-serif] font-semibold text-[#111] tabular-nums">
                      {defaultBooker.phone}
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="traveler" className="w-full border-b border-[#eee]">
              <AccordionTrigger className="w-full px-4 py-4 font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:no-underline [&>svg]:size-5">
                <span className="flex items-center gap-2 text-[18px] font-bold">
                  여행자정보
                  <span className="px-1.5 py-0.5 rounded-[8px_8px_8px_0] bg-[#5e2bb8] text-white text-[11px] font-medium">필수</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 border-0 border-b-8 border-b-[#f0f0f0]">
                <div className="mb-2">
                  {/* 말풍선: 오른쪽 탭(나중에 입력) 중앙 위에 정렬 — 버튼 영역 overflow-hidden과 분리 */}
                  <div className="grid grid-cols-2 mb-1">
                    <div aria-hidden />
                    <div className="flex justify-center px-0.5">
                      <div className="relative flex flex-col items-center">
                        <div
                          id="traveler-later-hint"
                          className="rounded-full border border-[#5e2bb8] bg-white px-3 py-1.5 text-[12px] font-['Pretendard:Medium',sans-serif] text-[#5e2bb8] shadow-[0_2px_10px_rgba(94,43,184,0.12)] text-center leading-tight"
                        >
                          나중에 입력도 가능해요
                        </div>
                        <div
                          className="absolute left-1/2 top-full -mt-1 -translate-x-1/2 size-2 rotate-45 border-r border-b border-[#5e2bb8] bg-white shadow-[2px_2px_4px_rgba(94,43,184,0.08)]"
                          aria-hidden
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex rounded-[10px] overflow-hidden border border-[#e5e5e5]">
                    <button
                      type="button"
                      onClick={() => setTravelerTab("now")}
                      className={cn(
                        "flex-1 py-2.5 text-[13px] font-['Pretendard:SemiBold',sans-serif] rounded-[10px]",
                        travelerTab === "now"
                          ? "border border-[#5e2bb8] bg-[#f4f0fa] text-[#5e2bb8]"
                          : "border-0 bg-white text-[#666]"
                      )}
                    >
                      지금 입력
                    </button>
                    <button
                      type="button"
                      onClick={() => setTravelerTab("later")}
                      aria-describedby="traveler-later-hint"
                      className={cn(
                        "flex-1 py-2.5 text-[13px] font-['Pretendard:SemiBold',sans-serif] rounded-[10px]",
                        travelerTab === "later"
                          ? "border border-[#5e2bb8] bg-[#f4f0fa] text-[#5e2bb8]"
                          : "border-0 bg-white text-[#666]"
                      )}
                    >
                      나중에 입력
                    </button>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-[#f5f5f5] rounded-[10px]">
                  <p className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111] flex items-center gap-1.5 mb-2">
                    <Info className="size-4 text-[#666] shrink-0" />
                    유의사항
                  </p>
                  <ul className="text-[12px] text-[#666] space-y-1.5 list-disc list-inside">
                    <li>여행자정보는 여권정보를 제외한 간편 예약으로, 해외여행의 경우 &apos;마이페이지 &gt; 예약내역&apos;에서 여권정보를 추가로 입력하셔야 합니다.</li>
                    <li>해외여행의 경우 여권정보 미 입력 시 예약 불가합니다.</li>
                    <li>만 14세 미만 여행자의 경우 약관교부 및 개인정보 이용 동의 확인을 위한 법정대리인(부모)의 연락처(핸드폰번호, 이메일 주소)로 입력해주세요.</li>
                  </ul>
                </div>

                {travelerTab === "now" && (
                  <div className="mt-4 space-y-3">
                    <div className="flex w-full items-center flex-nowrap gap-2 min-w-0">
                      <p className="text-[16px] font-semibold font-['Pretendard:SemiBold',sans-serif] text-[#111] min-w-0 truncate shrink-0">
                        성인 1
                      </p>
                      <label className="flex flex-wrap items-center gap-2 cursor-pointer text-[13px] text-[#111] shrink-0">
                        <input
                          type="checkbox"
                          checked={sameAsBooker}
                          onChange={(e) => setSameAsBooker(e.target.checked)}
                          className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                        />
                        <span>예약자와 동일</span>
                      </label>
                      <button
                        type="button"
                        className="ml-auto flex justify-end items-center gap-1 px-0 py-1.5 rounded-[8px] border-0 text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:bg-[#f9f9f9] shrink-0"
                        aria-label="MY 여행자 수첩 열기"
                      >
                        <User
                          className="size-4 shrink-0 border border-[#5e2bb8] rounded p-0.5"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                        <span className="underline">MY 여행자 수첩</span>
                        <Info className="size-4 shrink-0 text-[#999]" aria-hidden />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="text"
                          placeholder="한글 이름"
                          aria-label="한글 이름"
                          defaultValue={sameAsBooker ? defaultBooker.name : undefined}
                          className="flex-1 min-w-0 border border-[#e5e5e5] rounded-[8px] px-3 py-2.5 text-[14px]"
                        />
                        <div className="flex gap-0 shrink-0">
                          <button
                            type="button"
                            onClick={() => setTravelerGender("남")}
                            aria-label="성별 남"
                            aria-pressed={travelerGender === "남"}
                            className={cn(
                              "w-[76px] py-2.5 rounded-l-[8px] rounded-r-none text-[14px] font-medium border",
                              travelerGender === "남" ? "bg-[#7b3ff2] text-white border-[#7b3ff2]" : "bg-white text-[#666] border-[#e5e5e5]"
                            )}
                          >
                            남
                          </button>
                          <button
                            type="button"
                            onClick={() => setTravelerGender("여")}
                            aria-label="성별 여"
                            aria-pressed={travelerGender === "여"}
                            className={cn(
                              "w-[76px] py-2.5 rounded-r-[8px] rounded-l-none -ml-px text-[14px] font-medium border",
                              travelerGender === "여" ? "bg-[#7b3ff2] text-white border-[#7b3ff2]" : "bg-white text-[#666] border-[#e5e5e5]"
                            )}
                          >
                            여
                          </button>
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="법정 생년월일"
                          aria-label="법정 생년월일"
                          defaultValue={sameAsBooker ? defaultBooker.birthDate : undefined}
                          className="w-full border border-[#e5e5e5] rounded-[8px] px-3 py-2.5 text-[14px]"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="휴대폰 번호"
                          aria-label="휴대폰 번호"
                          defaultValue={sameAsBooker ? defaultBooker.phone : undefined}
                          className="w-full border border-[#e5e5e5] rounded-[8px] px-3 py-2.5 text-[14px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="terms" className="w-full border-b border-[#eee]">
              <AccordionTrigger className="group w-full px-4 py-4 text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:no-underline flex items-center justify-between [&>svg]:hidden">
                <span className="flex items-center gap-2 text-[18px] font-bold">
                  약관 및 개인정보 동의
                  <span className="px-1.5 py-0.5 rounded-[8px_8px_8px_0] bg-[#5e2bb8] text-white text-[11px] font-medium">필수</span>
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  <span className={cn(
                    "text-[14px] font-['Pretendard:Medium',sans-serif]",
                    allRequiredAgreed ? "text-[#3780ff]" : "text-[#999]"
                  )}>
                    {allRequiredAgreed ? "동의" : "미동의"}
                  </span>
                  <ChevronDown className="size-4 text-[#111] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 border-b border-[#f0f0f0]">
                <label className="flex items-center gap-2 mb-3 p-3 bg-white rounded-[10px] cursor-pointer shadow-[0px_0px_7px_0px_rgba(0,0,0,0.15)]">
                  <input
                    type="checkbox"
                    checked={agreeAll}
                    onChange={(e) => handleAgreeAll(e.target.checked)}
                    className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                  />
                  <span className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">
                    전체 동의
                  </span>
                </label>
                <div className="space-y-2 text-[13px] pl-3">
                  <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                    <input
                      type="checkbox"
                      checked={agreeOverseasTravel}
                      onChange={(e) => setAgreeOverseasTravel(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span className="text-[13px]">(필수) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[13px] font-normal text-[#3780ff] underline">국외여행 표준약관 동의</button></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span className="text-[13px]">(필수) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[13px] text-[#3780ff] underline">개인정보 수집 및 이용 동의</button></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                    <input
                      type="checkbox"
                      checked={agreeUniqueId}
                      onChange={(e) => setAgreeUniqueId(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span className="text-[13px]">(필수) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[13px] text-[#3780ff] underline">고유식별정보 수집 및 처리 동의</button></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                    <input
                      type="checkbox"
                      checked={agreeThirdParty}
                      onChange={(e) => setAgreeThirdParty(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span className="text-[13px]">(필수) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[13px] text-[#3780ff] underline">개인정보 제3자 제공 동의</button></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                    <input
                      type="checkbox"
                      checked={agreeSensitive}
                      onChange={(e) => setAgreeSensitive(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span className="text-[13px]">(필수) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[13px] text-[#3780ff] underline">민감정보 수집 및 이용 동의</button></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                    <input
                      type="checkbox"
                      checked={agreeLocation}
                      onChange={(e) => setAgreeLocation(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span className="text-[13px]">(선택) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[13px] text-[#3780ff] underline">위치정보 이용약관 동의</button></span>
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment" className="w-full border-b border-[#eee]">
              <AccordionTrigger className="group w-full px-4 py-4 text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:no-underline flex items-center justify-between [&>svg]:hidden">
                <span className="text-[18px] font-bold">결제상세 내역</span>
                <ChevronDown className="size-4 text-[#111] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-[13px]">
                <div className="flex justify-between font-['Pretendard:SemiBold',sans-serif] text-[15px] font-semibold text-[#111]">
                  <span>총 상품금액</span>
                  <span>{grossTotal.toLocaleString()}원</span>
                </div>
                <div className="mt-2 space-y-1 text-[#666]">
                  <div className="flex justify-between">
                    <span>ㄴ 상품금액</span>
                    <span>{grossTotal.toLocaleString()} 원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ㄴ 즉시할인금액</span>
                    <span className="text-[#666]">-{discountAmount.toLocaleString()} 원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ㄴ 쿠폰할인</span>
                    <span className="text-[#c62828]">-{couponDiscount.toLocaleString()} 원</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-[#ddd] my-3" />
                <div className="text-right">
                  <div className="inline-block px-2.5 py-1 rounded-md bg-[#fff5f5] border border-[#ffdddd] text-[12px] text-[#666] mb-1">
                    회원 즉시 할인 적용가
                  </div>
                  <div className="flex items-center justify-between gap-2 min-w-0 mb-1">
                    <div className="font-['Pretendard:SemiBold',sans-serif] text-[#111] text-left text-[18px] font-semibold shrink-0">
                      최종 결제금액
                    </div>
                    <p className="font-['Pretendard:Bold',sans-serif] text-[22px] font-bold text-[#5e2bb8] m-0 whitespace-nowrap text-right min-w-0">
                      {finalPrice.toLocaleString()}원
                    </p>
                  </div>
                  <p className="text-[11px] text-[#999] mt-2">
                    유류할증료 & 제세공과금 포함
                  </p>
                  <p className="text-[11px] text-[#999]">
                    하나투어 마일리지 <span className="text-[#c62828] font-medium">적립 불가</span> 상품입니다
                  </p>
                  <p className="text-[11px] text-[#999] mt-2 flex items-center justify-end gap-1">
                    <Info className="size-3.5 shrink-0" />
                    쿠폰할인은 기본 상품금액 기준으로 계산
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8 bg-white pt-2">
            <PackageServiceFooter />
          </div>

          {showScrollTop && (
            <button
              type="button"
              onClick={() =>
                document.querySelector("[data-package-booking-scroll]")?.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="fixed right-4 bottom-28 z-[1] flex size-9 items-center justify-center rounded-full bg-[#333] text-white shadow"
            >
              <ChevronUp className="size-5" />
            </button>
          )}
        </div>

        {/* 하단: 결제 CTA (본문·푸터와 분리, flex 고정 높이만 사용) */}
        <div className="flex shrink-0 gap-3 border-t border-[#eee] bg-white px-4 py-2.5">
            <button
              type="button"
              onClick={handlePayDeposit}
              disabled={!allRequiredAgreed}
              className="flex flex-1 flex-col items-center justify-center gap-0 rounded-[32px] border border-[#ddd] bg-white py-2 text-[#111] transition-colors hover:bg-[#f9f9f9] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-[11px] font-['Pretendard:Medium',sans-serif] leading-tight text-[#111]">계약금 결제</span>
              <span className="text-[14px] font-['Pretendard:Bold',sans-serif] leading-tight text-[#111]">{DEPOSIT_AMOUNT.toLocaleString()}원</span>
            </button>
            <button
              type="button"
              onClick={handlePayFull}
              disabled={!allRequiredAgreed}
              className="flex flex-1 flex-col items-center justify-center gap-0 rounded-[30px] bg-[#5e2bb8] py-2 font-['Pretendard:SemiBold',sans-serif] text-white transition-colors hover:bg-[#4a2299] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-[11px] font-['Pretendard:Medium',sans-serif] leading-tight text-white">전액 결제</span>
              <span className="text-[14px] font-['Pretendard:Bold',sans-serif] leading-tight text-white">{finalPrice.toLocaleString()}원</span>
            </button>
        </div>
      </motion.div>
    </div>
  );
}
