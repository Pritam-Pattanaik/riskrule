import React from 'react';
import { Logo } from './Logo';

/**
 * V3 Premium Page Loading Fallback
 * Branded skeleton layout that matches common page structure.
 * GPU-accelerated shimmer animation, respects prefers-reduced-motion.
 */
export function PageLoadingFallback() {
  return (
    <div className="flex flex-col w-full min-h-[60vh] p-0 animate-fade-in">
      {/* Branded Logo Pulse */}
      <div className="flex items-center justify-center pt-8 pb-6">
        <div className="animate-logo-pulse">
          <Logo variant="icon" size="md" />
        </div>
      </div>

      {/* Skeleton Grid — Matches Dashboard/Page Layout */}
      <div className="space-y-6 w-full">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 space-y-3" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="v3-skeleton h-4 w-16 mx-auto" />
              <div className="v3-skeleton h-8 w-24 mx-auto" />
              <div className="v3-skeleton h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>

        {/* Content Area — Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card p-6 space-y-4">
            <div className="v3-skeleton h-5 w-32" />
            <div className="v3-skeleton h-40 w-full rounded-xl" />
          </div>
          <div className="card p-6 space-y-4">
            <div className="v3-skeleton h-5 w-28" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="v3-skeleton h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
