const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(`BODY: ${data}`));
});

req.on('error', console.error);
req.write(JSON.stringify({ email: 'trader@RiskRule.in', password: 'Test@12345' }));
req.end();
