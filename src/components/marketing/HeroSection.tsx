import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { container, btnPrimary, btnSecondary, leadClass, SampleTag } from './MarketingBits';
import { ScrollPlane, TypedHeading } from './Perspective';
import { Reveal } from './Typewriter';
import { cn } from '../../lib/cn';

/**
 * Hero: a sample trading session replayed against a ₹2,000 daily loss limit.
 * One timeline drives everything. The line draws, the P&L figure follows the tip of the line,
 * each trade appears as the line reaches it, and the limit breach lights up at the moment it happens.
 */

type Trade = { m: number; time: string; sym: string; pnl: number };
type Rule = { ok: boolean; label: string; detail: string };
type Day = {
  id: 'broke' | 'kept';
  tab: string;
  trades: Trade[];
  rules: Rule[];
  breachIndex: number | null;
  caption: string;
  note: string;
};

const LIMIT = -2000;
const SESSION_MINUTES = 225; // 09:15 to 13:00
const W = 620, H = 244, PAD_L = 76, PAD_R = 80, PAD_T = 18, PAD_B = 30;
const V_MAX = 2400, V_MIN = -4200;
const DELAY = 0.35; // seconds, matches .draw-line
const DRAW = 2.4;

const days: Day[] = [
  {
    id: 'broke',
    tab: 'Broke the rules',
    trades: [
      { m: 16, time: '09:31', sym: 'NIFTY 24100 CE', pnl: 640 },
      { m: 59, time: '10:14', sym: 'BANKNIFTY 51500 PE', pnl: -820 },
      { m: 97, time: '10:52', sym: 'NIFTY 24000 PE', pnl: -1180 },
      { m: 111, time: '11:06', sym: 'BANKNIFTY 51400 CE', pnl: -740 },
      { m: 129, time: '11:24', sym: 'NIFTY 24050 CE', pnl: -640 },
      { m: 175, time: '12:10', sym: 'BANKNIFTY 51300 PE', pnl: -910 },
    ],
    breachIndex: 3,
    caption: 'Limit crossed at 11:06',
    note: 'Both late trades came after the limit was already crossed. Without them the day ends at −₹2,100.',
    rules: [
      { ok: false, label: 'Daily loss limit ₹2,000', detail: 'Crossed at 11:06' },
      { ok: false, label: 'Stop after the limit', detail: '2 more trades, −₹1,550' },
      { ok: false, label: 'Five trades a day', detail: '6 taken' },
    ],
  },
  {
    id: 'kept',
    tab: 'Kept the rules',
    trades: [
      { m: 14, time: '09:29', sym: 'NIFTY 24100 CE', pnl: 380 },
      { m: 41, time: '09:56', sym: 'BANKNIFTY 51500 CE', pnl: 860 },
      { m: 77, time: '10:32', sym: 'NIFTY 24150 PE', pnl: -520 },
      { m: 118, time: '11:13', sym: 'BANKNIFTY 51600 CE', pnl: 1090 },
    ],
    breachIndex: null,
    caption: 'Stopped at the plan',
    note: 'One loss, kept small, and no trade after 11:13. Same market, same setups, different day.',
    rules: [
      { ok: true, label: 'Daily loss limit ₹2,000', detail: 'Worst point −₹520' },
      { ok: true, label: 'Stop after the limit', detail: 'Never reached' },
      { ok: true, label: 'Five trades a day', detail: '4 taken' },
    ],
  },
];

const fmt = (n: number) => `${n < 0 ? '−' : '+'}₹${Math.abs(n).toLocaleString('en-IN')}`;
const px = (m: number) => PAD_L + (m / SESSION_MINUTES) * (W - PAD_L - PAD_R);
const py = (v: number) => PAD_T + ((V_MAX - v) / (V_MAX - V_MIN)) * (H - PAD_T - PAD_B);
const svgText = 'text-[11px] max-sm:text-[16px]';
const mono = 'DM Mono, ui-monospace, monospace';

/** The equity value at the tip of the line, `p` (0 to 1) of the way along its length. */
function valueAt(points: { m: number; v: number }[], cum: number[], p: number) {
  const total = cum[cum.length - 1];
  const target = p * total;
  for (let i = 1; i < cum.length; i++) {
    if (target <= cum[i]) {
      const seg = cum[i] - cum[i - 1] || 1;
      const t = (target - cum[i - 1]) / seg;
      return points[i - 1].v + (points[i].v - points[i - 1].v) * t;
    }
  }
  return points[points.length - 1].v;
}

function SessionPanel() {
  const [dayId, setDayId] = useState<Day['id']>('broke');
  const day = days.find(d => d.id === dayId)!;

  const geo = useMemo(() => {
    let total = 0;
    const points = [{ m: 0, v: 0 }, ...day.trades.map(t => ({ m: t.m, v: (total += t.pnl) }))];
    const cum = [0];
    for (let i = 1; i < points.length; i++) {
      cum.push(cum[i - 1] + Math.hypot(px(points[i].m) - px(points[i - 1].m), py(points[i].v) - py(points[i - 1].v)));
    }
    return { points, cum };
  }, [day]);

  const { points, cum } = geo;
  const end = points[points.length - 1];

  // Drive the headline figure from the same clock as the CSS line animation.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setShown(end.v); return; }
    setShown(0);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, ((now - start) / 1000 - DELAY) / DRAW));
      setShown(Math.round(valueAt(points, cum, p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points, cum, end.v]);

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${px(p.m).toFixed(1)} ${py(p.v).toFixed(1)}`).join(' ');
  const area = `${line} L${px(end.m).toFixed(1)} ${py(0).toFixed(1)} L${px(0).toFixed(1)} ${py(0).toFixed(1)} Z`;
  const breachIdx = day.breachIndex !== null ? day.breachIndex + 1 : null;
  const breach = breachIdx !== null ? points[breachIdx] : null;
  const delayAt = (i: number) => `${(DELAY + DRAW * (cum[i] / cum[cum.length - 1])).toFixed(2)}s`;

  const loss = end.v < 0;
  const live = shown < 0;
  const stroke = loss ? '#EF4444' : '#22C55E';

  return (
    <div className="ink relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-30px_rgb(15_23_42/0.55),0_0_0_1px_rgb(15_23_42/0.05)]">
      <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[var(--brand-green)]/15 blur-[80px]" aria-hidden="true" />

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b ink-line px-5 py-4 sm:px-6">
        <div role="group" aria-label="Choose a sample day" className="flex gap-1 rounded-xl bg-white/5 p-1">
          {days.map(d => (
            <button
              key={d.id}
              onClick={() => setDayId(d.id)}
              aria-pressed={dayId === d.id}
              className={cn(
                'h-8 rounded-lg px-3 text-[13px] font-semibold transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]',
                dayId === d.id ? 'bg-white text-[#0F172A]' : 'text-slate-300 '
              )}
            >
              {d.tab}
            </button>
          ))}
        </div>
        <SampleTag onInk>Sample session · Nifty options</SampleTag>
      </div>

      <div className="relative grid gap-6 px-5 pb-6 pt-5 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
        <div className="min-w-0">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[13px] text-slate-400">Net P&amp;L after charges</p>
            <p
              className="mt-1.5 whitespace-nowrap font-mono-stat text-[34px] font-medium leading-none tracking-tight transition-colors duration-200 sm:text-[44px]"
              style={{ color: live ? '#F87171' : '#4ADE80' }}
              aria-label={`Net P&L ${fmt(end.v)}`}
            >
              <span aria-hidden="true">{shown === 0 ? '₹0' : fmt(shown)}</span>
            </p>
          </div>
          <p className="shrink-0 pb-1 text-right text-[13px] text-slate-400">
            {day.trades.length} trades
            <span className="block text-slate-300">{day.caption}</span>
          </p>
        </div>

        <svg
          key={dayId}
          viewBox={`0 0 ${W} ${H}`}
          className="mt-4 h-auto w-full"
          role="img"
          aria-label={`Sample session. ${day.caption}. Net result ${fmt(end.v)} against a ₹2,000 daily loss limit.`}
        >
          <defs>
            <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={loss ? 0.02 : 0.22} />
              <stop offset="100%" stopColor={stroke} stopOpacity={loss ? 0.22 : 0.02} />
            </linearGradient>
          </defs>

          {breach && breachIdx !== null && (
            <g className="reveal-at" style={{ animationDelay: delayAt(breachIdx) }}>
              <rect x={px(breach.m)} y={PAD_T} width={W - PAD_R - px(breach.m)} height={H - PAD_T - PAD_B} fill="#EF4444" fillOpacity="0.08" />
              <text className={svgText} x={px(breach.m) + 8} y={PAD_T + 14} fill="#F87171" fontFamily={mono}>after the limit</text>
            </g>
          )}

          {[0, LIMIT].map(v => (
            <g key={v}>
              <line x1={PAD_L} x2={W - PAD_R} y1={py(v)} y2={py(v)}
                stroke={v === 0 ? 'rgb(248 250 252 / 0.28)' : '#EF4444'} strokeOpacity={v === 0 ? 1 : 0.7}
                strokeDasharray={v === 0 ? undefined : '4 4'} />
              <text className={svgText} x={PAD_L - 10} y={py(v) + 4} textAnchor="end"
                fill={v === 0 ? '#CBD5E1' : '#F87171'} fontFamily={mono}>
                {v === 0 ? '₹0' : '−₹2,000'}
              </text>
            </g>
          ))}

          <path d={area} fill="url(#heroArea)" className="fill-in" />
          <path d={line} pathLength={1} className="draw-line" fill="none" stroke={stroke} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />

          {points.slice(1).map((p, i) => (
            <circle key={i} cx={px(p.m)} cy={py(p.v)} r="3.5" fill="#0F172A" stroke={stroke} strokeWidth="1.75"
              className="dot-in" style={{ animationDelay: delayAt(i + 1) }} />
          ))}

          {breach && breachIdx !== null && (
            <g>
              <circle cx={px(breach.m)} cy={py(breach.v)} r="6.5" fill="#EF4444" stroke="#0F172A" strokeWidth="2"
                className="dot-in" style={{ animationDelay: delayAt(breachIdx) }} />
              <circle cx={px(breach.m)} cy={py(breach.v)} r="6.5" fill="#EF4444" className="ring-out"
                style={{ animationDelay: delayAt(breachIdx) }} />
            </g>
          )}

          <text className={cn(svgText, 'fill-in')} x={px(end.m) + 10} y={py(end.v) + 4} fill={loss ? '#F87171' : '#4ADE80'} fontFamily={mono}>{fmt(end.v)}</text>

          {([['09:15', 0], ['10:30', 75], ['11:45', 150], ['13:00', SESSION_MINUTES]] as const).map(([t, m]) => (
            <text key={t} className={svgText} x={px(m)} y={H - 8}
              textAnchor={m === 0 ? 'start' : m === SESSION_MINUTES ? 'end' : 'middle'} fill="#94A3B8" fontFamily={mono}>
              {t}
            </text>
          ))}
        </svg>

        </div>

        <div className="min-w-0 lg:pt-1">
        <p className="mb-2 text-[13px] text-slate-400">Trades, as the line reaches them</p>
        <ol className="divide-y ink-line rounded-xl border ink-line bg-white/[0.03]">
          {day.trades.map((t, i) => {
            const isBreach = day.breachIndex === i;
            return (
              <li
                key={`${dayId}-${t.time}`}
                className={cn('reveal-at flex items-center gap-3 px-3.5 py-2 text-[13px]', isBreach && 'bg-[#EF4444]/10')}
                style={{ animationDelay: delayAt(i + 1) }}
              >
                <span className="w-10 shrink-0 font-mono-stat text-slate-400">{t.time}</span>
                <span className="min-w-0 flex-1 truncate text-slate-100">{t.sym}</span>
                {isBreach && <span className="shrink-0 rounded bg-[#EF4444] px-1.5 py-0.5 text-[10.5px] font-semibold text-white">limit</span>}
                <span className={cn('shrink-0 font-mono-stat', t.pnl < 0 ? 'text-[#F87171]' : 'text-[#4ADE80]')}>{fmt(t.pnl)}</span>
              </li>
            );
          })}
        </ol>

        <ul className="mt-4 divide-y ink-line rounded-xl border ink-line bg-white/[0.03]">
          {day.rules.map(r => (
            <li key={r.label} className="flex items-center gap-3 px-4 py-3 text-[14px]">
              <span
                className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full', r.ok ? 'bg-[#22C55E]/15 text-[#4ADE80]' : 'bg-[#EF4444]/15 text-[#F87171]')}
                aria-hidden="true"
              >
                {r.ok ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
              </span>
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-3">
                <p className="text-slate-100">{r.label}</p>
                <p className={cn('font-mono-stat text-[12.5px] sm:text-right', r.ok ? 'text-slate-400' : 'text-[#F87171]')}>{r.detail}</p>
              </div>
              <span className="sr-only">{r.ok ? 'Followed' : 'Broken'}</span>
            </li>
          ))}
        </ul>

        <p key={`note-${dayId}`} className="reveal-at mt-4 flex gap-2.5 text-[13.5px] leading-5 text-slate-300" style={{ animationDelay: `${DELAY + DRAW}s` }}>
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-green)]" aria-hidden="true" />
          <span><span className="font-semibold text-white">Lunar AI</span> {day.note}</span>
        </p>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 sm:pb-28">
      <div className="hero-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="floor-grid pointer-events-none" aria-hidden="true" />

      <div className={cn(container, 'relative pt-12 text-center sm:pt-20')}>
        <TypedHeading
          as="h1"
          trigger="load"
          delay={0.3}
          cps={30}
          className="mx-auto max-w-[1000px] font-display text-[clamp(42px,7.4vw,92px)] font-bold leading-[1.02] tracking-[-0.03em] text-primary"
          style={{ textWrap: 'balance' }}
        >
          Master your trading psychology—in real time.
        </TypedHeading>

        <Reveal as="p" trigger="load" delay={1.2} className={cn(leadClass, 'mx-auto mt-8 max-w-[38rem]')}>
          Most journals only tell you what went wrong after the market closes. RiskRule tracks your behavior, emotions, and discipline live—coaching you before one bad habit ruins your day.
        </Reveal>

        <Reveal trigger="load" delay={1.4} className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-4">
          <Link to="/signup" className={cn(btnPrimary, 'h-12 px-6 text-base')}>
            Start Free
            <ArrowRight size={17} strokeWidth={2} />
          </Link>
          <a href="#leak" className={cn(btnSecondary, 'h-12 px-6 text-base')}>See What Bad Habits Cost Me</a>
        </Reveal>
        <Reveal as="p" trigger="load" delay={1.6} className="mt-4 text-[13px] text-tertiary">Free plan. No credit card needed.</Reveal>
      </div>

      <ScrollPlane className={cn(container, 'relative mt-14 sm:mt-20')} from={{ rotateX: 26, scale: 0.93, y: 70 }} start="top 98%" end="top 38%">
        <div className="mx-auto max-w-[1060px] text-left">
          <SessionPanel />
        </div>
      </ScrollPlane>
    </section>
  );
}
