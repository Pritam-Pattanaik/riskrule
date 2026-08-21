import React, { useEffect } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { useFlowSSE } from '../hooks/useFlowSSE';
import { useFlowStore } from '../stores/flowStore';
import { AlertTriangle, RefreshCw, KeyRound, PlugZap, Moon, ExternalLink } from 'lucide-react';
=======
import { useFlowSSE } from '../hooks/useFlowSSE';
import { useFlowStore } from '../stores/flowStore';
import { AlertTriangle, RefreshCw } from 'lucide-react';
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46

import { FlowHeader } from '../components/flow/FlowHeader';
import { FlowStatCards } from '../components/flow/FlowStatCards';
import { SentimentPanel } from '../components/flow/SentimentPanel';
import { FlowNarrative } from '../components/flow/FlowNarrative';

export default function Flow() {
  // Wire up SSE for live intelligence push events
  useFlowSSE();

  const fetchIntelligence = useFlowStore(s => s.fetchIntelligence);
  const error             = useFlowStore(s => s.error);
  const isLoading         = useFlowStore(s => s.isLoading);
<<<<<<< HEAD
  const brokerStatus      = useFlowStore(s => s.brokerStatus);
  const brokerError       = useFlowStore(s => s.brokerError);
  const isMarketClosed    = useFlowStore(s => s.isMarketClosed);

  // Initial load
=======

  // Load data on mount
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
  useEffect(() => {
    fetchIntelligence(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

<<<<<<< HEAD
  // Real-time polling every 5 seconds for live PCR, Support, Resistance & Spot updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchIntelligence(true); // silent background fetch
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchIntelligence]);

=======
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
  return (
    <div className="flex flex-col min-h-full gap-5 pb-12 animate-fade-slide">

      {/* ── Header ── */}
      <FlowHeader />

      {/* ── Broker Expired Warning ── */}
      {brokerStatus === 'expired' && (
        <div className="p-4 rounded-xl border border-[rgba(var(--color-warning),0.4)] bg-[rgba(var(--color-warning),0.09)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-slide shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[rgba(var(--color-warning),0.15)] text-[rgb(var(--color-warning))] shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Broker Connection / Data API Action Required</p>
              <p className="text-xs text-secondary mt-0.5">
                {brokerError || 'Your Dhan SuperAPI session token has expired or Data APIs need activation. Daily re-authentication is required to stream real-time options flow.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/app/settings?tab=brokers"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[rgb(var(--color-warning))] text-black text-xs font-bold hover:opacity-90 transition-opacity"
            >
              <span>Re-authenticate Broker</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => fetchIntelligence(false)}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-primary transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Broker Missing Warning ── */}
      {brokerStatus === 'missing' && (
        <div className="p-4 rounded-xl border border-[rgba(var(--color-iris),0.3)] bg-[rgba(var(--color-iris),0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-slide shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[rgba(var(--color-iris),0.15)] text-[rgb(var(--color-iris))] shrink-0">
              <PlugZap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Broker Connection Required</p>
              <p className="text-xs text-secondary mt-0.5">
                Connect your Dhan SuperAPI in Settings to stream live real-time institutional options flow.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/app/settings?tab=brokers"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[rgb(var(--color-iris))] text-white text-xs font-bold hover:opacity-90 transition-opacity"
            >
              <span>Connect Broker</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Market Closed Notice ── */}
      {isMarketClosed && (
        <div className="px-4 py-3 rounded-xl border border-[rgba(var(--color-border-rgb),0.12)] bg-[rgb(var(--color-surface-1))] flex items-center justify-between gap-3 animate-fade-slide">
          <div className="flex items-center gap-2.5 text-xs text-secondary">
            <Moon className="w-4 h-4 text-[rgb(var(--color-warning))] shrink-0" />
            <span>
              <strong className="text-primary font-semibold">Indian Market is Closed</strong> — Trading hours are Mon–Fri, 09:15 AM to 03:30 PM IST. Displaying closing settlement snapshot.
            </span>
          </div>
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider shrink-0 hidden sm:inline">
            After Hours
          </span>
        </div>
      )}

      {/* ── Generic Error Banner ── */}
      {error && brokerStatus !== 'expired' && brokerStatus !== 'missing' && (
        <div className="p-4 rounded-xl border border-[rgba(var(--color-warning),0.3)] bg-[rgba(var(--color-warning),0.08)] flex items-center justify-between gap-4 animate-fade-slide">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[rgb(var(--color-warning))] shrink-0" />
            <p className="text-sm font-medium text-primary">{error}</p>
          </div>
          <button
            onClick={() => fetchIntelligence(false)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-primary transition-colors disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Retry</span>
          </button>
        </div>
      )}

<<<<<<< HEAD
      {/* ── 5 Stat Cards (Top Row: Market Mood, Support, Resistance, Spot Price, PCR Total) ── */}
      <FlowStatCards />

      {/* ── 3 Force & Market Strength Cards (Middle Row: Bull/Bear Pressure & Strength) ── */}
      <SentimentPanel />

      {/* ── AI Flow Summary (Bottom Row) ── */}
      <FlowNarrative />
=======
      {/* ── 5 Stat Cards ── */}
      <FlowStatCards />

      {/* ── Single Section Content: Market Turnover & AI Flow Narrative ── */}
      <div className="flex flex-col gap-5 animate-fade-slide">
        {/* Market Turnover Panel */}
        <SentimentPanel />

        {/* AI Flow Narrative (Listings) */}
        <FlowNarrative />
      </div>
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
    </div>
  );
}
