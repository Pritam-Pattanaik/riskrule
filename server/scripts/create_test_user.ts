import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Test@12345', 12);
  await prisma.user.create({
    data: {
      email: 'test@tradevalut.com',
      password: hash,
      fullName: 'Test User'
    }
  });
  console.log('User created');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
