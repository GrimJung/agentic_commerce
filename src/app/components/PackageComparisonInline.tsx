import { useState, useEffect, useRef } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { PackageData } from "./PackageCard";
import { Skeleton } from "./ui/skeleton";

/* ─── 상수 (AIPackageComparison과 동일) ──────────────── */
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

const PURPOSE_TIPS: Record<string, string> = {
  relaxation: "휴양·힐링을 원하신다면 일정이 무리하지 않고 여유 있게 짜인 상품을 먼저 살펴보세요.",
  activity: "액티비티를 즐기고 싶다면 체험 옵션이 다양하고 활동량이 균형 잡힌 일정을 추천드려요.",
  shopping: "쇼핑·맛집이 중요하다면 자유시간과 시내 근처 동선이 확보된 상품을 비교해보세요.",
  sightseeing: "관광 중심이라면 주요 명소 방문이 알차게 구성된 상품을 우선 확인해보세요.",
};

const STYLE_TIPS: Record<string, string> = {
  relaxed: "여유로운 일정을 선호하신다면 강행 일정이 적고 자유시간이 넉넉한 상품이 잘 맞아요.",
  packed: "알찬 일정을 원하신다면 하루 동선이 효율적으로 짜여 많은 코스를 경험할 수 있는지 비교해보세요.",
  budget: "가성비를 중시하신다면 항공·숙박 구성과 불포함 항목을 꼼꼼히 비교해 실제 부담 금액을 가늠해보세요.",
  satisfaction: "만족도를 중시하신다면 숙소·식사 구성과 인솔 여부 등 체감 품질 요소를 함께 살펴보세요.",
};

const KEYWORD_TIPS: Record<string, string> = {
  ...COMPANION_TIPS,
  ...PURPOSE_TIPS,
  ...STYLE_TIPS,
};

function keywordIdsForLine(selectedId: string): { companionId: string; purposeId: string; styleId: string } {
  if (COMPANION_OPTIONS.some((o) => o.id === selectedId)) {
    return { companionId: selectedId, purposeId: "", styleId: "" };
  }
  if (PURPOSE_OPTIONS.some((o) => o.id === selectedId)) {
    return { companionId: "", purposeId: selectedId, styleId: "" };
  }
  if (STYLE_OPTIONS.some((o) => o.id === selectedId)) {
    return { companionId: "", purposeId: "", styleId: selectedId };
  }
  return { companionId: "couple", purposeId: "", styleId: "" };
}

function optionLabel<T extends readonly { id: string; label: string }[]>(options: T, id: string): string | undefined {
  return options.find((o) => o.id === id)?.label;
}

/** 선택 키워드 + 상품 한 줄 요약. 모바일 2줄 이내가 되도록 길이 제한 */
function keywordCoreRecommendationLine(
  pkg: PackageData,
  companionId: string,
  purposeId: string,
  styleId: string
): string {
  const tags: string[] = [];
  const companionLabel = optionLabel(COMPANION_OPTIONS, companionId);
  if (companionLabel) tags.push(companionLabel);
  if (purposeId) {
    const p = optionLabel(PURPOSE_OPTIONS, purposeId);
    if (p) tags.push(p);
  }
  if (styleId) {
    const s = optionLabel(STYLE_OPTIONS, styleId);
    if (s) tags.push(s);
  }
  let tagPart = tags.join("·") || "선택 키워드";
  if (tagPart.length > 16) {
    tagPart = `${tagPart.slice(0, 15)}…`;
  }

  const raw = (pkg.highlights?.[0] || pkg.recommendReason || "")
    .trim()
    .replace(/\s+/g, " ");
  let hook = raw;
  if (hook.length > 20) {
    hook = `${hook.slice(0, 19)}…`;
  }

  let line = hook ? `${tagPart} 맞춤 ${hook}` : `${tagPart}에 잘 맞아요`;
  const maxLen = 44;
  if (line.length > maxLen) {
    line = `${line.slice(0, maxLen - 1)}…`;
  }
  return line;
}

/** AIPackageComparison과 동일: 라벨 열 좁게, A·B·C 열에 폭 할당 */
const TABLE_GRID = { display: "grid", gridTemplateColumns: "minmax(28px, 38px) repeat(3, minmax(0, 1fr))" };

/** 라벨 열: 2글자마다 줄바꿈 (AIPackageComparison과 동일) */
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

const SELECT_BUTTON_BG: Record<string, string> = {
  A: "#DF4085",
  B: "#6366F1",
  C: "rgba(56, 162, 92, 1)",
};

const COMPARISON_BODY_VALUES: [string, string, string][] = [
  ["10.24(금)~\n11.03(화)\n4박 5일", "10.25(토)~\n11.03(수)\n3박 4일", "10.26(일)"],
  ["인천·대한항공 18:05\n(7h 30m)", "김포·아시아나항공 20:20\n(7h 30m)", "항공 불포함"],
  ["5성급", "4성급", "호텔 불포함"],
  ["O", "X", "O"],
  ["있음", "있음", "없음"],
  ["O", "가이드만", "인솔자만"],
];

/* ─── TableRow ────────────────────────────────────────── */
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
  /** true면 값 열에 스켈레톤(생성 중 UI) 표시 */
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
          className={`flex flex-col py-2 px-1 min-w-0 ${
            labelAlign === "left"
              ? "justify-center items-center text-left"
              : "justify-center items-center"
          }`}
        >
          <span
            className={`font-semibold ${labelAlign === "left" ? "text-left" : "text-center"}`}
            style={{
              fontSize: "10px",
              color: labelColor ?? "rgba(109, 108, 253, 1)",
              lineHeight: "15px",
              whiteSpace: "pre-line",
              ...(labelAlign === "left" ? { textAlign: "left" as const } : {}),
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

/* ─── 데이터 변환 ─────────────────────────────────────── */
function packageToDisplayValues(pkg: PackageData) {
  const name = pkg.title.length > 20 ? pkg.title.slice(0, 20) + "…" : pkg.title;
  const h = pkg.highlights ?? [];
  return {
    name,
    priceStr: pkg.price.toLocaleString(),
    duration: pkg.duration,
    airline: pkg.airline,
    hotelGrade: pkg.hotelGrade,
    summaryRegion: pkg.destination,
    summaryScenery: h[0] ?? "-",
    summaryExperience: h[1] ?? "-",
    summaryEvening: h[2] ?? "-",
    summaryFood: h[3] ?? "-",
    recommendReason: pkg.recommendReason ?? "-",
  };
}

/* ─── Props ───────────────────────────────────────────── */
interface PackageComparisonInlineProps {
  packages: PackageData[];
  onSelect: (pkg: PackageData) => void;
  onBack: () => void;
}

/* ─── 메인 컴포넌트 ───────────────────────────────────── */
export function PackageComparisonInline({ packages, onSelect, onBack }: PackageComparisonInlineProps) {
  /** 동반·목적·스타일 키워드 중 하나만 선택 */
  const [selectedKeyword, setSelectedKeyword] = useState<string>("couple");
  const [isKeywordExpanded, setIsKeywordExpanded] = useState(false);

  const displayPackages = packages.slice(0, 3);
  const labels = ["A", "B", "C"] as const;
  const rows = displayPackages.map(packageToDisplayValues);
  const { companionId, purposeId, styleId } = keywordIdsForLine(selectedKeyword);
  const tipText = KEYWORD_TIPS[selectedKeyword] ?? KEYWORD_TIPS.couple;

  const llmSectionPackageKey = displayPackages.map((p) => p.id).join("|");
  const [llmPointsReady, setLlmPointsReady] = useState(false);
  useEffect(() => {
    setLlmPointsReady(false);
    const id = window.setTimeout(() => setLlmPointsReady(true), 3000);
    return () => window.clearTimeout(id);
  }, [llmSectionPackageKey]);

  /** 키워드 변경 시 TIP·상품별 맞춤 문구만 짧은 스켈레톤 (최초 마운트·동일값 재실행 제외) */
  const [keywordMatchReady, setKeywordMatchReady] = useState(true);
  const prevKeywordRef = useRef<string | null>(null);
  useEffect(() => {
    if (prevKeywordRef.current === null) {
      prevKeywordRef.current = selectedKeyword;
      return;
    }
    if (prevKeywordRef.current === selectedKeyword) return;
    prevKeywordRef.current = selectedKeyword;
    setKeywordMatchReady(false);
    const id = window.setTimeout(() => setKeywordMatchReady(true), 720);
    return () => window.clearTimeout(id);
  }, [selectedKeyword]);

  const PLACEHOLDER_VALUES = ["", "", ""] as const;

  return (
    <div className="w-full space-y-3">
      {/* ── 안내 (채팅 메시지 톤, 카드/박스 없음) ── */}
      <div className="text-[14px] text-[#111] max-w-full leading-relaxed">
        <p className="m-0">
          추천드린 상품을 비교해봤어요.
          <span className="block mt-1.5">
            기본 정보와 AI 키워드 분석을 통해 딱 맞는 상품을 하나 골라보세요.
          </span>
        </p>
      </div>

      {/* ── 비교 테이블 ── */}
      <div className="rounded-[16px] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.07)] overflow-hidden">
        {/* 상품 헤더 행 — AIPackageComparison 테이블 헤더와 동일 스타일 */}
        <div className="w-full pt-[5px]" style={{ ...TABLE_GRID, background: "#FFFFFF" }}>
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
                <p className="text-[12px] font-semibold mt-0" style={{ color: "#5E2BB8" }}>
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
          <div className="w-[350px] border-b border-gray-300 mb-[5px]" aria-hidden />
        </div>

        {/* 기본 비교 행 */}
        <TableRow label="일정"     values={COMPARISON_BODY_VALUES[0]} labelColor="#64748b" valueColor="#334155" />
        <TableRow label="항공정보" values={COMPARISON_BODY_VALUES[1]} labelColor="#64748b" valueColor="#334155" />
        <TableRow label="호텔성급" values={COMPARISON_BODY_VALUES[2]} labelColor="#64748b" valueColor="#334155" />
        <TableRow label="자유일정" values={COMPARISON_BODY_VALUES[3]} labelColor="#64748b" valueColor="#334155" />

        <TableRow label="식사포함" values={COMPARISON_BODY_VALUES[4]} labelColor="#64748b" valueColor="#334155" />
        <TableRow label={"가이드\n인솔자"} values={COMPARISON_BODY_VALUES[5]} labelColor="#64748b" valueColor="#334155" />

        {/* AI 주요 포인트 */}
        <div
          className="mt-[10px] overflow-hidden rounded-t-none rounded-b-[16px]"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <div
            className="flex h-8 items-center justify-start gap-2 px-2.5 shrink-0 w-full"
            style={{ background: "linear-gradient(135deg, rgba(122,64,242,1) 0%, rgba(106,117,255,1) 100%)" }}
          >
            <Sparkles className="flex-shrink-0 text-white" size={18} strokeWidth={1.8} aria-hidden />
            <span className="font-semibold text-[13px] text-white leading-[18px]">상품의 주요 포인트만 정리해봤어요</span>
          </div>
          <div
            style={{ backgroundColor: "#f7f7ff" }}
            aria-busy={!llmPointsReady}
            aria-label={llmPointsReady ? undefined : "상품 주요 포인트 생성 중"}
          >
            {[
              { label: "여행지역",  values: rows.map((r) => r.summaryRegion) },
              { label: "자연풍경",  values: rows.map((r) => r.summaryScenery) },
              { label: "대표체험",  values: rows.map((r) => r.summaryExperience) },
              { label: "저녁\n볼거리", values: rows.map((r) => r.summaryEvening) },
              { label: "먹거리\n특징", values: rows.map((r) => r.summaryFood) },
            ].map((row, idx) => (
              <TableRow
                key={row.label}
                label={row.label}
                values={llmPointsReady ? row.values : [...PLACEHOLDER_VALUES]}
                labelAlign="left"
                rowStyle={{
                  backgroundColor: "#f7f7ff",
                  borderBottom: idx < 4 ? "1px solid #e5e7eb" : "none",
                  ...(idx === 4 ? { paddingBottom: "5px" } : {}),
                }}
                labelColor="rgba(109,108,253,0.95)"
                valueColor="#374151"
                isSkeleton={!llmPointsReady}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── AI 키워드 분석 ── */}
      <div className="rounded-[16px] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.07)] px-4 py-4">
        <h2 className="text-[15px] font-['Pretendard:Bold',sans-serif] font-bold text-[#111] mb-0.5">AI 키워드 분석</h2>
        <p className="text-[12px] text-gray-500 mt-0.5 mb-3 leading-snug">선택한 키워드를 기반으로 더 적합한 상품을 분석합니다.</p>

        <div className="flex flex-col gap-[3px] mb-4">
          {/* 동반자 유형 */}
          <div className="flex items-center gap-3 w-full min-w-0 mb-[5px]">
            <div className="flex-1 min-w-0 overflow-x-auto flex items-center gap-[5px] flex-nowrap py-0.5" style={{ scrollbarWidth: "none" }}>
              {COMPANION_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedKeyword(id)}
                  className={`flex flex-col justify-center items-center flex-shrink-0 px-3 py-2 rounded-full border text-[12px] h-[30px] transition-all ${
                    selectedKeyword === id
                      ? "bg-gradient-to-r from-[#6976FF] to-[#7B3FF2] border-transparent text-white"
                      : "bg-gray-100 border-gray-200 text-gray-600 hover:border-[#7B3FF2]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsKeywordExpanded((p) => !p)}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-gray-100/80 text-gray-600 flex-shrink-0 hover:bg-gray-200/80 transition-colors"
              aria-label={isKeywordExpanded ? "접기" : "펼치기"}
            >
              {isKeywordExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* 여행목적·스타일 (펼쳤을 때) */}
          {isKeywordExpanded && (
            <div className="flex flex-col gap-[3px]">
              {[
                { title: "여행목적", options: PURPOSE_OPTIONS },
                { title: "여행스타일", options: STYLE_OPTIONS },
              ].map(({ title, options }) => (
                <div key={title} className="flex items-center gap-3 w-full min-w-0">
                  <div className="flex-1 min-w-0 overflow-x-auto flex items-center gap-[5px] flex-nowrap py-0.5" style={{ scrollbarWidth: "none" }}>
                    {options.map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedKeyword(id)}
                        className={`flex flex-col justify-center items-center flex-shrink-0 px-3 py-2 rounded-full border text-[12px] h-[30px] transition-all ${
                          selectedKeyword === id
                            ? "bg-gradient-to-r from-[#6976FF] to-[#7B3FF2] border-transparent text-white"
                            : "bg-gray-100 border-gray-200 text-gray-600 hover:border-[#7B3FF2]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="relative mb-4"
          aria-busy={!keywordMatchReady}
          aria-label={keywordMatchReady ? undefined : "맞춤 분석 요약 생성 중"}
        >
          <span
            className="absolute left-[17px] top-0 z-10 inline-flex -translate-y-1/2 items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-semibold"
            style={{ backgroundColor: "rgba(204, 228, 255, 1)", color: "#3B82F6" }}
          >
            TIP
          </span>
          <div className="rounded-[10px] px-4 py-3" style={{ backgroundColor: "rgba(147,197,253,0.12)" }}>
            {keywordMatchReady ? (
              <p className="m-0 min-w-0 pt-[5px] text-[13px] font-medium leading-[1.4] text-[#1e3a8a]">{tipText}</p>
            ) : (
              <div className="flex flex-col gap-2 pt-[5px] min-h-[44px]" aria-hidden>
                <Skeleton className="h-3.5 w-full max-w-full rounded-md bg-sky-300/35" />
                <Skeleton className="h-3.5 w-[94%] max-w-full rounded-md bg-sky-300/35" />
                <Skeleton className="h-3.5 w-[72%] max-w-full rounded-md bg-sky-300/35" />
              </div>
            )}
          </div>
        </div>

        {/* 상품 요약 카드 — 뱃지·별·핵심문구 한 행, 설명은 하단 전체 너비 */}
        <div
          className="w-full flex flex-col gap-2"
          aria-busy={!keywordMatchReady}
          aria-label={keywordMatchReady ? undefined : "상품별 맞춤 요약 생성 중"}
        >
          {!keywordMatchReady
            ? displayPackages.map((_, index) => {
                const id = labels[index];
                const isFirst = index === 0;
                return (
                  <div
                    key={`keyword-skeleton-${id}`}
                    className={`flex flex-col gap-2 w-full min-w-0 rounded-lg border p-3 bg-white ${isFirst ? "border-[#93C5FD]" : "border-gray-200"}`}
                    style={
                      isFirst
                        ? { boxShadow: "0 0 0 1.5px rgba(147,197,253,0.9), 0 0 8px 2px rgba(147,197,253,0.4)" }
                        : undefined
                    }
                    aria-hidden
                  >
                    <div className="flex min-w-0 w-full items-center gap-2">
                      <Skeleton className="h-6 w-6 flex-shrink-0 rounded-full bg-violet-200/45" />
                      <div className="flex h-6 flex-shrink-0 items-center gap-[3px]">
                        <Skeleton className="w-2 h-2.5 rounded-sm bg-amber-200/35" />
                        <Skeleton className="w-2 h-2.5 rounded-sm bg-amber-200/35" />
                        <Skeleton className="w-2 h-2.5 rounded-sm bg-amber-200/35" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5 justify-center">
                        <Skeleton className="h-3 w-full rounded-md bg-gray-200/70" />
                        <Skeleton className="h-3 w-[78%] rounded-md bg-gray-200/70" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 w-full pl-0">
                      <Skeleton className="h-2.5 w-full rounded-md bg-gray-200/55" />
                      <Skeleton className="h-2.5 w-[88%] rounded-md bg-gray-200/55" />
                    </div>
                  </div>
                );
              })
            : displayPackages.map((pkg, index) => {
                const id = labels[index];
                const badgeStyle = PRODUCT_BADGE_COLORS[id] ?? PRODUCT_BADGE_COLORS.A;
                const starCount = 3 - index;
                const desc = pkg.recommendReason?.trim() ?? "";
                const coreLine = keywordCoreRecommendationLine(pkg, companionId, purposeId, styleId);
                return (
                  <div
                    key={pkg.id}
                    className={`flex flex-col gap-2 w-full min-w-0 rounded-lg border p-3 bg-white ${index === 0 ? "border-[#93C5FD]" : "border-gray-200"}`}
                    style={index === 0 ? { boxShadow: "0 0 0 1.5px rgba(147,197,253,0.9), 0 0 8px 2px rgba(147,197,253,0.4)" } : undefined}
                  >
                    <div className="flex min-w-0 w-full items-center gap-2">
                      <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-medium" style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
                        {id}
                      </span>
                      <div className="flex h-6 flex-shrink-0 items-center justify-start gap-[3px] px-0">
                        {[1, 2, 3].map((i) => (
                          <span key={i} className="inline-block flex-shrink-0 rounded-sm" style={{ width: "8px", height: "10px", backgroundColor: i <= starCount ? "#fbbf24" : "#E5E7EB" }} />
                        ))}
                      </div>
                      <span
                        className="min-w-0 flex-1 text-[12px] font-semibold leading-snug text-gray-800 line-clamp-2"
                        title={pkg.title}
                      >
                        {coreLine}
                      </span>
                    </div>
                    {desc ? (
                      <span className="block w-full min-w-0 text-[11px] leading-snug text-gray-500 line-clamp-2">{desc}</span>
                    ) : null}
                  </div>
                );
              })}
        </div>
      </div>

      {/* ── 상품 선택 버튼 ── */}
      <div className="grid grid-cols-3 gap-2">
        {displayPackages.map((pkg, index) => {
          const id = labels[index];
          const badgeStyle = PRODUCT_BADGE_COLORS[id] ?? PRODUCT_BADGE_COLORS.A;
          const buttonBg = SELECT_BUTTON_BG[id] ?? SELECT_BUTTON_BG.C;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onSelect(pkg)}
              className="group relative overflow-hidden py-2.5 rounded-[30px] text-[14px] font-['Pretendard:SemiBold',sans-serif] inline-flex items-center justify-center gap-1.5 transition-all hover:-translate-y-[2px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)] active:-translate-y-[1px]"
              style={{ backgroundColor: buttonBg }}
            >
              <span
                className="pointer-events-none absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-0 transition-all group-hover:opacity-100 group-hover:left-[100%]"
                style={{ background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)", transform: "rotate(45deg)" }}
                aria-hidden
              />
              <span className="relative z-10 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white" style={{ color: badgeStyle.color, fontSize: "12px", fontWeight: 700 }}>
                {id}
              </span>
              <span className="relative z-10 text-white text-[13px]">상품상세 &gt;</span>
            </button>
          );
        })}
      </div>

      {/* ── 목록으로 돌아가기 ── */}
      <button
        type="button"
        onClick={onBack}
        className="w-full py-2.5 rounded-full border border-[#e4e4e4] font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#555] hover:bg-[#f9f9f9] transition-colors"
      >
        추천 상품 목록가기
      </button>

      <div className="w-full pt-1" role="region" aria-label="이어서 물어보기">
        <p className="text-[14px] leading-relaxed text-[#111] m-0">
          <span className="mr-1" aria-hidden>
            💡
          </span>
          <span className="font-['Pretendard:Bold',sans-serif] text-[rgba(55,127,255,1)]">H-AI TIP</span>
          <span className="text-[#444]"> 관련해서 이런 질문도 이어갈 수 있어요.</span>
        </p>
        <ul className="mt-2 space-y-1.5 pl-0.5 text-[14px] text-[#333] list-none m-0 p-0">
          <li>• 첫번째 상품을 빼고 비교해줘.</li>
          <li>• 세번째 상품과 유사하지만 저렴한 상품으로 추천해줘.</li>
        </ul>
      </div>
    </div>
  );
}
