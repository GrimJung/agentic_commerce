import { useState } from "react";
import { motion } from "motion/react";
import { ChevronUp, ChevronDown, X, Info } from "lucide-react";
import { PackageData } from "./PackageCard";
import type { BookingFormData } from "./BookingForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn } from "./ui/utils";

const DEPOSIT_AMOUNT = 100_000;

interface PackageBookingSheetProps {
  package: PackageData;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
  /** 예약금/총액 버튼 클릭 시 결제하기 화면으로 이동할 때 호출 (금액 전달) */
  onRequestPayment: (amount: number) => void;
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
}: PackageBookingSheetProps) {
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
  const [showFlightDetail, setShowFlightDetail] = useState(false);

  const endDate = parseEndDate(pkg.departure, pkg.duration);
  const totalPrice = pkg.price;
  const discountAmount = Math.min(Math.floor(totalPrice * 0.05), 50000);
  const finalPrice = totalPrice - discountAmount;

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
        className="bg-white w-full max-h-[90vh] flex flex-col rounded-t-[24px]"
      >
        {/* 헤더: 예약하기 타이틀 + 우측 닫기 */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#eee]">
          <h1 className="font-['Pretendard:SemiBold',sans-serif] text-[18px] text-[#111]">
            예약하기
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-1 hover:bg-[#f5f5f5] rounded-full transition-colors"
            aria-label="닫기"
          >
            <X className="size-5 text-[#111]" />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto pb-32"
          onScroll={(e) => {
            const el = e.currentTarget;
            setShowScrollTop(el.scrollTop > 400);
          }}
        >
          {/* 상품 요약 (캡처 화면 기준) */}
          <div className="p-4 border-b border-[#f0f0f0]">
            {/* 패키지 제목 + 해시태그 + 썸네일 */}
            <div className="flex gap-2 items-center min-h-[72px]">
              <div className="flex-1 min-w-0 flex items-center">
                <p className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] leading-snug line-clamp-2">
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
              <span className="text-[#333] ml-1.5">성인 1</span>
            </div>

            {/* 출발일 · 기간 · 도착일 카드 */}
            <div className="mt-3 rounded-[12px] border border-[#eee] bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-center flex-1 min-w-0">
                  <p className="text-[11px] text-[#888] mb-1">출발일</p>
                  <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
                    {formatDepartureDisplay(pkg.departure)}
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-[#7b3ff2] text-white text-[13px] font-['Pretendard:SemiBold',sans-serif] shrink-0">
                  {formatDurationBadge(pkg.duration)}
                </span>
                <div className="text-center flex-1 min-w-0">
                  <p className="text-[11px] text-[#888] mb-1">도착일</p>
                  <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">
                    {endDate}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-dashed border-[#ddd]" />

              {showFlightDetail ? (
                <>
                  {/* 항공 상세: 항공 정보 / 항공 출발 / 항공 도착 */}
                  <div className="mt-3 space-y-2.5 text-[13px]">
                    <div className="flex gap-3">
                      <span className="text-[#888] shrink-0 w-[72px]">항공 정보</span>
                      <div>
                        <p className="text-[#111] font-['Pretendard:SemiBold',sans-serif]">{pkg.airline}</p>
                        <p className="text-[#666] mt-0.5">
                          부산(김해) ⇄ {pkg.destination.split(",")[0]?.trim() ?? pkg.destination}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[#888] shrink-0 w-[72px]">항공 출발</span>
                      <p className="text-[#111]">
                        {formatDepartureDisplay(pkg.departure)} 20:35 | 항공편 ZE0593
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[#888] shrink-0 w-[72px]">항공 도착</span>
                      <p className="text-[#111]">
                        {endDate} 06:55 | 항공편 ZE0594
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-dashed border-[#ddd]" />
                  <div className="flex justify-center mt-2">
                    <button
                      type="button"
                      onClick={() => setShowFlightDetail(false)}
                      className="text-[13px] text-[#2d6fdf] font-['Pretendard:SemiBold',sans-serif] underline"
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
                    className="text-[13px] text-[#2d6fdf] font-['Pretendard:SemiBold',sans-serif] underline"
                  >
                    항공정보확인
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 아코디언: 이용 호텔 / 예약자 / 동반자 / 약관 / 결제상세 */}
          <Accordion type="multiple" defaultValue={["hotel", "booker", "traveler", "terms", "payment"]} className="px-4">
            <AccordionItem value="hotel" className="border-b border-[#eee]">
              <AccordionTrigger className="group py-4 text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:no-underline flex items-center justify-between w-full [&>svg]:hidden">
                <span>이용호텔 및 선택관광</span>
                <span className="flex items-center gap-1 shrink-0">
                  <span className="text-[14px] font-['Pretendard:Medium',sans-serif] text-[#666]">선택가능</span>
                  <ChevronDown className="size-4 text-[#111] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {/* 이용호텔 */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] text-[#888]">이용호텔</p>
                    <p className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111] mt-0.5">호텔 예정</p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 px-3 py-1.5 rounded-full bg-[#f0f0f0] text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] hover:bg-[#e8e8e8] transition-colors"
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
                    className="shrink-0 px-3 py-1.5 rounded-full bg-[#f0f0f0] text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] hover:bg-[#e8e8e8] transition-colors"
                  >
                    추가
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="booker" className="border-b border-[#eee]">
              <AccordionTrigger className="group py-4 text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:no-underline flex items-center justify-between w-full [&>svg]:hidden">
                <span className="flex items-center gap-2">
                  예약자 정보
                  <span className="px-1.5 py-0.5 rounded bg-[#7b3ff2] text-white text-[11px] font-medium">필수</span>
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  <span className="text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#8b6fd4]">{defaultBooker.name}</span>
                  <ChevronDown className="size-4 text-[#111] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-[13px] text-[#333]">
                <p>이름/성별: {defaultBooker.name}/{defaultBooker.gender}</p>
                <p className="mt-1">생년월일: {defaultBooker.birthDate}</p>
                <p className="mt-1">휴대폰번호: {defaultBooker.phone}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="traveler" className="border-b border-[#eee]">
              <AccordionTrigger className="py-4 text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:no-underline [&>svg]:size-5">
                <span className="flex items-center gap-2">
                  여행자 정보
                  <span className="px-1.5 py-0.5 rounded bg-[#7b3ff2] text-white text-[11px] font-medium">필수</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[12px] text-[#666] mb-2">나중에 입력도 가능해요</p>
                <div className="flex rounded-[10px] overflow-hidden border border-[#e5e5e5]">
                  <button
                    type="button"
                    onClick={() => setTravelerTab("now")}
                    className={cn(
                      "flex-1 py-2.5 text-[13px] font-['Pretendard:SemiBold',sans-serif]",
                      travelerTab === "now"
                        ? "bg-[#7b3ff2] text-white"
                        : "bg-white text-[#666]"
                    )}
                  >
                    지금 입력
                  </button>
                  <button
                    type="button"
                    onClick={() => setTravelerTab("later")}
                    className={cn(
                      "flex-1 py-2.5 text-[13px] font-['Pretendard:SemiBold',sans-serif]",
                      travelerTab === "later"
                        ? "bg-[#7b3ff2] text-white"
                        : "bg-white text-[#666]"
                    )}
                  >
                    나중에 입력
                  </button>
                </div>

                <div className="mt-3 p-3 bg-[#f5f5f5] rounded-[10px]">
                  <p className="text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111] flex items-center gap-1.5 mb-2">
                    <Info className="size-4 text-[#666] shrink-0" />
                    ① 유의사항
                  </p>
                  <ul className="text-[12px] text-[#666] space-y-1.5 list-disc list-inside">
                    <li>여행자정보는 여권정보를 제외한 간편 예약으로, 해외여행의 경우 &apos;마이페이지 &gt; 예약내역&apos;에서 여권정보를 추가로 입력하셔야 합니다.</li>
                    <li>해외여행의 경우 여권정보 미 입력 시 예약 불가합니다.</li>
                    <li>만 14세 미만 여행자의 경우 약관교부 및 개인정보 이용 동의 확인을 위한 법정대리인(부모)의 연락처(핸드폰번호, 이메일 주소)로 입력해주세요.</li>
                  </ul>
                </div>

                {travelerTab === "now" && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">
                        성인 1
                      </p>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#111]">
                        <input
                          type="checkbox"
                          checked={sameAsBooker}
                          onChange={(e) => setSameAsBooker(e.target.checked)}
                          className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                        />
                        <span>예약자와 동일</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-[#7b3ff2]">
                      <button type="button" className="flex items-center gap-1">
                        MY 여행자수첩
                        <Info className="size-3.5 text-[#999]" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[12px] text-[#666] mb-1">한글 이름</label>
                        <input
                          type="text"
                          placeholder="한글 이름"
                          defaultValue={sameAsBooker ? defaultBooker.name : undefined}
                          className="w-full border border-[#e5e5e5] rounded-[8px] px-3 py-2.5 text-[14px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] text-[#666] mb-1.5">성별</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setTravelerGender("남")}
                            className={cn(
                              "flex-1 py-2.5 rounded-[8px] text-[14px] font-medium border",
                              travelerGender === "남" ? "bg-[#7b3ff2] text-white border-[#7b3ff2]" : "bg-white text-[#666] border-[#e5e5e5]"
                            )}
                          >
                            남
                          </button>
                          <button
                            type="button"
                            onClick={() => setTravelerGender("여")}
                            className={cn(
                              "flex-1 py-2.5 rounded-[8px] text-[14px] font-medium border",
                              travelerGender === "여" ? "bg-[#7b3ff2] text-white border-[#7b3ff2]" : "bg-white text-[#666] border-[#e5e5e5]"
                            )}
                          >
                            여
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[12px] text-[#666] mb-1">법정 생년월일</label>
                        <input
                          type="text"
                          placeholder="법정 생년월일"
                          defaultValue={sameAsBooker ? defaultBooker.birthDate : undefined}
                          className="w-full border border-[#e5e5e5] rounded-[8px] px-3 py-2.5 text-[14px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] text-[#666] mb-1">휴대폰 번호</label>
                        <input
                          type="text"
                          placeholder="휴대폰 번호"
                          defaultValue={sameAsBooker ? defaultBooker.phone : undefined}
                          className="w-full border border-[#e5e5e5] rounded-[8px] px-3 py-2.5 text-[14px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="terms" className="border-b border-[#eee]">
              <AccordionTrigger className="group py-4 text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:no-underline flex items-center justify-between w-full [&>svg]:hidden">
                <span className="flex items-center gap-2">
                  약관 및 개인정보 동의
                  <span className="px-1.5 py-0.5 rounded bg-[#7b3ff2] text-white text-[11px] font-medium">필수</span>
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
              <AccordionContent className="pb-4">
                <label className="flex items-center gap-2 mb-3 p-3 bg-[#f5f5f5] rounded-[10px] cursor-pointer">
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
                <div className="space-y-2 text-[13px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeOverseasTravel}
                      onChange={(e) => setAgreeOverseasTravel(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span>(필수) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[#3780ff] underline">국외여행 표준약관 동의</button></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span>(필수) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[#3780ff] underline">개인정보 수집 및 이용 동의</button></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeUniqueId}
                      onChange={(e) => setAgreeUniqueId(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span>(필수) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[#3780ff] underline">고유식별정보 수집 및 처리 동의</button></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeThirdParty}
                      onChange={(e) => setAgreeThirdParty(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span>(필수) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[#3780ff] underline">개인정보 제3자 제공 동의</button></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeSensitive}
                      onChange={(e) => setAgreeSensitive(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span>(필수) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[#3780ff] underline">민감정보 수집 및 이용 동의</button></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeLocation}
                      onChange={(e) => setAgreeLocation(e.target.checked)}
                      className="size-4 rounded border-[#ddd] text-[#7b3ff2]"
                    />
                    <span>(선택) <button type="button" onClick={(e) => e.stopPropagation()} className="text-[#3780ff] underline">위치정보 이용약관 동의</button></span>
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment" className="border-b border-[#eee]">
              <AccordionTrigger className="group py-4 text-[15px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:no-underline flex items-center justify-between w-full [&>svg]:hidden">
                <span>결제상세 내역</span>
                <span className="flex items-center gap-1 shrink-0">
                  <span className="font-['Pretendard:Bold',sans-serif] text-[17px] text-[#7b3ff2]">
                    {finalPrice.toLocaleString()}원
                  </span>
                  <ChevronDown className="size-4 text-[#111] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-[13px]">
                <div className="flex justify-between font-['Pretendard:SemiBold',sans-serif] text-[#111]">
                  <span>총 상품금액</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="mt-2 pl-3 space-y-1 text-[#666]">
                  <div className="flex justify-between">
                    <span>ㄴ 상품금액</span>
                    <span>{totalPrice.toLocaleString()} 원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ㄴ 즉시할인금액</span>
                    <span className="text-[#666]">-{discountAmount.toLocaleString()} 원</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-[#ddd] my-3" />
                <div className="text-right">
                  <div className="font-['Pretendard:SemiBold',sans-serif] text-[#111] mb-1">최종 결제금액</div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-[#fff5f5] border border-[#ffdddd] text-[12px] text-[#666] mb-1">
                    회원 즉시 할인 적용가
                  </div>
                  <p className="font-['Pretendard:Bold',sans-serif] text-[22px] text-[#3780ff]">
                    {finalPrice.toLocaleString()}원
                  </p>
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

          {showScrollTop && (
            <button
              type="button"
              onClick={() => document.querySelector(".flex-1.overflow-y-auto")?.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed right-4 bottom-36 w-9 h-9 rounded-full bg-[#333] text-white flex items-center justify-center shadow"
            >
              <ChevronUp className="size-5" />
            </button>
          )}
        </div>

        {/* 하단 고정 버튼: 계약금 결제 / 전액 결제 */}
        <div className="shrink-0 fixed bottom-0 left-0 right-0 bg-white border-t border-[#eee] px-4 py-2.5 flex gap-3">
          <button
            type="button"
            onClick={handlePayDeposit}
            disabled={!allRequiredAgreed}
            className="flex-1 py-2 flex flex-col items-center justify-center gap-0 border border-[#ddd] bg-white text-[#111] rounded-[12px] hover:bg-[#f9f9f9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-[11px] font-['Pretendard:Medium',sans-serif] text-[#111] leading-tight">계약금 결제</span>
            <span className="text-[14px] font-['Pretendard:Bold',sans-serif] text-[#111] leading-tight">{DEPOSIT_AMOUNT.toLocaleString()}원</span>
          </button>
          <button
            type="button"
            onClick={handlePayFull}
            disabled={!allRequiredAgreed}
            className="flex-1 py-2 flex flex-col items-center justify-center gap-0 bg-[#7b3ff2] text-white rounded-[12px] font-['Pretendard:SemiBold',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
          >
            <span className="text-[11px] font-['Pretendard:Medium',sans-serif] text-white leading-tight">전액 결제</span>
            <span className="text-[14px] font-['Pretendard:Bold',sans-serif] text-white leading-tight">{finalPrice.toLocaleString()}원</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
