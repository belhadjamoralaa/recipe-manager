import client from './client';

export async function login(email: string, password: string) {
  const res = await client.post('/auth/login', { email, password });
  return res.data;
}

export async function register(username: string, email: string, password: string) {
  const res = await client.post('/auth/register', { username, email, password });
  return res.data;
}

export async function getMe() {
  const res = await client.get('/auth/me');
  return res.data;
}
