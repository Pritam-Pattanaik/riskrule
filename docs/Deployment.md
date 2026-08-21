# Deployment

**TradeVault Platform — Deployment Architecture, Environment Configuration & Operations Guide**
**Document ID:** DEP-001
**Version:** 2.0
**Status:** Active

---

## Table of Contents

1. [Deployment Architecture](#1-deployment-architecture)
2. [Environment Variables Reference](#2-environment-variables-reference)
3. [Local Development Setup](#3-local-development-setup)
4. [Production Deployment (Vercel)](#4-production-deployment-vercel)
5. [Scalability Architecture](#5-scalability-architecture)
6. [Health Monitoring & Operations](#6-health-monitoring--operations)
7. [Database Management (Prisma)](#7-database-management-prisma)

---

## 1. Deployment Architecture

TradeVault uses a **monorepo-style** layout with a Vite frontend and an Express backend, both deployed on Vercel.

```
journal/
├── src/              # Frontend — deployed as @vercel/static-build
├── server/           # Backend  — deployed as @vercel/node
└── vercel.json       # Routing configuration
```

### Vercel Configuration (`vercel.json`)
- Frontend static build served from `/` routes.
- Backend API proxied at `/api/*` routes to Express serverless functions.
- `server/.env` secrets managed via Vercel Environment Variables dashboard.

---

## 2. Environment Variables Reference

All variables must be defined in `server/.env` for local development, and in the Vercel Dashboard for production.

| Variable | Required | Default | Description | Example |
|---|:---:|---|---|---|
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string (Neon serverless) | `postgresql://user:pass@ep-host.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | **Yes** | `fallback_secret` | Secret key for signing JWTs | `super_secret_jwt_key_12345` |
| `PORT` | No | `3000` | Express server port (local development) | `3000` |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173` | Comma-separated CORS origins | `http://localhost:5173,https://tradevault.vercel.app` |
| `ANTHROPIC_API_KEY` | No* | — | Anthropic Claude API key | `sk-ant-api03-...` |
| `GEMINI_API_KEY` | No* | — | Google Gemini API key | `AIzaSy...` |
| `GROQ_API_KEY` | No* | — | Groq API key (fast inference) | `gsk_...` |
| `REDIS_URL` | No | — | Redis connection URL for caching | `redis://localhost:6379` |
| `SENTRY_DSN` | No | — | Sentry error tracking DSN | `https://...@sentry.io/...` |
| `NODE_ENV` | No | `development` | Environment mode | `production` |

> **\*AI Keys Note:** At least one AI provider key is required to use the AI Coach and Trade Analysis features. Groq is the primary provider; Anthropic is used for News Engine.

---

## 3. Local Development Setup

### Prerequisites
- Node.js v18+
- npm v9+
- PostgreSQL (or Neon account for serverless)
- Redis (optional — market data falls back to in-memory)

### Installation

```bash
# 1. Clone and enter the project
git clone <repo-url>
cd journal

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server && npm install && cd ..

# 4. Configure environment
cp server/.env.example server/.env
# Edit server/.env with your DATABASE_URL, JWT_SECRET, and AI keys

# 5. Run database migrations
cd server && npx prisma migrate dev && cd ..
```

### Running the Development Server

```bash
# Start both frontend (port 5173) and backend (port 3000) concurrently
npm run dev

# Or separately:
npm run dev:frontend   # Vite dev server at http://localhost:5173
npm run dev:backend    # Express API at http://localhost:3000
```

### Other Scripts

```bash
npm run build          # Production TypeScript build + Vite bundle
npm run lint           # ESLint static analysis
npm run preview        # Preview production build locally
npm run test:e2e       # Run E2E test suite
```

---

## 4. Production Deployment (Vercel)

### Steps

1. Connect the repository to Vercel.
2. Set **Root Directory** to `journal/`.
3. Add all environment variables from Section 2 in the Vercel Dashboard.
4. Vercel auto-detects Vite and deploys the frontend as static assets.
5. The `server/` directory is deployed as serverless Node.js functions.

### Database Migrations in Production

```bash
# Run from server/ directory with production DATABASE_URL
cd server
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

---

## 5. Scalability Architecture

### Current Capacity
In the default single-process configuration, the platform supports approximately **50–100 concurrent active users** due to:
- Single-process SSE in-memory broadcasting.
- Shared Yahoo Finance API key (rate-limited per IP).
- Single shared Groq API key.

### Horizontal Scaling Target

```
┌────────────────────────────────────────────────────────────────────┐
│                   MULTI-INSTANCE TOPOLOGY                          │
│                                                                    │
│                  [Cloudflare / NGINX ALB]                          │
│                  (Sticky Sessions / WSS)                           │
│                         │                                          │
│          ┌──────────────┴──────────────┐                           │
│          ▼                             ▼                           │
│ ┌─────────────────────┐     ┌─────────────────────┐                │
│ │  Node.js Instance 1 │     │  Node.js Instance 2 │                │
│ │  (SSE Clients 1-N)  │     │ (SSE Clients N+1-2N)│                │
│ └──────────┬──────────┘     └──────────┬──────────┘                │
│            └──────────────────────────┘                            │
│                         │                                          │
│            ┌─────────────────────────┐                             │
│            │   REDIS CLUSTER / PUB-SUB│                            │
│            │ Channel: market:quotes  │                             │
│            └────────────┬────────────┘                             │
│                         │                                          │
│            ┌─────────────────────────┐                             │
│            │  Dedicated Market       │                             │
│            │  Ingestor (Single Leader│                             │
│            └─────────────────────────┘                             │
└────────────────────────────────────────────────────────────────────┘
```

For multi-instance scaling:
1. A **leader instance** runs `MarketWorker` polling on a 60s timer.
2. The leader **publishes** quote payloads to Redis channel `market:quotes:stream`.
3. **All instances** subscribe and broadcast to their SSE clients.

---

## 6. Health Monitoring & Operations

### Public Health Check
`GET /health` — Returns `200 OK` for load balancer health probes:
```json
{
  "status": "healthy",
  "timestamp": 1722681600000,
  "uptime": 86400
}
```

### Admin System Diagnostics
`GET /api/admin/system-health` — Requires admin API key:
```json
{
  "activeProvider": "yahoo",
  "redisConnected": true,
  "dbConnected": true,
  "groqKeyStatus": {
    "market": "active",
    "chat": "active",
    "engine": "active"
  },
  "inFlightRequests": 0,
  "activeSSEConnections": 1420
}
```

---

## 7. Database Management (Prisma)

### Common Commands

```bash
# Generate Prisma client (after schema changes)
cd server && npx prisma generate

# Create and apply a new migration
cd server && npx prisma migrate dev --name <migration-name>

# Apply migrations in production
cd server && npx prisma migrate deploy

# Open Prisma Studio (database GUI)
cd server && npx prisma studio

# Seed the database
cd server && npx tsx src/seed.ts
```

### Database Seeding Scripts

| Script | Purpose |
|---|---|
| `src/seed.ts` | Full seed with sample trades and data |
| `src/seed-admin.ts` | Create admin user accounts |
| `src/seed-trader.ts` | Create a demo trader account |

---

*See [Security.md](./Security.md) for secrets management. See [Architecture.md](./Architecture.md) for the full system topology.*
