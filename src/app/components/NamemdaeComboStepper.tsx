/**
 * 내맘대로(항공+호텔) 조합 예약 단계: 항공예약정보 → 호텔예약정보 → 결제하기
 */
export type NamemdaeComboStep = 1 | 2 | 3;

interface NamemdaeComboStepperProps {
  activeStep: NamemdaeComboStep;
}

export function NamemdaeComboStepper({ activeStep }: NamemdaeComboStepperProps) {
  const StepCircle = ({
    n,
    done,
    active,
    label,
  }: {
    n: number;
    done: boolean;
    active: boolean;
    label: string;
  }) => (
    <div className="flex flex-col items-center shrink-0 min-w-0 flex-1">
      <span
        className={`size-[26px] rounded-full flex items-center justify-center text-[13px] font-['Pretendard:SemiBold',sans-serif] shrink-0 ${
          done
            ? "bg-[#4a1f94] text-white"
            : active
              ? "bg-[#4a1f94] text-white"
              : "border border-[#c8c8c8] bg-white text-[#c8c8c8]"
        }`}
      >
        {done ? (
          <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          n
        )}
      </span>
      <span
        className={`text-[11px] font-['Pretendard:SemiBold',sans-serif] mt-1.5 text-center leading-[1.25] px-0.5 ${
          done
            ? "text-[#4A2190] font-bold"
            : active
              ? "text-[#4a1f94] font-bold"
              : "text-[#4f4f4f]"
        }`}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div className="py-3 px-3 border-b border-[#f0f0f0]">
      <div className="flex items-start justify-between gap-0">
        <StepCircle n={1} done={activeStep > 1} active={activeStep === 1} label="항공예약정보" />
        <div className="flex-1 h-px bg-[#e0e0e0] min-w-[8px] mx-1 mt-[13px]" aria-hidden />
        <StepCircle n={2} done={activeStep > 2} active={activeStep === 2} label="호텔예약정보" />
        <div className="flex-1 h-px bg-[#e0e0e0] min-w-[8px] mx-1 mt-[13px]" aria-hidden />
        <StepCircle n={3} done={false} active={activeStep === 3} label="결제하기" />
      </div>
    </div>
  );
}
