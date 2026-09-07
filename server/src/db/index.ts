import dns from 'dns';
// Force IPv4 resolution — fixes Node 17+ IPv6 routing failures to Neon
// serverless Postgres on networks with broken IPv6.
dns.setDefaultResultOrder('ipv4first');

import * as dotenv from 'dotenv';
import path from 'path';

// Support loading .env whether located in server/ or project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

// Allow self-signed pooler certs on Windows/serverless
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Use the Node.js `pg` driver via Prisma's driver adapter.
// This makes Prisma connect through Node's TCP stack (which obeys
// dns.setDefaultResultOrder) instead of its Rust query engine binary
// (which does its own DNS resolution and picks up broken IPv6 on Windows).
const dbUrl = process.env.DATABASE_URL;

const shouldEnableSsl = (url?: string): boolean => {
  if (!url) return false;
  if (url.includes('sslmode=disable')) return false;
  const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
  const hasSslRequire = url.includes('sslmode=require') || url.includes('sslmode=verify-full') || url.includes('sslmode=verify-ca');
  if (isLocal && !hasSslRequire) return false;
  return true;
};

const pool = new pg.Pool({
  connectionString: dbUrl,
  ...(shouldEnableSsl(dbUrl) ? { ssl: { rejectUnauthorized: false } } : {}),
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };

