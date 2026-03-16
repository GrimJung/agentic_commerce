import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import { TravelDatePickerSheet } from "./TravelDatePickerSheet";

function getOneMonthLaterRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  const fmt = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  return { start: fmt(start), end: fmt(end) };
}

interface PreferenceInputProps {
  onSubmit: (data: {
    theme: string;
    budget: string;
    destination: string;
    travelers: number;
    searchMode?: 'combo' | 'flight' | 'hotel';
    travelPeriodDisplay?: string;
    adults?: number;
    children?: number;
    infants?: number;
    childAges?: number[]; // 자유여행/추천검색 시 아동 나이 (만0~만17)
  }) => void;
  mode?: "package" | "fit"; // 패키지 또는 자유여행 모드
  /** true면 추천 검색하기로 열린 폼 → 인원을 자유여행처럼 성인+아동만, 아동 나이 선택 박스 표시 */
  personaRecommendFlow?: boolean;
  initialDestination?: string;
  initialBudget?: string;
  initialTheme?: string;
  initialTravelers?: number;
}

export function PreferenceInput({ onSubmit, mode = "package", personaRecommendFlow = false, initialDestination = "", initialBudget = "", initialTheme = "", initialTravelers = 1 }: PreferenceInputProps) {
  const [theme, setTheme] = useState(initialTheme);
  const [budget, setBudget] = useState(initialBudget);
  const [destination, setDestination] = useState(initialDestination);
  const defaultPeriod = useMemo(getOneMonthLaterRange, []);
  const [travelPeriodStart, setTravelPeriodStart] = useState(defaultPeriod.start);
  const [travelPeriodEnd, setTravelPeriodEnd] = useState(defaultPeriod.end);
  const [adults, setAdults] = useState(initialTravelers >= 1 ? Math.max(1, initialTravelers) : 1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  /** 자유여행 모드에서 아동별 나이 (만0세=0 ~ 만17세=17, ''=미선택). length === children */
  const [childAges, setChildAges] = useState<(number | string)[]>([]);

  const [searchMode, setSearchMode] = useState<'combo' | 'flight' | 'hotel'>('combo');

  const [calendarOpen, setCalendarOpen] = useState(false);

  /** 추천검색 시에도 자유여행처럼 성인+아동만, 아동 나이 선택 적용 */
  const useFitStyleGuests = mode === "fit" || (mode === "package" && personaRecommendFlow);
  const travelers = adults + children + (mode === "package" && !personaRecommendFlow ? infants : 0);

  const themes = ["휴양", "문화탐방", "자연경관", "레저/액티비티", "쇼핑"];
  const budgets = ["100만원 이하", "100-200만원", "200-300만원", "300만원 이상"];

  const travelPeriodDisplay = travelPeriodStart && travelPeriodEnd
    ? `${travelPeriodStart.slice(5, 7)}.${travelPeriodStart.slice(8, 10)}~${travelPeriodEnd.slice(5, 7)}.${travelPeriodEnd.slice(8, 10)}`
    : undefined;

  /** 만0세·만1세 인원 수는 성인 수를 초과할 수 없음 (미선택 ''은 제외) */
  const underAge2Count = useFitStyleGuests ? childAges.filter((a) => typeof a === "number" && a <= 1).length : 0;
  const isFitChildAgeValid = !useFitStyleGuests || children === 0 || underAge2Count <= adults;

  const handleSubmit = (submitMode: 'combo' | 'flight' | 'hotel') => {
    if ((budget || destination) && isFitChildAgeValid) {
      onSubmit({
        theme: "",
        budget,
        destination,
        travelers,
        searchMode: submitMode,
        travelPeriodDisplay,
        adults,
        children,
        infants: 0,
        childAges: children > 0 ? childAges.map((a) => (a === "" ? 2 : a as number)) : undefined,
      });
    }
  };

  const handlePackageSubmit = () => {
    if (isValid && (! useFitStyleGuests || isFitChildAgeValid)) {
      onSubmit({
        theme,
        budget,
        destination,
        travelers,
        searchMode: 'combo',
        travelPeriodDisplay,
        adults,
        children,
        infants: personaRecommendFlow ? 0 : infants,
        childAges: useFitStyleGuests && children > 0 ? childAges.map((a) => (a === "" ? 2 : a as number)) : undefined,
      });
    }
  };

  const isValid = mode === "fit" ? (budget || destination) : (theme || budget || destination);

  // 자유여행·추천검색(아동만) 모드에서 아동 수 변경 시 childAges 길이 동기화
  useEffect(() => {
    if (!useFitStyleGuests) return;
    if (children === 0) {
      setChildAges([]);
      return;
    }
    setChildAges((prev) => {
      if (prev.length === children) return prev;
      if (prev.length < children) return [...prev, ...Array(children - prev.length).fill("")];
      return prev.slice(0, children);
    });
  }, [useFitStyleGuests, children]);

  const AGE_OPTIONS = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ value: i, label: `만${i}세` })), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[16px] p-5 shadow-sm border border-[#e5e5e5] mx-5 mb-4"
    >
      <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-4">
        {mode === "fit" ? "자유여행 정보를 알려주세요" : "선호하시는 여행 정보를 알려주세요"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[14px] text-[#666] mb-2">여행지</label>
          <input
            type="text"
            placeholder="예: 발리, 파리, 도쿄"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3 rounded-[12px] bg-[#f5f5f5] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#7b3ff2]"
            style={{
              outlineColor: mode === "fit" ? "#7b3ff2" : "#3780ff"
            }}
          />
        </div>

        <div>
          <label className="block text-[14px] text-[#666] mb-2">여행시기</label>
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className="w-full px-4 py-3 rounded-[12px] bg-[#f5f5f5] text-[14px] text-[#111] flex items-center gap-2 text-left hover:bg-[#eee] transition-colors"
          >
            <Calendar className="size-4 text-[#666] shrink-0" strokeWidth={1.5} />
            <span>
              다음달
              {travelPeriodStart && travelPeriodEnd && (
                <> | {travelPeriodStart.slice(5, 7)}.{travelPeriodStart.slice(8, 10)}~{travelPeriodEnd.slice(5, 7)}.{travelPeriodEnd.slice(8, 10)}</>
              )}
            </span>
          </button>
          <TravelDatePickerSheet
            open={calendarOpen}
            onClose={() => setCalendarOpen(false)}
            startStr={travelPeriodStart}
            endStr={travelPeriodEnd}
            onSelect={(start, end) => {
              setTravelPeriodStart(start);
              setTravelPeriodEnd(end);
            }}
          />
        </div>

        {/* 패키지 모드일 때만 테마 선택 표시 */}
        {mode === "package" && (
          <div>
            <label className="block text-[14px] text-[#666] mb-2">여행 테마</label>
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-full text-[14px] transition-colors ${theme === t
                      ? "bg-[#3780ff] text-white"
                      : "bg-[#f5f5f5] text-[#666] hover:bg-[#e5e5e5]"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-[14px] text-[#666] mb-2">예산 (1인 기준)</label>
          <div className="grid grid-cols-2 gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-4 py-3 rounded-[12px] text-[14px] transition-colors ${budget === b
                    ? mode === "fit"
                      ? "bg-[#7b3ff2] text-white"
                      : "bg-[#3780ff] text-white"
                    : "bg-[#f5f5f5] text-[#666] hover:bg-[#e5e5e5]"
                  }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-[14px] text-[#666] mb-2">여행 인원 수</label>
          <div className={`grid gap-3 ${useFitStyleGuests ? "grid-cols-2" : "grid-cols-3"}`}>
            <div className="bg-[#f9f9f9] rounded-[12px] p-3">
              <p className="text-[12px] text-[#666] mb-2">성인</p>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => setAdults((a) => Math.max(1, a - 1))}
                  disabled={adults <= 1}
                  className="size-8 rounded-full bg-white border border-[#e5e5e5] text-[#111] font-['Pretendard:SemiBold',sans-serif] text-[16px] hover:bg-[#f0f0f0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                >
                  −
                </button>
                <span className="text-[16px] font-['Pretendard:Bold',sans-serif] text-[#111] tabular-nums">
                  {adults}
                </span>
                <button
                  type="button"
                  onClick={() => setAdults((a) => a + 1)}
                  className="size-8 rounded-full bg-white border border-[#e5e5e5] text-[#111] font-['Pretendard:SemiBold',sans-serif] text-[16px] hover:bg-[#f0f0f0] transition-colors flex items-center justify-center shrink-0"
                >
                  +
                </button>
              </div>
            </div>
            <div className="bg-[#f9f9f9] rounded-[12px] p-3">
              <p className="text-[12px] text-[#666] mb-2">아동</p>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setChildren((c) => Math.max(0, c - 1));
                    if (useFitStyleGuests) setChildAges((prev) => prev.slice(0, -1));
                  }}
                  disabled={children <= 0}
                  className="size-8 rounded-full bg-white border border-[#e5e5e5] text-[#111] font-['Pretendard:SemiBold',sans-serif] text-[16px] hover:bg-[#f0f0f0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                >
                  −
                </button>
                <span className="text-[16px] font-['Pretendard:Bold',sans-serif] text-[#111] tabular-nums">
                  {children}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setChildren((c) => c + 1);
                    if (useFitStyleGuests) setChildAges((prev) => [...prev, ""]);
                  }}
                  className="size-8 rounded-full bg-white border border-[#e5e5e5] text-[#111] font-['Pretendard:SemiBold',sans-serif] text-[16px] hover:bg-[#f0f0f0] transition-colors flex items-center justify-center shrink-0"
                >
                  +
                </button>
              </div>
            </div>
            {mode === "package" && !personaRecommendFlow && (
            <div className="bg-[#f9f9f9] rounded-[12px] p-3">
              <p className="text-[12px] text-[#666] mb-2">유아</p>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => setInfants((i) => Math.max(0, i - 1))}
                  disabled={infants <= 0}
                  className="size-8 rounded-full bg-white border border-[#e5e5e5] text-[#111] font-['Pretendard:SemiBold',sans-serif] text-[16px] hover:bg-[#f0f0f0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                >
                  −
                </button>
                <span className="text-[16px] font-['Pretendard:Bold',sans-serif] text-[#111] tabular-nums">
                  {infants}
                </span>
                <button
                  type="button"
                  onClick={() => setInfants((i) => i + 1)}
                  className="size-8 rounded-full bg-white border border-[#e5e5e5] text-[#111] font-['Pretendard:SemiBold',sans-serif] text-[16px] hover:bg-[#f0f0f0] transition-colors flex items-center justify-center shrink-0"
                >
                  +
                </button>
              </div>
            </div>
            )}
          </div>

          {/* 자유여행·추천검색: 아동 1명 이상일 때 아동 나이 선택 (만0세~만17세), 2열 그리드·플레이스홀더 아동1/아동2 */}
          {useFitStyleGuests && children >= 1 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {childAges.slice(0, children).map((age, index) => (
                <select
                  key={index}
                  id={`child-age-${index}`}
                  name={`아동${index + 1}`}
                  value={age}
                  onChange={(e) => {
                    const v = e.target.value;
                    setChildAges((prev) => {
                      const next = [...prev];
                      next[index] = v === "" ? "" : Number(v);
                      return next;
                    });
                  }}
                  className="w-full px-3 py-2.5 rounded-[12px] bg-[#f5f5f5] text-[14px] text-[#111] focus:outline-none focus:ring-2 focus:ring-[#7b3ff2] border border-transparent"
                >
                  <option value="">아동{index + 1}</option>
                  {AGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ))}
              {!isFitChildAgeValid && (
                <p className="text-[12px] text-red-600 mt-1 col-span-2">
                  성인 {adults}명에 유아 (만2세 미만) {adults}명 만을 예약하실 수 있으며, 나머지 유아는 소아(만2세 이상)으로 예약하셔야 합니다.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 패키지 모드: 단일 버튼 (추천검색 시 아동 나이 유효성 적용) */}
        {mode === "package" && (
          <button
            onClick={handlePackageSubmit}
            disabled={!isValid || (useFitStyleGuests && !isFitChildAgeValid)}
            className="w-full py-3 rounded-[12px] bg-[#3780ff] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d6fdf] transition-colors"
          >
            여행 상품 추천받기
          </button>
        )}

        {/* 자유여행 모드: 3개 버튼 */}
        {mode === "fit" && (
          <div className="space-y-2">
            <button
              onClick={() => handleSubmit('combo')}
              disabled={!isValid || !isFitChildAgeValid}
              className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              항공+호텔 조합 검색하기
            </button>
            <button
              onClick={() => handleSubmit('flight')}
              disabled={!isValid || !isFitChildAgeValid}
              className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              항공만 검색하기
            </button>
            <button
              onClick={() => handleSubmit('hotel')}
              disabled={!isValid || !isFitChildAgeValid}
              className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              호텔만 검색하기
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}