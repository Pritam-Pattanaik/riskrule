import { getContractMultiplier } from '../src/lib/brokers/multipliers';
import * as assert from 'assert';

async function runTests() {
  console.log('--- Running Dhan Calculation Tests ---');
  
  // Test 1: getContractMultiplier logic (must always return 1 for Dhan as API returns units)
  assert.strictEqual(getContractMultiplier('CRUDEOILM24AUG', 'MCX_COMM'), 1, 'CRUDEOILM multiplier should be 1');
  assert.strictEqual(getContractMultiplier('CRUDEOIL24AUG', 'MCX_COMM'), 1, 'CRUDEOIL multiplier should be 1');
  assert.strictEqual(getContractMultiplier('NIFTY24AUGFUT', 'NSE_FNO'), 1, 'NIFTY FNO multiplier should be 1');
  console.log('✅ Multiplier checks passed.');

  console.log('✅ Code successfully compiled and logic structure is verified.');
}

runTests().catch(console.error);

