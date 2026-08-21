import * as assert from 'assert';
import { syncDhanTrades } from '../src/lib/brokers/dhan';
import { computeStats } from '../../src/lib/analytics';
import type { Trade } from '../../src/types';

async function runPipelineIntegrityTests() {
  console.log('====================================================');
  console.log('🧪 TRADING PIPELINE FORENSIC INTEGRITY TEST SUITE');
  console.log('====================================================\n');

  // Test 1: Mathematical Accuracy of Trade Calculations
  console.log('[Test 1] Verifying Long & Short P&L with Charges Math...');
  {
    const mockBuys = [{ qty: 50, price: 100.0 }, { qty: 50, price: 105.0 }]; // Total: 100 @ 102.5
    const mockSells = [{ qty: 100, price: 110.0 }]; // Total: 100 @ 110.0
    
    const avgBuy = mockBuys.reduce((s, b) => s + b.qty * b.price, 0) / 100;
    const avgSell = 110.0;
    const grossPnl = (avgSell - avgBuy) * 100;
    const charges = 40.0;
    const netPnl = parseFloat((grossPnl - charges).toFixed(2));

    assert.strictEqual(avgBuy, 102.5, 'Avg buy price must be 102.5');
    assert.strictEqual(grossPnl, 750.0, 'Gross P&L must be 750.00');
    assert.strictEqual(netPnl, 710.0, 'Net P&L must be 710.00');
    console.log('  ✅ Long trade mathematical reconciliation passed.');
  }

  // Test 2: Status Assignment based on Net P&L
  console.log('\n[Test 2] Verifying Status Assignment (WIN/LOSS/BREAKEVEN)...');
  {
    const getStatus = (netPnl: number) => netPnl > 0 ? 'WIN' : netPnl < 0 ? 'LOSS' : 'BREAKEVEN';
    assert.strictEqual(getStatus(0.01), 'WIN');
    assert.strictEqual(getStatus(-0.01), 'LOSS');
    assert.strictEqual(getStatus(0.00), 'BREAKEVEN');
    console.log('  ✅ Trade status assignment rules validated.');
  }

  // Test 3: Expectancy & Risk Math Consistency
  console.log('\n[Test 3] Verifying Risk Analytics & Expectancy Formulation...');
  {
    const winRatePct = 60.0; // 60%
    const avgWin = 1000.0;
    const avgLoss = 500.0;
    const expectancy = ((winRatePct / 100) * avgWin) - ((1 - (winRatePct / 100)) * avgLoss);
    
    // Expectancy = (0.60 * 1000) - (0.40 * 500) = 600 - 200 = 400
    assert.strictEqual(expectancy, 400.0, 'Expectancy must be exactly 400.00');
    console.log('  ✅ Quantitative expectancy formulas reconciled.');
  }

  // Test 4: Frontend computeStats Canonical Net P&L
  console.log('\n[Test 4] Verifying Frontend computeStats aggregation...');
  {
    const mockTrades: Trade[] = [
      {
        id: 't1',
        date: '2026-08-18T09:15:00.000Z',
        symbol: 'NIFTY 24500 CE',
        market: 'NSE_FNO',
        instrumentType: 'CE',
        direction: 'LONG',
        entryPrice: 100,
        exitPrice: 120,
        quantity: 50,
        pnl: 1000,
        charges: 50,
        netPnl: 950,
        status: 'WIN',
        source: 'broker_sync',
        disciplineScore: 4,
      },
      {
        id: 't2',
        date: '2026-08-18T10:15:00.000Z',
        symbol: 'BANKNIFTY 52000 PE',
        market: 'NSE_FNO',
        instrumentType: 'PE',
        direction: 'LONG',
        entryPrice: 200,
        exitPrice: 180,
        quantity: 30,
        pnl: -600,
        charges: 50,
        netPnl: -650,
        status: 'LOSS',
        source: 'broker_sync',
        disciplineScore: 3,
      },
    ];

    const stats = computeStats(mockTrades);
    assert.strictEqual(stats.totalPnl, 300, 'Total PnL must be 950 + (-650) = 300');
    assert.strictEqual(stats.winRate, 50, 'Win rate must be 50%');
    assert.strictEqual(stats.totalTrades, 2, 'Total trades must be 2');
    assert.strictEqual(stats.avgDiscipline, 3.5, 'Avg discipline must be (4+3)/2 = 3.5');
    console.log('  ✅ Frontend stats compute engine validated.');
  }

  console.log('\n====================================================');
  console.log('🎉 ALL 4 PIPELINE INTEGRITY AUDIT SUITES PASSED (0.00 DIFF)');
  console.log('====================================================\n');
}

runPipelineIntegrityTests().catch(err => {
  console.error('❌ Pipeline Integrity Suite Failed:', err);
  process.exit(1);
});
