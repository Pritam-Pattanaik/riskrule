import React from 'react';
import { useAuthStore } from '../../stores/authStore';

export default function UserMessageBubble({ content }: { content: string }) {
  const { profile } = useAuthStore();

  // Strip any residual mode/bracket tags
  const cleanContent = content
    .replace(/^\[MODE:[\w]+\]\s*/i, '')
    .replace(/^\[[\w]+\]\s*/i, '')
    .trim() || content;

  return (
    <div className="flex items-end gap-2 flex-row-reverse">
      {/* Avatar */}
      <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 text-[10px] font-bold text-accent">
        {profile?.fullName?.charAt(0)?.toUpperCase() || 'U'}
      </div>

      {/* Bubble */}
      <div className="px-4 py-2.5 bg-accent text-white rounded-2xl rounded-tr-sm max-w-[85%] text-sm leading-relaxed shadow-sm shadow-accent/20">
        {cleanContent}
      </div>
    </div>
  );
}
