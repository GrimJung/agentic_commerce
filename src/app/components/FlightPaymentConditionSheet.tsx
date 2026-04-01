import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

interface PaymentCondition {
  id: string;
  name: string;
  priceDiff: number;
}

const PAYMENT_CONDITIONS: PaymentCondition[] = [
  { id: "samsung-id-global", name: "삼성 iD GLOBAL 카드", priceDiff: 0 },
  { id: "hyundai-korean-air", name: "현대 대한항공카드", priceDiff: 3200 },
  { id: "woori", name: "우리카드", priceDiff: 12800 },
  { id: "samsung", name: "삼성카드", priceDiff: 12800 },
  { id: "shinhan", name: "신한카드", priceDiff: 12800 },
  { id: "nh", name: "NH농협카드", priceDiff: 19200 },
  { id: "hyundai", name: "현대카드", priceDiff: 19200 },
  { id: "kb", name: "KB국민카드", priceDiff: 22400 },
  { id: "ibk", name: "IBK기업은행카드", priceDiff: 32000 },
  { id: "hana", name: "하나카드", priceDiff: 32000 },
  { id: "lotte", name: "롯데카드", priceDiff: 32000 },
  { id: "all", name: "모든 결제수단", priceDiff: 32000 },
];

interface FlightPaymentConditionSheetProps {
  onClose: () => void;
  onSelect: (condition: PaymentCondition) => void;
}

export function FlightPaymentConditionSheet({
  onClose,
  onSelect,
}: FlightPaymentConditionSheetProps) {
  useLockBodyScroll();
  const [selectedId, setSelectedId] = useState(PAYMENT_CONDITIONS[0].id);

  const handleSelect = () => {
    const condition = PAYMENT_CONDITIONS.find((c) => c.id === selectedId);
    if (condition) onSelect(condition);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[70] flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full rounded-t-[24px] flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* 헤더 */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between shrink-0">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
            결제조건 선택
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
            aria-label="닫기"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 안내 텍스트 */}
        <p className="px-5 pb-3 text-[13px] text-[#888] text-right shrink-0">
          총 결제금액 기준
        </p>

        {/* 목록 */}
        <div className="overflow-y-auto flex-1 px-5">
          {PAYMENT_CONDITIONS.map((condition) => (
            <button
              key={condition.id}
              type="button"
              onClick={() => setSelectedId(condition.id)}
              className="w-full flex items-center justify-between py-4 border-b border-[#f0f0f0] last:border-0"
            >
              <div className="flex items-center gap-3">
                {/* 라디오 버튼 */}
                <div
                  className={`size-[22px] rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedId === condition.id
                      ? "border-[#7b3ff2]"
                      : "border-[#ccc]"
                  }`}
                >
                  {selectedId === condition.id && (
                    <div className="size-[12px] rounded-full bg-[#7b3ff2]" />
                  )}
                </div>
                <span className="text-[15px] text-[#111]">{condition.name}</span>
              </div>
              <span
                className={`text-[15px] font-['Pretendard:Bold',sans-serif] ${
                  condition.priceDiff === 0
                    ? "text-[#111]"
                    : "text-[#111]"
                }`}
              >
                {condition.priceDiff === 0
                  ? "0원"
                  : `+${condition.priceDiff.toLocaleString()}원`}
              </span>
            </button>
          ))}
        </div>

        {/* 선택하기 버튼 */}
        <div className="px-5 pt-4 pb-8 shrink-0">
          <button
            type="button"
            onClick={handleSelect}
            className="w-full py-4 bg-[#7b3ff2] text-white rounded-[30px] text-[16px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
          >
            선택하기
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
