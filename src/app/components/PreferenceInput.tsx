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
    childAges?: number[]; // 아동 나이 (만2~만17)
  }) => void;
  mode?: "package" | "fit"; // 패키지 또는 자유여행 모드
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
  /** 아동별 나이 (만2세=2 ~ 만17세=17, ''=미선택). length === children */
  const [childAges, setChildAges] = useState<(number | string)[]>([]);

  const [calendarOpen, setCalendarOpen] = useState(false);

  const travelers = adults + children;

  const themes = ["휴양", "문화탐방", "자연경관", "레저/액티비티", "쇼핑"];
  const budgets = ["100만원 이하", "100-200만원", "200-300만원", "300만원 이상"];

  const travelPeriodDisplay = travelPeriodStart && travelPeriodEnd
    ? `${travelPeriodStart.slice(5, 7)}.${travelPeriodStart.slice(8, 10)}~${travelPeriodEnd.slice(5, 7)}.${travelPeriodEnd.slice(8, 10)}`
    : undefined;

  const handleSubmit = (submitMode: 'combo' | 'flight' | 'hotel') => {
    if (budget || destination || theme) {
      onSubmit({
        theme,
        budget,
        destination,
        travelers,
        searchMode: submitMode,
        travelPeriodDisplay,
        adults,
        children,
        childAges: children > 0 ? childAges.map((a) => (a === "" ? 2 : a as number)) : undefined,
      });
    }
  };

  const handlePackageSubmit = () => {
    if (isValid) {
      onSubmit({
        theme,
        budget,
        destination,
        travelers,
        searchMode: 'combo',
        travelPeriodDisplay,
        adults,
        children,
        childAges: children > 0 ? childAges.map((a) => (a === "" ? 2 : a as number)) : undefined,
      });
    }
  };

  const isValid = theme || budget || destination;

  // 아동 수 변경 시 childAges 길이 동기화
  useEffect(() => {
    if (children === 0) {
      setChildAges([]);
      return;
    }
    setChildAges((prev) => {
      if (prev.length === children) return prev;
      if (prev.length < children) return [...prev, ...Array(children - prev.length).fill("")];
      return prev.slice(0, children);
    });
  }, [children]);

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

        <div>
          <label className="block text-[14px] text-[#666] mb-2">여행 테마</label>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-full text-[14px] transition-colors ${theme === t
                    ? mode === "fit" ? "bg-[#7b3ff2] text-white" : "bg-[#3780ff] text-white"
                    : "bg-[#f5f5f5] text-[#666] hover:bg-[#e5e5e5]"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

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
          <div className="grid gap-3 grid-cols-2">
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
                  onClick={() => setChildren((c) => Math.max(0, c - 1))}
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
                  onClick={() => setChildren((c) => c + 1)}
                  className="size-8 rounded-full bg-white border border-[#e5e5e5] text-[#111] font-['Pretendard:SemiBold',sans-serif] text-[16px] hover:bg-[#f0f0f0] transition-colors flex items-center justify-center shrink-0"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 아동 1명 이상일 때 나이 선택 (만2세~만17세) */}
          {children >= 1 && (
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
            </div>
          )}
        </div>

        {/* 패키지 모드: 단일 버튼 */}
        {mode === "package" && (
          <button
            onClick={handlePackageSubmit}
            disabled={!isValid}
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
              disabled={!isValid}
              className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              항공+호텔 조합 검색하기
            </button>
            <button
              onClick={() => handleSubmit('flight')}
              disabled={!isValid}
              className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
            >
              항공만 검색하기
            </button>
            <button
              onClick={() => handleSubmit('hotel')}
              disabled={!isValid}
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
