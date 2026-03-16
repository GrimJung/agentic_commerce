export interface ReasoningStep {
  message: string;
}

export const REASONING_STEPS: Record<string, ReasoningStep[]> = {
  PACKAGE_SEARCH: [
    { message: "사용자 선호도 분석 중..." },
    { message: "상품 데이터베이스 검색 중..." },
    { message: "최적 상품 매칭 및 랭킹 중..." },
  ],
  COMPARISON: [
    { message: "상품 비교 agent를 확인하고 있습니다." },
    { message: "상품정보를 확인하여 비교하고 있습니다." },
    { message: "상품비교 및 요약정보를 생성하고 있습니다." },
  ],
  FIT_SEARCH_COMBO: [
    { message: "항공편 실시간 조회 중..." },
    { message: "호텔 검색 중..." },
    { message: "최적 조합 계산 중..." },
  ],
  FIT_SEARCH_FLIGHT: [
    { message: "항공편 실시간 조회 중..." },
    { message: "최적 항공편 매칭 중..." },
  ],
  FIT_SEARCH_HOTEL: [
    { message: "호텔 실시간 검색 중..." },
    { message: "최적 호텔 매칭 중..." },
  ],
};
