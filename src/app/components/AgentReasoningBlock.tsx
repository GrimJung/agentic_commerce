import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AgentProgressMessage } from "./AgentProgressMessage";
import type { ReasoningStep } from "../constants/reasoningSteps";

interface AgentReasoningBlockProps {
  steps: ReasoningStep[];
  stepInterval?: number;
  completedLabel?: string;
  onAllStepsComplete?: () => void;
}

export function AgentReasoningBlock({
  steps,
  stepInterval = 1000,
  completedLabel = "분석 완료",
  onAllStepsComplete,
}: AgentReasoningBlockProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const completedRef = useRef(false);

  // 단계 자동 진행
  useEffect(() => {
    if (isComplete) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        // 마지막 단계 완료
        if (!completedRef.current) {
          completedRef.current = true;
          setIsComplete(true);
          onAllStepsComplete?.();
        }
      }
    }, stepInterval);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isComplete, steps.length, stepInterval, onAllStepsComplete]);

  // 완료 후 접힌 상태
  if (isComplete) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <svg className="size-4 text-[#22c55e]" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[13px] text-[#22c55e] font-medium">{completedLabel}</span>
          <svg
            className={`size-3 text-[#888] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            viewBox="0 0 12 12"
            fill="none"
          >
            <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-1.5 pt-2 pl-1">
                {steps.map((step, i) => (
                  <AgentProgressMessage key={i} message={step.message} status="completed" />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 진행 중 상태
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {steps.slice(0, currentStepIndex + 1).map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AgentProgressMessage
              message={step.message}
              status={i < currentStepIndex ? "completed" : "active"}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
