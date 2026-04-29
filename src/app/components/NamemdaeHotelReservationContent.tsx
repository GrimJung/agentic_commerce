import { useId, useState, type ComponentProps, type ReactNode } from "react";
import {
  Bed,
  BedDouble,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Cigarette,
  CigaretteOff,
  Clock,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import type { HotelBookingInfo } from "./BookingForm";

const NOTICE_ACCENT = "text-[#4a1f94]";

function parseHotelCheckInDate(checkIn: string): Date | null {
  const cleaned = checkIn.replace(/\([^)]*\)/g, "").trim();
  const m = cleaned.match(/^(\d{4})\.(\d{2})\.(\d{2})/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function addDays(base: Date, delta: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + delta);
  return next;
}

function formatKoreanDeadline(d: Date, hour: number): string {
  const y = d.getFullYear();
  const mo = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(hour).padStart(2, "0");
  return `${y}년 ${String(mo).padStart(2, "0")}월 ${String(day).padStart(2, "0")}일 ${h}시 까지`;
}

/** 결제 직전 — 항공·호텔 정보 확인 안내 (화면 중앙) */
function NamemdaeFlightHotelPayNoticeModal({
  open,
  hotelInfo,
  onClose,
  onConfirm,
}: {
  open: boolean;
  hotelInfo: HotelBookingInfo;
  onClose: () => void;
  onConfirm: () => void;
}) {
  useLockBodyScroll(open);

  const checkInDt = parseHotelCheckInDate(hotelInfo.checkIn);
  const freeUntil = checkInDt ? addDays(checkInDt, -19) : null;
  const partialUntil = checkInDt ? addDays(checkInDt, -7) : null;
  const penaltyFrom = checkInDt ? addDays(checkInDt, -1) : null;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="namemdae-pay-notice-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="안내 닫기"
        onClick={onClose}
      />
      <div className="relative z-[1] flex w-full max-w-[360px] max-h-[min(720px,calc(100vh-24px))] flex-col overflow-hidden rounded-[16px] bg-white shadow-xl">
        <header className="sticky top-0 z-10 shrink-0 border-b border-[#f0f0f0] bg-white px-5 pt-5 pb-3 rounded-t-[16px]">
          <div className="flex items-end justify-between gap-3">
            <h2
              id="namemdae-pay-notice-title"
              className="flex min-w-0 flex-1 flex-row items-end justify-center text-left text-[16px] font-['Pretendard:Bold',sans-serif] font-bold leading-snug text-[#111]"
            >
              내맘대로 항공+호텔 정보 확인 안내
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-1 -mr-1 -mt-0.5 text-[#111]"
              aria-label="닫기"
            >
              <X className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-4">
          <p className="text-center text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] leading-[1.55] mb-4">
            예약 확정 후에{" "}
            <span className={`font-['Pretendard:Bold',sans-serif] ${NOTICE_ACCENT}`}>
              변경이 불가하며 취소 시 페널티가 발생될
            </span>{" "}
            수 있습니다. 항공/호텔 예약 정보 및 약관을 확인해 주세요.
          </p>

          <div className="space-y-3">
            <div className="rounded-[12px] bg-[#f4f4f4] px-4 py-3.5">
              <p className="text-[14px] font-['Pretendard:Bold',sans-serif] text-[#111] mb-2.5">
                ① 항공 취소/환불 규정
              </p>
              <p className="text-[13px] font-['Pretendard:Bold',sans-serif] text-[#111] mb-1.5">항공 취소 안내</p>
              <ul className="space-y-2 text-[12px] font-['Pretendard:Medium',sans-serif] text-[#333] leading-[1.5] pl-3 list-disc marker:text-[#666]">
                <li>
                  항공권 취소 시 항공사 및 요금 규정에 따른 취소·환불 수수료가 부과될 수 있으며, 영업일 기준으로
                  처리됩니다.
                </li>
                <li>
                  발권(또는 예약 확정) 이후 일정·탑승객 변경은 제한되거나 추가 요금이 발생할 수 있습니다. 상세는 항공
                  요금/환불 규정을 확인해 주세요.
                </li>
              </ul>
            </div>

            <div className="rounded-[12px] bg-[#f4f4f4] px-4 py-3.5">
              <p className="text-[14px] font-['Pretendard:Bold',sans-serif] text-[#111] mb-2.5">
                ① 호텔 취소/환불 규정
              </p>
              <p className="text-[13px] font-['Pretendard:Bold',sans-serif] text-[#111] mb-2">{hotelInfo.hotelName}</p>

              <p className="text-[12px] font-['Pretendard:Bold',sans-serif] text-[#111] mb-1.5">취소 수수료 적용 일정</p>
              {freeUntil && partialUntil && penaltyFrom ? (
                <ul className="space-y-1.5 text-[12px] font-['Pretendard:Medium',sans-serif] text-[#333] leading-[1.5] mb-3">
                  <li>
                    <span className={`font-['Pretendard:Bold',sans-serif] ${NOTICE_ACCENT}`}>
                      {formatKoreanDeadline(freeUntil, 16)}
                    </span>
                    : 무료 취소
                  </li>
                  <li>
                    <span className={`font-['Pretendard:Bold',sans-serif] ${NOTICE_ACCENT}`}>
                      {formatKoreanDeadline(partialUntil, 16)}
                    </span>
                    : 취소 수수료 1박 요금
                  </li>
                  <li>
                    <span className={`font-['Pretendard:Bold',sans-serif] ${NOTICE_ACCENT}`}>
                      {formatKoreanDeadline(penaltyFrom, 16)}
                    </span>
                    : 취소 불가(노쇼 시 전액 위약금)
                  </li>
                </ul>
              ) : (
                <p className="text-[12px] font-['Pretendard:Medium',sans-serif] text-[#333] leading-[1.5] mb-3">
                  취소·환불 일정은 호텔 및 객실 상품 규정에 따릅니다. 체크인{" "}
                  <span className={`font-['Pretendard:Bold',sans-serif] ${NOTICE_ACCENT}`}>{hotelInfo.checkIn}</span>{" "}
                  기준으로 상세 일정은 예약 확인서 및 호텔 정책을 참고해 주세요.
                </p>
              )}

              <p className="text-[12px] font-['Pretendard:Bold',sans-serif] text-[#111] mb-1">예약 처리 사항</p>
              <p className="text-[11px] font-['Pretendard:Medium',sans-serif] text-[#555] leading-[1.55] mb-3">
                예약 확정 후 노쇼(No Show) 시 전액이 위약금으로 처리될 수 있습니다. 위 취소 마감 이후에는 환불이
                불가한 요금으로 진행될 수 있으니 이용 전 일정을 반드시 확인해 주세요. (No Show / Non-refundable 조건은
                호텔 규정을 따릅니다.)
              </p>

              <p className="text-[12px] font-['Pretendard:Bold',sans-serif] text-[#111] mb-1">환불 불가 요금 관련 규정</p>
              <p className="text-[11px] font-['Pretendard:Medium',sans-serif] text-[#555] leading-[1.55]">
                소비자분쟁해결기준(공정거래위원회 고시) 및 여행약관에 따라, 취소 시점·사유에 따라 환불 가능 금액이
                달라질 수 있습니다. 특가·환불 불가 상품은 별도 규정이 적용됩니다.
              </p>
            </div>
          </div>
        </div>

        <footer className="shrink-0 border-t border-[#f0f0f0] bg-white px-5 pt-3 pb-4 rounded-b-[16px]">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3.5 rounded-[30px] bg-[#4a1f94] text-white text-[15px] font-['Pretendard:Bold',sans-serif] hover:bg-[rgba(74,33,144,1)] transition-colors"
          >
            확인했습니다
          </button>
        </footer>
      </div>
    </div>
  );
}

function RequiredBadge() {
  return (
    <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#6329C4] text-white text-[11px] font-['Pretendard:SemiBold',sans-serif]">
      필수
    </span>
  );
}

/** 투숙객 폼 — 상단 작은 회색 라벨 + 굵은 입력값 + 우측 초록 체크 (캡처 UI) */
function GuestLabeledField({
  label,
  ...rest
}: ComponentProps<"input"> & { label: string }) {
  const { className, ...inputRest } = rest;
  const v = inputRest.value?.toString() ?? "";
  return (
    <div
      className={`relative flex h-[50px] flex-col items-start justify-center rounded-[12px] border border-[#e8e8e8] bg-white px-4 pt-3 pb-2.5 pr-12 ${className ?? ""}`}
    >
      <p className="text-[11px] text-[#999] font-['Pretendard:Medium',sans-serif] leading-tight mb-0">{label}</p>
      <input
        {...inputRest}
        className="w-full text-[16px] font-['Pretendard:Bold',sans-serif] text-[#111] placeholder:text-[#bbb] placeholder:font-['Pretendard:Medium',sans-serif] placeholder:text-[15px] bg-transparent border-0 p-0 outline-none focus:ring-0"
      />
      {v.length > 0 && (
        <Check
          className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-[#22c55e] pointer-events-none"
          strokeWidth={2.5}
          aria-hidden
        />
      )}
    </div>
  );
}

/** 전체 너비(시트 패딩 상쇄) 굵은 회색 구역 구분선 */
function SectionShadeDivider() {
  return <div className="-mx-5 h-2 shrink-0 bg-[#dedede]" aria-hidden />;
}

/** 호텔 요청사항 — 회색 원형 체크 + 카테고리 아이콘 + 라벨 (캡처 UI) */
function HotelRequestOption({
  checked,
  onCheckedChange,
  icon: Icon,
  label,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  icon: LucideIcon;
  label: ReactNode;
}) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none min-w-0 max-w-full">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <span
        className={`flex size-[22px] shrink-0 items-center justify-center rounded-full border transition-colors ${
          checked ? "border-[#cfcfcf] bg-[#d4d4d4]" : "border-[#e5e5e5] bg-white"
        }`}
        aria-hidden
      >
        <Check className={`size-3.5 stroke-[2.8] text-white ${checked ? "opacity-100" : "opacity-0"}`} aria-hidden />
      </span>
      <Icon className="size-[18px] shrink-0 text-[#555]" strokeWidth={1.75} aria-hidden />
      <span className="text-[14px] font-['Pretendard:Medium',sans-serif] text-[#111] leading-tight">{label}</span>
    </label>
  );
}

/** 캡처 UI — 약관 카피 (독립 항목 + 항공/호텔 그룹) */
const TERM_STANDALONE = "(필수) 내맘대로 규정 안내 동의";
const TERM_FLIGHT_GROUP = "(필수) 내맘대로 항공 약관";
const TERM_FLIGHT_SUB = [
  "(필수) 항공 요금/환불 규정 안내",
  "(필수) 개인정보 수집 및 이용 동의",
  "(필수) 개인정보 제3자 제공 동의",
  "(필수) 개인정보 국외 이전 동의",
  "(필수) 고유식별정보 수집 및 처리 동의",
  "(필수) 결제 및 발권 동의",
  "(필수) 발권수수료",
  "(필수) 하나투어 항공 일반규정",
  "(필수) 항공사 정보 동의",
] as const;
const TERM_HOTEL_GROUP = "(필수) 내맘대로 호텔 약관";
const TERM_HOTEL_SUB = [
  "(필수) 예약 주의사항 동의",
  "(필수) 개인정보 수집 및 이용에 대한 동의",
  "(필수) 개인정보 제3자 제공에 대한 동의",
  "(선택) 마케팅 정보 수신 동의",
] as const;

const TERM_LINK_BLUE = "text-[#007AFF] underline decoration-[#007AFF]";

function TermLinkLabel({ text }: { text: string }) {
  const m = text.match(/^(\(필수\)|\(선택\))\s*(.+)$/);
  if (!m) {
    return <span className={`text-[13px] leading-snug ${TERM_LINK_BLUE}`}>{text}</span>;
  }
  return (
    <span className="text-[13px] leading-snug">
      <span className="text-[#111] font-['Pretendard:Medium',sans-serif]">{m[1]} </span>
      <span className={`font-['Pretendard:Medium',sans-serif] ${TERM_LINK_BLUE}`}>{m[2]}</span>
    </span>
  );
}

/** 체크 원 + 숨김 input (같은 id의 텍스트 label과 쌍으로 사용 — label 중첩 방지) */
function TermsCircleControl({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <>
      <input
        id={id}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label
        htmlFor={id}
        className={`flex size-[22px] shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#007AFF] peer-focus-visible:ring-offset-1 ${
          checked ? "border-white bg-[#4a1f94]" : "border-[#d1d1d1] bg-white"
        }`}
      >
        <Check
          className={`size-3.5 stroke-[2.8] text-white ${checked ? "opacity-100" : "opacity-0"}`}
          aria-hidden
        />
      </label>
    </>
  );
}

export interface NamemdaeHotelPrefill {
  nameKo: string;
  enLast: string;
  enFirst: string;
  birth: string;
  phone: string;
  email: string;
  genderFemale: boolean;
}

export interface NamemdaeHotelReservationContentProps {
  hotelInfo: HotelBookingInfo;
  prefill: NamemdaeHotelPrefill;
  onComplete: () => void;
}

export function NamemdaeHotelReservationContent({
  hotelInfo,
  prefill,
  onComplete,
}: NamemdaeHotelReservationContentProps) {
  const termFieldId = useId();
  const [guestInfoOpen, setGuestInfoOpen] = useState(true);
  const [requestsOpen, setRequestsOpen] = useState(true);
  const [nameKo, setNameKo] = useState(prefill.nameKo);
  const [enLast, setEnLast] = useState(prefill.enLast);
  const [enFirst, setEnFirst] = useState(prefill.enFirst);
  const [birth, setBirth] = useState(prefill.birth);
  const [phone, setPhone] = useState(prefill.phone);
  const [email, setEmail] = useState(prefill.email);
  const [genderFemale, setGenderFemale] = useState(prefill.genderFemale);

  const [reqBed1, setReqBed1] = useState(true);
  const [reqBed2, setReqBed2] = useState(false);
  const [reqNonSmoke, setReqNonSmoke] = useState(true);
  const [reqSmoke, setReqSmoke] = useState(false);
  const [reqHighFloor, setReqHighFloor] = useState(false);
  const [reqLate, setReqLate] = useState(false);
  const [lateCheckInHour, setLateCheckInHour] = useState("");
  const [lateCheckInMinute, setLateCheckInMinute] = useState("");

  const [termsSectionOpen, setTermsSectionOpen] = useState(true);
  const [standaloneTerm, setStandaloneTerm] = useState(true);
  const [flightChecks, setFlightChecks] = useState<boolean[]>(() => [...TERM_FLIGHT_SUB.map(() => true)]);
  const [hotelChecks, setHotelChecks] = useState<boolean[]>(() => [...TERM_HOTEL_SUB.map(() => true)]);
  const [flightTermsOpen, setFlightTermsOpen] = useState(true);
  const [hotelTermsOpen, setHotelTermsOpen] = useState(false);
  const [paymentInfoOpen, setPaymentInfoOpen] = useState(true);
  const [prePaymentNoticeOpen, setPrePaymentNoticeOpen] = useState(false);

  const total = hotelInfo.totalAmount;
  const roomSubtotal = Math.max(0, Math.round(total * 0.88));
  const fees = total - roomSubtotal;
  /** 캡처 UI — 항공 수수료 3행(발권 0 + 유류 + 제세)이 세금·수수료 합계와 맞도록 비율 분할 */
  const paxCount = 2;
  const airIssuanceFee = 0;
  const airFuelFee =
    fees <= 0 ? 0 : Math.max(0, Math.round((fees * 66000) / (66000 + 96800)));
  const airTaxFee = Math.max(0, fees - airIssuanceFee - airFuelFee);
  const breakdownPurple = "text-[#5D40D0] font-['Pretendard:Medium',sans-serif]";

  const allTermsAgreed =
    standaloneTerm &&
    flightChecks.every(Boolean) &&
    hotelChecks.every(Boolean);

  const setAllTerms = (v: boolean) => {
    setStandaloneTerm(v);
    setFlightChecks(TERM_FLIGHT_SUB.map(() => v));
    setHotelChecks(TERM_HOTEL_SUB.map(() => v));
  };

  const canPay =
    nameKo.trim() &&
    enLast.trim() &&
    enFirst.trim() &&
    birth.trim() &&
    phone.trim() &&
    email.trim() &&
    allTermsAgreed;

  const flightGroupAllChecked = flightChecks.every(Boolean);
  const hotelGroupAllChecked = hotelChecks.every(Boolean);

  const handlePayClick = () => {
    if (!canPay) return;
    setPrePaymentNoticeOpen(true);
  };

  const handlePayNoticeConfirm = () => {
    setPrePaymentNoticeOpen(false);
    onComplete();
  };

  return (
    <>
      <div className="px-5 pt-0 pb-28 flex-1 overflow-y-auto bg-white">
        <div className="-mx-5 px-5 pt-6 pb-0">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111] leading-tight text-center">
            {hotelInfo.hotelName}
          </h2>
          <div className="h-[2px] w-full bg-[#111] mt-6" role="separator" aria-hidden />
          <button
            type="button"
            onClick={() => setGuestInfoOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-3 py-4 text-left"
            aria-expanded={guestInfoOpen}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] shrink-0">
                투숙객 정보 입력
              </span>
              <RequiredBadge />
            </div>
            {guestInfoOpen ? (
              <ChevronUp className="size-5 text-[#111] shrink-0" aria-hidden />
            ) : (
              <ChevronDown className="size-5 text-[#111] shrink-0" aria-hidden />
            )}
          </button>
        </div>

        {guestInfoOpen ? (
          <section className="pt-0 pb-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center rounded px-2 py-0.5 text-[13px] font-['Pretendard:SemiBold',sans-serif] bg-[#f3e8ff] text-[#6b21a8] border border-[#e9d5ff]">
                객실 1
              </span>
              <span className="font-['Pretendard:Bold',sans-serif] font-medium text-[16px] text-[#111]">성인 1</span>
            </div>

            <button
              type="button"
              className="flex h-[45px] w-full flex-col items-start justify-center relative rounded-[12px] border border-[#e8e8e8] bg-white px-4 pr-12 text-left"
              aria-label="투숙객 이름 요약"
            >
              <span
                className={
                  nameKo.trim() || enLast.trim() || enFirst.trim()
                    ? "text-[16px] font-['Pretendard:Bold',sans-serif] text-[#111]"
                    : "text-[15px] font-['Pretendard:Medium',sans-serif] text-[#bbb]"
                }
              >
                {nameKo.trim() || enLast.trim() || enFirst.trim()
                  ? `${nameKo.trim()} : ${enLast.trim()}/ ${enFirst.trim()}`
                  : "이름을 입력하세요"}
              </span>
              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center leading-none text-[#999]"
                aria-hidden
              >
                <ChevronUp className="size-3.5 -mb-0.5" strokeWidth={2} />
                <ChevronDown className="size-3.5" strokeWidth={2} />
              </span>
            </button>

            <GuestLabeledField
              label="한글 성명"
              value={nameKo}
              onChange={(e) => setNameKo(e.target.value)}
              placeholder="한글 성명"
              autoComplete="name"
            />
            <GuestLabeledField
              label="영문 성"
              value={enLast}
              onChange={(e) => setEnLast(e.target.value.toUpperCase())}
              placeholder="영문 성 (ex. HONG)"
              autoComplete="family-name"
            />
            <GuestLabeledField
              label="영문 이름"
              value={enFirst}
              onChange={(e) => setEnFirst(e.target.value.toUpperCase())}
              placeholder="영문 이름 (ex. GILDONG)"
              autoComplete="given-name"
            />

            <div className="flex gap-2 items-stretch">
              <div className="min-w-0 flex-[0.65]">
                <GuestLabeledField
                  label="법정 생년월일"
                  value={birth}
                  onChange={(e) => setBirth(e.target.value)}
                  placeholder="YYYY.MM.DD"
                  inputMode="numeric"
                  autoComplete="bday"
                />
              </div>
              <div
                className="flex h-[50px] flex-[0.35] min-w-[112px] max-w-[140px] shrink-0 items-center justify-center gap-0.5 rounded-[12px] border border-[#e8e8e8] bg-white px-0"
                role="group"
                aria-label="성별"
              >
                <button
                  type="button"
                  onClick={() => setGenderFemale(false)}
                  className={`flex h-[50px] min-w-0 flex-1 flex-col items-center justify-center rounded-[10px] text-[15px] transition-colors ${
                    !genderFemale
                      ? "border-2 border-[#111] font-['Pretendard:Bold',sans-serif] text-[#111] bg-white"
                      : "border-2 border-transparent font-['Pretendard:Medium',sans-serif] text-[#999] bg-[unset]"
                  }`}
                >
                  남
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFemale(true)}
                  className={`flex h-[50px] min-w-0 flex-1 flex-col items-center justify-center rounded-[10px] text-[15px] transition-colors ${
                    genderFemale
                      ? "border-2 border-[#111] font-['Pretendard:Bold',sans-serif] text-[#111] bg-white"
                      : "border-2 border-transparent font-['Pretendard:Medium',sans-serif] text-[#999] bg-[unset]"
                  }`}
                >
                  여
                </button>
              </div>
            </div>

            <GuestLabeledField
              label="휴대폰 번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              inputMode="tel"
              autoComplete="tel"
            />
            <GuestLabeledField
              label="이메일 주소"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              autoComplete="email"
            />
          </section>
        ) : null}

        <SectionShadeDivider />

        <section>
          <button
            type="button"
            onClick={() => setRequestsOpen((o) => !o)}
            className="w-full flex items-center justify-between py-3.5 text-left"
            aria-expanded={requestsOpen}
          >
            <span className="font-['Pretendard:Bold',sans-serif] font-semibold text-[16px] text-[#111]">호텔 요청사항</span>
            {requestsOpen ? <ChevronUp className="size-5 text-[#111]" aria-hidden /> : <ChevronDown className="size-5 text-[#111]" aria-hidden />}
          </button>
          {requestsOpen && (
            <div className="pb-4 pt-0">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 pt-3">
                <HotelRequestOption
                  checked={reqBed1}
                  onCheckedChange={setReqBed1}
                  icon={Bed}
                  label="1 Bed"
                />
                <HotelRequestOption
                  checked={reqBed2}
                  onCheckedChange={setReqBed2}
                  icon={BedDouble}
                  label="2 Beds"
                />
                <HotelRequestOption
                  checked={reqNonSmoke}
                  onCheckedChange={setReqNonSmoke}
                  icon={CigaretteOff}
                  label="금연실"
                />
                <HotelRequestOption
                  checked={reqSmoke}
                  onCheckedChange={setReqSmoke}
                  icon={Cigarette}
                  label="흡연실"
                />
                <HotelRequestOption
                  checked={reqHighFloor}
                  onCheckedChange={setReqHighFloor}
                  icon={Building2}
                  label="고층"
                />
                <div aria-hidden className="min-h-[22px]" />
                <div className="col-span-2 flex flex-wrap items-center gap-2.5 gap-y-2">
                  <HotelRequestOption
                    checked={reqLate}
                    onCheckedChange={setReqLate}
                    icon={Clock}
                    label="늦은체크인"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="00"
                      value={lateCheckInHour}
                      onChange={(e) => setLateCheckInHour(e.target.value.replace(/\D/g, "").slice(0, 2))}
                      className="w-11 rounded-lg border border-[#e5e5e5] bg-white px-2 py-2 text-center text-[14px] text-[#111] placeholder:text-[#bbb] outline-none focus:border-[#ccc]"
                      aria-label="늦은 체크인 시"
                    />
                    <span className="text-[13px] text-[#666] shrink-0">시</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="00"
                      value={lateCheckInMinute}
                      onChange={(e) => setLateCheckInMinute(e.target.value.replace(/\D/g, "").slice(0, 2))}
                      className="w-11 rounded-lg border border-[#e5e5e5] bg-white px-2 py-2 text-center text-[14px] text-[#111] placeholder:text-[#bbb] outline-none focus:border-[#ccc]"
                      aria-label="늦은 체크인 분"
                    />
                    <span className="text-[13px] text-[#666] shrink-0">분</span>
                  </div>
                </div>
              </div>
              <p className="text-[12px] text-[#4f46e5] mt-4 leading-[1.5] pl-0.5">
                • 체크인 당일 호텔 사정에 따라 적용 여부 확인이 가능하며, 선택하신 객실 조건에 따라 요청 불가할 수 있습니다.
              </p>
            </div>
          )}
        </section>

        <SectionShadeDivider />

        <section className="pt-2 pb-5">
          <h3 className="mt-2.5 font-['Pretendard:Bold',sans-serif] font-semibold text-[16px] text-[#111] mb-4">선택 상품 확인</h3>
          <button
            type="button"
            className="flex h-[45px] w-full flex-col items-center justify-center rounded-full border border-[#e8e8e8] bg-white px-4 text-center text-[15px] font-['Pretendard:Medium',sans-serif] text-[#111] cursor-pointer hover:bg-[#fafafa] transition-colors"
          >
            항공+호텔 상세 일정 보기
          </button>
        </section>

        <SectionShadeDivider />

        <section className="py-5 -mx-5 px-5 bg-white">
          <button
            type="button"
            onClick={() => setTermsSectionOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-3 text-left mb-3"
            aria-expanded={termsSectionOpen}
          >
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <h3 className="font-['Pretendard:Bold',sans-serif] font-semibold text-[16px] text-[#111]">약관동의</h3>
              <RequiredBadge />
            </div>
            {termsSectionOpen ? (
              <ChevronUp className="size-5 text-[#111] shrink-0" aria-hidden />
            ) : (
              <ChevronDown className="size-5 text-[#111] shrink-0" aria-hidden />
            )}
          </button>

          {termsSectionOpen ? (
            <div className="space-y-3">
              <div className="rounded-[12px] bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <TermsCircleControl
                    id={`${termFieldId}-all`}
                    checked={allTermsAgreed}
                    onChange={(v) => setAllTerms(v)}
                  />
                  <label
                    htmlFor={`${termFieldId}-all`}
                    className="cursor-pointer pt-0.5 text-[14px] font-['Pretendard:Bold',sans-serif] text-[#111] leading-snug"
                  >
                    선택상품 필수 약관 전체 동의
                  </label>
                </div>
              </div>

              <div className="rounded-[12px] bg-white p-4 shadow-sm space-y-4">
                <div className="flex items-start gap-2.5">
                  <TermsCircleControl
                    id={`${termFieldId}-standalone`}
                    checked={standaloneTerm}
                    onChange={setStandaloneTerm}
                  />
                  <label
                    htmlFor={`${termFieldId}-standalone`}
                    className="min-w-0 flex-1 cursor-pointer pt-0.5 text-left"
                  >
                    <TermLinkLabel text={TERM_STANDALONE} />
                  </label>
                </div>

                <div className="border-t border-[#f0f0f0] pt-4">
                  <div className="flex items-start gap-2.5">
                    <TermsCircleControl
                      id={`${termFieldId}-flight-group`}
                      checked={flightGroupAllChecked}
                      onChange={(v) => setFlightChecks(TERM_FLIGHT_SUB.map(() => v))}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <label
                          htmlFor={`${termFieldId}-flight-group`}
                          className="min-w-0 flex-1 cursor-pointer pt-0.5 text-left"
                        >
                          <TermLinkLabel text={TERM_FLIGHT_GROUP} />
                        </label>
                        <button
                          type="button"
                          onClick={() => setFlightTermsOpen((o) => !o)}
                          className="shrink-0 p-1 -mr-1 text-[#111]"
                          aria-expanded={flightTermsOpen}
                          aria-label={flightTermsOpen ? "항공 약관 접기" : "항공 약관 펼치기"}
                        >
                          {flightTermsOpen ? (
                            <ChevronUp className="size-5" aria-hidden />
                          ) : (
                            <ChevronDown className="size-5" aria-hidden />
                          )}
                        </button>
                      </div>
                      {flightTermsOpen ? (
                        <ul className="mt-3 space-y-2.5">
                          {TERM_FLIGHT_SUB.map((text, i) => (
                            <li key={text}>
                              <div className="flex items-start gap-2.5">
                                <TermsCircleControl
                                  id={`${termFieldId}-flight-${i}`}
                                  checked={flightChecks[i] ?? false}
                                  onChange={(v) =>
                                    setFlightChecks((prev) => {
                                      const next = [...prev];
                                      next[i] = v;
                                      return next;
                                    })
                                  }
                                />
                                <label
                                  htmlFor={`${termFieldId}-flight-${i}`}
                                  className="min-w-0 flex-1 cursor-pointer pt-0.5"
                                >
                                  <TermLinkLabel text={text} />
                                </label>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#f0f0f0] pt-4">
                  <div className="flex items-start gap-2.5">
                    <TermsCircleControl
                      id={`${termFieldId}-hotel-group`}
                      checked={hotelGroupAllChecked}
                      onChange={(v) => setHotelChecks(TERM_HOTEL_SUB.map(() => v))}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <label
                          htmlFor={`${termFieldId}-hotel-group`}
                          className="min-w-0 flex-1 cursor-pointer pt-0.5 text-left"
                        >
                          <TermLinkLabel text={TERM_HOTEL_GROUP} />
                        </label>
                        <button
                          type="button"
                          onClick={() => setHotelTermsOpen((o) => !o)}
                          className="shrink-0 p-1 -mr-1 text-[#111]"
                          aria-expanded={hotelTermsOpen}
                          aria-label={hotelTermsOpen ? "호텔 약관 접기" : "호텔 약관 펼치기"}
                        >
                          {hotelTermsOpen ? (
                            <ChevronUp className="size-5" aria-hidden />
                          ) : (
                            <ChevronDown className="size-5" aria-hidden />
                          )}
                        </button>
                      </div>
                      {hotelTermsOpen ? (
                        <ul className="mt-3 space-y-2.5">
                          {TERM_HOTEL_SUB.map((text, i) => (
                            <li key={text}>
                              <div className="flex items-start gap-2.5">
                                <TermsCircleControl
                                  id={`${termFieldId}-hotel-${i}`}
                                  checked={hotelChecks[i] ?? false}
                                  onChange={(v) =>
                                    setHotelChecks((prev) => {
                                      const next = [...prev];
                                      next[i] = v;
                                      return next;
                                    })
                                  }
                                />
                                <label
                                  htmlFor={`${termFieldId}-hotel-${i}`}
                                  className="min-w-0 flex-1 cursor-pointer pt-0.5"
                                >
                                  <TermLinkLabel text={text} />
                                </label>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <SectionShadeDivider />

        <section className="pt-5 pb-4">
          <button
            type="button"
            onClick={() => setPaymentInfoOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-3 text-left mb-1"
            aria-expanded={paymentInfoOpen}
          >
            <h3 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">결제정보</h3>
            {paymentInfoOpen ? (
              <ChevronUp className="size-5 text-[#111] shrink-0" aria-hidden />
            ) : (
              <ChevronDown className="size-5 text-[#111] shrink-0" aria-hidden />
            )}
          </button>

          {paymentInfoOpen ? (
            <>
              <div className="flex justify-between items-baseline gap-3 mt-3 mb-2">
                <span className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">총 결제금액</span>
                <span className="font-['Pretendard:Bold',sans-serif] text-[17px] text-[#111] tabular-nums shrink-0">
                  {total.toLocaleString()}원
                </span>
              </div>
              <p className="text-[13px] font-['Pretendard:Medium',sans-serif] text-[#111] leading-[1.45] mb-4 font-normal">
                총 결제 금액은 항공,호텔 합산 비용으로 하기 내용을 포함하고 있습니다.
              </p>

              <div className="space-y-2.5 text-[14px] mb-5">
                <div className="flex justify-between gap-3 items-baseline">
                  <span className={`${breakdownPurple} text-left leading-snug`}>
                    항공권 발권수수료 X {paxCount}
                  </span>
                  <span className="font-['Pretendard:Medium',sans-serif] text-[#111] tabular-nums shrink-0">
                    {airIssuanceFee.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between gap-3 items-baseline">
                  <span className={`${breakdownPurple} text-left leading-snug`}>
                    항공권 유류할증료 X {paxCount}
                  </span>
                  <span className="font-['Pretendard:Medium',sans-serif] text-[#111] tabular-nums shrink-0">
                    {airFuelFee.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between gap-3 items-baseline">
                  <span className={`${breakdownPurple} text-left leading-snug`}>
                    항공권 제세공과금 X {paxCount}
                  </span>
                  <span className="font-['Pretendard:Medium',sans-serif] text-[#111] tabular-nums shrink-0">
                    {airTaxFee.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between gap-3 items-baseline">
                  <span className={`${breakdownPurple} text-left leading-snug`}>
                    객실 ({hotelInfo.roomTypeLabel})
                  </span>
                  <span className="font-['Pretendard:Medium',sans-serif] text-[#111] tabular-nums shrink-0">
                    {roomSubtotal.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="rounded-[10px] bg-[#f5f5f5] px-4 py-3.5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="size-[18px] text-[#666] shrink-0" strokeWidth={2} aria-hidden />
                  <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111]">결제 정보</span>
                </div>
                <ul className="space-y-2.5 text-[12px] text-[#666] font-['Pretendard:Medium',sans-serif] leading-[1.55] font-normal">
                  <li className="flex gap-1.5">
                    <span className="shrink-0">•</span>
                    <span>
                      항공 예약변경 및 환불 수수료는 별도이며, 상세요금은 선택 상품상세 일정보기{"> "}
                      항공요금환불규정을
                      확인바랍니다.
                    </span>
                  </li>
                  <li className="flex gap-1.5">
                    <span className="shrink-0">•</span>
                    <span>
                      유류할증료 및 제세공과금은 항공사 사정 및 환율 변동에 의해 매일 변경될 수 있습니다.
                    </span>
                  </li>
                  <li className="flex gap-1.5 text-[#5D40D0]">
                    <span className="shrink-0">•</span>
                    <span>
                      카드정보는 1회 입력이나, 카드 승인금액은 항공, 호텔 각 상품 별도 승인 되오니 이용에 참고해주시기
                      바랍니다.
                    </span>
                  </li>
                </ul>
              </div>
            </>
          ) : null}
        </section>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4 shrink-0">
        <button
          type="button"
          onClick={handlePayClick}
          disabled={!canPay}
          className="w-full py-4 bg-[#4a1f94] text-white rounded-[30px] text-[16px] font-['Pretendard:Bold',sans-serif] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[rgba(74,33,144,1)] transition-colors"
        >
          {total.toLocaleString()}원 결제하기
        </button>
      </div>

      <NamemdaeFlightHotelPayNoticeModal
        open={prePaymentNoticeOpen}
        hotelInfo={hotelInfo}
        onClose={() => setPrePaymentNoticeOpen(false)}
        onConfirm={handlePayNoticeConfirm}
      />
    </>
  );
}
