import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { PackageData } from "./PackageCard";
import {
  PackageBookingTripSummary,
  PackageBookingPriceSummaryBlock,
} from "./PackageBookingPricePreview";

const ROW_BG = "rgba(94, 43, 184, 0.06)";

/** 아동 나이 선택: 0세 ~ 만 17세 */
const CHILD_AGE_MIN = 0;
const CHILD_AGE_MAX = 17;
const CHILD_AGE_OPTIONS = Array.from(
  { length: CHILD_AGE_MAX - CHILD_AGE_MIN + 1 },
  (_, i) => CHILD_AGE_MIN + i,
);

function formatChildAgeLabel(y: number): string {
  if (y === 0) return "0세";
  return `만 ${y}세`;
}

/** 인원+금액 확인을 한 카드에서 처리. 취소 시에만 `cancelled` */
export type TravelerCountA2UIPhase = "editing" | "cancelled";

interface TravelerCountA2UIProps {
  package: PackageData;
  onConfirm: (adults: number, children: number, childAges: number[]) => void;
  onCancel: () => void;
  /** 스와이프 패널 등 부모가 단계별로 안내 문구를 바꿀 때 사용 */
  onPhaseChange?: (phase: TravelerCountA2UIPhase) => void;
}

function StepperRow({
  title,
  subtitle,
  value,
  onDec,
  onInc,
  min,
  max,
}: {
  title: string;
  subtitle: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  min: number;
  max: number;
}) {
  const atMin = value <= min;
  const atMax = value >= max;
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-[14px] px-3.5 py-3"
      style={{ backgroundColor: ROW_BG }}
    >
      <div className="min-w-0">
        <p className="font-['Pretendard:Bold',sans-serif] text-[15px] text-[#111]">{title}</p>
        <p className="mt-0.5 font-['Pretendard',sans-serif] text-[12px] text-[#888]">{subtitle}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <button
          type="button"
          aria-label={`${title} 한 명 줄이기`}
          disabled={atMin}
          onClick={onDec}
          className="flex size-9 items-center justify-center rounded-full border border-[#d4c4f0] bg-white text-[#4a1f94] transition-opacity disabled:opacity-35 disabled:pointer-events-none hover:bg-[#faf8ff]"
        >
          <Minus className="size-4" strokeWidth={2.25} />
        </button>
        <span className="min-w-[1.25rem] text-center font-['Pretendard:Bold',sans-serif] text-[17px] text-[#111] tabular-nums">
          {value}
        </span>
        <button
          type="button"
          aria-label={`${title} 한 명 늘리기`}
          disabled={atMax}
          onClick={onInc}
          className="flex size-9 items-center justify-center rounded-full bg-[#4a1f94] text-white shadow-[0_2px_8px_rgba(99,41,196,0.35)] transition-opacity disabled:opacity-35 disabled:pointer-events-none hover:bg-[#4e239a]"
        >
          <Plus className="size-4" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}

/**
 * 채팅 내 A2UI — 상품 요약 + 인원(성인/아동) + 금액 확인을 한 step 카드에서 처리 후 예약으로 진행
 */
export function TravelerCountA2UI({
  package: pkg,
  onConfirm,
  onCancel,
  onPhaseChange,
}: TravelerCountA2UIProps) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState<number[]>([]);
  const [phase, setPhase] = useState<TravelerCountA2UIPhase>("editing");

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  useEffect(() => {
    setChildAges((prev) => {
      if (children === prev.length) return prev;
      if (children > prev.length) {
        const add = Array.from({ length: children - prev.length }, () => 0);
        return [...prev, ...add];
      }
      return prev.slice(0, children);
    });
  }, [children]);

  if (phase === "cancelled") {
    return (
      <div className="rounded-[18px] border border-[#f0f0f0] bg-[#fafafa] px-4 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
        <p className="font-['Pretendard:Medium',sans-serif] text-[13px] text-[#888]">인원 선택이 취소되었습니다.</p>
      </div>
    );
  }

  const confirmReserve = () => {
    const ages = Array.from({ length: children }, (_, i) => childAges[i] ?? 0);
    onConfirm(adults, children, ages);
  };

  return (
    <div
      className="isolate rounded-[18px] border border-[#f0f0f0] bg-white px-4 py-4 shadow-[0_2px_16px_rgba(0,0,0,0.08)] [transform:translateZ(0)] [backface-visibility:hidden]"
      style={{ WebkitBackfaceVisibility: "hidden" }}
    >
      <PackageBookingTripSummary package={pkg} />

      <div className="mt-4 border-t border-[#eee] pt-4">
        <h2 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">여행 인원 수</h2>
        <div className="mt-4 space-y-3">
          <StepperRow
            title="성인"
            subtitle="만 18세 이상"
            value={adults}
            min={1}
            max={9}
            onDec={() => setAdults((n) => Math.max(1, n - 1))}
            onInc={() => setAdults((n) => Math.min(9, n + 1))}
          />
          <StepperRow
            title="아동"
            subtitle="만 17세 이하"
            value={children}
            min={0}
            max={9}
            onDec={() => setChildren((n) => Math.max(0, n - 1))}
            onInc={() => setChildren((n) => Math.min(9, n + 1))}
          />
          {children > 0 && (
            <div className="pt-1">
              <div className="grid grid-cols-3 gap-2">
                {childAges.slice(0, children).map((age, idx) => (
                  <label
                    key={idx}
                    className="flex min-w-0 flex-col gap-1 font-['Pretendard',sans-serif] text-[11px] text-[#888]"
                  >
                    <span className="truncate">아동 {idx + 1}</span>
                    <select
                      value={age}
                      aria-label={`아동 ${idx + 1} 만나이`}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setChildAges((prev) => {
                          const next = [...prev];
                          next[idx] = v;
                          return next;
                        });
                      }}
                      className="w-full rounded-[10px] border border-[#e0d4f5] bg-white py-2 pl-2 pr-1 font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111] shadow-sm outline-none focus:border-[#4a1f94] focus:ring-1 focus:ring-[#4a1f94]/30"
                    >
                      {CHILD_AGE_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {formatChildAgeLabel(y)}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <PackageBookingPriceSummaryBlock package={pkg} adults={adults} children={children} />

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={confirmReserve}
          className="min-w-0 flex-1 rounded-full bg-gradient-to-r from-[#7c4ddb] to-[#6329C4] py-3.5 font-['Pretendard:Bold',sans-serif] text-[14px] text-white shadow-[0_4px_14px_rgba(99,41,196,0.28)] transition-opacity hover:opacity-[0.96] active:opacity-90"
        >
          예약하러 가기
        </button>
        <button
          type="button"
          onClick={() => {
            setPhase("cancelled");
            onCancel();
          }}
          className="shrink-0 rounded-full border border-[#e0e0e0] bg-white px-5 py-3.5 font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#444] transition-colors hover:bg-[#f9f9f9]"
        >
          취소하기
        </button>
      </div>
    </div>
  );
}
