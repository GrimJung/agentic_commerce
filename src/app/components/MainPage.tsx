import type { ComponentType } from "react";
import { Mic, Heart, ShoppingBag, MessageCircle, Calendar, MapPin, Camera, Star, HelpCircle, Ticket, Compass } from "lucide-react";

interface MainPageProps {
  onStartRecommendation: () => void;
}

const chipRows = [
  [
    { label: "퀴즈쇼", Icon: HelpCircle },
    { label: "오늘의 운세", Icon: Star },
    { label: "AI 여행 한컷", Icon: Camera },
  ],
  [
    { label: "관심 기반 추천", Icon: Heart },
    { label: "찜 상품 비교", Icon: Compass },
    { label: "예약 상담", Icon: MessageCircle },
  ],
  [
    { label: "상품 추천받고 결제하기", Icon: ShoppingBag, isMain: true },
    { label: "E-티켓 조회", Icon: Ticket },
  ],
  [
    { label: "여행 일정 제안", Icon: Calendar },
    { label: "여행지 둘러보기", Icon: MapPin },
  ],
] as { label: string; Icon: ComponentType<{ className?: string }>; isMain?: boolean }[][];

export function MainPage({ onStartRecommendation }: MainPageProps) {
  return (
    <div className="size-full flex flex-col bg-white overflow-hidden">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Avatar */}
        <div className="flex justify-center pt-12">
          <div className="size-16 rounded-full overflow-hidden bg-[#d9d9d9]">
            <img
              src="/main-avatar.png"
              alt="H-AI"
              className="size-full object-cover"
            />
          </div>
        </div>

        {/* Greeting */}
        <div className="flex flex-col items-center mt-4 mb-6">
          <h2 className="font-['Pretendard:SemiBold',sans-serif] text-[20px] text-[#111] mb-1">
            안녕하세요, H-AI에요
          </h2>
          <p className="text-[15px] text-[#666]">무엇을 도와드릴까요?</p>
        </div>

        {/* Search Input Bar */}
        <div className="px-5 mb-5">
          <div className="flex items-center gap-3 bg-white border border-[#e5e5e5] rounded-[26px] px-3 py-2.5 shadow-sm">
            <div className="size-8 rounded-full bg-[#111] flex items-center justify-center flex-shrink-0">
              <div className="size-2.5 rounded-sm bg-white" />
            </div>
            <span className="flex-1 text-[14px] text-[#bbbbbb] font-medium">
              H-AI에게 질문하기
            </span>
            <button className="flex-shrink-0">
              <Mic className="size-5 text-[#888]" />
            </button>
          </div>
        </div>

        {/* Chips — 4 rows matching Figma layout */}
        <div className="px-5 space-y-2">
          {chipRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-2">
              {row.map(({ label, Icon, isMain }) => (
                <button
                  key={label}
                  onClick={isMain ? onStartRecommendation : undefined}
                  className={`flex items-center gap-1.5 px-3 h-8 rounded-2xl border text-[12px] font-semibold transition-colors whitespace-nowrap ${
                    isMain
                      ? "border-[#3780ff] bg-[#f0f7ff] text-[#3780ff] hover:bg-[#e0efff]"
                      : "border-[#e5e5e5] bg-white text-[#666] hover:border-[#ccc]"
                  }`}
                >
                  <Icon className="size-3.5 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
