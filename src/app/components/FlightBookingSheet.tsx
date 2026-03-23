import { motion } from "motion/react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { FlightReservationSheet } from "./FlightReservationSheet";
import { FlightPaymentSheet } from "./FlightPaymentSheet";
import { FlightReservationComplete } from "./FlightReservationComplete";
import { FlightData } from "./FlightCard";
import type { BookingFormData } from "./BookingForm";

export type FlightSheetStep = "terms" | "payment" | "complete";

interface FlightBookingSheetProps {
  step: FlightSheetStep;
  flight: FlightData;
  bookingData: BookingFormData | null;
  reservationNumber?: string;
  /** true면 예약완료 화면에 "예약이 완료 되었습니다!" 표시 (나중에 결제 시) */
  isPayLater?: boolean;
  /** true면 항공+호텔 FIT 조합 예약 플로우 */
  isFitCombo?: boolean;
  onClose: () => void;
  onProceedToNextStep: (data: BookingFormData) => void;
  onBack: () => void;
  onFinalSubmit: (isPayLater?: boolean) => void;
  /** FIT 조합일 때 "이어서 호텔 예약하기" 클릭 시 호출 */
  onProceedToHotel?: () => void;
  /** 내맘대로(FIT): 항공예약정보 다음단계 → 호텔 예약 폼으로 */
  onNamemdaeFlightContinue?: (data: BookingFormData) => void;
}

/**
 * 항공 예약 플로우를 하나의 바텀시트로 유지하고, 단계(약관동의 → 예약정보입력)만 전환합니다.
 * 시트가 닫히지 않고 내용만 바뀌어 연속된 UX를 제공합니다.
 */
export function FlightBookingSheet({
  step,
  flight,
  bookingData,
  reservationNumber = "HA2500092453",
  isPayLater = false,
  isFitCombo = false,
  onClose,
  onProceedToNextStep,
  onBack,
  onFinalSubmit,
  onProceedToHotel,
  onNamemdaeFlightContinue,
}: FlightBookingSheetProps) {
  useLockBodyScroll();
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
        {!isFitCombo && step === "terms" ? (
          <FlightReservationSheet
            embedded
            flight={flight}
            onClose={onClose}
            onProceedToPayment={onProceedToNextStep}
            isFitCombo={false}
          />
        ) : step === "complete" && bookingData ? (
          <FlightReservationComplete
            bookerName={bookingData.name ?? "고객"}
            reservationNumber={reservationNumber}
            isPayLater={isPayLater}
            isFitCombo={isFitCombo}
            onGoHome={onClose}
            onProceedToHotel={onProceedToHotel}
          />
        ) : bookingData ? (
          <FlightPaymentSheet
            embedded
            flight={flight}
            bookingData={bookingData}
            onBack={onBack}
            onClose={onClose}
            onProceedToPayment={onFinalSubmit}
            isFitCombo={isFitCombo}
            onNamemdaeFlightNext={isFitCombo ? onNamemdaeFlightContinue : undefined}
          />
        ) : null}
      </motion.div>
    </div>
  );
}
