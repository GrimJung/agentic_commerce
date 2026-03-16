"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { HotelData } from "./HotelCard";
import { HotelDetailContent } from "./HotelDetailContent";

interface HotelDetailProps {
  hotel: HotelData;
  onClose: () => void;
  onBooking: () => void;
}

export function HotelDetail({ hotel, onClose, onBooking }: HotelDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-white w-full rounded-t-[24px] max-h-[85vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-[#f0f0f0] px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Pretendard:Bold',sans-serif] text-[18px] text-[#111]">호텔 상세 정보</h2>
          <button onClick={onClose} className="p-2 -mr-2">
            <X className="size-6 text-[#666]" />
          </button>
        </div>
        <HotelDetailContent hotel={hotel} onBooking={onBooking} />
      </motion.div>
    </div>
  );
}
