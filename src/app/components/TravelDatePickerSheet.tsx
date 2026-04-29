"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  addDays,
  addMonths,
  startOfDay,
  startOfMonth,
  endOfMonth,
  isBefore,
  isSameDay,
  isWithinInterval,
  format,
  getDay,
} from "date-fns";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { cn } from "./ui/utils";

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

const BRAND = "#6329C4";

/** 공휴일 라벨 (대표 일정, 필요 시 연도별 확장) */
const KR_HOLIDAY_LABELS: Record<string, string> = {
  "2026-01-01": "신정",
  "2026-03-01": "삼일절",
  "2026-05-01": "근로자의날",
  "2026-05-05": "어린이날",
  "2026-06-03": "지방선거",
  "2026-06-06": "현충일",
  "2026-08-15": "광복절",
  "2026-10-03": "개천절",
  "2026-10-09": "한글날",
  "2026-12-25": "성탄절",
};

function parseDateStr(s: string): Date {
  const [y, m, d] = s.split(".").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function dateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

/** 해당 월 캘린더 6주 그리드 (일요일 시작), 인접 월 날짜 포함 */
function getMonthGrid(year: number, monthIndex: number): (Date | null)[][] {
  const first = new Date(year, monthIndex, 1);
  const lead = getDay(first);
  const gridStart = addDays(first, -lead);
  const weeks: (Date | null)[][] = [];
  let cur = gridStart;
  for (let w = 0; w < 6; w++) {
    const row: (Date | null)[] = [];
    for (let i = 0; i < 7; i++) {
      row.push(new Date(cur));
      cur = addDays(cur, 1);
    }
    weeks.push(row);
  }
  return weeks;
}

function isFullMonthRange(from: Date, to: Date, year: number, monthIndex: number): boolean {
  const ms = startOfMonth(new Date(year, monthIndex, 1));
  const me = endOfMonth(new Date(year, monthIndex, 1));
  return isSameDay(from, ms) && isSameDay(to, me);
}

interface TravelDatePickerSheetProps {
  open: boolean;
  onClose: () => void;
  startStr: string;
  endStr: string;
  onSelect: (startStr: string, endStr: string) => void;
}

export function TravelDatePickerSheet({
  open,
  onClose,
  startStr,
  endStr,
  onSelect,
}: TravelDatePickerSheetProps) {
  useLockBodyScroll(open);
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);

  const todayStart = useMemo(() => startOfDay(new Date()), []);

  useEffect(() => {
    if (open) {
      const from = startStr ? parseDateStr(startStr) : undefined;
      const to = endStr ? parseDateStr(endStr) : undefined;
      setRange(from && to ? { from, to } : undefined);
    }
  }, [open, startStr, endStr]);

  const months = useMemo(() => {
    const start = startOfMonth(new Date());
    return Array.from({ length: 12 }, (_, i) => addMonths(start, i));
  }, []);

  const handleComplete = useCallback(() => {
    if (range?.from && range?.to) {
      onSelect(toDateStr(range.from), toDateStr(range.to));
      onClose();
    }
  }, [range, onSelect, onClose]);

  const onDayClick = useCallback(
    (day: Date, inCurrentMonth: boolean, monthWholeSelected: boolean) => {
      if (!inCurrentMonth) return;
      // 월전체 선택 중에는 체크 해제 후에만 일 단위로 시작/종료일을 고를 수 있게 함
      if (monthWholeSelected) return;
      const d0 = startOfDay(day);
      if (isBefore(d0, todayStart)) return;

      if (!range?.from || (range.from && range.to)) {
        setRange({ from: d0, to: undefined });
        return;
      }
      if (range.from && !range.to) {
        let a = range.from;
        let b = d0;
        if (isBefore(b, a)) [a, b] = [b, a];
        setRange({ from: a, to: b });
      }
    },
    [range, todayStart],
  );

  /** checked는 브라우저가 준 목표 상태 — range 추측보다 안전(이중 onChange 시 월전체가 다시 켜지는 버그 방지) */
  const toggleWholeMonth = useCallback((year: number, monthIndex: number, checked: boolean) => {
    const ms = startOfMonth(new Date(year, monthIndex, 1));
    const me = endOfMonth(new Date(year, monthIndex, 1));
    if (checked) {
      setRange({ from: ms, to: me });
      return;
    }
    setRange((prev) => {
      if (prev?.from && prev.to && isFullMonthRange(prev.from, prev.to, year, monthIndex)) {
        return undefined;
      }
      return prev;
    });
  }, []);

  /** to 미선택 시에도 첫 탭(from)을 시작일로 표시해, 이어서 종료일을 누르라는 흐름이 보이게 함 */
  const inRangeStyle = useCallback(
    (day: Date) => {
      if (!range?.from) return { isStart: false, isEnd: false, inMiddle: false };
      const from = startOfDay(range.from);
      const d = startOfDay(day);
      if (!range.to) {
        const isStart = isSameDay(d, from);
        return { isStart, isEnd: false, inMiddle: false };
      }
      const to = startOfDay(range.to);
      const isStart = isSameDay(d, from);
      const isEnd = isSameDay(d, to);
      const inMiddle =
        !isStart &&
        !isEnd &&
        isWithinInterval(d, { start: from, end: to });
      return { isStart, isEnd, inMiddle };
    },
    [range],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-[24px] bg-white"
          >
            <div className="flex shrink-0 items-center justify-between px-5 py-4">
              <span className="font-['Pretendard:Bold',sans-serif] text-[17px] text-[#000]">여행시기 선택</span>
              <button
                type="button"
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-full text-[#333] transition-colors hover:bg-[#F2F4F7]"
                aria-label="닫기"
              >
                <X className="size-6" strokeWidth={1.75} />
              </button>
            </div>

            {/* 고정 요일 헤더 */}
            <div className="shrink-0 border-b border-[#E8EAED] px-3 pb-2 pt-0">
              <div className="flex w-full">
                {WEEKDAY_KO.map((name, i) => (
                  <div
                    key={name}
                    className={cn(
                      "min-w-0 flex-1 text-center font-['Pretendard:Medium',sans-serif] text-[12px] text-[#333]",
                      (i === 0 || i === 6) && "text-[#E53935]",
                    )}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-contain px-3"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {months.map((monthAnchor) => {
                const y = monthAnchor.getFullYear();
                const m = monthAnchor.getMonth();
                const caption = format(monthAnchor, "yyyy.MM");
                const wholeChecked =
                  range?.from != null &&
                  range?.to != null &&
                  isFullMonthRange(range.from, range.to, y, m);
                const weeks = getMonthGrid(y, m);

                return (
                  <section key={`${y}-${m}`} className="border-b border-[#f3f3f3] py-5 last:border-b-0">
                    <div className="mb-3 flex items-center justify-between px-1">
                      <h3 className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#000]">{caption}</h3>
                      <label className="flex cursor-pointer items-center gap-2 select-none">
                        <span className="font-['Pretendard:Medium',sans-serif] text-[13px] text-[#666]">월전체</span>
                        <input
                          type="checkbox"
                          checked={wholeChecked}
                          onChange={(e) => toggleWholeMonth(y, m, e.target.checked)}
                          className="size-[18px] cursor-pointer rounded border-[#ccc] accent-[#6329C4]"
                          style={{ accentColor: BRAND }}
                        />
                      </label>
                    </div>

                    <div
                      className={cn(
                        "overflow-hidden rounded-[12px] px-1 py-2 transition-colors",
                        wholeChecked && "bg-[#f7f2fc]",
                      )}
                    >
                      {weeks.map((week, wi) => (
                        <div key={wi} className="flex w-full">
                          {week.map((day, di) => {
                            const inMonth = day.getMonth() === m;
                            const key = dateKey(day);
                            const holidayLabel = KR_HOLIDAY_LABELS[key];
                            const isSun = day.getDay() === 0;
                            const isSat = day.getDay() === 6;
                            const isWeekend = isSun || isSat;
                            const d0 = startOfDay(day);
                            const isPast = isBefore(d0, todayStart);
                            const isToday = isSameDay(d0, todayStart);
                            const { isStart, isEnd, inMiddle } = inRangeStyle(day);
                            const showHolidayRed = Boolean(holidayLabel) || isWeekend;

                            return (
                              <div key={key + di} className="relative min-h-[52px] flex-1 min-w-0 px-0.5">
                                <button
                                  type="button"
                                  disabled={!inMonth || isPast || (wholeChecked && inMonth)}
                                  onClick={() => onDayClick(day, inMonth, wholeChecked)}
                                  className={cn(
                                    "flex h-full w-full flex-col items-center justify-start rounded-[10px] pb-1 pt-1 transition-colors",
                                    inMiddle && !isStart && !isEnd && "bg-[#EDE4F8]",
                                    !inMonth && "pointer-events-none opacity-40",
                                    isPast && inMonth && "cursor-not-allowed opacity-35",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "flex size-9 items-center justify-center rounded-full font-['Pretendard:SemiBold',sans-serif] text-[14px] leading-none",
                                      !inMonth && "text-[#bbb]",
                                      inMonth && !isPast && !isStart && !isEnd && !inMiddle && showHolidayRed && "text-[#E53935]",
                                      inMonth && !isPast && !isStart && !isEnd && !inMiddle && !showHolidayRed && "text-[#111]",
                                      isPast && "text-[#ccc]",
                                      (isStart || isEnd) && "bg-[#6329C4] text-white shadow-sm",
                                    )}
                                  >
                                    {day.getDate()}
                                  </span>
                                  {isToday && !isPast && (
                                    <span className="mt-0.5 font-['Pretendard:Medium',sans-serif] text-[9px] uppercase leading-none text-[#999]">
                                      TODAY
                                    </span>
                                  )}
                                  {holidayLabel && !isPast && (
                                    <span className="mt-0.5 line-clamp-2 min-h-[22px] max-w-full px-0.5 text-center font-['Pretendard:Medium',sans-serif] text-[9px] leading-tight text-[#888]">
                                      {holidayLabel}
                                    </span>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="shrink-0 border-t border-[#E8EAED] bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <p className="mb-2 text-center font-['Pretendard:Medium',sans-serif] text-[13px] text-[#666]">
                {!range?.from && "① 시작일 → ② 종료일 순으로 눌러 주세요."}
                {range?.from && !range?.to && (
                  <>
                    종료일을 눌러 주세요.
                    <span className="mt-0.5 block text-[12px] text-[#999]">
                      시작 {toDateStr(range.from)} · 더 이른 날을 누르면 그날이 시작일로 잡힙니다
                    </span>
                  </>
                )}
                {range?.from && range?.to && (
                  <span className="text-[#333]">
                    {toDateStr(range.from)} ~ {toDateStr(range.to)}
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={handleComplete}
                disabled={!range?.from || !range?.to}
                className="w-full rounded-full bg-[#6329C4] py-4 font-['Pretendard:SemiBold',sans-serif] text-[16px] text-white transition-colors hover:bg-[#5423AD] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#6329C4]"
              >
                선택 완료
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
