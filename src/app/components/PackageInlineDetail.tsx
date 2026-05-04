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

/** 상단 카드: 방문 도시·숙박 요약 (캡처형 `발리(3) → 싱가포르(1)` 등) */
function formatVisitRouteSummary(pkg: PackageData): string {
  const nights = packageNightsFromDuration(pkg.duration);
  const parts = pkg.destination.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
  const primary = parts[0] ?? pkg.destination.trim();
  if (parts.length < 2) return `${primary}(${nights})`;

  const second = parts[1];
  const countryLike =
    /^(인도네시아|프랑스|일본|그리스|태국|베트남|미국|중국|스페인|이탈리아|호주|캐나다|영국)$/.test(second) ||
    second.length > 8;
  if (countryLike) {
    if (primary.includes("발리") && second.includes("인도네시아")) {
      const n1 = Math.max(1, nights - 1);
      return `발리(${n1}) → 싱가포르(1)`;
    }
    return `${primary}(${nights})`;
  }
  const n2 = 1;
  const n1 = Math.max(1, nights - n2);
  return `${primary}(${n1}) → ${second}(${n2})`;
}

function hasOptionalTourHighlight(pkg: PackageData): boolean {
  return pkg.highlights.some((h) => /선택|옵션|유료\s*관광|디즈니/.test(h));
}

function buildSummaryTagPills(pkg: PackageData): { emphasis: string[]; muted: string[] } {
  const flightWord = pkg.flightType?.includes("경유") ? "경유" : "직항";
  const emphasis: string[] = [
    pkg.duration,
    pkg.airline,
    flightWord,
    pkg.hotelGrade,
    "단체여행",
  ];
  if (hasOptionalTourHighlight(pkg)) emphasis.push("선택관광 있음");
  else if (pkg.freeSchedule === "있음") emphasis.push("자유일정 있음");

  const shop = (pkg.shopping ?? "—").replace(/\s/g, "");
  const muted: string[] = [`쇼핑${shop === "없음" ? "없음" : shop}`];
  muted.push("가이드경비 없음");
  return { emphasis, muted };
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
  const summaryTags = buildSummaryTagPills(pkg);

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

      {/* ── 1. 패키지 요약 카드 (캡처 UI: 풀블리드 이미지·일정 바·위치 한 줄·필 태그) ── */}
      <div className="overflow-hidden rounded-[24px] border border-[#f0f0f0] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
        {/* 이미지 영역 — 카드 상단 풀폭, 모서리는 카드 overflow로 맞춤 */}
        <div className="relative h-[152px] w-full overflow-hidden">
          <img src={pkg.image} alt={pkg.title} className="size-full object-cover" />
          <span
            className="absolute left-3 top-3 inline-flex items-center justify-center rounded-md bg-[#22c55e] px-2 py-1 text-[11px] font-semibold leading-none text-white"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            출발확정
          </span>
          <button
            type="button"
            aria-label={liked ? "찜 해제" : "찜하기"}
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
            className="absolute bottom-2.5 right-2.5 flex size-9 items-center justify-center rounded-full bg-transparent p-0 transition-opacity hover:opacity-95 active:opacity-90"
          >
            <img
              src={liked ? icLikeFilled : icLikeOutline}
              alt=""
              width={22}
              height={22}
              className="size-[22px] select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.28)]"
              draggable={false}
            />
          </button>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="px-5 pb-5 pt-3.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
          <p
            className="text-[16px] font-semibold leading-snug tracking-[-0.02em] text-[#111] line-clamp-2"
            style={{ fontFamily: "'Pretendard', 'Inter', sans-serif" }}
          >
            {pkg.title}
          </p>

          {/* 평점 + 한줄평 | 예약/잔여 */}
          <div className="mt-2.5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <svg className="size-[15px] shrink-0 text-[#6329C4]" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M8 0L10.472 5.008L16 5.856L12 9.712L12.944 15.232L8 12.616L3.056 15.232L4 9.712L0 5.856L5.528 5.008L8 0Z" />
              </svg>
              <span className="shrink-0 text-[14px] font-bold tabular-nums text-[#111]">
                {Number.isInteger(pkg.rating) ? String(pkg.rating) : pkg.rating.toFixed(1)}
              </span>
              {pkg.ratingSnippet ? (
                <span className="min-w-0 truncate text-[12px] font-normal text-[#666]">{pkg.ratingSnippet}</span>
              ) : null}
            </div>
            <p className="shrink-0 text-right text-[11px] leading-tight text-[#888] tabular-nums">
              예약 {pkg.bookedCount ?? 6}명/잔여 {pkg.availableSeats}명
            </p>
          </div>

          {/* 인천출발 일정 하이라이트 바 */}
          <div className="mt-3 flex flex-nowrap items-center justify-center gap-x-1.5 gap-y-1 text-left rounded-xl bg-[#f3f4f6] px-3 py-2.5">
            <span className="text-[13px] font-semibold text-[#2563eb]">인천출발</span>
            <span className="text-[13px] font-medium leading-snug text-[#111] tabular-nums">
              {formatIncheonDepartureScheduleParts(pkg).timeRange}
            </span>
          </div>

          {/* 위치 한 줄 + 구분선 */}
          <div className="mt-3 flex items-center gap-1.5 border-b border-[#ebebeb] pb-3">
            <svg
              className="size-[18px] shrink-0 text-[#111]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z" />
              <circle cx="12" cy="11" r="2.5" fill="currentColor" stroke="none" />
            </svg>
            <span className="min-w-0 text-[13px] font-medium text-[#111]">{formatVisitRouteSummary(pkg)}</span>
          </div>

          {/* 필 태그 */}
          <div className="mt-3 flex flex-wrap gap-2">
            {summaryTags.emphasis.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-[#6329C4]/40 bg-[#f5f0ff] px-2.5 py-1 text-[11px] font-semibold text-[#6329C4]"
              >
                {t}
              </span>
            ))}
            {summaryTags.muted.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-[#e5e5e5] bg-[#f7f7f7] px-2.5 py-1 text-[11px] font-medium text-[#888]"
              >
                {t}
              </span>
            ))}
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
