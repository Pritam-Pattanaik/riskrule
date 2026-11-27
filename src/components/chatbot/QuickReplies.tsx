import React from 'react';
import { cn } from '../../lib/cn';

interface Props {
  replies: string[];
  onSelect: (reply: string) => void;
}

/** Tappable suggestion chips shown below bot messages. */
export default function QuickReplies({ replies, onSelect }: Props) {
  if (!replies.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pl-10" role="group" aria-label="Suggested questions">
      {replies.map(reply => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          className={cn(
            'rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5',
            'text-[12px] font-medium text-slate-300 whitespace-nowrap',
            'transition-all duration-150',
            'hover:border-[var(--brand-green)]/40 hover:bg-[var(--brand-green)]/10 hover:text-white',
            'active:scale-[0.97]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]',
          )}
        >
          {reply}
        </button>
      ))}
    </div>
  );
}

