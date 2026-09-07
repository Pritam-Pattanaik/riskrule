import dns from 'dns';
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

import { PrismaClient as PipelinePrismaClient } from '../../prisma/generated/pipeline';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pipelineUrl = process.env.PIPELINE_DATABASE_URL || process.env.DATABASE_URL;

const shouldEnableSsl = (url?: string): boolean => {
  if (!url) return false;
  if (url.includes('sslmode=disable')) return false;
  const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
  const hasSslRequire = url.includes('sslmode=require') || url.includes('sslmode=verify-full') || url.includes('sslmode=verify-ca');
  if (isLocal && !hasSslRequire) return false;
  return true;
};

const pool = new pg.Pool({
  connectionString: pipelineUrl,
  ...(shouldEnableSsl(pipelineUrl) ? { ssl: { rejectUnauthorized: false } } : {}),
});

const adapter = new PrismaPg(pool);
const pipelineDb = new PipelinePrismaClient({ adapter });

export { pipelineDb };

