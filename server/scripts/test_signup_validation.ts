import { isDisposableEmail, isValidEmailFormat, validateEmail } from '../src/lib/disposableEmail';
import { isValidPhoneNumber, normalizePhoneNumber, validatePhone } from '../src/lib/phoneValidation';

console.log('--- 🧪 Testing Email & Phone Validation Logic ---');

// Test Disposable Email Detection
const disposableEmails = [
  'test@mailinator.com',
  'user@tempmail.com',
  'trader@10minutemail.com',
  'user@yopmail.com',
  'trader@yopmail.fr',
  'burner@sharklasers.com',
  'throwaway@guerrillamail.com',
  'temp@dispostable.com',
  'test@getairmail.com',
  'user@sub.mailinator.com',
  'fake@burnermail.io',
  'anon@emailondeck.com',
];

const legitimateEmails = [
  'trader@gmail.com',
  'institutional@goldmansachs.com',
  'alice.bob@outlook.com',
  'developer@protonmail.com',
  'user@yahoo.co.in',
  'trader@tradevault.com',
];

console.log('\n[1] Testing Disposable Email Filter:');
for (const email of disposableEmails) {
  const isDisp = isDisposableEmail(email);
  if (!isDisp) {
    console.error(`❌ FAIL: Expected ${email} to be flagged as disposable!`);
    process.exit(1);
  } else {
    console.log(`  ✅ Successfully blocked disposable email: ${email}`);
  }
}

for (const email of legitimateEmails) {
  const isDisp = isDisposableEmail(email);
  const isFmt = isValidEmailFormat(email);
  if (isDisp || !isFmt) {
    console.error(`❌ FAIL: Legitimate email ${email} was wrongly rejected! (disp: ${isDisp}, fmt: ${isFmt})`);
    process.exit(1);
  } else {
    console.log(`  ✅ Legitimate email allowed: ${email}`);
  }
}

console.log('\n[2] Testing Phone Number Validation:');
const validPhones = [
  '+919876543210',
  '9876543210',
  '+91 98765 43210',
  '+1 (415) 555-2671',
  '09876543210',
  '+447911123456',
];

const invalidPhones = [
  '123',
  'abcdefghij',
  '+0000000000',
  '1111111111',
  '0000000000',
  '+123',
];

for (const phone of validPhones) {
  if (!isValidPhoneNumber(phone)) {
    console.error(`❌ FAIL: Expected valid phone: ${phone}`);
    process.exit(1);
  } else {
    console.log(`  ✅ Valid phone accepted: ${phone} -> normalized: ${normalizePhoneNumber(phone)}`);
  }
}

for (const phone of invalidPhones) {
  if (isValidPhoneNumber(phone)) {
    console.error(`❌ FAIL: Invalid phone accepted: ${phone}`);
    process.exit(1);
  } else {
    console.log(`  ✅ Invalid phone rejected: ${phone}`);
  }
}

console.log('\n🎉 ALL VALIDATION TESTS PASSED PERFECTLY!');
