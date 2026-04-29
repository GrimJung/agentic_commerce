import { motion } from "motion/react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { FlightData } from "./FlightCard";
import { X } from "lucide-react";
import { formatSeatClass } from "./ui/utils";

interface FlightComparisonProps {
  flights: FlightData[];
  onClose: () => void;
  onSelect: (flight: FlightData) => void;
}

export function FlightComparison({ flights, onClose, onSelect }: FlightComparisonProps) {
  useLockBodyScroll();
  const displayFlights = flights.slice(0, 3);
  const labels = ["A", "B", "C"];

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
            <h1 className="text-[16px] font-semibold text-gray-900">AI 비교 브리핑</h1>
            <p className="text-[12px] text-[var(--color-gray-400)] mt-0.5 leading-snug">
              AI가 항공편을 분석해 드려요.
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

        <div className="flex-1 overflow-y-auto min-h-0 w-full">
          <div className="px-4 pt-2.5 pb-10">
          <div className="px-5">
          {/* 태그 */}
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
            <div className="px-4 py-2 bg-gradient-to-b from-[#7c4ddb] to-[#6329C4] rounded-full">
              <span className="text-[13px] text-white">직항 우선</span>
            </div>
            <div className="px-4 py-2 bg-[#e9e5fb] rounded-full">
              <span className="text-[13px] text-[#4a5565]">최저가</span>
            </div>
            <div className="px-4 py-2 bg-[#e9e5fb] rounded-full">
              <span className="text-[13px] text-[#4a5565]">시간대 적합</span>
            </div>
          </div>

          {/* AI 브리핑 */}
          <div className="bg-white rounded-[10px] p-4 mb-4 border border-[#f0f0f0]">
            <p className="text-[15px] text-[#6329C4] font-['Pretendard:Bold',sans-serif] mb-3">
              "항공편의 가격, 소요시간, 직항 여부를 종합 비교해 드립니다."
            </p>
            <div className="space-y-2">
              {displayFlights.map((flight, index) => (
                <div key={flight.id} className="flex gap-2">
                  <span className="text-[16px] text-[#00d9c0]">•</span>
                  <div className="flex items-start gap-2">
                    <div className="size-5 bg-[rgba(123,63,242,0.1)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[11px] text-[#6329C4]">{labels[index]}</span>
                    </div>
                    <p className="text-[14px] text-[#364153] leading-[1.5]">
                      {flight.airline} {flight.isDirect ? "직항" : "경유"}, {flight.flightDuration} 소요, {(flight.price / 10000).toFixed(0)}만원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 비교 테이블 */}
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left p-3 text-[12px] text-[#4a5565] font-['Pretendard:Regular',sans-serif] w-[80px]">
                    항공편
                  </th>
                  {displayFlights.map((flight, index) => (
                    <td key={flight.id} className="p-3 text-center border-l border-[#e5e7eb]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-6 bg-[rgba(123,63,242,0.1)] rounded-full flex items-center justify-center">
                          <span className="text-[#6329C4] text-[12px] font-['Pretendard:Bold',sans-serif]">
                            {labels[index]}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-[13px] font-['Pretendard:Bold',sans-serif] text-[#6329C4]">
                            {(flight.price / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </p>
                          <p className="text-[11px] text-[#6a7282]">만원</p>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">항공사</td>
                  {displayFlights.map(flight => (
                    <td key={flight.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {flight.airline}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">출발시간</td>
                  {displayFlights.map(flight => (
                    <td key={flight.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {flight.departureTime}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">도착시간</td>
                  {displayFlights.map(flight => (
                    <td key={flight.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {flight.arrivalTime}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">비행시간</td>
                  {displayFlights.map(flight => (
                    <td key={flight.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {flight.flightDuration}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">직항/경유</td>
                  {displayFlights.map(flight => (
                    <td key={flight.id} className="p-3 text-center text-[12px] border-l border-[#e5e7eb]">
                      <span className={flight.isDirect ? "text-[#2e7d32]" : "text-[#e65100]"}>
                        {flight.isDirect ? "직항" : "경유"}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-[12px] text-[#4a5565]">좌석등급</td>
                  {displayFlights.map(flight => (
                    <td key={flight.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {formatSeatClass(flight.seatClass)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* 상품 카드 */}
          <div className="space-y-3 pb-6">
            {displayFlights.map((flight, index) => (
              <div key={flight.id} className="border border-[#e5e5e5] rounded-[12px] overflow-hidden">
                <div className="p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="relative">
                      <div className="w-[80px] h-[80px] bg-[#f8f9fa] rounded-[8px] flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-[12px] text-[#666]">{flight.airline}</p>
                          <p className="text-[11px] text-[#999]">{flight.isDirect ? "직항" : "경유"}</p>
                        </div>
                      </div>
                      <div className="absolute -top-2 -left-2 size-6 bg-[#6329C4] rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-[12px] font-['Pretendard:Bold',sans-serif]">
                          {labels[index]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] mb-1">
                        {flight.departure} → {flight.arrival}
                      </h4>
                      <p className="text-[12px] text-[#999] mb-1">{flight.departureTime} - {flight.arrivalTime} ({flight.flightDuration})</p>
                      <p className="text-[12px] text-[#999] mb-2">{formatSeatClass(flight.seatClass)}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#6329C4]">
                          {(flight.price / 10000).toFixed(0)}만원
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelect(flight)}
                    className="w-full py-2.5 bg-[#6329C4] text-white rounded-[8px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#5423AD] transition-colors"
                  >
                    이 항공편 선택하기
                  </button>
                </div>
              </div>
            ))}
          </div>
          </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
