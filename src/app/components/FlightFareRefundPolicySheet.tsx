"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

export interface FlightFareRefundPolicySheetProps {
  open: boolean;
  onClose: () => void;
  airline: string;
  /** 가는편 일정 한 줄 (예: 인천 국제공항-간사이 국제공항) */
  outboundSchedule: string;
  /** 오는편 일정 한 줄 */
  inboundSchedule: string;
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="text-[13px] leading-[1.55]">
      <div className="text-[#757575] mb-1">{label}</div>
      <div className="text-[#111]">{children}</div>
    </div>
  );
}

export function FlightFareRefundPolicySheet({
  open,
  onClose,
  airline,
  outboundSchedule,
  inboundSchedule,
}: FlightFareRefundPolicySheetProps) {
  useLockBodyScroll(open);
  const [tab, setTab] = useState<"outbound" | "inbound">("outbound");

  useEffect(() => {
    if (open) setTab("outbound");
  }, [open]);

  const schedule = tab === "outbound" ? outboundSchedule : inboundSchedule;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="flight-fare-backdrop"
            role="presentation"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 overscroll-none touch-none"
            onClick={onClose}
          />
          <motion.div
            key="flight-fare-sheet"
            role="dialog"
            aria-modal
            aria-labelledby="flight-fare-refund-title"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none overscroll-none"
          >
            <div
              className="pointer-events-auto bg-white w-full max-w-[390px] max-h-[85vh] rounded-[24px] flex flex-col overflow-hidden shadow-xl min-h-0 overscroll-contain"
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#eee]">
                <h2
                  id="flight-fare-refund-title"
                  className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]"
                >
                  항공 요금/환불 규정
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full hover:bg-[#f5f5f5] transition-colors"
                  aria-label="닫기"
                >
                  <X className="size-5 text-[#111]" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 pt-4 pb-6 touch-pan-y">
                <ul className="space-y-2.5 text-[13px] text-[#757575] leading-[1.55] mb-6 list-none pl-0">
                  <li className="flex gap-2">
                    <span className="shrink-0 text-[#757575]">•</span>
                    <span>
                      예약 시점·좌석 상황에 따라 요금이 달라질 수 있으며, 동일 조건의 좌석이라도 구매 시점에 따라 금액이
                      변동될 수 있습니다.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 text-[#757575]">•</span>
                    <span>
                      여러 구간으로 구성된 항공권은 구간별 규정이 적용될 수 있으며, 일부 구간 취소·변경 시 전체
                      여정에 패널티가 발생할 수 있습니다.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 text-[#757575]">•</span>
                    <span>
                      환불·변경 수수료는 항공사 및 운임 규정에 따르며, 상세 내용은 아래 요금/환불 규정을 확인해 주세요.
                    </span>
                  </li>
                </ul>

                <div className="flex border-b border-[#eee] mb-5">
                  <button
                    type="button"
                    onClick={() => setTab("outbound")}
                    className={`flex-1 pb-3 text-[15px] font-['Pretendard:Medium',sans-serif] transition-colors relative ${
                      tab === "outbound" ? "text-[#111] font-semibold" : "text-[#999]"
                    }`}
                  >
                    가는편
                    {tab === "outbound" && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#111] rounded-t-[2px]" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("inbound")}
                    className={`flex-1 pb-3 text-[15px] font-['Pretendard:Medium',sans-serif] transition-colors relative ${
                      tab === "inbound" ? "text-[#111] font-semibold" : "text-[#999]"
                    }`}
                  >
                    오는편
                    {tab === "inbound" && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#111] rounded-t-[2px]" />
                    )}
                  </button>
                </div>

                <div className="space-y-5">
                  <DetailRow label="항공사">{airline}</DetailRow>
                  <DetailRow label="일정">{schedule}</DetailRow>
                  <DetailRow label="카드사용가능여부">
                    <span>가능</span>
                    <p className="text-[12px] text-[#757575] mt-1.5 leading-[1.5]">
                      카드사 제휴 프로모션·할부 조건은 결제 단계에서 확인 가능합니다.
                    </p>
                  </DetailRow>
                  <DetailRow label="예약/발권규정">
                    전 구간 확약 조건이며, 대기 예약은 불가합니다. 발권 후 일부 구간만 취소할 수 없는 운임일 수
                    있습니다.
                  </DetailRow>
                  <DetailRow label="최대체류일수">출발 후 12개월</DetailRow>
                  <DetailRow label="중간체류조건">
                    <p className="text-[12px] text-[#111] leading-[1.55] font-['Pretendard:Regular',sans-serif]">
                      NO TRANSFERS PERMITTED BETWEEN SELECTED SECTORS. STOPOVER NOT PERMITTED UNLESS SPECIFIED IN FARE
                      RULES. ROUTING MUST BE AS BOOKED — BACKTRACKING MAY RESULT IN DENIED BOARDING OR ADDITIONAL
                      CHARGES.
                    </p>
                  </DetailRow>
                  <DetailRow label="추가 요금">
                    <p className="text-[12px] text-[#111] leading-[1.55] font-['Pretendard:Regular',sans-serif]">
                      SALE IS RESTRICTED TO SPECIFIC AGENTS AND COUNTRIES OF SALE. TICKET MUST BE ISSUED WITHIN
                      VALIDITY PERIOD. PENALTIES FOR CHANGES/CANCELLATIONS APPLY AS PER CARRIER RULES.
                    </p>
                  </DetailRow>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
