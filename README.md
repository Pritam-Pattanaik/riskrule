# RiskRules

<div align="center">

**Institutional-grade trading journal and market intelligence platform for retail traders.**

*Automated broker sync · AI behavioral coaching · Real-time market data · Discipline analytics*

![Version](https://img.shields.io/badge/version-2.0--alpha-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Node.js%20%2B%20PostgreSQL-purple)
![AI](https://img.shields.io/badge/AI-Groq%20%7C%20Anthropic-orange)

</div>

---

## What is RiskRules?

RiskRules bridges the gap between simplistic spreadsheet-based trade journals and prohibitively expensive institutional terminals. It combines:

- 📊 **Intelligent Trade Journal** — Auto-sync from Dhan and AngelOne with FIFO position aggregation
- 🤖 **AI Coach (Lunar AI)** — Behavioral pattern analysis with 12 dedicated trading modes
- 📰 **News Intelligence Engine** — RSS ingestion with LLM triage and sector impact scoring
- 📈 **Analytics Dashboard** — Win rate, drawdown, strategy performance, discipline scoring
- 🌍 **Market Intelligence Hub** — Real-time quotes, sector heatmaps, economic calendar

---

## Quick Start

### Prerequisites
- Node.js v18+
- npm v9+
- PostgreSQL or [Neon](https://neon.tech) account (free tier available)
- At least one AI API key: [Groq](https://console.groq.com) (recommended, free) or [Anthropic](https://console.anthropic.com)

### Installation

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd server && npm install && cd ..

# 3. Configure environment
cp server/.env.example server/.env
# Edit server/.env — minimum required:
# DATABASE_URL, JWT_SECRET, GROQ_API_KEY

# 4. Initialize database
cd server && npx prisma migrate dev && cd ..
```

### Run Development Server

```bash
npm run dev
# Frontend → http://localhost:5173
# Backend  → http://localhost:3000
```

### Build for Production

```bash
npm run build
```

---

## Project Structure

```
journal/
├── docs/                 # 📚 All documentation (start here)
│   ├── 00_INDEX.md      # Master documentation index
│   ├── Architecture.md  # System topology
│   ├── API.md           # REST API reference
│   └── ...              # 15 canonical documents
├── src/                  # 🎨 Frontend (React + Vite + TypeScript)
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route-level page views
│   ├── stores/          # Zustand state management
│   └── lib/             # API clients & utilities
├── server/               # ⚙️  Backend (Express + Prisma + TypeScript)
│   ├── src/routes/      # API route handlers
│   ├── src/lib/ai/      # AI providers & prompt builder
│   ├── src/market/      # Market data service
│   ├── src/news-engine/ # News ingestion pipeline
│   └── prisma/          # Database schema
├── tests/                # 🧪 E2E test suite
└── .archive/             # 📦 Historical material
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS 3 + Framer Motion 12 |
| State Management | Zustand 5 |
| Backend | Node.js + Express 5 |
| Database | PostgreSQL (Neon) + Prisma 6 ORM |
| Cache | Redis |
| AI Providers | Groq (Llama-3.3-70b) · Anthropic (Claude Sonnet/Haiku) |
| Broker APIs | Dhan · AngelOne |
| Deployment | Vercel |

---

## Documentation

All documentation lives in [`docs/`](./docs/) — start with the **[master index](./docs/00_INDEX.md)**.

| Document | Description |
|---|---|
| [Architecture](./docs/Architecture.md) | System topology & design patterns |
| [Technical](./docs/Technical.md) | Complete technical reference |
| [API](./docs/API.md) | REST API reference |
| [AI](./docs/AI.md) | AI architecture & prompt engineering |
| [TradingEngine](./docs/TradingEngine.md) | Broker integration & PnL calculations |
| [Security](./docs/Security.md) | Auth, RBAC & hardening guide |
| [Deployment](./docs/Deployment.md) | Environment setup & deployment |
| [Contributing](./docs/Contributing.md) | Development workflow & standards |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
<em>Built with inspiration from Linear, Vercel, and TradingView.</em>
</div>
