import { prisma } from './db';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users in DB:');
  for (const u of users) {
    console.log(`- ${u.email} | ${u.fullName} | Role: ${u.role}`);
  }
}

main().catch(console.error);
