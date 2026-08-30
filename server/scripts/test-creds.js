require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findUnique({ where: { email: 'test@RiskRules.in' } });
    if (!user) {
      console.log('User not found in DB');
      return;
    }
    console.log('User found:', user.email);
    const isValid = await bcrypt.compare('Test@12345', user.password);
    if (isValid) {
      console.log('Password is correct!');
    } else {
      console.log('Password is incorrect.');
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
