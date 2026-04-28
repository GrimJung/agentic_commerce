export type CrossSellCardData = {
  id: string;
  image: string;
  category: string;
  title: string;
  price: number;
};

function cityFromDestination(destination?: string): string {
  return (destination ?? "").split(/[，,]/)[0]?.trim() ?? "";
}

/** 예약한 목적지에 맞춘 데모용 크로스셀 상품 */
export function getCrossSellItemsForBooking(destination?: string): CrossSellCardData[] {
  const city = cityFromDestination(destination);

  if (city.includes("파리") || city === "파리") {
    return [
      {
        id: "cs-paris-1",
        image:
          "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80&auto=format&fit=crop",
        category: "투어입장권",
        title: "루브르 박물관 우선 입장 + 한국어 오디오",
        price: 89000,
      },
      {
        id: "cs-paris-2",
        image:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80&auto=format&fit=crop",
        category: "현지투어",
        title: "베르사유 궁전 반일 투어 (왕복셔틀)",
        price: 129000,
      },
      {
        id: "cs-paris-3",
        image:
          "https://images.unsplash.com/photo-1431274172761-fca4caa889d2?w=400&q=80&auto=format&fit=crop",
        category: "액티비티",
        title: "센강 디너 크루즈 + 라이브 공연",
        price: 99000,
      },
    ];
  }

  if (city.includes("발리") || city === "발리") {
    return [
      {
        id: "cs-bali-1",
        image:
          "https://images.unsplash.com/photo-1589632732202-bd154e6e116d?w=400&q=80&auto=format&fit=crop",
        category: "액티비티",
        title: "우붓 전통시장 & 테갈랄랑 라이스테라스 투어",
        price: 75000,
      },
      {
        id: "cs-bali-2",
        image:
          "https://images.unsplash.com/photo-1544644181-1484b3fdfc92?w=400&q=80&auto=format&fit=crop",
        category: "스파",
        title: "세미냑 프라이빗 스파 90분 + 허브티",
        price: 189000,
      },
      {
        id: "cs-bali-3",
        image:
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80&auto=format&fit=crop",
        category: "투어입장권",
        title: "탄중 베노아 해양 스포츠 패키지",
        price: 159000,
      },
    ];
  }

  if (city.includes("도쿄") || city === "도쿄") {
    return [
      {
        id: "cs-tokyo-1",
        image:
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80&auto=format&fit=crop",
        category: "투어입장권",
        title: "도쿄 스카이트리 우선 입장권",
        price: 32000,
      },
      {
        id: "cs-tokyo-2",
        image:
          "https://images.unsplash.com/photo-1624253329477-906d9c10d9a2?w=400&q=80&auto=format&fit=crop",
        category: "현지투어",
        title: "시부야·하라주쿠 맛집 워킹투어 (한국어)",
        price: 89000,
      },
      {
        id: "cs-tokyo-3",
        image:
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80&auto=format&fit=crop",
        category: "액티비티",
        title: "후지산 당일치기 버스투어 (도쿄 출발)",
        price: 119000,
      },
    ];
  }

  return [
    {
      id: "cs-def-1",
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8804?w=400&q=80&auto=format&fit=crop",
      category: "투어입장권",
      title: "[4인 이상 출발확정] 현지 가이드 반일 시티투어",
      price: 99999,
    },
    {
      id: "cs-def-2",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80&auto=format&fit=crop",
      category: "현지투어",
      title: "야경 크루즈 + 디너 뷔페 패키지",
      price: 135000,
    },
    {
      id: "cs-def-3",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80&auto=format&fit=crop",
      category: "액티비티",
      title: "국립공원 당일 하이킹 (픽업 포함)",
      price: 89000,
    },
  ];
}

interface PostPaymentCrossSellStripProps {
  items: CrossSellCardData[];
  onSelectItem?: (item: CrossSellCardData) => void;
}

export function PostPaymentCrossSellStrip({ items, onSelectItem }: PostPaymentCrossSellStripProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="mx-0 my-3 text-[14px] font-['Pretendard:SemiBold',sans-serif] font-semibold leading-snug text-[#111]">
        이번 여행에 딱 맞는 상품만 골라봤어요.
      </p>
      <div
        className="-mx-0.5 flex gap-3 overflow-x-auto pb-1 pl-0.5 pr-1 scrollbar-none snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item) => (
          <article
            key={item.id}
            className="w-[156px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-[#e8e8e8] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          >
            <div className="relative h-[100px] w-full overflow-hidden bg-[#eee]">
              <img src={item.image} alt="" className="size-full object-cover" loading="lazy" />
              <span className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold leading-tight text-white bg-[#3780ff]">
                {item.category}
              </span>
            </div>
            <div className="flex flex-col gap-1 px-2.5 pt-2 pb-2.5">
              <p className="line-clamp-2 min-h-[2.5rem] text-left text-[12px] font-['Pretendard:SemiBold',sans-serif] font-semibold leading-tight text-[#111]">
                {item.title}
              </p>
              <p className="text-left text-[13px] font-bold tabular-nums text-[#111]">
                {item.price.toLocaleString()}원~
              </p>
              <button
                type="button"
                className="mt-0.5 w-full rounded-[10px] border border-[#e5e5e5] bg-white py-2 text-[12px] font-['Pretendard:SemiBold',sans-serif] font-semibold text-[#555] transition-colors hover:bg-[#fafafa] active:bg-[#f5f5f5]"
                onClick={() => onSelectItem?.(item)}
              >
                선택하기
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
