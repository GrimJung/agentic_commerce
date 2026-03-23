import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export interface RoomInfoNoticePopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** 중첩 시트 위에 올릴 때 등 (기본 z-[60]) */
  zClass?: string;
}

/**
 * 호텔 객실 예약 플로우에서 사용하는 객실 안내 모달 (RoomTypeSelector와 동일 본문)
 */
export function RoomInfoNoticePopup({
  open,
  onClose,
  onConfirm,
  zClass = "z-[60]",
}: RoomInfoNoticePopupProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 ${zClass} bg-black/50`}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed left-1/2 top-1/2 ${zClass} w-full max-w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl flex flex-col max-h-[85vh]`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-info-notice-title"
          >
            <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4 shrink-0">
              <h3
                id="room-info-notice-title"
                className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]"
              >
                객실 안내
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 -mr-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
                aria-label="닫기"
              >
                <X className="size-6 text-[#666]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 text-[14px] text-[#111] leading-[1.6]">
              <p>Porterage Fee, Total USD 32.32, Included in Rate</p>
              <p>호텔 규정에 따라, 모든 예약은 신규예약만 확정 가능하며 취소 후 다시 예약시 호텔 확정이 불가능합니다.</p>
              <p>(바우처 내 Confirm No 없는 예약의 경우 체크인 불가함)</p>
              <ul className="list-disc list-inside space-y-2 pl-0">
                <li>리조트피 및 인당 1회 제공의 포터리지피 포함입니다.</li>
                <li>베딩 타입(1베드, 2베드 등)은 개런티가 아닌 요청사항으로 호텔에 전달됩니다.</li>
                <li>Junior Suite, 1 King Bed, Ocean View 은 1킹베드만 제공되며, 성인 인원추가시 소파베드 1개 제공됩니다.</li>
                <li>CODE: HANA KAKAO BANK LTO</li>
              </ul>
            </div>
            <div className="shrink-0 px-5 pb-5 pt-2">
              <button
                type="button"
                onClick={onConfirm}
                className="w-full py-3 rounded-[12px] bg-[#7b3ff2] text-white text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#5e2bb8] transition-colors"
              >
                확인
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
