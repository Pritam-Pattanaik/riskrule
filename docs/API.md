# API Reference

**RiskRules Platform — REST API Reference**
**Document ID:** API-001
**Version:** 2.0
**Status:** Active

---

## Overview

- **Base URL (Local):** `http://localhost:3000`
- **Base URL (Production):** `https://riskrules.vercel.app`
- **API Prefix:** All endpoints are prefixed with `/api`
- **Auth:** JWT Bearer token required for all protected routes
- **Format:** JSON (`Content-Type: application/json`)

### Authentication Header
```http
Authorization: Bearer <jwt_token>
```

---

## Authentication

### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "trader@example.com",
  "password": "securepassword",
  "name": "John Trader"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": "clx...", "email": "trader@example.com", "name": "John Trader", "role": "USER" }
}
```

### POST /api/auth/login
Authenticate and receive a JWT token.

**Request:**
```json
{ "email": "trader@example.com", "password": "securepassword" }
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": "clx...", "email": "trader@example.com", "role": "USER" }
}
```

---

## Trades

### GET /api/trades
Fetch all trades for the authenticated user.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `status` | `OPEN\|WIN\|LOSS\|BREAKEVEN` | Filter by status |
| `symbol` | string | Filter by symbol |
| `from` | ISO date | Filter from date |
| `to` | ISO date | Filter to date |
| `cursor` | string | Cursor for pagination |
| `take` | number | Records per page (default 50) |

**Response (200):**
```json
{
  "trades": [
    {
      "id": "clx...",
      "symbol": "NIFTY 24600 CE",
      "direction": "LONG",
      "status": "WIN",
      "entryPrice": 425.50,
      "exitPrice": 510.00,
      "quantity": 50,
      "pnl": 4225.00,
      "netPnl": 4185.00,
      "charges": 40.00,
      "entryTime": "2026-08-16T09:15:00Z",
      "exitTime": "2026-08-16T14:30:00Z"
    }
  ],
  "nextCursor": "clx..."
}
```

### POST /api/trades
Create a new manual trade entry.

### PATCH /api/trades/:id
Update trade annotation (mindset, tags, strategy).

### DELETE /api/trades/:id
Delete a trade record.

---

## Broker Integration

### GET /api/brokers
List all configured broker connections for the user.

### POST /api/brokers
Connect a new broker (Dhan or AngelOne).

**Request:**
```json
{
  "broker": "DHAN",
  "apiKey": "dhan_api_key_...",
  "clientId": "1234567"
}
```

### POST /api/brokers/:id/sync
Trigger a trade sync for a specific broker connection.

**Response (200):**
```json
{
  "synced": 12,
  "inserted": 8,
  "updated": 4,
  "skipped": 0
}
```

---

## AI Coach

### GET /api/ai/conversations
Fetch all AI conversations for the authenticated user.

### POST /api/ai/conversations
Create a new AI Coach conversation.

**Request:**
```json
{ "mode": "general", "title": "Weekly Review Aug 16" }
```

### POST /api/ai/chat
Send a message and stream the AI response.

**Request:**
```json
{
  "conversationId": "clx...",
  "message": "Analyze my performance this week",
  "mode": "weekly-review"
}
```

**Response:** Server-Sent Events (SSE) stream
```
data: {"chunk": "Based on your "}
data: {"chunk": "trading this week..."}
data: {"done": true}
```

### DELETE /api/ai/conversations/:id
Delete a conversation and all its messages.

### PUT /api/ai/conversations/:id
Rename a conversation.

### PATCH /api/ai/conversations/:id/pin
Toggle pin status of a conversation.

---

## Market Data

### GET /api/market/quotes
Fetch current quotes for all tracked symbols (NIFTY, SENSEX, BANKNIFTY, etc.).

**Response (200):**
```json
{
  "quotes": {
    "nifty": { "price": 24850.40, "change": 125.60, "changePercent": 0.51 },
    "banknifty": { "price": 52340.25, "change": -45.80, "changePercent": -0.09 }
  },
  "cachedAt": "2026-08-16T09:30:00Z",
  "isStale": false
}
```

### GET /api/market/stream
Server-Sent Events stream for live market quote updates.

```
data: {"nifty": {"price": 24851.20, "change": 126.40}}
data: {"nifty": {"price": 24848.90, "change": 124.10}}
```

### GET /api/market/chart/:symbol
Fetch OHLCV chart data for a symbol.

**Query Parameters:**
| Param | Values | Description |
|---|---|---|
| `interval` | `5m\|15m\|1h\|1d` | Data interval |
| `range` | `1d\|1w\|1m\|3m\|1y` | Historical range |

### GET /api/market/sectors
Fetch sector performance data (IT, Banking, Pharma, etc.).

### GET /api/market/ai-summary
Fetch AI-generated market summary (cached 5 minutes).

---

## News Engine

### GET /api/news-engine/feed
Fetch the AI-processed news feed.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `category` | string | Filter by category (RBI, FII, EARNINGS, GLOBAL) |
| `minRelevance` | number | Minimum relevance score (0-10) |
| `take` | number | Number of articles (default 20) |

**Response (200):**
```json
{
  "articles": [
    {
      "id": "clx...",
      "title": "RBI holds repo rate at 6.5%",
      "source": "Economic Times",
      "publishedAt": "2026-08-16T10:00:00Z",
      "category": "RBI",
      "relevance": 9.2,
      "impact": {
        "sentiment": "BULLISH",
        "sectors": { "Banking": "bullish", "NBFC": "bullish" },
        "confidence": 0.87
      }
    }
  ]
}
```

---

## Analytics

### GET /api/analytics/summary
Fetch aggregated performance summary.

**Response (200):**
```json
{
  "totalTrades": 156,
  "winRate": 0.64,
  "profitFactor": 2.3,
  "avgWin": 3240.50,
  "avgLoss": -1820.25,
  "netPnl": 87650.00,
  "maxDrawdown": -12400.00,
  "currentStreak": 3
}
```

---

## Admin Endpoints

> **Requires:** `ADMIN` or `SUPER_ADMIN` role

### GET /api/admin/users
List all users with account details.

### GET /api/admin/system-health
Comprehensive system health diagnostics.

**Response (200):**
```json
{
  "activeProvider": "yahoo",
  "redisConnected": true,
  "dbConnected": true,
  "groqKeyStatus": { "market": "active", "chat": "active" },
  "inFlightRequests": 2,
  "activeSSEConnections": 47
}
```

---

## Health Check

### GET /health
Load balancer health probe. No authentication required.

**Response (200):**
```json
{ "status": "healthy", "timestamp": 1722681600000, "uptime": 86400 }
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE"
}
```

| Status | Code | Description |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid request body |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 403 | `FORBIDDEN` | Insufficient role/permissions |
| 404 | `NOT_FOUND` | Resource does not exist |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

*See [Backend.md](./Backend.md) for server implementation details. See [Security.md](./Security.md) for authentication details.*
