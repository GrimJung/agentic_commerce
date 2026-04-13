import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { X, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { PackageData } from "./PackageCard";
import { Skeleton } from "./ui/skeleton";

const COMPANION_OPTIONS = [
  { id: "children", label: "아이동반" },
  { id: "parents", label: "부모님효도" },
  { id: "couple", label: "커플·부부" },
  { id: "friends", label: "친구·모임" },
] as const;

const PURPOSE_OPTIONS = [
  { id: "relaxation", label: "휴양·힐링" },
  { id: "activity", label: "액티비티" },
  { id: "shopping", label: "쇼핑·맛집" },
  { id: "sightseeing", label: "관광중심" },
] as const;

const STYLE_OPTIONS = [
  { id: "relaxed", label: "여유로운일정" },
  { id: "packed", label: "알찬일정" },
  { id: "budget", label: "가성비추구" },
  { id: "satisfaction", label: "만족도중시" },
] as const;

const COMPANION_TIPS: Record<string, string> = {
  children: "아이와 함께라면 이동이 길지 않고 동선이 편하며, 자유시간이나 키즈 친화 일정이 포함된 상품을 우선 살펴보세요.",
  parents: "부모님과 함께라면 이동이 무리되지 않고 휴식 시간이 충분하며, 숙소와 식사 만족도가 안정적인 상품을 선택해보세요.",
  couple: "두 분만의 시간을 즐기고 싶다면 자유시간이 포함되어 있고, 분위기 좋은 숙소나 특식이 포함된 일정을 고려해보세요.",
  friends: "함께 즐기는 여행이라면 액티비티 선택 폭이 넓고, 자유시간과 즐길 요소가 균형 있게 구성된 상품을 추천드려요.",
};

/** 라벨 열은 좁게, 상품 A·B·C 열에 폭을 더 할당 */
const TABLE_GRID = { display: "grid", gridTemplateColumns: "minmax(28px, 38px) repeat(3, minmax(0, 1fr))" };

/** 라벨 열 폭 축소용: Unicode 코드포인트 기준 2글자마다 줄바꿈 */
function splitLabelEveryTwoChars(label: string): string {
  const chars = Array.from(label);
  const lines: string[] = [];
  for (let i = 0; i < chars.length; i += 2) {
    lines.push(chars.slice(i, i + 2).join(""));
  }
  return lines.join("\n");
}
const ROW_BORDER_COLOR = "rgba(109, 108, 253, 0.12)";

const PRODUCT_BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  A: { bg: "rgba(236, 72, 153, 0.13)", color: "#DB2777" },
  B: { bg: "rgba(99, 102, 241, 0.13)", color: "#6366F1" },
  C: { bg: "rgba(74, 182, 107, 0.15)", color: "#2E9E55" },
};

/** 하단 선택 버튼 배경색 (A·B·C별) */
const SELECT_BUTTON_BG: Record<string, string> = {
  A: "#DF4085",
  B: "#6366F1",
  C: "rgba(56, 162, 92, 1)",
};

/** 캡처 기준 비교표 본문 값 (A·B·C 3열) */
const COMPARISON_BODY_VALUES: [string, string, string][] = [
  ["10.24(금)~\n11.03(화)\n4박 5일", "10.25(토)~\n11.03(수)\n3박 4일", "10.26(일)"],
  ["인천·대한항공 18:05\n(7h 30m)", "김포·아시아나항공 20:20\n(7h 30m)", "항공 불포함"],
  ["5성급", "4성급", "호텔 불포함"],
  ["O", "X", "O"],
  ["있음", "있음", "없음"],
  ["O", "가이드만", "인솔자만"],
];

function TableRow({
  label,
  values,
  rowStyle,
  labelColor,
  valueColor,
  labelAlign = "center",
  isSkeleton = false,
}: {
  label: string;
  values: string[];
  rowStyle?: React.CSSProperties;
  labelColor?: string;
  valueColor?: string;
  labelAlign?: "left" | "center";
  isSkeleton?: boolean;
}) {
  const hasBottomBorder = rowStyle?.borderBottom != null && String(rowStyle.borderBottom) !== "none";
  const { borderBottom: _b, ...restRowStyle } = rowStyle ?? {};
  const labelDisplay = label.includes("\n") ? label : splitLabelEveryTwoChars(label);

  return (
    <div className="w-full relative">
      <div className="w-full" style={{ ...TABLE_GRID, border: "none", ...restRowStyle }}>
        <div
          aria-label={label.replace(/\n/g, " ")}
          className={`flex flex-col py-2 px-1 min-w-0 ${labelAlign === "left" ? "justify-center items-center text-left" : "justify-center items-center"}`}
        >
          <span
            className={`font-semibold ${labelAlign === "left" ? "text-left" : "text-center"}`}
            style={{
              fontSize: "12px",
              color: labelColor ?? "rgba(109, 108, 253, 1)",
              lineHeight: "15px",
              whiteSpace: "pre-line",
            }}
            aria-hidden
          >
            {labelDisplay}
          </span>
        </div>
        {values.map((value, i) => (
          <div key={i} className="flex flex-col justify-center items-center py-[5px] px-[5px] min-w-0">
            {isSkeleton ? (
              <div
                className="w-full flex flex-col gap-1 items-center justify-center min-h-[32px]"
                aria-hidden
              >
                <Skeleton className="h-3 w-[88%] max-w-[72px] rounded-md bg-violet-200/50" />
                <Skeleton className="h-3 w-[62%] max-w-[52px] rounded-md bg-violet-200/50" />
              </div>
            ) : (
              <span
                className="text-center font-medium w-full"
                style={{
                  fontSize: "12px",
                  color: valueColor ?? "#1A2B5B",
                  lineHeight: "16px",
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                }}
              >
                {value}
              </span>
            )}
          </div>
        ))}
      </div>
      {hasBottomBorder && (
        <div aria-hidden className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none">
          <span className="block" style={{ width: "95%", height: "1px", backgroundColor: ROW_BORDER_COLOR }} />
        </div>
      )}
    </div>
  );
}

function packageToDisplayValues(pkg: PackageData): {
  name: string;
  priceStr: string;
  duration: string;
  airline: string;
  hotelGrade: string;
  freeSchedule: string;
  travelRegion: string;
  naturalContent: string;
  keyExperience: string;
  recommendReason: string;
  /** 상품 요약용: 여행지역, 자연풍경, 대표체험, 저녁볼거리, 먹거리특징 */
  summaryRegion: string;
  summaryScenery: string;
  summaryExperience: string;
  summaryEvening: string;
  summaryFood: string;
} {
  const name = pkg.title.length > 20 ? pkg.title.slice(0, 20) + "…" : pkg.title;
  const priceStr = pkg.price.toLocaleString();
  const h = pkg.highlights ?? [];
  return {
    name,
    priceStr,
    duration: pkg.duration,
    airline: pkg.airline,
    hotelGrade: pkg.hotelGrade,
    freeSchedule: h[0] ?? "-",
    travelRegion: pkg.destination,
    naturalContent: h[1] ?? "-",
    keyExperience: h[2] ?? "-",
    recommendReason: pkg.recommendReason ?? "-",
    summaryRegion: pkg.destination,
    summaryScenery: h[0] ?? "-",
    summaryExperience: h[1] ?? "-",
    summaryEvening: h[2] ?? "-",
    summaryFood: h[3] ?? "-",
  };
}

interface AIPackageComparisonProps {
  packages: PackageData[];
  onClose: () => void;
  onSelect: (pkg: PackageData) => void;
}

export function AIPackageComparison({ packages, onClose, onSelect }: AIPackageComparisonProps) {
  useLockBodyScroll();
  const [selectedCompanion, setSelectedCompanion] = useState<string>("couple");
  const [selectedPurpose, setSelectedPurpose] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [isKeywordSectionExpanded, setIsKeywordSectionExpanded] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableHeaderRef = useRef<HTMLDivElement>(null);
  const displayPackages = packages.slice(0, 3);
  const labels = ["A", "B", "C"] as const;
  const rows = displayPackages.map(packageToDisplayValues);
  const tipText = COMPANION_TIPS[selectedCompanion] ?? COMPANION_TIPS.couple;

  const llmSectionPackageKey = displayPackages.map((p) => p.id).join("|");
  const [llmPointsReady, setLlmPointsReady] = useState(false);
  useEffect(() => {
    setLlmPointsReady(false);
    const id = window.setTimeout(() => setLlmPointsReady(true), 3000);
    return () => window.clearTimeout(id);
  }, [llmSectionPackageKey]);

  const PLACEHOLDER_VALUES = ["", "", ""] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full min-w-full max-h-[90vh] flex flex-col justify-center items-center rounded-t-[24px]"
      >
        {/* 헤더 */}
        <div className="flex-shrink-0 sticky top-0 w-full bg-white border-b border-gray-200 z-10 px-5 pt-4 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-[16px] font-semibold text-gray-900">AI가 한눈에 비교해봤어요</h1>
            <p className="text-[12px] text-[var(--color-gray-400)] mt-0.5 leading-snug">
              핵심만 비교해보고, 나에게 맞는 여행을 바로 확인해보세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="닫기"
          >
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        {/* 스크롤 영역: 테이블 (스티키 플로팅 헤더 비표시) */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
          <div className="px-4 pt-2.5 pb-10">
          <div className="flex flex-col items-stretch bg-white overflow-hidden w-full">
            {/* 테이블 헤더 행 */}
            <div ref={tableHeaderRef} className="w-full" style={{ ...TABLE_GRID, background: "#FFFFFF" }}>
              <div />
              {displayPackages.map((pkg, index) => {
                const id = labels[index];
                const style = PRODUCT_BADGE_COLORS[id] ?? PRODUCT_BADGE_COLORS.A;
                const row = rows[index];
                return (
                  <div
                    key={pkg.id}
                    className="flex flex-col justify-center items-center py-2.5 px-2 min-w-0"
                  >
                    <div
                      className="inline-flex items-center justify-center px-2 py-1 rounded-full"
                      style={{ background: style.bg, color: style.color, fontSize: "12px", fontWeight: 700 }}
                    >
                      {id}
                    </div>
                    <p className="text-center font-bold mt-1.5 text-[12px] text-[#101828] line-clamp-1 truncate w-full">
                      {row.name}
                    </p>
                    <p className="text-[14px] font-semibold mt-0" style={{ color: "#5E2BB8" }}>
                      {row.priceStr}
                      <span className="text-[11px] text-gray-500 font-medium ml-0.5">원</span>
                    </p>
                    <span
                      className="inline-block mt-0.5 px-2 py-0.5 rounded-[20px] text-[10px] font-medium border border-[#3B82F6] text-[#2563EB]"
                      aria-label="예약 가능 여부"
                    >
                      {index === 0 ? "출발확정" : "예약가능"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center w-full">
              <div className="w-[95%] border-b border-gray-300" aria-hidden />
            </div>

            {/* 기본 비교 행 */}
            <TableRow
              label="일정"
              values={COMPARISON_BODY_VALUES[0]}
              labelColor="#64748b"
              valueColor="#334155"
            />
            <TableRow
              label="항공정보"
              values={COMPARISON_BODY_VALUES[1]}
              labelColor="#64748b"
              valueColor="#334155"
            />
            <TableRow
              label="호텔성급"
              values={COMPARISON_BODY_VALUES[2]}
              labelColor="#64748b"
              valueColor="#334155"
            />
            <TableRow
              label="자유일정"
              values={COMPARISON_BODY_VALUES[3]}
              labelColor="#64748b"
              valueColor="#334155"
            />

            {/* 상세 정보 (펼쳤을 때만) */}
            {isDetailsExpanded && (
              <>
                <TableRow
                  label="식사포함"
                  values={COMPARISON_BODY_VALUES[4]}
                  labelColor="#64748b"
                  valueColor="#334155"
                />
                <TableRow
                  label={"가이드\n인솔자"}
                  values={COMPARISON_BODY_VALUES[5]}
                  labelColor="#64748b"
                  valueColor="#334155"
                />
              </>
            )}

            {/* 상세정보 펼치기/접기 버튼 */}
            <div className="flex justify-center w-full mt-1 mb-1">
              <button
                type="button"
                onClick={() => setIsDetailsExpanded((prev) => !prev)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-[7px] transition-colors hover:bg-gray-50 min-h-[28px] text-[11px] font-medium text-gray-600"
                style={{ boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.1)" }}
              >
                <span>{isDetailsExpanded ? "상세 정보 접기" : "상세정보 펼치기"}</span>
                <svg
                  className="flex-shrink-0 transition-transform"
                  style={{ transform: isDetailsExpanded ? "rotate(0deg)" : "rotate(180deg)" }}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M3 7L6 4L9 7" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* AI 자동 비교 섹션: 상품의 주요 포인트만 정리해봤어요 (첨부 구성) */}
            <div
              className="mt-2.5 mb-5 rounded-[12px] overflow-hidden bg-white"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" }}
            >
              <div
                className="flex items-center w-full py-3.5 px-4 gap-2"
                style={{
                  background: "linear-gradient(135deg, rgba(122, 64, 242, 1) 0%, rgba(106, 117, 255, 1) 100%)",
                }}
              >
                <Sparkles className="flex-shrink-0 text-white" size={18} strokeWidth={1.8} aria-hidden />
                <span className="font-semibold text-left text-[13px] text-white leading-[18px]">
                  상품의 주요 포인트만 정리해봤어요
                </span>
              </div>
              <div
                style={{ backgroundColor: "#f7f7ff" }}
                aria-busy={!llmPointsReady}
                aria-label={llmPointsReady ? undefined : "상품 주요 포인트 생성 중"}
              >
                {[
                  { label: "여행지역", values: rows.map((r) => r.summaryRegion), labelColor: "rgba(109, 108, 253, 0.95)" },
                  { label: "자연풍경", values: rows.map((r) => r.summaryScenery), labelColor: "rgba(109, 108, 253, 0.95)" },
                  { label: "대표체험", values: rows.map((r) => r.summaryExperience), labelColor: "rgba(109, 108, 253, 0.95)" },
                  { label: "저녁\n볼거리", values: rows.map((r) => r.summaryEvening), labelColor: "rgba(109, 108, 253, 0.95)" },
                  { label: "먹거리\n특징", values: rows.map((r) => r.summaryFood), labelColor: "rgba(109, 108, 253, 0.95)" },
                ].map((row, idx) => (
                  <TableRow
                    key={row.label}
                    label={row.label}
                    values={llmPointsReady ? row.values : [...PLACEHOLDER_VALUES]}
                    labelAlign="left"
                    rowStyle={{
                      backgroundColor: "#f7f7ff",
                      borderBottom: idx < 4 ? "1px solid #e5e7eb" : "none",
                    }}
                    labelColor={row.labelColor}
                    valueColor="#374151"
                    isSkeleton={!llmPointsReady}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* AI 키워드 분석 하단 영역 */}
          <section className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-0">AI 키워드 분석</h2>
            <p className="text-[12px] text-gray-500 mt-0.5 mb-3 leading-snug">
              선택한 키워드를 기반으로 더 적합한 상품을 분석합니다.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {/* 동반자유형: 타이틀 왼쪽 + 칩 좌우 스크롤 + 접기/펼치기 버튼 */}
              <div className="flex items-center gap-3 w-full min-w-0">
                <span className="text-[12px] font-semibold text-gray-700 flex-shrink-0">동반자유형</span>
                <div
                  className="flex-1 min-w-0 overflow-x-auto flex items-center gap-2 flex-nowrap py-0.5 -mx-1"
                  style={{
                    scrollbarWidth: "thin",
                    msOverflowStyle: "scrollbar",
                    WebkitOverflowScrolling: "touch",
                  } as React.CSSProperties}
                >
                  {COMPANION_OPTIONS.map(({ id, label }) => {
                    const isSelected = selectedCompanion === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedCompanion(id)}
                        className={`
                          flex flex-col justify-center items-center flex-shrink-0 px-3 py-2 rounded-full border text-[13px] transition-all h-[30px]
                          ${isSelected
                            ? "bg-gradient-to-r from-[#6976FF] to-[#7B3FF2] border-transparent text-white"
                            : "bg-gray-100 border-gray-200 text-gray-600 hover:border-[#7B3FF2]"
                          }
                        `}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setIsKeywordSectionExpanded((prev) => !prev)}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-gray-100/80 text-gray-600 transition-colors flex-shrink-0 hover:bg-gray-200/80"
                  aria-label={isKeywordSectionExpanded ? "접기" : "펼치기"}
                >
                  {isKeywordSectionExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {/* 펼쳤을 때: 여행목적, 여행스타일 (타이틀 왼쪽 + 칩 좌우 스크롤) */}
              {isKeywordSectionExpanded && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 w-full min-w-0">
                    <span className="text-[12px] font-semibold text-gray-700 flex-shrink-0 w-[56px]">여행목적</span>
                    <div
                      className="flex-1 min-w-0 overflow-x-auto flex items-center gap-2 flex-nowrap py-0.5 -mx-1"
                      style={{
                        scrollbarWidth: "thin",
                        msOverflowStyle: "scrollbar",
                        WebkitOverflowScrolling: "touch",
                      } as React.CSSProperties}
                    >
                      {PURPOSE_OPTIONS.map(({ id, label }) => {
                        const isSelected = selectedPurpose === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setSelectedPurpose(isSelected ? "" : id)}
                            className={`
                              flex flex-col justify-center items-center flex-shrink-0 px-3 py-2 rounded-full border text-[13px] transition-all h-[30px]
                              ${isSelected
                                ? "bg-gradient-to-r from-[#6976FF] to-[#7B3FF2] border-transparent text-white"
                                : "bg-gray-100 border-gray-200 text-gray-600 hover:border-[#7B3FF2]"
                              }
                            `}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full min-w-0">
                    <span className="text-[12px] font-semibold text-gray-700 flex-shrink-0 w-[56px]">여행스타일</span>
                    <div
                      className="flex-1 min-w-0 overflow-x-auto flex items-center gap-2 flex-nowrap py-0.5 -mx-1"
                      style={{
                        scrollbarWidth: "thin",
                        msOverflowStyle: "scrollbar",
                        WebkitOverflowScrolling: "touch",
                      } as React.CSSProperties}
                    >
                      {STYLE_OPTIONS.map(({ id, label }) => {
                        const isSelected = selectedStyle === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setSelectedStyle(isSelected ? "" : id)}
                            className={`
                              flex flex-col justify-center items-center flex-shrink-0 px-3 py-2 rounded-full border text-[13px] transition-all h-[30px]
                              ${isSelected
                                ? "bg-gradient-to-r from-[#6976FF] to-[#7B3FF2] border-transparent text-white"
                                : "bg-gray-100 border-gray-200 text-gray-600 hover:border-[#7B3FF2]"
                              }
                            `}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className="rounded-[10px] px-4 py-3 mb-4 flex flex-row items-start gap-2"
              style={{ backgroundColor: "rgba(147, 197, 253, 0.12)" }}
            >
              <span
                className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[11px] font-semibold flex-shrink-0"
                style={{ background: "rgba(147, 197, 253, 0.25)", color: "#3B82F6" }}
              >
                TIP
              </span>
              <p className="text-[14px] font-medium text-[#1e3a8a] leading-relaxed flex-1 min-w-0" style={{ lineHeight: "1.6" }}>
                {tipText}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {displayPackages.map((pkg, index) => {
                const id = labels[index];
                const badgeStyle = PRODUCT_BADGE_COLORS[id] ?? PRODUCT_BADGE_COLORS.A;
                const starCount = 3 - index;
                const title = pkg.title.length > 18 ? pkg.title.slice(0, 18) + "…" : pkg.title;
                const description = pkg.recommendReason?.slice(0, 36) ? (pkg.recommendReason.length > 36 ? pkg.recommendReason.slice(0, 36) + "…" : pkg.recommendReason) : "";
                const isFirst = index === 0;
                return (
                  <div
                    key={pkg.id}
                    className={`flex flex-col gap-2 rounded-lg border p-3 bg-white ${isFirst ? "border-[#93C5FD]" : "border-gray-200"}`}
                    style={isFirst ? { boxShadow: "0 0 0 1.5px rgba(147, 197, 253, 0.9), 0 0 8px 2px rgba(147, 197, 253, 0.4)" } : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-medium flex-shrink-0"
                        style={{ background: badgeStyle.bg, color: badgeStyle.color }}
                      >
                        {id}
                      </span>
                      <div className="flex gap-[3px]">
                        {[1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className="inline-block rounded-sm flex-shrink-0"
                            style={{
                              width: "8px",
                              height: "10px",
                              backgroundColor: i <= starCount ? "#fbbf24" : "#E5E7EB",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-semibold text-gray-800 leading-tight line-clamp-2">
                        {title}
                      </span>
                      {description && (
                        <span className="text-[12px] text-gray-500 leading-tight line-clamp-2">
                          {description}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          </div>
        </div>

        {/* 하단 플로팅: 상품 선택 버튼 */}
        <div className="w-full flex-shrink-0 border-t border-gray-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-3 gap-2">
            {displayPackages.map((pkg, index) => {
              const id = labels[index];
              const badgeStyle = PRODUCT_BADGE_COLORS[id] ?? PRODUCT_BADGE_COLORS.A;
              const buttonBg = SELECT_BUTTON_BG[id] ?? SELECT_BUTTON_BG.C;
              return (
                <button
                  key={pkg.id}
                  onClick={() => {
                    onSelect(pkg);
                    onClose();
                  }}
                  className="group relative overflow-hidden py-2.5 border-0 rounded-[30px] text-[14px] font-['Pretendard:SemiBold',sans-serif] inline-flex items-center justify-center gap-1.5 transition-[all_0.3s_cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[3px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] active:-translate-y-[1px]"
                  style={{ backgroundColor: buttonBg }}
                >
                  {/* Shine overlay (hover 시 빛나는 효과) */}
                  <span
                    className="pointer-events-none absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-0 transition-[all_0.6s_ease] group-hover:opacity-100 group-hover:left-[100%]"
                    style={{
                      background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)",
                      transform: "rotate(45deg)",
                    }}
                    aria-hidden
                  />
                  <span
                    className="relative z-10 inline-flex items-center justify-center w-6 h-6 px-2 py-1 rounded-full bg-white"
                    style={{ color: badgeStyle.color, fontSize: "12px", fontWeight: 700 }}
                  >
                    {id}
                  </span>
                  <span className="relative z-10 text-white rounded-[30px]">선택</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
