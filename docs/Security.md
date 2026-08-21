# Security

**TradeVault Platform — Security Architecture, Threat Model & Hardening Guide**
**Document ID:** SEC-001
**Version:** 2.0
**Status:** Active

---

## Table of Contents

1. [Security Philosophy](#1-security-philosophy)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [Threat Model & Vulnerability Inventory](#3-threat-model--vulnerability-inventory)
4. [Data Isolation](#4-data-isolation)
5. [Secrets Management](#5-secrets-management)
6. [API Rate Limiting](#6-api-rate-limiting)
7. [Logging & Compliance](#7-logging--compliance)
8. [SEBI Regulatory Compliance](#8-sebi-regulatory-compliance)
9. [Security Hardening Checklist](#9-security-hardening-checklist)

---

## 1. Security Philosophy

**Zero-Trust and Immutable Logging.**

TradeVault handles highly sensitive financial data including broker API keys, trade records, and personal performance data. The security model enforces:

- **JWT-based authentication** with no session state on the server.
- **Multi-tenant data isolation** enforced at the ORM layer, not application layer.
- **Immutable audit logging** of all AI-generated content for regulatory transparency.
- **SEBI compliance** through mandatory educational disclaimers on all market analyses.
- **Graceful degradation** — security features never crash the application.

---

## 2. Authentication & Authorization

### JWT Implementation
- Tokens are signed with `JWT_SECRET` using HS256.
- Tokens are transmitted as `Bearer` tokens in the `Authorization` header.
- Routes are protected via `auth.ts` middleware that verifies signature and expiry before passing `req.userId`.

### RBAC (Role-Based Access Control)
| Role | Access Level |
|---|---|
| `USER` | Own data only |
| `SUB_ADMIN` | Moderated user management |
| `ADMIN` | Full user management |
| `SUPER_ADMIN` | Full system access including admin endpoints |

### Route Protection
```typescript
// All protected routes use auth middleware
router.use(authenticate); // Verifies JWT, sets req.userId

// Admin routes require elevated role check
router.use(requireAdmin);
```

---

## 3. Threat Model & Vulnerability Inventory

### SEC-01: User PII Leakage in Production Log Streams

**Severity:** P2 — MEDIUM
**File:** `server/src/routes/ai.ts:198`

**Vulnerability:**
```typescript
// VULNERABLE — emits userId to raw stdout
console.log('[AI-DEBUG-1] POST /chat hit. userId:', req.userId);
```
In containerized environments (Datadog, CloudWatch, Papertrail), this violates GDPR and Indian DPDP standards.

**Remediation:**
```typescript
// CORRECT — structured logger with metadata masking
logger.debug('[AI] Chat request received', {
  conversationId: req.body.conversationId,
  messageLength: req.body.message?.length
});
```

---

### SEC-02: Dual Authentication & localStorage JWT Exposure

**Severity:** P2 — MEDIUM
**File:** `src/lib/aiStreamClient.ts:27`

**Vulnerability:**
`aiStreamClient.ts` reads JWTs from `localStorage.getItem('token')` as a fallback. Tokens in `localStorage` are vulnerable to XSS extraction.

**Remediation:**
Standardize all streaming endpoints to use `credentials: 'include'` with `HttpOnly`, `SameSite: Strict`, `Secure` cookies. Eliminate `localStorage` token access entirely.

---

### SEC-03: Absence of Per-Route Rate Limiting

**Severity:** P2 — MEDIUM
**Files:** `server/src/index.ts`, `server/src/routes/marketV2.ts`

**Vulnerability:**
Authenticated users can make unrestricted requests to expensive LLM endpoints, enabling denial-of-wallet attacks.

**Remediation:**
```typescript
export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,  // 10 messages/min per user
  keyGenerator: (req: any) => req.userId || req.ip,
  message: { error: 'Rate limit exceeded.' }
});

export const aiSummaryRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,   // 5 requests/5min per user
  keyGenerator: (req: any) => req.userId || req.ip,
});
```

---

### SEC-04: Sentry Tracing Over-Sampling

**Severity:** P2 — MEDIUM
**File:** `server/src/index.ts:49`

**Vulnerability:**
`tracesSampleRate: 1.0` sends 100% of HTTP transactions to third-party monitoring.

**Remediation:**
```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 1.0,
});
```

---

## 4. Data Isolation

TradeVault is a multi-tenant system. Data isolation is enforced at the Prisma ORM layer:

```typescript
// Every data query is scoped to the authenticated user
const trades = await prisma.trade.findMany({
  where: { userId: req.userId }  // Never omit this
});
```

**Rule:** No Prisma query may access records without a `userId` filter. This is enforced in code review and must never be relaxed.

---

## 5. Secrets Management

All secrets are stored as environment variables in `server/.env` (local) or Vercel Environment Variables (production).

| Secret | Storage | Never Do |
|---|---|---|
| `JWT_SECRET` | Server `.env` | Commit to git |
| `DATABASE_URL` | Server `.env` | Expose to client |
| `ANTHROPIC_API_KEY` | Server `.env` | Log to console |
| `GROQ_API_KEY` | Server `.env` | Send to frontend |
| `GEMINI_API_KEY` | Server `.env` | Include in error messages |
| `DHAN_API_KEY` | Per-user, encrypted in DB | Store in plaintext |

See [Deployment.md](./Deployment.md) for the full environment variable reference.

---

## 6. API Rate Limiting

The `aiRateLimit.ts` middleware implements per-user rate limiting on all LLM endpoints. Redis is used for distributed rate limit state in multi-instance deployments.

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/ai/chat` | 10 requests | 1 minute |
| `GET /api/market/ai-summary` | 5 requests | 5 minutes |
| `POST /api/brokers/sync` | 1 request | 5 minutes |

---

## 7. Logging & Compliance

### Structured Logging
All logging uses Winston with structured metadata. PII (user IDs, emails) must never appear in log payloads.

### Immutable News Audit Log
Every AI-generated news impact analysis is recorded in `NewsAuditLog` with:
- The exact prompt sent to the LLM
- The exact raw response received
- The compliance-filtered output stored

This enables full regulatory audit trails without exposing implementation details.

---

## 8. SEBI Regulatory Compliance

TradeVault operates strictly in **EDUCATIONAL_MODE** as required by SEBI regulations:

1. **No Direct Advisory:** AI outputs never recommend specific securities to buy or sell.
2. **Mandatory Disclaimers:** All market analyses append SEBI educational disclaimers.
3. **Compliance Filter:** A post-processing filter strips any directional buy/sell recommendations before delivery to the client.
4. **Sector-Level Analysis Only:** AI discusses sectors and macro conditions, not ticker-level predictions.

---

## 9. Security Hardening Checklist

| Item | Status | Priority |
|---|---|---|
| Replace `console.log` with structured Winston logger | Pending | P2 |
| Eliminate `localStorage` JWT in `aiStreamClient.ts` | Pending | P2 |
| Implement per-route rate limiting with Redis | Partial | P2 |
| Set Sentry `tracesSampleRate: 0.05` in production | Pending | P2 |
| Enforce `HttpOnly` + `SameSite: Strict` cookies | Pending | P1 |
| Add input sanitization (Zod) on all routes | Partial | P1 |
| Enable HTTPS-only in production CORS | Done | P1 |
| Multi-tenant `userId` filter on all Prisma queries | Done | P0 |
| JWT signature verification on all protected routes | Done | P0 |
| Immutable `NewsAuditLog` | Done | P1 |

---

*See [Deployment.md](./Deployment.md) for environment variable setup. See [Architecture.md](./Architecture.md) for the overall system design.*
