import request from 'supertest';
import app from '../server';
import { resetDB } from './setupTestDB';

const api = () => request(app);

const register = async (username: string, role: 'user' | 'admin' = 'user') => {
  const res = await api().post('/api/auth/register').send({ username, password: 'secret123', role });
  return res.body.accessToken as string;
};

describe('Sweets CRUD Tests', () => {
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    await resetDB();
    adminToken = await register('admin1', 'admin');
    userToken = await register('user1', 'user');
  });

  it('admin only create', async () => {
    const userRes = await api().post('/api/sweets').set('Authorization', `Bearer ${userToken}`).send({
      name: 'Candy', category: 'Sugar', price: 1.5, quantity: 10
    });
    expect(userRes.status).toBe(403);

    const adminRes = await api().post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Candy', category: 'Sugar', price: 1.5, quantity: 10
    });
    expect(adminRes.status).toBe(201);
    expect(adminRes.body.name).toBe('Candy');
  });

  it('get list', async () => {
    await api().post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Choco', category: 'Chocolate', price: 2.5, quantity: 5
    });
    const res = await api().get('/api/sweets').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('search sweets', async () => {
    await api().post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Mint Bar', category: 'Mint', price: 1, quantity: 5 });
    const res = await api().get('/api/sweets/search').set('Authorization', `Bearer ${userToken}`).query({ q: 'mint' });
    expect(res.status).toBe(200);
    expect(res.body[0].name).toMatch(/mint/i);
  });

  it('update sweet', async () => {
    const created = await api().post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Toffee', category: 'Caramel', price: 1.2, quantity: 3 });
    const res = await api().put(`/api/sweets/${created.body.id}`).set('Authorization', `Bearer ${userToken}`).send({ price: 2.0 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(2.0);
  });

  it('delete admin only', async () => {
    const created = await api().post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Gum', category: 'Chew', price: 0.5, quantity: 8 });
    const userDelete = await api().delete(`/api/sweets/${created.body.id}`).set('Authorization', `Bearer ${userToken}`);
    expect(userDelete.status).toBe(403);
    const adminDelete = await api().delete(`/api/sweets/${created.body.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(adminDelete.status).toBe(204);
  });
});
