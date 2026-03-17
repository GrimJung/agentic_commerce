import { motion } from "motion/react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { FlightData } from "./FlightCard";
import { FlightDetailContent } from "./FlightDetailContent";

interface FlightDetailProps {
  flight: FlightData;
  onClose: () => void;
  onBooking: () => void;
  /** 항공권 변경 클릭 시 호출 (항공권 선택 팝업 열기) */
  onChangeFlight?: () => void;
}

export function FlightDetail({ flight, onClose, onBooking, onChangeFlight }: FlightDetailProps) {
  useLockBodyScroll();
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-white w-full rounded-t-[24px] max-h-[85vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-4 py-3 flex items-center justify-between z-10 shrink-0">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">항공권 상세</h2>
          <button
            type="button"
            onClick={onClose}
            className="size-10 flex items-center justify-center rounded-full text-[#666] hover:bg-[#f0f0f0] hover:text-[#111] transition-colors"
            aria-label="닫기"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <FlightDetailContent flight={flight} onBooking={onBooking} onChangeFlight={onChangeFlight} />
      </motion.div>
    </div>
  );
}
