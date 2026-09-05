import { prisma } from './db';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function seedAdmin() {
  // C-2 fix: No default credentials. ADMIN_EMAIL and ADMIN_PASSWORD must be set explicitly.
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.');
    console.error('Usage: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=<strong-password> npx ts-node src/seed-admin.ts');
    process.exit(1);
  }
  if (password.length < 12) {
    console.error('ERROR: ADMIN_PASSWORD must be at least 12 characters long.');
    process.exit(1);
  }
  const fullName = 'System Super Admin';

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    
    if (existing) {
      console.log('Super admin already exists. Updating role to SUPER_ADMIN...');
      await prisma.user.update({
        where: { email },
        data: { role: 'SUPER_ADMIN' },
      });
    } else {
      console.log('Creating new Super Admin user...');
      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          role: 'SUPER_ADMIN',
        },
      });
      console.log('Super admin created successfully!');
      console.log('Email:', email);
      console.log('Password: [MASKED]');
    }

    // Seed initial system settings
    const forceReset = process.argv.includes('--reset') || process.argv.includes('--force');
    const settings = [
      { key: 'enable_ai_coach', value: 'true' },
      { key: 'enable_broker_sync', value: 'true' },
      { key: 'maintenance_mode', value: 'false' },
      { key: 'system_announcement', value: 'Welcome to RiskRules!' },
    ];

    for (const setting of settings) {
      const existingSetting = await prisma.systemSetting.findUnique({
        where: { key: setting.key },
      });

      if (!existingSetting) {
        await prisma.systemSetting.create({
          data: setting,
        });
        console.log(`Setting ${setting.key} created.`);
      } else if (forceReset) {
        await prisma.systemSetting.update({
          where: { key: setting.key },
          data: { value: setting.value },
        });
        console.log(`Setting ${setting.key} updated (forced reset).`);
      } else {
        console.log(`Setting ${setting.key} already exists (skipping).`);
      }
    }
  } catch (error) {
    console.error('Failed to seed admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
