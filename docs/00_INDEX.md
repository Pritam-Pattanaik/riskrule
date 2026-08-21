# TradeVault Documentation Index

**Single Source of Truth — All Official Documentation**
**Last Updated:** 2026-08-16
**Status:** Active

---

## Quick Navigation

| Document | Purpose | Audience |
|---|---|---|
| [Architecture.md](./Architecture.md) | System topology, data flows, design patterns | Principal Engineers, Architects |
| [Technical.md](./Technical.md) | Complete technical reference, folder structure, status | All Engineers |
| [Frontend.md](./Frontend.md) | React design system, components, state management | Frontend Engineers |
| [Backend.md](./Backend.md) | Express routes, middleware, background services | Backend Engineers |
| [Database.md](./Database.md) | Prisma schema, models, migration guide | Backend Engineers, DBAs |
| [API.md](./API.md) | REST API reference for all endpoints | All Engineers, Integrators |
| [AI.md](./AI.md) | AI architecture, models, prompt engineering, SEBI compliance | AI Engineers |
| [TradingEngine.md](./TradingEngine.md) | Market data waterfall, broker integration, PnL calculations | Trading Engineers |
| [Security.md](./Security.md) | Auth, RBAC, threat model, hardening guide | Security Engineers |
| [Deployment.md](./Deployment.md) | Environment variables, local setup, Vercel deployment | DevOps, All Engineers |
| [Testing.md](./Testing.md) | Test pyramid, FMEA matrix, E2E test cases | QA, All Engineers |
| [Contributing.md](./Contributing.md) | Development workflow, code standards, PR process | All Contributors |
| [Changelog.md](./Changelog.md) | Version history of all notable changes | All Stakeholders |
| [FutureRoadmap.md](./FutureRoadmap.md) | Product and engineering roadmap | Product, Engineering |
| [PRD.md](./reference/01_Product_Requirement_Document.md) | Full product requirements document | Product, Engineering |
| [Blueprint.md](./reference/02_Engineering_Master_Blueprint.md) | Engineering master blueprint | Principal Engineers |

---

## Documentation Philosophy

This documentation set follows **Single Source of Truth (SSOT)** principles:

1. **Each topic has exactly one canonical document.** Never create a duplicate.
2. **Link, don't copy.** If you need to reference content from another doc, link to it.
3. **Update the source.** If behavior changes, update the canonical doc immediately.
4. **Archive history.** Old reports and investigations go to `.archive/` — never deleted.

---

## Repository Overview

```
journal/                           Application root
├── .archive/                      Historical material (never deleted)
│   ├── agent-sessions/           AI orchestration session logs
│   ├── audits/                    Bug investigation reports (resolved)
│   ├── data/                      Raw JSON data exports
│   └── academic/                  SIP internship documentation
├── docs/                          ← YOU ARE HERE (Production documentation)
├── public/                        Static assets (favicons, manifest)
├── scripts/                       Frontend build utilities
├── server/                        Backend Express application
├── src/                           Frontend React application
├── tests/                         E2E test suite
└── README.md                      Developer quickstart
```

---

## Document Status Legend

| Status | Meaning |
|---|---|
| **Active** | Current, accurate, maintained |
| **In Review** | Being updated, may be partially stale |
| **Archived** | Historical value only — see `.archive/` |
| **Deprecated** | Superseded by a newer document |

---

## Audit Trail

| Date | Action | Files Affected |
|---|---|---|
| 2026-08-16 | Repository Cleanup V2 — Production documentation structure created | All `docs/` files |
| 2026-08-16 | Archived 24 AI agent session folders → `.archive/agent-sessions/` | All `.agents/*` |
| 2026-08-16 | Archived 9 bug investigation reports → `.archive/audits/` | Root-level MD files |
| 2026-08-16 | Consolidated `docs/project-audits/` into canonical docs | Multiple files |
| 2026-08-03 | Initial audit report set created by AI agents | `docs/project-audits/**` |
