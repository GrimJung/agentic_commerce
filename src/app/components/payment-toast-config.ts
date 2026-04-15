import type { ToastConfig, ScrollTrigger } from "./AgentToast";

export const PAYMENT_TOAST_DATA: Record<string, ToastConfig> = {
  /** 금액 문구는 PaymentSheet에서 couponDiscount 기준으로 덮어씀 */
  coupon: {
    msg: "즉시할인쿠폰이 적용됐어요",
    body: `<p style="margin-bottom:6px;"><strong>즉시할인 쿠폰</strong> 금액이 결제 금액에 반영됐어요.</p><p>결제 상세의 <strong>총 할인금액</strong>에서도 확인할 수 있어요.</p>`,
    highlight: "🎟 「변경」에서 다른 즉시할인 쿠폰으로 바꿀 수 있어요.",
    chips: ["다른 쿠폰도 쓸 수 있나요?", "쿠폰 중복 적용 되나요?"],
  },
  cardSamsung: {
    msg: "하나투어 삼성카드, 혜택만 정리해 드릴게요",
    body: `<p style="margin-bottom:6px;"><strong>하나투어 삼성카드</strong>로 결제하면 여행·쇼핑 적립과 제휴 할인이 함께 적용될 수 있어요.</p><p>이 화면 기준 <strong>12·24개월 라이트 할부</strong>를 선택할 수 있어요. (일반 무이자와 조건이 다를 수 있어요)</p>`,
    highlight: "💳 결제 전 「무이자 할부 / 제휴 안내」에서 삼성카드 조건을 꼭 확인해 주세요.",
    chips: ["라이트할부 수수료가 있나요?", "삼성카드 추가 혜택이 뭐예요?"],
  },
  cardHana: {
    msg: "하나카드로 결제하면 이런 점이 좋아요",
    body: `<p style="margin-bottom:6px;"><strong>하나카드</strong>는 하나투어 제휴 카드로, 결제 시 포인트·즉시 할인 등 프로모션이 붙을 수 있어요.</p><p>당일 <strong>[하나]같이</strong> 이벤트가 있으면 화면 안내에 따라 추가 혜택이 적용될 수 있어요.</p>`,
    highlight: "🎁 이벤트·할인은 카드사·기간별로 달라질 수 있어요. 결제 직전 조건을 확인해 주세요.",
    chips: ["오늘 하나카드 이벤트 있나요?", "하나투어 제휴 혜택이 뭐예요?"],
  },
  installment: {
    msg: "무이자 할부, 어떤 조건인지 알려드릴게요",
    body: `<p style="margin-bottom:6px;">하나투어 상성카드는 <strong>12개월·24개월 라이트할부</strong>를 지원해요.</p><p>라이트할부는 일반 무이자와 달리 수수료가 일부 포함될 수 있어요. 결제 전 꼭 확인하세요.</p>`,
    highlight: "📋 일반 무이자 할부 조건은 '무이자 할부·제휴 안내'에서 확인 가능해요.",
    chips: ["무이자 몇 개월까지 돼요?", "라이트할부 수수료 얼마예요?"],
  },
  cta: {
    msg: "결제 전에 금액·수단 한 번만 더 확인해 주세요",
    body: `<p style="margin-bottom:6px;">최종 결제금액과 <strong>결제수단</strong>이 맞는지 확인한 뒤 진행해 주세요.</p><p>무이자 할부·제휴 조건은 카드사별로 다를 수 있어요.</p>`,
    highlight: "✅ 결제 완료 후에는 예약내역에서 영수증·일정을 다시 확인할 수 있어요.",
    chips: ["결제 금액 다시 보여줘", "영수증은 어디서 받나요?"],
  },
};

export const PAYMENT_TRIGGERS: ScrollTrigger[] = [
  { sectionId: "payment-section-coupon", toastKey: "coupon" },
  { sectionId: "payment-section-installment", toastKey: "installment" },
  { sectionId: "payment-section-cta", toastKey: "cta" },
];
