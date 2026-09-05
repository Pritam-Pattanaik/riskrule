import { prisma } from './db';
import bcrypt from 'bcrypt';

async function seedTrader() {
  const email = 'trader@RiskRule.in';
  const password = 'Test@12345';
  
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        fullName: 'Test Trader'
      },
      create: {
        email,
        password: hashedPassword,
        fullName: 'Test Trader',
        role: 'USER',
      }
    });
    console.log('Test trader forced password reset successful.');
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
seedTrader();
