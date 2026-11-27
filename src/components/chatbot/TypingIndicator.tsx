import React from 'react';
import AnimatedChatIcon from './AnimatedChatIcon';

/** Three bouncing dots shown while the bot is "thinking". */
export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 px-1">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sky-200/70 bg-white shadow-xs"
        aria-hidden="true"
      >
        <AnimatedChatIcon size={24} animated />
      </span>
      <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/10 px-4 py-3">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-slate-400"
            style={{
              animation: 'chatbot-bounce 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
