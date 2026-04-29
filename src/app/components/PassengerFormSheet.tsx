import { useState } from "react";
import { motion } from "motion/react";
import { X, User, HelpCircle, Camera, CircleAlert, Info } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { MyTravelerNotebookModal } from "./MyTravelerNotebookModal";

interface PassengerFormSheetProps {
  onClose: () => void;
  onConfirm?: () => void;
  /** 예약자와 동일 시 채울 기본값 */
  bookerName?: string;
  bookerBirthDate?: string;
  bookerPhone?: string;
  bookerEmail?: string;
}

export function PassengerFormSheet({
  onClose,
  onConfirm,
  bookerName = "홍길동",
  bookerBirthDate = "1990.01.01",
  bookerPhone = "010-0000-0000",
  bookerEmail = "hana@hanatour.com",
}: PassengerFormSheetProps) {
  useLockBodyScroll();
  const [sameAsBooker, setSameAsBooker] = useState(true);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [passportLater, setPassportLater] = useState(true);
  const [showTravelerNotebook, setShowTravelerNotebook] = useState(false);

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-end"
      onClick={onClose}
      aria-modal
      role="dialog"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-white w-full rounded-t-[24px] max-h-[85vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-4 py-3 flex items-center justify-end z-10 shrink-0">
          <h1 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111] flex-1">
            탑승자 정보 입력
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f5f5f5]"
            aria-label="닫기"
          >
            <X className="size-6 text-[#111]" />
          </button>
        </div>

        <div className="px-5 py-4 flex-1 overflow-y-auto pb-28">
          {/* 헤더 밑: 탑승자 구분 + MY 여행자수첩 */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] text-[#666] flex items-center gap-1.5 font-semibold">
              <User className="size-4 shrink-0 text-[#666]" />
              탑승자1 (성인)
            </p>
            <button
              type="button"
              onClick={() => setShowTravelerNotebook(true)}
              className="flex items-center gap-2 px-0 py-1.5 rounded-[8px] border-0 text-[13px] text-[#111] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f9f9f9]"
            >
              <User className="size-4 shrink-0 text-[#111] border border-[#111]" />
              <span className="underline">MY 여행자수첩</span>
              <Info className="size-[14px] shrink-0 text-[#666]" />
            </button>
          </div>

          {showTravelerNotebook && (
            <MyTravelerNotebookModal
              onClose={() => setShowTravelerNotebook(false)}
              travelerName={bookerName}
              birthDate={bookerBirthDate}
              gender={gender === "male" ? "남" : "여"}
            />
          )}

          {/* 예약자와 동일 */}
          <button
            type="button"
            onClick={() => setSameAsBooker(!sameAsBooker)}
            className={`w-full flex items-center gap-2 py-3 px-4 rounded-[10px] mb-5 text-left ${
              sameAsBooker ? "bg-[#f8f5ff] border border-[#e8e0f5]" : "bg-[#f9f9f9] border border-[#eee]"
            }`}
          >
            <span
              className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                sameAsBooker ? "border-[#6329C4] bg-[#6329C4]" : "border-[#ddd] bg-white"
              }`}
            >
              {sameAsBooker && <span className="text-white text-[10px]">✓</span>}
            </span>
            <span className="text-[14px] font-['Pretendard:SemiBold',sans-serif] text-[#111]">
              예약자와 정보가 동일합니다
            </span>
          </button>

          {/* 탑승자 개인정보 (예약자와 동일 시 해당 영역 딤 처리) */}
          <section className="mb-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  {...(sameAsBooker ? { value: bookerName, readOnly: true } : { defaultValue: "" })}
                  placeholder="한글 이름"
                  className={`flex-1 min-w-0 px-4 py-3 border rounded-[10px] text-[14px] ${
                    sameAsBooker
                      ? "border-[#e8e8e8] bg-[#f5f5f5] text-[#888] cursor-default"
                      : "border-[#eee]"
                  }`}
                />
                <div className="flex rounded-[8px] border border-[#eee] overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`px-3 py-2.5 text-[13px] border shrink-0 rounded-l-[8px] ${
                      gender === "male"
                        ? "border-[#111] border-r-0 bg-white text-[#111] font-['Pretendard:SemiBold',sans-serif]"
                        : "border-transparent bg-white text-[#999]"
                    }`}
                  >
                    남
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`px-3 py-2.5 text-[13px] border shrink-0 rounded-r-[8px] border-l-0 ${
                      gender === "female"
                        ? "border-[#111] bg-white text-[#111] font-['Pretendard:SemiBold',sans-serif]"
                        : "border-transparent bg-white text-[#999]"
                    }`}
                  >
                    여
                  </button>
                </div>
              </div>
              <div className="flex-1 min-w-0 relative">
                <input
                  type="text"
                  {...(sameAsBooker
                    ? { value: bookerBirthDate.replace(/\./g, ""), readOnly: true }
                    : { defaultValue: "" })}
                  placeholder="YYYYMMDD"
                  className={`w-full px-4 py-3 pr-10 border rounded-[10px] text-[14px] ${
                    sameAsBooker
                      ? "border-[#e8e8e8] bg-[#f5f5f5] text-[#888] cursor-default"
                      : "border-[#eee]"
                  }`}
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#999] pointer-events-auto" aria-label="도움말">
                  <HelpCircle className="size-5" />
                </button>
              </div>
              <div className="flex-1 min-w-0 relative">
                <input
                  type="text"
                  placeholder="영문 성 (ex.HONG) 영문만 입력가능"
                  className="w-full px-4 py-3 pr-10 border border-[#eee] rounded-[10px] text-[14px] bg-white text-[#999]"
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#999] pointer-events-auto" aria-label="도움말">
                  <HelpCircle className="size-5" />
                </button>
              </div>
              <div className="flex-1 min-w-0 relative">
                <input
                  type="text"
                  placeholder="영문 이름 (ex.GILDONG) 영문만 입력가능"
                  className="w-full px-4 py-3 pr-10 border border-[#eee] rounded-[10px] text-[14px] bg-white text-[#999]"
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#999] pointer-events-auto" aria-label="도움말">
                  <HelpCircle className="size-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  {...(sameAsBooker ? { value: bookerPhone, readOnly: true } : { defaultValue: "" })}
                  placeholder="01000000000"
                  className={`flex-1 min-w-0 px-4 py-3 border rounded-[10px] text-[14px] ${
                    sameAsBooker
                      ? "border-[#e8e8e8] bg-[#f5f5f5] text-[#888] cursor-default"
                      : "border-[#eee]"
                  }`}
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  {...(sameAsBooker ? { value: bookerEmail, readOnly: true } : { defaultValue: "" })}
                  placeholder="example@email.com"
                  className={`flex-1 min-w-0 px-4 py-3 border rounded-[10px] text-[14px] ${
                    sameAsBooker
                      ? "border-[#e8e8e8] bg-[#f5f5f5] text-[#888] cursor-default"
                      : "border-[#eee]"
                  }`}
                />
              </div>
            </div>
            <button
              type="button"
              className="w-full mt-3 py-3 px-4 border border-[#eee] rounded-[10px] flex items-center justify-center gap-2 text-[14px] text-[#111] font-['Pretendard:Medium',sans-serif] hover:bg-[#f9f9f9]"
            >
              <Camera className="size-5 text-[#666]" />
              H-AI 여권등록 &gt;
            </button>
          </section>

          {/* 여권 정보 */}
          <section className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[15px] text-[#111]">
                여권 정보
              </h3>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={passportLater}
                  onChange={(e) => setPassportLater(e.target.checked)}
                  className="size-4 rounded border-[#ddd] text-[#6329C4]"
                />
                <span className="text-[13px] text-[#999]">여권정보 나중에 등록</span>
                <CircleAlert className="size-4 text-[#999]" />
              </label>
            </div>
            {!passportLater && (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="여권 번호(ex. M70689098)"
                    className="w-full px-4 py-3 pr-10 border border-[#eee] rounded-[10px] text-[14px] bg-white text-[#999]"
                  />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#999] pointer-events-auto" aria-label="도움말">
                    <HelpCircle className="size-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="여권 만료일(ex. 20300101)"
                    className="flex-1 min-w-0 px-4 py-3 border border-[#eee] rounded-[10px] text-[14px] bg-white text-[#999]"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex-1 min-w-0 px-4 py-3 border border-[#eee] rounded-[10px] text-[14px] text-left text-[#666] bg-white flex items-center justify-between"
                  >
                    (국적) 대한민국
                    <span className="text-[#999]">▼</span>
                  </button>
                  <button
                    type="button"
                    className="flex-1 min-w-0 px-4 py-3 border border-[#eee] rounded-[10px] text-[14px] text-left text-[#666] bg-white flex items-center justify-between"
                  >
                    (발행국가) 대한민국
                    <span className="text-[#999]">▼</span>
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 중요 안내사항 */}
          <div className="rounded-[10px] bg-[#f9f9f9] border border-[#eee] p-4 text-[12px] text-[#666] leading-[1.6] space-y-2 mb-5">
            <p>· 여권상 영문 이름이 일치하지 않으면 탑승 및 변경이 불가합니다. 띄어쓰기나 &quot;-&quot; 없이 영문 스펠링만 정확히 입력해 주세요.</p>
            <p>· 귀국일 기준 6개월 미만으로 여권이 만료되는 경우 출국이 불가할 수 있습니다.</p>
            <p>· 경유지/방문지에 따른 비자 필요 여부 및 여권 유효기간을 확인해 주세요.</p>
            <p>· 여권번호/만료일/국적/발행국가 변경 시 출국 72시간 전까지 재등록이 가능합니다.</p>
            <p>· 여권 정보 수정이 필요한 경우 <button type="button" className="text-[12px] text-[#666] underline font-normal align-bottom">[탑승자 정보]</button> 또는 <button type="button" className="text-[12px] text-[#666] underline font-normal align-bottom">[항공 온라인 문의]</button>를 통해 확인해 주세요.</p>
            <p>· 정확한 승객 정보 확인을 위해 휴대폰 번호와 이메일을 입력해 주세요.</p>
          </div>

          {/* 18세 미만 미성년자 단독 예약 */}
          <section className="mb-5">
            <div className="rounded-[10px] bg-[#f9f9f9] border border-[#eee] p-4 text-[12px] text-[#666] leading-[1.6] space-y-2">
              <h3 className="font-['Pretendard:SemiBold',sans-serif] text-[13px] text-[#111] mb-2 flex items-center justify-start gap-1.5">
                <CircleAlert className="size-[14px] text-[#666]" />
                18세 미만 미성년자 단독 예약
              </h3>
              <p>· 보호자 동반 없이 여행하는 만 12세~18세 미만 미성년자는 운송 항공사에 따라 탑승이 제한될 수 있습니다.</p>
              <p>· 별도 유료 서비스(UM) 신청이 필요할 수 있으니 항공사에 확인해 주세요.</p>
              <p>· 발권 전 출입국 가능 여부 및 필요 서류를 항공사 및 도착 국가 대사관에 확인 후 결제를 진행해 주세요.</p>
            </div>
          </section>
        </div>

        {/* 하단 고정: 저장하기 */}
        <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-4 shrink-0">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-4 bg-[#6329C4] text-white rounded-[12px] text-[16px] font-['Pretendard:Bold',sans-serif] hover:bg-[#5423AD] transition-colors"
          >
            저장하기
          </button>
        </div>
      </motion.div>
    </div>
  );
}
