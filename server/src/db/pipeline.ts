import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

// Allow self-signed pooler certs on Windows/serverless
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import { PrismaClient as PipelinePrismaClient } from '../../prisma/generated/pipeline';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../../../.env') });

const pipelineUrl = process.env.PIPELINE_DATABASE_URL || process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString: pipelineUrl,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const pipelineDb = new PipelinePrismaClient({ adapter });

export { pipelineDb };
