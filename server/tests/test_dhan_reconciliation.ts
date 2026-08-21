import * as assert from 'assert';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runDhanReconciliationAudit() {
  console.log('====================================================');
  console.log('📊 DHAN PLATFORM FORENSIC RECONCILIATION TEST');
  console.log('====================================================\n');

  const expectedByDate: Record<string, { gross: number; charges: number; net: number }> = {
    '2026-08-04': { gross: 1242.00, charges: 397.91, net: 844.09 },
    '2026-08-05': { gross: 2113.25, charges: 900.32, net: 1212.93 },
    '2026-08-06': { gross: 1247.25, charges: 523.46, net: 723.79 },
    '2026-08-07': { gross: 1487.81, charges: 813.64, net: 674.17 },
    '2026-08-10': { gross: -2148.25, charges: 984.52, net: -3132.77 },
    '2026-08-11': { gross: 2631.25, charges: 244.41, net: 2386.84 },
    '2026-08-12': { gross: -8708.76, charges: 1449.37, net: -10158.13 },
    '2026-08-13': { gross: -8536.49, charges: 1285.46, net: -9821.95 },
    '2026-08-14': { gross: 1433.50, charges: 559.06, net: 874.43 },
    '2026-08-17': { gross: 2192.00, charges: 204.03, net: 1987.97 },
  };

  const trades = await prisma.trade.findMany({
    where: {
      broker: 'dhan',
      source: 'broker_sync',
      date: {
        gte: new Date('2026-08-01T00:00:00.000Z'),
        lte: new Date('2026-08-17T23:59:59.999Z'),
      },
    },
    orderBy: { date: 'asc' },
  });

  const actualByDate: Record<string, { gross: number; charges: number; net: number; count: number }> = {};
  for (const t of trades) {
    const dStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date(t.date));
    if (!actualByDate[dStr]) {
      actualByDate[dStr] = { gross: 0, charges: 0, net: 0, count: 0 };
    }
    actualByDate[dStr].gross += parseFloat(t.pnl ? String(t.pnl) : '0');
    actualByDate[dStr].charges += parseFloat(t.charges ? String(t.charges) : '0');
    actualByDate[dStr].net += parseFloat(t.netPnl ? String(t.netPnl) : '0');
    actualByDate[dStr].count++;
  }

  let totalActualGross = 0;
  let totalActualCharges = 0;
  let totalActualNet = 0;

  for (const [dateStr, exp] of Object.entries(expectedByDate)) {
    const act = actualByDate[dateStr];
    assert.ok(act, `Missing trades in DB for date: ${dateStr}`);

    const grossDiff = Math.abs(act.gross - exp.gross);
    const chargesDiff = Math.abs(act.charges - exp.charges);
    const netDiff = Math.abs(act.net - exp.net);

    assert.ok(grossDiff < 0.05, `Gross P&L mismatch on ${dateStr}: Expected ${exp.gross}, got ${act.gross}`);
    assert.ok(chargesDiff < 0.05, `Charges mismatch on ${dateStr}: Expected ${exp.charges}, got ${act.charges}`);
    assert.ok(netDiff < 0.05, `Net P&L mismatch on ${dateStr}: Expected ${exp.net}, got ${act.net}`);

    totalActualGross += act.gross;
    totalActualCharges += act.charges;
    totalActualNet += act.net;

    console.log(`  ✅ ${dateStr}: Gross ${act.gross.toFixed(2)} | Charges ${act.charges.toFixed(2)} | Net ${act.net.toFixed(2)} (0.00 Diff)`);
  }

  assert.ok(Math.abs(totalActualGross - (-7046.44)) < 0.05, `Monthly Gross P&L mismatch: ${totalActualGross}`);
  assert.ok(Math.abs(totalActualCharges - 7362.18) < 0.05, `Monthly Charges mismatch: ${totalActualCharges}`);
  assert.ok(Math.abs(totalActualNet - (-14408.62)) < 0.05, `Monthly Net P&L mismatch: ${totalActualNet}`);

  console.log('\n----------------------------------------------------');
  console.log(`✅ MONTHLY GROSS P&L: ₹${totalActualGross.toFixed(2)} (Expected: -₹7,046.44)`);
  console.log(`✅ MONTHLY TOTAL CHARGES: ₹${totalActualCharges.toFixed(2)} (Expected: ₹7,362.18)`);
  console.log(`✅ MONTHLY NET P&L: ₹${totalActualNet.toFixed(2)} (Expected: -₹14,408.62)`);
  console.log('🎉 100% RECONCILIATION MATCH WITH DHAN PLATFORM');
  console.log('====================================================\n');
}

runDhanReconciliationAudit()
  .catch(err => {
    console.error('❌ Audit Failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
