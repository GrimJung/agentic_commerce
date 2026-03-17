"use client";

import { useState, useCallback, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

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

/** 26.04.01 (수) 형식 */
function formatDateWithWeekday(d: Date): string {
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const w = WEEKDAY_KO[d.getDay()];
  return `${yy}.${mm}.${dd} (${w})`;
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

  useEffect(() => {
    if (open) {
      const from = startStr ? parseDateStr(startStr) : undefined;
      const to = endStr ? parseDateStr(endStr) : undefined;
      setRange(from && to ? { from, to } : undefined);
    }
  }, [open, startStr, endStr]);

  const handleSelect = useCallback((r: { from?: Date; to?: Date } | undefined) => {
    setRange(r);
  }, []);

  const handleComplete = useCallback(() => {
    if (range?.from && range?.to) {
      onSelect(toDateStr(range.from), toDateStr(range.to));
      onClose();
    }
  }, [range, onSelect, onClose]);

  const today = new Date();
  const fromMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const toMonth = new Date(today.getFullYear() + 1, today.getMonth(), 0);
  const numberOfMonths = 12;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-[24px] z-50 max-h-[85vh] overflow-hidden flex flex-col w-full"
          >
            {/* 헤더: 날짜 선택 (좌) / X (우) */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0] shrink-0">
              <span className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111]">
                날짜 선택
              </span>
              <button
                type="button"
                onClick={onClose}
                className="size-8 flex items-center justify-center text-[#666] hover:bg-[#f0f0f0] rounded-full transition-colors"
                aria-label="닫기"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 캘린더 영역: 높이 고정 후 세로 스크롤 (화면에는 약 2개월만 보임) */}
            <div
              className="overflow-y-auto overflow-x-hidden overscroll-y-contain shrink-0 touch-pan-y"
              style={{ height: "52vh", minHeight: "280px", WebkitOverflowScrolling: "touch" }}
            >
              <DayPicker
                mode="range"
                selected={range}
                onSelect={handleSelect}
                defaultMonth={fromMonth}
                locale={ko}
                showOutsideDays
                fromDate={fromMonth}
                toDate={toMonth}
                numberOfMonths={numberOfMonths}
                pagedNavigation={false}
                disableNavigation
                weekStartsOn={0}
                className="!block !h-auto"
                formatters={{
                  formatCaption: (date) =>
                    `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`,
                  formatWeekdayName: (date) => WEEKDAY_KO[date.getDay()],
                }}
                modifiers={{
                  weekend: { dayOfWeek: [0, 6] },
                }}
                modifiersClassNames={{
                  weekend: "text-red-600",
                }}
                classNames={{
                  months: "flex flex-col gap-8 py-4 px-3 w-full max-w-full",
                  month: "flex flex-col gap-3 w-full",
                  caption: "flex justify-center w-full py-2",
                  caption_label: "text-[15px] font-['Pretendard:Bold',sans-serif] text-[#111]",
                  nav: "hidden",
                  table: "w-full border-collapse table-fixed",
                  head_row: "flex w-full",
                  head_cell:
                    "flex-1 min-w-0 text-[12px] font-medium py-2 text-center first:text-red-600 last:text-red-600",
                  row: "flex w-full",
                  cell: "relative p-0 text-center text-[14px] flex-1 min-w-0 flex flex-col items-center justify-center",
                  day: "size-10 rounded-full flex items-center justify-center font-['Pretendard:SemiBold',sans-serif]",
                  day_button:
                    "size-10 rounded-full flex items-center justify-center hover:bg-[#f0f0f0] transition-colors w-full max-w-[40px]",
                  day_outside: "text-[#ccc]",
                  day_today: "bg-[#e5e5e5] text-[#111]",
                  day_hidden: "invisible",
                  day_range_start: "!bg-[#7b3ff2] !text-white rounded-full",
                  day_range_end: "!bg-[#7b3ff2] !text-white rounded-full",
                  day_range_middle: "!bg-[#e9e5fb] !text-[#111]",
                }}
              />
            </div>

            {/* 하단: 출발일 / 도착일, [날짜 선택 완료] */}
            <div className="shrink-0 border-t border-[#f0f0f0] p-4 bg-white">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[13px] text-[#666] mb-1">출발일</p>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                    {range?.from ? formatDateWithWeekday(range.from) : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-[#666] mb-1">도착일</p>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                    {range?.to ? formatDateWithWeekday(range.to) : "-"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleComplete}
                disabled={!range?.from || !range?.to}
                className="w-full py-4 rounded-[12px] bg-[#7b3ff2] text-white text-[15px] font-['Pretendard:SemiBold',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6930d9] transition-colors"
              >
                날짜 선택 완료
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
