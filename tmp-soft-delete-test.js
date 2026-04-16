import fetch from 'node-fetch';

const url = 'http://localhost:5000/api/auth/register';
const body = JSON.stringify({ email: 'test-soft-delete@example.com', password: 'Password123' });

fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
  .then(async (res) => {
    console.log('status', res.status);
    console.log(await res.text());
  })
  .catch((err) => {
    console.error(err);
  });
