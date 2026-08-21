import React from 'react';
import { format } from 'date-fns';

interface MessageTimestampProps {
  timestamp: string | Date;
  className?: string;
}

export const MessageTimestamp: React.FC<MessageTimestampProps> = ({ timestamp, className = '' }) => {
  if (!timestamp) return null;

  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const formatted = format(date, 'hh:mm a');

    return (
      <span className={`text-[10px] text-tertiary tracking-tight select-none opacity-70 ${className}`}>
        {formatted}
      </span>
    );
  } catch {
    return null;
  }
};
