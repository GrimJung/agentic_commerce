import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 좌석 등급 표시 명칭: 일반석 · 프리미엄 일반석 · 비즈니스석 · 일등석 */
export function formatSeatClass(seatClass: string): string {
  const s = seatClass?.trim().toLowerCase() ?? "";
  if (s.includes("일등") || s.includes("first") || s.includes("퍼스트")) return "일등석";
  if (s.includes("비즈니스") || s.includes("business")) return "비즈니스석";
  if (s.includes("프리미엄") || s.includes("premium")) return "프리미엄 일반석";
  if (s.includes("이코노미") || s.includes("economy") || s.includes("일반")) return "일반석";
  return seatClass || "일반석";
}
