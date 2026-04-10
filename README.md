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
- 💳 **예약·결제**: BookingForm → PaymentModal → BookingConfirmation

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
│   │   ├── reasoningSteps.ts # AI 추론 단계 메시지
│   │   └── figmaDesign.ts    # Figma 디자인 URL·fileKey·nodeId (MCP·팀 공유)
│   └── components/
│       ├── MainPage.tsx     # 랜딩 (칩 메뉴)
│       ├── ChatMessage.tsx
│       ├── PreferenceInput.tsx
│       ├── PackageCard.tsx, PackageDetail.tsx, PackageComparison.tsx
│       ├── FITPackageCard.tsx, FITPackageDetail.tsx, FITComparison.tsx
│       ├── FlightCard.tsx, FlightDetail.tsx, FlightComparison.tsx
│       ├── HotelCard.tsx, HotelDetail.tsx, HotelComparison.tsx
│       ├── RoomTypeSelector.tsx, ActivityTicketSelector.tsx
│       ├── BookingForm.tsx, PaymentModal.tsx, BookingConfirmation.tsx
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
- 예약자 정보(BookingForm) → 결제(PaymentModal) → 예약 확정(BookingConfirmation)

---

## 🚀 GitHub & Vercel 배포

### 1. GitHub에 올리기

**1) GitHub에서 새 저장소 만들기**
- [GitHub](https://github.com/new) 접속 → **New repository**
- Repository name: 예) `agentic-commerce-2` (원하는 이름)
- **Public** 선택, **Create repository** (README/ .gitignore 추가 안 함)

**2) 터미널에서 커밋 후 푸시**

```bash
cd /Users/hg229/Documents/바이브코딩/ai_project-main/projects/agentic_commerce_2

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
cd /Users/hg229/Documents/바이브코딩/ai_project-main/projects/agentic_commerce_2
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
5. **Root Directory**: 비워두거나 `projects/agentic_commerce_2` (모노레포인 경우만)  
6. **Deploy** 클릭  
7. 완료 후 `https://프로젝트명.vercel.app` 형태의 URL 발급  

**방법 B: Vercel CLI**  
1. `npm i -g vercel`  
2. 프로젝트 폴더에서 `vercel` 실행 후 로그인·프로젝트 연결  
3. 배포 후 표시되는 URL 사용  

배포 후에도 `git push` 하면 Vercel이 자동으로 다시 배포됩니다.

---

## 📦 Archive (원복용 문서)

- **`docs/archive/`**: 신규 로직 전 **기존 플로우·UI**를 기록한 문서.  
- **항공+호텔(FIT 조합)** 예약·결제: [`docs/archive/FIT_COMBO_AIR_HOTEL_BOOKING_PAYMENT.md`](./docs/archive/FIT_COMBO_AIR_HOTEL_BOOKING_PAYMENT.md)

---

## 📝 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-03-23 | **Archive**: 항공+호텔(FIT 조합) 예약·결제 프로세스를 `docs/archive/`에 저장 (신규 로직 작업 시 원복 참고) |
| 2026-03-18 | **PackageDetail UI**: "H-AI 요약" 라벨 폰트 크기 12px → 10px 적용; "30% 자유시간 보장" 텍스트 줄바꿈 방지(`whitespace-nowrap`) 적용 |

---

## 🎨 Figma 디자인과 연결하기

**디자인 파일(하나투어):**  
[figma.com/design/VW7b6yIt3R37ckL7XnRMGo … node 384-6](https://www.figma.com/design/VW7b6yIt3R37ckL7XnRMGo/%ED%95%98%EB%82%98%ED%88%AC%EC%96%B4?node-id=384-6)

코드베이스에는 동일 링크와 MCP용 식별자가 `src/app/constants/figmaDesign.ts`에 있습니다 (`FIGMA_FILE_KEY`, `FIGMA_NODE_ID`).

### 1) Cursor에서 Figma MCP로 이 파일과 맞추기

1. **Settings → MCP**에서 Figma 공식 MCP(`plugin-figma-figma` 등)를 켜고 **로그인·인증**을 완료합니다.  
2. 채팅에서 위 URL을 붙이거나, `fileKey` + `nodeId`로 디자인 컨텍스트를 요청합니다.  
   - `fileKey`: `VW7b6yIt3R37ckL7XnRMGo`  
   - `nodeId`: URL의 `384-6` → MCP/API에서는 **`384:6`** (하이픈을 콜론으로)

### 2) Figma 쪽에서 “이 구현”과 묶고 싶을 때

- **프로토타입·스펙**: Figma 파일/프레임 설명에 **이 저장소 URL** 또는 **Vercel 라이브 데모** 링크를 적어 두면 됩니다.  
- **컴포넌트 단위 매핑**: [Figma Code Connect](https://www.figma.com/developers/code-connect)로 React 컴포넌트와 Figma 컴포넌트를 1:1로 연결할 수 있습니다. (별도 `@figma/code-connect` 설정·CLI가 필요합니다.)

### 3) 로컬 전용 MCP(`user-figma`, `127.0.0.1:…`)를 쓰는 경우

Figma **데스크톱**에서 MCP 서버를 켠 뒤, Cursor MCP URL의 **포트가 데스크톱에 표시된 값과 같은지** 확인합니다. 브라우저만 쓰면 로컬 포트에 연결되지 않을 수 있습니다.

---

## 📌 참고

- 현재 상품·항공·숙소·액티비티 데이터는 **목업(mock)** 데이터를 사용합니다.
- 실제 API·결제 연동은 별도 구현이 필요합니다.
