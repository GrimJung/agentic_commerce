"use client";

import { useState } from "react";

interface FlightReservationCompleteProps {
  /** 예약자명 (예: 최지혜 → "최지혜님!") */
  bookerName: string;
  /** 예약번호 (예: HA2500092453) */
  reservationNumber: string;
  /** true면 나중에 결제 후 예약완료 → "예약이 완료 되었습니다!", false/미설정이면 즉시결제 → "결제가 완료 되었습니다!" */
  isPayLater?: boolean;
  /** true면 항공+호텔 FIT 조합 예약 플로우 (타이틀·버튼·단계 표시 변경) */
  isFitCombo?: boolean;
  onGoHome: () => void;
  /** FIT 조합일 때 "이어서 호텔 예약하기" 클릭 시 호출 */
  onProceedToHotel?: () => void;
}

export function FlightReservationComplete({
  bookerName,
  reservationNumber,
  isPayLater = false,
  isFitCombo = false,
  onGoHome,
  onProceedToHotel,
}: FlightReservationCompleteProps) {
  const headerTitle = isFitCombo ? "항공 예약완료" : "예약완료";
  const [showStopAlert, setShowStopAlert] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-4 py-3 flex items-center justify-between z-10 shrink-0">
        <h1 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
          {headerTitle}
        </h1>
        <button
          type="button"
          onClick={onGoHome}
          className="p-2 -mr-2 rounded-full hover:bg-[#f5f5f5]"
          aria-label="홈으로"
        />
      </div>

      {/* 단계 표시 */}
      <div className="py-[10px] px-4 border-b border-[#f0f0f0]">
        {isFitCombo ? (
          <div className="flex items-start">
            <div className="flex flex-col items-center shrink-0">
              <span className="size-[25px] rounded-full border border-[#5e2bb8] bg-white flex items-center justify-center text-[#5e2bb8] font-['Pretendard:SemiBold',sans-serif]">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </span>
              <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2] text-center">항공<br />약관동의</span>
            </div>
            <div className="flex-1 h-px bg-[#e0e0e0] min-w-[12px] mx-1 mt-4" aria-hidden />
            <div className="flex flex-col items-center shrink-0">
              <span className="size-[25px] rounded-full border border-[#5e2bb8] bg-white flex items-center justify-center text-[#5e2bb8] font-['Pretendard:SemiBold',sans-serif]">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </span>
              <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2] text-center">항공<br />예약정보입력</span>
            </div>
            <div className="flex-1 h-px bg-[#e0e0e0] min-w-[12px] mx-1 mt-4" aria-hidden />
            <div className="flex flex-col items-center shrink-0">
              <span className="size-[25px] rounded-full bg-[#5e2bb8] flex items-center justify-center text-[13px] text-white font-['Pretendard:SemiBold',sans-serif]">3</span>
              <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#7b3ff2] mt-[5px] mb-[5px] leading-[1.2] text-center">항공<br />예약완료</span>
            </div>
            <div className="flex-1 h-px bg-[#e0e0e0] min-w-[12px] mx-1 mt-4" aria-hidden />
            <div className="flex flex-col items-center shrink-0">
              <span className="size-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center text-[13px] text-[#c8c8c8] font-['Pretendard:SemiBold',sans-serif]">4</span>
              <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2] text-center">호텔예약</span>
            </div>
          </div>
        ) : (
          <div className="flex items-start">
            <div className="flex flex-col items-center shrink-0">
              <span className="size-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center text-[13px] text-[#c8c8c8] font-['Pretendard:SemiBold',sans-serif]">1</span>
              <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2]">약관동의</span>
            </div>
            <div className="flex-1 h-px bg-[#e0e0e0] min-w-[16px] mx-1 mt-4" aria-hidden />
            <div className="flex flex-col items-center shrink-0">
              <span className="size-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center text-[13px] text-[#c8c8c8] font-['Pretendard:SemiBold',sans-serif]">2</span>
              <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#4f4f4f] mt-[5px] mb-[5px] leading-[1.2]">예약정보입력</span>
            </div>
            <div className="flex-1 h-px bg-[#e0e0e0] min-w-[16px] mx-1 mt-4" aria-hidden />
            <div className="flex flex-col items-center shrink-0">
              <span className="size-[25px] rounded-full bg-[#5e2bb8] flex items-center justify-center text-[13px] text-white font-['Pretendard:SemiBold',sans-serif]">3</span>
              <span className="text-[12px] font-['Pretendard:SemiBold',sans-serif] text-[#7b3ff2] mt-[5px] mb-[5px] leading-[1.2]">{isPayLater ? "예약완료" : "결제완료"}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* 결제 완료 메시지 */}
        <div className="flex flex-col justify-center items-start text-center mb-[10px]">
          <span className="w-5 h-5 rounded-full bg-[#5e2bb8] flex items-center justify-center text-white mb-[5px]">
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <p className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111] mb-0">
            {bookerName}님!
          </p>
          <p className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#111]">
            {isFitCombo
              ? (isPayLater ? "항공 예약이 완료 되었습니다!" : "항공 결제가 완료 되었습니다!")
              : (isPayLater ? "예약이 완료 되었습니다!" : "결제가 완료 되었습니다!")}
          </p>
        </div>

        {/* 예약번호 */}
        <div className="rounded-[10px] bg-[#f5f5f5] border border-[#eee] px-4 py-3 flex items-center justify-between mb-6">
          <span className="text-[14px] text-[#666]">{isFitCombo ? "항공 예약번호" : "예약번호"}</span>
          <span className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] flex justify-start items-start flex-wrap">
            {reservationNumber}
          </span>
        </div>

        {/* 유의사항 */}
        <ul className="space-y-3 text-[13px] text-[#666] leading-[1.5] list-disc list-inside">
          <li>
            일부 항공권의 경우 당일 예약취소가 불가능하고 평일 업무시간
            (09:00~17:00) 에 환불로 접수되므로 확인하시기 바랍니다.
          </li>
          <li>
            예약내역 상세에서 항공 여정, 규정 및 결제시한 등 확인하시기
            바랍니다.
          </li>
          <li>
            일부 부정기편은 대한민국 여권 소지자만 가능하며 외국 국적에 대한
            탑승 제한 및 가능 예외 사항이 있으니 자세한 사항은 외교부, 항공사,
            대사관등을 통해 확인 후 문제없도록 준비하시기 바랍니다.
          </li>
          <li>
            여권정보, 체류지정보 등록을 완료하지 않은 경우, 출발일 72시간
            전까지 반드시 등록하셔야 합니다.
          </li>
        </ul>

        {/* 하단 버튼 */}
        <div className="mt-8 pb-4 space-y-3">
          {isFitCombo && onProceedToHotel ? (
            <>
              {/* 호텔 할인 토스트 말풍선 (버튼 위에 살짝 겹침) */}
              <div className="relative flex justify-center -mb-3 z-10">
                <div className="relative flex flex-col justify-center items-center h-[30px] px-4 py-2.5 bg-white text-[#7b3ff2] rounded-[12px] text-[13px] font-['Pretendard:SemiBold',sans-serif] shadow-lg border border-[#e5e7eb]">
                  지금 호텔도 예약하면 10% 할인
                  <span
                    className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-[6px] border-transparent border-t-white"
                    aria-hidden
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={onProceedToHotel}
                className="w-full py-4 bg-[#5e2bb8] text-white rounded-[30px] text-[16px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
              >
                이어서 호텔 예약하기
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onGoHome}
              className="w-full py-4 bg-[#5e2bb8] text-white rounded-[30px] text-[16px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
            >
              확인
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (isFitCombo) {
                setShowStopAlert(true);
              } else {
                onGoHome();
              }
            }}
            className="w-full py-4 bg-white border border-[#e5e5e5] text-[#555] rounded-[30px] text-[16px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f9f9f9] transition-colors"
          >
            예약 내역 보기
          </button>
        </div>
      </div>

      {/* 호텔 예약 중지 확인 얼럿 */}
      {showStopAlert && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center px-8"
          onClick={() => setShowStopAlert(false)}
        >
          <div
            className="bg-white rounded-[16px] w-full max-w-[320px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-4">
              <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#111] text-center leading-[1.5]">
                항공 예약만 완료된 상태입니다.<br />호텔 예약 진행을 중지할까요?
              </p>
            </div>
            <div className="px-4 pb-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowStopAlert(false);
                  onGoHome();
                }}
                className="w-full py-3.5 bg-[#f5f5f5] text-[#333] rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#eee] transition-colors"
              >
                호텔을 찜한 상품에 추가하고 중지하기
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowStopAlert(false);
                  onProceedToHotel?.();
                }}
                className="w-full py-3.5 bg-[#5e2bb8] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
              >
                이어서 호텔 예약하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
