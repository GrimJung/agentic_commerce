import type { ComponentType } from "react";
import {
  Bell,
  Calendar,
  Camera,
  ChevronRight,
  Compass,
  Heart,
  HelpCircle,
  MapPin,
  MessageCircle,
  Mic,
  Search,
  ShoppingBag,
  Star,
  Ticket,
} from "lucide-react";

interface MainPageProps {
  onStartRecommendation: () => void;
}

const chips: {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  isMain?: boolean;
}[] = [
  { label: "퀴즈쇼", Icon: HelpCircle },
  { label: "오늘의 운세", Icon: Star },
  { label: "AI 여행 한컷", Icon: Camera },
  { label: "관심 기반 추천", Icon: Heart },
  { label: "찜 상품 비교", Icon: Compass },
  { label: "상품 추천받고 예약하기", Icon: ShoppingBag, isMain: true },
  { label: "상품 알아보기", Icon: Search },
  { label: "예약 상담", Icon: MessageCircle },
  { label: "E-티켓 조회", Icon: Ticket },
  { label: "여행 일정 제안", Icon: Calendar },
  { label: "여행지 둘러보기", Icon: MapPin },
];

export function MainPage({ onStartRecommendation }: MainPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* 공지 */}
        <div className="px-4 pt-3">
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-[20px] bg-[#F2F4F7] px-3 py-2.5 text-left transition-colors hover:bg-[#e8ecf2]"
          >
            <div className="relative shrink-0 text-[#555]">
              <Bell className="size-[18px]" strokeWidth={1.75} aria-hidden />
              <span className="absolute -right-1 -top-0.5 rounded px-[3px] py-px text-[8px] font-bold leading-none text-white bg-[#6329C4]">
                NEW
              </span>
            </div>
            <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[#555]">
              공지 제목이 들어갑니다. 길어지면 말 줄임표로…
            </span>
            <ChevronRight className="size-4 shrink-0 text-[#aaa]" aria-hidden />
          </button>
        </div>

        {/* 히어로 — H-AI 로고 (public/hai-logo.png) */}
        <div className="flex flex-col items-center px-5 pt-8">
          <img
            src="/hai-logo.png"
            alt="H-AI"
            className="size-[88px] shrink-0 object-contain object-center"
            width={88}
            height={88}
            draggable={false}
          />
          <h2 className="mt-5 text-center font-['Pretendard:Bold',sans-serif] text-[20px] font-bold text-[#111]">
            안녕하세요, H-AI에요
          </h2>
          <div className="mt-2 flex max-w-[300px] flex-col gap-0.5 text-center text-[14px] leading-snug text-[#888]">
            <p className="m-0">무엇을 도와드릴까요?</p>
            <p className="m-0">최대 두줄까지 입력 가능합니다.</p>
          </div>
        </div>

        {/* 입력 바 (디자인: 플레이스홀더 + 마이크만) */}
        <div className="px-5 pt-8 pb-5">
          <div className="flex items-center gap-3 rounded-[26px] border border-[#e5e5e5] bg-white px-4 py-2.5 shadow-sm">
            <span className="min-w-0 flex-1 truncate text-left text-[14px] font-medium text-[#bbb]">
              궁금한 내용을 H-AI에게 물어보세요
            </span>
            <button type="button" className="shrink-0 p-0.5 text-[#888] transition-opacity hover:opacity-80" aria-label="음성 입력">
              <Mic className="size-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* 바로가기 칩 */}
        <div className="flex flex-wrap justify-center gap-2 px-5 pb-8">
          {chips.map(({ label, Icon, isMain }) => (
            <button
              key={label}
              type="button"
              onClick={isMain ? onStartRecommendation : undefined}
              className={`flex h-8 items-center gap-1.5 whitespace-nowrap rounded-2xl border px-3 text-[12px] font-semibold transition-colors ${
                isMain
                  ? "border-[#6329C4] bg-[#f5f0ff] text-[#6329C4] hover:bg-[#ede5fa]"
                  : "border-[#e5e5e5] bg-[#F2F4F7] text-[#666] hover:border-[#d0d4dd]"
              }`}
            >
              <Icon className="size-3.5 shrink-0" strokeWidth={isMain ? 2 : 1.75} />
              {label}
            </button>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="mx-5 mb-8 rounded-[12px] bg-[#f5f6f8] px-4 py-3">
          <p className="text-center text-[11px] leading-relaxed text-[#888]">
            개인 정보와 관련된 질문은 입력 시 주의 바라며, 대화 내용은 하나투어 보안 정책에 따라 안전하게 관리됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
