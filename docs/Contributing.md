# Contributing

**TradeVault Platform — Contributor Guide & Engineering Standards**
**Document ID:** CONTRIB-001
**Version:** 1.0
**Status:** Active

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Development Workflow](#2-development-workflow)
3. [Code Standards](#3-code-standards)
4. [Commit Conventions](#4-commit-conventions)
5. [Branch Strategy](#5-branch-strategy)
6. [Pull Request Process](#6-pull-request-process)
7. [Documentation Standards](#7-documentation-standards)

---

## 1. Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- PostgreSQL (or a [Neon](https://neon.tech) account for serverless PostgreSQL)
- Redis (optional; market data falls back gracefully without it)
- Git

### Initial Setup
```bash
# 1. Clone the repository
git clone <repo-url>
cd journal

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server && npm install && cd ..

# 4. Configure environment
cp server/.env.example server/.env
# Edit server/.env with your DATABASE_URL, JWT_SECRET, and AI keys

# 5. Apply database migrations
cd server && npx prisma migrate dev && cd ..

# 6. Start development servers
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000
```

---

## 2. Development Workflow

### Running the Dev Environment
```bash
npm run dev            # Start both frontend and backend
npm run dev:frontend   # Frontend only (Vite, port 5173)
npm run dev:backend    # Backend only (Express, port 3000)
```

### Before Committing
```bash
npm run lint           # ESLint — must pass with 0 errors
npm run build          # TypeScript build — must compile cleanly
npm run test:e2e       # E2E tests — must pass
```

---

## 3. Code Standards

### TypeScript
- **Strict mode** is enabled. No `any` types unless absolutely justified with a comment.
- All function parameters and return types must be typed.
- Prefer `interface` over `type` for object shapes; use `type` for unions and intersections.

### React
- Components use **function declarations** (not arrow functions) for top-level components.
- State updates must be **immutable** (use spread operators, never mutate).
- Expensive computations must be wrapped in `useMemo` or `useCallback`.
- All effects must declare dependencies in the `useEffect` array.

### Zustand Stores
- Each store owns one clear domain.
- Never derive state in a store — derive it at the component level using selectors.
- All async actions must handle both success and error states.

### API Routes (Backend)
- Every route must validate input with Zod before processing.
- Every route must enforce `req.userId` data isolation.
- Routes must never leak implementation details in error messages.

### Prisma Queries
- **Mandatory:** All queries must include `where: { userId: req.userId }`.
- Use cursor-based pagination for lists > 50 items.
- Never perform raw SQL unless Prisma query API is genuinely insufficient.

---

## 4. Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes only
style:    Code style/formatting (no logic change)
refactor: Code restructuring (no behavior change)
test:     Adding or modifying tests
chore:    Build process, dependencies, tooling
perf:     Performance improvements
```

**Examples:**
```
feat(ai): add Nemotron provider for trade analysis mode
fix(dhan): apply MCX contract multiplier to CRUDEOILM positions
docs(readme): update quick start with Redis setup instructions
test(discipline): add unit test for partial fill brokerage calculation
```

---

## 5. Branch Strategy

```
main          → Production-ready code; requires PR + review
develop       → Integration branch for features
feature/*     → Individual feature branches (e.g., feature/nemotron-provider)
fix/*         → Bug fix branches (e.g., fix/dhan-mcx-multiplier)
docs/*        → Documentation-only changes
```

---

## 6. Pull Request Process

1. **Branch:** Create a branch from `develop` with the appropriate prefix.
2. **Code:** Make changes adhering to the standards above.
3. **Test:** Ensure `npm run lint` and `npm run build` pass.
4. **Document:** Update relevant docs in `docs/` if behavior changes.
5. **PR:** Open PR against `develop` with a description following this template:

```markdown
## What changed
Brief description of the change.

## Why
The problem being solved or feature being added.

## How to test
Steps to verify the change works.

## Checklist
- [ ] Lint passes
- [ ] TypeScript compiles
- [ ] No `console.log` in production code paths
- [ ] Docs updated (if applicable)
- [ ] No new `any` types introduced
```

---

## 7. Documentation Standards

- All new features must include documentation updates in the relevant `docs/` file.
- Use the canonical document structure established in [00_INDEX.md](./00_INDEX.md).
- Never create new ad-hoc markdown files in the root — use `docs/` or `.archive/`.
- Breaking changes must be recorded in [Changelog.md](./Changelog.md).

---

*See [Technical.md](./Technical.md) for architecture details. See [Deployment.md](./Deployment.md) for environment setup.*
