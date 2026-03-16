import { motion } from "motion/react";
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
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-4 py-3 flex items-center justify-start z-10 shrink-0">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">항공권 상세</h2>
        </div>
        <FlightDetailContent flight={flight} onBooking={onBooking} onChangeFlight={onChangeFlight} />
      </motion.div>
    </div>
  );
}
