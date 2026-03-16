interface AgentProgressMessageProps {
  message: string;
  status?: 'active' | 'completed';
}

export function AgentProgressMessage({ message, status = 'active' }: AgentProgressMessageProps) {
  return (
    <div className="flex items-center gap-2">
      {status === 'active' ? (
        <div className="inline-block size-4 border-2 border-[#7b3ff2] border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="size-4 text-[#22c55e]" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span className={`text-[13px] ${status === 'active' ? 'text-[#111]' : 'text-[#888]'}`}>
        {message}
      </span>
    </div>
  );
}
