import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin } from "lucide-react";
import { TravelDatePickerSheet } from "./TravelDatePickerSheet";

const LABEL = "#666666";

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
    searchMode?: "combo" | "flight" | "hotel";
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

const chipBase =
  "px-4 py-2 rounded-full text-[14px] font-['Pretendard:Medium',sans-serif] transition-colors border border-solid";

const fieldShell =
  "w-full px-4 py-3 rounded-[14px] bg-[#F2F4F7] text-[14px] text-[#111] border-0 focus:outline-none focus:ring-2 focus:ring-[#6329C4]/20";

const ctaBase =
  "w-full py-3.5 rounded-full bg-[#6329C4] text-white font-['Pretendard:SemiBold',sans-serif] text-[15px] hover:bg-[#5423AD] disabled:opacity-50 disabled:hover:bg-[#6329C4] disabled:cursor-not-allowed transition-colors shadow-sm";

export function PreferenceInput({
  onSubmit,
  mode = "package",
  personaRecommendFlow: _personaRecommendFlow = false,
  initialDestination = "도쿄",
  initialBudget = "",
  initialTheme = "",
}: PreferenceInputProps) {
  const [theme, setTheme] = useState(initialTheme);
  const [budget, setBudget] = useState(initialBudget);
  const [destination, setDestination] = useState(initialDestination);
  const defaultPeriod = useMemo(getOneMonthLaterRange, []);
  const [travelPeriodStart, setTravelPeriodStart] = useState(defaultPeriod.start);
  const [travelPeriodEnd, setTravelPeriodEnd] = useState(defaultPeriod.end);

  const [calendarOpen, setCalendarOpen] = useState(false);

  const themes = ["휴양", "문화탐방", "자연경관", "레저/액티비티", "쇼핑"];
  const budgets = ["100만원 이하", "100-200만원", "200-300만원", "300만원 이상"];

  const travelPeriodDisplay =
    travelPeriodStart && travelPeriodEnd
      ? `${travelPeriodStart.slice(5, 7)}.${travelPeriodStart.slice(8, 10)}~${travelPeriodEnd.slice(5, 7)}.${travelPeriodEnd.slice(8, 10)}`
      : undefined;

  const defaultParty = { travelers: 1, adults: 1, children: 0 };

  const handleSubmit = (submitMode: "combo" | "flight" | "hotel") => {
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
        searchMode: "combo",
        travelPeriodDisplay,
      });
    }
  };

  const isValid = Boolean(theme || budget || destination);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] border border-[#E8EAED] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] mx-5 mb-4"
    >
      <h3 className="font-['Pretendard:Bold',sans-serif] text-[17px] leading-snug text-[#000] mb-4">
        {mode === "fit" ? "자유여행 정보를 알려주세요" : "선호하시는 여행 정보를 알려주세요"}
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-[13px] font-medium mb-2" style={{ color: LABEL }}>
            여행지
          </label>
          <div className="relative">
            <MapPin
              className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#888]"
              strokeWidth={1.5}
              aria-hidden
            />
            <input
              type="text"
              placeholder="예: 발리, 파리, 도쿄"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={`${fieldShell} pl-11 placeholder:text-[#999]`}
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-2" style={{ color: LABEL }}>
            여행시기
          </label>
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className={`${fieldShell} flex items-center gap-2 text-left hover:opacity-95`}
          >
            <Calendar className="size-[18px] shrink-0 text-[#888]" strokeWidth={1.5} />
            <span>
              다음달
              {travelPeriodStart && travelPeriodEnd && (
                <>
                  {" "}
                  | {travelPeriodStart.slice(5, 7)}.{travelPeriodStart.slice(8, 10)}~{travelPeriodEnd.slice(5, 7)}.
                  {travelPeriodEnd.slice(8, 10)}
                </>
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
          <label className="block text-[13px] font-medium mb-2" style={{ color: LABEL }}>
            여행 테마
          </label>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`${chipBase} ${
                  theme === t
                    ? "border-[#6329C4] bg-white text-[#6329C4]"
                    : "border-transparent bg-[#F2F4F7] text-[#333]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-2" style={{ color: LABEL }}>
            예산 (1인 기준)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                className={`${chipBase} py-2.5 text-[13px] leading-tight ${
                  budget === b
                    ? "border-[#6329C4] bg-white text-[#6329C4]"
                    : "border-transparent bg-[#F2F4F7] text-[#333]"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {mode === "package" && (
          <button type="button" onClick={handlePackageSubmit} disabled={!isValid} className={ctaBase}>
            여행 상품 추천받기
          </button>
        )}

        {mode === "fit" && (
          <div className="space-y-2.5">
            <button type="button" onClick={() => handleSubmit("combo")} disabled={!isValid} className={ctaBase}>
              항공+호텔 조합 검색하기
            </button>
            <button type="button" onClick={() => handleSubmit("flight")} disabled={!isValid} className={ctaBase}>
              항공만 검색하기
            </button>
            <button type="button" onClick={() => handleSubmit("hotel")} disabled={!isValid} className={ctaBase}>
              호텔만 검색하기
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
