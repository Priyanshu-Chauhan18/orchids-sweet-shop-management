import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerApi = async (username: string, password: string, role: 'user' | 'admin' = 'user') => {
  const res = await api.post('/api/auth/register', { username, password, role });
  return res.data;
};

export const loginApi = async (username: string, password: string) => {
  const res = await api.post('/api/auth/login', { username, password });
  return res.data;
};

export const fetchSweets = async () => {
  const res = await api.get('/api/sweets', { headers: authHeader() });
  return res.data;
};

export const searchSweets = async (q: string) => {
  const res = await api.get('/api/sweets/search', { params: { q }, headers: authHeader() });
  return res.data;
};

export const createSweetApi = async (payload: { name: string; category: string; price: number; quantity: number }) => {
  const res = await api.post('/api/sweets', payload, { headers: authHeader() });
  return res.data;
};

export const updateSweetApi = async (id: number, payload: Partial<{ name: string; category: string; price: number; quantity: number }>) => {
  const res = await api.put(`/api/sweets/${id}`, payload, { headers: authHeader() });
  return res.data;
};

export const deleteSweetApi = async (id: number) => {
  await api.delete(`/api/sweets/${id}`, { headers: authHeader() });
};

export const purchaseSweetApi = async (id: number, quantity: number) => {
  const res = await api.post(`/api/sweets/${id}/purchase`, { quantity }, { headers: authHeader() });
  return res.data;
};

export const restockSweetApi = async (id: number, quantity: number) => {
  const res = await api.post(`/api/sweets/${id}/restock`, { quantity }, { headers: authHeader() });
  return res.data;
};
