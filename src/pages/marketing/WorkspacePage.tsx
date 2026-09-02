import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  TrendingUp, Terminal, Activity, Brain, Shield, BarChart2, BookOpen, 
  AlertCircle, CheckCircle2, ArrowRight, Zap, Target, Sliders, RefreshCw, 
  Layers, Lock, Play, Cpu, ArrowUpRight, ArrowDownRight, Compass
} from 'lucide-react';
import { Reveal, HoverLift, NumberCounter, StaggerContainer, StaggerItem } from '../../components/ui/Motion';
import { cn } from '../../lib/cn';
import TrustTicker from '../../components/marketing/TrustTicker';

type TabType = 'equity' | 'candlestick' | 'journal' | 'aicoach';

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<TabType>('equity');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(4);
  const shouldReduceMotion = useReducedMotion();

  // Interactive Risk Calculator Sandbox States
  const [accountSize, setAccountSize] = useState<number>(100000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [stopLossPips, setStopLossPips] = useState<number>(20);
  const [targetRatio, setTargetRatio] = useState<number>(2.5);

  const maxRiskAmount = (accountSize * riskPercent) / 100;
  const targetProfit = maxRiskAmount * targetRatio;
  const calculatedLots = Number((maxRiskAmount / (stopLossPips * 10)).toFixed(2));
  const maxDrawdownBuffer = (accountSize * 0.05).toFixed(0); // 5% max daily
  const breakevenWinRate = (1 / (1 + targetRatio) * 100).toFixed(1);

  const equityData = [
    { day: 'Day 1', date: 'Oct 02', pnl: '+₹12,400', val: '$102,400', rr: '2.1R', note: 'Disciplined NQ breakout entry' },
    { day: 'Day 15', date: 'Oct 16', pnl: '+₹28,600', val: '$104,200', rr: '1.8R', note: 'Scaled out at targeted resistance' },
    { day: 'Day 30', date: 'Oct 31', pnl: '+₹42,100', val: '$105,800', rr: '3.0R', note: 'A+ Gold reversal setup' },
    { day: 'Day 45', date: 'Nov 14', pnl: '+₹61,350', val: '$107,900', rr: '2.4R', note: 'AI Coach alerted & blocked revenge loss' },
    { day: 'Day 60', date: 'Nov 28', pnl: '+₹84,250', val: '$110,400', rr: '2.8R', note: 'Strict risk rules maintained · All targets met' },
  ];

  const recentTrades = [
    { time: '09:31:14 AM', ticker: 'NQ #Dec24', dir: 'LONG', size: '4 Contracts', rr: '+2.4R', pnl: '+₹32,400', grade: 'A+', verified: true },
    { time: '10:14:02 AM', ticker: 'XAUUSD', dir: 'LONG', size: '2.5 Lots', rr: '+1.8R', pnl: '+₹18,500', grade: 'A', verified: true },
    { time: '11:05:40 AM', ticker: 'ES #Dec24', dir: 'SHORT', size: '3 Contracts', rr: '-1.0R', pnl: '-₹12,000', grade: 'B', verified: true },
    { time: '01:22:15 PM', ticker: 'BTCUSDT', dir: 'LONG', size: '1.2 BTC', rr: '+3.1R', pnl: '+₹46,200', grade: 'A+', verified: true },
  ];

  const selectedPoint = hoveredPoint !== null ? equityData[hoveredPoint] : equityData[4];

  return (
    <div className="w-full relative overflow-hidden bg-canvas text-primary">
      
      {/* ── Page Header / Hero ── */}
      <section className="relative w-full pt-28 sm:pt-36 pb-16 flex flex-col items-center justify-center overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div 
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] max-w-[90vw] h-[400px] rounded-full blur-[140px] opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 80%)' }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-6 flex flex-col items-center text-center z-10">
          
          <Reveal direction="up" delay={0.05}>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6 border border-iris/30 bg-iris/10 text-xs font-semibold text-iris shadow-xs">
              <Terminal size={14} className="text-iris" />
              <span>Institutional Terminal v2.4 · Live Execution Workspace</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.1}>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.08] mb-6">
              The high-frequency command center for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-iris to-success bg-clip-text text-transparent">
                quantitative discipline.
              </span>
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.15}>
            <p className="font-sans text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              Experience the unified trading environment where real-time broker execution, mathematical expectancy tracking, and automated risk lockouts coexist on a single ultra-responsive HUD.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary text-canvas font-bold text-sm shadow-md hover:opacity-95 transition-all"
              >
                <span>Launch Free Terminal</span>
                <ArrowRight size={15} />
              </Link>
              <a
                href="#interactive-sandbox"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface-1/60 text-primary font-semibold text-sm hover:bg-surface-2 transition-all"
              >
                <Sliders size={15} className="text-iris" />
                <span>Test Risk Sandbox</span>
              </a>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── Centerpiece Interactive Terminal Display ── */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 relative z-20 mb-28">
        <Reveal direction="up" delay={0.1}>
          <div className="w-full rounded-[2rem] bg-surface-1 border border-border-hover p-2 sm:p-4 shadow-floating overflow-hidden">
            
            <div className="w-full bg-canvas rounded-[1.5rem] overflow-hidden flex flex-col border border-border">
              
              {/* Workspace Title Bar & Tab Navigation */}
              <div className="min-h-[56px] border-b border-border flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 gap-3 bg-surface-0/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-danger/80" />
                    <div className="w-3 h-3 rounded-full bg-gold/80" />
                    <div className="w-3 h-3 rounded-full bg-success/80" />
                  </div>
                  <span className="text-xs font-mono-stat text-tertiary font-bold pl-2 border-l border-border/60">
                    TERMINAL // LIVE_SESSION_01
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono-stat text-success font-semibold px-2 py-0.5 rounded bg-success/10 border border-success/20">
                    <Zap size={11} /> 0.8ms API LATENCY
                  </span>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center p-1 rounded-xl bg-surface-1 border border-border/80 text-xs font-semibold gap-1 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-start" role="tablist">
                  {[
                    { id: 'equity', label: 'P&L Equity Curve', icon: TrendingUp },
                    { id: 'candlestick', label: 'Chart & Orderflow', icon: BarChart2 },
                    { id: 'journal', label: 'Trade Blotter', icon: BookOpen },
                    { id: 'aicoach', label: 'AI Guardrail Core', icon: Brain, badge: 'LIVE' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      className={cn(
                        "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-display duration-200 min-h-[34px] outline-none focus-ring flex-1 sm:flex-none",
                        activeTab === tab.id 
                          ? "bg-primary text-canvas font-bold shadow-sm" 
                          : "text-secondary hover:text-primary hover:bg-surface-2"
                      )}
                    >
                      <tab.icon size={13} className={activeTab === tab.id ? "text-canvas" : "text-iris"} />
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span className="text-[9px] font-mono-stat font-extrabold bg-success text-canvas px-1 rounded">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab 1: P&L Equity Curve */}
              {activeTab === 'equity' && (
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-surface-1 border border-border">
                      <span className="text-xs text-tertiary font-mono-stat uppercase">Cumulative Net P&L</span>
                      <p className="text-2xl font-bold font-mono-stat text-success mt-1">+₹110,400</p>
                      <span className="text-[11px] text-secondary font-medium">Verified by IBKR & Apex</span>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-1 border border-border">
                      <span className="text-xs text-tertiary font-mono-stat uppercase">Sharpe Ratio</span>
                      <p className="text-2xl font-bold font-mono-stat text-primary mt-1">2.84</p>
                      <span className="text-[11px] text-success font-medium">Top 2% Institutional</span>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-1 border border-border">
                      <span className="text-xs text-tertiary font-mono-stat uppercase">Max Daily Drawdown</span>
                      <p className="text-2xl font-bold font-mono-stat text-primary mt-1">1.2%</p>
                      <span className="text-[11px] text-success font-medium">Well below 5% limit</span>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-1 border border-border">
                      <span className="text-xs text-tertiary font-mono-stat uppercase">Win Rate (Avg R:R)</span>
                      <p className="text-2xl font-bold font-mono-stat text-iris mt-1">68.4% (2.2R)</p>
                      <span className="text-[11px] text-secondary font-medium">Positive Expectancy</span>
                    </div>
                  </div>

                  {/* Visual SVG Interactive Curve */}
                  <div className="w-full h-64 sm:h-80 bg-surface-1/40 rounded-2xl border border-border p-4 relative flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between text-xs font-mono-stat text-tertiary">
                      <span>EQUITY GAIN TRAJECTORY</span>
                      <span className="text-success font-bold">● LIVE TRACKING ON</span>
                    </div>

                    <div className="w-full h-44 relative flex items-end">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(var(--color-success))" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="rgb(var(--color-success))" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 130 Q 100 115 150 95 T 300 60 T 420 30 T 500 10 L 500 150 L 0 150 Z"
                          fill="url(#curveGradient)"
                        />
                        <path
                          d="M 0 130 Q 100 115 150 95 T 300 60 T 420 30 T 500 10"
                          fill="none"
                          stroke="rgb(var(--color-success))"
                          strokeWidth="3"
                        />
                        {/* Interactive Points */}
                        {[
                          { x: 0, y: 130, idx: 0 },
                          { x: 125, y: 105, idx: 1 },
                          { x: 250, y: 75, idx: 2 },
                          { x: 375, y: 40, idx: 3 },
                          { x: 500, y: 10, idx: 4 },
                        ].map(pt => (
                          <circle
                            key={pt.idx}
                            cx={pt.x}
                            cy={pt.y}
                            r={hoveredPoint === pt.idx ? 7 : 4}
                            className={cn(
                              "cursor-pointer transition-all duration-200",
                              hoveredPoint === pt.idx ? "fill-success stroke-canvas stroke-2" : "fill-primary"
                            )}
                            onMouseEnter={() => setHoveredPoint(pt.idx)}
                          />
                        ))}
                      </svg>
                    </div>

                    {/* Point Inspector */}
                    <div className="p-3 rounded-xl bg-surface-0 border border-border flex items-center justify-between text-xs font-mono-stat">
                      <span className="text-secondary font-bold">{selectedPoint.day} ({selectedPoint.date})</span>
                      <span className="text-success font-extrabold">{selectedPoint.pnl} ({selectedPoint.val})</span>
                      <span className="text-tertiary hidden sm:inline">{selectedPoint.note}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Candlestick & Orderflow */}
              {activeTab === 'candlestick' && (
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-iris/15 border border-iris/30 flex items-center justify-center font-bold text-iris">
                        NQ
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-primary">NQ1! E-Mini NASDAQ-100 Futures</h3>
                        <p className="text-xs font-mono-stat text-success flex items-center gap-1.5">
                          <span>20,412.50</span>
                          <span className="text-success">+142.25 (+0.70%)</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono-stat">
                      <span className="px-2.5 py-1 rounded bg-surface-2 text-primary font-bold">1M</span>
                      <span className="px-2.5 py-1 rounded bg-primary text-canvas font-bold">5M</span>
                      <span className="px-2.5 py-1 rounded bg-surface-2 text-primary font-bold">15M</span>
                      <span className="px-2.5 py-1 rounded bg-surface-2 text-primary font-bold">1H</span>
                    </div>
                  </div>

                  {/* Candlestick visual mockup */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 h-64 sm:h-72 bg-surface-1/40 rounded-xl border border-border p-4 flex flex-col justify-between relative">
                      <div className="flex items-center justify-between text-xs text-tertiary font-mono-stat">
                        <span>VOLUME PROFILE & ORDER FLOW DELTA</span>
                        <span className="text-iris">EXECUTION ZONE: 20,380 - 20,410</span>
                      </div>
                      {/* Stylized Bars */}
                      <div className="flex items-end justify-between h-44 gap-1.5 px-2">
                        {[
                          { h: 40, up: true }, { h: 65, up: true }, { h: 30, up: false }, 
                          { h: 80, up: true }, { h: 95, up: true }, { h: 50, up: false }, 
                          { h: 120, up: true }, { h: 110, up: false }, { h: 140, up: true }, 
                          { h: 160, up: true }, { h: 130, up: false }, { h: 175, up: true }
                        ].map((bar, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                            <div 
                              style={{ height: `${bar.h}px` }} 
                              className={cn("w-full max-w-[14px] rounded-sm transition-all", bar.up ? "bg-success" : "bg-danger")} 
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-tertiary font-mono-stat">
                        <span>09:30 AM</span>
                        <span>10:30 AM</span>
                        <span>11:30 AM</span>
                        <span>12:30 PM</span>
                        <span>01:30 PM</span>
                      </div>
                    </div>

                    {/* Live Order Book Simulation */}
                    <div className="lg:col-span-4 p-4 rounded-xl bg-surface-1 border border-border space-y-3 font-mono-stat text-xs">
                      <div className="flex items-center justify-between font-bold text-tertiary border-b border-border pb-2">
                        <span>ASK / BID</span>
                        <span>SIZE</span>
                        <span>ACCUM</span>
                      </div>
                      <div className="space-y-1.5 text-danger">
                        <div className="flex justify-between"><span>20,414.25</span><span>42</span><span className="text-tertiary">142</span></div>
                        <div className="flex justify-between"><span>20,413.50</span><span>28</span><span className="text-tertiary">100</span></div>
                        <div className="flex justify-between font-bold"><span>20,412.75</span><span>15</span><span className="text-tertiary">72</span></div>
                      </div>
                      <div className="py-1 px-2 rounded bg-surface-2 text-center text-primary font-bold">
                        SPREAD: 0.25 (LOW VOLATILITY)
                      </div>
                      <div className="space-y-1.5 text-success">
                        <div className="flex justify-between font-bold"><span>20,412.50</span><span>35</span><span className="text-tertiary">35</span></div>
                        <div className="flex justify-between"><span>20,411.75</span><span>64</span><span className="text-tertiary">99</span></div>
                        <div className="flex justify-between"><span>20,411.00</span><span>82</span><span className="text-tertiary">181</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Trade Blotter */}
              {activeTab === 'journal' && (
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-display font-bold text-base text-primary">Live Executed Trades Blotter</h3>
                    <span className="text-xs font-mono-stat text-success font-semibold">● SYNCED WITH TRADOVATE</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono-stat">
                      <thead>
                        <tr className="border-b border-border/80 text-tertiary uppercase">
                          <th className="py-2.5 px-3">Time</th>
                          <th className="py-2.5 px-3">Symbol</th>
                          <th className="py-2.5 px-3">Direction</th>
                          <th className="py-2.5 px-3">Size</th>
                          <th className="py-2.5 px-3">R:R Delta</th>
                          <th className="py-2.5 px-3">Net P&L</th>
                          <th className="py-2.5 px-3">Discipline</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTrades.map((t, idx) => (
                          <tr key={idx} className="border-b border-border/40 hover:bg-surface-1/80 transition-colors">
                            <td className="py-3 px-3 text-secondary">{t.time}</td>
                            <td className="py-3 px-3 font-bold text-primary">{t.ticker}</td>
                            <td className="py-3 px-3">
                              <span className={cn("px-2 py-0.5 rounded font-extrabold text-[10px]", t.dir === 'LONG' ? "bg-success/15 text-success" : "bg-danger/15 text-danger")}>
                                {t.dir}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-secondary">{t.size}</td>
                            <td className="py-3 px-3 font-semibold text-primary">{t.rr}</td>
                            <td className={cn("py-3 px-3 font-extrabold", t.pnl.startsWith('+') ? "text-success" : "text-danger")}>
                              {t.pnl}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-iris/15 text-iris font-extrabold text-[10px]">
                                GRADE {t.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: AI Guardrail Core */}
              {activeTab === 'aicoach' && (
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="p-5 rounded-2xl bg-surface-1 border border-iris/30 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-iris/15 flex items-center justify-center text-iris shrink-0 font-bold">
                      <Brain size={22} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-iris font-mono-stat">
                        <span>AI BEHAVIORAL INTERVENTION SHIELD</span>
                        <span className="text-success font-bold">ACTIVE · REAL-TIME</span>
                      </div>
                      <p className="text-sm font-medium text-primary leading-relaxed">
                        "Your current session exhibits a <strong className="text-success font-bold">96% discipline score</strong>. No oversized positions, revenge setups, or pre-news FOMC orders have been detected in the last 4 hours."
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono-stat text-tertiary">
                        <span>Max Daily Drawdown Buffer Remaining: <strong className="text-primary">$3,800.00</strong></span>
                        <span>•</span>
                        <span>Tilt Level: <strong className="text-success">0% (Zen)</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </Reveal>
      </section>

      {/* ── Section: Interactive Risk & Contract Sizing Sandbox ── */}
      <section id="interactive-sandbox" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-20 relative z-20 scroll-mt-24">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal direction="up">
            <p className="text-xs font-mono-stat font-bold uppercase tracking-widest text-success mb-2.5">
              Interactive Risk Modeler
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
              Model your risk mathematically before placing orders.
            </h2>
            <p className="text-base sm:text-lg text-secondary leading-relaxed">
              Adjust the interactive sliders below to test contract sizing, allowable daily drawdown, and expected positive expectancy for any account size.
            </p>
          </Reveal>
        </div>

        <Reveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-surface-1 border border-border p-6 sm:p-10 shadow-card">
            
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <span className="font-display font-bold text-base text-primary">Risk Parameters Sandbox</span>
                <span className="text-xs font-mono-stat text-iris font-bold">PROP FIRM COMPLIANT</span>
              </div>

              {/* Slider 1: Account Capital */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono-stat">
                  <span className="text-secondary font-medium">Account Size / Challenge Capital</span>
                  <span className="text-primary font-bold">${accountSize.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={300000}
                  step={10000}
                  value={accountSize}
                  onChange={(e) => setAccountSize(Number(e.target.value))}
                  className="w-full accent-iris cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-tertiary font-mono-stat">
                  <span>$10,000 (Micro)</span>
                  <span>$100,000 (Funded)</span>
                  <span>$300,000 (Institutional)</span>
                </div>
              </div>

              {/* Slider 2: Risk % per Trade */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono-stat">
                  <span className="text-secondary font-medium">Max Risk % per Single Trade</span>
                  <span className="text-primary font-bold">{riskPercent}% (${maxRiskAmount.toLocaleString()})</span>
                </div>
                <input
                  type="range"
                  min={0.25}
                  max={3.0}
                  step={0.25}
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full accent-iris cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-tertiary font-mono-stat">
                  <span>0.25% (Conservative)</span>
                  <span>1.0% (Prop Standard)</span>
                  <span>3.0% (Aggressive)</span>
                </div>
              </div>

              {/* Slider 3: Stop Loss in Points */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono-stat">
                  <span className="text-secondary font-medium">Stop Loss Distance</span>
                  <span className="text-primary font-bold">{stopLossPips} Ticks / Points</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(Number(e.target.value))}
                  className="w-full accent-iris cursor-pointer"
                />
              </div>

              {/* Slider 4: Target Risk-Reward Ratio */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono-stat">
                  <span className="text-secondary font-medium">Target Reward Ratio (R:R)</span>
                  <span className="text-success font-bold">{targetRatio}R (Profit: ${targetProfit.toLocaleString()})</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={5.0}
                  step={0.5}
                  value={targetRatio}
                  onChange={(e) => setTargetRatio(Number(e.target.value))}
                  className="w-full accent-success cursor-pointer"
                />
              </div>

            </div>

            {/* Right Output HUD */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-surface-0 border border-border space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-mono-stat font-extrabold uppercase text-tertiary">Real-time Sizing Output</span>
                <span className="px-2 py-0.5 rounded bg-success/15 text-success text-[10px] font-mono-stat font-bold">CALCULATED</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-1 border border-border">
                  <span className="text-[11px] font-mono-stat text-tertiary uppercase">Max Loss per Trade</span>
                  <p className="text-2xl font-bold font-mono-stat text-danger mt-1">-${maxRiskAmount.toLocaleString()}</p>
                  <span className="text-[10px] text-tertiary">Exactly {riskPercent}% equity</span>
                </div>

                <div className="p-4 rounded-xl bg-surface-1 border border-border">
                  <span className="text-[11px] font-mono-stat text-tertiary uppercase">Target Profit (Win)</span>
                  <p className="text-2xl font-bold font-mono-stat text-success mt-1">+${targetProfit.toLocaleString()}</p>
                  <span className="text-[10px] text-tertiary">{targetRatio}R multiple</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-1 border border-iris/40 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono-stat">
                  <span className="text-secondary font-medium">Recommended Contract Sizing:</span>
                  <span className="text-lg font-bold font-mono-stat text-iris">{calculatedLots} Lots / Contracts</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono-stat">
                  <span className="text-secondary font-medium">Breakeven Win Rate Threshold:</span>
                  <span className="text-xs font-bold font-mono-stat text-primary">{breakevenWinRate}%</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono-stat border-t border-border pt-2">
                  <span className="text-secondary font-medium">Max Daily Loss Threshold (5%):</span>
                  <span className="text-xs font-bold font-mono-stat text-danger">${maxDrawdownBuffer}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-1/50 border border-border/80 text-xs font-mono-stat text-tertiary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                <span>RiskRules automatically locks execution if loss threshold is reached.</span>
              </div>
            </div>

          </div>
        </Reveal>
      </section>

      {/* ── Institutional Broker Integration Marquee ── */}
      <TrustTicker />

      {/* ── Bottom CTA ── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 text-center">
        <Reveal direction="up">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
            Ready to trade with algorithmic discipline?
          </h2>
          <p className="text-base sm:text-lg text-secondary max-w-xl mx-auto mb-8">
            Connect your broker in 30 seconds with read-only security and eliminate psychological tilt forever.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-canvas font-bold text-base shadow-lg hover:opacity-95 transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight size={17} />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface-1 text-primary font-semibold text-base hover:bg-surface-2 transition-all"
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
