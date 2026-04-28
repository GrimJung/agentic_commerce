import { useState, useMemo } from "react";
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
}

export function PreferenceInput({ onSubmit, mode = "package", personaRecommendFlow = false, initialDestination = "도쿄", initialBudget = "", initialTheme = "" }: PreferenceInputProps) {
  const [theme, setTheme] = useState(initialTheme);
  const [budget, setBudget] = useState(initialBudget);
  const [destination, setDestination] = useState(initialDestination);
  const defaultPeriod = useMemo(getOneMonthLaterRange, []);
  const [travelPeriodStart, setTravelPeriodStart] = useState(defaultPeriod.start);
  const [travelPeriodEnd, setTravelPeriodEnd] = useState(defaultPeriod.end);

  const [calendarOpen, setCalendarOpen] = useState(false);

  const themes = ["휴양", "문화탐방", "자연경관", "레저/액티비티", "쇼핑"];
  const budgets = ["100만원 이하", "100-200만원", "200-300만원", "300만원 이상"];

  const travelPeriodDisplay = travelPeriodStart && travelPeriodEnd
    ? `${travelPeriodStart.slice(5, 7)}.${travelPeriodStart.slice(8, 10)}~${travelPeriodEnd.slice(5, 7)}.${travelPeriodEnd.slice(8, 10)}`
    : undefined;

  const defaultParty = { travelers: 1, adults: 1, children: 0 };

  const handleSubmit = (submitMode: 'combo' | 'flight' | 'hotel') => {
    if (budget || destination || theme) {
      onSubmit({
        theme,
        budget,
        destination,
        ...defaultParty,
        searchMode: submitMode,
        travelPeriodDisplay,
      });
    }
  };

  const handlePackageSubmit = () => {
    if (isValid) {
      onSubmit({
        theme,
        budget,
        destination,
        ...defaultParty,
        searchMode: 'combo',
        travelPeriodDisplay,
      });
    }
  };

  const isValid = theme || budget || destination;

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
