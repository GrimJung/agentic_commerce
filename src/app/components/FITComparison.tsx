import { motion } from "motion/react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { FITPackageData } from "./FITPackageCard";
import { X } from "lucide-react";

interface FITComparisonProps {
  packages: FITPackageData[];
  onClose: () => void;
  onSelect: (pkg: FITPackageData) => void;
}

export function FITComparison({ packages, onClose, onSelect }: FITComparisonProps) {
  useLockBodyScroll();
  const displayPackages = packages.slice(0, 3);
  const labels = ["A", "B", "C"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-[24px]"
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-b from-[#eed6ff] to-[#f7f5fe] border-b border-[#f0f0f0] z-10">
          <div className="px-5 pt-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6">
                <svg className="size-full" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#7b3ff2"/>
                  <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AI</text>
                </svg>
              </div>
              <h2 className="font-['Pretendard:Bold',sans-serif] text-[20px] text-[#101828]">AI 비교 브리핑</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <X className="size-5" />
            </button>
          </div>
          <p className="px-5 pb-4 text-[14px] text-[#8e8e93]">
            AI가 항공+호텔 조합을 분석해 드려요.
          </p>
        </div>

        <div className="px-5 pt-4">
          {/* 동반자 태그 */}
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
            <div className="px-4 py-2 bg-gradient-to-b from-[#6976ff] to-[#7b3ff2] rounded-full">
              <span className="text-[13px] text-white">가성비 중시</span>
            </div>
            <div className="px-4 py-2 bg-[#e9e5fb] rounded-full">
              <span className="text-[13px] text-[#4a5565]">럭셔리</span>
            </div>
            <div className="px-4 py-2 bg-[#e9e5fb] rounded-full">
              <span className="text-[13px] text-[#4a5565]">편리한 위치</span>
            </div>
          </div>

          {/* AI 브리핑 */}
          <div className="bg-white rounded-[10px] p-4 mb-4 border border-[#f0f0f0]">
            <p className="text-[15px] text-[#7b3ff2] font-['Pretendard:Bold',sans-serif] mb-3">
              "항공편과 호텔을 함께 비교하여 최적의 조합을 추천해 드립니다."
            </p>
            <div className="space-y-2">
              {displayPackages.map((pkg, index) => (
                <div key={pkg.id} className="flex gap-2">
                  <span className="text-[16px] text-[#00d9c0]">•</span>
                  <div className="flex items-start gap-2">
                    <div className="size-5 bg-[rgba(123,63,242,0.1)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[11px] text-[#7b3ff2]">{labels[index]}</span>
                    </div>
                    <p className="text-[14px] text-[#364153] leading-[1.5]">
                      {pkg.flightInfo.airline} + {pkg.hotelInfo.name}({pkg.hotelInfo.grade}) 조합으로 총 {(pkg.totalPrice / 10000).toFixed(0)}만원입니다
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 비교 테이블 */}
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left p-3 text-[12px] text-[#4a5565] font-['Pretendard:Regular',sans-serif] w-[80px]">
                    조합
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
                            {(pkg.totalPrice / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </p>
                          <p className="text-[11px] text-[#6a7282]">만원</p>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">항공사</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.flightInfo.airline}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">비행시간</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.flightInfo.flightDuration}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">호텔명</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.hotelInfo.name}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#e5e7eb]">
                  <td className="p-3 text-[12px] text-[#4a5565]">호텔등급</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.hotelInfo.grade}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-[12px] text-[#4a5565]">객실타입</td>
                  {displayPackages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-[12px] text-[#111] border-l border-[#e5e7eb]">
                      {pkg.hotelInfo.roomType}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* 상품 카드 */}
          <div className="space-y-3 pb-6">
            {displayPackages.map((pkg, index) => (
              <div key={pkg.id} className="border border-[#e5e5e5] rounded-[12px] overflow-hidden">
                <div className="p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="relative">
                      <div className="w-[80px] h-[80px] bg-[#f8f9fa] rounded-[8px] flex items-center justify-center">
                        <span className="text-[13px] text-[#666]">{pkg.flightInfo.airline}</span>
                      </div>
                      <div className="absolute -top-2 -left-2 size-6 bg-[#7b3ff2] rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-[12px] font-['Pretendard:Bold',sans-serif]">
                          {labels[index]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-['Pretendard:Bold',sans-serif] text-[14px] text-[#111] mb-1 line-clamp-2">
                        {pkg.flightInfo.airline} + {pkg.hotelInfo.name}
                      </h4>
                      <p className="text-[12px] text-[#999] mb-2">{pkg.duration}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#7b3ff2]">
                          {(pkg.totalPrice / 10000).toFixed(0)}만원
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelect(pkg)}
                    className="w-full py-2.5 bg-[#7b3ff2] text-white rounded-[8px] text-[14px] font-['Pretendard:SemiBold',sans-serif] hover:bg-[#6930d9] transition-colors"
                  >
                    이 조합 선택하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
