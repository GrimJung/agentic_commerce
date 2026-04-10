import { useLayoutEffect, useRef, useState } from "react";
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

/** 예: 인천출발 07.15(일) 20:30 ~ 07.22(토) 12:30 */
function formatIncheonDepartureSchedule(pkg: PackageData): string {
  const start = parsePackageStartDate(pkg.departure);
  if (!start) return `인천출발 ${pkg.departure}`;
  const end = new Date(start);
  end.setDate(end.getDate() + packageNightsFromDuration(pkg.duration));
  const outT = pkg.outboundFlightTime ?? "20:30";
  const inT = pkg.returnFlightTime ?? "12:30";
  return `인천출발 ${formatMonthDayWeekday(start)} ${outT} ~ ${formatMonthDayWeekday(end)} ${inT}`;
}

export function PackageInlineDetail({ package: pkg, onGoBack, onBooking }: PackageInlineDetailProps) {
  const [showFull, setShowFull] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const itinerary = buildItinerary(pkg);
  const visible = showFull ? itinerary : itinerary.slice(0, 2);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.focus({ preventScroll: true });
  }, []);

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      role="region"
      aria-label="상품 상세 정보"
      className="space-y-2.5 w-full scroll-mt-[60px] outline-none focus-visible:ring-2 focus-visible:ring-[#3780ff]/30 focus-visible:ring-offset-2 rounded-lg"
    >
      {/* 여행봇 안내 — 요약 카드 상단 (채팅 본문과 동일 톤) */}
      <div className="space-y-1 text-[14px] leading-[1.5] text-[#111] font-['Pretendard',sans-serif]">
        <p>상품 정보를 보기 쉽게 정리해드렸어요.</p>
        <p>일정과 포함내역 등 핵심정보 기준으로 정리해봤어요.</p>
      </div>

      {/* ── 1. 패키지 요약 카드 ───────────────────────── */}
      <div className="rounded-[16px] overflow-hidden bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.07)]">

        {/* 이미지 영역 — 14px 내부 패딩, 120px 높이 */}
        <div className="relative mx-[14px] mt-[13px] h-[120px] rounded-[12px] overflow-hidden">
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
          {/* 패키지 배지 — #F6F2FB 배경, #5E2BB8 텍스트, radius 4px */}
          <span className="absolute top-[9px] left-[9px] inline-flex items-center justify-center rounded-[4px] bg-[#F6F2FB] px-[6px] py-[4px] text-[10px] leading-[110%] text-[#5E2BB8]" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            패키지
          </span>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="mx-[14px]">
          {/* 제목 — Inter 13px/500, #1A1A2E */}
          <p className="mt-[6px] text-[13px] font-medium leading-[16px] text-[#1A1A2E] line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            {pkg.title}
          </p>

          {/* 출발확정 바 — #F0F0F0 배경, #EA362D 텍스트 10px */}
          <div className="mt-[6px] flex items-center h-[23px] rounded-[3px] bg-[#F0F0F0] px-[7px]">
            <span className="text-[10px] leading-[12px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="text-[#EA362D]">출발확정</span>
              <span className="text-[#666666]">
                {" "}
                예약 {pkg.bookedCount ?? 6}명 / 잔여 {pkg.availableSeats}명
              </span>
            </span>
          </div>

          {/* 출발 날짜 — #525252, 11px/500 */}
          <p className="mt-[6px] text-[11px] font-medium leading-[13px] text-[#525252]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {formatIncheonDepartureSchedule(pkg)}
          </p>

          {/* 2×2 정보 그리드 — 셀 border: #DCDCDC */}
          <div className="mt-[6px] grid grid-cols-2 border-t border-[#DCDCDC]">
            {[
              { label: "기간", value: pkg.duration },
              { label: "도시", value: pkg.destination.split(",")[0].trim() },
              { label: "항공", value: `${pkg.airline}·직항` },
              { label: "호텔", value: pkg.hotelGrade },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="px-[10px] py-[4px] border-b border-[#DCDCDC] border-t-0 border-l-0 border-r-0"
              >
                {/* 라벨 — #BBBBBB, 9px */}
                <p className="text-[9px] leading-[11px] text-[#BBBBBB]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {label}
                </p>
                {/* 값 — #1A1A2E, 12px/500 */}
                <p className="mt-[4px] text-[12px] font-medium leading-[15px] text-[#1A1A2E] line-clamp-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* 가격 영역 — #F7EDFF 배경, radius 10px */}
          <div className="my-[13px] flex items-center justify-between rounded-[10px] bg-[#F7EDFF] px-[12px] h-[36px]">
            <span className="text-[11px] leading-[13px] text-[#36264D]" style={{ fontFamily: "'Inter', sans-serif" }}>
              1인 기준
            </span>
            <span className="text-[13px] font-bold leading-[16px] text-[#5C3FD3] tabular-nums" style={{ fontFamily: "'Inter', sans-serif" }}>
              {pkg.price.toLocaleString()}원~
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. 상세 일정 ──────────────────────────────── */}
      <div className="rounded-[18px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#f0f0f0] px-4 pt-4 pb-0 overflow-hidden">
        <h4 className="font-['Pretendard:Bold',sans-serif] text-[14px] font-bold text-[#111] mb-3.5 border-0 border-b border-solid border-b-[var(--accent)] pb-[5px]">
          상세 일정
        </h4>

        {/* 아이템 목록 — 2일차까지 완전히 노출 */}
        <div>
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
        </div>

        {/* 접힌 상태: 아이템 아래 페이드 힌트 영역 + 더보기 버튼 */}
        {!showFull && itinerary.length > 2 && (
          <div className="relative h-[68px]">
            {/* 페이드 그라디언트 — 카드 배경(#fff)으로 서서히 사라짐 */}
            <div
              className="absolute inset-x-0 top-0 h-full pointer-events-none"
              style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 30%, #ffffff 70%)" }}
            />
            {/* 더보기 버튼 — 페이드 위에 위치 */}
            <div className="absolute inset-x-0 bottom-0 pb-3">
              <button
                type="button"
                onClick={() => setShowFull(true)}
                className="w-full py-2 rounded-full border border-[#e0e0e0] bg-white font-['Pretendard:SemiBold',sans-serif] text-[12px] text-[#555] shadow-sm hover:bg-[#f5f5f5] transition-colors"
              >
                더보기 ({itinerary.length - 2}개 일정 더 보기)
              </button>
            </div>
          </div>
        )}

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
        </div>
      )}

      {/* 펼친 상태: 접기 — 액션 버튼보다 한 단계 낮은 보조 컨트롤(작은 텍스트·무테두리) */}
      {showFull && itinerary.length > 2 && (
        <div className="flex justify-center -mt-1 mb-0.5">
          <button
            type="button"
            onClick={() => setShowFull(false)}
            className="py-1.5 px-3 text-[12px] font-medium font-['Pretendard',sans-serif] text-[#9a9a9a] hover:text-[#666] rounded-lg hover:bg-[#f3f3f3] transition-colors"
            aria-label="일정 접기"
          >
            접기
          </button>
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
          className="flex-1 py-3 rounded-full bg-[#5e2bb8] font-['Pretendard:SemiBold',sans-serif] text-[13px] text-white hover:bg-[#4e239a] active:bg-[#3e1c7a] transition-colors shadow-sm"
        >
          상품 예약하기
        </button>
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
