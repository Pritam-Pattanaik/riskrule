/**
 * Security regression tests for C-1 (hardcoded secrets) and C-2 (free plan).
 * Run: cd server && npm test      (uses Node's built-in test runner via tsx)
 *
 * These tests intentionally do NOT need a database or the Razorpay SDK.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import jwt from 'jsonwebtoken';

import { config, loadConfig, validateSecretStrength, ConfigError } from '../../src/config/env';
import { signAccessToken, verifyAccessToken } from '../../src/lib/jwt';
import { verifyWebhookSignatureWith, verifyPaymentSignatureWith } from '../../src/lib/razorpaySignature';

// ES imports are hoisted, so we use whatever secrets config/env.ts generated/loaded for this process.
// (Without a .env this is a random per-process secret, which is exactly what we want in tests.)
const TEST_JWT = config.jwtSecret;
const TEST_CSRF = config.csrfSecret;

const SRC = path.resolve(__dirname, '../../src');
const noWarn = () => {};

function listFiles(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, out);
    else if (/\.(ts|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}
const rel = (f: string) => path.relative(SRC, f).replace(/\\/g, '/');

// ─────────────────────────── C-1: config / secrets ───────────────────────────

test('production refuses to boot without JWT_SECRET', () => {
  assert.throws(
    () => loadConfig({ NODE_ENV: 'production', CSRF_SECRET: TEST_CSRF }, noWarn),
    (e: unknown) => e instanceof ConfigError && /JWT_SECRET is required/.test((e as Error).message),
  );
});

test('production refuses to boot without CSRF_SECRET', () => {
  assert.throws(
    () => loadConfig({ NODE_ENV: 'production', JWT_SECRET: TEST_JWT }, noWarn),
    (e: unknown) => e instanceof ConfigError && /CSRF_SECRET is required/.test((e as Error).message),
  );
});

test('short and low-entropy secrets are rejected (no silent padding)', () => {
  assert.ok(validateSecretStrength('JWT_SECRET', 'short'));
  assert.ok(validateSecretStrength('JWT_SECRET', 'a'.repeat(64)));
  assert.equal(validateSecretStrength('JWT_SECRET', TEST_JWT), null);
});

test('previously leaked fallback secrets are rejected', () => {
  // Rebuilt from parts so this test file itself does not re-introduce the literals.
  const leaked = [
    ['riskrule_production_jwt_secret_key_safe_2026', 'x89a_99887766_secure'].join('_'),
    ['riskrule_csrf_fallback_2026', 'x99887766'].join('_'),
    ['super-secret-jwt-key-for-dev-only', 'change-in-prod'].join('-'),
  ];
  for (const secret of leaked) {
    assert.match(validateSecretStrength('JWT_SECRET', secret) ?? '', /leaked|at least|entropy/);
    assert.throws(() => loadConfig({ NODE_ENV: 'production', JWT_SECRET: secret, CSRF_SECRET: TEST_CSRF }, noWarn), ConfigError);
  }
});

test('JWT_SECRET and CSRF_SECRET must differ', () => {
  assert.throws(
    () => loadConfig({ NODE_ENV: 'production', JWT_SECRET: TEST_JWT, CSRF_SECRET: TEST_JWT }, noWarn),
    /must be different/,
  );
});

test('development without secrets gets random (never constant) secrets', () => {
  const a = loadConfig({ NODE_ENV: 'development' }, noWarn);
  const b = loadConfig({ NODE_ENV: 'development' }, noWarn);
  assert.notEqual(a.jwtSecret, b.jwtSecret);
  assert.notEqual(a.jwtSecret, a.csrfSecret);
});

test('source tree contains no hardcoded fallback for secret-like env vars', () => {
  const pattern = /process\.env\.[A-Z0-9_]*(SECRET|PASSWORD|PRIVATE_KEY|API_KEY|TOKEN)[A-Z0-9_]*\s*(\|\||\?\?)\s*['"`][^'"`]+['"`]/;
  const offenders = listFiles(SRC)
    .filter((f) => pattern.test(fs.readFileSync(f, 'utf8')))
    .map(rel);
  assert.deepEqual(offenders, [], `Hardcoded secret fallbacks found in: ${offenders.join(', ')}`);
});

// ─────────────────────────── C-1: JWT verification ───────────────────────────

const claims = { iss: 'riskrule-api', aud: 'riskrule-web' };

test('a freshly signed token verifies and carries the token version', () => {
  const token = signAccessToken({ id: 'user-1', tokenVersion: 3 });
  assert.deepEqual(verifyAccessToken(token), { userId: 'user-1', v: 3 });
});

test('token WITHOUT the v claim is rejected (used to bypass revocation)', () => {
  const forged = jwt.sign({ userId: 'user-1' }, TEST_JWT, { algorithm: 'HS256', expiresIn: '1h', issuer: claims.iss, audience: claims.aud });
  assert.throws(() => verifyAccessToken(forged), /token version/);
});

test('token signed with a different secret is rejected', () => {
  const other = jwt.sign({ userId: 'user-1', v: 0 }, crypto.randomBytes(48).toString('base64url'), { algorithm: 'HS256', issuer: claims.iss, audience: claims.aud });
  assert.throws(() => verifyAccessToken(other));
});

test('token with wrong issuer/audience is rejected', () => {
  const wrongAud = jwt.sign({ userId: 'u', v: 0 }, TEST_JWT, { algorithm: 'HS256', issuer: claims.iss, audience: 'someone-else' });
  const wrongIss = jwt.sign({ userId: 'u', v: 0 }, TEST_JWT, { algorithm: 'HS256', issuer: 'evil', audience: claims.aud });
  assert.throws(() => verifyAccessToken(wrongAud));
  assert.throws(() => verifyAccessToken(wrongIss));
});

test('alg=none and non-HS256 tokens are rejected', () => {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ userId: 'u', v: 0, iss: claims.iss, aud: claims.aud })).toString('base64url');
  assert.throws(() => verifyAccessToken(`${header}.${body}.`));
  const hs512 = jwt.sign({ userId: 'u', v: 0 }, TEST_JWT, { algorithm: 'HS512', issuer: claims.iss, audience: claims.aud });
  assert.throws(() => verifyAccessToken(hs512));
});

test('expired token is rejected', () => {
  const expired = jwt.sign({ userId: 'u', v: 0 }, TEST_JWT, { algorithm: 'HS256', expiresIn: -10, issuer: claims.iss, audience: claims.aud });
  assert.throws(() => verifyAccessToken(expired), /expired/);
});

// ─────────────────────────── C-2: free plan / commission ──────────────────────

test('the free-upgrade and simulate endpoints no longer exist', () => {
  const affiliate = fs.readFileSync(path.join(SRC, 'routes/affiliate.ts'), 'utf8');
  assert.ok(!/router\.(post|put|patch|get)\(\s*['"`]\/upgrade-to-pro/.test(affiliate), 'upgrade-to-pro route must not exist');
  assert.ok(!/router\.(post|put|patch|get)\(\s*['"`]\/simulate-referral/.test(affiliate), 'simulate-referral route must not exist');
});

test('paid plans are only granted by services/billing.ts', () => {
  // Write contexts only: data: { plan: 'PRO' | 'ELITE' | <something>.planType }
  // (reads like where: { plan: 'PRO' } and response bodies like res.json({ plan }) are fine)
  const grant = /data\s*:\s*\{[^{}]*\bplan\s*:\s*(['"`](PRO|ELITE)['"`]|[A-Za-z_.]*[pP]lanType)/;
  const allowed = new Set(['services/billing.ts']);
  const offenders = listFiles(SRC)
    .filter((f) => !allowed.has(rel(f)))
    .filter((f) => !/(^|\/)(seed[^/]*|list_users|migrate-[^/]*)\.ts$/.test(rel(f)))
    .filter((f) => grant.test(fs.readFileSync(f, 'utf8')))
    .map(rel);
  assert.deepEqual(offenders, [], `Plan grants found outside billing service: ${offenders.join(', ')}`);
});

test('affiliate commission is only credited from the billing service', () => {
  const callers = listFiles(SRC)
    .filter((f) => /creditAffiliateReward\s*\(/.test(fs.readFileSync(f, 'utf8')))
    .map(rel)
    .sort();
  assert.deepEqual(callers, ['routes/affiliate.ts', 'services/billing.ts']); // definition + sole caller
});

test('no route creates affiliate earnings directly', () => {
  const offenders = listFiles(SRC)
    .filter((f) => rel(f) !== 'routes/affiliate.ts') // only the reward helper may do it
    .filter((f) => /affiliateEarning\s*\.\s*create/.test(fs.readFileSync(f, 'utf8')))
    .map(rel);
  assert.deepEqual(offenders, []);
  const affiliate = fs.readFileSync(path.join(SRC, 'routes/affiliate.ts'), 'utf8');
  const creates = affiliate.match(/affiliateEarning\s*\.\s*create/g) ?? [];
  assert.equal(creates.length, 1, 'only creditAffiliateReward may create earnings');
});

// ─────────────────────────── C-2: webhook / signature hardening ───────────────

test('webhook signature: valid passes; tampered / empty-secret / garbage fail', () => {
  const secret = 'whsec_' + crypto.randomBytes(24).toString('hex');
  const body = Buffer.from(JSON.stringify({ event: 'payment.captured' }));
  const sig = crypto.createHmac('sha256', secret).update(body).digest('hex');

  assert.equal(verifyWebhookSignatureWith(secret, body, sig), true);
  assert.equal(verifyWebhookSignatureWith(secret, Buffer.from('{"event":"x"}'), sig), false, 'tampered body');
  assert.equal(verifyWebhookSignatureWith('', body, sig), false, 'empty secret must fail closed');
  assert.equal(verifyWebhookSignatureWith(secret, body, ''), false, 'empty signature');
  assert.equal(verifyWebhookSignatureWith(secret, body, 'zz-not-hex'), false, 'garbage signature');
  assert.equal(verifyWebhookSignatureWith(secret, body, sig.slice(0, 10)), false, 'truncated signature');
  // An attacker who signs with an EMPTY key must not be accepted.
  const forged = crypto.createHmac('sha256', '').update(body).digest('hex');
  assert.equal(verifyWebhookSignatureWith(secret, body, forged), false);
});

test('payment signature: empty key secret can never validate (forgeable HMAC)', () => {
  const params = { razorpay_order_id: 'order_1', razorpay_payment_id: 'pay_1' };
  const forged = crypto.createHmac('sha256', '').update('order_1|pay_1').digest('hex');
  assert.equal(verifyPaymentSignatureWith('', { ...params, razorpay_signature: forged }), false);

  const keySecret = crypto.randomBytes(16).toString('hex');
  const good = crypto.createHmac('sha256', keySecret).update('order_1|pay_1').digest('hex');
  assert.equal(verifyPaymentSignatureWith(keySecret, { ...params, razorpay_signature: good }), true);
  assert.equal(verifyPaymentSignatureWith(keySecret, { ...params, razorpay_order_id: 'order_2', razorpay_signature: good }), false);
});

test('webhook route fails closed (static guard on payment.ts)', () => {
  const src = fs.readFileSync(path.join(SRC, 'routes/payment.ts'), 'utf8');
  assert.ok(!/if\s*\(\s*process\.env\.RAZORPAY_WEBHOOK_SECRET\s*\)/.test(src), 'signature check must not be conditional on env presence');
  assert.ok(/rawBody/.test(src), 'must verify against the raw request body');
  assert.ok(!/JSON\.stringify\(req\.body\)/.test(src), 'must not verify a re-serialised body');
  assert.ok(!/notes\.userId|notes\.planType/.test(src), 'must not trust webhook notes for user/plan');
});
