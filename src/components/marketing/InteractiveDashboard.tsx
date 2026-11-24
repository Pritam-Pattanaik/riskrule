import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section, textLink } from './MarketingBits';
import { cn } from '../../lib/cn';

type TabType = 'equity' | 'journal' | 'coach';

const equityData = [
  { date: 'Oct 02', pnl: 12400, rr: '2.1R', note: 'Disciplined NIFTY breakout entry' },
  { date: 'Oct 16', pnl: 28600, rr: '1.8R', note: 'Scaled out at targeted resistance' },
  { date: 'Oct 31', pnl: 42100, rr: '3.0R', note: 'A+ BANKNIFTY reversal setup' },
  { date: 'Nov 14', pnl: 61350, rr: '2.4R', note: 'Coach flagged a revenge entry and the trade was skipped' },
  { date: 'Nov 28', pnl: 84250, rr: '2.8R', note: 'Risk rules kept, all targets met' },
];

const journal = [
  { time: '09:31', ticker: 'NIFTY 24100 CE', size: '2 lots', rr: '+2.4R', pnl: 32400, grade: 'A+' },
  { time: '10:14', ticker: 'BANKNIFTY 51500 CE', size: '1 lot', rr: '+1.8R', pnl: 18500, grade: 'A' },
  { time: '11:05', ticker: 'NIFTY 24000 PE', size: '2 lots', rr: '−1.0R', pnl: -12000, grade: 'B' },
];

const fmt = (n: number) => `${n < 0 ? '−' : '+'}₹${Math.abs(n).toLocaleString('en-IN')}`;

// Chart geometry: a zero start, then five evenly spaced checkpoints.
const W = 960, H = 300, PAD_L = 8, PAD_R = 8, PAD_T = 24, PAD_B = 8;
const MAX = 90000;
const plotW = W - PAD_L - PAD_R;
const cx = (i: number) => PAD_L + ((i + 0.5) / equityData.length) * plotW;
const cy = (v: number) => PAD_T + (1 - v / MAX) * (H - PAD_T - PAD_B);
const pts = [{ x: PAD_L, y: cy(0) }, ...equityData.map((d, i) => ({ x: cx(i), y: cy(d.pnl) }))];
const line = pts.reduce((d, p, i) => {
  if (i === 0) return `M${p.x},${p.y}`;
  const q = pts[i - 1];
  const m = (q.x + p.x) / 2;
  return `${d} C${m},${q.y} ${m},${p.y} ${p.x},${p.y}`;
}, '');
const area = `${line} L${pts[pts.length - 1].x},${cy(0)} L${PAD_L},${cy(0)} Z`;

const tabs: { id: TabType; label: string }[] = [
  { id: 'equity', label: 'Equity curve' },
  { id: 'journal', label: 'Trade journal' },
  { id: 'coach', label: 'AI coach' },
];

export default function InteractiveDashboard({ showLink = true }: { showLink?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabType>('equity');
  const [selected, setSelected] = useState(4);
  const plot = useRef<HTMLDivElement>(null);
  const point = equityData[selected];

  const pick = (clientX: number) => {
    const box = plot.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((clientX - box.left) / box.width) * W;
    let best = 0;
    equityData.forEach((_, i) => {
      if (Math.abs(cx(i) - x) < Math.abs(cx(best) - x)) best = i;
    });
    setSelected(best);
  };

  return (
    <Section
      id="workspace"
      title="Your whole day in one workspace"
      lead="Switch between the equity curve, the trade journal and the coach’s notes. Everything shown here is sample data."
    >
      <div className="ink relative overflow-hidden rounded-3xl border ink-line shadow-raised">
        <div className="pointer-events-none absolute -top-24 left-0 h-64 w-[30rem] rounded-full bg-[var(--brand-green)]/15 blur-[110px]" aria-hidden="true" />

        {/* Tabs */}
        <div className="relative flex items-center justify-between gap-4 px-5 pt-5 sm:px-9 sm:pt-7">
          <div role="tablist" aria-label="Workspace views" className="scrollbar-none -mx-1 flex gap-0.5 overflow-x-auto px-1 sm:gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'h-9 whitespace-nowrap rounded-full px-3 text-[13px] font-semibold transition-colors duration-150 sm:px-4 sm:text-[13.5px]',
                  activeTab === tab.id ? 'bg-white text-slate-900' : 'text-slate-400 ',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <p className="hidden text-[13px] text-slate-500 sm:block">Sample data</p>
        </div>

        <div className="relative px-5 pb-6 pt-6 sm:px-9 sm:pb-9 sm:pt-8">
          {activeTab === 'equity' && (
            <div id="panel-equity" role="tabpanel" aria-label="Equity curve">
              <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
                <div>
                  <p className="text-[14px] text-slate-400">Net P&amp;L to {point.date}</p>
                  <p className="mt-2 font-display text-[52px] font-bold leading-none tracking-[-0.03em] text-[#4ADE80] tabular-nums sm:text-[84px]">
                    {fmt(point.pnl)}
                  </p>
                </div>
                <dl className="flex gap-7 sm:gap-12">
                  {[
                    { k: 'Win rate', v: '68.4%' },
                    { k: 'Risk to reward', v: point.rr },
                    { k: 'Discipline', v: '98.2' },
                  ].map(s => (
                    <div key={s.k}>
                      <dt className="text-[13px] text-slate-400">{s.k}</dt>
                      <dd className="mt-1 font-display text-[22px] font-semibold tabular-nums text-white sm:text-[28px]">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Chart. Hover or tap anywhere to move along the curve. */}
              <div
                ref={plot}
                className="relative mt-8 cursor-crosshair touch-pan-y select-none sm:mt-10"
                onPointerMove={e => pick(e.clientX)}
                onPointerDown={e => pick(e.clientX)}
              >
                <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Cumulative P&L rising across five checkpoints">
                  <defs>
                    <linearGradient id="wsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 40000, 80000].map(v => (
                    <line key={v} x1={PAD_L} x2={W - PAD_R} y1={cy(v)} y2={cy(v)} stroke="#F8FAFC" strokeOpacity={v === 0 ? 0.22 : 0.07} strokeDasharray={v === 0 ? undefined : '3 6'} />
                  ))}
                  <path d={area} fill="url(#wsFill)" />
                  <path d={line} fill="none" stroke="#22C55E" strokeOpacity="0.35" strokeWidth="9" strokeLinecap="round" style={{ filter: 'blur(7px)' }} />
                  <path d={line} fill="none" stroke="#4ADE80" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                  <line x1={cx(selected)} x2={cx(selected)} y1={PAD_T - 8} y2={cy(0)} stroke="#F8FAFC" strokeOpacity="0.28" strokeDasharray="4 5" />
                  {equityData.map((d, i) => (
                    <circle key={d.date} cx={cx(i)} cy={cy(d.pnl)} r={i === selected ? 7 : 4} fill={i === selected ? '#4ADE80' : '#0F172A'} stroke="#4ADE80" strokeWidth="2.5" />
                  ))}
                </svg>

                {/* Value tag that follows the selected point */}
                <div
                  className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[12px] font-semibold tabular-nums text-slate-900 shadow-lg transition-[left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ left: `${(cx(selected) / W) * 100}%` }}
                >
                  {fmt(point.pnl)}
                </div>
              </div>

              <div className="relative mt-3 grid grid-cols-5" style={{ marginLeft: `${(PAD_L / W) * 100}%`, marginRight: `${(PAD_R / W) * 100}%` }}>
                {equityData.map((d, i) => (
                  <button
                    key={d.date}
                    onClick={() => setSelected(i)}
                    aria-pressed={selected === i}
                    className={cn(
                      'h-8 rounded-md text-[13px] tabular-nums transition-colors duration-150',
                      selected === i ? 'font-semibold text-white' : 'text-slate-500 ',
                    )}
                  >
                    {d.date}
                  </button>
                ))}
              </div>

              <p className="mt-5 border-t ink-line pt-5 text-[15.5px] leading-6 text-slate-300">
                <span className="font-semibold text-white">{point.date}</span>
                <span className="mx-2 text-slate-600" aria-hidden="true">/</span>
                {point.note}
              </p>
            </div>
          )}

          {activeTab === 'journal' && (
            <div id="panel-journal" role="tabpanel" aria-label="Trade journal">
              <p className="text-[14px] text-slate-400">Today’s trades</p>
              <ul className="mt-4 divide-y divide-white/10">
                {journal.map(t => (
                  <li key={t.time} className="flex items-center justify-between gap-4 py-5">
                    <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                      <span className="hidden w-12 shrink-0 text-[14px] tabular-nums text-slate-500 sm:block">{t.time}</span>
                      <div className="min-w-0">
                        <p className="text-[16px] font-semibold leading-snug text-white sm:text-[19px]">{t.ticker}</p>
                        <p className="mt-0.5 text-[13px] text-slate-400"><span className="sm:hidden">{t.time} · </span>{t.size} · {t.rr} · Grade {t.grade}</p>
                      </div>
                    </div>
                    <p className={cn('shrink-0 font-display text-[19px] font-semibold tabular-nums sm:text-[30px]', t.pnl >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]')}>
                      {fmt(t.pnl)}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-2 border-t ink-line pt-5 text-[13.5px] text-slate-400">Import fills from a supported broker or enter trades manually.</p>
            </div>
          )}

          {activeTab === 'coach' && (
            <div id="panel-coach" role="tabpanel" aria-label="AI coach" className="max-w-2xl">
              <ul className="divide-y divide-white/10">
                <li className="pb-6">
                  <p className="flex items-center justify-between text-[14px]">
                    <span className="flex items-center gap-2 font-semibold text-white">
                      <span className="h-2 w-2 rounded-full bg-[#F87171]" aria-hidden="true" />
                      Rule 4 broken
                    </span>
                    <span className="tabular-nums text-slate-500">11:08</span>
                  </p>
                  <p className="mt-3 text-[17px] leading-7 text-slate-300">
                    You opened a BANKNIFTY position 140 seconds after stopping out of NIFTY. Your cooling-off rule calls for a pause after a loss.
                  </p>
                </li>
                <li className="pt-6">
                  <p className="flex items-center justify-between text-[14px]">
                    <span className="flex items-center gap-2 font-semibold text-white">
                      <span className="h-2 w-2 rounded-full bg-[#4ADE80]" aria-hidden="true" />
                      Suggested pause
                    </span>
                    <span className="tabular-nums text-slate-500">30 min</span>
                  </p>
                  <p className="mt-3 text-[17px] leading-7 text-slate-300">
                    Take a 30-minute break and review your daily P&amp;L before your next trade.
                  </p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {showLink && (
        <div className="mt-6">
          <Link to="/workspace" className={textLink}>
            Open the workspace
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      )}
    </Section>
  );
}
