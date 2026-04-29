import { useLayoutEffect, useRef, useState } from "react";
import {
  scrollPackageSwipeFollowupIntoView,
  scheduleScrollPackageSwipeFollowup,
} from "../utils/scrollPackageSwipeFollowup";
import icLikeFilled from "../../assets/icons/ic-like.svg?url";
import icLikeOutline from "../../assets/icons/ic-like-1.svg?url";
import { PackageData } from "./PackageCard";

interface PackageInlineDetailProps {
  package: PackageData;
  onGoBack: () => void;
  onBooking: () => void;
}

/** 일차 배지: 연한 배경 + 포인트 컬러 텍스트, 모서리 8px */
const DAY_BADGE_STYLES: { bg: string; fg: string }[] = [
  { bg: "#FFF3E0", fg: "#FF8A02" },
  { bg: "#F7EDFF", fg: "#6244DC" },
  { bg: "#F7EDFF", fg: "#6244DC" },
  { bg: "#E5F8FB", fg: "#00B4D8" },
  { bg: "#E6FAF4", fg: "#06D6A0" },
];

function buildItinerary(pkg: PackageData) {
  const city = pkg.destination.split(",")[0].trim();
  return [
    { route: `인천 → ${city}`, desc: `인천을 출발해 ${city}에 도착 후 호텔에 체크인` },
    ...pkg.highlights.slice(0, 4).map((h) => ({ route: city, desc: h })),
    { route: `${city} → 인천`, desc: "공항으로 이동 후 인천으로 귀국" },
  ];
}

// 포함/불포함/선택경비 섹션 라벨
const SECTION_THEME = {
  include: { label: "포함내역" },
  exclude: { label: "불포함 내역" },
  optional: { label: "선택경비" },
} as const;

const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

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

function formatMonthDayWeekday(d: Date): string {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const w = WEEKDAYS_KO[d.getDay()];
  return `${String(m).padStart(2, "0")}.${String(day).padStart(2, "0")}(${w})`;
}

/** 일정 바: '인천출발' 옆에 붙는 시각 구간만 */
function formatIncheonDepartureScheduleParts(pkg: PackageData): { timeRange: string } {
  const start = parsePackageStartDate(pkg.departure);
  if (!start) return { timeRange: pkg.departure };
  const end = new Date(start);
  end.setDate(end.getDate() + packageNightsFromDuration(pkg.duration));
  const outT = pkg.outboundFlightTime ?? "20:30";
  const inT = pkg.returnFlightTime ?? "12:30";
  return {
    timeRange: `${formatMonthDayWeekday(start)} ${outT} ~ ${formatMonthDayWeekday(end)} ${inT}`,
  };
}

export function PackageInlineDetail({ package: pkg, onGoBack, onBooking }: PackageInlineDetailProps) {
  const [showFull, setShowFull] = useState(false);
  const [liked, setLiked] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const itinerary = buildItinerary(pkg);
  const visible = showFull ? itinerary : itinerary.slice(0, 2);

  useLayoutEffect(() => {
    scheduleScrollPackageSwipeFollowup();
    const id = window.setTimeout(() => scrollPackageSwipeFollowupIntoView("smooth"), 360);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      role="region"
      aria-label="상품 상세 정보"
      className="space-y-2.5 w-full scroll-mt-[60px] outline-none focus-visible:ring-2 focus-visible:ring-[#6329C4]/30 focus-visible:ring-offset-2 rounded-lg"
    >
      {/* 상품별 LLM 추천 요약 — PackageData.recommendReason */}
      <p className="mx-0 mt-0 mb-2 text-[14px] leading-relaxed text-[#111] font-['Pretendard',sans-serif]">
        {pkg.recommendReason}
      </p>

      {/* ── 1. 패키지 요약 카드 (캡처 UI: 이미지·출발확정 배지·평점행·일정 바·3×2 그리드·가격) ── */}
      <div className="rounded-[16px] overflow-hidden bg-white border border-[#f0f0f0] shadow-[0px_2px_12px_rgba(0,0,0,0.07)]">

        {/* 이미지 영역 */}
        <div className="relative mx-[14px] mt-[13px] h-[120px] rounded-[12px] overflow-hidden">
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
          <span
            className="absolute top-2 left-2 inline-flex items-center justify-center rounded-[4px] bg-[#2ecc71] px-[7px] py-[4px] text-[10px] font-semibold leading-[110%] text-white"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            출발확정
          </span>
          <button
            type="button"
            aria-label={liked ? "찜 해제" : "찜하기"}
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
            className="absolute bottom-1.5 right-1.5 flex size-8 items-center justify-center rounded-full bg-transparent p-0 transition-opacity hover:opacity-90 active:opacity-80"
          >
            <img
              src={liked ? icLikeFilled : icLikeOutline}
              alt=""
              width={24}
              height={24}
              className="size-6 select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.28)]"
              draggable={false}
            />
          </button>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="mx-[14px] mb-[13px]">
          <p
            className="mt-2 text-[15px] font-semibold leading-snug text-[#1A1A2E] line-clamp-2"
            style={{ fontFamily: "'Pretendard', 'Inter', sans-serif" }}
          >
            {pkg.title}
          </p>

          {/* 평점 + 한줄평 | 예약/잔여 */}
          <div className="mt-2 flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <svg className="size-[14px] shrink-0 text-[#4a1f94]" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M8 0L10.472 5.008L16 5.856L12 9.712L12.944 15.232L8 12.616L3.056 15.232L4 9.712L0 5.856L5.528 5.008L8 0Z" />
              </svg>
              <span
                className="shrink-0 text-[13px] font-semibold tabular-nums text-[#1A1A2E]"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                {Number.isInteger(pkg.rating) ? String(pkg.rating) : pkg.rating.toFixed(1)}
              </span>
              {pkg.ratingSnippet ? (
                <span
                  className="min-w-0 truncate text-[11px] font-normal text-[#666]"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  {pkg.ratingSnippet}
                </span>
              ) : null}
            </div>
            <p
              className="shrink-0 text-right text-[10px] leading-tight text-[#888]"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              예약 {pkg.bookedCount ?? 6}명 / 잔여 {pkg.availableSeats}명
            </p>
          </div>

          {/* 인천출발 일정 하이라이트 바 */}
          <div
            className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-[8px] bg-[#f3f4f6] px-2.5 py-2"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            <span className="text-[12px] font-semibold text-[#6329C4]">인천출발</span>
            <span className="text-[12px] font-medium text-[#1A1A2E] tabular-nums">
              {formatIncheonDepartureScheduleParts(pkg).timeRange}
            </span>
          </div>

          {/* 3×2 정보 그리드 */}
          <div
            className="mt-2.5 border-t border-[#ebebeb]"
            style={{ fontFamily: "'Pretendard', 'Inter', sans-serif" }}
          >
            <div className="grid grid-cols-3">
              {[
                { label: "기간", value: pkg.duration },
                { label: "방문도시", value: pkg.destination.split(",")[0].trim() },
                { label: "자유일정", value: pkg.freeSchedule ?? "—" },
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  className={[
                    "border-b border-[#ebebeb] px-2 py-2.5",
                    i < 2 ? "border-r border-[#ebebeb]" : "",
                  ].join(" ")}
                >
                  <p className="text-[9px] leading-[11px] text-[#aaa]">{label}</p>
                  <p className="mt-1 text-[12px] font-semibold leading-[15px] text-[#1A1A2E] line-clamp-2">{value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3">
              {[
                { label: "항공", value: `${pkg.airline}·직항` },
                { label: "호텔", value: pkg.hotelGrade },
                { label: "쇼핑", value: pkg.shopping ?? "—" },
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  className={[
                    "px-2 py-2.5",
                    i < 2 ? "border-r border-[#ebebeb]" : "",
                  ].join(" ")}
                >
                  <p className="text-[9px] leading-[11px] text-[#aaa]">{label}</p>
                  <p className="mt-1 text-[12px] font-semibold leading-[15px] text-[#1A1A2E] line-clamp-2">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. 상세 일정 ──────────────────────────────── */}
      <div className="rounded-[18px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#f0f0f0] px-4 pt-4 pb-0 overflow-hidden">
        <h4 className="font-['Pretendard:Bold',sans-serif] text-[14px] font-bold text-[#111] mb-3.5 border-0 border-b border-solid border-b-[var(--accent)] pb-[5px]">
          상세 일정
        </h4>

        {/* 아이템 목록 — 접힘 시 하단(2일차 일부)에 흰색 페이드 + 더보기 겹침 */}
        <div className={!showFull && itinerary.length > 2 ? "relative pb-[52px]" : undefined}>
          {visible.map((day, i) => {
            const isLastRow = i === visible.length - 1;
            const rowBorder = isLastRow
              ? ""
              : "border-0 border-b border-solid border-b-[var(--accent)] [border-image:none]";
            return (
            <div
              key={i}
              className={[i > 0 ? "flex gap-3 mt-[10px] mb-0 h-[45px]" : "flex gap-3", rowBorder].filter(Boolean).join(" ")}
            >
              {/* 타임라인 */}
              <div className="flex flex-col items-center">
                <div
                  className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[10px] font-semibold font-['Pretendard:Bold',sans-serif] shrink-0"
                  style={{
                    backgroundColor: DAY_BADGE_STYLES[i % DAY_BADGE_STYLES.length].bg,
                    color: DAY_BADGE_STYLES[i % DAY_BADGE_STYLES.length].fg,
                  }}
                >
                  D{i + 1}
                </div>
              </div>

              {/* 텍스트 */}
              <div className={`flex-1 ${i < visible.length - 1 ? "pb-3" : "pb-2"}`}>
                <p className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111] leading-snug">
                  {day.route}
                </p>
                <p className="text-[12px] text-[#777] mt-0.5 leading-relaxed">{day.desc}</p>
              </div>
            </div>
            );
          })}

          {!showFull && itinerary.length > 2 && (
            <>
              {/* 2일차 하단을 덮는 흰색 투명 그라데이션 — 더보기 클릭 시(showFull) 비표시 */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[104px]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.65) 28%, rgba(255, 255, 255, 0.9) 58%, rgba(255, 255, 255, 1) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 z-[2] pb-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFull(true)}
                  className="w-full py-2 rounded-full border border-[#e0e0e0] bg-white font-semibold font-['Pretendard:SemiBold',sans-serif] text-[12px] text-[#555] shadow-sm hover:bg-[#f5f5f5] transition-colors"
                >
                  일정 및 포함∙불포함 내역 더보기
                </button>
              </div>
            </>
          )}
        </div>

        <div className="h-1" />
      </div>

      {/* ── 3. 포함 / 불포함 / 선택경비 (일정 더보기 펼친 뒤에만 표시, 또는 일정이 짧아 더보기 없을 때 항상 표시) ── */}
      {(showFull || itinerary.length <= 2) && (
        <div className="rounded-[18px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#f0f0f0] overflow-hidden">
          {/* 포함내역 */}
          <SectionBlock
            theme={SECTION_THEME.include}
            items={[
              "왕복항공권, 전용",
              "국내공항세, 현지공항세, 관광진흥개발기금, 전쟁보험료, 유류할증료, 투어리스트 텍스",
            ]}
          />
          {/* 불포함내역 */}
          <SectionBlock
            theme={SECTION_THEME.exclude}
            items={[
              "가이드/기사 경비 : 인당 CHF 90(단, 15명 미만시 20~30 유로 추가 지불)",
              "기타 : 가격문의 (자유시간 시 식사비 (총3회)) 개인 여행경비(물값, 자유시간시 개인비용 등)",
              "각종 매너팁(테이블팁, 객실팁, 포터비, 마사지팁 등)",
            ]}
          />
          {/* 선택경비 */}
          <SectionBlock
            theme={SECTION_THEME.optional}
            items={["항공리턴변경(문의)", "객실 1인 사용 시 추가 비용"]}
          />
          {showFull && itinerary.length > 2 && (
            <div className="px-4 pb-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFull(false)}
                className="w-full py-2 rounded-full border border-[#e0e0e0] bg-white font-semibold font-['Pretendard:SemiBold',sans-serif] text-[12px] text-[#555] shadow-sm hover:bg-[#f5f5f5] transition-colors"
                aria-label="일정 접기"
              >
                접기
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── 4. 액션 버튼 ──────────────────────────────── */}
      <div className="flex gap-2 pt-0.5">
        <button
          type="button"
          onClick={onGoBack}
          className="flex-1 py-3 rounded-full border border-[#ddd] bg-white font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#444] hover:bg-[#f5f5f5] transition-colors"
        >
          추천 상품 목록가기
        </button>
        <button
          type="button"
          onClick={onBooking}
          className="flex-1 py-3 rounded-full bg-[#4a1f94] font-['Pretendard:SemiBold',sans-serif] text-[13px] text-white hover:bg-[#4e239a] active:bg-[#3e1c7a] transition-colors shadow-sm"
        >
          금액 확인하기
        </button>
      </div>

      {/* ── H-AI TIP (상세 하단 · 목록/비교 UI와 동일 톤) ── */}
      <div
        className="w-full border-t border-[#f0f0f0] pt-[15px] scroll-mt-4"
        role="region"
        aria-label="H-AI 추천 안내"
        data-package-swipe-followup-anchor=""
      >
        <p className="text-[14px] leading-relaxed text-[#111] m-0">
          <span className="mr-1" aria-hidden>
            💡
          </span>
          <span className="font-['Pretendard:Bold',sans-serif] text-[rgba(55,127,255,1)]">H-AI TIP</span>
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[#444] m-0">관련해서 이런 질문도 이어갈 수 있어요.</p>
        <ul className="mt-1.5 space-y-1.5 pl-0.5 text-[14px] text-[#333] list-none m-0 p-0">
          <li>• 포함·불포함 항목만 짧게 정리해줘.</li>
          <li>• 비슷한 일정인데 가격대가 다른 상품도 추천해줘.</li>
        </ul>
      </div>
    </div>
  );
}

// 포함/불포함/선택경비 섹션 블록
function SectionBlock({
  theme,
  items,
}: {
  theme: { label: string };
  items: string[];
}) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-2 mb-2 border-0 border-b border-solid border-b-[var(--accent)] pb-[5px]">
        <h4 className="font-['Pretendard:Bold',sans-serif] text-[14px] font-bold text-[#111]">{theme.label}</h4>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-1.5 text-[12px] text-[#555] leading-relaxed">
            <span className="text-[#ccc] shrink-0 mt-px">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
