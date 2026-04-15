import type { ToastConfig, ScrollTrigger } from "./AgentToast";

export const PAYMENT_TOAST_DATA: Record<string, ToastConfig> = {
  mileage: {
    msg: "마일리지 115,755P 전액 쓸 수 있어요",
    body: `<p style="margin-bottom:6px;">보유 마일리지 <strong>115,755P</strong>가 있어요. 100P부터 1P = 1원으로 사용 가능해요.</p><p>'전액사용' 버튼을 누르면 결제금액에서 바로 차감돼요.</p>`,
    highlight: "💡 마일리지 사용 시 카드 할인과 중복 적용이 가능해요!",
    chips: ["마일리지 어디서 모아요?", "유효기간 있나요?"],
  },
  card: {
    msg: "오늘 하나카드 쓰면 추가 할인 있어요",
    body: `<p style="margin-bottom:6px;">오늘 하루 <strong>[하나]같이 특별 혜택</strong>으로 하나카드 결제 시 추가 포인트 또는 즉시 할인이 적용돼요.</p><p>하나투어 상성카드는 여행 전용 포인트 적립율이 높아요.</p>`,
    highlight: "🎁 이벤트는 오늘 자정까지만 적용돼요. 카드 등록 후 결제하세요.",
    chips: ["어떤 카드가 혜택이 좋아요?", "카드 즉시 발급 되나요?"],
  },
  installment: {
    msg: "무이자 할부, 어떤 조건인지 알려드릴게요",
    body: `<p style="margin-bottom:6px;">하나투어 상성카드는 <strong>12개월·24개월 라이트할부</strong>를 지원해요.</p><p>라이트할부는 일반 무이자와 달리 수수료가 일부 포함될 수 있어요. 결제 전 꼭 확인하세요.</p>`,
    highlight: "📋 일반 무이자 할부 조건은 '무이자 할부·제휴 안내'에서 확인 가능해요.",
    chips: ["무이자 몇 개월까지 돼요?", "라이트할부 수수료 얼마예요?"],
  },
  simplepay: {
    msg: "카카오페이로 하면 더 빠르게 끝나요",
    body: `<p style="margin-bottom:6px;">간편결제(카카오페이·페이코·네이버페이)는 카드 정보 입력 없이 <strong>앱 인증 한 번</strong>으로 완료돼요.</p><p>기존에 연결된 카드 혜택도 그대로 적용돼요.</p>`,
    highlight: "💳 단, 일부 카드사 즉시 할인은 직접 카드 선택 시에만 적용될 수 있어요.",
    chips: ["카카오페이 포인트도 써요?", "네이버페이 적립 되나요?"],
  },
  receipt: {
    msg: "현금영수증, 소득공제 받으려면 등록하세요",
    body: `<p style="margin-bottom:6px;">무통장 입금이나 가상계좌 결제 시 현금영수증을 등록하면 <strong>연말정산 소득공제</strong>가 가능해요.</p><p>신용카드 결제는 별도 등록 없이 자동으로 처리돼요.</p>`,
    highlight: "📝 현금영수증은 결제 완료 후 '마이페이지 > 영수증 관리'에서도 추가 등록할 수 있어요.",
    chips: ["소득공제 얼마나 돼요?", "나중에 등록해도 되나요?"],
  },
  cta: {
    msg: "결제 전, 마일리지 사용 확인해봤나요?",
    body: `<p style="margin-bottom:6px;">보유 마일리지 <strong>115,755P</strong>를 아직 사용하지 않으셨어요.</p><p>지금 전액 사용하면 최대 <strong>115,755원</strong>을 추가로 아낄 수 있어요.</p>`,
    highlight: "✅ 마일리지 사용 → 할부 선택 → 결제 완료 순서를 추천해요.",
    chips: ["마일리지 바로 적용하기", "쿠폰도 있나요?"],
  },
};

export const PAYMENT_TRIGGERS: ScrollTrigger[] = [
  { sectionId: "payment-section-discount", toastKey: "mileage" },
  { sectionId: "payment-section-card", toastKey: "card" },
  { sectionId: "payment-section-installment", toastKey: "installment" },
  { sectionId: "payment-section-simplepay", toastKey: "simplepay" },
  { sectionId: "payment-section-receipt", toastKey: "receipt" },
  { sectionId: "payment-section-cta", toastKey: "cta" },
];
