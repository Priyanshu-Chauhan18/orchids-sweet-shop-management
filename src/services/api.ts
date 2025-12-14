import axios from 'axios';

const api = axios.create({
  baseURL: typeof window !== 'undefined' ? '/api' : 'http://localhost:4000/api'
});

const authHeader = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerApi = async (username: string, password: string, role: 'user' | 'admin' = 'user') => {
  const res = await api.post('/auth/register', { username, password, role });
  return res.data;
};

export const loginApi = async (username: string, password: string) => {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
};

export const fetchSweets = async () => {
  const res = await api.get('/sweets', { headers: authHeader() });
  return res.data;
};

export const searchSweets = async (q: string) => {
  const res = await api.get('/sweets/search', { params: { q }, headers: authHeader() });
  return res.data;
};

export const createSweetApi = async (payload: { name: string; category: string; price: number; quantity: number }) => {
  const res = await api.post('/sweets', payload, { headers: authHeader() });
  return res.data;
};

export const updateSweetApi = async (id: number, payload: Partial<{ name: string; category: string; price: number; quantity: number }>) => {
  const res = await api.put(`/sweets/${id}`, payload, { headers: authHeader() });
  return res.data;
};

export const deleteSweetApi = async (id: number) => {
  await api.delete(`/sweets/${id}`, { headers: authHeader() });
};

export const purchaseSweetApi = async (id: number, quantity: number) => {
  const res = await api.post(`/sweets/${id}/purchase`, { quantity }, { headers: authHeader() });
  return res.data;
};

export const restockSweetApi = async (id: number, quantity: number) => {
  const res = await api.post(`/sweets/${id}/restock`, { quantity }, { headers: authHeader() });
  return res.data;
};
