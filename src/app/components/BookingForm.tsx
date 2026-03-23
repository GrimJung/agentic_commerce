import { useState } from "react";
import { motion } from "motion/react";
import { X, Plus, User, Clock, Info, Building2 } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { NamemdaeComboStepper } from "./NamemdaeComboStepper";

/** 이미지 URL 없거나 로드 실패 시 사용할 플레이스홀더 (만료 없는 data URI) */
const DEFAULT_HOTEL_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect fill='%23e5e5e5' width='120' height='120'/%3E%3Cpath fill='%23999' d='M60 32L28 52v36h64V52L60 32zm0 8l24 16v24H36V56l24-16z'/%3E%3C/svg%3E";

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  passportNumber: string;
  travelers: number;
  agreeTerms: boolean;
  agreeCancellation: boolean;
}

/** 호텔 예약 시 추가 표시용 데이터 (선택) */
export interface HotelBookingInfo {
  hotelName: string;
  hotelLocation: string;
  hotelImage?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomTypeLabel: string;
  totalAmount: number;
  freeCancellationText?: string;
}

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  onCancel: () => void;
  packageTitle: string;
  hotelInfo?: HotelBookingInfo;
  /** true면 항공+호텔 FIT 조합 예약 플로우 (뒤로가기 제거, 타이틀 변경, 단계 표시) */
  isFitCombo?: boolean;
}

interface Traveler {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  hasCompleteInfo: boolean;
}

const savedTravelers: Traveler[] = [
  { id: "1", name: "김하나", birthDate: "1990.12.25", gender: "여", hasCompleteInfo: false },
  { id: "2", name: "김두리", birthDate: "1988.05.12", gender: "남", hasCompleteInfo: false },
];

const REQUEST_OPTIONS = [
  { id: "double", label: "더블베드", checked: true },
  { id: "nonsmoking", label: "금연객실", checked: true },
  { id: "highfloor", label: "고층", checked: true },
  { id: "amenity", label: "어메니티 추가", checked: false },
  { id: "extrabed", label: "추가 베드", checked: false },
  { id: "crib", label: "유아침대", checked: false },
];

const TERM_ITEMS = [
  "(필수) 예약 취소 및 환불 정책 안내 동의",
  "(필수) 예약 주의사항 동의",
  "(필수) 개인정보 수집 및 이용에 대한 동의",
  "(필수) 개인정보 제3자 제공에 대한 동의",
  "(필수) 개인정보 국외 이전 동의에 대한 동의",
];

export function BookingForm({
  onSubmit,
  onCancel,
  packageTitle,
  hotelInfo,
  isFitCombo = false,
}: BookingFormProps) {
  useLockBodyScroll();
  const [selectedTravelers, setSelectedTravelers] = useState<string[]>([]);
  const [agreeAllTerms, setAgreeAllTerms] = useState(true);
  const [requestChecks, setRequestChecks] = useState<Record<string, boolean>>(
    Object.fromEntries(REQUEST_OPTIONS.map((o) => [o.id, o.checked]))
  );
  const [lateCheckOutHour, setLateCheckOutHour] = useState("00");
  const [lateCheckOutMin, setLateCheckOutMin] = useState("00");
  const [gender1, setGender1] = useState<"male" | "female">(isFitCombo ? "male" : "female");
  const [gender2, setGender2] = useState<"male" | "female">("female");
  const [guest1LastNameEn, setGuest1LastNameEn] = useState(isFitCombo ? "HONG" : "");
  const [guest1FirstNameEn, setGuest1FirstNameEn] = useState(isFitCombo ? "GILDONG" : "");
  const [guest1Birth, setGuest1Birth] = useState(isFitCombo ? "1990.01.01" : "1990.01.01");
  const [guest1Phone, setGuest1Phone] = useState(isFitCombo ? "010-1234-5678" : "010-1234-5678");
  const [guest1Email, setGuest1Email] = useState(isFitCombo ? "hana@hanatour.com" : "hana@hanatour.com");
  const [sameAsPassenger, setSameAsPassenger] = useState(isFitCombo);
  const [guest2LastNameEn, setGuest2LastNameEn] = useState(isFitCombo ? "KIM" : "");
  const [guest2FirstNameEn, setGuest2FirstNameEn] = useState(isFitCombo ? "HANA" : "");
  const [guest2Birth, setGuest2Birth] = useState(isFitCombo ? "1992.05.15" : "");
  const [hotelImageError, setHotelImageError] = useState(false);

  const handleSameAsPassenger = (checked: boolean) => {
    setSameAsPassenger(checked);
    if (checked) {
      setGuest1LastNameEn("HONG");
      setGuest1FirstNameEn("GILDONG");
      setGuest1Birth("1990.01.01");
      setGuest1Phone("010-1234-5678");
      setGuest1Email("hana@hanatour.com");
      setGender1("male");
      setGuest2LastNameEn("KIM");
      setGuest2FirstNameEn("HANA");
      setGuest2Birth("1992.05.15");
      setGender2("female");
    }
  };

  const handleTravelerToggle = (travelerId: string) => {
    setSelectedTravelers((prev) =>
      prev.includes(travelerId) ? prev.filter((id) => id !== travelerId) : [...prev, travelerId]
    );
  };

  const handleRequestToggle = (id: string) => {
    setRequestChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const buildHotelBookingData = (): BookingFormData => ({
    name: `${guest1LastNameEn} ${guest1FirstNameEn}`.trim() || "HONG GILDONG",
    phone: guest1Phone,
    email: guest1Email,
    birthDate: guest1Birth.replace(/\./g, "-"),
    passportNumber: "",
    travelers: 1,
    agreeTerms: agreeAllTerms,
    agreeCancellation: true,
  });

  const handleSubmit = () => {
    if (isHotel) {
      onSubmit(buildHotelBookingData());
      return;
    }
    if (selectedTravelers.length > 0) {
      const firstTraveler = savedTravelers.find((t) => t.id === selectedTravelers[0]);
      onSubmit({
        name: firstTraveler?.name || "",
        phone: "010-1234-5678",
        email: "ungedth1@agral.com",
        birthDate: firstTraveler?.birthDate.replace(/\./g, "-") || "",
        passportNumber: "",
        travelers: selectedTravelers.length,
        agreeTerms: agreeAllTerms,
        agreeCancellation: true,
      });
    }
  };

  const isHotel = !!hotelInfo;
  const totalAmount = hotelInfo?.totalAmount ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-[24px] flex flex-col pb-24"
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] z-10 shrink-0">
          <div className="px-4 py-3 flex items-center gap-2">
            {isHotel ? (
              <>
                <h1 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111] flex-1">
                  {isFitCombo ? "호텔 예약하기" : "예약하기"}
                </h1>
                <button type="button" onClick={onCancel} className="p-2 -mr-1 rounded-full hover:bg-[#f5f5f5]" aria-label="닫기">
                  <X className="size-5 text-[#111]" />
                </button>
              </>
            ) : (
              <>
                <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111] flex-1">
                  예약 정보 입력
                </h2>
                <button onClick={onCancel} className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors">
                  <X className="size-5" />
                </button>
              </>
            )}
          </div>
          {isFitCombo && (
            <div className="border-t border-[#f0f0f0]">
              <NamemdaeComboStepper activeStep={2} />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isHotel && hotelInfo ? (
            <div className="px-5 py-4 space-y-6 pb-24">
              {/* 호텔 정보 */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-[60px] h-[60px] rounded-[10px] bg-[#eee] overflow-hidden shrink-0 flex items-center justify-center">
                    {hotelImageError ? (
                      <Building2 className="size-7 text-[#999]" aria-hidden />
                    ) : (
                      <img
                        src={hotelInfo.hotelImage || DEFAULT_HOTEL_IMAGE_PLACEHOLDER}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={() => setHotelImageError(true)}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] leading-tight">
                      {hotelInfo.hotelName}
                    </p>
                    <p className="text-[13px] text-[#666] mt-1">{hotelInfo.hotelLocation}</p>
                    <p className="text-[13px] text-[#888] mt-0.5">{hotelInfo.nights}박</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full border-t border-[#eee] pt-3">
                  <div>
                    <span className="text-[11px] text-[#999]">체크인</span>
                    <div className="text-[13px] text-[#111]">{hotelInfo.checkIn}</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#999]">체크아웃</span>
                    <div className="text-[13px] text-[#111]">{hotelInfo.checkOut}</div>
                  </div>
                </div>
                <div className="border-t border-[#eee] pt-3 w-full">
                  <p className="text-[13px] text-[#666] mt-0">
                    객실1정보: {hotelInfo.roomTypeLabel}
                  </p>
                </div>
              </div>

              {/* 정보입력 - 투숙자 */}
              <section className="border-t border-[#eee] pt-4">
                <h2 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] mb-3">
                  정보입력
                </h2>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">
                    투숙자정보
                  </h3>
                  {isFitCombo && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPassenger}
                        onChange={(e) => handleSameAsPassenger(e.target.checked)}
                        className="rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]"
                      />
                      <span className="text-[13px] text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">항공 탑승객과 동일</span>
                    </label>
                  )}
                </div>
                <h4 className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif] mb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#7b3ff2] text-white text-[12px]">객실1</span>
                    <span className="text-[14px] text-[#111]">성인1</span>
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-0 py-1.5 rounded-[8px] border-0 text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:bg-[#f9f9f9] underline shrink-0"
                  >
                    <User className="size-4 border border-[#ddd] rounded p-0.5" strokeWidth={1.5} />
                    MY 여행자수첩
                    <Info className="size-4 text-[#999]" />
                  </button>
                </h4>
                <div className="space-y-3 text-[14px]">
                  <input
                    type="text"
                    placeholder="영문 성 (ex. HONG)"
                    value={guest1LastNameEn}
                    onChange={(e) => setGuest1LastNameEn(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-[8px] text-[#111] placeholder:text-[#999]"
                  />
                  <input
                    type="text"
                    placeholder="영문 이름 (ex. GILDONG)"
                    value={guest1FirstNameEn}
                    onChange={(e) => setGuest1FirstNameEn(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-[8px] text-[#111] placeholder:text-[#999]"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      placeholder="생년월일 (YYYY.MM.DD)"
                      value={guest1Birth}
                      onChange={(e) => setGuest1Birth(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2.5 border border-[#e5e5e5] rounded-[8px] text-[#111] placeholder:text-[#999]"
                    />
                    <div className="flex rounded-[8px] border border-[#eee] overflow-hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => setGender1("male")}
                        className={`flex-1 py-2 px-3 text-[13px] border-r border-[#eee] rounded-l-[8px] ${gender1 === "male" ? "border-2 border-[#111] -ml-px font-['Pretendard:SemiBold',sans-serif] text-[#111]" : "border-transparent text-[#999]"}`}
                      >
                        남
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender1("female")}
                        className={`flex-1 py-2 px-3 text-[13px] rounded-r-[8px] border-l-0 ${gender1 === "female" ? "border border-[#111] -mr-px font-['Pretendard:SemiBold',sans-serif] text-[#111]" : "border-transparent text-[#999]"}`}
                      >
                        여
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="010-XXXX-XXXX"
                    value={guest1Phone}
                    onChange={(e) => setGuest1Phone(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-[8px] text-[#111] placeholder:text-[#999]"
                  />
                  <input
                    type="text"
                    placeholder="ungedth1@agral.com"
                    value={guest1Email}
                    onChange={(e) => setGuest1Email(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-[8px] text-[#111] placeholder:text-[#999]"
                  />
                </div>

                <h4 className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif] mt-5 mb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#7b3ff2] text-white text-[12px]">객실1</span>
                    <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">성인2</span>
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-0 py-1.5 rounded-[8px] border-0 text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:bg-[#f9f9f9] underline shrink-0"
                  >
                    <User className="size-4 border border-[#ddd] rounded p-0.5" strokeWidth={1.5} />
                    MY 여행자 수첩
                    <Info className="size-4 text-[#999]" />
                  </button>
                </h4>
                <div className="space-y-3 text-[14px]">
                  <input
                    type="text"
                    placeholder="영문 성 (ex. KIM)"
                    value={guest2LastNameEn}
                    onChange={(e) => setGuest2LastNameEn(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-[8px] text-[#111] placeholder:text-[#999]"
                  />
                  <input
                    type="text"
                    placeholder="영문 이름 (ex. HANA)"
                    value={guest2FirstNameEn}
                    onChange={(e) => setGuest2FirstNameEn(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-[8px] text-[#111] placeholder:text-[#999]"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      placeholder="생년월일 (YYYY.MM.DD)"
                      value={guest2Birth}
                      onChange={(e) => setGuest2Birth(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2.5 border border-[#e5e5e5] rounded-[8px] text-[#111] placeholder:text-[#999]"
                    />
                    <div className="flex rounded-[8px] border border-[#eee] overflow-hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => setGender2("male")}
                        className={`flex-1 py-2 px-3 text-[13px] border-r border-[#eee] rounded-l-[8px] ${gender2 === "male" ? "border-2 border-[#111] -ml-px font-['Pretendard:SemiBold',sans-serif] text-[#111]" : "border-transparent text-[#999]"}`}
                      >
                        남
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender2("female")}
                        className={`flex-1 py-2 px-3 text-[13px] rounded-r-[8px] border-l-0 ${gender2 === "female" ? "border border-[#111] -mr-px font-['Pretendard:SemiBold',sans-serif] text-[#111]" : "border-transparent text-[#999]"}`}
                      >
                        여
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 요청사항 */}
              <section className="border-t border-[#eee] pt-4">
                <h2 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] mb-3">
                  요청사항
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {REQUEST_OPTIONS.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requestChecks[opt.id] ?? false}
                        onChange={() => handleRequestToggle(opt.id)}
                        className="rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]"
                      />
                      <span className="text-[13px] text-[#111]">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[13px] text-[#111]">늦은 체크아웃</span>
                  <input
                    type="text"
                    value={lateCheckOutHour}
                    onChange={(e) => setLateCheckOutHour(e.target.value)}
                    className="w-12 px-2 py-1.5 border border-[#e5e5e5] rounded-[8px] text-center text-[13px]"
                  />
                  <span className="text-[13px] text-[#666]">시</span>
                  <input
                    type="text"
                    value={lateCheckOutMin}
                    onChange={(e) => setLateCheckOutMin(e.target.value)}
                    className="w-12 px-2 py-1.5 border border-[#e5e5e5] rounded-[8px] text-center text-[13px]"
                  />
                  <span className="text-[13px] text-[#666]">분</span>
                </div>
                <p className="text-[12px] text-[#666] mt-2 leading-[1.5]">
                  *체크인 당일 호텔 사정에 따라 적용 여부 확인이 가능하며, 선택하신 객실 조건에 따라 요청 불가할 수 있습니다.
                </p>
              </section>

              {/* 약관 및 개인정보 동의 */}
              <section className="border-t border-[#eee] pt-4">
                <h2 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] mb-3">
                  약관 및 개인정보 동의
                </h2>
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={agreeAllTerms}
                    onChange={(e) => setAgreeAllTerms(e.target.checked)}
                    className="rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]"
                  />
                  <span className="text-[14px] text-[#111] font-['Pretendard:SemiBold',sans-serif]">필수 약관 전체 동의</span>
                </label>
                <ul className="space-y-2">
                  {TERM_ITEMS.map((text, i) => (
                    <li key={i}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-[#ddd] text-[#7b3ff2]" />
                        <span className="text-[13px] text-[#2d6fdf] underline">{text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 결제 상세 내역 */}
              <section className="border-t border-[#eee] pt-4">
                <h2 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] mb-3">
                  결제 상세 내역
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#666]">총 상품 금액</span>
                  <span className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#7b3ff2]">
                    {totalAmount.toLocaleString()}원
                  </span>
                </div>
                <p className="text-[13px] text-[#999] mt-0.5">₩{totalAmount.toLocaleString()}</p>
              </section>

              {/* 무료 취소 가능 */}
              {hotelInfo.freeCancellationText && (
                <div className="flex gap-2 p-3 rounded-[10px] bg-[#e8f5e9]">
                  <Clock className="size-5 shrink-0 text-[#2e7d32]" />
                  <div>
                    <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#1b5e20]">무료 취소 가능</p>
                    <p className="text-[13px] text-[#2e7d32] leading-[1.5] mt-0.5">{hotelInfo.freeCancellationText}</p>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-5">
              <div className="bg-[#f5f5f5] rounded-[12px] p-4 mb-6">
                <p className="text-[13px] text-[#666] mb-1">선택 상품</p>
                <p className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">{packageTitle}</p>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">여행자 목록</h3>
                  <span className="text-[14px] text-[#7b3ff2]">총 {savedTravelers.length}건</span>
                </div>
                <div className="space-y-3 mb-4">
                  {savedTravelers.map((traveler) => (
                    <label
                      key={traveler.id}
                      className="flex items-start gap-3 p-4 bg-white border-2 border-[#e5e7eb] rounded-[12px] cursor-pointer hover:border-[#7b3ff2] transition-colors"
                      style={{
                        borderColor: selectedTravelers.includes(traveler.id) ? "#7b3ff2" : "#e5e7eb",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTravelers.includes(traveler.id)}
                        onChange={() => handleTravelerToggle(traveler.id)}
                        className="mt-1 size-5 rounded border-[#ddd] text-[#7b3ff2] focus:ring-[#7b3ff2]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">{traveler.name}</span>
                          <span className="px-2 py-0.5 bg-[#e9e5fb] text-[#7b3ff2] text-[11px] rounded-[4px]">나이정보</span>
                        </div>
                        <p className="text-[13px] text-[#666] mb-1">
                          등록 정보 없음 | {traveler.birthDate} | {traveler.gender}
                        </p>
                        {!traveler.hasCompleteInfo && (
                          <p className="text-[13px] text-[#ff6b6b]">여권 정보 등록 필요함</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  className="w-full py-4 border-2 border-[#e5e7eb] rounded-[12px] flex items-center justify-center gap-2 text-[15px] text-[#111] font-['Pretendard:SemiBold',sans-serif] hover:border-[#7b3ff2] hover:text-[#7b3ff2] transition-colors"
                >
                  <Plus className="size-5" />
                  새로운 여행자 등록하기
                </button>
              </div>
            </div>
          )}
        </div>

        {isHotel && hotelInfo ? (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] ">
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-[#7b3ff2] text-white rounded-[12px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#6930d9] transition-colors"
            >
              {totalAmount.toLocaleString()}원 결제하기
            </button>
          </div>
        ) : !isHotel && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] p-5 ">
            <button
              onClick={handleSubmit}
              disabled={selectedTravelers.length === 0}
              className="w-full py-4 bg-[#7b3ff2] text-white rounded-[12px] text-[16px] font-['Pretendard:Bold',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              {selectedTravelers.length > 0 ? `${selectedTravelers.length}명 선택 완료 결제 진행하기` : "여행자를 선택해주세요"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
