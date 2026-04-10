import { useRef, useState } from "react";
import { Plus, Mic } from "lucide-react";
import { MainPage } from "./components/MainPage";
import { ChatMessage } from "./components/ChatMessage";
import { PreferenceInput } from "./components/PreferenceInput";
import { PackageCard, PackageData } from "./components/PackageCard";
import { PackageDetail } from "./components/PackageDetail";
import { PackageInlineDetail } from "./components/PackageInlineDetail";
import { AIPackageComparison } from "./components/AIPackageComparison";
import { PackageComparisonInline } from "./components/PackageComparisonInline";
import { FITPackageCard, FITPackageData } from "./components/FITPackageCard";
import { FITPackageDetail } from "./components/FITPackageDetail";
import { FITComparison } from "./components/FITComparison";
import { FlightCard, FlightData } from "./components/FlightCard";
import { FlightComparison } from "./components/FlightComparison";
import { HotelCard, HotelData } from "./components/HotelCard";
import { HotelComparison } from "./components/HotelComparison";
import { HotelDetail } from "./components/HotelDetail";
import { FlightDetail } from "./components/FlightDetail";
import { FlightSelectSheet } from "./components/FlightSelectSheet";
import { FlightBookingSheet } from "./components/FlightBookingSheet";
import type { FlightSheetStep } from "./components/FlightBookingSheet";
import { FlightPaymentConditionSheet } from "./components/FlightPaymentConditionSheet";
import { ActivityTicketSelector, ActivityTicket } from "./components/ActivityTicketSelector";
import { RoomTypeSelector, RoomType } from "./components/RoomTypeSelector";
import { BookingForm, BookingFormData } from "./components/BookingForm";
import { PackageBookingSheet } from "./components/PackageBookingSheet";
import { PaymentSheet, type PaymentCompleteDetails } from "./components/PaymentSheet";
import { PaymentModal } from "./components/PaymentModal";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { AgentReasoningBlock } from "./components/AgentReasoningBlock";
import { REASONING_STEPS } from "./constants/reasoningSteps";

/** 내맘대로(항공+호텔) 항공예약정보 단계 진입 시 기본 예약자 정보 */
const DEFAULT_NAMEMDAE_FLIGHT_BOOKING: BookingFormData = {
  name: "강다희",
  phone: "010-1234-5678",
  email: "hana@hanatour.com",
  birthDate: "1990-01-11",
  passportNumber: "",
  travelers: 2,
  agreeTerms: true,
  agreeCancellation: true,
};

// 클릭 시 사라지는 버튼 그룹
function DismissableButtons({ buttons }: { buttons: { label: string; onClick: () => void; className: string }[] }) {
  const [clicked, setClicked] = useState(false);
  if (clicked) return null;
  return (
    <div className="flex gap-2">
      {buttons.map(btn => (
        <button
          key={btn.label}
          onClick={() => { setClicked(true); btn.onClick(); }}
          className={btn.className}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

// 헤더 컴포넌트
function Header({ onBack }: { onBack?: () => void }) {
  return (
    <div className="relative flex h-[52px] items-center border-b border-[#f0f0f0] bg-white px-2">
      <button type="button" className="absolute left-1 top-1/2 z-[1] -translate-y-1/2 p-2" onClick={onBack} aria-label="뒤로">
        <svg className="size-6" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="flex flex-1 items-center justify-center gap-1.5 pr-1">
        <h1 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">
          H-AI 하이
        </h1>
        <button
          type="button"
          aria-label="도움말"
          className="flex size-[18px] shrink-0 items-center justify-center rounded-full border border-[#ccc] text-[11px] font-semibold text-[#666]"
        >
          ?
        </button>
      </div>
      <button type="button" className="absolute right-1 top-1/2 -translate-y-1/2 p-2" aria-label="메뉴">
        <svg className="size-5 text-[#111]" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="6" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="18" r="1.5" />
        </svg>
      </button>
    </div>
  );
}

// 입력창 컴포넌트
function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[390px] -translate-x-1/2 border-t border-[#f0f0f0] bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <button type="button" aria-label="추가" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-[#666]">
          <Plus className="size-5 stroke-[2]" />
        </button>
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="궁금한 내용을 H-AI에게 물어보..."
            className="w-full rounded-full border border-[#e5e5e5] bg-white py-3 pl-4 pr-[88px] text-[14px] text-[#111] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#3780ff]/25"
          />
          <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2.5">
            <Mic className="size-[18px] text-[#666]" strokeWidth={1.75} />
            <svg className="size-[18px] text-[#7b3ff2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 12v-2a4 4 0 014-4" />
              <path d="M4 6v6a4 4 0 004 4" />
              <path d="M8 10v4" />
              <path d="M12 8v8" />
              <path d="M16 6v12" />
              <path d="M20 9v6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 상품 노출 개수 (추천검색/직접검색/자유여행) */
const PRODUCT_COUNTS = {
  /** 추천검색하기: 항공+호텔 1개, 에어텔 1개, 호텔 1개 */
  recommended: 3,
  /** 직접검색 - 패키지: 패키지 3개 */
  directPackage: 3,
  /** 자유여행 항공+호텔: FIT 2개 + 에어텔(패키지) 1개 */
  fitCombo: { fit: 2, airtel: 1 },
  /** 자유여행 항공: 항공 3개 */
  fitFlight: 3,
  /** 자유여행 호텔: 호텔 3개 */
  fitHotel: 3,
} as const;

// 목업 패키지 데이터
const mockPackages: PackageData[] = [
  {
    id: "1",
    title: "발리 5일 럭셔리 휴양 패키지 - 세미냐크 프라이빗 풀빌라",
    destination: "발리, 인도네시아",
    duration: "4박 5일",
    price: 1890000,
    image: "https://images.unsplash.com/photo-1589632732202-bd154e6e116d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwYmVhY2glMjByZXNvcnQlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzAyNzU4MTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviewCount: 342,
    airline: "대한항공",
    hotel: "더 레기안 발리",
    hotelGrade: "5성급",
    departure: "2026.03.15 (토)",
    availableSeats: 8,
    highlights: [
      "프라이빗 풀빌라 숙박",
      "스파 & 마사지 1회 포함",
      "우붓 전통시장 투어",
      "탄중 베노아 수상 스포츠",
      "발리 전통 무용 관람"
    ],
    recommendReason: "5성급 풀빌라와 스파가 포함된 럭셔리 휴양 패키지예요. 예산 대비 가성비가 가장 뛰어납니다.",
  },
  {
    id: "3",
    title: "파리 6일 문화탐방 - 루브르 & 베르사유 궁전 포함",
    destination: "파리, 프랑스",
    duration: "4박 6일",
    price: 2390000,
    image: "https://images.unsplash.com/photo-1710195778783-a441adf75fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyJTIwY2l0eXxlbnwxfHx8fDE3NzAyNzU4MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviewCount: 412,
    airline: "에어프랑스",
    hotel: "메르큐어 파리 센터",
    hotelGrade: "4성급",
    departure: "2026.03.18 (수)",
    availableSeats: 12,
    highlights: [
      "루브르 박물관 한국어 가이드",
      "베르사유 궁전 관람",
      "에펠탑 전망대 입장",
      "센강 유람선 탑승",
      "몽마르트 언덕 자유시간"
    ],
    recommendReason: "파리 필수 명소를 한국어 가이드와 함께 효율적으로 둘러볼 수 있어요. 문화 탐방 테마에 가장 적합합니다.",
  },
  {
    id: "4",
    title: "도쿄 5일 자유여행 - 벚꽃 시즌 스페셜",
    destination: "도쿄, 일본",
    duration: "3박 5일",
    price: 1450000,
    image: "https://images.unsplash.com/photo-1620451978644-841acb416d6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFuJTIwY2hlcnJ5JTIwYmxvc3NvbXxlbnwxfHx8fDE3NzAyNzU4MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviewCount: 523,
    airline: "아시아나",
    hotel: "신주쿠 프린스 호텔",
    hotelGrade: "4성급",
    departure: "2026.03.25 (수)",
    availableSeats: 15,
    highlights: [
      "우에노 공원 벚꽃 명소",
      "디즈니랜드 1일권 옵션",
      "하라주쿠/시부야 쇼핑",
      "스시 오마카세 디너",
      "온천 료칸 체험"
    ],
    recommendReason: "벚꽃 시즌 한정 상품으로 잔여석이 빠르게 줄고 있어요. 가까운 거리와 합리적인 가격이 장점입니다.",
  },
  {
    id: "5",
    title: "몰디브 6일 올인클루시브 - 수상방 하니문 패키지",
    destination: "몰디브",
    duration: "4박 6일",
    price: 3850000,
    image: "https://images.unsplash.com/photo-1706753459618-31e52d7ca22d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMG9jZWFuJTIwcmVzb3J0fGVufDF8fHx8MTc3MDE5MTA0NXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5.0,
    reviewCount: 156,
    airline: "싱가포르 항공",
    hotel: "콘래드 몰디브 랑갈리",
    hotelGrade: "5성급",
    departure: "2026.03.22 (일)",
    availableSeats: 4,
    highlights: [
      "오버워터 수상방",
      "올인클루시브 (식사/음료)",
      "스노클링 & 다이빙",
      "커플 스파 & 마사지",
      "프라이빗 디너 세팅"
    ],
    recommendReason: "올인클루시브 수상방으로 허니문 만족도 1위 리조트예요. 잔여 4석으로 조기 마감이 예상됩니다.",
  }
];

// 패키지 추천 시 3번째 카드로 노출할 산토리니 항공+호텔 FIT 상품
const santorinitFitPackage: FITPackageData = {
  id: "fit-santorini",
  flightInfo: {
    airline: "에미레이트 항공",
    departure: "인천",
    arrival: "산토리니",
    departureCode: "ICN",
    arrivalCode: "JTR",
    departureTime: "23:50",
    arrivalTime: "11:30+1",
    returnDepartureTime: "13:00",
    returnArrivalTime: "07:30+1",
    flightNumber: "EK 327",
    returnFlightNumber: "EK 328",
    flightDurationLabel: "경유 1회·14시간 40분",
    returnFlightDurationLabel: "경유 1회·15시간 30분",
    price: 1350000,
    seatClass: "이코노미",
    flightDuration: "약 14시간 40분",
  },
  hotelInfo: {
    name: "아틀란티스 부티크 호텔",
    grade: "5성급 부티크",
    location: "이아 마을 블루돔 뷰",
    address: "Oia, Santorini 847 02, Greece",
    roomType: "블루돔 전망 디럭스룸",
    price: 1300000,
  },
  totalPrice: 2650000,
  duration: "5박 7일",
  travelDateRange: "03.20(목)~03.26(수)",
  destination: "산토리니, 그리스",
  passengerCount: 2,
  recommendReason: "에게해 선셋 크루즈와 와이너리 투어가 포함된 로맨틱 여행이에요. 블루돔 전망 객실은 예약 경쟁이 치열합니다.",
};

// 목업 자유여행(FIT) 패키지 데이터
const mockFITPackages: FITPackageData[] = [
  {
    id: "fit1",
    flightInfo: {
      airline: "대한항공",
      departure: "인천",
      arrival: "파리",
      departureCode: "ICN",
      arrivalCode: "CDG",
      departureTime: "13:30",
      arrivalTime: "20:50",
      returnDepartureTime: "12:10",
      returnArrivalTime: "15:30",
      flightNumber: "KE012",
      returnFlightNumber: "KE643",
      flightDurationLabel: "직항·12시간 50분",
      returnFlightDurationLabel: "직항·12시간 20분",
      price: 1200000,
      seatClass: "이코노미",
      flightDuration: "약 12시간 50분",
    },
    hotelInfo: {
      name: "노보텔 파리 센터",
      grade: "4성급",
      location: "샹젤리제 거리 도보 5분",
      address: "11 Rue du Colisée, 75008 Paris, France",
      roomType: "슈페리어 더블룸",
      price: 680000,
    },
    totalPrice: 1880000,
    duration: "4박 6일",
    travelDateRange: "04.01(월)~04.06(토)",
    destination: "파리, 프랑스",
    passengerCount: 2,
    recommendReason: "예산 대비 최적의 가성비 조합이에요. 샹젤리제 인근 4성급 호텔과 대한항공 직항편을 함께 이용할 수 있습니다.",
  },
  {
    id: "fit2",
    flightInfo: {
      airline: "아시아나",
      departure: "인천",
      arrival: "도쿄",
      departureCode: "ICN",
      arrivalCode: "NRT",
      departureTime: "09:00",
      arrivalTime: "11:30",
      returnDepartureTime: "14:00",
      returnArrivalTime: "16:30",
      flightNumber: "OZ 101",
      returnFlightNumber: "OZ 102",
      flightDurationLabel: "직항·2시간 30분",
      returnFlightDurationLabel: "직항·2시간 30분",
      price: 450000,
      seatClass: "이코노미",
      flightDuration: "약 2시간 30분",
    },
    hotelInfo: {
      name: "신주쿠 그랜비아 호텔",
      grade: "4성급",
      location: "신주쿠역 직결",
      roomType: "스탠다드 트윈룸",
      price: 520000,
    },
    totalPrice: 970000,
    duration: "3박 5일",
    travelDateRange: "04.08(월)~04.12(금)",
    destination: "도쿄, 일본",
    passengerCount: 2,
    recommendReason: "최단 비행시간과 역세권 호텔로 이동 편의성이 뛰어난 조합이에요. 신주쿠역 직결 호텔이라 짐 보관도 편리합니다.",
  },
];

// 항공+호텔 조회 시 3번째로 노출할 에어텔 상품 (패키지 상세/예약·결제 플로우 동일)
const airtelPackage: PackageData = {
  id: "airtel-bali",
  title: "발리 비즈니스석 항공+프라이빗 풀빌라 에어텔",
  destination: "발리, 인도네시아",
  duration: "4박 5일",
  price: 1950000,
  image: "https://images.unsplash.com/photo-1589632732202-bd154e6e116d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwYmVhY2glMjByZXNvcnQlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzAyNzU4MTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  rating: 4.9,
  reviewCount: 128,
  airline: "에미레이트 항공",
  flightType: "비즈니스석",
  hotel: "세미냐크 비치 리조트",
  hotelGrade: "5성급",
  departure: "2026.04.15 (월)",
  availableSeats: 6,
  highlights: [
    "비즈니스석 항공 (인천-발리 직항)",
    "프라이빗 풀빌라 숙박",
    "세미냐크 해변가 위치",
    "스파 & 마사지 1회 포함",
    "발리 전통 무용 관람"
  ],
  recommendReason: "비즈니스석 항공과 프라이빗 풀빌라로 프리미엄 휴양에 최적화된 조합이에요.",
};

// 목업 액티비티 티켓 데이터
const mockActivityTickets: ActivityTicket[] = [
  {
    id: "act1",
    title: "에펠탑 우선 입장권 + 센강 유람선",
    location: "파리 7구, 샹드마르스",
    duration: "약 3시간",
    price: 85000,
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400",
    category: "명소 입장권",
  },
  {
    id: "act2",
    title: "베르사유 궁전 가이드 투어",
    location: "베르사유",
    duration: "약 4시간",
    price: 95000,
    image: "https://image.hanatour.com/usr/cms/resize/800_0/2021/08/13/10000/3ff3c3b3-2fbb-435c-9db9-8a2a6f513eda.jpg",
    category: "가이드 투어",
  },
  {
    id: "act3",
    title: "루브르 박물관 한국어 오디오 가이드",
    location: "파리 1구, 루브르",
    duration: "약 2.5시간",
    price: 45000,
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400",
    category: "명소 입장권",
  },
];

// 목업 항공편 데이터
const mockFlights: FlightData[] = [
  {
    id: "flight1",
    airline: "대한항공",
    departure: "인천",
    arrival: "파리",
    departureTime: "13:30",
    arrivalTime: "18:20",
    price: 1200000,
    seatClass: "이코노미",
    flightDuration: "약 12시간 50분",
    destination: "파리, 프랑스",
    passengerCount: 2,
    travelDateRange: "04.01(월)~04.06(토)",
    duration: "4박 6일",
    isDirect: true,
    departureAirport: "인천국제공항 (ICN)",
    arrivalAirport: "샤를 드 골 국제공항 (CDG)",
    baggage: "23kg 2개",
    flightNumber: "KE901",
    recommendReason: "직항 최저가 항공편이에요. 대한항공 기내식과 수하물 23kg 2개 포함으로 편안한 여행이 가능합니다.",
  },
  {
    id: "flight2",
    airline: "에어프랑스",
    departure: "인천",
    arrival: "파리",
    departureTime: "19:00",
    arrivalTime: "23:45",
    price: 1350000,
    seatClass: "이코노미",
    flightDuration: "약 13시간 45분",
    destination: "파리, 프랑스",
    passengerCount: 2,
    travelDateRange: "04.01(월)~04.06(토)",
    duration: "4박 6일",
    isDirect: true,
    departureAirport: "인천국제공항 (ICN)",
    arrivalAirport: "샤를 드 골 국제공항 (CDG)",
    baggage: "23kg 1개",
    flightNumber: "AF266",
    recommendReason: "에어프랑스 직항으로 현지 도착 후 바로 활동 가능한 저녁 출발편이에요.",
  },
  {
    id: "flight3",
    airline: "에미레이트 항공",
    departure: "인천",
    arrival: "파리",
    departureTime: "10:00",
    arrivalTime: "19:30",
    price: 1800000,
    seatClass: "비즈니스",
    flightDuration: "약 14시간 30분 (1회 경유)",
    destination: "파리, 프랑스",
    passengerCount: 2,
    travelDateRange: "04.01(월)~04.06(토)",
    duration: "4박 6일",
    isDirect: false,
    departureAirport: "인천국제공항 (ICN)",
    arrivalAirport: "샤를 드 골 국제공항 (CDG)",
    baggage: "30kg 2개",
    flightNumber: "EK322",
    recommendReason: "비즈니스석으로 장거리 비행의 피로를 줄일 수 있어요. 수하물 30kg 2개로 쇼핑 여행에도 적합합니다.",
  },
];

// 목업 호텔 데이터
const mockHotels: HotelData[] = [
  {
    id: "hotel1",
    name: "노보텔 파리 센터",
    nameEn: "Novotel Paris Center",
    grade: "4성급",
    location: "샹젤리제 거리 도보 5분",
    address: "11 Rue du Colisée, 75008 Paris, France",
    roomType: "슈페리어 더블룸",
    price: 680000,
    destination: "파리, 프랑스",
    passengerCount: 2,
    travelDateRange: "04.01(월)~04.06(토)",
    duration: "4박 6일",
    recommendReason: "샹젤리제 거리 도보 5분 거리로 관광 접근성이 뛰어나요. 4성급 대비 합리적인 가격이 장점입니다.",
  },
  {
    id: "hotel2",
    name: "호텔 루브르 마르상",
    nameEn: "Hotel Louvre Marsan",
    grade: "3성급",
    location: "루브르 박물관 인근",
    address: "15 Rue du Louvre, 75001 Paris, France",
    roomType: "스탠다드 트윈룸",
    price: 520000,
    destination: "파리, 프랑스",
    passengerCount: 2,
    travelDateRange: "04.01(월)~04.06(토)",
    duration: "4박 6일",
    recommendReason: "루브르 박물관 바로 옆으로 도보 관광에 최적이에요. 예산을 아끼고 싶은 분께 추천합니다.",
  },
  {
    id: "hotel3",
    name: "쇼몽 엘리제",
    nameEn: "Chaumont Champs-Élysées",
    grade: "5성급",
    location: "에펠탑 전망 특급",
    address: "8 Avenue des Champs-Élysées, 75008 Paris, France",
    roomType: "디럭스 스위트",
    price: 1200000,
    destination: "파리, 프랑스",
    passengerCount: 2,
    travelDateRange: "04.01(월)~04.06(토)",
    duration: "4박 6일",
    recommendReason: "에펠탑이 보이는 5성급 스위트룸으로 특별한 경험을 원하시는 분께 추천해요.",
  },
];

// 목업 룸타입 데이터
const mockRoomTypes: { [hotelId: string]: RoomType[] } = {
  "hotel1": [
    {
      id: "room1-1",
      name: "슈페리어 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "25㎡",
      price: 0,
      priceFrom: 680000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연"],
      cancelPolicy: "free",
      breakfastIncluded: true,
    },
    {
      id: "room1-1b",
      name: "슈페리어 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "26㎡",
      price: 20000,
      priceFrom: 700000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연"],
      cancelPolicy: "nonRefundable",
      breakfastIncluded: false,
    },
    {
      id: "room1-1c",
      name: "슈페리어 킹룸",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "28㎡",
      price: 30000,
      priceFrom: 710000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"],
      cancelPolicy: "partial",
      breakfastIncluded: true,
    },
    {
      id: "room1-1d",
      name: "슈페리어 시티뷰",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "27㎡",
      price: 40000,
      priceFrom: 720000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"],
      cancelPolicy: "free",
      breakfastIncluded: false,
    },
    {
      id: "room1-1e",
      name: "슈페리어 디럭스",
      bedType: "퀸 베드 1개",
      capacity: "성인 2명",
      size: "30㎡",
      price: 50000,
      priceFrom: 730000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"],
      cancelPolicy: "nonRefundable",
      breakfastIncluded: true,
    },
    {
      id: "room1-2",
      name: "디럭스 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "28㎡",
      price: 50000,
      priceFrom: 730000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"],
      breakfastIncluded: false,
    },
    {
      id: "room1-2b",
      name: "디럭스 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "30㎡",
      price: 55000,
      priceFrom: 740000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room1-2c",
      name: "디럭스 킹룸",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "32㎡",
      price: 60000,
      priceFrom: 750000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"]
    },
    {
      id: "room1-2d",
      name: "디럭스 시티뷰",
      bedType: "퀸 베드 1개",
      capacity: "성인 2명",
      size: "31㎡",
      price: 58000,
      priceFrom: 745000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room1-2e",
      name: "디럭스 프리미엄",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "35㎡",
      price: 70000,
      priceFrom: 760000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소"]
    },
    {
      id: "room1-3",
      name: "이그제큐티브 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "45㎡",
      price: 150000,
      priceFrom: 830000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소"]
    },
    {
      id: "room1-3b",
      name: "주니어 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "42㎡",
      price: 120000,
      priceFrom: 800000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"]
    },
    {
      id: "room1-3c",
      name: "그랜드 스위트",
      bedType: "킹 베드 1개 + 소파베드",
      capacity: "성인 2명 + 어린이 2명",
      size: "55㎡",
      price: 200000,
      priceFrom: 880000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소", "거실"]
    },
    {
      id: "room1-3d",
      name: "로얄 스위트",
      bedType: "킹 베드 2개",
      capacity: "성인 4명",
      size: "70㎡",
      price: 280000,
      priceFrom: 950000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소", "거실", "발코니"]
    },
    {
      id: "room1-3e",
      name: "펜트하우스 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "65㎡",
      price: 250000,
      priceFrom: 920000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "파노라마뷰", "욕조", "네스프레소", "거실", "발코니"]
    }
  ],
  "hotel2": [
    {
      id: "room2-1",
      name: "스탠다드 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "22㎡",
      price: 0,
      priceFrom: 450000,
      amenities: ["무료 Wi-Fi", "에어컨", "금연"],
      cancelPolicy: "nonRefundable",
      breakfastIncluded: false,
    },
    {
      id: "room2-2",
      name: "스탠다드 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "22㎡",
      price: 0,
      priceFrom: 450000,
      amenities: ["무료 Wi-Fi", "에어컨", "금연"],
      cancelPolicy: "free",
      breakfastIncluded: true,
    },
    {
      id: "room2-3",
      name: "슈페리어 더블룸",
      bedType: "퀸 베드 1개",
      capacity: "성인 2명",
      size: "26㎡",
      price: 35000,
      priceFrom: 485000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "거리뷰"],
      cancelPolicy: "partial",
      breakfastIncluded: false,
    },
    {
      id: "room2-3b",
      name: "슈페리어 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "25㎡",
      price: 30000,
      priceFrom: 480000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연"]
    },
    {
      id: "room2-3c",
      name: "슈페리어 킹룸",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "28㎡",
      price: 45000,
      priceFrom: 495000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "거리뷰"]
    },
    {
      id: "room2-3d",
      name: "슈페리어 시티뷰",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "27㎡",
      price: 40000,
      priceFrom: 490000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room2-3e",
      name: "슈페리어 디럭스",
      bedType: "퀸 베드 1개",
      capacity: "성인 2명",
      size: "29㎡",
      price: 50000,
      priceFrom: 500000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"]
    },
    {
      id: "room2-4",
      name: "디럭스 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "28㎡",
      price: 40000,
      priceFrom: 520000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "거리뷰"]
    },
    {
      id: "room2-4b",
      name: "디럭스 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "29㎡",
      price: 42000,
      priceFrom: 525000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room2-4c",
      name: "디럭스 킹룸",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "31㎡",
      price: 48000,
      priceFrom: 535000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "거리뷰", "욕조"]
    },
    {
      id: "room2-4d",
      name: "디럭스 시티뷰",
      bedType: "퀸 베드 1개",
      capacity: "성인 2명",
      size: "30㎡",
      price: 45000,
      priceFrom: 530000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room2-4e",
      name: "디럭스 프리미엄",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "33㎡",
      price: 55000,
      priceFrom: 545000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"]
    },
    {
      id: "room2-5",
      name: "주니어 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "42㎡",
      price: 80000,
      priceFrom: 580000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"]
    },
    {
      id: "room2-5b",
      name: "이그제큐티브 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "48㎡",
      price: 100000,
      priceFrom: 600000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소"]
    },
    {
      id: "room2-5c",
      name: "그랜드 스위트",
      bedType: "킹 베드 1개 + 소파베드",
      capacity: "성인 2명 + 어린이 2명",
      size: "55㎡",
      price: 120000,
      priceFrom: 620000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소", "거실"]
    },
    {
      id: "room2-5d",
      name: "로얄 스위트",
      bedType: "킹 베드 2개",
      capacity: "성인 4명",
      size: "65㎡",
      price: 150000,
      priceFrom: 650000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소", "거실", "발코니"]
    },
    {
      id: "room2-5e",
      name: "펜트하우스 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "60㎡",
      price: 180000,
      priceFrom: 680000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "파노라마뷰", "욕조", "네스프레소", "거실", "발코니"]
    }
  ],
  "hotel3": [
    {
      id: "room3-0a",
      name: "디럭스 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "32㎡",
      price: 0,
      priceFrom: 1100000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰"]
    },
    {
      id: "room3-0b",
      name: "디럭스 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "34㎡",
      price: 50000,
      priceFrom: 1150000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰"]
    },
    {
      id: "room3-0c",
      name: "디럭스 킹룸",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "38㎡",
      price: 80000,
      priceFrom: 1180000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰", "욕조"]
    },
    {
      id: "room3-0d",
      name: "디럭스 시티뷰",
      bedType: "퀸 베드 1개",
      capacity: "성인 2명",
      size: "36㎡",
      price: 60000,
      priceFrom: 1160000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room3-0e",
      name: "디럭스 프리미엄",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "40㎡",
      price: 100000,
      priceFrom: 1200000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰", "욕조", "네스프레소"]
    },
    {
      id: "room3-1",
      name: "디럭스 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "55㎡",
      price: 0,
      priceFrom: 1200000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰", "욕조", "네스프레소"]
    },
    {
      id: "room3-2",
      name: "프레스티지 스위트",
      bedType: "킹 베드 1개 + 소파베드",
      capacity: "성인 2명 + 어린이 2명",
      size: "75㎡",
      price: 200000,
      priceFrom: 1400000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰", "욕조", "네스프레소", "거실", "발코니"]
    },
    {
      id: "room3-3",
      name: "로얄 펜트하우스",
      bedType: "킹 베드 2개",
      capacity: "성인 4명",
      size: "120㎡",
      price: 500000,
      priceFrom: 1700000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰", "욕조", "네스프레소", "거실", "발코니", "주방", "다이닝룸"]
    },
    {
      id: "room3-3b",
      name: "그랜드 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "65㎡",
      price: 150000,
      priceFrom: 1300000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰", "욕조", "네스프레소", "거실"]
    },
    {
      id: "room3-3c",
      name: "시그니처 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "58㎡",
      price: 80000,
      priceFrom: 1250000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "에펠탑뷰", "욕조", "네스프레소"]
    }
  ],
  // FIT 패키지용 룸타입
  "fit1": [
    {
      id: "room1-1",
      name: "슈페리어 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "25㎡",
      price: 0,
      priceFrom: 680000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연"]
    },
    {
      id: "room1-1b",
      name: "슈페리어 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "26㎡",
      price: 20000,
      priceFrom: 700000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연"]
    },
    {
      id: "room1-1c",
      name: "슈페리어 킹룸",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "28㎡",
      price: 30000,
      priceFrom: 710000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room1-1d",
      name: "슈페리어 시티뷰",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "27㎡",
      price: 40000,
      priceFrom: 720000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room1-1e",
      name: "슈페리어 디럭스",
      bedType: "퀸 베드 1개",
      capacity: "성인 2명",
      size: "30㎡",
      price: 50000,
      priceFrom: 730000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"]
    },
    {
      id: "room1-2",
      name: "디럭스 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "28㎡",
      price: 50000,
      priceFrom: 730000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room1-2b",
      name: "디럭스 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "30㎡",
      price: 55000,
      priceFrom: 740000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room1-2c",
      name: "디럭스 킹룸",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "32㎡",
      price: 60000,
      priceFrom: 750000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"]
    },
    {
      id: "room1-2d",
      name: "디럭스 시티뷰",
      bedType: "퀸 베드 1개",
      capacity: "성인 2명",
      size: "31㎡",
      price: 58000,
      priceFrom: 745000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room1-2e",
      name: "디럭스 프리미엄",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "35㎡",
      price: 70000,
      priceFrom: 760000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소"]
    },
    {
      id: "room1-3",
      name: "이그제큐티브 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "45㎡",
      price: 150000,
      priceFrom: 830000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소"]
    },
    {
      id: "room1-3b",
      name: "주니어 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "42㎡",
      price: 120000,
      priceFrom: 800000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"]
    },
    {
      id: "room1-3c",
      name: "그랜드 스위트",
      bedType: "킹 베드 1개 + 소파베드",
      capacity: "성인 2명 + 어린이 2명",
      size: "55㎡",
      price: 200000,
      priceFrom: 880000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소", "거실"]
    },
    {
      id: "room1-3d",
      name: "로얄 스위트",
      bedType: "킹 베드 2개",
      capacity: "성인 4명",
      size: "70㎡",
      price: 280000,
      priceFrom: 950000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소", "거실", "발코니"]
    },
    {
      id: "room1-3e",
      name: "펜트하우스 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "65㎡",
      price: 250000,
      priceFrom: 920000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "파노라마뷰", "욕조", "네스프레소", "거실", "발코니"]
    }
  ],
  "fit2": [
    {
      id: "room2-1",
      name: "스탠다드 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "20㎡",
      price: 0,
      priceFrom: 420000,
      amenities: ["무료 Wi-Fi", "에어컨", "금연"]
    },
    {
      id: "room2-2",
      name: "모더레이트 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "24㎡",
      price: 30000,
      priceFrom: 450000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room2-3",
      name: "디럭스 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "28㎡",
      price: 35000,
      priceFrom: 480000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room2-3b",
      name: "디럭스 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "27㎡",
      price: 32000,
      priceFrom: 475000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연"]
    },
    {
      id: "room2-3c",
      name: "디럭스 킹룸",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "30㎡",
      price: 40000,
      priceFrom: 490000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"]
    },
    {
      id: "room2-3d",
      name: "디럭스 시티뷰",
      bedType: "퀸 베드 1개",
      capacity: "성인 2명",
      size: "29㎡",
      price: 38000,
      priceFrom: 485000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰"]
    },
    {
      id: "room2-3e",
      name: "디럭스 프리미엄",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "32㎡",
      price: 45000,
      priceFrom: 500000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"]
    },
    {
      id: "room2-4",
      name: "주니어 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "40㎡",
      price: 60000,
      priceFrom: 540000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조"]
    },
    {
      id: "room2-4b",
      name: "이그제큐티브 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "45㎡",
      price: 80000,
      priceFrom: 560000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소"]
    },
    {
      id: "room2-4c",
      name: "그랜드 스위트",
      bedType: "킹 베드 1개 + 소파베드",
      capacity: "성인 2명 + 어린이 2명",
      size: "52㎡",
      price: 100000,
      priceFrom: 580000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소", "거실"]
    },
    {
      id: "room2-4d",
      name: "로얄 스위트",
      bedType: "킹 베드 2개",
      capacity: "성인 4명",
      size: "60㎡",
      price: 120000,
      priceFrom: 600000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "시티뷰", "욕조", "네스프레소", "거실", "발코니"]
    },
    {
      id: "room2-4e",
      name: "펜트하우스 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "55㎡",
      price: 110000,
      priceFrom: 590000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "파노라마뷰", "욕조", "네스프레소", "거실", "발코니"]
    }
  ],
  "fit3": [
    {
      id: "room3-0a",
      name: "디럭스 트윈룸",
      bedType: "싱글 베드 2개",
      capacity: "성인 2명",
      size: "35㎡",
      price: 0,
      priceFrom: 900000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "가든뷰"]
    },
    {
      id: "room3-0b",
      name: "디럭스 더블룸",
      bedType: "더블 베드 1개",
      capacity: "성인 2명",
      size: "38㎡",
      price: 50000,
      priceFrom: 930000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "가든뷰"]
    },
    {
      id: "room3-0c",
      name: "디럭스 킹룸",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "42㎡",
      price: 80000,
      priceFrom: 950000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "가든뷰", "욕조"]
    },
    {
      id: "room3-0d",
      name: "디럭스 오션뷰",
      bedType: "퀸 베드 1개",
      capacity: "성인 2명",
      size: "40㎡",
      price: 60000,
      priceFrom: 940000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "오션뷰"]
    },
    {
      id: "room3-0e",
      name: "디럭스 프리미엄",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "45㎡",
      price: 100000,
      priceFrom: 970000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "오션뷰", "욕조", "네스프레소"]
    },
    {
      id: "room3-1",
      name: "프라이빗 풀빌라",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "80㎡",
      price: 0,
      priceFrom: 980000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "프라이빗 풀", "가든뷰", "야외 샤워", "욕조"]
    },
    {
      id: "room3-2",
      name: "디럭스 풀빌라",
      bedType: "킹 베드 1개 + 소파베드",
      capacity: "성인 2명 + 어린이 2명",
      size: "120㎡",
      price: 200000,
      priceFrom: 1180000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "프라이빗 풀", "오션뷰", "야외 샤워", "욕조", "거실", "주방"]
    },
    {
      id: "room3-2b",
      name: "그랜드 풀빌라",
      bedType: "킹 베드 1개",
      capacity: "성인 2명 + 어린이 1명",
      size: "100㎡",
      price: 150000,
      priceFrom: 1080000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "프라이빗 풀", "오션뷰", "욕조", "거실"]
    },
    {
      id: "room3-2c",
      name: "로얄 풀빌라",
      bedType: "킹 베드 2개",
      capacity: "성인 4명",
      size: "140㎡",
      price: 300000,
      priceFrom: 1280000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "프라이빗 풀", "오션뷰", "야외 샤워", "욕조", "거실", "주방", "발코니"]
    },
    {
      id: "room3-2d",
      name: "시그니처 스위트",
      bedType: "킹 베드 1개",
      capacity: "성인 2명",
      size: "65㎡",
      price: 120000,
      priceFrom: 1020000,
      amenities: ["무료 Wi-Fi", "에어컨", "미니바", "금연", "오션뷰", "욕조", "네스프레소", "거실"]
    }
  ]
};

type Step =
  | "main"
  | "initial"
  | "preference"
  | "packages"
  | "detail"
  | "comparison"
  | "availability"
  | "booking"
  | "payment"
  | "confirmed"
  | "fit-search"
  | "fit-packages"
  | "fit-activities"
  | "fit-summary";

interface UserPersona {
  companion: string;
  hotelGrade: string;
  destination: string;
  month: string;
  productType: "package" | "fit-combo" | "fit-flight" | "fit-hotel";
  budget: string;
  theme: string;
}

const fitCompletionProposal: { type: "bot"; content: React.ReactNode } = {
  type: "bot",
  content: (
    <div className="space-y-2">
      <p className="text-[14px] text-[#111] leading-[1.6]">
        완벽한 자유여행이 되기 위해 H-AI가 아래를 도와드릴 수 있습니다.
      </p>
      <ul className="space-y-1.5 text-[14px] text-[#444]">
        <li>• AI 추천 일정 만들기</li>
        <li>• 맞춤 준비 체크리스트 생성 (비자, 현지 필수앱, 입국 서류 등)</li>
        <li>• 환율 기반 AI 예산 뽑아보기</li>
      </ul>
      <p className="text-[14px] text-[#111] pt-1">어떤 걸 도와드릴까요?</p>
    </div>
  ),
};

export default function App() {
  const [step, setStep] = useState<Step>("main");
  const [messages, setMessages] = useState<Array<{ type: "user" | "bot"; content: React.ReactNode }>>([]);
  const [showPreferenceInput, setShowPreferenceInput] = useState(false);
  const [recommendedPackages, setRecommendedPackages] = useState<PackageData[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [comparisonPackages, setComparisonPackages] = useState<PackageData[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPackageBookingSheet, setShowPackageBookingSheet] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [showFitHotelComplete, setShowFitHotelComplete] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [bookingNumber, setBookingNumber] = useState("");

  // 패키지 및 FIT 인터랙션 메시지 상태
  const [packageMessages, setPackageMessages] = useState<Array<{ type: "user" | "bot"; content: React.ReactNode }>>([]);
  const recommendedPackagesRegionRef = useRef<HTMLDivElement>(null);
  const [fitMessages, setFitMessages] = useState<Array<{ type: "user" | "bot"; content: React.ReactNode }>>([]);
  /** 패키지 조회 구분: 'package-only' = 직접 검색→패키지 (상품 1,2,3 모두 패키지) | 'recommended-mix' = 추천 검색 (상품 1,2 패키지 + 3 항공+호텔) */
  const [packageSearchMode, setPackageSearchMode] = useState<"package-only" | "recommended-mix" | null>(null);

  // 자유여행(FIT) 관련 상태
  const [travelType, setTravelType] = useState<"package" | "fit" | null>(null);
  /** 추천 검색하기로 열었을 때 true → 인원 UI를 자유여행처럼 아동만+나이 선택 적용 */
  const [isPersonaRecommendFlow, setIsPersonaRecommendFlow] = useState(false);
  const [fitPackages, setFitPackages] = useState<FITPackageData[]>([]);
  const [selectedFitPackage, setSelectedFitPackage] = useState<FITPackageData | null>(null);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [fitTotalPrice, setFitTotalPrice] = useState(0);
  const [fitSearchMode, setFitSearchMode] = useState<'combo' | 'flight' | 'hotel'>('combo');
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [showHotelDetail, setShowHotelDetail] = useState(false);
  const [showFlightDetail, setShowFlightDetail] = useState(false);
  const [showFlightChangeSheet, setShowFlightChangeSheet] = useState(false);
  const [flightSheetStep, setFlightSheetStep] = useState<FlightSheetStep | null>(null);
  const [showPaymentConditionSheet, setShowPaymentConditionSheet] = useState(false);
  const [paymentConditionDiff, setPaymentConditionDiff] = useState(0);
  const [paymentConditionCardName, setPaymentConditionCardName] = useState("삼성 iD GLOBAL 카드");
  const [flightCompleteIsPayLater, setFlightCompleteIsPayLater] = useState(false);
  const [flightReservationNumber, setFlightReservationNumber] = useState("HA2500092453");
  const [showFitDetail, setShowFitDetail] = useState(false);

  // FIT/항공/호텔 비교 관련 상태
  const [comparisonFitPackages, setComparisonFitPackages] = useState<FITPackageData[]>([]);
  const [showFitComparison, setShowFitComparison] = useState(false);
  const [comparisonFlights, setComparisonFlights] = useState<FlightData[]>([]);
  const [showFlightComparison, setShowFlightComparison] = useState(false);
  const [comparisonHotels, setComparisonHotels] = useState<HotelData[]>([]);
  const [showHotelComparison, setShowHotelComparison] = useState(false);

  // 룸타입 선택 관련 상태
  const [showRoomTypeSelector, setShowRoomTypeSelector] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [currentHotelForRoomSelection, setCurrentHotelForRoomSelection] = useState<string>("");
  /** 'booking': 예약하기로 연 경우(선택 후 예약 단계 이동), 'change-room': 객실 변경으로 연 경우(선택만 반영) */
  const [roomSelectorSource, setRoomSelectorSource] = useState<"booking" | "change-room" | null>(null);
  const [extractedDestination, setExtractedDestination] = useState("");

  // 사용자 페르소나 (개인화 추천용)
  const [userPersona] = useState<UserPersona | null>({
    companion: "아이 동반",
    hotelGrade: "4성급",
    destination: "도쿄",
    month: "9월",
    productType: "package",
    budget: "100-200만원",
    theme: "문화탐방",
  });


  // 초기 메시지 표시
  const showInitialMessage = () => {
    setMessages([]);
  };

  // 채팅 메시지 전송
  const handleSendMessage = (message: string) => {
    const userMessage = { type: "user" as const, content: message };
    if (step === "packages") setPackageMessages(prev => [...prev, userMessage]);
    else if (step === "fit-packages") setFitMessages(prev => [...prev, userMessage]);
    else setMessages(prev => [...prev, userMessage]);

    // 단순 의도 추출 (Smart-Fill)
    const cities = ["발리", "파리", "도쿄", "산토리니", "몰디브"];
    const foundCity = cities.find(city => message.includes(city));
    if (foundCity) {
      setExtractedDestination(foundCity);
    }

    // 현재 step 스냅샷 (setTimeout 클로저 안에서 올바른 값 사용)
    const currentStep = step;

    // step에 따라 올바른 메시지 배열에 봇 응답을 추가하는 헬퍼
    const addBotMessage = (content: React.ReactNode) => {
      const botMsg = { type: "bot" as const, content };
      if (currentStep === "packages") setPackageMessages(prev => [...prev, botMsg]);
      else if (currentStep === "fit-packages") setFitMessages(prev => [...prev, botMsg]);
      else setMessages(prev => [...prev, botMsg]);
    };

    // 메시지 분석 및 응답
    setTimeout(() => {
      if (message.includes("여행") || message.includes("패키지") || message.includes("추천")) {
        if (userPersona) {
          // 페르소나 기반 개인화 메시지
          const productTypeLabel = userPersona.productType === "package" ? "패키지 여행" : "자유여행";
          const personaMessage = `${userPersona.companion}과 가기 좋은 ${userPersona.hotelGrade} 호텔의 ${userPersona.destination} ${userPersona.month} ${productTypeLabel} 찾고 계시죠?`;

          addBotMessage(
            <div>
              <p className="text-[14px] text-[#111] leading-[1.5] mb-1">
                {personaMessage}
              </p>
              <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                아니면 새로운 여행지와 테마로 검색하시겠어요?
              </p>
              <DismissableButtons buttons={[
                { label: "추천 검색하기", onClick: handlePersonaSearch, className: "flex-1 py-3 bg-gradient-to-r from-[#6976ff] to-[#7b3ff2] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:opacity-90 transition-opacity" },
                { label: "직접 검색하기", onClick: handleDirectSearch, className: "flex-1 py-3 border border-[#e5e7eb] text-[#111] rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f5f5f5] transition-colors" }
              ]} />
            </div>
          );
        } else {
          // 페르소나 없을 때 → 기존 플로우 (자유여행/패키지 선택)
          addBotMessage(
            <div>
              <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                자유여행을 선호하세요? 아니면 편한 패키지 상품을 추천해드릴까요?
              </p>
              <DismissableButtons buttons={[
                { label: "자유여행", onClick: () => handleTravelTypeSelect("fit"), className: "flex-1 py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors" },
                { label: "패키지 상품", onClick: () => handleTravelTypeSelect("package"), className: "flex-1 py-3 bg-[#3780ff] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2563eb] transition-colors" }
              ]} />
            </div>
          );
        }
      } else if (message.includes("비교")) {
        handleComparePackages();
      } else if (message.includes("자유여행")) {
        handleTravelTypeSelect("fit");
      } else {
        const responseMessage = foundCity
          ? `네, ${foundCity} 여행을 찾으시는군요! 아래 정보를 확인해 주시면 최적의 상품을 추천해 드릴게요.`
          : "더 자세한 정보가 필요하시면 구체적으로 질문해 주세요!";

        addBotMessage(responseMessage);
      }
    }, 500);
  };

  // 페르소나 기반 추천 검색
  const handlePersonaSearch = () => {
    if (!userPersona) return;

    setMessages(prev => [...prev, { type: "user", content: "추천 검색하기" }]);
    setIsPersonaRecommendFlow(true);

    if (userPersona.productType === "package") {
      setTravelType("package");
    } else {
      setTravelType("fit");
      const modeMap: Record<string, 'combo' | 'flight' | 'hotel'> = {
        "fit-combo": "combo",
        "fit-flight": "flight",
        "fit-hotel": "hotel"
      };
      setFitSearchMode(modeMap[userPersona.productType]);
    }

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: "bot",
        content: "이전 검색 기록을 기반으로 정보를 미리 채워드렸어요. 확인 후 검색해주세요!"
      }]);
      setExtractedDestination(userPersona.destination);
      setShowPreferenceInput(true);
      setStep("preference");
    }, 500);
  };

  // 직접 검색하기
  const handleDirectSearch = () => {
    setMessages(prev => [...prev, { type: "user", content: "직접 검색하기" }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: "bot",
        content: (
          <div>
            <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
              자유여행을 선호하세요? 아니면 편한 패키지 상품을 추천해드릴까요?
            </p>
            <DismissableButtons buttons={[
              { label: "자유여행", onClick: () => handleTravelTypeSelect("fit"), className: "flex-1 py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors" },
              { label: "패키지 상품", onClick: () => handleTravelTypeSelect("package"), className: "flex-1 py-3 bg-[#3780ff] text-white rounded-[12px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2563eb] transition-colors" }
            ]} />
          </div>
        )
      }]);
    }, 500);
  };

  // 여행 타입 선택 핸들러
  const handleTravelTypeSelect = (type: "package" | "fit") => {
    setTravelType(type);
    setIsPersonaRecommendFlow(false);
    setMessages(prev => [...prev, {
      type: "user",
      content: type === "fit" ? "자유여행" : "패키지 상품"
    }]);

    if (type === "package") {
      // 패키지 플로우
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "bot",
          content: "원하시는 여행 정보를 입력해 주시면 맞춤 패키지를 추천해 드릴게요! 😊"
        }]);
        setShowPreferenceInput(true);
        setStep("preference");
      }, 500);
    } else {
      // 자유여행 플로우 - 여행 정보 입력
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "bot",
          content: "여행지와 예산을 알려주시면 최적의 항공+호텔 조합을 찾아드릴게요! ✈️"
        }]);
        setShowPreferenceInput(true);
        setStep("preference");
      }, 500);
    }
  };

  // 선호도 제출
  const handlePreferenceSubmit = (data: {
    theme: string;
    budget: string;
    destination: string;
    searchMode?: 'combo' | 'flight' | 'hotel';
    travelers?: number;
    travelPeriodDisplay?: string;
    adults?: number;
    children?: number;
    infants?: number;
    childAges?: number[];
  }) => {
    setShowPreferenceInput(false);
    setIsPersonaRecommendFlow(false);

    const travelersText = data.travelers != null
      ? (data.adults != null && data.children != null && data.infants != null)
        ? `성인 ${data.adults}, 아동 ${data.children}, 유아 ${data.infants}`
        : `${data.travelers}명`
      : undefined;

    if (travelType === "fit") {
      // 자유여행 플로우: 선택한 인원만 노출, 유아 제외
      const mode = data.searchMode || 'combo';
      setFitSearchMode(mode);

      const destText = data.destination;
      const budgetText = data.budget;
      const fitTravelersText =
        data.adults != null
          ? `성인 ${data.adults}` + (data.children && data.children > 0 ? `, 아동 ${data.children}` : "")
          : undefined;

      // 검색 모드에 따라 추론 단계 선택
      const reasoningKey = mode === 'combo' ? 'FIT_SEARCH_COMBO' : mode === 'flight' ? 'FIT_SEARCH_FLIGHT' : 'FIT_SEARCH_HOTEL';
      const completedLabel = mode === 'combo' ? '조합 검색 완료' : mode === 'flight' ? '항공편 검색 완료' : '호텔 검색 완료';

      const fitUserParts = [destText, budgetText, data.travelPeriodDisplay, fitTravelersText].filter(Boolean);
      setMessages(prev => [...prev,
      {
        type: "user",
        content: fitUserParts.length > 0 ? fitUserParts.join(' / ') : (mode === 'combo' ? '항공+호텔 조합 검색하기' : mode === 'flight' ? '항공만 검색하기' : '호텔만 검색하기')
      },
      {
        type: "bot",
        content: (
          <AgentReasoningBlock
            steps={REASONING_STEPS[reasoningKey]}
            completedLabel={completedLabel}
            onAllStepsComplete={() => {
              if (mode === 'combo') {
                const fitN = PRODUCT_COUNTS.fitCombo.fit;
                setFitPackages(mockFITPackages.slice(0, fitN));
                const comboTotalCount = fitN + PRODUCT_COUNTS.fitCombo.airtel;
                const comboParts = [
                  destText,
                  budgetText && `${budgetText} 예산`,
                ].filter(Boolean);
                const comboMsg = comboParts.length > 0
                  ? `${comboParts.join(', ')}에 맞는 최적의 항공+호텔 조합을 찾았습니다! 총 ${comboTotalCount}개의 추천 조합을 확인해보세요.`
                  : `최적의 항공+호텔 조합을 찾았습니다! 총 ${comboTotalCount}개의 추천 조합을 확인해보세요.`;
                setMessages(prev => [...prev, {
                  type: "bot",
                  content: comboMsg
                }]);
              } else if (mode === 'flight') {
                const flightN = PRODUCT_COUNTS.fitFlight;
                setFlights(mockFlights.slice(0, flightN));
                const flightMsg = destText
                  ? `${destText}행 항공편을 찾았습니다! 총 ${flightN}개의 추천 항공편을 확인해보세요.`
                  : `항공편을 찾았습니다! 총 ${flightN}개의 추천 항공편을 확인해보세요.`;
                setMessages(prev => [...prev, {
                  type: "bot",
                  content: flightMsg
                }]);
              } else {
                const hotelN = PRODUCT_COUNTS.fitHotel;
                setHotels(mockHotels.slice(0, hotelN));
                const hotelMsg = destText
                  ? `${destText}의 호텔을 찾았습니다! 총 ${hotelN}개의 추천 호텔을 확인해보세요.`
                  : `호텔을 찾았습니다! 총 ${hotelN}개의 추천 호텔을 확인해보세요.`;
                setMessages(prev => [...prev, {
                  type: "bot",
                  content: hotelMsg
                }]);
              }
              setStep("fit-packages");
            }}
          />
        )
      }
      ]);
    } else {
      // 패키지 플로우
      const destText = data.destination;
      const themeText = data.theme;
      const budgetText = data.budget;
      const isPackageOnly = !isPersonaRecommendFlow;
      setPackageSearchMode(isPersonaRecommendFlow ? "recommended-mix" : "package-only");

      const packageUserParts = [destText, themeText, budgetText, data.travelPeriodDisplay, travelersText].filter(Boolean);
      setMessages(prev => [...prev,
      {
        type: "user",
        content: packageUserParts.length > 0 ? packageUserParts.join(' / ') : '상품 검색하기'
      },
      {
        type: "bot",
        content: (
          <AgentReasoningBlock
            steps={REASONING_STEPS.PACKAGE_SEARCH}
            completedLabel="상품 검색 완료"
            onAllStepsComplete={() => {
              // 예산에 따른 패키지 필터링
              let filtered = mockPackages;
              if (budgetText === "100만원 이하") {
                filtered = mockPackages.filter(p => p.price < 1500000);
              } else if (budgetText === "100-200만원") {
                filtered = mockPackages.filter(p => p.price >= 1000000 && p.price <= 2000000);
              } else if (budgetText === "200-300만원") {
                filtered = mockPackages.filter(p => p.price >= 2000000 && p.price <= 3000000);
              }

              if (isPackageOnly) {
                const n = PRODUCT_COUNTS.directPackage;
                const recommended = filtered.slice(0, n);
                const toShow = recommended.length >= n
                  ? recommended
                  : [
                      ...recommended,
                      ...mockPackages.filter(p => !recommended.some(r => r.id === p.id)).slice(0, n - recommended.length)
                    ];
                setRecommendedPackages(toShow);
              }
              // 추천검색 모드는 고정 mock 데이터(FIT+에어텔+호텔)를 렌더링하므로 별도 패키지 세팅 불필요
              const count = isPackageOnly ? PRODUCT_COUNTS.directPackage : PRODUCT_COUNTS.recommended;
              const packageResultParts = [
                destText && `${destText}`,
                themeText && `${themeText} 테마`,
                budgetText && `${budgetText} 예산`,
              ].filter(Boolean);
              const packageResultMsg = packageResultParts.length > 0
                ? `${packageResultParts.join(', ')}에 맞는 상품을 찾았습니다! 총 ${count}개의 추천 상품을 확인해보세요.`
                : `추천 상품을 찾았습니다! 총 ${count}개의 상품을 확인해보세요.`;
              setMessages(prev => [...prev, {
                type: "bot",
                content: packageResultMsg
              }]);
              setStep("packages");
            }}
          />
        )
      }
      ]);
    }
  };

  /** 인라인 상세의「추천 상품 목록가기」— 상세 메시지 제거 후 상품 카드 영역으로 스크롤 */
  const focusRecommendedPackagesList = () => {
    setPackageMessages([]);
    window.requestAnimationFrame(() => {
      const el = recommendedPackagesRegionRef.current;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.focus({ preventScroll: true });
        return;
      }
      const root = document.querySelector("[data-sheet-scroll-root]");
      root?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  // 패키지 상세보기 — 채팅창 인라인으로 렌더링
  const handlePackageClick = (pkg: PackageData) => {
    setPackageMessages((prev) => [
      ...prev,
      { type: "user", content: "상세 정보 보여줘" },
      {
        type: "bot",
        content: (
          <PackageInlineDetail
            package={pkg}
            onGoBack={focusRecommendedPackagesList}
            onBooking={() => handleBooking(pkg)}
          />
        ),
      },
    ]);
  };

  // 패키지 비교 (직접검색 전용) — 채팅창 인라인으로 렌더링
  const handleComparePackages = () => {
    if (recommendedPackages.length >= PRODUCT_COUNTS.directPackage) {
      setPackageMessages(() => [
        { type: "user", content: "상품 비교해주세요" },
        {
          type: "bot",
          content: (
            <AgentReasoningBlock
              steps={REASONING_STEPS.COMPARISON}
              completedLabel="비교 분석 완료"
              onAllStepsComplete={() => {
                const maxCompare = PRODUCT_COUNTS.directPackage;
                const base = recommendedPackages.slice(0, maxCompare);
                const ids = new Set(base.map((p) => p.id));
                const need = maxCompare - base.length;
                const filled =
                  need > 0
                    ? [...base, ...mockPackages.filter((p) => !ids.has(p.id)).slice(0, need)]
                    : base;
                setComparisonPackages(filled);
                setPackageMessages((prev) => [
                  ...prev,
                  {
                    type: "bot",
                    content: (
                      <PackageComparisonInline
                        packages={filled}
                        onSelect={(pkg) => {
                          setPackageMessages([]);
                          handlePackageClick(pkg);
                        }}
                        onBack={() => setPackageMessages([])}
                      />
                    ),
                  },
                ]);
                setTimeout(() => {
                  const root = document.querySelector("[data-sheet-scroll-root]");
                  root?.scrollTo({ top: root.scrollHeight, behavior: "smooth" });
                }, 50);
              }}
            />
          ),
        },
      ]);
    }
  };

  // 추천 다시받기 (직접검색 패키지 3개 / 추천검색 고정 3개)
  const handleReRecommend = () => {
    const n = PRODUCT_COUNTS.directPackage;
    const currentIds = new Set(recommendedPackages.map(p => p.id));
    const remaining = mockPackages.filter(p => !currentIds.has(p.id));

    let newRecommendations: PackageData[];
    if (remaining.length >= n) {
      newRecommendations = remaining.slice(0, n);
    } else {
      const shuffled = [...mockPackages].sort(() => Math.random() - 0.5);
      newRecommendations = shuffled.slice(0, n);
    }

    setRecommendedPackages([]);
    setPackageMessages([]);
    setShowComparison(false);
    setComparisonPackages([]);

    const totalShow = packageSearchMode === "package-only" ? n : PRODUCT_COUNTS.recommended;
    setMessages(prev => [...prev,
      { type: "user", content: "다른 상품 추천해주세요" },
      {
        type: "bot",
        content: (
          <AgentReasoningBlock
            steps={REASONING_STEPS.PACKAGE_SEARCH}
            completedLabel="새로운 상품 검색 완료"
            onAllStepsComplete={() => {
              setRecommendedPackages(newRecommendations);
              setMessages(prev => [...prev, {
                type: "bot",
                content: `다른 추천 상품을 찾았습니다! 총 ${totalShow}개의 추천 상품을 확인해보세요.`
              }]);
            }}
          />
        )
      }
    ]);
  };

  // FIT 콤보 비교
  const handleFitCompare = () => {
    if (fitPackages.length >= 2) {
      setFitMessages([
        { type: "user", content: "조합 비교해주세요" },
        {
          type: "bot",
          content: (
            <AgentReasoningBlock
              steps={REASONING_STEPS.COMPARISON}
              completedLabel="비교 분석 완료"
              onAllStepsComplete={() => {
                setComparisonFitPackages(fitPackages.slice(0, PRODUCT_COUNTS.fitCombo.fit));
                setShowFitComparison(true);
                setFitMessages(prev => [...prev, {
                  type: "bot",
                  content: "항공+호텔 조합의 가격, 항공사, 호텔등급 등을 비교해 드립니다!"
                }]);
              }}
            />
          )
        }
      ]);
    }
  };

  // 항공편 비교
  const handleFlightCompare = () => {
    if (flights.length >= 2) {
      setFitMessages([
        { type: "user", content: "항공편 비교해주세요" },
        {
          type: "bot",
          content: (
            <AgentReasoningBlock
              steps={REASONING_STEPS.COMPARISON}
              completedLabel="비교 분석 완료"
              onAllStepsComplete={() => {
                setComparisonFlights(flights.slice(0, PRODUCT_COUNTS.fitFlight));
                setShowFlightComparison(true);
                setFitMessages(prev => [...prev, {
                  type: "bot",
                  content: "항공편의 가격, 항공사, 비행시간 등을 비교해 드립니다!"
                }]);
              }}
            />
          )
        }
      ]);
    }
  };

  // 호텔 비교
  const handleHotelCompare = () => {
    if (hotels.length >= 2) {
      setFitMessages([
        { type: "user", content: "호텔 비교해주세요" },
        {
          type: "bot",
          content: (
            <AgentReasoningBlock
              steps={REASONING_STEPS.COMPARISON}
              completedLabel="비교 분석 완료"
              onAllStepsComplete={() => {
                setComparisonHotels(hotels.slice(0, PRODUCT_COUNTS.fitHotel));
                setShowHotelComparison(true);
                setFitMessages(prev => [...prev, {
                  type: "bot",
                  content: "호텔의 가격, 등급, 위치 등을 비교해 드립니다!"
                }]);
              }}
            />
          )
        }
      ]);
    }
  };

  // FIT 콤보 추천 다시받기 (FIT 2개 + 에어텔 1개 유지)
  const handleFitReRecommend = () => {
    const shuffled = [...mockFITPackages].sort(() => Math.random() - 0.5);
    const newRecommendations = shuffled.slice(0, PRODUCT_COUNTS.fitCombo.fit);

    setFitPackages([]);
    setFitMessages([]);
    setShowFitComparison(false);
    setComparisonFitPackages([]);

    setMessages(prev => [...prev,
      { type: "user", content: "다른 조합 추천해주세요" },
      {
        type: "bot",
        content: (
          <AgentReasoningBlock
            steps={REASONING_STEPS.FIT_SEARCH_COMBO}
            completedLabel="새로운 조합 검색 완료"
            onAllStepsComplete={() => {
              setFitPackages(newRecommendations);
              setMessages(prev => [...prev, {
                type: "bot",
                content: `다른 추천 조합 ${newRecommendations.length}개를 찾았습니다! 확인해보세요.`
              }]);
            }}
          />
        )
      }
    ]);
  };

  // 항공편 추천 다시받기
  const handleFlightReRecommend = () => {
    const shuffled = [...mockFlights].sort(() => Math.random() - 0.5);
    const newRecommendations = shuffled.slice(0, PRODUCT_COUNTS.fitFlight);

    setFlights([]);
    setFitMessages([]);
    setShowFlightComparison(false);
    setComparisonFlights([]);

    setMessages(prev => [...prev,
      { type: "user", content: "다른 항공편 추천해주세요" },
      {
        type: "bot",
        content: (
          <AgentReasoningBlock
            steps={REASONING_STEPS.FIT_SEARCH_FLIGHT}
            completedLabel="새로운 항공편 검색 완료"
            onAllStepsComplete={() => {
              setFlights(newRecommendations);
              setMessages(prev => [...prev, {
                type: "bot",
                content: `다른 추천 항공편 ${newRecommendations.length}개를 찾았습니다! 확인해보세요.`
              }]);
            }}
          />
        )
      }
    ]);
  };

  // 호텔 추천 다시받기
  const handleHotelReRecommend = () => {
    const shuffled = [...mockHotels].sort(() => Math.random() - 0.5);
    const newRecommendations = shuffled.slice(0, PRODUCT_COUNTS.fitHotel);

    setHotels([]);
    setFitMessages([]);
    setShowHotelComparison(false);
    setComparisonHotels([]);

    setMessages(prev => [...prev,
      { type: "user", content: "다른 호텔 추천해주세요" },
      {
        type: "bot",
        content: (
          <AgentReasoningBlock
            steps={REASONING_STEPS.FIT_SEARCH_HOTEL}
            completedLabel="새로운 호텔 검색 완료"
            onAllStepsComplete={() => {
              setHotels(newRecommendations);
              setMessages(prev => [...prev, {
                type: "bot",
                content: `다른 추천 호텔 ${newRecommendations.length}개를 찾았습니다! 확인해보세요.`
              }]);
            }}
          />
        )
      }
    ]);
  };

  // 예약하기 - 패키지 예약 시 캡처 화면 스타일 바텀시트 표시
  const handleBooking = (pkg: PackageData) => {
    setSelectedPackage(pkg);
    setShowDetail(false);
    setShowComparison(false);
    setShowPackageBookingSheet(true);
    setStep("booking");
  };

  // 자유여행 예약하기 - 바로 룸타입 선택 팝업 표시
  const handleFITBooking = () => {
    if (!selectedFitPackage) return;
    setCurrentHotelForRoomSelection(selectedFitPackage.id);
    setRoomSelectorSource("booking");
    setShowRoomTypeSelector(true);
  };

  // 예약 정보 제출 (FIT/항공/호텔 등 — 결제 모달로 이동)
  const handleBookingSubmit = (data: BookingFormData) => {
    setBookingData(data);
    setShowBookingForm(false);
    setShowPackageBookingSheet(false);
    setMessages(prev => [...prev,
    { type: "user", content: "{패키지 HP12345678} 예약완료" },
    {
      type: "bot",
      content: "예약 정보를 확인했습니다. 결제를 진행해 주세요."
    }
    ]);
    setShowPayment(true);
    setStep("payment");
  };

  // 패키지 예약 시트 전용: 예약 데이터만 저장 후 결제하기 시트는 onRequestPayment로 열기
  const handleBookingSubmitFromSheet = (data: BookingFormData) => {
    setBookingData(data);
    setMessages(prev => [...prev,
      { type: "user", content: "{패키지 HP12345678} 예약완료" },
      { type: "bot", content: "예약 정보를 확인했습니다. 결제를 진행해 주세요." }
    ]);
  };

  // 예약금/총액 버튼 클릭 시 결제하기 바텀시트로 이동
  const handleRequestPayment = (amount: number) => {
    setShowPackageBookingSheet(false);
    setPaymentAmount(amount);
    setShowPaymentSheet(true);
    setStep("payment");
  };

  // 결제 완료
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setShowPaymentSheet(false);
    const confirmationNumber = `HAI${Date.now().toString().slice(-8)}`;
    setBookingNumber(confirmationNumber);

    setMessages(prev => [...prev, {
      type: "bot",
      content: "🎉 결제가 완료되었습니다! 예약이 확정되었습니다."
    }]);

    // 호텔 전용: PaymentSheet 완료 화면만 사용, BookingConfirmation 없이 초기화
    if (selectedHotel && !selectedFitPackage) {
      setShowConfirmation(false);
      setStep("initial");
      setHotels([]);
      setSelectedHotel(null);
      setMessages(prev => [...prev, fitCompletionProposal]);
      return;
    }

    // FIT 조합 호텔: PaymentSheet 완료 화면만 사용, BookingConfirmation 없이 초기화
    if (selectedFitPackage && !selectedPackage) {
      setShowConfirmation(false);
      setShowFitHotelComplete(false);
      setStep("packages");
      setMessages(prev => [...prev, fitCompletionProposal]);
      return;
    }

    setShowConfirmation(true);
    setStep("confirmed");
  };

  // 메인 페이지 → 채팅 전환
  const handleStartFromMain = () => {
    showInitialMessage();
    setStep("initial");
    setTimeout(() => {
      handleSendMessage("상품 추천해줘");
    }, 100);
  };

  // 메인 페이지 렌더
  if (step === "main") {
    return (
      <div className="size-full max-w-[390px] mx-auto relative">
        <MainPage onStartRecommendation={handleStartFromMain} />
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col bg-white max-w-[390px] mx-auto relative">
      <Header onBack={() => setStep("main")} />

      <div className="flex-1 overflow-y-auto px-0 py-4 pb-20" data-sheet-scroll-root>
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            type={msg.type}
            showActions={msg.type === "bot" && index === messages.length - 1 && step === "packages"}
          >
            {msg.content}
          </ChatMessage>
        ))}

        {showPreferenceInput && (
          <PreferenceInput
            onSubmit={handlePreferenceSubmit}
            mode={travelType || "package"}
            personaRecommendFlow={isPersonaRecommendFlow}
            initialDestination={extractedDestination}
            initialBudget={userPersona?.budget}
            initialTheme={userPersona?.theme}
          />
        )}

        {(step === "packages" || step === "booking" || step === "payment" || step === "confirmed")
          && (packageSearchMode === "package-only" ? recommendedPackages.length > 0 : packageSearchMode === "recommended-mix") && (
          <div
            ref={recommendedPackagesRegionRef}
            tabIndex={-1}
            role="region"
            aria-label="추천 상품 목록"
            className="px-5 space-y-4 mt-4 mb-4 scroll-mt-[60px] outline-none focus-visible:ring-2 focus-visible:ring-[#3780ff]/30 focus-visible:ring-offset-2 rounded-lg"
          >
            {packageSearchMode === "package-only" && (
              <div className="space-y-1">
                <h2 className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#3780ff]">H-AI 추천</h2>
                <p className="text-[13px] leading-snug text-[#666]">상품의 자세한 정보도 확인하실 수 있어요.</p>
              </div>
            )}
            {packageSearchMode === "package-only"
              ? recommendedPackages.slice(0, PRODUCT_COUNTS.directPackage).map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    package={pkg}
                    onClick={() => handlePackageClick(pkg)}
                    onBooking={() => handleBooking(pkg)}
                  />
                ))
              : (
                  <>
                    {/* 추천검색: 1번째 항공+호텔 */}
                    <FITPackageCard
                      key={mockFITPackages[0].id}
                      package={mockFITPackages[0]}
                      rank={1}
                      onClick={() => {
                        setSelectedFitPackage(mockFITPackages[0]);
                        setShowFitDetail(true);
                      }}
                      onBooking={() => {
                        setSelectedFitPackage(mockFITPackages[0]);
                        setCurrentHotelForRoomSelection(mockFITPackages[0].id);
                        setRoomSelectorSource("booking");
                        setShowRoomTypeSelector(true);
                      }}
                    />
                    {/* 추천검색: 2번째 에어텔 */}
                    <PackageCard
                      key={airtelPackage.id}
                      package={airtelPackage}
                      onClick={() => handlePackageClick(airtelPackage)}
                      onBooking={() => handleBooking(airtelPackage)}
                    />
                    {/* 추천검색: 3번째 호텔 */}
                    <HotelCard
                      key={mockHotels[0].id}
                      hotel={mockHotels[0]}
                      rank={3}
                      onClick={() => {
                        setSelectedHotel(mockHotels[0]);
                        setShowHotelDetail(true);
                      }}
                      onBooking={() => {
                        setSelectedHotel(mockHotels[0]);
                        setShowHotelDetail(true);
                      }}
                    />
                  </>
                )}
            {step === "packages" && packageSearchMode === "package-only" && recommendedPackages.length >= PRODUCT_COUNTS.directPackage && (
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleComparePackages}
                  className="flex-1 rounded-full border border-[#e5e5e5] bg-white py-3 font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111] transition-colors hover:bg-[#fafafa]"
                >
                  추천상품 비교하기
                </button>
                <button
                  type="button"
                  onClick={handleReRecommend}
                  className="flex-1 rounded-full border border-[#e5e5e5] bg-white py-3 font-['Pretendard:SemiBold',sans-serif] text-[14px] text-[#111] transition-colors hover:bg-[#fafafa]"
                >
                  추천상품 새로고침
                </button>
              </div>
            )}
          </div>
        )}

        {/* 패키지 추천 결과 — H-AI TIP (캡처 UI 정렬) */}
        {step === "packages" &&
          packageSearchMode === "package-only" &&
          recommendedPackages.length > 0 &&
          packageMessages.length === 0 && (
            <div className="mx-5 mb-4">
              <p className="text-[14px] leading-relaxed text-[#111]">
                <span className="mr-1" aria-hidden>
                  💡
                </span>
                <span className="font-['Pretendard:Bold',sans-serif] text-[rgba(55,127,255,1)]">H-AI TIP</span>
                <span className="text-[#444]"> 관련해서 이런 질문도 이어갈 수 있어요.</span>
              </p>
              <ul className="mt-2 space-y-1.5 pl-0.5 text-[14px] text-[#333]">
                <li>• 첫번째 일정을 요약해줘.</li>
                <li>• 부산출발 상품만 추려줘.</li>
              </ul>
            </div>
          )}

        {/* 패키지 인터랙션 메시지 (비교 등) - 카드 리스트 바깥 */}
        {step === "packages" && packageMessages.map((msg, index) => (
          <ChatMessage
            key={`package-${index}`}
            type={msg.type}
          >
            {msg.content}
          </ChatMessage>
        ))}

        {/* 자유여행 FIT 패키지 표시 (항공+호텔 조합) — 1·2번 FIT, 3번 에어텔 */}
        {(step === "fit-packages" || step === "fit-activities" || step === "fit-summary" || step === "booking" || step === "payment" || step === "confirmed") && fitSearchMode === 'combo' && fitPackages.length > 0 && (
          <div className="px-5 space-y-4 mt-4 mb-4">
            {fitPackages.map((pkg, index) => (
              <FITPackageCard
                key={pkg.id}
                package={pkg}
                rank={index + 1}
                onClick={() => {
                  setSelectedFitPackage(pkg);
                  setShowFitDetail(true);
                }}
                onBooking={() => {
                  setSelectedFitPackage(pkg);
                  setCurrentHotelForRoomSelection(pkg.id);
                  setRoomSelectorSource("booking");
                  setShowRoomTypeSelector(true);
                }}
              />
            ))}
            {/* 3번째: 에어텔 상품 (패키지 상세·예약·결제 플로우 동일) */}
            <PackageCard
              key={airtelPackage.id}
              package={airtelPackage}
              onClick={() => handlePackageClick(airtelPackage)}
              onBooking={() => handleBooking(airtelPackage)}
            />
            {step === "fit-packages" && fitPackages.length >= 2 && (
              <div className="flex gap-2">
                <button
                  onClick={handleFitCompare}
                  className="flex-1 py-3 bg-white border-2 border-[#7b3ff2] text-[#7b3ff2] rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f8f4ff] transition-colors"
                >
                  조합 비교하기
                </button>
                <button
                  onClick={handleFitReRecommend}
                  className="flex-1 py-3 bg-white border-2 border-[#e5e7eb] text-[#666] rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f8f9fa] transition-colors"
                >
                  추천 다시받기
                </button>
              </div>
            )}
          </div>
        )}

        {/* 항공편만 표시 */}
        {(step === "fit-packages" || step === "booking" || step === "payment" || step === "confirmed") && fitSearchMode === 'flight' && flights.length > 0 && (
          <div className="px-5 space-y-4 mt-4 mb-4">
            {flights.map((flight, index) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                rank={index + 1}
                onClick={() => {
                  setSelectedFlight(flight);
                  setShowFlightDetail(true);
                }}
                onBooking={() => {
                  setSelectedFlight(flight);
                  setFitTotalPrice(flight.price);
                  setShowPaymentConditionSheet(true);
                }}
              />
            ))}
            {step === "fit-packages" && flights.length >= 2 && (
              <div className="flex gap-2">
                <button
                  onClick={handleFlightCompare}
                  className="flex-1 py-3 bg-white border-2 border-[#7b3ff2] text-[#7b3ff2] rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f8f4ff] transition-colors"
                >
                  항공편 비교하기
                </button>
                <button
                  onClick={handleFlightReRecommend}
                  className="flex-1 py-3 bg-white border-2 border-[#e5e7eb] text-[#666] rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f8f9fa] transition-colors"
                >
                  추천 다시받기
                </button>
              </div>
            )}
          </div>
        )}

        {/* 호텔만 표시 */}
        {(step === "fit-packages" || step === "booking" || step === "payment" || step === "confirmed") && fitSearchMode === 'hotel' && hotels.length > 0 && (
          <div className="px-5 space-y-4 mt-4 mb-4">
            {hotels.map((hotel, index) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                rank={index + 1}
                onClick={() => {
                  setSelectedHotel(hotel);
                  setShowHotelDetail(true);
                }}
                onBooking={() => {
                  setSelectedHotel(hotel);
                  setSelectedFitPackage(null);
                  setSelectedFlight(null);
                  setSelectedPackage(null);
                  setFlightSheetStep(null);
                  setFitTotalPrice(hotel.price);
                  setCurrentHotelForRoomSelection(hotel.id);
                  setRoomSelectorSource("booking");
                  setShowRoomTypeSelector(true);
                }}
              />
            ))}
            {step === "fit-packages" && hotels.length >= 2 && (
              <div className="flex gap-2">
                <button
                  onClick={handleHotelCompare}
                  className="flex-1 py-3 bg-white border-2 border-[#7b3ff2] text-[#7b3ff2] rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f8f4ff] transition-colors"
                >
                  호텔 비교하기
                </button>
                <button
                  onClick={handleHotelReRecommend}
                  className="flex-1 py-3 bg-white border-2 border-[#e5e7eb] text-[#666] rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#f8f9fa] transition-colors"
                >
                  추천 다시받기
                </button>
              </div>
            )}
          </div>
        )}

        {/* 항공+호텔 조합 추천 후 액션 유도 메시지 */}
        {step === "fit-packages" && fitSearchMode === 'combo' && fitPackages.length > 0 && fitMessages.length === 0 && (
          <ChatMessage type="bot">
            마음에 드는 조합이 있으신가요? &apos;직항 여부&apos;, &apos;항공사&apos;, &apos;호텔 등급&apos;, &apos;호텔 위치&apos; 등 원하시는 조건을 더 알려주시면 딱 맞는 조합으로 다시 찾아드릴게요!
          </ChatMessage>
        )}
        {/* 항공 추천 후 액션 유도 메시지 */}
        {step === "fit-packages" && fitSearchMode === 'flight' && flights.length > 0 && fitMessages.length === 0 && (
          <ChatMessage type="bot">
            원하는 항공편을 찾으셨나요? &apos;직항 여부&apos;, &apos;출발 시간대&apos;, &apos;항공사&apos;, &apos;수하물 포함 여부&apos; 등 조건을 알려주시면 더 맞춤형으로 찾아드릴게요!
          </ChatMessage>
        )}
        {/* 호텔 추천 후 액션 유도 메시지 */}
        {step === "fit-packages" && fitSearchMode === 'hotel' && hotels.length > 0 && fitMessages.length === 0 && (
          <ChatMessage type="bot">
            다음 중 어떤 기준이 가장 중요하신가요? 예를 들어 &apos;가격&apos;, &apos;수영장 여부&apos;, &apos;랜드마크와의 거리&apos; 등 우선순위나 조건을 알려주시면 맞춤형 옵션으로 상품을 찾아드릴게요.
          </ChatMessage>
        )}

        {/* FIT 인터랙션 메시지 (비교 등) - 카드 블록 외부 */}
        {step === "fit-packages" && fitMessages.map((msg, index) => (
          <ChatMessage
            key={`fit-${index}`}
            type={msg.type}
          >
            {msg.content}
          </ChatMessage>
        ))}

        {/* 액티비티 선택 화면 */}
        {step === "fit-activities" && showActivitySelector && (
          <ActivityTicketSelector
            tickets={mockActivityTickets}
            onComplete={(selectedIds) => {
              setSelectedActivities(selectedIds);
              setShowActivitySelector(false);

              const activityPrice = mockActivityTickets
                .filter(t => selectedIds.includes(t.id))
                .reduce((sum, t) => sum + t.price, 0);

              const totalPrice = (selectedFitPackage?.totalPrice || 0) + activityPrice;
              setFitTotalPrice(totalPrice);

              setFitMessages(prev => [...prev, {
                type: "bot",
                content: (
                  <div>
                    <p className="text-[14px] text-[#111] leading-[1.5] mb-3">
                      총 {selectedIds.length}개의 액티비티를 선택하셨습니다. 전체 여행 비용은 {totalPrice.toLocaleString()}원입니다. 예약을 진행하시겠어요?
                    </p>
                    <button
                      onClick={() => handleFITBooking()}
                      className="w-full py-3 bg-[#7b3ff2] text-white rounded-[12px] text-[15px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
                    >
                      예약하기
                    </button>
                  </div>
                )
              }]);
              setStep("fit-summary");
            }}
          />
        )}
      </div>

      <ChatInput onSend={handleSendMessage} />

      {showDetail && selectedPackage && (
        <PackageDetail
          package={selectedPackage}
          onClose={() => setShowDetail(false)}
          onBooking={() => handleBooking(selectedPackage)}
        />
      )}

      {showComparison && comparisonPackages.length > 0 && (
        <AIPackageComparison
          packages={comparisonPackages}
          onClose={() => {
            setShowComparison(false);
            setPackageMessages([]);
          }}
          onSelect={(pkg) => {
            setSelectedPackage(pkg);
            setShowComparison(false);
            setShowDetail(true);
            setPackageMessages([]);
          }}
        />
      )}

      {showFitComparison && comparisonFitPackages.length > 0 && (
        <FITComparison
          packages={comparisonFitPackages}
          onClose={() => setShowFitComparison(false)}
          onSelect={(pkg) => {
            setSelectedFitPackage(pkg);
            setShowFitComparison(false);
            setShowFitDetail(true);
          }}
        />
      )}

      {showFlightComparison && comparisonFlights.length > 0 && (
        <FlightComparison
          flights={comparisonFlights}
          onClose={() => setShowFlightComparison(false)}
          onSelect={(flight) => {
            setSelectedFlight(flight);
            setShowFlightComparison(false);
            setShowFlightDetail(true);
          }}
        />
      )}

      {showHotelComparison && comparisonHotels.length > 0 && (
        <HotelComparison
          hotels={comparisonHotels}
          onClose={() => setShowHotelComparison(false)}
          onSelect={(hotel) => {
            setSelectedHotel(hotel);
            setShowHotelComparison(false);
            setShowHotelDetail(true);
          }}
        />
      )}

      {showPackageBookingSheet && selectedPackage && (
        <PackageBookingSheet
          package={selectedPackage}
          onClose={() => {
            setShowPackageBookingSheet(false);
            setStep(fitSearchMode === "combo" && fitPackages.length > 0 ? "fit-packages" : "packages");
          }}
          onSubmit={handleBookingSubmitFromSheet}
          onRequestPayment={handleRequestPayment}
        />
      )}

      {showPaymentSheet && paymentAmount > 0 && (
        <PaymentSheet
          amount={paymentAmount}
          onSuccess={handlePaymentSuccess}
          onClose={() => { setShowPaymentSheet(false); setStep("packages"); }}
          bookerName={bookingData?.name}
          reservationTitle={selectedHotel?.name ?? selectedPackage?.title ?? selectedFitPackage?.hotelInfo?.name ?? selectedFitPackage?.destination}
          isFitCombo={!!selectedFitPackage && !selectedHotel && !selectedPackage}
          skipCompletion={!!selectedPackage}
          completionDetails={
            selectedFitPackage && !selectedHotel && !selectedPackage
              ? {
                  reservationTitle: selectedFitPackage.hotelInfo.name,
                  city: selectedFitPackage.destination,
                  checkIn: "2026.04.08",
                  checkOut: "2026.04.10",
                  nights: 2,
                  roomInfo: selectedRoomType ? `${selectedRoomType.name} (${selectedRoomType.capacity})` : selectedFitPackage.hotelInfo.roomType,
                  roomSubItems: ["조식 불포함", "성인 2명"],
                  requests: "",
                  channel: "하나투어 닷컴",
                  paymentMethodLabel: "네이버페이",
                }
              : selectedHotel
                ? {
                    reservationTitle: selectedHotel.name,
                    city: selectedHotel.destination || selectedHotel.location || "오사카",
                    checkIn: "2024.01.30",
                    checkOut: "2024.01.31",
                    nights: 1,
                    roomInfo: selectedRoomType ? `${selectedRoomType.name} (${selectedRoomType.capacity})` : selectedHotel.roomType,
                    roomSubItems: ["조식 불포함", "성인 2명"],
                    requests: "",
                    channel: "하나투어 닷컴",
                    paymentMethodLabel: "네이버페이",
                  }
                : selectedPackage
                  ? {
                      reservationTitle: selectedPackage.title,
                      channel: "하나투어 닷컴",
                      paymentMethodLabel: "네이버페이",
                    }
                  : undefined
          }
        />
      )}

      {showBookingForm && !selectedPackage && selectedFitPackage && (
        <BookingForm
          packageTitle={`${selectedFitPackage.hotelInfo.name} 호텔`}
          isFitCombo
          onSubmit={(data) => {
            const hotelPrice = selectedRoomType ? selectedRoomType.priceFrom : selectedFitPackage.hotelInfo.price;
            setBookingData(data);
            setShowBookingForm(false);
            setMessages((prev) => [
              ...prev,
              { type: "user", content: "{호텔 HP12345678} 예약완료" },
              { type: "bot", content: "예약 정보를 확인했습니다. 결제를 진행해 주세요." },
            ]);
            setPaymentAmount(hotelPrice);
            setShowPaymentSheet(true);
            setStep("payment");
          }}
          onCancel={() => setShowBookingForm(false)}
          hotelInfo={{
            hotelName: selectedFitPackage.hotelInfo.name,
            hotelLocation: selectedFitPackage.destination || selectedFitPackage.hotelInfo.location || "",
            checkIn: "2026.04.08(수)",
            checkOut: "2026.04.10(금)",
            nights: 2,
            roomTypeLabel: selectedRoomType
              ? `[${selectedRoomType.name}] ${selectedRoomType.bedType} · ${selectedRoomType.capacity}`
              : selectedFitPackage.hotelInfo.roomType,
            totalAmount: selectedRoomType ? selectedRoomType.priceFrom : selectedFitPackage.hotelInfo.price,
            freeCancellationText: "체크인 전 2026년 03월 27일 18시(현지시간)까지는 수수료 없이 변경/취소/환불이 가능합니다.",
          }}
        />
      )}

      {showFitHotelComplete && selectedFitPackage && (
        <PaymentSheet
          amount={paymentAmount}
          skipPayment
          isFitCombo
          onSuccess={() => {
            setShowFitHotelComplete(false);
            setStep("packages");
          }}
          onClose={() => {
            setShowFitHotelComplete(false);
            setStep("packages");
          }}
          bookerName={bookingData?.name}
          reservationTitle={selectedFitPackage.hotelInfo.name}
          completionDetails={{
            reservationTitle: selectedFitPackage.hotelInfo.name,
            city: selectedFitPackage.destination,
            checkIn: "2026.04.08",
            checkOut: "2026.04.10",
            nights: 2,
            roomInfo: selectedRoomType ? `${selectedRoomType.name} (${selectedRoomType.capacity})` : selectedFitPackage.hotelInfo.roomType,
            roomSubItems: ["조식 불포함", "성인 2명"],
            requests: "",
            channel: "하나투어 닷컴",
            paymentMethodLabel: "네이버페이",
          }}
        />
      )}

      {showPaymentConditionSheet && (
        <FlightPaymentConditionSheet
          onClose={() => setShowPaymentConditionSheet(false)}
          onSelect={(condition) => {
            setPaymentConditionDiff(condition.priceDiff);
            setPaymentConditionCardName(condition.name);
            setShowPaymentConditionSheet(false);
            // 항공권 상세 / 항공+호텔 상세에서 진입한 경우 → 상세로 복귀만
            // 목록 예약하기에서 진입한 경우 → 예약 플로우 시작
            if (!showFlightDetail && !showFitDetail) {
              setFlightSheetStep("terms");
              setStep("booking");
            }
          }}
        />
      )}

      {flightSheetStep && selectedFlight && (
        <FlightBookingSheet
          step={flightSheetStep}
          flight={selectedFlight}
          bookingData={bookingData}
          reservationNumber={flightReservationNumber}
          isPayLater={flightCompleteIsPayLater}
          isFitCombo={!!selectedFitPackage}
          namemdaeHotelInfo={
            selectedFitPackage
              ? {
                  hotelName: selectedFitPackage.hotelInfo.name,
                  hotelLocation:
                    selectedFitPackage.destination || selectedFitPackage.hotelInfo.location || "",
                  checkIn: "2026.04.08(수)",
                  checkOut: "2026.04.10(금)",
                  nights: 2,
                  roomTypeLabel: selectedRoomType
                    ? `[${selectedRoomType.name}] ${selectedRoomType.bedType} · ${selectedRoomType.capacity}`
                    : selectedFitPackage.hotelInfo.roomType,
                  totalAmount:
                    fitTotalPrice ||
                    (selectedRoomType?.priceFrom ?? selectedFitPackage.hotelInfo.price),
                  freeCancellationText:
                    "체크인 전 2026년 03월 27일 18시(현지시간)까지는 수수료 없이 변경/취소/환불이 가능합니다.",
                }
              : undefined
          }
          onClose={() => setFlightSheetStep(null)}
          onProceedToNextStep={(data) => {
            setBookingData(data);
            setFlightSheetStep("payment");
          }}
          onBack={() => {
            if (selectedFitPackage) setFlightSheetStep(null);
            else setFlightSheetStep("terms");
          }}
          onNamemdaeFlightContinue={(data) => {
            setBookingData(data);
            setFlightSheetStep(null);
            let room = selectedRoomType;
            if (selectedFitPackage && !room && mockRoomTypes[selectedFitPackage.id]?.length > 0) {
              room = mockRoomTypes[selectedFitPackage.id][0];
              setSelectedRoomType(room);
            }
            const payAmount =
              fitTotalPrice || (room?.priceFrom ?? selectedFitPackage?.hotelInfo.price ?? 0);
            setPaymentAmount(payAmount);
            setMessages((prev) => [
              ...prev,
              { type: "user", content: "{호텔 HP12345678} 예약완료" },
              { type: "bot", content: "예약 정보를 확인했습니다. 결제를 진행해 주세요." },
            ]);
            setShowPaymentSheet(true);
            setStep("payment");
          }}
          onNamemdaeComboPaymentSubmitted={
            selectedFitPackage
              ? (data) => {
                  setBookingData(data);
                }
              : undefined
          }
          onNamemdaeComboPaymentDismiss={
            selectedFitPackage
              ? () => {
                  setFlightSheetStep(null);
                  setShowPaymentSheet(false);
                  setMessages((prev) => [
                    ...prev,
                    {
                      type: "user",
                      content: "{항공 HA12345678910} · {호텔 HH12345678910} 결제가 완료되었습니다.",
                    },
                    {
                      type: "bot",
                      content:
                        "결제가 완료되었습니다. 항공+호텔 예약이 확정되었습니다. 예약내역에서 상세 정보를 확인해 주세요.",
                    },
                  ]);
                  setStep("initial");
                }
              : undefined
          }
          onFinalSubmit={(isPayLater) => {
            setFlightCompleteIsPayLater(!!isPayLater);
            setMessages((prev) => [
              ...prev,
              { type: "user", content: "{항공 HA12345678} 예약완료" },
              { type: "bot", content: isPayLater ? "예약이 완료되었습니다. 결제는 24시간 이내 진행해 주세요." : "결제가 완료되었습니다. 예약이 확정되었습니다." },
            ]);
            setFlightReservationNumber("HA2500092453");
            setFlightSheetStep("complete");
          }}
          onProceedToHotel={selectedFitPackage ? () => {
            setFlightSheetStep(null);
            if (!selectedRoomType && mockRoomTypes[selectedFitPackage.id]?.length > 0) {
              setSelectedRoomType(mockRoomTypes[selectedFitPackage.id][0]);
            }
            setShowBookingForm(true);
            setStep("booking");
          } : undefined}
        />
      )}

      {showBookingForm && !selectedPackage && !selectedFitPackage && !selectedFlight && selectedHotel && (
        <BookingForm
          packageTitle={`${selectedHotel.name} 호텔`}
          onSubmit={(data) => {
            const amount = fitTotalPrice || (selectedRoomType?.priceFrom ?? selectedHotel.price);
            setBookingData(data);
            setShowBookingForm(false);
            setMessages((prev) => [
              ...prev,
              { type: "user", content: "{호텔 HP12345678} 예약완료" },
              { type: "bot", content: "예약 정보를 확인했습니다. 결제를 진행해 주세요." },
            ]);
            setPaymentAmount(amount);
            setShowPaymentSheet(true);
            setStep("payment");
          }}
          onCancel={() => setShowBookingForm(false)}
          hotelInfo={{
            hotelName: selectedHotel.name,
            hotelLocation: selectedHotel.destination || selectedHotel.location || "",
            hotelImage: selectedHotel.image,
            checkIn: "2026.04.08(수)",
            checkOut: "2026.04.10(금)",
            nights: 2,
            roomTypeLabel: selectedRoomType ? `[${selectedRoomType.name}] ${selectedRoomType.bedType} · ${selectedRoomType.capacity}` : selectedHotel.roomType,
            totalAmount: fitTotalPrice || (selectedRoomType?.priceFrom ?? selectedHotel.price),
            freeCancellationText: "체크인 전 2026년 03월 27일 18시(현지시간)까지는 수수료 없이 변경/취소/환불이 가능합니다.",
          }}
        />
      )}

      {showPayment && selectedPackage && bookingData && (
        <PaymentModal
          amount={selectedPackage.price * bookingData.travelers}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {showPayment && !selectedPackage && selectedFitPackage && bookingData && (
        <PaymentModal
          amount={fitTotalPrice * bookingData.travelers}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {showPayment && !selectedPackage && !selectedFitPackage && selectedFlight && bookingData && (
        <PaymentModal
          amount={fitTotalPrice * bookingData.travelers}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {showPayment && !selectedPackage && !selectedFitPackage && !selectedFlight && selectedHotel && bookingData && (
        <PaymentModal
          amount={fitTotalPrice * bookingData.travelers}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {showConfirmation && selectedPackage && bookingData && (
        <BookingConfirmation
          bookingNumber={bookingNumber}
          packageTitle={selectedPackage.title}
          travelers={bookingData.travelers}
          amount={selectedPackage.price * bookingData.travelers}
          bookerName={bookingData.name}
          travelPeriod={`${selectedPackage.departure} / ${selectedPackage.duration}`}
          remainingAmount={0}
          onClose={() => {
            setShowConfirmation(false);
            setStep("initial");
            setRecommendedPackages([]);
          }}
        />
      )}

      {showConfirmation && !selectedPackage && selectedFitPackage && bookingData && (
        <BookingConfirmation
          bookingNumber={bookingNumber}
          packageTitle={`${selectedFitPackage.destination} 자유여행 패키지`}
          travelers={bookingData.travelers}
          amount={fitTotalPrice * bookingData.travelers}
          bookerName={bookingData.name}
          remainingAmount={0}
          onClose={() => {
            setShowConfirmation(false);
            setStep("initial");
            setFitPackages([]);
            setSelectedFitPackage(null);
            setMessages(prev => [...prev, fitCompletionProposal]);
          }}
        />
      )}

      {showConfirmation && !selectedPackage && !selectedFitPackage && selectedFlight && bookingData && (
        <BookingConfirmation
          bookingNumber={bookingNumber}
          packageTitle={`${selectedFlight.airline} ${selectedFlight.departure}→${selectedFlight.arrival} 항공편`}
          travelers={bookingData.travelers}
          amount={fitTotalPrice * bookingData.travelers}
          bookerName={bookingData.name}
          remainingAmount={0}
          onClose={() => {
            setShowConfirmation(false);
            setStep("initial");
            setFlights([]);
            setSelectedFlight(null);
            setMessages(prev => [...prev, fitCompletionProposal]);
          }}
        />
      )}

      {showHotelDetail && selectedHotel && (
        <HotelDetail
          hotel={selectedHotel}
          onClose={() => setShowHotelDetail(false)}
          onBooking={() => {
            setShowHotelDetail(false);
            setSelectedFitPackage(null);
            setSelectedFlight(null);
            setSelectedPackage(null);
            setFlightSheetStep(null);
            setFitTotalPrice(selectedHotel.price);
            setCurrentHotelForRoomSelection(selectedHotel.id);
            setRoomSelectorSource("booking");
            setShowRoomTypeSelector(true);
          }}
        />
      )}

      {showFlightDetail && selectedFlight && (
        <FlightDetail
          flight={selectedFlight}
          onClose={() => setShowFlightDetail(false)}
          onBooking={() => {
            setShowFlightDetail(false);
            setFitTotalPrice(selectedFlight.price + paymentConditionDiff);
            setFlightSheetStep("terms");
            setStep("booking");
          }}
          onChangeFlight={fitSearchMode !== 'flight' ? () => setShowFlightChangeSheet(true) : undefined}
          onChangePaymentCondition={fitSearchMode === 'flight' ? () => setShowPaymentConditionSheet(true) : undefined}
          priceOverride={fitSearchMode === 'flight' ? selectedFlight.price + paymentConditionDiff : undefined}
          cardLabel={fitSearchMode === 'flight' ? paymentConditionCardName : undefined}
        />
      )}

      {/* 항공권 변경 팝업 (항공권 선택 바텀시트) */}
      {showFlightChangeSheet && (
        <FlightSelectSheet
          flights={flights}
          selectedFlight={selectedFlight}
          onSelect={(flight) => {
            setSelectedFlight(flight);
            setShowFlightChangeSheet(false);
          }}
          onClose={() => setShowFlightChangeSheet(false)}
        />
      )}

      {showFitDetail && selectedFitPackage && (
        <FITPackageDetail
          package={selectedFitPackage}
          selectedRoomType={selectedRoomType}
          onClose={() => setShowFitDetail(false)}
          onBooking={() => {
            setShowFitDetail(false);
            const f = selectedFitPackage.flightInfo;
            const flightData: FlightData = {
              id: `${selectedFitPackage.id}-flight`,
              airline: f.airline,
              departure: f.departure,
              arrival: f.arrival,
              departureTime: f.departureTime,
              arrivalTime: f.arrivalTime,
              flightDuration: f.flightDuration,
              seatClass: f.seatClass,
              price: f.price,
              destination: selectedFitPackage.destination,
              passengerCount: selectedFitPackage.passengerCount,
              travelDateRange: selectedFitPackage.travelDateRange,
              duration: selectedFitPackage.duration,
              isDirect: true,
              flightNumber: f.flightNumber || "KE123",
              departureCode: f.departureCode,
              arrivalCode: f.arrivalCode,
              recommendReason: selectedFitPackage.recommendReason,
            };
            setSelectedFlight(flightData);
            const hotelPart = selectedRoomType?.priceFrom ?? selectedFitPackage.hotelInfo.price;
            setFitTotalPrice(f.price + hotelPart + paymentConditionDiff);
            setBookingData((prev) => prev ?? DEFAULT_NAMEMDAE_FLIGHT_BOOKING);
            setFlightSheetStep("payment");
            setStep("booking");
          }}
          onChangeRoom={() => {
            const hotelId = selectedFitPackage.id;
            setCurrentHotelForRoomSelection(hotelId);
            setRoomSelectorSource("change-room");
            if (!selectedRoomType && mockRoomTypes[hotelId]?.length > 0) {
              setSelectedRoomType(mockRoomTypes[hotelId][0]);
            }
            setShowRoomTypeSelector(true);
          }}
          onChangeFlight={() => setShowFlightChangeSheet(true)}
          onChangePaymentCondition={() => setShowPaymentConditionSheet(true)}
          flightPaymentConditionDiff={paymentConditionDiff}
          paymentConditionCardLabel={paymentConditionCardName}
        />
      )}

      {/* 룸타입 선택 바텀시트 (호텔만 조회 시 예약하기 → 객실선택 팝업) */}
      {showRoomTypeSelector && currentHotelForRoomSelection && (() => {
        const roomList = mockRoomTypes[currentHotelForRoomSelection] ?? Object.values(mockRoomTypes)[0] ?? [];
        return (
        <RoomTypeSelector
          hotelName={
            selectedFitPackage?.hotelInfo.name ||
            selectedHotel?.name ||
            "호텔"
          }
          roomTypes={roomList}
          mode={roomSelectorSource}
          selectedRoomId={selectedRoomType?.id ?? null}
          onSelect={(roomType) => {
            const source = roomSelectorSource;
            setSelectedRoomType(roomType);
            setShowRoomTypeSelector(false);
            setRoomSelectorSource(null);

            if (source === "change-room") {
              if (selectedFitPackage) {
                setFitTotalPrice((fitTotalPrice || selectedFitPackage.totalPrice) + roomType.price);
              }
              return;
            }

            if (selectedHotel && !selectedFitPackage) {
              setSelectedFlight(null);
              setSelectedPackage(null);
              setFlightSheetStep(null);
              setFitTotalPrice(selectedHotel.price + roomType.price);
              setShowBookingForm(true);
              setStep("booking");
              return;
            }

            if (selectedFitPackage) {
              setFitTotalPrice((fitTotalPrice || selectedFitPackage.totalPrice) + roomType.price);
              setShowBookingForm(true);
              setStep("booking");
            }
          }}
          onClose={() => {
            setShowRoomTypeSelector(false);
            setRoomSelectorSource(null);
          }}
        />
        );
      })()}
    </div>
  );
}