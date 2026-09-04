import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Zap, MessageSquare, ShieldAlert, Cpu, Sparkles,
  Search, Filter, ChevronLeft, ChevronRight, Eye, X,
  Clock, User, BarChart3, AlertTriangle, CheckCircle2,
  TrendingDown, RefreshCw, Layers
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { formatCurrency } from '../../utils/currency';
import AnimatedNumber from '../../components/admin/AnimatedNumber';
import { SkeletonCard, SkeletonTable } from '../../components/admin/SkeletonLoader';

interface AiInsight {
  id: string;
  userId: string;
  type: string | null;
  content: string;
  tradesAnalyzedCount: number | null;
  dateRangeStart: string | null;
  dateRangeEnd: string | null;
  createdAt: string | null;
  user: { id: string; email: string; fullName: string | null };
}

interface ProviderSpec {
  id: string;
  name: string;
  model: string;
  role: string;
  latency: string;
  status: string;
  tokensToday: string;
}

interface BehavioralPattern {
  id: string;
  userId: string;
  user: { id: string; email: string; fullName: string | null };
  patternType: string;
  title: string;
  description: string;
  severity: string;
  count: number;
  previousCount: number;
  avgPnl: number | null;
  detectedAt: string | null;
}

interface AiData {
  insights: AiInsight[];
  total: number;
  page: number;
  limit: number;
  stats: {
    totalInsights: number;
    byType: Record<string, number>;
    totalInterventions: number;
    chatConversations: number;
    chatMessages: number;
    activeProvidersCount: number;
  };
  providers: ProviderSpec[];
  behavioralPatterns: BehavioralPattern[];
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  deep_analysis: { label: 'Deep Analysis', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  analysis: { label: 'Deep Analysis', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  trade_feedback: { label: 'Trade Feedback', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  weekly_digest: { label: 'Weekly Digest', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  pattern_detection: { label: 'Pattern Detection', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  coaching: { label: 'Coaching', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
};

export default function AdminAIMonitor() {
  const [data, setData] = useState<AiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Selected Insight for Full Modal Inspection
  const [selectedInsight, setSelectedInsight] = useState<AiInsight | null>(null);

  const fetchInsights = useCallback(async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (selectedType !== 'all') params.append('type', selectedType);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const result = await api.get<AiData>(`/admin/ai-insights?${params.toString()}`);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch AI insights telemetry');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit, selectedType, searchQuery]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeSince = (date: string | null) => {
    if (!date) return '—';
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) return `${Math.floor(hours / 24)}d ago`;
    if (hours > 0) return `${hours}h ${mins}m ago`;
    return `${mins}m ago`;
  };

  if (loading && !data) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
        <SkeletonTable rows={6} cols={6} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary/60 mb-1">
            <Link to="/app/admin" className="hover:text-primary transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <Link to="/app/admin" className="hover:text-primary transition-colors text-secondary">Admin</Link>
            <span>&gt;</span>
            <span className="text-primary font-medium">AI Coach Monitor</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-indigo-400" />
            AI Behavioral Governance & Model Cockpit
          </h1>
          <p className="text-xs md:text-sm text-secondary">
            Multi-model engine telemetry, trader emotional bias interventions, and automated cognitive journals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-1 border border-border text-xs text-secondary">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Dual Engines Active</span>
          </div>
          <button
            onClick={() => fetchInsights(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-surface-1 hover:bg-surface-2 border border-border text-primary rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-secondary'}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => fetchInsights()} className="underline hover:text-rose-200 text-xs font-semibold">Retry</button>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total Insights */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">Cognitive Insights</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber value={data.stats.totalInsights} className="text-2xl font-bold text-primary" />
              <span className="text-xs text-indigo-400 font-medium">Generated</span>
            </div>
            <p className="text-[11px] text-secondary/60 mt-1">Platform-wide trade evaluations</p>
          </div>

          {/* Card 2: Behavioral Interventions */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">Bias Interventions</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber value={data.stats.totalInterventions} className="text-2xl font-bold text-amber-400" />
              <span className="text-xs text-secondary/70">Incidents</span>
            </div>
            <p className="text-[11px] text-amber-400/80 mt-1">Revenge trading & emotional tilt flagged</p>
          </div>

          {/* Card 3: Trader Chat Coaching */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">AI Chat Dialogues</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">{data.stats.chatConversations}</span>
              <span className="text-xs text-emerald-400 font-medium">({data.stats.chatMessages} msgs)</span>
            </div>
            <p className="text-[11px] text-secondary/60 mt-1">Interactive trader coaching sessions</p>
          </div>

          {/* Card 4: Multi-Model Status */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">Model Telemetry</span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">2 / 2</span>
              <span className="text-xs text-emerald-400 font-medium">100% Online</span>
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-1">Groq LPU + NVIDIA Nemotron</p>
          </div>
        </div>
      )}

      {/* Model Engine Matrix & Behavioral Bias Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Model Engines (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Active Multi-Provider AI Architecture
            </h2>
            <span className="text-[11px] text-secondary/60">Hybrid Low-Latency & Deep Analytical Routing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data?.providers.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-surface/60 border border-border hover:border-border-hover transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${p.id === 'groq' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-primary">{p.name}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {p.status}
                    </span>
                  </div>

                  <p className="text-[11px] font-medium text-secondary">{p.role}</p>
                  <p className="text-[10px] font-mono text-secondary/60 mt-1 truncate bg-surface-1 px-2 py-0.5 rounded border border-border/50 inline-block max-w-full">
                    {p.model}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px]">
                  <span className="text-secondary/70">P95 Latency: <span className="font-mono text-primary font-semibold">{p.latency}</span></span>
                  <span className="text-secondary/70">Tokens: <span className="font-mono text-indigo-400 font-semibold">{p.tokensToday}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Bias Radar (1 Column) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Top Behavioral Bias Detections
            </h2>
            <span className="text-[11px] text-amber-400 font-medium">{data?.behavioralPatterns.length || 0} Patterns</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface/60 border border-border space-y-2.5 max-h-[170px] overflow-y-auto">
            {data?.behavioralPatterns.map((bp) => (
              <div key={bp.id} className="p-2.5 rounded-lg bg-surface-1/60 border border-border/50 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary truncate max-w-[170px]">{bp.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                    {bp.count}x
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-secondary">
                  <span className="truncate">{bp.user?.fullName || bp.user?.email}</span>
                  {bp.avgPnl !== null && (
                    <span className="font-mono text-rose-400 font-medium">Avg: {formatCurrency(bp.avgPnl)}</span>
                  )}
                </div>
              </div>
            ))}

            {(!data?.behavioralPatterns || data.behavioralPatterns.length === 0) && (
              <p className="text-xs text-secondary/60 py-4 text-center">No psychological biases logged yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Insights Explorer & Filter Hub */}
      <div className="space-y-3">
        {/* Single-Row Filter Hub */}
        <div className="p-3 rounded-xl bg-surface/70 backdrop-blur-md border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search AI analysis content, trader name, email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-surface-1/60 border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-primary placeholder-secondary/50 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(1);
              }}
              className="bg-surface-1 border border-border rounded-lg px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Insight Types</option>
              <option value="deep_analysis">Deep Analysis</option>
              <option value="trade_feedback">Trade Feedback</option>
              <option value="weekly_digest">Weekly Digest</option>
              <option value="pattern_detection">Pattern Detection</option>
              <option value="coaching">Coaching</option>
            </select>

            {(searchQuery || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setPage(1);
                }}
                className="px-2.5 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* High-Density Zero-Scroll Table */}
        <div className="bg-surface/70 backdrop-blur-md rounded-xl border border-border overflow-hidden shadow-xl">
          <table className="w-full text-left table-fixed border-collapse">
            <thead className="bg-surface-1/70 text-[11px] font-semibold text-secondary uppercase tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-3 w-[15%]">Timestamp</th>
                <th className="py-3 px-3 w-[18%]">Trader</th>
                <th className="py-3 px-3 w-[15%]">Category</th>
                <th className="py-3 px-3 w-[34%]">AI Synthesis Preview</th>
                <th className="py-3 px-3 w-[10%] text-center">Trades</th>
                <th className="py-3 px-3 w-[8%] text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {data?.insights.map((insight) => {
                const config = TYPE_CONFIG[insight.type || 'analysis'] || TYPE_CONFIG.analysis;
                const cleanSnippet = insight.content
                  .replace(/[*#_`]/g, '')
                  .replace(/\n+/g, ' ')
                  .trim();

                return (
                  <tr key={insight.id} className="hover:bg-surface-1/40 transition-colors group">
                    {/* Timestamp */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="text-primary font-medium block truncate">
                          {formatDate(insight.createdAt)}
                        </span>
                        <span className="text-[10px] text-secondary/60">
                          {getTimeSince(insight.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* Trader */}
                    <td className="py-3 px-3">
                      <Link
                        to={`/app/admin/users/${insight.userId}`}
                        className="group/user block truncate hover:text-indigo-400 transition-colors"
                      >
                        <span className="font-medium text-primary block truncate group-hover/user:text-indigo-400">
                          {insight.user?.fullName || 'Anonymous Trader'}
                        </span>
                        <span className="text-[11px] text-secondary/70 block truncate">
                          {insight.user?.email}
                        </span>
                      </Link>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color} border ${config.border}`}>
                        <Sparkles className="w-2.5 h-2.5" />
                        {config.label}
                      </span>
                    </td>

                    {/* Synthesis Preview */}
                    <td className="py-3 px-3">
                      <p className="text-secondary text-xs truncate max-w-full font-sans" title={cleanSnippet}>
                        {cleanSnippet}
                      </p>
                    </td>

                    {/* Trades Analyzed */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded bg-surface-1 border border-border/60 text-[11px] font-mono text-primary">
                        {insight.tradesAnalyzedCount ?? '—'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedInsight(insight)}
                        className="p-1.5 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border text-secondary hover:text-primary transition-colors inline-flex items-center justify-center"
                        title="View complete AI analysis"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {(!data?.insights || data.insights.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-secondary">
                    <Brain className="w-8 h-8 text-secondary/30 mx-auto mb-2" />
                    <p className="font-medium text-primary">No AI insights found matching query</p>
                    <p className="text-xs text-secondary/70 mt-1">Try resetting search keywords or category filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="px-4 py-2.5 bg-surface-1/50 border-t border-border flex items-center justify-between text-xs text-secondary">
            <span>
              Showing {data?.insights.length ? (page - 1) * limit + 1 : 0} – {Math.min(page * limit, data?.total || 0)} of {data?.total || 0} AI insights
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border text-primary disabled:opacity-30 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-medium text-primary px-1">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border text-primary disabled:opacity-30 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Insight Inspection Dialog Modal */}
      <Dialog.Root open={!!selectedInsight} onOpenChange={(open) => !open && setSelectedInsight(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <Dialog.Content className="pointer-events-auto w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-in">
              {selectedInsight && (
                <>
                  {/* Modal Header */}
                  <div className="flex items-start justify-between border-b border-border/70 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {TYPE_CONFIG[selectedInsight.type || 'analysis']?.label || 'Deep Analysis'}
                        </span>
                        <span className="text-xs text-secondary">
                          Generated {formatDate(selectedInsight.createdAt)}
                        </span>
                      </div>
                      <Dialog.Title className="text-lg font-bold text-primary">
                        AI Behavioral Analysis & Diagnostic
                      </Dialog.Title>
                      <p className="text-xs text-secondary">
                        Trader: <Link to={`/app/admin/users/${selectedInsight.userId}`} className="text-indigo-400 underline">{selectedInsight.user?.fullName || selectedInsight.user?.email}</Link>
                      </p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-1 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Scope & Date Range Badge */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-1/60 border border-border/60 text-xs">
                    <div>
                      <span className="text-secondary/70 block text-[11px]">Trades Analyzed</span>
                      <span className="font-semibold text-primary">{selectedInsight.tradesAnalyzedCount || 'Batch'} executions</span>
                    </div>
                    <div>
                      <span className="text-secondary/70 block text-[11px]">Analysis Date Range</span>
                      <span className="font-mono text-primary text-[11px]">
                        {selectedInsight.dateRangeStart ? new Date(selectedInsight.dateRangeStart).toLocaleDateString('en-IN') : 'All History'}
                        {selectedInsight.dateRangeEnd ? ` → ${new Date(selectedInsight.dateRangeEnd).toLocaleDateString('en-IN')}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Insight Body Content */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">Coach Synthesis & Feedback</h3>
                    <div className="p-4 rounded-xl bg-surface-1/40 border border-border text-xs text-primary leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                      {selectedInsight.content}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/70">
                    <span className="text-[11px] text-secondary/60">ID: {selectedInsight.id}</span>
                    <Dialog.Close asChild>
                      <button className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors">
                        Close
                      </button>
                    </Dialog.Close>
                  </div>
                </>
              )}
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
