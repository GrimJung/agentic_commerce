import { useState } from "react";
import { motion } from "motion/react";
import { X, CreditCard, Smartphone } from "lucide-react";

interface PaymentModalProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentModal({ amount, onSuccess, onCancel }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile" | "">("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    if (!paymentMethod) return;
    
    setIsProcessing(true);
    // 결제 처리 시뮬레이션
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-[24px]"
      >
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-5 py-4 flex items-center justify-between">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">결제하기</h2>
          <button onClick={onCancel} className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="bg-[#f5f5f5] rounded-[16px] p-5 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[14px] text-[#666]">결제 금액</span>
              <span className="font-['Pretendard:Bold',sans-serif] text-[24px] text-[#3780ff]">
                {(amount / 10000).toFixed(0)}만원
              </span>
            </div>
            <p className="text-[12px] text-[#999]">※ 부가세 포함 금액입니다</p>
          </div>

          <div className="mb-6">
            <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-[#111] mb-3">
              결제 수단 선택
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full flex items-center gap-4 p-4 rounded-[12px] border-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-[#3780ff] bg-[#f0f7ff]"
                    : "border-[#e5e5e5] bg-white hover:border-[#ccc]"
                }`}
              >
                <div className={`size-10 rounded-full flex items-center justify-center ${
                  paymentMethod === "card" ? "bg-[#3780ff]" : "bg-[#f5f5f5]"
                }`}>
                  <CreditCard className={`size-5 ${paymentMethod === "card" ? "text-white" : "text-[#666]"}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                    신용/체크카드
                  </p>
                  <p className="text-[12px] text-[#999]">국내외 모든 카드 사용 가능</p>
                </div>
                {paymentMethod === "card" && (
                  <div className="size-5 rounded-full bg-[#3780ff] flex items-center justify-center">
                    <svg className="size-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>

              <button
                onClick={() => setPaymentMethod("mobile")}
                className={`w-full flex items-center gap-4 p-4 rounded-[12px] border-2 transition-all ${
                  paymentMethod === "mobile"
                    ? "border-[#3780ff] bg-[#f0f7ff]"
                    : "border-[#e5e5e5] bg-white hover:border-[#ccc]"
                }`}
              >
                <div className={`size-10 rounded-full flex items-center justify-center ${
                  paymentMethod === "mobile" ? "bg-[#3780ff]" : "bg-[#f5f5f5]"
                }`}>
                  <Smartphone className={`size-5 ${paymentMethod === "mobile" ? "text-white" : "text-[#666]"}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                    간편결제
                  </p>
                  <p className="text-[12px] text-[#999]">카카오페이, 네이버페이 등</p>
                </div>
                {paymentMethod === "mobile" && (
                  <div className="size-5 rounded-full bg-[#3780ff] flex items-center justify-center">
                    <svg className="size-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="bg-[#fff5f5] border border-[#ffe0e0] rounded-[12px] p-4 mb-6">
            <p className="text-[13px] text-[#666]">
              ⚠️ 결제 진행 시 예약이 확정되며, 취소 규정에 따라 환불됩니다.
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={!paymentMethod || isProcessing}
            className="w-full py-4 bg-[#3780ff] text-white rounded-[12px] text-[16px] font-['Pretendard:SemiBold',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d6fdf] transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin size-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                결제 처리 중...
              </>
            ) : (
              `${(amount / 10000).toFixed(0)}만원 결제하기`
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
