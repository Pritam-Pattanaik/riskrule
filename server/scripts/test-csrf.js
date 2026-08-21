const http = require('http');

http.get('http://localhost:3000/api/auth/csrf', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const csrfToken = parsed.csrfToken;
    const cookies = res.headers['set-cookie'];
    console.log('CSRF Token:', csrfToken);
    console.log('Cookies:', cookies);

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
        'Cookie': cookies ? cookies.join('; ') : ''
      }
    }, (res2) => {
      let data2 = '';
      res2.on('data', c => data2 += c);
      res2.on('end', () => {
        console.log('Login Status:', res2.statusCode);
        console.log('Login Body:', data2);
      });
    });
    req.write(JSON.stringify({ email: 'trader@tradevault.com', password: 'Test@12345' }));
    req.end();
  });
});
