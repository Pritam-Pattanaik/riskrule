import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import type { DateRange, DatePreset } from '../../stores/analyticsStore';

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'week',       label: 'This Week' },
  { key: 'month',     label: 'This Month' },
  { key: 'last_month', label: 'Last Month' },
  { key: '3months',   label: '3 Months' },
  { key: 'all',       label: 'All Time' },
];

interface AnalyticsDateFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function AnalyticsDateFilter({ value, onChange }: AnalyticsDateFilterProps) {
  return (
    <div className="flex items-center p-1 rounded-xl bg-surface-1 border border-border shadow-xs w-max flex-wrap gap-1">
      {PRESETS.map(({ key, label }) => {
        const active = value.preset === key;
        return (
          <button
            key={key}
            onClick={() => onChange({ preset: key })}
            className={cn(
              'relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 outline-none whitespace-nowrap',
              'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
              active ? 'text-white' : 'text-secondary hover:text-primary'
            )}
            aria-current={active ? 'page' : undefined}
            aria-label={`Analytics filter: ${label}`}
          >
            {active && (
              <motion.div
                layoutId="analyticsFilterTab"
                className="absolute inset-0 bg-iris rounded-lg shadow-sm"
                transition={{ duration: 0.15, ease: 'easeInOut' }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
