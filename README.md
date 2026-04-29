# Agentic Commerce - H-AI 여행 예약 챗봇

> React + Vite 기반 여행 예약 AI 챗봇 UI (버전 0.0.1)  
> **라이브 데모**: [agentic-commerce-blush.vercel.app](https://agentic-commerce-blush.vercel.app)

## 📋 프로젝트 개요

**H-AI (하이)**는 사용자와 대화하며 여행 패키지와 자유여행(FIT)을 추천하고, 예약·결제까지 진행할 수 있는 AI 챗봇 인터페이스입니다.

### 주요 기능

- 🤖 **AI 챗봇 인터페이스**: 자연어 입력 및 단계별 대화형 UI
- 🏠 **랜딩(MainPage)**: 칩 메뉴(퀴즈쇼, 오늘의 운세, 상품 추천 등) 및 "상품 추천받고 결제하기" 진입
- 🌍 **여행 타입 선택**: 패키지 여행 vs 자유여행(FIT)
- 📝 **선호도 입력**: 목적지, 테마, 예산, 여행 인원(성인/아동/유아). FIT·추천검색 시 아동만 선택 가능 + 아동별 나이(만0~만17세) 선택
- 🔍 **AI 추론 단계 시각화**: 검색·비교 시 AgentReasoningBlock으로 단계별 진행 표시
- 📦 **패키지 플로우**: 추천 상품 카드, 상세(바텀시트), 비교, 재추천
- ✈️ **자유여행(FIT) 플로우**
  - **조합**: 항공+숙소 추천, FITPackageCard/Detail, 조합 비교·재추천
  - **항공만**: FlightCard, FlightDetail, 항공편 비교·재추천
  - **숙소만**: HotelCard, HotelDetail, 숙소 비교·재추천
- 🛏️ **룸타입 선택**: 호텔별 RoomTypeSelector 바텀시트
- 🎫 **액티비티 추가**: 현지 투어·티켓 선택(ActivityTicketSelector)
- 👤 **페르소나 기반 Smart-Fill**: 추천 검색 시 목적지·예산·테마 등 자동 채움. 추천 검색 시 인원은 자유여행과 동일하게 성인+아동만 표시, 아동 선택 시 나이 선택 박스 제공
- 💬 **예약·결제 컨텍스트 토스트 (AgentToast)**: 패키지 `PackageBookingSheet`·`PaymentSheet`에서 스크롤 구간·일부 인터랙션(카드 선택 등)에 맞춰 하이(H-AI) 안내 토스트·상세 패널 표시. 설정은 `booking-toast-config.ts`, `payment-toast-config.ts`
- 👥 **패키지 인원·가격 미리보기**: `TravelerCountA2UI`(스와이프형 단계 UI·phase) + `PackageBookingPricePreview`로 **예약 인원·결제 금액 확인** 흐름에 맞춘 예상 결제 금액·항공 일정 요약 표시
- 💳 **예약·결제**: 패키지는 `PackageBookingSheet` → `PaymentSheet` → 예약 확정·완료 UI; FIT·숙소·항공 등은 `BookingForm` / `FlightBookingSheet` 등 경로별 분기 후 `PaymentSheet` 또는 `PaymentModal` → `BookingConfirmation`(또는 시트 내 완료)

---

## 🛠 기술 스택

### Core
- **React 18.3.1** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite 6.3.5** - 빌드·개발 서버
- **Tailwind CSS 4.1.12** - 스타일링

### UI·UX
- **Radix UI** - Accordion, Dialog, Dropdown, Popover, Select, Tabs 등
- **Lucide React** - 아이콘
- **Recharts** - 차트
- **React Hook Form** - 폼 관리
- **Sonner** - 토스트
- **Motion** - 애니메이션
- **Vaul** - 드로어(바텀시트)
- **cmdk** - 커맨드 팔레트
- **MUI Material 7.3.5** / **Emotion** - 추가 컴포넌트·스타일

### 기타
- **date-fns**, **react-day-picker** - 날짜
- **Playwright** - E2E 테스트

---

## 📁 프로젝트 구조

```
src/
├── main.tsx                 # 엔트리
├── app/
│   ├── App.tsx              # 단일 앱, step 기반 플로우 및 상태
│   ├── constants/
│   │   └── reasoningSteps.ts # AI 추론 단계 메시지
│   └── components/
│       ├── MainPage.tsx     # 랜딩 (칩 메뉴)
│       ├── ChatMessage.tsx
│       ├── PreferenceInput.tsx
│       ├── PackageCard.tsx, PackageDetail.tsx, PackageComparison.tsx
│       ├── FITPackageCard.tsx, FITPackageDetail.tsx, FITComparison.tsx
│       ├── FlightCard.tsx, FlightDetail.tsx, FlightComparison.tsx
│       ├── HotelCard.tsx, HotelDetail.tsx, HotelComparison.tsx
│       ├── RoomTypeSelector.tsx, ActivityTicketSelector.tsx
│       ├── BookingForm.tsx, PackageBookingSheet.tsx, PackageBookingPricePreview.tsx
│       ├── PaymentSheet.tsx, PaymentModal.tsx, BookingConfirmation.tsx
│       ├── AgentToast.tsx, booking-toast-config.ts, payment-toast-config.ts
│       ├── TravelerCountA2UI.tsx
│       ├── AgentReasoningBlock.tsx
│       └── ui/              # 공통 UI (button, card, dialog, sheet 등)
├── styles/
│   ├── index.css
│   ├── tailwind.css
│   └── theme.css
└── imports/                 # 에셋·SVG 등
```

---

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 3. 프로덕션 빌드

```bash
npm run build
```

### 4. 빌드 미리보기

```bash
npm run preview
```

---

## 💡 사용 방법

### 1. 랜딩
- 앱 실행 시 H-AI 랜딩 화면 표시
- **"상품 추천받고 결제하기"** 클릭 시 채팅 플로우 시작

### 2. 여행 타입 선택
- **추천 검색하기**(페르소나 있을 때): 이전 검색 기반으로 목적지·예산 등 자동 채움, 인원은 성인+아동만·아동 나이 선택
- **직접 검색하기** → **패키지 상품**: 항공+숙소+일정 포함 상품 추천 (인원: 성인/아동/유아)
- **직접 검색하기** → **자유여행(FIT)**: 항공+숙소 조합 / 항공만 / 숙소만 중 선택 (인원: 성인+아동, 아동 나이 선택)

### 3. 선호도 입력
- 목적지, 테마, 예산, 여행 시기(달력), 예산, 여행 인원 입력
- **직접 검색 → 패키지**: 인원은 성인 / 아동 / 유아 3종
- **직접 검색 → 자유여행** 또는 **추천 검색하기**: 인원은 성인 / 아동만 표시, 아동 1명 이상 시 아동별 나이(만0세~만17세) 선택 박스 표시
- FIT 선택 시 검색 모드(조합/항공만/숙소만) 선택

### 4. 추천 확인 및 비교
- 패키지: 카드 클릭 → 상세 → 비교하기 / 추천 다시받기
- FIT: 조합·항공·숙소 각각 카드 → 상세 → 비교·재추천

### 5. 룸타입·액티비티(FIT)
- 숙소 선택 시 룸타입 선택 바텀시트
- 액티비티 티켓 선택 후 예약 진행

### 6. 예약·결제
- **패키지**: 상세에서 예약 시 `PackageBookingSheet`(예약자·여행자·인원·금액 확인·결제 방식 등) → 제출 시 `PaymentSheet` → 완료/확정. 시트 내 스크롤 시 **AgentToast**로 구간별 안내·토스트 보강.
- **그 외(FIT·숙소 등)**: `BookingForm` 등 → `PaymentSheet` 또는 `PaymentModal` → `BookingConfirmation` 또는 시트 완료 화면.

---

## 🚀 GitHub & Vercel 배포

### 1. GitHub에 올리기

**1) GitHub에서 새 저장소 만들기**
- [GitHub](https://github.com/new) 접속 → **New repository**
- Repository name: 예) `agentic-commerce-2` (원하는 이름)
- **Public** 선택, **Create repository** (README/ .gitignore 추가 안 함)

**2) 터미널에서 커밋 후 푸시**

```bash
cd /Users/hg229/Documents/바이브코딩/ai_project-main/projects/agentic_commerce_3

# 이미 git init 되어 있다면 아래만 실행
git add .
git commit -m "feat: H-AI 여행 예약 챗봇 (페르소나 Smart-Fill, FIT/패키지 플로우, 추천검색 아동 나이 선택)"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

- `YOUR_USERNAME`: 본인 GitHub 아이디  
- `YOUR_REPO_NAME`: 1)에서 만든 저장소 이름

처음부터 Git 초기화가 필요하면:

```bash
cd /Users/hg229/Documents/바이브코딩/ai_project-main/projects/agentic_commerce_3
git init
git add .
git commit -m "feat: H-AI 여행 예약 챗봇 초기 버전"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Vercel로 배포해 URL 만들기

**방법 A: Vercel 웹 (권장)**  
1. [vercel.com](https://vercel.com) 로그인 (GitHub 연동)  
2. **Add New** → **Project**  
3. **Import Git Repository**에서 방금 푸시한 저장소 선택  
4. **Framework Preset**: Vite 자동 감지  
5. **Root Directory**: 비워두거나 `projects/agentic_commerce_3` (모노레포인 경우만)  
6. **Deploy** 클릭  
7. 완료 후 `https://프로젝트명.vercel.app` 형태의 URL 발급  

**방법 B: Vercel CLI**  
1. `npm i -g vercel`  
2. 프로젝트 폴더에서 `vercel` 실행 후 로그인·프로젝트 연결  
3. 배포 후 표시되는 URL 사용  

배포 후에도 `git push` 하면 Vercel이 자동으로 다시 배포됩니다.

**Git 연동 오류 시:** Vercel 프로젝트 **Settings → Git**에 `Error: Project Link not found`가 보이면 **Reconnect**로 `GrimJung/agentic_commerce` 등 실제 레포를 다시 연결한 뒤, **Deployments**에서 최신 `main` 커밋으로 한 번 배포되는지 확인하세요. 연결만 복구된 직후에는 수동 **Redeploy** / **Create Deployment**가 필요할 수 있습니다.

---

## 📦 Archive (원복용 문서)

- **`docs/archive/`**: 신규 로직 전 **기존 플로우·UI**를 기록한 문서.  
- **항공+호텔(FIT 조합)** 예약·결제: [`docs/archive/FIT_COMBO_AIR_HOTEL_BOOKING_PAYMENT.md`](./docs/archive/FIT_COMBO_AIR_HOTEL_BOOKING_PAYMENT.md)

### UI 목업 샘플 (문서·기획용)

- `public/samples/hai-toast/hai-agent-toast-compact.png` — 컴팩트 토스트  
- `public/samples/hai-toast/hai-agent-toast-detail-panel.png` — 상세 패널

---

## 📝 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-04-15 ~ 2026-04-28 | **예약·결제 단계**: 예약 인원 수·결제 금액 확인 흐름 정리·머지, 예약/결제 단계별 UI·토스트(`AgentToast`) 동작 다듬음, 토스트 팝업 추가 수정. **`TravelerCountA2UI`**: 스와이프(phase) 타입 정리. **결제 완료** 화면·CSS 싱크·전반 스타일 반영(04.23). **첫 프로덕션 배포**: GitHub `main` + Vercel 연동(연결 끊김 시 Settings → Git **Reconnect**). |
| 2026-04-07 ~ 2026-04-14 | **AgentToast**: 패키지 예약·결제 시트에 스크롤·섹션 연동 토스트, 상세 패널(바깥 클릭·Escape 닫기, 구간 전환 시 자동 숨김). **토스트 구성**: 예약=`booker`·`traveler`·`price`·`payment`(계약금/전액); 결제=`coupon`·`installment`·`cta` + 삼성/하나 카드 선택 시 `interactionToastKey`. **패키지 UX**: `TravelerCountA2UI` 스와이프형 인원 단계, `PackageBookingPricePreview`와 결제 시트 할인 정책 정렬, 총액 행 타이포 조정. **샘플 PNG**: `public/samples/hai-toast/` 툴 전용 2종 정리. 결제 완료 등 화면 미세 조정. |
| 2026-03-23 | **Archive**: 항공+호텔(FIT 조합) 예약·결제 프로세스를 `docs/archive/`에 저장 (신규 로직 작업 시 원복 참고) |
| 2026-03-18 | **PackageDetail UI**: "H-AI 요약" 라벨 폰트 크기 12px → 10px 적용; "30% 자유시간 보장" 텍스트 줄바꿈 방지(`whitespace-nowrap`) 적용 |

---

## 📌 참고

- 현재 상품·항공·숙소·액티비티 데이터는 **목업(mock)** 데이터를 사용합니다.
- 실제 API·결제 연동은 별도 구현이 필요합니다.
