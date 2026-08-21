process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { prisma } from '../src/db';
import { SpotService } from '../src/flow/services/SpotService';

async function testDhan() {
  const broker = await prisma.brokerConnection.findFirst({
    where: {
      broker: { in: ['dhan', 'DHAN', 'Dhan'] as any },
      isActive: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log('Found broker:', broker?.broker, 'clientId:', broker?.clientId);
  let token = broker?.accessToken || broker?.apiKey;
  let clientId = broker?.clientId;
  if (!token && broker?.metadata) {
    const meta = typeof broker.metadata === 'string' ? JSON.parse(broker.metadata) : broker.metadata;
    token = meta.accessToken || meta.token || meta.apiKey;
    if (!clientId) clientId = meta.clientId;
  }

  const expiry = SpotService.getNearestExpiry('NIFTY');
  console.log('Target Expiry:', expiry);

  const payload = {
    UnderlyingScrip: 13,
    UnderlyingSeg: 'IDX_I',
    Expiry: expiry,
  };
  console.log('Calling Dhan optionchain with:', JSON.stringify(payload));

  const res = await fetch('https://api.dhan.co/v2/optionchain', {
    method: 'POST',
    headers: {
      'access-token': token!,
      'client-id': clientId!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  console.log('Dhan API response status:', res.status, res.statusText);
  const json = await res.json();
  console.log('Dhan API response keys:', Object.keys(json));
  if (json.data) {
    console.log('data keys:', Object.keys(json.data));
    const oc = json.data.oc || json.data;
    if (oc) {
      const strikes = Object.keys(oc);
      console.log(`Received ${strikes.length} strikes! First 5:`, strikes.slice(0, 5));
      if (strikes.length > 0) {
        console.log('Sample strike data for', strikes[0], JSON.stringify(oc[strikes[0]], null, 2));
      }
    }
  } else {
    console.log('Full JSON response:', JSON.stringify(json, null, 2));
  }
}

testDhan().catch(console.error).finally(() => prisma.$disconnect());
