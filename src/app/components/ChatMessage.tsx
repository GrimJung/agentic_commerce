import { motion } from "motion/react";

interface ChatMessageProps {
  type: "user" | "bot";
  children: React.ReactNode;
  showActions?: boolean;
  onGood?: () => void;
  onBad?: () => void;
  onCopy?: () => void;
}

export function ChatMessage({ type, children, showActions = false, onGood, onBad, onCopy }: ChatMessageProps) {
  if (type === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end mb-4 px-5"
      >
        <div className="bg-[#3780ff] text-white rounded-tl-[24px] rounded-bl-[24px] rounded-br-[24px] px-5 py-3 max-w-[270px] text-[14px]">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 px-5"
    >
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <div className="text-[14px] text-[#111] max-w-full">
            {children}
          </div>
          {showActions && (
            <div className="mt-2 flex items-center gap-4">
              <button onClick={onCopy} className="flex items-center gap-1.5 text-[12px] text-[#111]">
                <svg className="size-4" viewBox="0 0 16 16" fill="none">
                  <rect x="4" y="4" width="8" height="8" rx="1" stroke="#666666" strokeWidth="1.2"/>
                  <path d="M2 6V2H6" stroke="#666666" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                복사
              </button>
              <button onClick={onGood} className="flex items-center justify-center size-[30px] rounded-full bg-[#FAFAFA] border border-[#E5E5E5]">
                <svg className="size-4" viewBox="0 0 16 16" fill="none">
                  <path d="M5 7.5L5 14.5" stroke="#666666" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M5 7.5C5 7.5 5.5 3 8 2C9 1.5 10 2 10 3V6H13C14 6 15 7 15 8V11C15 12 14 13 13 13H8C7 13 6 12 5.5 11.5L5 7.5Z" stroke="#666666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button onClick={onBad} className="flex items-center justify-center size-[30px] rounded-full bg-[#FAFAFA] border border-[#E5E5E5]">
                <svg className="size-4" viewBox="0 0 16 16" fill="none">
                  <path d="M5 8.5V1.5" stroke="#666666" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M5 8.5C5 8.5 5.5 13 8 14C9 14.5 10 14 10 13V10H13C14 10 15 9 15 8V5C15 4 14 3 13 3H8C7 3 6 4 5.5 4.5L5 8.5Z" stroke="#666666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}