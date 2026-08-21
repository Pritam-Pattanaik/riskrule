import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'test@tradevalut.com' } });
  if (!user) {
    console.error('User not found');
    return;
  }
  
  const t = {
    userId: user.id,
    broker: 'dhan',
    brokerTradeId: 'test_' + Date.now(),
    date: new Date(),
    symbol: 'AAPL',
    market: 'NSE',
    instrumentType: 'EQ',
    direction: 'LONG',
    entryPrice: 100,
    exitPrice: 110,
    quantity: 10,
    currentQty: 0,
    exitQty: 10,
    realizedPnl: 100,
    charges: 5,
    netPnl: 95,
    status: 'WIN',
    disciplineScore: 3,
    disciplineRawScore: 2.5,
    confidence: 40,
    tradingStyle: 'Unknown',
    behaviourProfile: { holdDurationMins: 0, quantity: 10, pnl: 95 },
    disciplineBreakdown: { hold: -0.5, size: 0, sequence: 0, pnl: 0, timing: 0 },
    disciplineReasons: ['Test reason'],
    disciplineVersion: 1,
    source: 'broker_sync'
  };
  
  await prisma.trade.create({ data: t });
  console.log('Trade created for user:', user.email);
}
main().catch(console.error).finally(() => prisma.$disconnect());
