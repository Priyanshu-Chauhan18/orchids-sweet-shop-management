import request from 'supertest';
import app from '../server';
import { resetDB } from './setupTestDB';

const api = () => request(app);

const register = async (username: string, role: 'user' | 'admin' = 'user') => {
  const res = await api().post('/api/auth/register').send({ username, password: 'secret123', role });
  return res.body.accessToken as string;
};

describe('Inventory Tests', () => {
  let adminToken: string;
  let userToken: string;
  let sweetId: number;

  beforeEach(async () => {
    await resetDB();
    adminToken = await register('admin2', 'admin');
    userToken = await register('user2', 'user');
    const created = await api().post('/api/sweets').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Lollipop', category: 'Stick', price: 1.0, quantity: 5
    });
    sweetId = created.body.id;
  });

  it('purchase reduces stock', async () => {
    const res = await api().post(`/api/sweets/${sweetId}/purchase`).set('Authorization', `Bearer ${userToken}`).send({ quantity: 2 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(3);
  });

  it('purchase fail if out of stock', async () => {
    const res = await api().post(`/api/sweets/${sweetId}/purchase`).set('Authorization', `Bearer ${userToken}`).send({ quantity: 10 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/stock/i);
  });

  it('restock increases quantity (admin only)', async () => {
    const userRes = await api().post(`/api/sweets/${sweetId}/restock`).set('Authorization', `Bearer ${userToken}`).send({ quantity: 5 });
    expect(userRes.status).toBe(403);
    const adminRes = await api().post(`/api/sweets/${sweetId}/restock`).set('Authorization', `Bearer ${adminToken}`).send({ quantity: 5 });
    expect(adminRes.status).toBe(200);
    expect(adminRes.body.quantity).toBe(10);
  });
});
