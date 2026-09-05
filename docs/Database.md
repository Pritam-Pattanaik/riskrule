# Database

**RiskRule Platform — Database Architecture, Schema Reference & Data Design**
**Document ID:** DB-001
**Version:** 2.0
**Status:** Active

---

## Table of Contents

1. [Database Overview](#1-database-overview)
2. [Technology Stack](#2-technology-stack)
3. [Entity Relationship Overview](#3-entity-relationship-overview)
4. [Core Data Models](#4-core-data-models)
5. [AI & News Engine Models](#5-ai--news-engine-models)
6. [Key Design Patterns](#6-key-design-patterns)
7. [Indexes & Performance](#7-indexes--performance)
8. [Migration Management](#8-migration-management)

---

## 1. Database Overview

RiskRule uses **PostgreSQL** (hosted on Neon Serverless) accessed exclusively through **Prisma ORM 6**. The schema enforces strict multi-tenancy — every user's data is completely isolated.

---

## 2. Technology Stack

| Component | Technology |
|---|---|
| Database | PostgreSQL (Neon Serverless) |
| ORM | Prisma 6 |
| Connection pooling | Neon serverless driver (pgBouncer) |
| Schema location | `server/prisma/schema.prisma` |
| Client singleton | `server/src/db/index.ts` |

---

## 3. Entity Relationship Overview

```
User
 ├── Trade[]                    (broker-synced or manual trades)
 ├── JournalEntry[]             (daily pre/post market logs)
 ├── Strategy[]                 (user-defined trading strategies)
 ├── Goal[]                     (performance goals)
 ├── BrokerConnection[]         (encrypted broker API credentials)
 ├── AiConversation[]           (AI chat sessions)
 │    └── AiMessage[]           (individual chat messages)
 ├── CoachMemory[]              (persistent behavioral patterns)
 ├── Note[]                     (quick notes)
 ├── Reflection[]               (post-market reflections)
 ├── TradingRule[]              (risk enforcement rules)
 └── Notification[]             (push notification records)

NewsItem
 ├── NewsImpact[]               (AI sector impact scores)
 └── NewsAuditLog[]             (immutable AI prompt/response log)
```

---

## 4. Core Data Models

### User
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  passwordHash  String
  role          Role     @default(USER)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  trades           Trade[]
  journalEntries   JournalEntry[]
  strategies       Strategy[]
  goals            Goal[]
  brokerConnections BrokerConnection[]
  conversations    AiConversation[]
  coachMemory      CoachMemory[]
  notes            Note[]
  reflections      Reflection[]
  tradingRules     TradingRule[]
  notifications    Notification[]
}

enum Role {
  USER
  SUB_ADMIN
  ADMIN
  SUPER_ADMIN
}
```

### Trade
```prisma
model Trade {
  id              String      @id @default(cuid())
  userId          String
  brokerTradeId   String?     @unique  // Dhan/AngelOne execution ID
  symbol          String
  exchangeSegment String      // NSE_FNO, MCX_COMM, BSE_EQ, etc.
  direction       Direction   // LONG, SHORT
  status          TradeStatus // OPEN, WIN, LOSS, BREAKEVEN

  entryPrice  Float
  exitPrice   Float?
  quantity    Int             // Always in units (not lots)
  
  pnl         Float?          // Gross PnL
  charges     Float?          // Total charges (brokerage + taxes)
  netPnl      Float?          // Net PnL = pnl - charges

  entryTime   DateTime
  exitTime    DateTime?

  strategyId  String?
  mindset     String?         // User annotation
  tags        String[]

  user        User    @relation(fields: [userId], references: [id])
}

enum Direction   { LONG SHORT }
enum TradeStatus { OPEN WIN LOSS BREAKEVEN }
```

### AiConversation & AiMessage
```prisma
model AiConversation {
  id        String   @id @default(cuid())
  userId    String
  title     String
  mode      String   @default("general")
  isPinned  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  messages  AiMessage[]
  user      User @relation(fields: [userId], references: [id])
}

model AiMessage {
  id             String   @id @default(cuid())
  conversationId String
  role           MessageRole  // user, assistant, system
  content        String   @db.Text
  createdAt      DateTime @default(now())

  conversation AiConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}
```

### CoachMemory
```prisma
model CoachMemory {
  id          String   @id @default(cuid())
  userId      String
  patternType String   // REVENGE_TRADING, FOMO, OVERLEVERAGING, etc.
  severity    String   // LOW, MEDIUM, HIGH, CRITICAL
  description String   @db.Text
  evidence    String[] // Trade IDs that triggered this pattern
  isActive    Boolean  @default(true)
  lastSeenAt  DateTime @default(now())
  createdAt   DateTime @default(now())

  user        User @relation(fields: [userId], references: [id])
}
```

### BrokerConnection
```prisma
model BrokerConnection {
  id          String   @id @default(cuid())
  userId      String
  broker      String   // DHAN, ANGELONE
  apiKey      String   // Encrypted at rest
  apiSecret   String?  // Encrypted at rest
  isActive    Boolean  @default(true)
  lastSyncAt  DateTime?
  createdAt   DateTime @default(now())

  user        User @relation(fields: [userId], references: [id])
}
```

---

## 5. AI & News Engine Models

### NewsItem
```prisma
model NewsItem {
  id          String   @id @default(cuid())
  urlHash     String   @unique  // Dedup key
  title       String
  description String?  @db.Text
  url         String
  source      String
  publishedAt DateTime
  category    String?  // RBI, FII, EARNINGS, GLOBAL, TECHNICAL
  
  impact      NewsImpact?
  auditLogs   NewsAuditLog[]
}
```

### NewsImpact
```prisma
model NewsImpact {
  id           String   @id @default(cuid())
  newsItemId   String   @unique
  relevance    Float    // 0-10 score
  sectors      Json     // { "IT": "bullish", "Banking": "bearish" }
  sentiment    String   // BULLISH, BEARISH, NEUTRAL
  confidence   Float?   // 0-1 confidence rating
  createdAt    DateTime @default(now())
  
  newsItem     NewsItem @relation(fields: [newsItemId], references: [id])
}
```

### NewsAuditLog (Immutable)
```prisma
model NewsAuditLog {
  id           String   @id @default(cuid())
  newsItemId   String
  promptSent   String   @db.Text  // Exact prompt sent to LLM
  rawResponse  String   @db.Text  // Raw LLM response
  filteredOutput String @db.Text  // Post-compliance-filter output
  provider     String              // ANTHROPIC, GROQ
  model        String              // claude-haiku-4-5, llama-3.3-70b
  createdAt    DateTime @default(now())  // Never updated

  newsItem     NewsItem @relation(fields: [newsItemId], references: [id])
}
```

---

## 6. Key Design Patterns

### Multi-Tenancy Enforcement
```typescript
// REQUIRED: Every data query must scope to userId
const trades = await prisma.trade.findMany({
  where: { userId: req.userId }  // Never omit this
});

// WRONG: Would expose all users' data
const trades = await prisma.trade.findMany();
```

### Immutable Audit Log
`NewsAuditLog` records are **never updated or deleted**. They are append-only, providing a complete history of all AI interactions for regulatory compliance.

### Soft Deletes
Most models support logical deletion (mark `isActive: false`) rather than hard deletion to preserve data integrity.

### Trade Quantity Normalization
All trade quantities are stored in **units** (not lots), regardless of how the broker returned them. The conversion from lots → units happens in the broker adapter before database insertion.

---

## 7. Indexes & Performance

Key indexes defined in `schema.prisma`:

```prisma
@@index([userId])              // On Trade, JournalEntry, all user-scoped models
@@index([userId, status])      // On Trade — filter open/closed positions
@@index([userId, createdAt])   // On Trade, JournalEntry — chronological queries
@@index([conversationId])      // On AiMessage — load messages for a conversation
@@index([urlHash])             // On NewsItem — deduplication check
@@index([newsItemId])          // On NewsImpact, NewsAuditLog — joins
```

### Query Optimization Patterns
- **Cursor pagination** for large datasets (messages, trades):
  ```typescript
  prisma.trade.findMany({ take: 50, cursor: { id: lastId }, skip: 1 })
  ```
- **Select only needed fields** — never `findMany` without specifying `select`:
  ```typescript
  prisma.trade.findMany({ select: { id: true, symbol: true, netPnl: true } })
  ```

---

## 8. Migration Management

```bash
# Development: Create and apply a new migration
cd server
npx prisma migrate dev --name <description>

# Production: Apply existing migrations only (no schema changes)
npx prisma migrate deploy

# Generate Prisma client after schema changes
npx prisma generate

# Reset and re-seed (DESTRUCTIVE — development only)
npx prisma migrate reset

# Open visual database GUI
npx prisma studio
```

### Migration Best Practices
- Always commit migration files (`prisma/migrations/`) to Git.
- Test migrations in a staging environment before production.
- Never modify existing migration files — create new migrations for changes.
- Document breaking schema changes in [Changelog.md](./Changelog.md).

---

*See [Backend.md](./Backend.md) for server implementation details. See [Deployment.md](./Deployment.md) for database environment configuration.*
