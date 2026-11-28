import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/analytics';
import type { TradingRules } from '../../types';

function Limit({ label, used, limit, money = false }: { label: string; used: number; limit: number; money?: boolean }) {
  const configured = limit > 0;
  const reached = configured && used >= limit;
  const format = money ? formatCurrency : String;
  return (
    <div>
      <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">
        <span className="text-slate-200">{label}</span>
        <span className="font-medium tabular-nums">{format(used)} <span className="text-slate-300">/ {configured ? format(limit) : 'No limit set'}</span></span>
      </div>
      <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-white/15">
        {configured && <div className={reached ? 'h-full bg-red-400' : 'h-full bg-emerald-400'} style={{ width: Math.min(100, used / limit * 100) + '%' }} />}
      </div>
      {reached && <p className="mt-1 text-xs text-red-200">{used > limit ? 'Above your limit' : 'At your limit'}</p>}
    </div>
  );
}

export default function SessionRisk({ userId, opened, net }: { userId: string; opened: number; net: number }) {
  const rules = useQuery({
    queryKey: ['dashboard-rules', userId], queryFn: () => api.get<TradingRules | null>('/trading-rules'), staleTime: 0,
  });
  return (
    <section className="flex flex-col rounded-xl bg-[var(--workspace-risk-background,#0F172A)] p-5 text-white dark:border dark:border-white/15 sm:p-6" aria-labelledby="session-title">
      <div className="flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-300" /><h2 id="session-title" className="font-semibold">Today’s risk limits</h2></div>
      <p className="mt-6 text-sm text-slate-300">Realized P&amp;L today</p>
      <p className={'mt-1 text-3xl font-semibold tabular-nums ' + (net < 0 ? 'text-red-300' : net > 0 ? 'text-emerald-300' : 'text-white')}>{net > 0 ? '+' : ''}{formatCurrency(net)}</p>
      <div className="my-6 space-y-5 border-t border-white/15 pt-5">
        {rules.isPending ? <p role="status" className="text-sm text-slate-300">Loading limits…</p> : rules.isError ?
          <button onClick={() => rules.refetch()} className="text-sm underline">Could not load limits. Retry</button> : <>
            <Limit label="Trades opened" used={opened} limit={Number(rules.data?.maxTradesPerDay)} />
            <Limit label="Net loss today" used={Math.max(0, -net)} limit={Number(rules.data?.maxDailyLoss)} money />
          </>}
      </div>
      <Link className="mt-auto inline-flex items-center gap-1 self-start text-sm font-medium text-emerald-300 hover:underline" to="/app/settings?tab=rules">Edit trading rules <ArrowUpRight size={16} /></Link>
    </section>
  );
}
