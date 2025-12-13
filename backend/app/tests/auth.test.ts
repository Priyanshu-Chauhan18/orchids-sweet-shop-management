import request from 'supertest';
import app from '../server';
import { resetDB } from './setupTestDB';

const api = () => request(app);

describe('Auth Tests', () => {
  beforeEach(async () => {
    await resetDB();
  });

  it('register success', async () => {
    const res = await api().post('/api/auth/register').send({ username: 'alice', password: 'secret123' });
    expect(res.status).toBe(201);
    expect(res.body.user.username).toBe('alice');
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('duplicate username', async () => {
    await api().post('/api/auth/register').send({ username: 'bob', password: 'secret123' });
    const res = await api().post('/api/auth/register').send({ username: 'bob', password: 'secret123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/exists/i);
  });

  it('login success', async () => {
    await api().post('/api/auth/register').send({ username: 'carol', password: 'secret123' });
    const res = await api().post('/api/auth/login').send({ username: 'carol', password: 'secret123' });
    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('carol');
  });

  it('invalid login', async () => {
    const res = await api().post('/api/auth/login').send({ username: 'nobody', password: 'bad' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('jwt returned', async () => {
    const res = await api().post('/api/auth/register').send({ username: 'dave', password: 'secret123' });
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });
});
