interface PackageReservationChatCardProps {
  productName: string;
  reservationStatus: string;
  travelPeriod: string;
  flightInfo: string;
  onResultInquiry?: () => void;
  onEditTravelers?: () => void;
  onEticket?: () => void;
}

function Row({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  /** 상품명 행: 구분선·세로 패딩 없음 */
  variant?: "default" | "title";
}) {
  const rowClass =
    variant === "title"
      ? "flex items-start justify-between gap-3"
      : "flex items-start justify-between gap-3 border-b border-[#e6e6e6] py-2.5 last:border-b-0";

  return (
    <div className={rowClass}>
      <span className="shrink-0 pt-0.5 text-[13px] font-['Pretendard:Medium',sans-serif] text-[#888]">{label}</span>
      <span
        className={`max-w-[62%] min-w-0 text-right text-[13px] font-['Pretendard:SemiBold',sans-serif] leading-snug text-[#111] ${
          variant === "title" ? "truncate" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/** 채팅 시스템(봇) 영역용 패키지 예약 요약 카드 (데모·프로토타입) */
export function PackageReservationChatCard({
  productName,
  reservationStatus,
  travelPeriod,
  flightInfo,
  onResultInquiry,
  onEditTravelers,
  onEticket,
}: PackageReservationChatCardProps) {
  const btnClass =
    "rounded-[12px] border border-[#e0e0e0] bg-white h-[35px] flex flex-col items-center justify-center text-center text-[13px] font-['Pretendard:SemiBold',sans-serif] text-[#333] transition-colors hover:bg-[#fafafa] active:bg-[#f5f5f5]";

  return (
    <div className="rounded-[24px] bg-[#f2f2f2] px-4 py-4 shadow-sm">
      <div className="px-0.5">
        <Row label="상품명" value={productName} variant="title" />
        <Row label="예약상태" value={reservationStatus} />
        <Row label="여행기간" value={travelPeriod} />
        <Row label="항공정보" value={flightInfo} />
      </div>

      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={btnClass} onClick={onResultInquiry}>
            결과 내역 조회
          </button>
          <button type="button" className={btnClass} onClick={onEditTravelers}>
            여행자 정보 수정
          </button>
        </div>
        <button type="button" className={`${btnClass} w-full`} onClick={onEticket}>
          E-티켓 조회
        </button>
      </div>
    </div>
  );
}
