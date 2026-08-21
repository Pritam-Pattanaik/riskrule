import { prisma } from '../src/db';

async function check() {
  const brokers = await prisma.brokerConnection.findMany();
  console.log('--- BROKER CONNECTIONS IN DB ---');
  console.log(JSON.stringify(brokers.map(b => ({
    id: b.id,
    userId: b.userId,
    broker: b.broker,
    hasApiKey: Boolean(b.apiKey),
    hasAccessToken: Boolean(b.accessToken),
    clientId: b.clientId,
    isActive: b.isActive,
    metadata: b.metadata,
    createdAt: b.createdAt
  })), null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
