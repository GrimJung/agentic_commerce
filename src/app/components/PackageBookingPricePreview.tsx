import type { PackageData } from "./PackageCard";

const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;
const CHILD_RATE = 0.75;
/** 결제 시트와 동일하게 쿠폰 적용 금액(데모) */
export const PACKAGE_PREVIEW_COUPON_DISCOUNT = 10_000;

function parsePackageStartDate(departure: string): Date | null {
  const parts = departure.replace(/[^0-9.]/g, "").split(".").filter(Boolean);
  if (parts.length < 3) return null;
  const yRaw = parts[0] ?? "";
  const month = parts[1] ?? "01";
  const day = parts[2] ?? "01";
  const year = yRaw.length === 2 ? `20${yRaw}` : yRaw.length === 4 ? yRaw : `20${yRaw}`;
  const d = new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function packageNightsFromDuration(duration: string): number {
  const m = duration.match(/(\d+)박/);
  return m ? parseInt(m[1], 10) : 1;
}

function formatTripDateTime(d: Date, time: string, suffix: "출발" | "도착", airline: string): string {
  const yy = d.getFullYear().toString().slice(-2);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const w = WEEKDAYS_KO[d.getDay()];
  return `${yy}.${String(m).padStart(2, "0")}.${String(day).padStart(2, "0")}(${w}) ${time} ${suffix} · ${airline}`;
}

function flightLines(pkg: PackageData): { dep: string; ret: string } {
  const airline = pkg.airline ?? "대한항공";
  const outT = pkg.outboundFlightTime ?? "20:30";
  const inT = pkg.returnFlightTime ?? "12:30";
  const start = parsePackageStartDate(pkg.departure);
  if (!start) {
    return {
      dep: `${pkg.departure} ${outT} 출발 · ${airline}`,
      ret: `귀국 ${inT} 도착 · ${airline}`,
    };
  }
  const end = new Date(start);
  end.setDate(end.getDate() + packageNightsFromDuration(pkg.duration));
  return {
    dep: formatTripDateTime(start, outT, "출발", airline),
    ret: formatTripDateTime(end, inT, "도착", airline),
  };
}

export function computeTravelerGrossTotal(pkg: PackageData, adults: number, children: number): number {
  const a = Math.max(1, adults);
  const c = Math.max(0, children);
  return pkg.price * a + Math.round(pkg.price * CHILD_RATE) * c;
}

/** 인원 기준 총액(회원즉시·쿠폰 반영) — 인원 선택 UI·요약과 동일 숫자 */
export function computePackageEstimatedFinalPrice(pkg: PackageData, adults: number, children: number): number {
  const grossTotal = computeTravelerGrossTotal(pkg, adults, children);
  const memberInstant = Math.min(Math.floor(grossTotal * 0.05), 50_000);
  const afterMember = grossTotal - memberInstant;
  return Math.max(0, afterMember - PACKAGE_PREVIEW_COUPON_DISCOUNT);
}

/** 상품 썸네일·제목·항공 일정 (인원+금액 통합 카드 상단 등 재사용) */
export function PackageBookingTripSummary({ package: pkg }: { package: PackageData }) {
  const { dep, ret } = flightLines(pkg);
  return (
    <div className="flex gap-3">
      <div className="size-[72px] shrink-0 overflow-hidden rounded-[12px]">
        <img src={pkg.image} alt="" className="size-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] font-semibold leading-snug text-[#111] line-clamp-3">
          {pkg.title}
        </p>
        <div className="mt-2 space-y-1 font-['Pretendard',sans-serif] text-[11px] leading-relaxed text-[#555]">
          <p className="flex gap-1.5">
            <span className="shrink-0" aria-hidden>
              ✈️
            </span>
            <span>{dep}</span>
          </p>
          <p className="flex gap-1.5">
            <span className="shrink-0" aria-hidden>
              ✈️
            </span>
            <span>{ret}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/** 인원 라벨·회원할인 배지·최종금액·정가 취소선 (버튼 없음) */
export function PackageBookingPriceSummaryBlock({
  package: pkg,
  adults,
  children,
  className = "mt-4 border-t border-[#eee] pt-4",
}: {
  package: PackageData;
  adults: number;
  children: number;
  className?: string;
}) {
  const grossTotal = computeTravelerGrossTotal(pkg, adults, children);
  const finalPrice = computePackageEstimatedFinalPrice(pkg, adults, children);
  const paxLabel =
    children > 0 ? `성인 ${adults}, 아동 ${children}` : adults > 1 ? `성인 ${adults}` : "성인 1";

  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex shrink-0 flex-col items-start gap-0.5">
          <span className="mt-[5px] font-['Pretendard:Medium',sans-serif] text-[12px] text-[#666]">{paxLabel}</span>
          <span className="mt-[12px] font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111]">총 금액</span>
        </div>
        <div className="flex min-w-0 flex-col items-end text-right">
          <div className="mb-2 inline-flex shrink-0 items-center gap-0.5 rounded-[6px] border border-[#e0e0e0] bg-white px-2 py-1">
            <span className="font-['Pretendard:SemiBold',sans-serif] text-[11px] text-[#e91e8c]">
              회원 즉시 할인
            </span>
            <span className="font-['Pretendard:Medium',sans-serif] text-[11px] text-[#555]">적용가</span>
          </div>
          <span className="font-['Pretendard:Bold',sans-serif] text-[22px] font-bold leading-tight text-[#5e2bb8] tabular-nums">
            {finalPrice.toLocaleString()}원
          </span>
          <span className="font-['Pretendard:Medium',sans-serif] text-[13px] text-[#999] line-through tabular-nums decoration-[#bbb]">
            {grossTotal.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}

interface PackageBookingPricePreviewProps {
  package: PackageData;
  adults: number;
  children: number;
  onReserve: () => void;
  onCancel: () => void;
}

export function PackageBookingPricePreview({
  package: pkg,
  adults,
  children,
  onReserve,
  onCancel,
}: PackageBookingPricePreviewProps) {
  return (
    <div className="rounded-[18px] border border-[#f0f0f0] bg-white px-4 py-4 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
      <PackageBookingTripSummary package={pkg} />
      <PackageBookingPriceSummaryBlock package={pkg} adults={adults} children={children} />

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onReserve}
          className="min-w-0 flex-1 rounded-full bg-gradient-to-r from-[#7b5ce8] to-[#5e2bb8] py-3.5 font-['Pretendard:Bold',sans-serif] text-[14px] text-white shadow-[0_4px_14px_rgba(94,43,184,0.28)] transition-opacity hover:opacity-[0.96] active:opacity-90"
        >
          예약하러 가기
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 rounded-full border border-[#e0e0e0] bg-white px-5 py-3.5 font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#444] transition-colors hover:bg-[#f9f9f9]"
        >
          취소하기
        </button>
      </div>
    </div>
  );
}
