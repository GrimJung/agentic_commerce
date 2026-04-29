import { useState, useEffect, useMemo, type ComponentProps } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Check,
  User,
  Info,
  HelpCircle,
  CircleAlert,
  X,
} from "lucide-react";
import type { BookingFormData, HotelBookingInfo } from "./BookingForm";
import { NamemdaeComboPaymentContent } from "./NamemdaeComboPaymentContent";
import { NamemdaeHotelReservationContent } from "./NamemdaeHotelReservationContent";
import { FlightData } from "./FlightCard";
import { NamemdaeComboStepper } from "./NamemdaeComboStepper";
import { MyTravelerNotebookModal } from "./MyTravelerNotebookModal";

function RequiredBadge() {
  return (
    <span className="shrink-0 px-2 py-0.5 rounded-[4px] bg-[#6329C4] text-white text-[11px] font-['Pretendard:SemiBold',sans-serif]">
      필수
    </span>
  );
}

/** 로그인 확정 예약자 — 흰 박스, 내부 라벨+값, 우측 초록 체크 */
function LockedBookerBox({ fieldLabel, value }: { fieldLabel: string; value: string }) {
  return (
    <div
      className="h-[55px] rounded-[12px] border border-[#e8e8e8] bg-white px-4 py-3 flex items-center gap-3"
      role="group"
      aria-label={fieldLabel}
    >
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[11px] text-[#999] font-['Pretendard:Medium',sans-serif] leading-tight mb-1">{fieldLabel}</p>
        <p className="text-[16px] font-['Pretendard:SemiBold',sans-serif] font-semibold text-[#333] leading-snug break-all">
          {value}
        </p>
      </div>
      <Check className="shrink-0 size-5 text-[#22c55e] pointer-events-none" strokeWidth={2.5} aria-hidden />
    </div>
  );
}

function formatBirthYmd(birth: string): string {
  const digits = birth.replace(/\D/g, "");
  if (digits.length === 8) return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  return birth.replace(/\./g, "-").replace(/\//g, "-");
}

function genderShort(passengerType: string): string {
  return passengerType.includes("남") ? "남" : "여";
}

function formatPhoneKr(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("010")) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  return phone;
}

function VerifiedInput(props: ComponentProps<"input">) {
  const { className, ...rest } = props;
  const v = props.value?.toString() ?? "";
  return (
    <div className="relative">
      <input
        {...rest}
        className={`w-full px-4 py-3 pr-11 border border-[#e5e5e5] rounded-[10px] text-[14px] text-[#111] placeholder:text-[#bbb] ${className ?? ""}`}
      />
      {v.length > 0 && (
        <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-[#6329C4] pointer-events-none" aria-hidden />
      )}
    </div>
  );
}

export interface NamemdaeFlightReservationContentProps {
  flight: FlightData;
  initialData: BookingFormData;
  onBack: () => void;
  onClose?: () => void;
  onOpenScheduleDetail: () => void;
  onNext: (data: BookingFormData) => void;
  /** FIT 조합 시 호텔 예약정보 단계(2단계)에 표시할 데이터 */
  hotelInfo?: HotelBookingInfo;
  /** 결제 단계: 예약 데이터만 저장(시트 유지). 미전달 시 onNext 호출 */
  onComboPaymentSubmitted?: (data: BookingFormData) => void;
  /** 결제 완료 바텀시트 닫기 → 대화 등 상위 처리 */
  onComboPaymentSuccessDismiss?: () => void;
}

export function NamemdaeFlightReservationContent({
  flight,
  initialData,
  onBack,
  onClose: _onClose,
  onOpenScheduleDetail,
  onNext,
  hotelInfo,
  onComboPaymentSubmitted,
  onComboPaymentSuccessDismiss,
}: NamemdaeFlightReservationContentProps) {
  /** 로그인 회원 기준 확정 예약자 정보 (편집 불가) */
  const bookerLocked = useMemo(() => {
    const birthRaw = (initialData.birthDate || "1990-01-11").replace(/\D/g, "").slice(0, 8);
    return {
      name: initialData.name || "강다희",
      birthDigits: birthRaw.length === 8 ? birthRaw : "19900111",
      email: initialData.email || "hana@hanatour.com",
      phone: initialData.phone || "010-1234-5678",
    };
  }, [initialData]);

  const [emergencyDialCode, setEmergencyDialCode] = useState("+82");
  const [emergencyPhone, setEmergencyPhone] = useState("010-5555-1234");

  const [sameAsBooker, setSameAsBooker] = useState(true);
  const [p1Type, setP1Type] = useState("성인(여)");
  const [p1NameKo, setP1NameKo] = useState("강다희");
  const [p1EnLast, setP1EnLast] = useState("KANG");
  const [p1EnFirst, setP1EnFirst] = useState("DAHEE");
  const [p1Birth, setP1Birth] = useState("1990.01.11");
  const [p1Phone, setP1Phone] = useState("010-1234-5678");
  const [p1Email, setP1Email] = useState("hana@hanatour.com");

  const [p2Type, setP2Type] = useState("성인(남)");
  const [p2NameKo, setP2NameKo] = useState("김하나");
  const [p2EnLast, setP2EnLast] = useState("KIM");
  const [p2EnFirst, setP2EnFirst] = useState("HANA");
  const [p2Birth, setP2Birth] = useState("1992.05.15");
  const [p2Phone, setP2Phone] = useState("010-8888-7777");
  const [p2Email, setP2Email] = useState("hana.kim@hanatour.com");

  const [showP1TravelerNotebook, setShowP1TravelerNotebook] = useState(false);
  const [showP2TravelerNotebook, setShowP2TravelerNotebook] = useState(false);
  const [passportLater, setPassportLater] = useState(false);
  const [p1PassportNo, setP1PassportNo] = useState("M70689098");
  const [p1PassportExpiry, setP1PassportExpiry] = useState("20300101");
  const [p1Nationality, setP1Nationality] = useState("KR");
  const [p1IssuingCountry, setP1IssuingCountry] = useState("KR");
  const [passportLaterP2, setPassportLaterP2] = useState(false);
  const [p2PassportNo, setP2PassportNo] = useState("M12345678");
  const [p2PassportExpiry, setP2PassportExpiry] = useState("20310202");
  const [p2Nationality, setP2Nationality] = useState("KR");
  const [p2IssuingCountry, setP2IssuingCountry] = useState("KR");
  const [flightNoticeOpen, setFlightNoticeOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [comboPhase, setComboPhase] = useState<"flight" | "hotel" | "payment">("flight");
  const [hotelFormKey, setHotelFormKey] = useState(0);

  useEffect(() => {
    if (sameAsBooker) {
      setP1NameKo(bookerLocked.name);
      setP1Phone(bookerLocked.phone);
      setP1Email(bookerLocked.email);
      const d = bookerLocked.birthDigits;
      if (d.length === 8) {
        setP1Birth(`${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`);
      }
    }
  }, [sameAsBooker, bookerLocked]);

  const passengerCount = Math.max(1, flight.passengerCount || 2);
  const needsSecondPassenger = passengerCount >= 2;

  const canNext =
    emergencyPhone.trim().length > 0 &&
    p1EnLast.trim().length > 0 &&
    p1EnFirst.trim().length > 0 &&
    (!needsSecondPassenger || (p2EnLast.trim().length > 0 && p2EnFirst.trim().length > 0)) &&
    agreeTerms &&
    agreePrivacy;

  const submitReservation = () => {
    const d = bookerLocked.birthDigits;
    const birthIso =
      d.length === 8 ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` : initialData.birthDate;
    const payload: BookingFormData = {
      name: bookerLocked.name.trim(),
      phone: bookerLocked.phone.trim(),
      email: bookerLocked.email.trim(),
      birthDate: birthIso,
      passportNumber: passportLater ? "" : p1PassportNo.trim(),
      travelers: passengerCount,
      agreeTerms: agreeTerms && agreePrivacy,
      agreeCancellation: true,
    };
    if (hotelInfo && onComboPaymentSubmitted) {
      onComboPaymentSubmitted(payload);
      return;
    }
    onNext(payload);
  };

  const handleOpenFinalConfirm = () => {
    if (!canNext) return;
    setShowFinalConfirm(true);
  };

  const handleFinalConfirmComplete = () => {
    setShowFinalConfirm(false);
    if (hotelInfo) {
      setHotelFormKey((k) => k + 1);
      setComboPhase("hotel");
      return;
    }
    submitReservation();
  };

  const handleHeaderBack = () => {
    if (comboPhase === "payment") {
      setComboPhase("hotel");
      return;
    }
    if (comboPhase === "hotel") {
      setComboPhase("flight");
      return;
    }
    onBack();
  };

  const hotelPrefill = useMemo(
    () => ({
      nameKo: p1NameKo,
      enLast: p1EnLast,
      enFirst: p1EnFirst,
      birth: p1Birth,
      phone: p1Phone,
      email: p1Email,
      genderFemale: p1Type.includes("여"),
    }),
    [p1NameKo, p1EnLast, p1EnFirst, p1Birth, p1Phone, p1Email, p1Type],
  );

  return (
    <>
      <div className="sticky top-0 bg-white border-b border-[#f0f0f0] z-10 shrink-0 flex items-center px-2 py-3 gap-1 min-w-0">
        <button type="button" onClick={handleHeaderBack} className="p-2 -ml-1 shrink-0" aria-label="뒤로 가기">
          <ArrowLeft className="size-6 text-[#111]" />
        </button>
        <h1 className="min-w-0 font-['Pretendard:Bold',sans-serif] text-[18px] leading-tight text-[#111] truncate px-1">
          {comboPhase === "payment" ? "결제하기" : "예약정보"}
        </h1>
        <div className="flex-1 min-w-0" aria-hidden />
      </div>

      {comboPhase !== "payment" ? (
        <NamemdaeComboStepper
          activeStep={comboPhase === "flight" ? 1 : 2}
        />
      ) : null}

      {comboPhase === "hotel" && hotelInfo ? (
        <NamemdaeHotelReservationContent
          key={hotelFormKey}
          hotelInfo={hotelInfo}
          prefill={hotelPrefill}
          onComplete={() => setComboPhase("payment")}
        />
      ) : comboPhase === "payment" && hotelInfo ? (
        <NamemdaeComboPaymentContent
          totalAmount={hotelInfo.totalAmount}
          airApprovalAmount={flight.price}
          bookerName={bookerLocked.name}
          onPayComplete={submitReservation}
          onClosePaymentSuccess={onComboPaymentSuccessDismiss}
        />
      ) : (
        <>
      <div className="px-5 py-4 flex-1 overflow-y-auto pb-28 bg-[#f8f8f8]">
        {/* 예약자 정보 — 섹션은 일반 카드, 필드만 딤 + 박스 내 라벨/값 */}
        <section className="mb-5 bg-white rounded-[12px] p-4 border border-[#eee]">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">예약자 정보</h3>
            <RequiredBadge />
          </div>
          <div className="space-y-3">
            <LockedBookerBox fieldLabel="한글 성명" value={bookerLocked.name} />
            <LockedBookerBox fieldLabel="법정 생년월일" value={bookerLocked.birthDigits} />
            <LockedBookerBox fieldLabel="이메일 주소" value={bookerLocked.email} />
            <LockedBookerBox
              fieldLabel="휴대폰 번호"
              value={bookerLocked.phone.replace(/\D/g, "")}
            />
          </div>
        </section>

        {/* 비상연락처 */}
        <section className="mb-5 bg-white rounded-[12px] p-4 border border-[#eee]">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">비상연락처</h3>
            <RequiredBadge />
          </div>
          <div className="space-y-3">
            <div className="relative">
              <select
                value={emergencyDialCode}
                onChange={(e) => setEmergencyDialCode(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 border border-[#e5e5e5] rounded-[10px] text-[14px] text-[#111] bg-white"
                aria-label="국가번호"
              >
                <option value="+82">한국(+82)</option>
                <option value="+1">미국/캐나다(+1)</option>
                <option value="+81">일본(+81)</option>
                <option value="+86">중국(+86)</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#999]"
                aria-hidden
              />
            </div>
            <VerifiedInput
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              placeholder="연락 가능 번호"
              aria-label="연락 가능 번호"
            />
          </div>
        </section>

        {/* 탑승객 정보 */}
        <section className="mb-5 bg-white rounded-[12px] p-4 border border-[#eee]">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">탑승객 정보 입력</h3>
            <RequiredBadge />
          </div>

          <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
            <p className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111] min-w-0 truncate">
              탑승객 1 (성인)
            </p>
            <button
              type="button"
              onClick={() => setShowP1TravelerNotebook(true)}
              className="flex items-center gap-2 px-0 py-1.5 rounded-[8px] border-0 text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:bg-[#f9f9f9] shrink-0"
              aria-label="MY 여행자 수첩 열기"
            >
              <User className="size-4 shrink-0 border border-[#ddd] rounded p-0.5" strokeWidth={1.5} aria-hidden />
              <span className="underline">MY 여행자 수첩</span>
              <Info className="size-4 shrink-0 text-[#999]" aria-hidden />
            </button>
          </div>
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sameAsBooker}
              onChange={(e) => setSameAsBooker(e.target.checked)}
              className="size-4 rounded border-[#ccc] text-[#6329C4]"
            />
            <span className="text-[13px] text-[#6329C4] font-['Pretendard:SemiBold',sans-serif]">예약자 정보와 동일합니다</span>
          </label>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-1 min-w-0">
                <VerifiedInput
                  value={p1NameKo}
                  onChange={(e) => setP1NameKo(e.target.value)}
                  placeholder="한글 이름"
                  disabled={sameAsBooker}
                />
              </div>
              <div
                className="flex rounded-[8px] border border-[#eee] overflow-hidden shrink-0"
                role="group"
                aria-label="성별"
              >
                <button
                  type="button"
                  onClick={() => setP1Type("성인(남)")}
                  className={`px-3 py-3 text-[13px] border shrink-0 rounded-l-[8px] ${
                    p1Type === "성인(남)"
                      ? "border-[#111] border-r-0 bg-white text-[#111] font-['Pretendard:SemiBold',sans-serif]"
                      : "border-transparent bg-white text-[#999]"
                  }`}
                >
                  남
                </button>
                <button
                  type="button"
                  onClick={() => setP1Type("성인(여)")}
                  className={`px-3 py-3 text-[13px] border shrink-0 rounded-r-[8px] border-l-0 ${
                    p1Type === "성인(여)"
                      ? "border-[#111] bg-white text-[#111] font-['Pretendard:SemiBold',sans-serif]"
                      : "border-transparent bg-white text-[#999]"
                  }`}
                >
                  여
                </button>
              </div>
            </div>
            <VerifiedInput
              value={p1Birth}
              onChange={(e) => setP1Birth(e.target.value)}
              placeholder="YYYY.MM.DD"
              disabled={sameAsBooker}
            />
            <VerifiedInput value={p1EnLast} onChange={(e) => setP1EnLast(e.target.value.toUpperCase())} placeholder="영문 성 (ex. HONG)" />
            <VerifiedInput value={p1EnFirst} onChange={(e) => setP1EnFirst(e.target.value.toUpperCase())} placeholder="영문 이름 (ex. GILDONG)" />
            <VerifiedInput value={p1Phone} onChange={(e) => setP1Phone(e.target.value)} placeholder="휴대폰" disabled={sameAsBooker} />
            <VerifiedInput type="email" value={p1Email} onChange={(e) => setP1Email(e.target.value)} placeholder="이메일" disabled={sameAsBooker} />

            {/* 여권 정보 — PassengerFormSheet와 동일 패턴 */}
            <div className="pt-1">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] shrink-0">
                  여권 정보
                </h3>
                <label className="flex items-center gap-1.5 cursor-pointer shrink-0 min-w-0">
                  <input
                    type="checkbox"
                    checked={passportLater}
                    onChange={(e) => setPassportLater(e.target.checked)}
                    className="size-4 rounded border-[#ddd] text-[#6329C4] shrink-0"
                  />
                  <span className="text-[13px] text-[#999] font-['Pretendard:Medium',sans-serif] whitespace-nowrap">
                    여권정보 나중에 등록
                  </span>
                  <CircleAlert className="size-4 text-[#999] shrink-0" aria-hidden />
                </label>
              </div>
              {!passportLater && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={p1PassportNo}
                      onChange={(e) => setP1PassportNo(e.target.value)}
                      placeholder="여권 번호(ex. M70689098)"
                      className="w-full px-4 py-3 pr-11 border border-[#e5e5e5] rounded-[10px] text-[14px] text-[#111] placeholder:text-[#bbb] bg-white"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#999] hover:text-[#666]"
                      aria-label="여권 번호 도움말"
                    >
                      <HelpCircle className="size-5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={p1PassportExpiry}
                    onChange={(e) => setP1PassportExpiry(e.target.value)}
                    placeholder="여권 만료일(ex. 20300101)"
                    className="w-full px-4 py-3 border border-[#e5e5e5] rounded-[10px] text-[14px] text-[#111] placeholder:text-[#bbb] bg-white"
                  />
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 min-w-0">
                      <select
                        value={p1Nationality}
                        onChange={(e) => setP1Nationality(e.target.value)}
                        className="w-full appearance-none px-4 py-3 pr-10 border border-[#e5e5e5] rounded-[10px] text-[14px] text-[#111] bg-white"
                      >
                        <option value="KR">(국적) 대한민국</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#999]" aria-hidden />
                    </div>
                    <div className="relative flex-1 min-w-0">
                      <select
                        value={p1IssuingCountry}
                        onChange={(e) => setP1IssuingCountry(e.target.value)}
                        className="w-full appearance-none px-4 py-3 pr-10 border border-[#e5e5e5] rounded-[10px] text-[14px] text-[#111] bg-white"
                      >
                        <option value="KR">(발행국가) 대한민국</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#999]" aria-hidden />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {needsSecondPassenger && (
            <>
              <div className="border-t border-[#f0f0f0] pt-6 mt-5" aria-hidden />

              <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
                <p className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111] min-w-0 truncate">
                  탑승객 2 (성인)
                </p>
                <button
                  type="button"
                  onClick={() => setShowP2TravelerNotebook(true)}
                  className="flex items-center gap-2 px-0 py-1.5 rounded-[8px] border-0 text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#111] hover:bg-[#f9f9f9] shrink-0"
                  aria-label="탑승객 2 MY 여행자 수첩 열기"
                >
                  <User className="size-4 shrink-0 border border-[#ddd] rounded p-0.5" strokeWidth={1.5} aria-hidden />
                  <span className="underline">MY 여행자 수첩</span>
                  <Info className="size-4 shrink-0 text-[#999]" aria-hidden />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-1 min-w-0">
                    <VerifiedInput
                      value={p2NameKo}
                      onChange={(e) => setP2NameKo(e.target.value)}
                      placeholder="한글 이름"
                    />
                  </div>
                  <div
                    className="flex rounded-[8px] border border-[#eee] overflow-hidden shrink-0"
                    role="group"
                    aria-label="탑승객 2 성별"
                  >
                    <button
                      type="button"
                      onClick={() => setP2Type("성인(남)")}
                      className={`px-3 py-3 text-[13px] border shrink-0 rounded-l-[8px] ${
                        p2Type === "성인(남)"
                          ? "border-[#111] border-r-0 bg-white text-[#111] font-['Pretendard:SemiBold',sans-serif]"
                          : "border-transparent bg-white text-[#999]"
                      }`}
                    >
                      남
                    </button>
                    <button
                      type="button"
                      onClick={() => setP2Type("성인(여)")}
                      className={`px-3 py-3 text-[13px] border shrink-0 rounded-r-[8px] border-l-0 ${
                        p2Type === "성인(여)"
                          ? "border-[#111] bg-white text-[#111] font-['Pretendard:SemiBold',sans-serif]"
                          : "border-transparent bg-white text-[#999]"
                      }`}
                    >
                      여
                    </button>
                  </div>
                </div>
                <VerifiedInput
                  value={p2Birth}
                  onChange={(e) => setP2Birth(e.target.value)}
                  placeholder="YYYY.MM.DD"
                />
                <VerifiedInput
                  value={p2EnLast}
                  onChange={(e) => setP2EnLast(e.target.value.toUpperCase())}
                  placeholder="영문 성 (ex. HONG)"
                />
                <VerifiedInput
                  value={p2EnFirst}
                  onChange={(e) => setP2EnFirst(e.target.value.toUpperCase())}
                  placeholder="영문 이름 (ex. GILDONG)"
                />
                <VerifiedInput value={p2Phone} onChange={(e) => setP2Phone(e.target.value)} placeholder="휴대폰" />
                <VerifiedInput type="email" value={p2Email} onChange={(e) => setP2Email(e.target.value)} placeholder="이메일" />

                <div className="pt-1">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] shrink-0">
                      여권 정보
                    </h3>
                    <label className="flex items-center gap-1.5 cursor-pointer shrink-0 min-w-0">
                      <input
                        type="checkbox"
                        checked={passportLaterP2}
                        onChange={(e) => setPassportLaterP2(e.target.checked)}
                        className="size-4 rounded border-[#ddd] text-[#6329C4] shrink-0"
                      />
                      <span className="text-[13px] text-[#999] font-['Pretendard:Medium',sans-serif] whitespace-nowrap">
                        여권정보 나중에 등록
                      </span>
                      <CircleAlert className="size-4 text-[#999] shrink-0" aria-hidden />
                    </label>
                  </div>
                  {!passportLaterP2 && (
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          value={p2PassportNo}
                          onChange={(e) => setP2PassportNo(e.target.value)}
                          placeholder="여권 번호(ex. M70689098)"
                          className="w-full px-4 py-3 pr-11 border border-[#e5e5e5] rounded-[10px] text-[14px] text-[#111] placeholder:text-[#bbb] bg-white"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#999] hover:text-[#666]"
                          aria-label="탑승객 2 여권 번호 도움말"
                        >
                          <HelpCircle className="size-5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={p2PassportExpiry}
                        onChange={(e) => setP2PassportExpiry(e.target.value)}
                        placeholder="여권 만료일(ex. 20300101)"
                        className="w-full px-4 py-3 border border-[#e5e5e5] rounded-[10px] text-[14px] text-[#111] placeholder:text-[#bbb] bg-white"
                      />
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1 min-w-0">
                          <select
                            value={p2Nationality}
                            onChange={(e) => setP2Nationality(e.target.value)}
                            className="w-full appearance-none px-4 py-3 pr-10 border border-[#e5e5e5] rounded-[10px] text-[14px] text-[#111] bg-white"
                          >
                            <option value="KR">(국적) 대한민국</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#999]" aria-hidden />
                        </div>
                        <div className="relative flex-1 min-w-0">
                          <select
                            value={p2IssuingCountry}
                            onChange={(e) => setP2IssuingCountry(e.target.value)}
                            className="w-full appearance-none px-4 py-3 pr-10 border border-[#e5e5e5] rounded-[10px] text-[14px] text-[#111] bg-white"
                          >
                            <option value="KR">(발행국가) 대한민국</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#999]" aria-hidden />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>

        {/* 정책 안내 박스 (항공 예약 단 안내와 동일 문구) */}
        <div className="rounded-[12px] bg-[#ededed] border border-[#e8e0ff] px-4 py-3 mb-3 space-y-2 text-[12px] leading-[1.5]">
          <p className="text-[#6329C4]">
            • 여권상 영문이름과 다른 경우 탑승이 불가하며, 예약 후에는 영문이름 변경이 불가하오니 실제 탑승하실분의 여권상 동일한 영문 성/이름, 성별을 정확히 입력해주시기 바랍니다.
            (영문 성/이름 입력시 띄어쓰기나 &quot;-&quot; 표시 없이 영문 스펠링만 정확히 입력해 주십시오)
          </p>
          <p className="text-[#555]">
            • 등록하신 여권번호/여권만료일/국가/발행국가를 변경하실 경우 출국 72시간 전까지 재등록이 가능합니다.
          </p>
          <p className="text-[#555]">
            • 정확한 승객 정보 확인을 위해 탑승자 별로 휴대폰번호와 이메일을 입력해주세요.
          </p>
        </div>

        <div className="-mx-5 border-t-8 border-[#ededed]" aria-hidden />

        {/* 항공 유의사항 — 타이틀은 카드 밖, 본문만 펼침 */}
        <section className="mt-[10px] mb-[10px]">
          <button
            type="button"
            className="w-full flex items-center justify-between gap-2 py-2 px-0 text-left bg-transparent"
            onClick={() => setFlightNoticeOpen(!flightNoticeOpen)}
            aria-expanded={flightNoticeOpen}
          >
            <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
              항공 유의사항
            </span>
            {flightNoticeOpen ? (
              <ChevronUp className="size-5 text-[#666] shrink-0" aria-hidden />
            ) : (
              <ChevronDown className="size-5 text-[#666] shrink-0" aria-hidden />
            )}
          </button>
          {flightNoticeOpen && (
            <div className="pb-3 text-[13px] text-[#666] leading-[1.55] pt-1 pl-0">
              <p>탑승자 영문 성명은 여권과 동일해야 합니다. 결제 완료 후 일부 정보 변경이 제한될 수 있습니다.</p>
            </div>
          )}
        </section>

        <div className="-mx-5 border-t-8 border-[#ededed]" aria-hidden />

        {/* 항공 이용안내(약관·동의) — 타이틀은 카드 밖 */}
        <section className="mt-3 mb-0">
          <button
            type="button"
            className="w-full flex items-center justify-between gap-2 py-2 px-0 text-left bg-transparent"
            onClick={() => setTermsOpen(!termsOpen)}
            aria-expanded={termsOpen}
          >
            <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
              항공 이용안내
            </span>
            {termsOpen ? (
              <ChevronUp className="size-5 text-[#666] shrink-0" aria-hidden />
            ) : (
              <ChevronDown className="size-5 text-[#666] shrink-0" aria-hidden />
            )}
          </button>
          {termsOpen && (
            <div className="pb-3 space-y-2 pt-1 pl-0">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-[#ccc] text-[#6329C4]"
                />
                <span className="text-[13px] text-[#333]">(필수) 항공 운송·예약 관련 약관에 동의합니다.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-[#ccc] text-[#6329C4]"
                />
                <span className="text-[13px] text-[#333]">(필수) 개인정보 수집·이용 및 제3자 제공에 동의합니다.</span>
              </label>
            </div>
          )}
        </section>

        <div className="-mx-5 border-t-8 border-[#ededed]" aria-hidden />

        {/* 항공 상세일정 — 타이틀은 버튼 박스 밖 */}
        <section className="mt-3 mb-4">
          <h3 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] mb-3">
            항공 상세일정
          </h3>
          <button
            type="button"
            onClick={onOpenScheduleDetail}
            className="w-full py-3.5 px-4 border border-[#6329C4] text-[#6329C4] rounded-[30px] text-[14px] font-['Pretendard:SemiBold',sans-serif] bg-white hover:bg-[#f8f4ff]"
          >
            요금/환불 규정 및 상세일정 보기
          </button>
        </section>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4 shrink-0">
        <button
          type="button"
          onClick={handleOpenFinalConfirm}
          disabled={!canNext}
          className="w-full py-4 bg-[#6329C4] text-white rounded-[30px] text-[16px] font-['Pretendard:Bold',sans-serif] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5423AD] transition-colors"
        >
          다음단계
        </button>
      </div>
        </>
      )}

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {showFinalConfirm && (
                <div
                  className="fixed inset-0 z-[100] flex w-screen max-w-[100vw] items-end bg-black/50"
                  onClick={() => setShowFinalConfirm(false)}
                  role="presentation"
                >
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="flex max-h-[90vh] w-full min-w-0 flex-col overflow-hidden rounded-t-[24px] bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.12)]"
                    onClick={(e) => e.stopPropagation()}
                  >
              <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-4 py-3 flex items-start justify-between gap-3 shrink-0 z-10">
                <div className="min-w-0 flex-1 pt-[6px]">
                  <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111] leading-tight">
                    예약내역 최종 확인
                  </h2>
                  <p className="mt-0 text-[12px] text-[#888] leading-[1.45]">
                    입력하신 정보가 모두 정확한지 확인해주시기 바랍니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFinalConfirm(false)}
                  className="p-2 -mr-2 -mt-0.5 text-[#666] hover:text-[#111] shrink-0"
                  aria-label="닫기"
                >
                  <X className="size-6" />
                </button>
              </div>

              <div className="px-5 py-4 flex-1 overflow-y-auto pb-4">
                <section className="mb-5">
                  <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-2">
                    탑승자 정보 총{" "}
                    <span className="text-[#6329C4]">{passengerCount}명</span>
                  </h3>
                  <div className="rounded-[10px] border border-[#eee] overflow-hidden">
                    <table className="w-full text-left text-[13px]">
                      <thead>
                        <tr className="bg-[#f9f9f9] border-b border-[#eee]">
                          <th className="px-2.5 py-2 text-[12px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">
                            영문성
                          </th>
                          <th className="px-2.5 py-2 text-[12px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">
                            영문이름
                          </th>
                          <th className="px-2.5 py-2 text-[12px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">
                            생년월일
                          </th>
                          <th className="px-2.5 py-2 text-[12px] text-[#666] font-['Pretendard:SemiBold',sans-serif]">
                            성별
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#f0f0f0]">
                          <td className="px-2.5 py-2.5 text-[#111] font-['Pretendard:Medium',sans-serif]">
                            {p1EnLast || "—"}
                          </td>
                          <td className="px-2.5 py-2.5 text-[#111] font-['Pretendard:Medium',sans-serif]">
                            {p1EnFirst || "—"}
                          </td>
                          <td className="px-2.5 py-2.5 text-[#111] whitespace-nowrap">
                            {formatBirthYmd(p1Birth)}
                          </td>
                          <td className="px-2.5 py-2.5 text-[#111]">{genderShort(p1Type)}</td>
                        </tr>
                        {needsSecondPassenger && (
                          <tr>
                            <td className="px-2.5 py-2.5 text-[#111] font-['Pretendard:Medium',sans-serif]">
                              {p2EnLast || "—"}
                            </td>
                            <td className="px-2.5 py-2.5 text-[#111] font-['Pretendard:Medium',sans-serif]">
                              {p2EnFirst || "—"}
                            </td>
                            <td className="px-2.5 py-2.5 text-[#111] whitespace-nowrap">
                              {formatBirthYmd(p2Birth)}
                            </td>
                            <td className="px-2.5 py-2.5 text-[#111]">{genderShort(p2Type)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 rounded-[10px] bg-[#ededed] px-3 py-2.5 text-[12px] text-[#555] leading-[1.5] space-y-1.5">
                    <p>
                      • 예약 완료 후 탑승자 정보 변경이 제한될 수 있습니다. 여권과 동일한 영문 성·이름·성별인지
                      확인해 주세요.
                    </p>
                    <p>
                      • 영문 성/이름 입력 시 띄어쓰기나 &quot;-&quot; 없이 영문 스펠링만 정확히 입력해 주십시오.
                    </p>
                  </div>
                </section>

                <section className="mb-5">
                  <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-2">
                    예약자 연락정보 확인
                  </h3>
                  <div className="rounded-[10px] border border-[#eee] overflow-hidden">
                    <table className="w-full text-left text-[14px]">
                      <tbody>
                        <tr className="border-b border-[#f0f0f0]">
                          <td className="px-3 py-2.5 text-[#666] w-[104px] shrink-0">휴대폰 번호</td>
                          <td className="px-3 py-2.5 text-[#111]">
                            {formatPhoneKr(bookerLocked.phone)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2.5 text-[#666]">이메일</td>
                          <td className="px-3 py-2.5 text-[#111] break-all">{bookerLocked.email}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-[12px] leading-[1.5]">
                    <span className="text-[#6329C4] font-['Pretendard:SemiBold',sans-serif]">
                      예약·발권 알림 및 상담
                    </span>
                    <span className="text-[#666]">
                      을 위해 위 연락처가 정확한지 다시 한 번 확인해 주세요.
                    </span>
                  </p>
                </section>

                <section className="mb-1">
                  <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111] mb-2">
                    중복(이중)예약 안내
                  </h3>
                  <div className="rounded-[10px] bg-[#ededed] px-3 py-2.5 text-[12px] text-[#555] leading-[1.5] space-y-1.5">
                    <p>
                      • 동일 노선·동일 탑승일 등 조건의 중복 예약은 항공사 정책에 따라 사전 통보 없이 취소될 수
                      있습니다.
                    </p>
                    <p>• 허위 정보·타인 명의 예약은 제한될 수 있으니 유의해 주세요.</p>
                  </div>
                </section>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4 shrink-0 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFinalConfirm(false)}
                  className="flex-1 py-3.5 border border-[#e0e0e0] rounded-[30px] text-[15px] text-[#666] font-['Pretendard:SemiBold',sans-serif] bg-white hover:bg-[#f9f9f9] transition-colors"
                >
                  다시 확인하기
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirmComplete}
                  className="flex-1 py-3.5 bg-[#6329C4] text-white rounded-[30px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#4a1f94] transition-colors"
                >
                  확인 완료
                </button>
              </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body,
          )
        : null}

      {showP1TravelerNotebook && (
        <MyTravelerNotebookModal
          onClose={() => setShowP1TravelerNotebook(false)}
          travelerName={p1NameKo}
          birthDate={p1Birth}
          gender={p1Type.includes("남") ? "남" : "여"}
        />
      )}
      {showP2TravelerNotebook && needsSecondPassenger && (
        <MyTravelerNotebookModal
          onClose={() => setShowP2TravelerNotebook(false)}
          travelerName={p2NameKo.trim() || "탑승객 2"}
          birthDate={p2Birth.trim() || "1990.01.01"}
          gender={p2Type.includes("남") ? "남" : "여"}
        />
      )}
    </>
  );
}
