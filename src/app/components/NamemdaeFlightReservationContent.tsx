import { useState, useEffect, useMemo, type ComponentProps } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Check,
  User,
  Info,
  HelpCircle,
  CircleAlert,
} from "lucide-react";
import type { BookingFormData } from "./BookingForm";
import { FlightData } from "./FlightCard";
import { NamemdaeComboStepper } from "./NamemdaeComboStepper";
import { MyTravelerNotebookModal } from "./MyTravelerNotebookModal";

function RequiredBadge() {
  return (
    <span className="shrink-0 px-2 py-0.5 rounded-[4px] bg-[#7b3ff2] text-white text-[11px] font-['Pretendard:SemiBold',sans-serif]">
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
        <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-[#7b3ff2] pointer-events-none" aria-hidden />
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
}

export function NamemdaeFlightReservationContent({
  flight,
  initialData,
  onBack,
  onClose: _onClose,
  onOpenScheduleDetail,
  onNext,
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

  const handleNext = () => {
    if (!canNext) return;
    const d = bookerLocked.birthDigits;
    const birthIso =
      d.length === 8 ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` : initialData.birthDate;
    onNext({
      name: bookerLocked.name.trim(),
      phone: bookerLocked.phone.trim(),
      email: bookerLocked.email.trim(),
      birthDate: birthIso,
      passportNumber: passportLater ? "" : p1PassportNo.trim(),
      travelers: passengerCount,
      agreeTerms: agreeTerms && agreePrivacy,
      agreeCancellation: true,
    });
  };

  return (
    <>
      <div className="sticky top-0 bg-white border-b border-[#f0f0f0] z-10 shrink-0 flex items-center px-2 py-3 gap-1 min-w-0">
        <button type="button" onClick={onBack} className="p-2 -ml-1 shrink-0" aria-label="뒤로 가기">
          <ArrowLeft className="size-6 text-[#111]" />
        </button>
        <h1 className="min-w-0 font-['Pretendard:Bold',sans-serif] text-[18px] leading-tight text-[#111] truncate px-1">
          예약정보
        </h1>
        <div className="flex-1 min-w-0" aria-hidden />
      </div>

      <NamemdaeComboStepper activeStep={1} />

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
              className="size-4 rounded border-[#ccc] text-[#7b3ff2]"
            />
            <span className="text-[13px] text-[#7b3ff2] font-['Pretendard:SemiBold',sans-serif]">예약자 정보와 동일합니다</span>
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
                    className="size-4 rounded border-[#ddd] text-[#7b3ff2] shrink-0"
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
                        className="size-4 rounded border-[#ddd] text-[#7b3ff2] shrink-0"
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
          <p className="text-[#7b3ff2]">
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
                  className="mt-0.5 size-4 rounded border-[#ccc] text-[#7b3ff2]"
                />
                <span className="text-[13px] text-[#333]">(필수) 항공 운송·예약 관련 약관에 동의합니다.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-[#ccc] text-[#7b3ff2]"
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
            className="w-full py-3.5 px-4 border border-[#7b3ff2] text-[#7b3ff2] rounded-[30px] text-[14px] font-['Pretendard:SemiBold',sans-serif] bg-white hover:bg-[#f8f4ff]"
          >
            요금/환불 규정 및 상세일정 보기
          </button>
        </section>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4 shrink-0">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canNext}
          className="w-full py-4 bg-[#7b3ff2] text-white rounded-[30px] text-[16px] font-['Pretendard:Bold',sans-serif] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
        >
          다음단계
        </button>
      </div>

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
