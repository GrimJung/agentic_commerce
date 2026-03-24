import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import type { HotelBookingInfo } from "./BookingForm";
import type { FlightData } from "./FlightCard";

const PLACEHOLDER_HOTEL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect fill='%23e5e5e5' width='120' height='120'/%3E%3Cpath fill='%23999' d='M60 32L28 52v36h64V52L60 32zm0 8l24 16v24H36V56l24-16z'/%3E%3C/svg%3E";

const PURPLE = "#5e2bb8";

export interface NamemdaeComboPaymentReviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  flight: FlightData;
  hotelInfo: HotelBookingInfo;
  travelerNames: string[];
  totalAmount: number;
  productAmount: number;
  discountAmount: number;
  paymentSummary: string;
}

export function NamemdaeComboPaymentReviewModal({
  open,
  onClose,
  onConfirm,
  flight,
  hotelInfo,
  travelerNames,
  totalAmount,
  productAmount,
  discountAmount,
  paymentSummary,
}: NamemdaeComboPaymentReviewModalProps) {
  useLockBodyScroll(open);

  if (!open) return null;

  const depLine = [flight.departure, flight.departureCode].filter(Boolean).join(" ");
  const arrLine = [flight.arrival, flight.arrivalCode].filter(Boolean).join(" ");
  const dateLine =
    flight.travelDateRange ||
    [flight.outboundDate, flight.returnDate].filter(Boolean).join(" ~ ") ||
    "일정은 예약 확인서를 참고해 주세요";

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-black/50 p-3"
      role="dialog"
      aria-modal="true"
      aria-labelledby="namemdae-payment-review-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="relative z-[1] flex max-h-[min(88vh,820px)] w-full max-w-[400px] flex-col overflow-hidden rounded-[20px] bg-white shadow-xl">
        <header className="shrink-0 border-b border-[#f0f0f0] bg-white px-4 pt-4 pb-3">
          <div className="flex items-end justify-between gap-2">
            <h2
              id="namemdae-payment-review-title"
              className="min-w-0 flex-1 text-left text-[15px] font-['Pretendard:Bold',sans-serif] font-bold leading-snug text-[#111]"
            >
              내맘대로 항공+호텔 정보 확인 안내
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-1 text-[#111]"
              aria-label="닫기"
            >
              <X className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f5f5f5] px-3 py-3">
          {/* 항공 */}
          <section className="mb-3">
            <h3 className="mb-2 px-1 text-[13px] font-['Pretendard:Bold',sans-serif] text-[#111]">
              항공권 예약 정보
            </h3>
            <div className="rounded-[14px] border border-[#eee] bg-white p-4">
              <div className="mb-3 flex items-start gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-[11px] font-['Pretendard:Bold',sans-serif] text-white"
                  style={{ backgroundColor: PURPLE }}
                  aria-hidden
                >
                  {flight.airline.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-['Pretendard:Bold',sans-serif] text-[#111]">{flight.airline}</p>
                  {flight.flightNumber ? (
                    <p className="mt-0.5 text-[12px] font-['Pretendard:Medium',sans-serif] text-[#666]">
                      {flight.flightNumber}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="space-y-2 border-t border-[#f0f0f0] pt-3 text-[13px] font-['Pretendard:Medium',sans-serif]">
                <div className="flex justify-between gap-2">
                  <span className="text-[#888] shrink-0">가는편</span>
                  <span className="text-right text-[#111]">
                    {depLine} → {arrLine}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#888] shrink-0">출발·도착</span>
                  <span className="text-right text-[#111] tabular-nums">
                    {flight.departureTime} — {flight.arrivalTime}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#888] shrink-0">여행 기간</span>
                  <span className="text-right text-[#111]">{dateLine}</span>
                </div>
                {flight.duration ? (
                  <div className="flex justify-between gap-2">
                    <span className="text-[#888] shrink-0">일정</span>
                    <span className="text-right text-[#111]">{flight.duration}</span>
                  </div>
                ) : null}
              </div>
              <div className="mt-3 border-t border-[#f0f0f0] pt-3">
                <p className="mb-1.5 text-[12px] font-['Pretendard:Bold',sans-serif] text-[#111]">탑승객</p>
                <ul className="space-y-1 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#333]">
                  {travelerNames.filter(Boolean).map((n, i) => (
                    <li key={`${n}-${i}`}>
                      탑승객 {i + 1}. {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-2 rounded-[12px] bg-[#f0f0f0] px-3 py-2.5">
              <p className="mb-1.5 text-[12px] font-['Pretendard:Bold',sans-serif] text-[#111]">유의사항</p>
              <ul className="space-y-1.5 text-[11px] font-['Pretendard:Medium',sans-serif] leading-[1.5] text-[#555]">
                <li>
                  • 항공권은{" "}
                  <span className="font-['Pretendard:SemiBold',sans-serif] text-[#5D40D0]">
                    항공사 규정에 따른 취소·환불 수수료
                  </span>
                  가 적용될 수 있습니다.
                </li>
                <li>• 발권 후 이름·일정 변경은 제한되거나 추가 요금이 발생할 수 있습니다.</li>
                {flight.baggage ? <li>• 수하물: {flight.baggage}</li> : null}
              </ul>
            </div>
          </section>

          {/* 호텔 */}
          <section className="mb-3">
            <h3 className="mb-2 px-1 text-[13px] font-['Pretendard:Bold',sans-serif] text-[#111]">
              호텔 예약 정보
            </h3>
            <div className="rounded-[14px] border border-[#eee] bg-white p-4">
              <div className="flex gap-3">
                <img
                  src={hotelInfo.hotelImage || PLACEHOLDER_HOTEL}
                  alt=""
                  className="size-[72px] shrink-0 rounded-[10px] object-cover bg-[#eee]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-['Pretendard:Bold',sans-serif] leading-snug text-[#111]">
                    {hotelInfo.hotelName}
                  </p>
                  <p className="mt-1 text-[12px] font-['Pretendard:Medium',sans-serif] text-[#666]">
                    {hotelInfo.hotelLocation}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-2 border-t border-[#f0f0f0] pt-3 text-[13px] font-['Pretendard:Medium',sans-serif]">
                <div className="flex justify-between gap-2">
                  <span className="text-[#888] shrink-0">객실</span>
                  <span className="text-right text-[#111]">{hotelInfo.roomTypeLabel}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#888] shrink-0">체크인</span>
                  <span className="text-right text-[#111]">{hotelInfo.checkIn}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#888] shrink-0">체크아웃</span>
                  <span className="text-right text-[#111]">{hotelInfo.checkOut}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#888] shrink-0">박 수</span>
                  <span className="text-right text-[#111]">{hotelInfo.nights}박</span>
                </div>
              </div>
              <div className="mt-3 border-t border-[#f0f0f0] pt-3">
                <p className="mb-1.5 text-[12px] font-['Pretendard:Bold',sans-serif] text-[#111]">투숙객</p>
                <ul className="space-y-1 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#333]">
                  {travelerNames.filter(Boolean).map((n, i) => (
                    <li key={`g-${n}-${i}`}>
                      투숙객 {i + 1}. {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-2 rounded-[12px] bg-[#f0f0f0] px-3 py-2.5">
              <p className="mb-1.5 text-[12px] font-['Pretendard:Bold',sans-serif] text-[#111]">취소·환불 안내</p>
              <p className="text-[11px] font-['Pretendard:Medium',sans-serif] leading-[1.55] text-[#555]">
                {hotelInfo.freeCancellationText ||
                  "호텔 및 객실 상품에 따라 무료 취소 가능 시한 이후 위약금이 발생할 수 있습니다. 노쇼 시 전액이 청구될 수 있습니다."}
              </p>
            </div>
          </section>

          {/* 결제 요약 */}
          <section className="mb-3 rounded-[14px] border border-[#eee] bg-white p-4">
            <h3 className="mb-3 text-[14px] font-['Pretendard:Bold',sans-serif] text-[#111]">결제 정보</h3>
            <div className="space-y-2 text-[13px] font-['Pretendard:Medium',sans-serif]">
              <div className="flex justify-between gap-2 text-[#111]">
                <span>상품 금액</span>
                <span className="tabular-nums">{productAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between gap-2 text-[#111]">
                <span>할인 금액</span>
                <span className="tabular-nums">{discountAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between gap-2 border-t border-[#f0f0f0] pt-2.5">
                <span className="font-['Pretendard:Bold',sans-serif] text-[#111]">최종 결제금액</span>
                <span
                  className="font-['Pretendard:Bold',sans-serif] text-[18px] tabular-nums"
                  style={{ color: PURPLE }}
                >
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>
            <div className="mt-4 border-t border-[#f0f0f0] pt-3">
              <p className="mb-1 text-[12px] font-['Pretendard:Bold',sans-serif] text-[#111]">결제 수단</p>
              <p className="text-[13px] font-['Pretendard:Medium',sans-serif] text-[#333]">{paymentSummary}</p>
            </div>
            <p className="mt-3 text-[11px] font-['Pretendard:Medium',sans-serif] leading-[1.5] text-[#888]">
              위 내용을 확인하였으며, 선택하신 약관에 동의한 뒤 결제가 진행됩니다.
            </p>
          </section>
        </div>

        <footer className="shrink-0 border-t border-[#f0f0f0] bg-white px-4 py-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-[30px] bg-[#5e2bb8] py-3.5 text-[15px] font-['Pretendard:Bold',sans-serif] text-white transition-colors hover:bg-[rgba(74,33,144,1)]"
          >
            {totalAmount.toLocaleString()}원 결제하기
          </button>
        </footer>
      </div>
    </div>
  );
}
