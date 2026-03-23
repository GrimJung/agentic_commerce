# Archive: 항공+호텔(FIT 조합) 예약·결제 프로세스

> **목적**: 신규 로직 적용 전, 기존 **[항공+호텔]** 상품(`fitSearchMode === "combo"`, `FITPackageData`)의 예약·결제 UI·플로우를 기록해 **필요 시 원복**할 수 있게 합니다.  
> **Archive 기준일**: 2026-03-23  
> **권장**: 작업 시작 직전 `git rev-parse HEAD` 로 커밋 해시를 이 문서 상단에 추가해 두세요.

---

## 1. 개요

- **상품 종류**: 자유여행(FIT) 중 **조합(combo)** — 카드/데이터 상 `FITPackageCard` + `FITPackageData` (항공 `flightInfo` + 호텔 `hotelInfo`).
- **핵심 UX**:  
  1. **항공**은 `FlightBookingSheet` 단일 바텀시트에서 **약관·운임 확인 → 결제(또는 나중결제) → 항공 예약 완료**까지 처리 (`isFitCombo === true`).  
  2. **호텔**은 `BookingForm`(`isFitCombo`)으로 예약자 정보 입력 후 **`PaymentSheet`** 로 결제 (`isFitCombo`, `completionDetails` 등 FIT 전용 props).
- **패키지 전용** `PackageBookingSheet` / `PaymentModal` 경로와 **분리**되어 있음. FIT 조합 호텔 결제 완료 시 `BookingConfirmation` 대신 **`handlePaymentSuccess` 내 FIT 분기**로 종료.

---

## 2. 진입 경로 (2가지)

### A. 채팅 플로우 — 카드에서 [예약하기]

- **함수**: `handleFITBooking` (`App.tsx`)
- **동작**: `selectedFitPackage` 필수 → `setCurrentHotelForRoomSelection(selectedFitPackage.id)`, `setRoomSelectorSource("booking")`, `setShowRoomTypeSelector(true)`.
- **이후**: `RoomTypeSelector` 에서 객실 선택 완료 시 `selectedFitPackage` 분기에서 `setShowBookingForm(true)`, `setStep("booking")` — **먼저 호텔 쪽 `BookingForm` 진입** (항공 시트보다 룸 선택 우선).

### B. FIT 상세 바텀시트 — [예약하기]

- **컴포넌트**: `FITPackageDetail` → `onBooking` (`App.tsx` 인라인)
- **동작 요약**:
  - `selectedFitPackage.flightInfo` 를 `FlightData` 로 변환해 `setSelectedFlight`, `setFitTotalPrice(selectedFitPackage.totalPrice)`, `setFlightSheetStep("terms")`, `setStep("booking")`.
- **이후**: **`FlightBookingSheet`** 노출 (`flightSheetStep && selectedFlight`) — **항공 약관·운임 → 결제 → 완료** 후 `onProceedToHotel` 으로 호텔 `BookingForm` 연결.

---

## 3. 상태 변수 (`App.tsx` 기준)

| 상태 | 용도 (FIT 조합 관련) |
|------|----------------------|
| `selectedFitPackage` | 현재 선택된 FIT 조합 상품 |
| `selectedFlight` | FIT 상세 예약 시 항공 데이터(조합에서 파생) |
| `flightSheetStep` | `"terms" \| "payment" \| "complete" \| null` — 항공 시트 단계 |
| `bookingData` | 예약자 정보 (항공 시트에서도 세팅) |
| `flightReservationNumber`, `flightCompleteIsPayLater` | 항공 완료 화면용 |
| `showBookingForm` | FIT 호텔 `BookingForm` 표시 |
| `showRoomTypeSelector`, `currentHotelForRoomSelection`, `roomSelectorSource` | 룸타입 선택 (카드 진입 시) |
| `selectedRoomType` | 선택 객실 (가격·라벨 반영) |
| `fitTotalPrice` | 조합 총액/조정 금액 |
| `showPaymentSheet`, `paymentAmount` | FIT 호텔 결제용 `PaymentSheet` |
| `showPayment` + `selectedFitPackage` | 코드상 **FIT용 `PaymentModal`** 조건도 존재 (아래 참고) |
| `showFitHotelComplete` | `PaymentSheet` `skipPayment` 완료 전용 UI — **현재 코드에서 `true` 로 켜는 경로 없음** (예약된 확장용) |

---

## 4. 단계별 플로우 (상세)

### 4.1 경로 B (상세에서 예약) — 항공 먼저

1. `FlightBookingSheet` (`isFitCombo={!!selectedFitPackage}`)
   - `terms`: `FlightReservationSheet` embedded — 약관, **운임(기본운임·세금·수수료 등)**.
   - `payment`: `FlightPaymentSheet` embedded — 결제수단, 결제/예약하기.
   - `complete`: `FlightReservationComplete` — `onProceedToHotel` 제공 시 **“이어서 호텔 예약”** 등.
2. `onProceedToNextStep`: `setBookingData(data)`, `setFlightSheetStep("payment")`.
3. `onFinalSubmit`: 채팅 메시지 추가, `setFlightSheetStep("complete")`.
4. `onProceedToHotel` (FIT 일 때만): `setFlightSheetStep(null)`, 룸 기본값 보정 후 `setShowBookingForm(true)`, `setStep("booking")`.
5. `BookingForm` (`isFitCombo`, `packageTitle` = 호텔명): 제출 시 `setPaymentAmount(hotelPrice)`, `setShowPaymentSheet(true)`, `setStep("payment")` — **호텔 금액만** 결제 시트로 전달하는 패턴.
6. `PaymentSheet`: `isFitCombo={!!selectedFitPackage && !selectedHotel && !selectedPackage}`, `completionDetails` 에 호텔 체크인/객실 등 목업 값.

### 4.2 경로 A (카드에서 예약) — 룸 선택 먼저

1. `RoomTypeSelector` → `onSelect` 에서 `selectedFitPackage` 이면 `setFitTotalPrice(...)` 후 `setShowBookingForm(true)`.
2. 이후 **4.1의 5~6** 과 동일하게 `BookingForm` → `PaymentSheet`.

### 4.3 결제 완료 후 (`handlePaymentSuccess`)

- **FIT 조합 호텔** 분기 (`selectedFitPackage && !selectedPackage`):
  - `setShowConfirmation(false)`, `setShowFitHotelComplete(false)`, `setStep("packages")` — **일반 `BookingConfirmation` 미사용**.
  - 채팅에 `fitCompletionProposal` 메시지 추가.

---

## 5. 관련 UI 컴포넌트 (파일 경로)

| 컴포넌트 | 경로 | 역할 |
|----------|------|------|
| `FITPackageCard` | `src/app/components/FITPackageCard.tsx` | 조합 카드, 예약 버튼 → `handleFITBooking` 등 |
| `FITPackageDetail` | `src/app/components/FITPackageDetail.tsx` | 항공/호텔 탭 상세, `onBooking` / `onChangeRoom` / `onChangeFlight` |
| `FlightBookingSheet` | `src/app/components/FlightBookingSheet.tsx` | `terms` → `payment` → `complete` 단일 바텀시트 |
| `FlightReservationSheet` | `src/app/components/FlightReservationSheet.tsx` | 약관 + 운임 UI |
| `FlightPaymentSheet` | `src/app/components/FlightPaymentSheet.tsx` | 항공 결제 단계 |
| `FlightReservationComplete` | `src/app/components/FlightReservationComplete.tsx` | 항공 완료, FIT 시 호텔 이어하기 |
| `RoomTypeSelector` | `src/app/components/RoomTypeSelector.tsx` | 객실 선택 |
| `BookingForm` | `src/app/components/BookingForm.tsx` | `isFitCombo` 시 단계 UI/타이틀 분기 |
| `PaymentSheet` | `src/app/components/PaymentSheet.tsx` | FIT 호텔 결제·완료, `isFitCombo` 단계 표시 |
| `PaymentModal` | `src/app/components/PaymentModal.tsx` | `showPayment && selectedFitPackage && bookingData` 조건으로 **병존** (다른 진입에서 `handleBookingSubmit` 쓸 경우) |

---

## 6. `App.tsx` 조건부 렌더 핵심 (검색 키워드)

원복 시 아래 식별자로 블록을 찾습니다.

- `handleFITBooking`
- `showBookingForm && !selectedPackage && selectedFitPackage`
- `showPaymentSheet && paymentAmount > 0` 내부 `isFitCombo` / `selectedFitPackage` 의 `completionDetails`
- `showFitHotelComplete && selectedFitPackage` (`PaymentSheet` `skipPayment`)
- `flightSheetStep && selectedFlight` 내부 `FlightBookingSheet` 의 `isFitCombo`, `onProceedToHotel`
- `handlePaymentSuccess` 내 `selectedFitPackage && !selectedPackage` 분기
- `showPayment && !selectedPackage && selectedFitPackage && bookingData` → `PaymentModal`

(라인 번호는 브랜치마다 달라지므로 문서에는 고정하지 않음.)

---

## 7. Git으로 원복하는 방법 (권장)

```bash
cd projects/agentic_commerce_2
# 아카이브 시점 커밋 해시를 기록해 두었다면:
git checkout <COMMIT_HASH> -- src/app/App.tsx
# 또는 전체 프로젝트를 해당 커밋으로 되돌리기 (주의: 다른 작업 손실)
# git checkout <COMMIT_HASH> -- .
```

신규 작업 브랜치에서만 파일 단위 checkout 을 사용하면 안전합니다.

---

## 8. 알려진 이슈·메모

- **`showFitHotelComplete`**: 상태는 있으나 **`setShowFitHotelComplete(true)` 호출이 코드베이스에 없음** — 향후 “호텔만 완료 화면” 분기용으로 보이며, 아카이브 시점 기준 미연결.
- **목업 데이터**: `mockRoomTypes`, `mockFITPackages` 등과 강하게 결합.
- **step 값**: 조합 플로우에서 `"fit-packages"`, `"booking"`, `"payment"`, `"confirmed"` 등이 혼용되며, FIT 호텔 결제 후 `setStep("packages")` 로 떨어지는 분기가 있음 (`handlePaymentSuccess`).

---

## 9. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-03-23 | 최초 작성 — 항공+호텔(FIT 조합) 예약·결제 프로세스 아카이브 |
