/**
 * Central, validated runtime configuration.
 *
 * SECURITY RULES (enforced by tests + ESLint, see docs/SECURITY.md):
 *  - Secrets MUST come from the environment. There are NO hardcoded fallbacks.
 *  - In production, a missing/weak JWT_SECRET or CSRF_SECRET stops the process at boot.
 *  - JWT_SECRET and CSRF_SECRET must be different values.
 *  - Previously leaked secrets are rejected (stored as SHA-256 hashes, never as plaintext).
 *  - Only this module should read secret-bearing process.env values.
 */
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load .env files first so this module is correct regardless of import order.
// (dotenv never overrides variables that are already set, e.g. by Vercel.)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

/** SHA-256 hashes of secrets that were committed to source control. Treat as public. */
const COMPROMISED_SECRET_HASHES = new Set<string>([
  '44c7cfe73a1ec054f1dbea1a7d85004ff13130fac315915010d9678a6188521d',
  '828d1da722822b9eb7702f43710f9355139e406e5d56ff10a30a6541ef189e37',
  '169ba60f8afead1fe6e0d8ec43ca8b261f3d2cd7f856d134e63083613a3e660c',
  '7987fb37d4d205a20352ff2c966855a3ba4193567fb5e050413d3a6100e20bd7',
  '8f222733f984ec307eac21b8fa4af46ea6b8b2636fbb11fa9be6e27697190cd9',
]);

const MIN_SECRET_LENGTH = 32;
const MIN_UNIQUE_CHARS = 12;

export interface AppConfig {
  isProd: boolean;
  jwtSecret: string;
  csrfSecret: string;
  jwtIssuer: string;
  jwtAudience: string;
  razorpay: {
    keyId: string;
    keySecret: string;
    webhookSecret: string;
  };
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/** Returns a human readable reason if the secret is unacceptable, otherwise null. */
export function validateSecretStrength(name: string, value: string): string | null {
  if (value.length < MIN_SECRET_LENGTH) {
    return `${name} must be at least ${MIN_SECRET_LENGTH} characters (got ${value.length}).`;
  }
  if (new Set(value).size < MIN_UNIQUE_CHARS) {
    return `${name} has too little entropy (fewer than ${MIN_UNIQUE_CHARS} distinct characters).`;
  }
  if (COMPROMISED_SECRET_HASHES.has(sha256(value))) {
    return `${name} is a previously leaked value. Generate a new one.`;
  }
  return null;
}

const GENERATE_HINT =
  `Generate one with: node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`;

function resolveSecret(
  name: 'JWT_SECRET' | 'CSRF_SECRET',
  env: NodeJS.ProcessEnv,
  isProd: boolean,
  warn: (msg: string) => void,
): string {
  const value = env[name];

  if (!value) {
    if (isProd) {
      throw new ConfigError(`${name} is required in production. ${GENERATE_HINT}`);
    }
    // Development only: an ephemeral random secret. Never a constant, never shared.
    warn(`[config] ${name} is not set - using a random per-process secret (sessions reset on restart). Set it in server/.env.`);
    return crypto.randomBytes(48).toString('base64url');
  }

  const problem = validateSecretStrength(name, value);
  if (problem) {
    throw new ConfigError(`${problem} ${GENERATE_HINT}`);
  }
  return value;
}

/** Pure function (no side effects besides `warn`) so it can be unit tested with fake envs. */
export function loadConfig(
  env: NodeJS.ProcessEnv,
  warn: (msg: string) => void = (m) => console.warn(m),
): AppConfig {
  const isProd = env.NODE_ENV === 'production';

  const jwtSecret = resolveSecret('JWT_SECRET', env, isProd, warn);
  const csrfSecret = resolveSecret('CSRF_SECRET', env, isProd, warn);

  if (jwtSecret === csrfSecret) {
    throw new ConfigError('CSRF_SECRET must be different from JWT_SECRET (key separation).');
  }

  return {
    isProd,
    jwtSecret,
    csrfSecret,
    jwtIssuer: 'riskrule-api',
    jwtAudience: 'riskrule-web',
    // Razorpay values are optional at boot so a missing key cannot take the whole API down,
    // but every payment code path FAILS CLOSED when they are empty (see routes/payment.ts).
    razorpay: {
      keyId: env.RAZORPAY_KEY_ID || '',
      keySecret: env.RAZORPAY_KEY_SECRET || '',
      webhookSecret: env.RAZORPAY_WEBHOOK_SECRET || '',
    },
  };
}

export const config: AppConfig = loadConfig(process.env);
