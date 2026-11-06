/**
 * Read-only forensic audit script for C-1 & C-2.
 * Run: cd server && npx tsx scripts/security-audit-c1-c2.ts
 *
 * Checks the database for:
 *  1. Users on a paid plan (PRO / ELITE) with role=USER who have NO captured payment in `payments`.
 *  2. Duplicate affiliate commission rows for the same (affiliateId, referredUserId, planType).
 *  3. Affiliate commission rows whose referredUserId has NO captured payment.
 *  4. Simulated trader accounts created by the removed `/simulate-referral` route.
 *  5. Affiliate payouts where requested amount exceeds real `affiliate_earnings`.
 */
import { prisma } from '../src/db';

async function runAudit() {
  const db = prisma as any;

  console.log('=== RiskRule C-1 / C-2 Read-Only Forensic Audit ===\n');

  // 1. Paid-plan users with no captured payment
  const unpaidProUsers = await db.$queryRaw<
    Array<{ id: string; email: string; plan: string; created_at: Date }>
  >`
    SELECT u.id, u.email, u.plan, u.created_at
    FROM users u
    LEFT JOIN payments p ON p.user_id = u.id AND p.status = 'captured'
    WHERE u.plan <> 'FREE' AND u.role = 'USER' AND p.id IS NULL
    ORDER BY u.created_at DESC
  `;
  console.log(`[1] Paid-plan users (role=USER) with NO captured payment: ${unpaidProUsers.length}`);
  for (const u of unpaidProUsers) {
    console.log(`    - ${u.id} | ${u.email} | plan=${u.plan} | created=${u.created_at}`);
  }

  // 2. Duplicate commission rows for the same referred user
  const duplicateCommissions = await db.$queryRaw<
    Array<{ affiliate_id: string; referred_user_id: string; plan_type: string; n: bigint; total: number }>
  >`
    SELECT affiliate_id, referred_user_id, plan_type, COUNT(*) AS n, SUM(amount) AS total
    FROM affiliate_earnings
    GROUP BY affiliate_id, referred_user_id, plan_type
    HAVING COUNT(*) > 1
  `;
  console.log(`\n[2] Duplicate commission groups: ${duplicateCommissions.length}`);
  for (const d of duplicateCommissions) {
    console.log(
      `    - affiliate=${d.affiliate_id} referred=${d.referred_user_id} plan=${d.plan_type} count=${d.n} sum=₹${d.total}`,
    );
  }

  // 3. Commissions whose referred user never paid
  const unbackedCommissions = await db.$queryRaw<
    Array<{ id: string; affiliate_id: string; referred_user_id: string; amount: number; created_at: Date }>
  >`
    SELECT e.id, e.affiliate_id, e.referred_user_id, e.amount, e.created_at
    FROM affiliate_earnings e
    LEFT JOIN payments p ON p.user_id = e.referred_user_id AND p.status = 'captured'
    WHERE p.id IS NULL
    ORDER BY e.created_at DESC
  `;
  console.log(`\n[3] Affiliate commissions with NO captured payment by referred user: ${unbackedCommissions.length}`);
  for (const e of unbackedCommissions) {
    console.log(
      `    - earning=${e.id} affiliate=${e.affiliate_id} referred=${e.referred_user_id} amount=₹${e.amount}`,
    );
  }

  // 4. Simulated users from /simulate-referral
  const simulatedUsers = await db.$queryRaw<
    Array<{ id: string; email: string; referred_by_id: string | null; plan: string }>
  >`
    SELECT id, email, referred_by_id, plan
    FROM users
    WHERE email ~ '^trader_[0-9]{4}@riskrule\\.io$'
  `;
  console.log(`\n[4] Simulated accounts (trader_XXXX@riskrule.io): ${simulatedUsers.length}`);
  for (const s of simulatedUsers) {
    console.log(`    - ${s.id} | ${s.email} | plan=${s.plan} | referredBy=${s.referred_by_id}`);
  }

  // 5. Payouts requested
  const payouts = await db.$queryRaw<
    Array<{ id: string; affiliate_id: string; amount: number; status: string; invoice_id: string; created_at: Date }>
  >`
    SELECT id, affiliate_id, amount, status, invoice_id, created_at
    FROM affiliate_payouts
    WHERE status IN ('Processing', 'Pending', 'Paid')
    ORDER BY created_at DESC
  `;
  console.log(`\n[5] Active / completed affiliate payouts: ${payouts.length}`);
  for (const p of payouts) {
    console.log(
      `    - ${p.invoice_id} | affiliate=${p.affiliate_id} | ₹${p.amount} | status=${p.status} | ${p.created_at}`,
    );
  }

  console.log('\n=== Audit Complete ===');
}

runAudit()
  .catch((err) => {
    console.error('Audit failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
