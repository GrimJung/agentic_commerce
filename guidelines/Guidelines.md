# H-AI 프로젝트 가이드라인

- **선호도 입력(PreferenceInput)**: 패키지 직접 검색 시 인원=성인/아동/유아 3종. FIT 또는 추천 검색 시 인원=성인+아동만, 아동 1명 이상 시 아동별 나이(만0~만17세) 선택 박스 표시. `personaRecommendFlow` prop으로 추천 검색 플로우 구분.
- **문서·다이어그램**: README, mvp.md, research.md, AGENTIC_COMMERCE_ANALYSIS.md, PUML(`user-flow.puml`, `state-diagram.puml`, `simple-flowchart.puml`)은 최신 플로우(추천 검색, 인원 옵션, **패키지 PackageBookingSheet·PaymentSheet·AgentToast**, 예약 인원·결제 금액 확인, FIT·숙소 `BookingForm`/PaymentSheet 분기) 및 UI 변경 이력(2026-04-28 기준 README 변경 이력) 반영하여 유지.
- **2026-04-15 ~ 04-28**: 예약/결제 단계·토스트 팝업 미세 수정, `TravelerCountA2UI` 스와이프 phase 타입, 결제 완료 화면·CSS 싱크, **04.23 스타일** 패스. Vercel은 Git **Reconnect** 후 최신 `main` 배포 확인.
- **PackageDetail UI**: "H-AI 요약" 라벨은 `text-[10px]` 유지; "30% 자유시간 보장" 텍스트는 `whitespace-nowrap`으로 줄바꿈 방지 유지. (2026-03-18 반영)
- **AgentToast (예약·결제 시트)**: 스크롤 컨테이너는 `scrollRef`로 전달. 섹션 트리거는 `booking-toast-config.ts` / `payment-toast-config.ts`의 `sectionId`·`toastKey`와 시트 내 DOM `id`를 일치시킬 것. 카드 선택 등 일시 안내는 `interactionToastKey`로 우선 표시. 상세 패널은 포커스·포인터 바깥 영역·Escape로 닫힘.
- **패키지 인원·가격**: `TravelerCountA2UI`는 상품 요약+인원+금액을 **한 카드**에서 처리(`onPhaseChange`: `editing` | `cancelled`). 금액 블록은 `PackageBookingPriceSummaryBlock`·`PackageBookingTripSummary`와 `PackageBookingPricePreview`가 동일 로직·상수(`PACKAGE_PREVIEW_COUPON_DISCOUNT`)를 공유한다.

---

**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
