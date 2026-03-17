import { motion } from "motion/react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { PackageData } from "./PackageCard";
import { X } from "lucide-react";

interface PackageComparisonProps {
  packages: PackageData[];
  onClose: () => void;
  onSelect: (pkg: PackageData) => void;
}

export function PackageComparison({ packages, onClose, onSelect }: PackageComparisonProps) {
  useLockBodyScroll();
  // 최대 3개까지만 비교
  const displayPackages = packages.slice(0, 3);
  const labels = ["A", "B", "C"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full min-w-full max-h-[90vh] flex flex-col justify-center items-center rounded-t-[24px]"
      >
        {/* 헤더 */}
        <div className="flex-shrink-0 sticky top-0 w-full bg-white border-b border-gray-200 z-10 px-5 pt-4 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-[16px] font-semibold text-gray-900">AI 비교 브리핑</h1>
            <p className="text-[12px] text-[var(--color-gray-400)] mt-0.5 leading-snug">
              AI가 여행 조건에 맞는 상품을 분석 해드려요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="닫기"
          >
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 w-full">
          <div className="px-4 pt-2.5 pb-10">
          <div className="px-5">
          {/* 여행 동반자 / 테마 선택 탭 */}
          <div className="bg-white rounded-[14px] shadow-[0px_4px_7px_0px_rgba(0,0,0,0.1)] border-b border-[#e5e7eb] mb-4">
            <div className="flex h-[65px]">
              <button className="flex-1 flex flex-col items-center justify-center gap-1 border-b-[3px] border-[#7b3ff2]">
                <svg className="size-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" stroke="#7b3ff2" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 16V14C2 12.9391 2.42143 11.9217 3.17157 11.1716C3.92172 10.4214 4.93913 10 6 10H10C11.0609 10 12.0783 10.4214 12.8284 11.1716C13.5786 11.9217 14 12.9391 14 14V16" stroke="#7b3ff2" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[14px] text-[#7b3ff2] font-['Pretendard:Bold',sans-serif]">여행 동반자</span>
              </button>
              <button className="flex-1 flex flex-col items-center justify-center gap-1">
                <svg className="size-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" stroke="#4a5565" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.3333 2V4.66667M14.6667 3.33333H12M2.66667 11.3333V12.6667M3.33333 12H2" stroke="#4a5565" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[14px] text-[#4a5565] font-['Pretendard:Regular',sans-serif]">여행 테마</span>
              </button>
            </div>
          </div>

          {/* 동반자 태그 선택 */}
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
            <div className="px-4 py-2 bg-gradient-to-b from-[#6976ff] to-[#7b3ff2] rounded-full">
              <span className="text-[13px] text-white">아이 동반</span>
            </div>
            <div className="px-4 py-2 bg-[#e9e5fb] rounded-full">
              <span className="text-[13px] text-[#4a5565]">부모님 효도</span>
            </div>
            <div className="px-4 py-2 bg-[#e9e5fb] rounded-full">
              <span className="text-[13px] text-[#4a5565]">커플·친구</span>
            </div>
            <div className="px-4 py-2 bg-[#e9e5fb] rounded-full">
              <span className="text-[13px] text-[#4a5565]">가성비 중시</span>
            </div>
          </div>

          {/* AI 브리핑 */}
          <div className="bg-white rounded-[10px] p-4 mb-4 border border-[#f0f0f0]">
            <p className="text-[15px] text-[#7b3ff2] font-['Pretendard:Bold',sans-serif] mb-3">
              "아이와 함께라면 이동 부담이 적고 호텔 내 부대시설 활용도가 높은 상품이 적합합니다."
            </p>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-[16px] text-[#00d9c0]">•</span>
                <div className="flex items-start gap-2">
                  <div className="size-5 bg-[rgba(123,63,242,0.1)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] text-[#7b3ff2]">A</span>
                  </div>
                  <p className="text-[14px] text-[#364153] leading-[1.5]">
                    키즈 풀과 워터파크가 있는 리조트형 호텔로 아이들이 즐길 거리가 풍부합니다
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-[16px] text-[#00d9c0]">•</span>
                <div className="flex items-start gap-2">
                  <div className="size-5 bg-[rgba(123,63,242,0.1)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] text-[#7b3ff2]">B</span>
                  </div>
                  <p className="text-[14px] text-[#364153] leading-[1.5]">
                    이동 시간이 가장 짧고 자유시간이 많아 아이들 체력 관리에 유리합니다
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-[16px] text-[#00d9c0]">•</span>
                <div className="flex items-start gap-2">
                  <div className="size-5 bg-[rgba(123,63,242,0.1)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] text-[#7b3ff2]">C</span>
                  </div>
                  <p className="text-[14px] text-[#364153] leading-[1.5]">
                    가족 단위 여행객을 위한 패밀리룸 구성으로 편안한 휴식이 가능합니다
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 비교 테이블 */}
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left p-3 text-[12px] text-[#4a5565] font-['Pretendard:Regular',sans-serif] w-[80px]">
                    상품명
                  </th>
                  {displayPackages.map((pkg, index) => (
                    <td key={pkg.id} className="p-3 text-center border-l border-[#e5e7eb]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-6 bg-[rgba(123,63,242,0.1)] rounded-full flex items-center justify-center">
                          <span className="text-[#7b3ff2] text-[12px] font-['Pretendard:Bold',sans-serif]">
                            {labels[index]}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-[13px] font-['Pretendard:Bold',sans-serif] text-[#7b3ff2]">
                            {(pkg.price / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </p>
                          <p className="text-[11px] text-[#6a7282]">만원</p>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 브랜드 */}
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">브랜드</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.destination.split(',')[0]}
                    </td>
                  ))}
                </tr>

                {/* 항공사 */}
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">항공사</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.airline}
                    </td>
                  ))}
                </tr>

                {/* 출발공항 */}
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">출발공항</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      인천공항
                    </td>
                  ))}
                </tr>

                {/* 일정 */}
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">일정</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.duration}
                    </td>
                  ))}
                </tr>

                {/* 포함금액 */}
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">포함금액</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.highlights.length}항목
                    </td>
                  ))}
                </tr>

                {/* 평점 */}
                <tr>
                  <td className="p-3 text-[12px] text-[#4a5565]">평점</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center border-l border-[#e5e7eb]">
                      <div className="flex items-center justify-center gap-1">
                        <svg className="size-3.5 fill-[#FFB800]" viewBox="0 0 16 16">
                          <path d="M8 0L10.472 5.008L16 5.856L12 9.712L12.944 15.232L8 12.616L3.056 15.232L4 9.712L0 5.856L5.528 5.008L8 0Z"/>
                        </svg>
                        <span className="text-[12px] text-[#111]">{pkg.rating}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* 상품 카드 */}
          <div className="space-y-3">
            {displayPackages.map((pkg, index) => (
              <div key={pkg.id} className="border border-[#e5e5e5] rounded-[12px] overflow-hidden">
                <div className="p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="relative">
                      <img src={pkg.image} alt={pkg.title} className="w-[80px] h-[80px] object-cover rounded-[8px]" />
                      <div className="absolute -top-2 -left-2 size-6 bg-[#7b3ff2] rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-[12px] font-['Pretendard:Bold',sans-serif]">
                          {labels[index]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] mb-1 line-clamp-2">
                        {pkg.title}
                      </h4>
                      <p className="text-[12px] text-[#999] mb-2">{pkg.duration}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#3780ff]">
                          {(pkg.price / 10000).toFixed(0)}만원
                        </span>
                        <span className="text-[12px] text-[#999]">~</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelect(pkg)}
                    className="w-full py-2.5 bg-[#3780ff] text-white rounded-[8px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#2d6fdf] transition-colors"
                  >
                    이 상품 선택하기
                  </button>
                </div>
              </div>
            ))}
          </div>
          </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}