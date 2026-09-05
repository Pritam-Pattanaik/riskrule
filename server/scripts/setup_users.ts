import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Update or create super admin
  await prisma.user.upsert({
    where: { email: 'superadmin@riskrule.in' },
    update: { password: adminPassword, role: 'SUPER_ADMIN' },
    create: { email: 'superadmin@riskrule.in', password: adminPassword, role: 'SUPER_ADMIN', fullName: 'Super Admin' }
  });

  // Update or create user
  await prisma.user.upsert({
    where: { email: 'user@riskrule.in' },
    update: { password: userPassword, role: 'USER' },
    create: { email: 'user@riskrule.in', password: userPassword, role: 'USER', fullName: 'Regular User' }
  });

  console.log("Users configured successfully");
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
