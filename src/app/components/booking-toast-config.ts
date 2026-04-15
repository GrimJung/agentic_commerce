import type { ToastConfig, ScrollTrigger } from './AgentToast';

export const BOOKING_TOAST_DATA: Record<string, ToastConfig> = {
  hotel: {
    msg: '이 호텔, 발리 3대 럭셔리 리조트예요',
    body: `<p style="margin-bottom:6px;"><strong>모벤픽 리조트 발리 우붓</strong>은 열대 정원 속 인피니티풀로 유명한 리조트예요.</p><p>우릇(Ubud) 위치라 발리 전통문화 체험과 함께 즐기기 좋아요.</p>`,
    highlight: '🏨 선택관광(발리스윙 등)은 현지에서 추가 결제되니 예산 참고하세요.',
    chips: ['호텔 위치 보여줘', '선택관광 얼마예요?'],
  },
  booker: {
    msg: '예약자 정보, 이미 정그림님으로 채워졌어요',
    body: `<p style="margin-bottom:6px;">회원 정보로 <strong>예약자 정보가 자동 입력</strong>됐어요. 다른 분 명의로 예약하려면 수정하세요.</p><p>예약자와 여행자가 달라도 예약은 가능해요.</p>`,
    highlight: '📋 예약자는 취소·변경 시 연락받는 주체예요. 정확한 연락처 확인 권장!',
    chips: ['예약자 변경 방법이 있나요?', '여행자랑 예약자 달라도 되나요?'],
  },
  traveler: {
    msg: '여행자 정보, 나중에 입력해도 돼요',
    body: `<p style="margin-bottom:6px;">여권 정보가 없어도 <strong>지금 바로 예약</strong>이 가능해요.</p><p>출발 전까지 '나중에 입력'으로 저장해 두고, 여권 준비 후 입력하면 됩니다.</p>`,
    highlight: '💡 단, 항공권 발권 마감 전(보통 출발 7일 전)까지는 꼭 완료해야 해요.',
    chips: ['마감일 언제예요?', '여권 없이 예약 가능한가요?'],
  },
  terms: {
    msg: '약관 5개, 핵심만 알려드릴게요',
    body: `<p style="margin-bottom:6px;">필수 4개 + 선택 1개예요. 전체 동의하면 한 번에 완료됩니다.</p><p><strong>위치정보 이용약관(선택)</strong>은 현지 맛집·관광지 추천에 활용돼요.</p>`,
    highlight: '📋 국외여행 특별약관에 취소 위약금 기준이 있어요. 출발 전 확인 권장!',
    chips: ['취소 위약금 얼마예요?', '선택 동의 안 해도 되나요?'],
  },
  price: {
    msg: '마일리지 12,086P 이번에 적립돼요',
    body: `<p style="margin-bottom:6px;">총 <strong>1,399,000원</strong>에는 유류할증료와 제세공과금이 모두 포함돼 있어요.</p><p>하나투어 마일리지 <strong>12,086포인트</strong>가 결제 완료 후 적립됩니다.</p>`,
    highlight: '💰 마일리지는 다음 여행 예약 시 현금처럼 사용 가능해요!',
    chips: ['마일리지 어디서 써요?', '카드 할부 되나요?'],
  },
  payment: {
    msg: '계약금 vs 전액, 어떤 게 유리할까요?',
    body: `<p style="margin-bottom:6px;"><strong>계약금(300,000원)</strong>은 지금 자리만 잡고, 잔금은 출발 전 납부해요.</p><p><strong>전액(1,399,000원)</strong>은 한 번에 완료되며 일부 카드사 할인 혜택이 적용될 수 있어요.</p>`,
    highlight: '📌 계약금 선택 시 잔금 납부 마감일을 꼭 확인하세요. 기한 초과 시 자동 취소될 수 있어요.',
    chips: ['잔금 납부 마감 언제예요?', '계약금 취소하면 환불되나요?'],
  },
};

export const BOOKING_TRIGGERS: ScrollTrigger[] = [
  { sectionId: 'booking-section-hotel',    toastKey: 'hotel' },
  { sectionId: 'booking-section-booker',   toastKey: 'booker' },
  { sectionId: 'booking-section-traveler', toastKey: 'traveler' },
  { sectionId: 'booking-section-terms',    toastKey: 'terms' },
  { sectionId: 'booking-section-price',    toastKey: 'price' },
  { sectionId: 'booking-section-cta',      toastKey: 'payment' },
];
