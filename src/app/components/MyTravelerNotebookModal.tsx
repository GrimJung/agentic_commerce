import { X } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

interface MyTravelerNotebookModalProps {
  onClose: () => void;
  /** 표시할 여행자 이름 (예: 예약자와 동일 시) */
  travelerName?: string;
  birthDate?: string;
  gender?: string;
}

export function MyTravelerNotebookModal({
  onClose,
  travelerName = "홍길동",
  birthDate = "1990.01.01",
  gender = "여",
}: MyTravelerNotebookModalProps) {
  useLockBodyScroll();
  return (
    <div
      className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal
      role="dialog"
      aria-labelledby="traveler-notebook-title"
    >
      <div
        className="bg-white w-full max-w-[340px] rounded-[16px] shadow-lg flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0] shrink-0">
          <h2
            id="traveler-notebook-title"
            className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]"
          >
            MY 여행자 수첩
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f5f5f5]"
            aria-label="닫기"
          >
            <X className="size-6 text-[#111]" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto">
          {/* 여행자 카드 */}
          <div className="rounded-[12px] border border-[#eee] bg-[#fafafa] p-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                {travelerName}
              </span>
              <span className="px-2 py-0.5 rounded-[6px] bg-[#e3f2fd] text-[12px] text-[#1976d2] font-['Pretendard:SemiBold',sans-serif]">
                나의정보
              </span>
            </div>
            <p className="text-[13px] text-[#666] mt-1.5">
              {birthDate.replace(/-/g, ".")} | {gender}
            </p>
            <p className="text-[12px] text-[#888] mt-1">여권 정보 등록 필요</p>
          </div>

          {/* 안내 문구 */}
          <p className="text-[12px] text-[#666] leading-[1.5]">
            * 여행자 정보 추가 또는 수정은 마이페이지{" "}
            <button
              type="button"
              className="text-[12px] text-[#7b3ff2] underline font-['Pretendard:SemiBold',sans-serif]"
              onClick={onClose}
            >
              [MY 여행자 관리]
            </button>
            에서 가능합니다.
          </p>
          <p className="text-[12px] text-[#666] mt-0 leading-[1.5]">
            이동 시 예약 진행은 종료되며, 입력된 정보는 저장되지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
