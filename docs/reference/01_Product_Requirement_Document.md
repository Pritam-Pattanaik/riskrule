# TradeVault — Flow Intelligence
## Product Requirements Document (PRD) v1.0
### Options Intelligence Platform — Full Research & Discovery Sprint

> **Document Status:** Approved — Engineering Blueprint Generated
> **Author:** Product Discovery Sprint (AI-Led Research)
> **Date:** August 2026
> **Version:** 1.0.0
> **Classification:** Internal — Confidential
> **Implementation Guide:** [`02_Engineering_Master_Blueprint.md`](./02_Engineering_Master_Blueprint.md) — Read this after the PRD for all engineering, UI/UX, QA, DevOps, and AI implementation decisions.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Philosophy](#2-product-vision--philosophy)
3. [Market Research & Competitor Analysis](#3-market-research--competitor-analysis)
4. [Market Gap Analysis](#4-market-gap-analysis)
5. [User Research & Personas](#5-user-research--personas)
6. [User Journey Maps](#6-user-journey-maps)
7. [Information Architecture & Naming](#7-information-architecture--naming)
8. [UX Strategy & Cognitive Load Design](#8-ux-strategy--cognitive-load-design)
9. [Design System & Visual Language](#9-design-system--visual-language)
10. [AI Strategy](#10-ai-strategy)
11. [Feature Specification](#11-feature-specification)
12. [Backend Engineering Architecture](#12-backend-engineering-architecture)
13. [Data Flow & API Requirements](#13-data-flow--api-requirements)
14. [Database Design](#14-database-design)
15. [Performance Targets](#15-performance-targets)
16. [Security Requirements](#16-security-requirements)
17. [QA Strategy & Testing Matrix](#17-qa-strategy--testing-matrix)
18. [Production Readiness](#18-production-readiness)
19. [Feature Roadmap](#19-feature-roadmap)
20. [Risk Assessment](#20-risk-assessment)
21. [Success Metrics](#21-success-metrics)
22. [Research Gaps & Open Questions](#22-research-gaps--open-questions)
23. [Appendix](#23-appendix)

---

# 1. Executive Summary

## 1.1 The Problem

Options traders in India are drowning in data, not insights.

Every single day, millions of traders open 4–6 different platforms — Zerodha Kite for execution, Opstra for OI analysis, Sensibull for strategy building, TradingView for charting, Moneycontrol for news — just to answer one simple question:

**"What is the market doing today, and what should I do about it?"**

This is broken. And it is completely unnecessary.

The cost of this fragmentation is not just inconvenience. It is cognitive overload, decision fatigue, missed opportunities, and ultimately, money lost.

## 1.2 The Opportunity

TradeVault already has something no competitor has: **the user's own trading history, journal, and performance context**.

By combining this with institutional-grade options analytics and a world-class AI layer, TradeVault can become the first platform that answers not just *what* the market is doing, but *what it means specifically for this trader and their open positions*.

## 1.3 The Solution

**Flow Intelligence** — TradeVault's flagship Options Intelligence workspace.

Not a chart. Not a table. Not another option chain.

A living, breathing intelligence workspace that synthesizes:

- Open Interest & OI Change (with institutional context)
- Option Chain (contextual, not raw)
- Smart Money & Institutional Flow
- PCR, Max Pain, IV, IV Skew
- Greeks (Delta, Gamma, Theta, Vega, Rho)
- Market Breadth & Market Structure
- AI-powered narrative and diagnostics
- User's personal trading history and journal

Into one premium, fast, elegant workspace that tells traders:

> **"Here's what happened. Here's why. Here's what matters right now. Here's what to watch next."**

## 1.4 The Ambition

When a trader wakes up at 8:45 AM and asks "What's happening in the market today?" — the answer should be Flow Intelligence.

Not Bloomberg. Not NSE website. Not WhatsApp groups.

**TradeVault.**

---

# 2. Product Vision & Philosophy

## 2.1 Vision Statement

> To become the most trusted daily workspace for options traders — a platform that reduces cognitive load, amplifies intelligence, and makes professional-grade market understanding accessible to every trader.

## 2.2 Mission

> Build the clearest, most intelligent options analysis experience in the world — combining institutional data, AI reasoning, and personal trading context into one elegant, fast, opinionated workspace.

## 2.3 Core Philosophy — The Five Laws

### Law 1: Intelligence Over Data
We never show raw data for the sake of showing data. Every number must carry meaning. Every metric must tell a story. If we cannot explain why a piece of data is on screen, it does not belong there.

### Law 2: Context Before Complexity
Beginners and experts share the same interface. The surface must be scannable in 5 seconds. The depth must satisfy a quant analyst. This is achieved through progressive disclosure — not multiple products.

### Law 3: Opinionated by Default
Flow Intelligence makes a call. It does not hedge its bets across 10 indicators and leave the user paralyzed. The AI takes a position. The data supports it. The user can override it.

### Law 4: Personal Before Generic
Every insight knows who is looking at it. A trader with 40% win rate on Nifty Put buys gets different insights than a delta-neutral seller. The context of the individual is always the primary lens.

### Law 5: Speed is a Feature
Sub-second first meaningful paint. Sub-100ms data refresh. Any interaction that feels slow is a bug. Performance is not an optimization — it is a core product requirement.

## 2.4 Product Principles

| Principle | Description |
|-----------|-------------|
| **Scan in 5 seconds** | Critical market state must be graspable in one glance |
| **One truth per view** | Never show two conflicting signals without reconciling them |
| **Earn the click** | Every drill-down must deliver something the surface could not |
| **Silent confidence** | The UI never panics, never flickers, never shows loading where it shouldn't |
| **Contextual by default** | The platform knows your positions, your history, your style |
| **No jargon gates** | Hover any metric for a plain-English explanation |

## 2.5 North Star Metric

> **Daily Active Traders (DAT)** who open Flow Intelligence before placing their first options trade of the day.

Target: 60% of all TradeVault options traders open Flow Intelligence on any given trading day within 90 days of launch.

## 2.6 Secondary Metrics

- Average session length > 8 minutes during market hours
- AI summary interaction rate > 45%
- User-reported confidence score (post-session survey) ≥ 8/10
- Week-over-week retention > 70% for options traders
- NPS ≥ 65 within first quarter

---

# 3. Market Research & Competitor Analysis

## 3.1 Research Methodology

Research conducted across:
- Platform walkthroughs and feature audits (direct product testing)
- Reddit threads: r/IndiaInvestments, r/Zerodha, r/options, r/IndianStreetBets
- Twitter/X trading community sentiment
- Trustpilot and Google Play reviews
- YouTube trader workflow videos
- Professional trader forums and Discord communities
- Published UX research on trading platform cognition

---

## 3.2 Competitor Profiles

### 3.2.1 Zerodha Kite

**Category:** Broker-execution platform  
**Primary Audience:** All retail Indian traders  
**Market Position:** Dominant. ~6 million active users.

| Dimension | Analysis |
|-----------|----------|
| **Features** | Option chain, basket orders, basic Greeks display, SL-M orders |
| **OI Visualization** | Basic table — no heatmap, no historical OI chart |
| **UI/UX** | Clean, minimal — praised for simplicity |
| **Performance** | Generally fast; crashes on heavy expiry days |
| **AI** | None (as of 2026) |
| **Pricing** | Free (broker revenue from brokerage) |

**Strengths:**
- Most trusted brand in Indian retail trading
- Seamless execution
- Kite Connect API ecosystem for developers
- Extremely reliable for order placement

**Weaknesses:**
- Zero intelligence layer — purely execution
- Option chain freezes during peak Nifty expiry volume
- No OI heatmap, no PCR dashboard, no IV surface
- Order placement UI criticized for "fat finger" risks after recent redesigns
- No personalization, no history context

**User Complaints (Direct quotes from r/Zerodha, 2025):**
- *"The option chain lags so badly on Thursday that I've missed entries multiple times"*
- *"Kite is great for execution but completely useless for analysis — I need 3 other apps"*
- *"They removed features that people actually used and added features no one asked for"*

**Gap:** Pure executor. No analytical intelligence. Users must leave the platform to understand the market.

---

### 3.2.2 Sensibull

**Category:** Options analytics & strategy building  
**Primary Audience:** Beginner to intermediate options traders  
**Market Position:** Category leader for guided options trading

| Dimension | Analysis |
|-----------|----------|
| **Features** | Strategy builder, payoff graphs, paper trading, OI data, PCR, broker integration |
| **OI Visualization** | Bar chart OI visualization — adequate but not premium |
| **UI/UX** | Polished, beginner-friendly, guided experience |
| **Performance** | Browser performance degrades with multiple strategies open |
| **AI** | Limited — basic strategy suggestions |
| **Pricing** | ₹2,999/month premium |

**Strengths:**
- Best broker integration in the market (Zerodha, Angel One, Upstox, ICICI)
- Strategy builder is best-in-class for retail
- Beginner experience is genuinely excellent
- Paper trading is a differentiator

**Weaknesses:**
- Shallow OI analysis — no institutional context
- IV surface analysis is basic
- No AI narrative or market summary
- Performance issues with complex multi-leg strategies
- No personalization or trading history integration
- P&L projections criticized for not accounting for real-time IV shifts

**User Complaints:**
- *"The site becomes unusable when I have 4-5 strategies open simultaneously"*
- *"They show OI but don't tell me what it means in the current context"*
- *"I wish it connected to my trade journal somehow"*

**Gap:** Excellent at strategy construction but blind on market intelligence. Zero AI narrative. No personalization.

---

### 3.2.3 Opstra (Definedge)

**Category:** Professional options analytics  
**Primary Audience:** Intermediate to advanced traders and quant analysts  
**Market Position:** Premium analytics layer used by serious traders

| Dimension | Analysis |
|-----------|----------|
| **Features** | IV surface, strategy backtesting, Greeks, OI analysis, max pain, PCR decomposition, intraday replay |
| **OI Visualization** | Superior — historical OI charts, strike-level OI change tracking |
| **UI/UX** | Dense, data-rich — steep learning curve |
| **Performance** | Adequate for analysis; not optimized for speed |
| **AI** | Minimal — no narrative intelligence |
| **Pricing** | ₹1,799–₹4,999/month depending on plan |

**Strengths:**
- Deepest options analytics available in India
- IV volatility surface is industry-leading
- Historical OI data and intraday strategy replay
- Multi-leg strategy simulation
- Strong community of quant traders

**Weaknesses:**
- Overwhelming for anyone below advanced level
- UI/UX is 2015-era design — no modern premium feel
- No AI layer to translate data into narrative
- No integration with user's personal trade history
- No real-time collaborative features
- Mobile experience is poor

**User Complaints:**
- *"The amount of useful data on Opstra is unreal but it takes 2 hours to understand what it's telling you"*
- *"Why does a platform that charges ₹5k/month look like it was built in 2014?"*
- *"I use Opstra for analysis and then have to switch to another app to actually trade"*

**Gap:** Data-rich but insight-poor. No AI translation layer. Design is a liability. No personal context.

---

### 3.2.4 Strike Money

**Category:** Holistic market analytics  
**Primary Audience:** Intermediate traders wanting cross-asset view  
**Market Position:** Growing challenger, popular for market-wide context

| Dimension | Analysis |
|-----------|----------|
| **Features** | Options scanner, OI heatmap, sector rotation, stock screeners, market sentiment heatmaps |
| **OI Visualization** | Heatmap-based — visually strong |
| **UI/UX** | Modern, dark-themed, reasonably well-designed |
| **Performance** | Good for web, mobile needs work |
| **AI** | Basic pattern labels, no deep narrative |
| **Pricing** | ₹999–₹2,499/month |

**Strengths:**
- Best OI heatmap visualization among Indian platforms
- Cross-asset lens (equities + options + futures)
- Modern visual design — closest to premium SaaS
- Market scanners are genuinely useful

**Weaknesses:**
- Not specialized enough for pure options traders
- AI is surface-level — labels without context
- No personal trading history integration
- No strategy builder
- Backtesting is limited

**Gap:** Good visual design but lacks depth. No AI narrative layer. No personal context. Not specialized enough.

---

### 3.2.5 Dhan

**Category:** Broker + analytics hybrid  
**Primary Audience:** Active F&O traders  
**Market Position:** Fast-growing execution + data platform

| Dimension | Analysis |
|-----------|----------|
| **Features** | Advanced order types (Iceberg, Super Orders), options chain, TradingView integration, Option Basket |
| **OI Visualization** | Basic chart — not analytical |
| **UI/UX** | Feature-rich but criticized for clutter |
| **Performance** | Generally good; execution speed praised |
| **AI** | None meaningful |
| **Pricing** | Free (broker revenue) |

**Strengths:**
- Advanced order types that Zerodha lacks
- TradingView integration is seamless
- Strong execution speed
- Growing rapidly in features

**Weaknesses:**
- Interface criticized as "cluttered" and non-cohesive
- Analytics layer is superficial
- No genuine options intelligence features
- UX inconsistencies between mobile and web
- Feature bloat without strategic direction

**Gap:** Good executor, poor analyst. UI needs discipline. Zero intelligence layer.

---

### 3.2.6 Groww

**Category:** Mass-market investment platform  
**Primary Audience:** Beginners, mutual fund investors  
**Market Position:** Largest retail investment platform by user count

| Dimension | Analysis |
|-----------|----------|
| **Features** | Basic F&O support, simplified options chain |
| **OI Visualization** | Minimal |
| **UI/UX** | Extremely simplified — intentionally limits complexity |
| **AI** | None for trading |
| **Pricing** | Free |

**Assessment:** Not a competitor for advanced options analytics. Serves a different audience entirely. The simplicity that makes Groww great for mutual funds makes it inadequate for F&O traders.

---

### 3.2.7 NSE Option Chain (Official)

**Category:** Exchange data source  
**Primary Audience:** All options traders (used as reference)

| Dimension | Analysis |
|-----------|----------|
| **UI/UX** | Functional but dated — government portal aesthetic |
| **Performance** | Slow, especially during high traffic |
| **Intelligence** | Zero |
| **Data Accuracy** | Authoritative (exchange source) but 3-5 minute delay |

**Assessment:** Every trader opens this at least once per day. This tells us users are desperate enough to use a government portal. The opportunity to replace this habit is massive.

---

### 3.2.8 ChartInk

**Category:** Stock screener and technical analysis  
**Primary Audience:** Technical traders  
**Market Position:** Dominant for scanner-based workflows

**Assessment:** Strong for technical screening. Weak on options-specific analytics. Not a direct competitor but overlaps in the "pre-trade research" workflow.

---

### 3.2.9 TradingView (Global)

**Category:** Charting & analysis platform  
**Primary Audience:** Global traders across all asset classes  
**Market Position:** Global standard for charting

| Dimension | Analysis |
|-----------|----------|
| **Features** | World-class charting, community ideas, Pine Script, broker integration |
| **OI Visualization** | Limited native support — requires custom indicators |
| **UI/UX** | Premium, modern, dark — industry design benchmark |
| **Performance** | Generally excellent |
| **AI** | AI trend summaries (beta) |
| **Pricing** | Free to ₹5,000+/month |

**Key Learnings:**
- TradingView's UI is the design benchmark for all trading platforms
- Their progressive disclosure (light surface, deep drill-down) is best in class
- The community / idea-sharing is a powerful engagement mechanic
- Pine Script creates developer lock-in that is highly valuable

**Gap from our perspective:** TradingView does not integrate with user trade journals, has no Indian-specific options analytics, and has no personalization based on individual trading history.

---

### 3.2.10 Bloomberg Terminal (Global Institutional Reference)

**Assessment:** The gold standard for institutional data. Extremely high density, extremely high learning curve, $25,000+/year. The "Bloomberg for retail" positioning is aspirational but the design philosophy of high information density + keyboard-first + uncompromising data integrity is directionally correct for the power user segment of Flow Intelligence.

---

## 3.3 Competitive Matrix

| Platform | OI Analytics | AI Narrative | Personal Context | Premium UI | IV Surface | PCR Depth | Mobile | Price Range |
|----------|-------------|--------------|-----------------|------------|------------|-----------|--------|-------------|
| **Flow Intelligence** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Bundled |
| Zerodha Kite | ⭐ | ⭐ | ⭐ | ⭐⭐⭐ | ⭐ | ⭐ | ⭐⭐⭐⭐ | Free |
| Sensibull | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ₹2,999/mo |
| Opstra | ⭐⭐⭐⭐⭐ | ⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ₹4,999/mo |
| Strike Money | ⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ₹2,499/mo |
| Dhan | ⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐ | ⭐⭐⭐⭐ | Free |
| TradingView | ⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐⭐ | ₹5,000+/mo |

---

# 4. Market Gap Analysis

## 4.1 The Five Fundamental Gaps in the Market

### Gap 1: The Translation Gap

**Evidence:** Every platform shows OI data. No platform tells you what it means in today's context.

Traders receive a number: "Nifty 23,000 CE OI: 1,24,65,000"

What does that mean today? Is it a resistance? Is it being aggressively built or unwound? Is it institutional positioning or retail speculation? Is it more relevant than the OI from yesterday? What happened to this OI in the last 30 minutes?

**No platform answers these questions automatically.**

Users are forced to interpret raw numbers through the lens of frameworks they may have learned years ago, without validation, without context, without knowing if their interpretation matches the current market regime.

**Flow Intelligence's answer:** Every metric is accompanied by a narrative interpretation. The AI does not just label data — it translates it.

---

### Gap 2: The Personalization Gap

**Evidence:** Every trader gets the same Opstra screen. The quant with 500 Iron Condors sees the same interface as the retail buyer who just bought 1 Nifty CE lot.

No platform understands:
- What the user's open positions are
- What their historical performance on specific strategies looks like
- What their risk profile is
- What they have been writing in their journal
- What mistakes they repeatedly make

**Flow Intelligence's answer:** The AI layer reads the user's TradeVault trade history, journal entries, and active positions. Insights are generated *in the context of the specific user*.

"You have 3 Nifty CE positions open. Today's OI buildup at your strike suggests strong resistance. Based on your past 12 similar trades, you have a 27% win rate when you hold through this pattern. Here are your options."

This is not possible on any competitor platform.

---

### Gap 3: The Fragmentation Gap

**Evidence:** Power users use 4–6 tools simultaneously.

Typical workflow of a serious Indian options trader:
1. NSE Option Chain → PCR and OI reference
2. Opstra → OI heatmap and IV surface
3. TradingView → Chart context
4. Sensibull → Strategy payoff builder
5. Zerodha → Execution
6. Moneycontrol/CNBC → News and macro context

This is the most expensive workflow in retail trading. Not in money — in time, cognitive load, and context-switching cost.

**Flow Intelligence's answer:** One workspace. All data. Zero platform-switching for the analytical phase.

---

### Gap 4: The Cognitive Load Gap

**Evidence:** Opstra is widely acknowledged as having the best data. It is also widely acknowledged as overwhelming. Users describe it as "taking 2 hours to understand what it's telling you."

The market is failing the user by presenting institutional-grade data in an institutional-grade UI that assumes institutional-grade training.

**Flow Intelligence's answer:** Progressive disclosure by design. The top of the screen answers "What should I know right now?" The bottom of the screen answers "How deep can I go?" The user controls the depth.

---

### Gap 5: The Temporal Gap

**Evidence:** Most platforms show the current state of the market. Very few show how the market *changed* over time in a meaningful, visual way.

Traders want to know:
- How has OI at the 23,000 CE changed throughout today?
- Was there a sudden buildup after the 11 AM news?
- Is the IV spike happening only on short-dated options or across the board?
- How does today's PCR compare to the last 5 Nifty expiry days at this time?

**Flow Intelligence's answer:** Every metric is time-aware. Historical comparison is always one click away. Intraday OI change visualization is a first-class feature, not a buried analysis tool.

---

## 4.2 Secondary Gaps

| Gap | Description | Our Solution |
|-----|-------------|--------------|
| **Speed Gap** | Option chains freeze on expiry days | Architecture built for scale — "Poll once, broadcast many" |
| **Mobile Gap** | All serious options tools are desktop-first | Responsive-first design, mobile-adaptive layout |
| **Education Gap** | Users don't know what they don't know | Contextual tooltips, "explain this" AI button on every metric |
| **Night Review Gap** | No tool helps with post-market analysis routine | After-hours mode with historical replay and next-day scenario modeling |
| **Alert Gap** | OI alerts are rare and basic | Smart alerts: OI buildup threshold, IV spike, PCR extreme, max pain proximity |
| **Community Gap** | No way to see what smart traders are watching | Curated institutional flow events — not social media noise |

---

# 5. User Research & Personas

## 5.1 Persona Profiles

---

### Persona 1: Arjun — The Intraday Option Buyer

**Age:** 28 | **Experience:** 2 years | **City:** Mumbai | **Capital:** ₹3–5L

**Profile:** Arjun buys Nifty/BankNifty options intraday. He primarily buys CE or PE based on market direction. He loses money consistently because he buys the wrong strikes, at the wrong time, with poor timing on IV expansion.

**Goals:**
- Find the right strike to buy in the morning
- Know when to exit before time decay destroys his position
- Understand why his option is losing even when the market moves in his direction (IV crush)

**Pain Points:**
- Does not understand IV — buys during IV spikes, gets crushed on IV normalization
- Switches between 4 apps, loses focus and clarity
- Cannot identify support/resistance levels from OI data
- Emotional — holds losers too long, cuts winners too early

**Daily Workflow:**
- 9:00 AM: Checks NSE option chain for PCR and max pain
- 9:15 AM: Opens Sensibull for strategy ideas
- 9:30 AM: Places trade on Zerodha
- 10:00 AM: Anxiously watches P&L

**Information Requirements:**
- Where is max pain? Where are the big OI walls?
- Is IV going up or down right now?
- What is the market directional bias today?
- Where should my stop loss be based on OI data?

**Flow Intelligence Value Proposition:** Arjun opens one workspace. The AI tells him: "Market is currently in a Put Long Buildup pattern. IV is elevated at 18.5 VIX vs 15.2 5-day avg. Max pain at 22,800. Consider waiting for IV to normalize before buying premium." This alone saves Arjun from multiple bad trades per week.

---

### Persona 2: Priya — The Option Seller (Spreads & Iron Condors)

**Age:** 35 | **Experience:** 5 years | **City:** Pune | **Capital:** ₹15–25L

**Profile:** Priya is an options seller. She runs Iron Condors and strangles on weekly Nifty expiry. She is disciplined, process-driven, and needs precision over speed. Her biggest risk is sudden IV expansion and delta exposure.

**Goals:**
- Understand overall market IV and whether conditions favor selling premium
- Monitor her positions' Greek exposure in real-time
- Know the probability of her strikes being breached
- Identify unusual OI buildup that might signal a directional move

**Pain Points:**
- Needs to check Opstra, Sensibull, and TradingView simultaneously
- IV surface analysis is only available on Opstra with a complex interface
- No alert system that notifies her of OI buildup near her strikes
- Post-market analysis of what happened to OI and IV is time-consuming

**Daily Workflow:**
- 8:30 AM: Reviews overnight events, checks VIX futures
- 9:15 AM: Opens Opstra for IV surface analysis
- 9:20 AM: Opens Sensibull to check existing positions' payoff
- 9:30 AM: Monitors live Greeks through Zerodha
- Power Hour: Watches for unusual OI activity near short strikes

**Information Requirements:**
- Current IV vs historical IV (is now a good time to sell?)
- IV skew — where is the market pricing tail risk?
- OI at her short strikes — is buildup increasing or decreasing?
- Gamma risk — how fast will delta change if Nifty moves 100 points?
- Max pain proximity — is expiry likely to pin near her profit zone?

**Flow Intelligence Value Proposition:** Priya's positions are imported from her TradeVault journal. Flow Intelligence shows her active positions overlaid on the OI heatmap. She sees exactly where her short strikes sit relative to institutional OI walls. One alert: "OI buildup detected at your 23,200 CE short strike — 40% increase in last 2 hours." She adjusts her position proactively.

---

### Persona 3: Vikram — The Swing Trader & Positional Player

**Age:** 42 | **Experience:** 8 years | **City:** Bengaluru | **Capital:** ₹50L+

**Profile:** Vikram trades multi-day and multi-week options positions. He is technically sophisticated but not a quant. He uses options for directional bets and portfolio hedging. He needs market structure understanding, not intraday noise.

**Goals:**
- Understand the broader market structure through options positioning
- Use PCR and OI data to time entries and exits over multiple days
- Identify institutional accumulation and distribution
- Manage position sizing based on Greek exposure

**Pain Points:**
- Intraday options tools create unnecessary noise for swing trades
- No platform shows historical OI trends across multiple expiries
- Context-switching between Bloomberg (which he has access to through work) and Indian retail platforms is jarring

**Daily Workflow:**
- Reviews market structure 30 minutes before open
- Checks multi-expiry OI structure for clues about institutional positioning
- Monitors positions passively during the day
- Deep post-market analysis on Opstra

**Information Requirements:**
- Multi-expiry OI structure (weekly vs monthly — what are institutions positioned for?)
- OI rollover data during expiry transitions
- IV term structure (short vs long-dated IV comparison)
- Change in OI at key strikes over multiple days (not just intraday)

**Flow Intelligence Value Proposition:** Vikram's swing trader mode shows him a 5-day OI evolution across expiries. He can see when large positions were built, when they started unwinding, and what the structure looks like going into the next expiry. This is currently only possible by manually tracking data — no platform automates it.

---

### Persona 4: Riya — The Professional Derivatives Analyst

**Age:** 31 | **Experience:** 6 years | **City:** Delhi | **Role:** Independent Research Analyst

**Profile:** Riya runs a premium Telegram channel where she publishes daily options market analysis. She needs to process a massive amount of data efficiently and produce high-quality insights quickly. She is a power user who needs speed, depth, and reliability above all else.

**Goals:**
- Generate comprehensive daily market analysis in under 30 minutes
- Identify unusual institutional flow events worth writing about
- Track multiple indices (Nifty, BankNifty, Sensex, FinNifty) simultaneously
- Export data for reports

**Pain Points:**
- Data aggregation is her primary time-sink — she checks 6 platforms before 9:30 AM
- No platform gives her a multi-symbol view with consistent formatting
- Export capabilities are limited across all platforms
- AI tools hallucinate — she cannot rely on AI for factual market data

**Information Requirements:**
- Cross-symbol OI analysis (Nifty, BankNifty, FinNifty, MidCap simultaneously)
- Unusual block-flow events (large single-trade OI changes)
- IV surface across multiple symbols for comparative analysis
- Export to CSV/PDF for reports

**Flow Intelligence Value Proposition:** Riya's professional workspace shows all 4 indices simultaneously in a configurable grid. The AI drafts a daily market brief for her — she edits, verifies, and publishes. What took 90 minutes now takes 20 minutes.

---

### Persona 5: Neha — The Beginner

**Age:** 24 | **Experience:** 6 months | **City:** Hyderabad | **Capital:** ₹50,000

**Profile:** Neha recently started trading options. She understands the basics but is easily overwhelmed by technical platforms. She frequently makes mistakes by buying options without understanding IV or Greeks.

**Goals:**
- Understand what the market is "doing" before trading
- Avoid common beginner mistakes
- Build confidence through guided insights

**Pain Points:**
- Every advanced platform feels overwhelming
- She doesn't know what she doesn't know
- Cannot distinguish between important and unimportant information
- No platform teaches while she trades

**Flow Intelligence Value Proposition:** Beginner mode surfaces only the most critical information. Every number has a "What does this mean?" button. The AI speaks plainly: "The market is showing higher put buying than usual, which typically means traders are worried about a potential drop. If you're considering buying a call option today, be aware of this headwind." Education embedded in context.

---

## 5.2 Trader Archetype Summary

| Archetype | Primary Need | Secondary Need | Biggest Risk |
|-----------|-------------|----------------|--------------|
| Option Buyer | Market direction + IV timing | Strike selection | IV crush |
| Option Seller | Premium selling environment | Delta/gamma monitoring | Sudden moves |
| Swing Trader | Multi-day OI structure | Institutional positioning | Wrong timeframe |
| Professional Analyst | Speed + data breadth | Export + multi-symbol | Data accuracy |
| Beginner | Guided intelligence | Education | Cognitive overload |

---

# 6. User Journey Maps

## 6.1 The Morning Ritual (6:00 AM – 9:15 AM)

**Current Painful Journey:**
```
Wake up → Check phone (Twitter/Telegram tips) → Open NSE site (slow) 
→ Check global markets (another app) → Open Opstra (OI analysis) 
→ Open TradingView (chart context) → Open Sensibull (strategy) 
→ Open broker app → Make trade decision (often rushed)
```

**Flow Intelligence Journey:**
```
Wake up → Open TradeVault Flow Intelligence
→ Morning Brief: AI summary of overnight events + expected market context
→ OI structure overview: Key levels, PCR, Max Pain, IV state
→ Personalized alert: "Your open BankNifty CE position: IV is 2σ elevated — 
   watch for IV normalization risk this morning"
→ Click to see detailed breakdown if needed
→ Pre-market plan confirmed in Journal
→ Trade with confidence
```

**Time saved:** 35–45 minutes daily  
**Cognitive load reduction:** 70%

---

## 6.2 Market Open Phase (9:15 AM – 9:45 AM)

**Critical first 30 minutes of trading.**

Flow Intelligence shows:
- Live OI change as positions are established
- PCR shifting in real-time — bullish or bearish bias building
- VIX movement relative to expected
- Max pain current position vs yesterday's close
- AI alert if unusual activity detected (large OI buildup at a single strike)

---

## 6.3 Mid-Session Monitoring (9:45 AM – 2:00 PM)

User does not need to actively watch Flow Intelligence. They set alerts:
- "Alert me if OI at 23,000 CE increases by more than 20%"
- "Alert me if PCR drops below 0.8"
- "Alert me if VIX moves more than 5% in 30 minutes"

Flow Intelligence is silent by default. It speaks when something matters.

---

## 6.4 Power Hour (2:00 PM – 3:30 PM)

The most critical phase for options positions.

Flow Intelligence highlights:
- Max pain proximity — is market gravitating toward expiry pin?
- Theta burn status — time value decay acceleration visualization
- OI unwinding vs building — are institutional positions closing or growing?
- Gamma exposure of the market as a whole (dealer gamma positioning)
- AI assessment: "Market is likely to pin near 23,000 based on max pain and current OI structure"

---

## 6.5 After Market Review (3:30 PM – 5:00 PM)

Flow Intelligence's post-market mode:
- Today's OI evolution replay (animated visualization of how OI changed throughout the day)
- What changed from expectations — was the AI morning summary accurate?
- IV reset — what happened to IV at close vs open
- Tomorrow's preparation: Pre-built view of next session's key levels based on today's OI structure
- Journal integration: Auto-populated trade context for journal entries

---

# 7. Information Architecture & Naming

## 7.1 Module Naming Decision

**Rejected Names:**
- ~~OI~~ — Too technical, abbreviation, no brand premium
- ~~Option Chain~~ — Describes a tool, not a value proposition
- ~~Derivatives Hub~~ — Institutional but cold
- ~~Smart Money~~ — Overused in retail trading circles, implies unproven claims

**Finalist Names Evaluated:**

| Name | Pros | Cons | Score |
|------|------|------|-------|
| **Flow Intelligence** | Modern, implies real-time + AI, evokes institutional flow, scalable | No Indian-specific recognition | 9.2/10 |
| Options Intelligence | Clear category ownership, authoritative | May feel limiting as product grows | 8.7/10 |
| Market Pulse | Simple, accessible | Too generic, lacks premium feel | 6.8/10 |
| Derivatives Lens | Unique, professional | Too academic | 7.1/10 |
| Signal | Clean, minimalist | Too generic, no financial context | 7.5/10 |

**Decision: Flow Intelligence**

Rationale:
- "Flow" directly references institutional order flow — a term respected by serious traders
- "Intelligence" positions this as a thinking system, not a data display
- Scalable: works for options, futures, and eventually cross-asset as the product grows
- Memorable and premium — fits the TradeVault brand vocabulary
- SEO advantage: "flow intelligence trading" is a rising search category

**Navigation Label:** Flow  
**Full Name:** Flow Intelligence  
**Tagline:** *The market. Decoded.*

---

## 7.2 Information Architecture

### Primary Navigation (Sidebar Item)
```
⚡ Flow
```

### Page Structure
```
Flow Intelligence
├── 🌅 Morning Brief         (AI-generated daily summary)
├── 📊 Market Overview        (Index selector, PCR, Max Pain, IV State)
├── 🔥 OI Intelligence        (OI Heatmap, OI Change, Strike Analysis)
├── 📈 Option Flow            (Institutional flow, unusual activity)
├── 🌊 IV Analysis            (IV Surface, IV Skew, IV Term Structure)
├── ⚡ Greeks Dashboard       (Delta exposure, Gamma wall, Vega risk)
├── 🎯 My Positions           (Personal positions overlaid on market data)
└── 🔔 Smart Alerts           (OI thresholds, IV spikes, PCR extremes)
```

### Section Hierarchy

#### Level 0 — The Command Bar (Always Visible)
- Current index price + live change
- PCR (color-coded)
- VIX level + change
- Market session indicator (Pre-market / Open / Power Hour / Closed)
- AI summary pill — one-sentence current market state

#### Level 1 — Morning Brief Panel
- AI-generated narrative (3-5 sentences)
- Three key observations with supporting data
- One recommended action
- Expandable to full institutional analysis view

#### Level 2 — Market Overview Panel
```
┌─────────────────────────────────────────────────────┐
│  INDEX SELECTOR: [Nifty] [BankNifty] [FinNifty] [MidCap Select] │
│                                                     │
│  PCR: 1.24 ↑  |  Max Pain: 22,800  |  IV: 16.8%  |  VIX: 14.2 │
│                                                     │
│  OI Heatmap (Call vs Put by Strike)                │
│                                                     │
│  [Today] [This Week] [Compare to Expiry]           │
└─────────────────────────────────────────────────────┘
```

#### Level 3 — OI Intelligence Panel
```
┌─────────────────────────────────────────────────────┐
│  OI INTELLIGENCE                                    │
│                                                     │
│  Strongest Call Wall: 23,000 CE (↑ 34% today)      │
│  Strongest Put Wall: 22,500 PE (↑ 18% today)       │
│  Max Pain: 22,800 (Market is 200 pts above)         │
│                                                     │
│  [OI Change Chart] [Strike Heatmap] [Historical]   │
│                                                     │
│  AI: "The 23,000 CE wall is being aggressively      │
│  built suggesting strong institutional resistance.  │
│  Watch for reversal signals near 23,000."          │
└─────────────────────────────────────────────────────┘
```

#### Level 4 — Option Flow Panel
```
┌─────────────────────────────────────────────────────┐
│  INSTITUTIONAL FLOW                   [Last 2 hours] │
│                                                     │
│  🔴 Large Call Build: 23,500 CE +82,000 OI (11:23) │
│  🟢 Put Unwind: 22,000 PE -45,000 OI (10:45)       │
│  🔴 Large Put Build: 22,500 PE +1,20,000 OI (09:48)│
│                                                     │
│  Pattern: Smart money building BOTH sides —         │
│  straddle/strangle strategy likely before event.   │
└─────────────────────────────────────────────────────┘
```

#### Level 5 — IV Analysis Panel
```
┌─────────────────────────────────────────────────────┐
│  IV ANALYSIS                                        │
│                                                     │
│  Current IV: 16.8%    Historical Avg: 15.2%         │
│  IV Percentile: 68th  Status: ELEVATED              │
│                                                     │
│  IV Skew: [Visual Chart — smile/smirk visualization]│
│  OTM Put IV premium vs OTM Call IV: 2.3%            │
│                                                     │
│  AI: "IV is elevated relative to recent history.   │
│  Option buyers paying above-average premium.       │
│  Sellers in favorable environment."                │
└─────────────────────────────────────────────────────┘
```

#### Level 6 — Greeks Dashboard Panel
```
┌─────────────────────────────────────────────────────┐
│  MARKET GREEKS                                      │
│                                                     │
│  Dealer Net Delta: -₹ 2,400 Cr (Short market bias) │
│  Gamma Wall: 23,000 (high gamma exposure zone)      │
│  Vega Risk Zone: IV must stay < 20% for sellers     │
│                                                     │
│  [Delta Profile Chart] [Gamma Exposure Chart]       │
└─────────────────────────────────────────────────────┘
```

#### Level 7 — My Positions Panel (Personalized)
```
┌─────────────────────────────────────────────────────┐
│  MY POSITIONS (from TradeVault Journal)             │
│                                                     │
│  NIFTY 23,000 CE @ 145 — Current: 98 (-32%)        │
│  Position is 200pts OTM. Call wall at your strike. │
│  AI: "Exit or roll — you're fighting institutional  │
│  resistance. Historical: you hold this pattern 12x, │
│  win rate 25%."                                    │
│                                                     │
│  BANKNIFTY 47,500 PE @ 220 — Current: 285 (+30%)   │
│  Put wall building below you. AI: "Hold. Momentum  │
│  in your favor. Watch 47,000 support."             │
└─────────────────────────────────────────────────────┘
```

---

## 7.3 Navigation Model

**Primary navigation:** Left sidebar (consistent with rest of TradeVault)  
**Secondary navigation:** Horizontal tab bar within Flow Intelligence  
**Tertiary navigation:** Section accordion within each panel  

**Layout philosophy:** The workspace is a vertical scroll of intelligence panels. Each panel is independently useful. Together they form a complete picture. This is the Perplexity model applied to trading — a page that answers a question, not a dashboard that shows controls.

---

# 8. UX Strategy & Cognitive Load Design

## 8.1 The 5-Second Rule

A trader opening Flow Intelligence has 5 seconds before their attention splinters.

In those 5 seconds, they must know:
1. Is the market bullish or bearish right now?
2. What is the key level to watch?
3. Is there anything unusual happening?

**Design response:** The top 400px of the screen answers these 3 questions with no scrolling required. Everything below is enrichment.

---

## 8.2 Progressive Disclosure Architecture

```
Layer 0: Market State (always visible — top command bar)
  ↓
Layer 1: Morning Brief (AI narrative — expandable)
  ↓
Layer 2: Key Numbers (PCR, Max Pain, IV — scannable cards)
  ↓
Layer 3: OI Map (visual heatmap — interactive)
  ↓
Layer 4: Flow Events (unusual activity — filterable)
  ↓
Layer 5: Deep Analytics (IV surface, Greeks — expert mode)
  ↓
Layer 6: Historical & Comparative Analysis (drill-down)
```

User controls how deep they go. The surface is always clean.

---

## 8.3 Session-Adaptive Interface

The interface shifts tone based on market session:

| Session | Time | Interface Behavior |
|---------|------|--------------------|
| **Pre-Market** | 6:00–9:14 AM | Morning brief dominant, calm blue palette, preparation mode |
| **Market Open** | 9:15–9:45 AM | Heightened visual intensity, OI change highlighted, "what's happening" mode |
| **Mid-Session** | 9:45–2:00 PM | Monitoring mode, silent unless alerts triggered |
| **Power Hour** | 2:00–3:30 PM | Max pain tracker prominent, theta decay visualization, closing bias indicators |
| **Post-Market** | 3:30–5:00 PM | Replay mode, review mode, next-day preparation |
| **After Hours** | 5:00 PM+ | Historical analysis, journal integration, scenario planning |

---

## 8.4 Color as Communication

Flow Intelligence uses color with strict semantic meaning — never decorative:

| Color | Meaning |
|-------|---------|
| **#10B981 (Emerald)** | Bullish, positive change, call activity |
| **#EF4444 (Red)** | Bearish, negative change, put activity |
| **#F59E0B (Amber)** | Warning, elevated IV, unusual activity, attention required |
| **#6366F1 (Indigo)** | AI-generated content, intelligence layer |
| **#94A3B8 (Slate)** | Neutral data, reference values, metadata |
| **#E2E8F0 (Light)** | Primary text on dark background |

**Rule:** No more than 3 colors active in any single panel at any time.

---

## 8.5 Information Density Guidelines

**The Bloomberg Problem:** Bloomberg shows everything. Users spend years learning where to look.  
**The Groww Problem:** Groww shows nothing useful. Power users leave immediately.  
**The Flow Intelligence solution:** Curated density. Everything on screen earns its place.

**Panel limit:** Maximum 7 data points per panel before requiring expansion  
**Text limit:** No paragraph longer than 3 sentences in any AI output shown by default  
**Chart limit:** No chart with more than 3 series shown simultaneously without toggle  
**Table limit:** Option chain shows maximum 10 strikes ATM±5 by default, expandable

---

## 8.6 Micro-Animation Philosophy

Animations must communicate state changes — never decorate:

| Animation | Trigger | Duration | Purpose |
|-----------|---------|----------|---------|
| Number counter | Data refresh | 300ms | Draw attention to changed value |
| Row highlight pulse | OI anomaly detected | 500ms | Alert without disrupting focus |
| Panel slide | Section expand | 200ms | Smooth spatial navigation |
| Skeleton loading | Data fetch | Continuous | Prevent layout shift |
| Heatmap color transition | OI change | 800ms | Show OI building/unwinding over time |
| Alert badge pop | New alert | 250ms | Urgent but non-disruptive |

**Rule:** No animation longer than 800ms. No looping animations except intentional indicators.

---

## 8.7 Accessibility Requirements

- WCAG 2.1 AA compliance minimum
- All data values accessible via screen reader
- Keyboard-navigable interface (Tab / Shift+Tab / Arrow keys for data tables)
- Color-blind safe palette: All critical signals reinforced with icon + label (not color alone)
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text
- Reduced motion mode: Honor `prefers-reduced-motion`

---

# 9. Design System & Visual Language

## 9.1 Typography

Following TradeVault's established system:

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Display headings** | Bricolage Grotesque | 700 | 28–48px |
| **Section headers** | Geist Sans | 600 | 16–20px |
| **Body text** | Geist Sans | 400 | 14px |
| **Data / Numbers** | DM Mono | 400–600 | 12–18px |
| **Captions / Labels** | Geist Sans | 500 | 11–12px |
| **AI content** | Geist Sans | 400 | 14px (italic markers) |

**Typographic Rule:** All prices, percentages, OI values, and Greeks are displayed in DM Mono for immediate visual distinction from narrative text.

---

## 9.2 Spacing System

Based on 4px base unit:

```
xs:  4px   (tight inline spacing)
sm:  8px   (component internal spacing)
md:  16px  (standard panel padding)
lg:  24px  (section spacing)
xl:  32px  (major section breaks)
2xl: 48px  (page-level rhythm)
```

---

## 9.3 Color Palette

### Dark Mode (Primary)
```
Background canvas:   #0A0B0D   (near-black, not pure black)
Surface 0:           #0F1117   (primary panel surface)
Surface 1:           #161B27   (elevated cards, hover states)
Surface 2:           #1E2433   (modal backgrounds, dropdowns)
Border primary:      #2A3348   (panel borders)
Border subtle:       #1E2433   (internal dividers)
Text primary:        #F1F5F9   (main content)
Text secondary:      #94A3B8   (labels, metadata)
Text tertiary:       #64748B   (disabled, placeholder)
Accent primary:      #6366F1   (AI, interactive, brand)
Accent hover:        #4F46E5
Bullish:             #10B981
Bullish subtle:      #064E3B   (bullish background fills)
Bearish:             #EF4444
Bearish subtle:      #7F1D1D   (bearish background fills)
Warning:             #F59E0B
Warning subtle:      #451A03
Info:                #3B82F6
```

### Light Mode (Secondary)
```
Background canvas:   #FAFAFA
Surface 0:           #FFFFFF
Surface 1:           #F8FAFC
Surface 2:           #F1F5F9
Border primary:      #E2E8F0
Text primary:        #0F172A
Text secondary:      #475569
Accent primary:      #4F46E5
```

---

## 9.4 Component Library

### OI Heatmap Component

```
Design Spec:
- Color scale: Deep red (highest call OI) → neutral gray → deep green (highest put OI)
- Strike axis: Vertical, centered on ATM strike
- Time axis (optional): Horizontal for intraday OI evolution view
- Interaction: Hover → tooltip with OI value, change %, and AI interpretation
- Click → Drill-down to that specific strike's full data
- Animation: Color transitions on OI change (800ms ease-in-out)
- Accessibility: Legend always visible, tooltips with plain text values
```

### PCR Card Component

```
Design Spec:
- Large number display: PCR value in 32px DM Mono
- Trend arrow: ↑/↓ with 24h change
- Color coding: Green (>1.2 extreme), Amber (0.8–1.2 neutral), Red (<0.8 extreme)
- Gauge: Semi-circular gauge showing current reading on bearish-neutral-bullish spectrum
- Interpretation chip: Plain language — "Bearish Extreme" / "Neutral" / "Bullish Extreme"
- Historical context: Small sparkline showing last 5 days PCR
```

### AI Insight Card Component

```
Design Spec:
- Indigo left border (3px) — marks AI-generated content
- Header: Small AI icon + "Flow Intelligence"
- Body: Single sentence conclusion (bold) → 3 bullet observations → 1 action recommendation
- "Expand" button: Full institutional-quality analysis
- "Explain this" button: Plain-English explanation for beginners
- Freshness indicator: "Updated 2 mins ago"
- Confidence indicator: Signal strength dots (1–5) for the AI's confidence in the observation
```

### Option Chain Component

```
Design Spec:
- Centered ATM strike — always in view
- Columns: CE (OI | Chg | IV | LTP | ΔOI) | Strike | PE (ΔOI | LTP | IV | Chg | OI)
- Color coding: ITM strikes with subtle surface tint
- Interactive: Click column headers to sort, click strikes to drill-down
- Highlights: Max pain strike = gold badge, highest OI strike = weight indicator bar
- Filters: Quick filter chips — "Show only ITM", "Sort by OI change", "Highlight unusual"
- Condensed mode: ATM ± 5 strikes (default), expandable to full chain
- Animation: Row flash on significant OI change (>5% in last refresh)
```

### Alert Card Component

```
Design Spec:
- Severity levels: Critical (red) / Warning (amber) / Info (blue)
- Non-intrusive position: Toast-style in top-right
- Content: Icon + title + context + one-tap action
- Dismissal: Auto-dismiss after 8 seconds (warning), 15 seconds (critical), manual dismiss (info)
- History: All alerts accessible in a panel slide-out
```

---

## 9.5 Layout Templates

### Default Layout (Widescreen 1440px+)

```
┌─────────────────────────────────────────────────────────────────┐
│  COMMAND BAR: Index | Price | PCR | VIX | Session | AI Summary  │
├──────────┬──────────────────────────────────────────────────────┤
│ SIDEBAR  │  [Tab: Overview | OI | Flow | IV | Greeks | Mine]     │
│          │  ─────────────────────────────────────────────────── │
│ ⚡ Flow  │  MORNING BRIEF (AI Panel)                            │
│          │  ─────────────────────────────────────────────────── │
│          │  [PCR Card] [Max Pain Card] [IV Card] [VIX Card]     │
│          │  ─────────────────────────────────────────────────── │
│          │  OI HEATMAP (Interactive)                            │
│          │  ─────────────────────────────────────────────────── │
│          │  FLOW EVENTS                                         │
│          │  ─────────────────────────────────────────────────── │
│          │  [Option Chain — condensed]                          │
│          │  ─────────────────────────────────────────────────── │
│          │  IV SURFACE CHART                                    │
│          │  ─────────────────────────────────────────────────── │
│          │  GREEKS DASHBOARD                                    │
└──────────┴──────────────────────────────────────────────────────┘
```

### Mobile Layout (375px–768px)

```
┌─────────────────────┐
│ COMMAND BAR         │
├─────────────────────┤
│ Tab Strip (swipe)   │
├─────────────────────┤
│ AI BRIEF (collapsed)│
├─────────────────────┤
│ KEY NUMBERS         │
│ (horizontal scroll) │
├─────────────────────┤
│ OI HEATMAP          │
│ (vertical, simplified)│
├─────────────────────┤
│ FLOW EVENTS         │
│ (card list)         │
└─────────────────────┘
```

---

# 10. AI Strategy

## 10.1 The AI Philosophy

Flow Intelligence's AI must never behave like a textbook.

The AI is a senior derivatives analyst who:
- Speaks in conclusions, not definitions
- Leads with the most important observation
- Backs observations with current data
- Acknowledges uncertainty explicitly
- Knows the user's trading history

**Rejected AI behavior:**
- "Open Interest is a measure of the total number of outstanding contracts..."
- "High PCR can sometimes indicate bearish sentiment, but can also be interpreted as..."
- "You should always consult a financial advisor..."

**Accepted AI behavior:**
- "The 23,000 CE wall is the most significant technical level of the day. Institutions are defending it."
- "Your BankNifty position is exposed to elevated gamma risk in the next 90 minutes."
- "Based on your journal from last Thursday's expiry, you typically panic-exit in the final 30 minutes. Today's setup is similar — have a plan."

---

## 10.2 AI Response Template

**Default Response Format (compact, always visible):**
```
[ONE SENTENCE CONCLUSION]
→ [Observation 1: Data-backed]
→ [Observation 2: Data-backed]
→ [Observation 3: Data-backed]
[ACTION: One specific recommended action or focus area]
```

**Expanded Response (on user click):**
```
[MARKET CONTEXT — 2-3 sentences]

OPEN INTEREST ANALYSIS
[Key OI movements and what they imply]

SENTIMENT INDICATORS
[PCR interpretation + IV context]

RISK FACTORS
[Key risks for today's session]

YOUR POSITION CONTEXT (if applicable)
[Personalized observations based on trade history]

SCENARIOS
Scenario A (Base case): [X% probability] — [what happens]
Scenario B (Bull case): [Y% probability] — [what happens]
Scenario C (Bear case): [Z% probability] — [what happens]

WATCH LEVEL: [Specific strike or price to monitor]
```

---

## 10.3 AI Context Sources

The AI receives the following context to generate insights:

**Market Data Context:**
- Current OI distribution across all strikes (full option chain)
- OI change in last 30 minutes, 2 hours, and from previous day
- PCR (by expiry, by OI, by volume)
- Max pain calculation
- IV per strike, IV surface
- VIX level and intraday change
- Options volume patterns
- Underlying index price and technical levels

**Personal Context (from TradeVault user data):**
- Open positions: strikes, expiry, quantity, average price
- Unrealized P&L per position
- Historical win rate for current strategy type
- Journal entries (last 7 days — sentiment, plan, notes)
- Risk profile (account size, historical position sizing)
- Commonly repeated mistakes (from AI coach analysis)
- Trading session behavior patterns (does user panic in power hour?)

**Temporal Context:**
- Current session (pre-market / open / power hour / closing)
- Days to expiry for active contracts
- Whether today is expiry day / day before expiry
- Any significant economic events on calendar

---

## 10.4 AI Accuracy & Reliability Standards

**Non-negotiable rules for AI in Flow Intelligence:**

1. **No hallucination of market data.** All data cited by AI must be sourced from live, verified data feeds. AI cannot invent OI numbers, PCR values, or price levels.

2. **Confidence labeling.** Every AI insight carries a confidence indicator (5-dot scale). Low confidence = explicit acknowledgment: "This is an early signal — not yet confirmed."

3. **Audit trail.** Every AI statement can be traced to the underlying data. "Why did you say this?" button reveals the exact data points used.

4. **No financial advice framing.** AI presents observations and scenarios. The user makes the decision. AI never says "Buy" or "Sell" as a command — only "OI suggests [direction] bias" or "Consider monitoring [X]."

5. **Recency window.** AI insights must be regenerated every 5 minutes during market hours. Stale AI insights displayed with age indicator and warning.

---

## 10.5 AI Model Architecture

```
┌─────────────────────────────────────────────────────┐
│                  FLOW AI ENGINE                      │
│                                                     │
│  Context Assembler                                  │
│    ├── Market Data Feed (live)                      │
│    ├── User Profile Service (TradeVault DB)         │
│    ├── Trade History Service                        │
│    └── Journal Analysis (last 7 days)               │
│                                                     │
│  Prompt Constructor                                 │
│    ├── Template: Market Brief                       │
│    ├── Template: Position Analysis                  │
│    ├── Template: Alert Trigger                      │
│    └── Template: Historical Comparison              │
│                                                     │
│  LLM Layer (OpenAI GPT-4o / Anthropic Claude)       │
│    ├── Primary: GPT-4o (speed + cost)               │
│    └── Fallback: Claude Sonnet (reliability)        │
│                                                     │
│  Post-Processing                                    │
│    ├── Hallucination check (data cross-validation)  │
│    ├── Formatting parser                            │
│    └── Confidence scorer                           │
│                                                     │
│  Cache Layer (Redis — 5 min TTL during market hours)│
└─────────────────────────────────────────────────────┘
```

---

# 11. Feature Specification

## 11.1 Feature Inventory

### Priority 1 — Core (MVP)

| Feature ID | Feature | Description | Acceptance Criteria |
|-----------|---------|-------------|---------------------|
| F-001 | Index Selector | Multi-index switcher: Nifty, BankNifty, FinNifty, MidCap Select | Switches context in <200ms; all data refreshes for selected index |
| F-002 | PCR Card | Live PCR with trend, color coding, and plain-English interpretation | Updates every 30s; shows OI-based PCR and Volume-based PCR separately |
| F-003 | Max Pain Display | Current max pain strike with proximity indicator | Calculated correctly per Black-Scholes max pain formula; updates every 5 minutes |
| F-004 | IV Dashboard | Current IV, IV percentile (1-year lookback), IV trend | IV percentile calculated correctly; updates every 30s |
| F-005 | OI Heatmap | Color-coded heatmap of call/put OI across strikes | Renders in <500ms; updates every 60s; hover shows exact values |
| F-006 | OI Change Table | Strike-level OI change (intraday, from previous day) | Positive OI = green; negative OI = red; sorted by absolute change |
| F-007 | AI Morning Brief | AI-generated daily market summary | Generated by 8:30 AM; refreshed at market open; expandable detail view |
| F-008 | Option Chain | Full option chain with Greeks, OI, volume | Renders in <300ms; ATM-centered by default; sortable columns |
| F-009 | VIX Card | India VIX level with trend and interpretation | Real-time update; shows 5-day comparison; color-coded threshold alerts |
| F-010 | Smart Alerts | OI threshold, IV spike, PCR extreme alerts | User-configurable; non-intrusive notifications; alert history log |

### Priority 2 — Enhanced (V1.1)

| Feature ID | Feature | Description | Acceptance Criteria |
|-----------|---------|-------------|---------------------|
| F-011 | Institutional Flow Feed | Real-time feed of unusual large OI changes | Filters for size threshold; timestamped; AI interpretation per event |
| F-012 | My Positions Overlay | User's open positions shown on OI heatmap | Integrates with TradeVault trade store; shows P&L overlay |
| F-013 | IV Surface Chart | 3D visualization of IV across strikes and expiries | Smooth rendering; interactive (rotate, zoom); shows current vs historical |
| F-014 | Intraday OI Replay | Animated replay of how OI changed throughout the day | Playback speed control; key event markers; exportable |
| F-015 | Greeks Dashboard | Market-level delta exposure, gamma wall, vega risk zones | Clearly labeled; AI interpretation; updated every minute |
| F-016 | Multi-expiry PCR | PCR breakdown by weekly vs monthly expiry | Separate views; trend lines; AI comment on structure |
| F-017 | IV Skew Chart | Visualization of IV smile/smirk across strikes | OTM call vs put IV comparison; historical comparison toggle |
| F-018 | Post-Market Review | End-of-day summary with OI evolution and next-day levels | Available by 4:30 PM; auto-populates journal entry prompt |

### Priority 3 — Premium (V2.0)

| Feature ID | Feature | Description | Acceptance Criteria |
|-----------|---------|-------------|---------------------|
| F-019 | Multi-Symbol Grid | Side-by-side view of 2-4 indices simultaneously | Configurable grid; independent index selection per cell |
| F-020 | Position AI Coach | AI analysis of open positions with historical context | Reads TradeVault history; generates personalized risk assessment |
| F-021 | Scenario Modeler | "What if Nifty moves to X?" payoff simulation | Interactive slider; instant recalculation; AI interpretation |
| F-022 | Historical Backtesting | Test market conditions against historical OI data | 1-year lookback; key expiry comparison; pattern matching |
| F-023 | Export & Reports | PDF/CSV export of daily analysis | Professional formatting; branded TradeVault report |
| F-024 | API Access | Access Flow Intelligence data programmatically | REST + WebSocket; rate limited; JWT authenticated |

---

## 11.2 Acceptance Criteria — Core Features

### F-001: Index Selector

**Given** the user is on Flow Intelligence  
**When** they click a different index button  
**Then:**
- All data panels must refresh within 200ms (cached data) or show skeleton within 50ms
- The command bar must update immediately with the new index's live price
- The AI brief must auto-scroll to indicate refresh
- The previously selected index is remembered for the next session

---

### F-005: OI Heatmap

**Given** the user is viewing the OI Heatmap  
**When** the data is loaded  
**Then:**
- The heatmap renders in under 500ms on a standard broadband connection
- Calls are displayed on the left, puts on the right, strike in the center
- Color intensity represents relative OI magnitude (darkest = highest OI)
- Hovering a cell shows: Strike, OI value, OI change today, and AI micro-insight
- Clicking a cell opens the full strike detail drawer
- The ATM strike is always visually centered with a distinct indicator
- The heatmap updates automatically every 60 seconds without full re-render

---

### F-007: AI Morning Brief

**Given** it is after 8:30 AM on a trading day  
**When** the user opens Flow Intelligence  
**Then:**
- The AI Morning Brief is visible as the first content panel
- It shows one clear conclusion sentence in bold
- It shows 3 data-backed observations as bullet points
- It shows one "Watch for" recommendation
- An "Expand" button reveals the full institutional analysis
- The brief shows its timestamp and a "Refresh" button
- If data is unavailable, a fallback message explains why (pre-market data unavailable, etc.)

---

### F-010: Smart Alerts

**Given** the user has configured alert thresholds  
**When** a threshold is breached  
**Then:**
- An alert notification appears in the top-right within 15 seconds of the event
- The alert clearly states: what happened, what it means, and what to watch
- The alert includes a one-tap action (e.g., "View OI Detail")
- Critical alerts (e.g., circuit breaker) remain until manually dismissed
- All alerts are logged in the Alert History drawer

---

# 12. Backend Engineering Architecture

## 12.1 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                                 │
│  React Frontend (TradeVault) — WebSocket + REST                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                     API GATEWAY                                  │
│  Kong / NGINX — Rate Limiting, Auth, SSL termination            │
└──────┬────────────┬────────────────────┬────────────────────────┘
       │            │                    │
┌──────▼──────┐ ┌───▼──────────┐ ┌──────▼──────────────┐
│  REST API   │ │  WebSocket   │ │  AI Service         │
│  Service    │ │  Server      │ │  (Node.js)          │
│  (Node.js)  │ │  (Node.js)  │ └──────┬──────────────┘
└──────┬──────┘ └───┬──────────┘        │
       │            │                   │
┌──────▼────────────▼───────────────────▼─────────────────────────┐
│                     REDIS CLUSTER                                │
│  ├── Pub/Sub Channels (live OI tick data)                       │
│  ├── Cache (latest OI, PCR, Greeks per symbol)                  │
│  ├── Session Store                                              │
│  └── Alert State                                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                  DATA INGESTION LAYER                            │
│  Market Data Worker                                             │
│  ├── Data Provider Adapter (TrueData / Kite Connect / Breeze)   │
│  ├── OI Calculator                                              │
│  ├── Greeks Calculator (real-time Black-Scholes)                │
│  ├── Max Pain Calculator                                        │
│  └── PCR Calculator                                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                  PERSISTENCE LAYER                               │
│  ├── PostgreSQL (user data, positions, alerts config)           │
│  ├── TimescaleDB (time-series OI history, IV history)           │
│  └── Redis (real-time state — TTL based)                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12.2 Data Ingestion Architecture

### The "Poll Once, Broadcast Many" Pattern

The single most important architectural decision. The system must:
- Maintain ONE connection to the data provider (not one per user)
- Fan out real-time data to all subscribers via Redis Pub/Sub
- Never expose the data provider connection to client-side code

```typescript
// Pseudo-code: Data Ingestion Worker
class MarketDataWorker {
  private provider: MarketDataProvider;     // TrueData/Kite Connect
  private redis: RedisClient;
  private calculator: GreeksCalculator;

  async onTick(tick: OptionTick) {
    // 1. Calculate derived values
    const greeks = this.calculator.calculateGreeks(tick);
    const updatedStrike = { ...tick, ...greeks };
    
    // 2. Update Redis cache (latest state)
    await this.redis.hSet(
      `oi:${tick.symbol}:${tick.expiry}`,
      tick.strikePrice.toString(),
      JSON.stringify(updatedStrike)
    );
    
    // 3. Publish to Pub/Sub for WebSocket fan-out
    await this.redis.publish(
      `channel:${tick.symbol}`,
      JSON.stringify(updatedStrike)
    );
    
    // 4. Write to TimescaleDB (async, non-blocking)
    this.persistToTimescale(updatedStrike).catch(console.error);
    
    // 5. Check alert conditions
    await this.alertEngine.check(updatedStrike);
  }
}
```

---

## 12.3 WebSocket Distribution Architecture

```typescript
// Pseudo-code: WebSocket Server
class FlowWebSocketServer {
  private redis: RedisClient;
  private subscriptions: Map<string, Set<WebSocket>> = new Map();
  
  onClientConnect(ws: WebSocket, userId: string) {
    // Client subscribes to specific symbols
    ws.on('message', (msg) => {
      const { type, symbols } = JSON.parse(msg);
      if (type === 'SUBSCRIBE') {
        symbols.forEach(symbol => {
          this.subscriptions.get(symbol)?.add(ws) ?? 
            this.subscriptions.set(symbol, new Set([ws]));
          
          // Subscribe to Redis channel if first subscriber
          if (this.subscriptions.get(symbol)!.size === 1) {
            this.redis.subscribe(`channel:${symbol}`, (data) => {
              this.fanOut(symbol, data);
            });
          }
        });
      }
    });
  }
  
  fanOut(symbol: string, data: string) {
    const clients = this.subscriptions.get(symbol);
    clients?.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  }
}
```

---

## 12.4 Greeks Calculation Architecture

Greeks must be pre-calculated server-side — never client-side.

**Real-time Black-Scholes implementation:**

Inputs per tick:
- Underlying price (S)
- Strike price (K)
- Time to expiry (T) — calculated from current time to expiry date
- Risk-free rate (r) — India 91-day T-bill rate, updated daily
- Implied Volatility (σ) — extracted via Newton-Raphson from market price

Outputs:
- Delta (Δ): Price sensitivity per ₹1 move
- Gamma (Γ): Delta sensitivity per ₹1 move
- Theta (Θ): Daily time decay in rupees
- Vega (V): Sensitivity to 1% IV change
- Rho (ρ): Interest rate sensitivity (less critical for short-dated options)

**Performance requirement:** Greeks calculation must complete in <5ms per strike.

---

## 12.5 Broker Provider Layer (Pluggable Architecture)

Design for zero vendor lock-in:

```typescript
interface MarketDataProvider {
  connect(): Promise<void>;
  subscribeToOptionChain(symbol: string, expiry: Date): Promise<void>;
  onTick(callback: (tick: OptionTick) => void): void;
  disconnect(): Promise<void>;
}

// Implementations
class KiteConnectProvider implements MarketDataProvider { ... }
class TrueDataProvider implements MarketDataProvider { ... }
class BreezeCICIProvider implements MarketDataProvider { ... }
class MockProvider implements MarketDataProvider { ... }  // Testing
```

**Switching providers:** Change one environment variable. Zero code changes.

---

## 12.6 Alert Engine Architecture

```typescript
interface AlertCondition {
  type: 'OI_CHANGE' | 'PCR_THRESHOLD' | 'IV_SPIKE' | 'MAX_PAIN_PROXIMITY' | 'GAMMA_WALL';
  symbol: string;
  threshold: number;
  direction: 'ABOVE' | 'BELOW' | 'CROSS';
}

class AlertEngine {
  async check(tick: OptionTick, currentState: MarketState) {
    const userAlerts = await this.getUserAlerts(tick.symbol);
    
    for (const alert of userAlerts) {
      if (this.conditionMet(alert, tick, currentState)) {
        await this.fireAlert(alert, tick, currentState);
      }
    }
  }
  
  private async fireAlert(alert: AlertCondition, ...) {
    // 1. Write to alert log (PostgreSQL)
    // 2. Push to WebSocket (immediate notification)
    // 3. Send push notification (mobile)
    // 4. Trigger AI to generate alert explanation
  }
}
```

---

# 13. Data Flow & API Requirements

## 13.1 REST API Endpoints

### Market Data APIs

```
GET /api/v1/flow/overview?symbol=NIFTY&expiry=2024-01-18
Response: { pcr, maxPain, iv, vix, oiSummary, aiSummary }

GET /api/v1/flow/oi-chain?symbol=NIFTY&expiry=2024-01-18
Response: { strikes: [{ strike, callOI, putOI, callOIChange, putOIChange, ... }] }

GET /api/v1/flow/oi-history?symbol=NIFTY&strike=23000&type=CE&from=2024-01-17&to=2024-01-18
Response: { history: [{ timestamp, oi, oiChange }] }

GET /api/v1/flow/iv-surface?symbol=NIFTY
Response: { surface: [{ strike, expiry, iv }] }

GET /api/v1/flow/institutional-flow?symbol=NIFTY&since=2024-01-18T09:00:00
Response: { events: [{ timestamp, strike, type, oiChange, significance, aiNote }] }
```

### User-Specific APIs

```
GET /api/v1/flow/my-positions?symbol=NIFTY
Response: { positions: [{ strike, expiry, type, qty, avgPrice, currentPnl, oiContext, aiAlert }] }

GET /api/v1/flow/alerts
Response: { alerts: [{ id, condition, status, createdAt }] }

POST /api/v1/flow/alerts
Body: { symbol, type, threshold, direction, notifyMethod }

GET /api/v1/flow/morning-brief?symbol=NIFTY
Response: { brief: { headline, observations, action, confidence, generatedAt } }
```

### WebSocket Events

```
// Client → Server
{ type: "SUBSCRIBE", symbols: ["NIFTY", "BANKNIFTY"], expiry: "2024-01-18" }
{ type: "UNSUBSCRIBE", symbols: ["NIFTY"] }
{ type: "PING" }

// Server → Client
{ type: "OI_UPDATE", symbol: "NIFTY", strike: 23000, optionType: "CE", oi: 1234567, oiChange: 45000, timestamp: "..." }
{ type: "PCR_UPDATE", symbol: "NIFTY", pcr: 1.24, pcrChange: 0.05, timestamp: "..." }
{ type: "ALERT_FIRED", alertId: "abc123", message: "...", severity: "WARNING" }
{ type: "AI_UPDATE", symbol: "NIFTY", brief: { headline: "...", ... } }
{ type: "PONG" }
```

---

## 13.2 Data Provider Integration Requirements

**Required data fields per option contract:**

| Field | Type | Description | Frequency |
|-------|------|-------------|-----------|
| symbol | string | Underlying index (NIFTY, BANKNIFTY) | Static |
| strikePrice | number | Strike price | Static |
| optionType | CE \| PE | Call or Put | Static |
| expiryDate | date | Expiry date | Static |
| ltp | number | Last traded price | Per tick |
| openInterest | number | Current open interest | Per tick |
| volume | number | Intraday volume | Per tick |
| bid | number | Best bid | Per tick |
| ask | number | Best ask | Per tick |
| iv | number | Implied volatility | Per tick |
| change | number | Price change from prev close | Per tick |
| changePercent | number | % price change | Per tick |

**Data provider candidates (India):**
1. **TrueData** — Reliable, affordable, good API, real-time tick data
2. **Kite Connect (Zerodha)** — Excellent API but requires Zerodha account
3. **Breeze (ICICI)** — Good alternative
4. **NSE TAPI** — Official exchange API (expensive, complex, highest reliability)

**Recommendation:** Start with TrueData. Abstract behind provider interface for easy migration.

---

# 14. Database Design

## 14.1 PostgreSQL Schema

### Users Table (existing — extend)
```sql
-- No changes needed. Flow Intelligence reads from existing users table.
-- Extension: Add flow_preferences JSONB column
ALTER TABLE users ADD COLUMN flow_preferences JSONB DEFAULT '{}';
-- Stores: { defaultSymbol, defaultExpiry, alertPreferences, layoutConfig }
```

### Option Alerts Table
```sql
CREATE TABLE option_alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol          VARCHAR(20) NOT NULL,   -- NIFTY, BANKNIFTY
  alert_type      VARCHAR(30) NOT NULL,   -- OI_CHANGE, PCR_THRESHOLD, IV_SPIKE
  strike          INTEGER,               -- NULL = index-level alert
  option_type     CHAR(2),               -- CE, PE, NULL
  threshold       DECIMAL(12,2) NOT NULL,
  direction       VARCHAR(10) NOT NULL,  -- ABOVE, BELOW, CROSS
  notify_method   VARCHAR(20)[],         -- ['push', 'websocket', 'email']
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_triggered  TIMESTAMPTZ
);
```

### Alert History Table
```sql
CREATE TABLE alert_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id        UUID NOT NULL REFERENCES option_alerts(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  triggered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trigger_value   DECIMAL(12,2) NOT NULL,
  ai_explanation  TEXT,
  was_read        BOOLEAN DEFAULT false
);
```

### AI Brief Cache Table
```sql
CREATE TABLE flow_ai_briefs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol          VARCHAR(20) NOT NULL,
  brief_type      VARCHAR(20) NOT NULL,  -- MORNING, MIDDAY, CLOSING
  headline        TEXT NOT NULL,
  observations    JSONB NOT NULL,        -- Array of 3 observation strings
  action          TEXT NOT NULL,
  confidence      SMALLINT NOT NULL,     -- 1-5
  generated_at    TIMESTAMPTZ NOT NULL,
  expires_at      TIMESTAMPTZ NOT NULL,
  model_used      VARCHAR(50)
);
```

## 14.2 TimescaleDB Schema (Time-Series)

```sql
-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- OI History (Hypertable partitioned by time)
CREATE TABLE oi_history (
  time            TIMESTAMPTZ NOT NULL,
  symbol          VARCHAR(20) NOT NULL,
  expiry_date     DATE NOT NULL,
  strike_price    INTEGER NOT NULL,
  option_type     CHAR(2) NOT NULL,  -- CE or PE
  open_interest   BIGINT NOT NULL,
  volume          BIGINT NOT NULL,
  ltp             DECIMAL(10,2) NOT NULL,
  iv              DECIMAL(8,4),
  delta           DECIMAL(8,6),
  gamma           DECIMAL(10,8),
  theta           DECIMAL(8,4),
  vega            DECIMAL(8,4)
);

SELECT create_hypertable('oi_history', 'time');

-- IV History
CREATE TABLE iv_history (
  time            TIMESTAMPTZ NOT NULL,
  symbol          VARCHAR(20) NOT NULL,
  india_vix       DECIMAL(8,4) NOT NULL,
  atm_iv          DECIMAL(8,4),
  iv_percentile   DECIMAL(5,2)
);

SELECT create_hypertable('iv_history', 'time');

-- PCR History
CREATE TABLE pcr_history (
  time            TIMESTAMPTZ NOT NULL,
  symbol          VARCHAR(20) NOT NULL,
  expiry_date     DATE NOT NULL,
  pcr_oi          DECIMAL(8,4) NOT NULL,  -- OI-based PCR
  pcr_volume      DECIMAL(8,4) NOT NULL,  -- Volume-based PCR
  call_oi_total   BIGINT,
  put_oi_total    BIGINT
);

SELECT create_hypertable('pcr_history', 'time');
```

## 14.3 Redis Data Structures

```
# Current option chain state (refreshed per tick)
KEY: oi:NIFTY:2024-01-18:{strikePrice}:{CE|PE}
TYPE: Hash
FIELDS: ltp, oi, oiChange, volume, iv, delta, gamma, theta, vega
TTL: None (overwritten per tick; cleared at market close)

# PCR state
KEY: pcr:NIFTY:2024-01-18
TYPE: Hash
FIELDS: pcrOI, pcrVolume, callOITotal, putOITotal, updatedAt
TTL: None

# Max pain
KEY: maxpain:NIFTY:2024-01-18
TYPE: String (strike price as integer)
TTL: 300 seconds (recalculate every 5 minutes)

# AI brief cache
KEY: ai:brief:NIFTY:morning
TYPE: String (JSON)
TTL: 1800 seconds (30 minutes)

# User session data
KEY: session:{userId}
TYPE: Hash
FIELDS: lastSymbol, alertSubscriptions, lastSeen
TTL: 86400 seconds (24 hours)

# Alert state (prevent duplicate firing)
KEY: alert:state:{alertId}
TYPE: String ("FIRED" | "READY")
TTL: 300 seconds (alert cooldown)
```

---

# 15. Performance Targets

## 15.1 Response Time Requirements

| Metric | Target | Critical Threshold |
|--------|--------|--------------------|
| **First Contentful Paint** | <800ms | <1.5s |
| **Time to Interactive** | <1.5s | <3s |
| **OI Chain Initial Load** | <500ms | <1s |
| **OI Heatmap Render** | <300ms | <600ms |
| **AI Brief Generation** | <3s | <8s (show skeleton) |
| **Alert Notification Delivery** | <2s | <5s |
| **WebSocket reconnect** | <500ms | <2s |
| **Greeks Calculation** | <5ms | <20ms |
| **Max Pain Calculation** | <100ms | <500ms |

## 15.2 Throughput Requirements

| Metric | Target |
|--------|--------|
| Concurrent WebSocket connections | 10,000+ |
| OI ticks processed per second | 5,000+ |
| AI brief requests per minute | 500+ |
| REST API requests per second | 1,000+ |

## 15.3 Data Freshness Requirements

| Data Type | Maximum Staleness (Market Hours) |
|-----------|----------------------------------|
| OI data | 30 seconds |
| PCR | 30 seconds |
| LTP / IV | 1 second (WebSocket push) |
| Max Pain | 5 minutes |
| AI Brief | 30 minutes (auto-refresh) |
| Greeks | 5 seconds |
| VIX | 5 seconds |

## 15.4 Availability Requirements

| Environment | SLA |
|-------------|-----|
| During market hours (9:00–3:30 PM) | 99.9% |
| Pre-market (7:00–9:15 AM) | 99.5% |
| Post-market (3:30–8:00 PM) | 99.5% |
| After hours | 99.0% |

**Zero-tolerance events:** No data outages during last 30 minutes of weekly F&O expiry.

---

# 16. Security Requirements

## 16.1 Authentication & Authorization

- All Flow Intelligence APIs require JWT Bearer token (inherited from TradeVault auth)
- WebSocket connections authenticate via one-time token issued by REST API
- Token TTL: 15 minutes for access token, 7 days for refresh token
- User's trading history/positions data: Only accessible to authenticated owner
- Alert configurations: User-scoped, no cross-user access

## 16.2 Data Security

- Market data: Not sensitive — but API keys to data providers must never be exposed client-side
- User positions and journal data: Encrypted at rest (AES-256)
- AI context (contains position + journal data): Transmitted to LLM provider over HTTPS; user consent required for AI analysis of personal data
- No trading data sold or shared with third parties (explicitly guaranteed)

## 16.3 Rate Limiting

| Endpoint | Rate Limit |
|----------|-----------|
| REST API (authenticated) | 600 req/min per user |
| WebSocket subscriptions | 20 symbols max per connection |
| AI brief generation | 10 requests/hour per user |
| Alert creation | 50 alerts max per user |

## 16.4 Market Data Provider Security

- API keys stored in environment variables (never in code)
- Keys rotated every 90 days
- Provider connections kept server-side only
- Failover to secondary provider if primary is unavailable

---

# 17. QA Strategy & Testing Matrix

## 17.1 Test Categories

### Functional Testing

| Test ID | Feature | Test Case | Expected Result |
|---------|---------|-----------|-----------------|
| QA-F-001 | Index Selector | Switch from Nifty to BankNifty | All panels update within 200ms |
| QA-F-002 | PCR Card | PCR crosses above 1.2 | Card turns green; interpretation updates |
| QA-F-003 | OI Heatmap | Hover a strike cell | Tooltip shows exact OI, OI change, and AI note |
| QA-F-004 | AI Brief | Request morning brief | Brief loads within 3s; contains conclusion + 3 observations |
| QA-F-005 | Smart Alerts | Create OI threshold alert | Alert fires within 15s of threshold breach |
| QA-F-006 | Option Chain | Sort by OI Change | Chain re-orders correctly; ATM indicator remains |
| QA-F-007 | My Positions | Open position exists in TradeVault | Position appears on OI heatmap with correct strike marker |
| QA-F-008 | Max Pain | Calculation with known data | Max Pain = confirmed correct value |

### Performance Testing

| Test ID | Scenario | Target | Measurement Method |
|---------|---------|--------|-------------------|
| QA-P-001 | Page load cold start | <1.5s TTI | Lighthouse / WebPageTest |
| QA-P-002 | OI chain load | <500ms | Custom timing in app |
| QA-P-003 | Concurrent WebSocket | 1,000 concurrent users | k6 load test |
| QA-P-004 | Expiry day stress | 5,000 concurrent users | k6 + server monitoring |
| QA-P-005 | Greeks calculation | <5ms per strike | Server-side profiling |
| QA-P-006 | Heatmap render | <300ms | Chrome Performance API |

### Stress Testing

| Test ID | Scenario | Acceptance Criteria |
|---------|---------|---------------------|
| QA-S-001 | Expiry day peak load | No crashes; graceful degradation; <3s response |
| QA-S-002 | Data provider outage | Fallback activated within 30s; user notified |
| QA-S-003 | Circuit breaker event | UI shows clear "Market Halted" state; no stale data |
| QA-S-004 | Redis failure | Primary cache failover to secondary within 1s |
| QA-S-005 | LLM provider outage | Cached AI brief served; UI indicates age |

### Usability Testing

| Test ID | Persona | Task | Success Metric |
|---------|---------|------|----------------|
| QA-U-001 | Arjun (Buyer) | Find today's key resistance level | ≤2 clicks, ≤10 seconds |
| QA-U-002 | Priya (Seller) | Check if IV is high enough to sell | ≤3 clicks, ≤15 seconds |
| QA-U-003 | Neha (Beginner) | Understand what PCR means | Find explanation in ≤5 seconds |
| QA-U-004 | Riya (Analyst) | Get full daily brief | Complete in ≤2 minutes |
| QA-U-005 | All | Set OI alert | Complete in ≤3 steps |

### Cognitive Load Testing

Conducted with 10 real traders:
- Eye-tracking: Primary attention points in first 5 seconds
- Think-aloud protocol: Does the user understand what they're seeing?
- Time-to-decision: How long to form a trade bias from the interface?
- Error rate: How often does the user misinterpret data?
- SUS (System Usability Scale): Target score ≥ 80

### Accuracy Testing

| Test ID | Item Tested | Method | Target Accuracy |
|---------|-------------|--------|-----------------|
| QA-A-001 | OI values | Cross-validate with NSE official data | 100% match |
| QA-A-002 | PCR calculation | Manual calculation vs displayed | 100% match |
| QA-A-003 | Max Pain | Reference formula vs displayed | 100% match |
| QA-A-004 | Greeks (Delta) | Black-Scholes reference vs calculated | <0.1% variance |
| QA-A-005 | IV | Market-implied vs displayed | <0.5% variance |
| QA-A-006 | AI factual claims | All cited data points verifiable | 100% verifiable |

---

## 17.2 Testing Environments

| Environment | Purpose | Data Source |
|-------------|---------|-------------|
| **Development** | Local development | Mock data provider |
| **Staging** | Pre-release testing | Live market data (delayed) |
| **Production (Canary)** | 5% traffic — new release | Live market data |
| **Production** | Full traffic | Live market data |

---

# 18. Production Readiness

## 18.1 Deployment Strategy

**Primary:** Cloud hosting on AWS/GCP Mumbai region (for market data proximity)

```yaml
Infrastructure:
  Region: ap-south-1 (Mumbai)
  Container: Docker / Kubernetes
  
Services:
  - api-server: 2 replicas minimum, auto-scale to 10
  - websocket-server: 3 replicas minimum, auto-scale to 20
  - data-worker: 1 primary, 1 hot standby
  - ai-service: 2 replicas, auto-scale to 8
  - redis: Redis Cluster (3 masters, 3 replicas)
  - postgresql: RDS PostgreSQL (Multi-AZ)
  - timescaledb: Self-managed on EC2 (Multi-AZ)
```

## 18.2 Monitoring & Observability

**Metrics Dashboard (Grafana/Datadog):**
- WebSocket active connections (by server)
- OI tick processing rate (ticks/second)
- API response times (P50, P95, P99)
- Cache hit rate (Redis)
- AI brief generation time
- Data freshness (age of last data update per symbol)
- Alert firing rate and delivery success rate

**Alerting (PagerDuty integration):**
| Alert | Threshold | Severity |
|-------|-----------|---------|
| API error rate | >1% for 2 minutes | Critical |
| WebSocket disconnections | >10% in 1 minute | Critical |
| Data provider offline | >30 seconds | Critical |
| Redis memory | >80% | Warning |
| AI brief failures | >20% for 5 minutes | Warning |
| Response time P99 | >3 seconds | Warning |

**Logging:**
- All API requests: method, path, status, duration, user_id
- WebSocket events: connection, subscription, disconnection
- Alert fires: user_id, alert_id, trigger_value, delivery_status
- AI briefs: symbol, generation_time, tokens_used, model
- Data provider events: connection state, tick counts, errors

## 18.3 Failure Recovery

| Failure | Detection | Recovery | Max Downtime |
|---------|-----------|---------|--------------|
| API server crash | Health check fails | Auto-restart (K8s) | <30 seconds |
| WebSocket server crash | Connection drop | Client auto-reconnect | <10 seconds |
| Data provider outage | Tick gap detection | Switch to backup provider | <60 seconds |
| Redis failure | Connection error | Failover to replica | <5 seconds |
| LLM provider outage | API error | Serve cached brief | <0 seconds |
| Database failure | Write error | Multi-AZ failover | <30 seconds |

## 18.4 Fallback Strategy

**Principle: Graceful degradation, never silent failure.**

| Component Fails | User Sees |
|----------------|-----------|
| Live OI data | "Data delayed — last updated [X] minutes ago" + visual staleness indicator |
| AI brief | "AI analysis temporarily unavailable — displaying last brief from [time]" |
| WebSocket | Automatic reconnection with progress indicator; falls back to polling |
| Provider 1 | Seamless switch to Provider 2 — user sees no disruption |
| Full data outage | Static "Markets data unavailable" state with clear explanation |

---

## 18.5 Market Hours Scaling

```
Schedule-based auto-scaling:
08:45 AM → Scale UP (pre-market preparation)
09:15 AM → Maximum capacity (market open)
03:30 PM → Begin scale down
04:30 PM → Normal capacity
```

## 18.6 Security Hardening Checklist

- [ ] HTTPS everywhere (HSTS enforced)
- [ ] CSP headers configured
- [ ] CORS restricted to TradeVault domains
- [ ] JWT secrets rotated quarterly
- [ ] SQL injection prevention (parameterized queries only)
- [ ] Input validation on all API endpoints
- [ ] Rate limiting enforced at API gateway
- [ ] DDoS protection (Cloudflare or equivalent)
- [ ] Penetration test before launch
- [ ] No API keys in client-side bundle
- [ ] User data encrypted at rest
- [ ] GDPR/privacy compliance review

---

# 19. Feature Roadmap

## 19.1 Release Plan

### V0.5 — Foundation (Month 1–2)
- Data provider integration (TrueData)
- Real-time OI feed (WebSocket)
- Basic option chain display
- PCR, Max Pain display
- Simple OI heatmap (static color scale)
- India VIX card
- Alert configuration (basic OI threshold)
- Mobile-responsive layout

### V1.0 — Launch (Month 3–4)
- AI Morning Brief (GPT-4o powered)
- Dynamic OI heatmap with animation
- IV dashboard (IV percentile, trend)
- Institutional flow feed
- Smart alert system (all alert types)
- My Positions integration (from TradeVault trades)
- Full option chain with Greeks
- Post-market review mode

### V1.1 — Enhancement (Month 5–6)
- IV surface visualization
- Intraday OI replay animation
- Multi-expiry PCR decomposition
- IV skew chart
- Greeks dashboard (dealer gamma, delta profile)
- Historical OI comparison
- Session-adaptive interface mode

### V2.0 — Professional (Month 7–9)
- Multi-symbol grid (4-index view)
- Position AI Coach (personalized risk analysis)
- Scenario modeler (interactive payoff simulation)
- Historical backtesting (OI patterns)
- Professional report export (PDF/CSV)
- Keyboard navigation and power user shortcuts
- API access for programmatic use

### V3.0 — Platform (Month 10–12)
- BankNifty weekly + monthly context separation
- Stock options support (top 50 stocks)
- Advanced flow analysis (gamma exposure dashboard)
- Community signals (curated professional flow commentary)
- Mobile native features (push alerts, lock screen widget)
- AI model fine-tuning on Indian market data

---

# 20. Risk Assessment

## 20.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Data provider reliability | Medium | Critical | Dual provider setup; failover in <60s |
| LLM hallucination in AI brief | Medium | High | Data validation layer; human-readable disclaimers |
| Performance on expiry days | High | High | Pre-scale infrastructure; load test at 2x normal capacity |
| WebSocket scalability | Medium | High | Horizontal scaling via K8s; Redis Pub/Sub decoupling |
| NSE data delays (3-minute official delay) | High | Medium | Use authorized real-time provider; communicate data source clearly |

## 20.2 Product Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Users trust AI blindly | Medium | High | Confidence indicators; "why?" audit trail; clear AI labeling |
| Feature overwhelm for beginners | Medium | Medium | Default to beginner layout; progressive disclosure enforced |
| Competitor copies feature set | High | Medium | Build network effects (personal context cannot be copied); focus on execution quality |
| Data accuracy disputes | Low | Critical | Cross-validate OI with NSE official data daily; transparency about data source |

## 20.3 Regulatory Risks

| Risk | Description | Mitigation |
|------|-------------|------------|
| SEBI regulations on financial advice | AI cannot give direct trading recommendations | Strictly frame AI as "analysis" not "advice"; legal review of all AI prompts |
| Data licensing compliance | Exchange data must be licensed | Verify data provider's exchange licensing; SEBI-compliant data sourcing |
| User data privacy | Trading data is highly sensitive | DPDP Act compliance; explicit consent for AI analysis of personal data |

---

# 21. Success Metrics

## 21.1 Product Metrics (90-day targets)

| Metric | Baseline | Target | Measurement |
|--------|---------|--------|-------------|
| DAT (Daily Active Traders on Flow) | 0 | 60% of options users | Analytics |
| Session length (market hours) | — | >8 minutes | Analytics |
| AI brief interaction rate | — | >45% | Click tracking |
| Alert creation rate | — | 1+ alert per active user | DB count |
| User confidence score | — | ≥8/10 | In-app survey |
| Week-1 retention | — | >70% | Analytics |
| NPS (Flow Intelligence specific) | — | ≥65 | Quarterly survey |
| Support tickets (confusion-related) | — | <2% of active users | Support data |

## 21.2 Business Metrics (90-day targets)

| Metric | Target |
|--------|--------|
| Premium tier conversion influenced by Flow | 15% of new conversions mention Flow |
| Churn reduction (users with Flow vs without) | 20% lower churn |
| Platform time-on-site increase | 25% increase |
| Social mentions / word-of-mouth | >100 organic mentions in trading communities |

## 21.3 Technical Metrics (Ongoing)

| Metric | Target |
|--------|--------|
| P99 API response time | <500ms |
| WebSocket data freshness | <30s for OI |
| Uptime (market hours) | 99.9% |
| AI brief accuracy (user-validated) | >90% useful rating |
| Zero data accuracy defects | 0 OI miscalculations |

---

# 22. Research Gaps & Open Questions

> [!IMPORTANT]
> The following items require additional research or decisions before implementation can begin.

## 22.1 Confirmed Research Gaps

### RG-001: Dealer Gamma Exposure Data
**Gap:** Accurate dealer/market-maker net gamma positioning data is not publicly available in India at the level it is in US markets (e.g., SpotGamma). Our Gamma Dashboard concept depends on this.  
**Impact:** Greeks Dashboard feature may need to be scoped to what is derivable from public OI data.  
**Action:** Investigate whether institutional data providers (Bloomberg, Refinitiv) offer this for Indian markets. Design Greeks Dashboard to work without this initially; add as upgrade when data is available.

### RG-002: Institutional vs Retail OI Split
**Gap:** NSE OI data does not distinguish between institutional and retail participation at the options contract level.  
**Impact:** "Institutional Flow" interpretation is inference-based, not directly observable.  
**Action:** Clearly label all institutional flow analysis as "likely institutional" based on contract size, timing, and OI characteristics. Never claim certainty about institutional identity.

### RG-003: Real-Time Data Licensing Costs
**Gap:** Exact cost structure of real-time options data from TrueData, NSE TAPI, or Kite Connect is not finalized.  
**Impact:** Infrastructure cost model may significantly affect pricing strategy.  
**Action:** Get quotes from 3 providers before committing to architecture. Compare per-user vs flat rate.

### RG-004: Mobile Options Trader Behavior
**Gap:** Research specifically on how Indian options traders use mobile vs desktop for analysis (not execution) is limited.  
**Impact:** Mobile feature prioritization decisions.  
**Action:** Run a 2-week survey with TradeVault users before mobile design begins.

### RG-005: AI Prompt Legal Review
**Gap:** Whether AI-generated market observations constitute "investment advice" under SEBI regulations has not been formally reviewed.  
**Impact:** Potential regulatory risk if AI output is too prescriptive.  
**Action:** Engage a SEBI-specialist legal counsel to review AI output framing before launch.

## 22.2 Open Design Questions

| # | Question | Decision Needed By |
|---|----------|-------------------|
| OQ-1 | Should Flow Intelligence have its own dedicated URL/page or be a tab within Markets? | Architecture decision — affects navigation model |
| OQ-2 | What is the maximum number of symbols supported simultaneously in V1? | Impacts data provider cost and UI complexity |
| OQ-3 | Should the AI brief be user-specific or index-specific (same for all users)? | V1.0 design decision |
| OQ-4 | How do we handle stock options in V1? (NSE has 200+ optionable stocks) | Feature scoping decision |
| OQ-5 | Should Flow Intelligence be behind a premium paywall? | Business model decision |

---

# 23. Appendix

## 23.1 Glossary

| Term | Definition |
|------|-----------|
| **OI** | Open Interest — total outstanding option contracts at a strike |
| **PCR** | Put-Call Ratio — ratio of put to call open interest or volume |
| **IV** | Implied Volatility — market's expectation of future volatility implied by option prices |
| **Max Pain** | Strike price where maximum number of options expire worthless (least pain for option sellers) |
| **Delta** | Change in option price per ₹1 change in underlying |
| **Gamma** | Change in Delta per ₹1 change in underlying |
| **Theta** | Daily time decay of option value |
| **Vega** | Change in option price per 1% change in IV |
| **IV Skew** | Difference in IV between OTM puts and OTM calls of same delta |
| **Gamma Wall** | Strike with concentrated dealer gamma exposure — acts as magnetic price level |
| **Long Buildup** | Price rising + OI rising = bullish conviction building |
| **Short Buildup** | Price falling + OI rising = bearish conviction building |
| **IV Crush** | Sudden IV drop after event (earnings, FOMC) causing option price collapse |

## 23.2 Reference Platforms Studied

1. **Sensibull** — sensibull.com
2. **Opstra** — opstra.definedge.com
3. **Strike Money** — strike.money
4. **Zerodha Kite** — kite.zerodha.com
5. **Dhan** — dhan.co
6. **TradingView** — tradingview.com
7. **NSE Option Chain** — nseindia.com
8. **ChartInk** — chartink.com
9. **Perplexity** — perplexity.ai (UX reference)
10. **Linear** — linear.app (design reference)
11. **Stripe Dashboard** — stripe.com (design reference)
12. **Vercel** — vercel.com (design reference)

## 23.3 Technical References

- Black-Scholes model implementation reference: Options, Futures, and Other Derivatives — John C. Hull
- Max Pain calculation: Sum of ITM values for all strikes; minimize for market makers
- India VIX calculation: NSE White Paper on India VIX Methodology (2008, updated 2018)
- TimescaleDB time-series partitioning: docs.timescale.com
- Redis Pub/Sub architecture: redis.io/docs/manual/pubsub

## 23.4 Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | August 2026 | Product Discovery Sprint | Initial PRD — full research + specification |

---

> **Approval Required From:** Head of Product • VP Engineering • Design Director • Legal Counsel  
> **Next Step:** Product review meeting → Engineering estimation → Design sprint kickoff → V0.5 development begins

---

*This PRD was generated through a comprehensive research and discovery sprint for TradeVault. All competitive intelligence is based on publicly available information, community feedback, and direct platform evaluation. This document represents a strategic recommendation and should be reviewed by qualified legal counsel before AI output framing is finalized.*

*"The market. Decoded."*
