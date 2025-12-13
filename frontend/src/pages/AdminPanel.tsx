import { useEffect, useState } from 'react';
import { createSweetApi, deleteSweetApi, fetchSweets, restockSweetApi, updateSweetApi } from '../services/api';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export default function AdminPanel() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [form, setForm] = useState({ name: '', category: '', price: 0, quantity: 0 });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await fetchSweets();
      setSweets(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createSweetApi({ ...form, price: Number(form.price), quantity: Number(form.quantity) });
      setSweets((prev) => [...prev, created]);
      setForm({ name: '', category: '', price: 0, quantity: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Create failed');
    }
  };

  const update = async (id: number, updates: Partial<Sweet>) => {
    try {
      const updated = await updateSweetApi(id, updates);
      setSweets((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const restock = async (id: number) => {
    try {
      const updated = await restockSweetApi(id, 5);
      setSweets((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Restock failed');
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteSweetApi(id);
      setSweets((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded space-y-4">
      <h1 className="text-xl font-semibold">Admin Panel</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <form className="grid grid-cols-2 gap-2" onSubmit={create}>
        <input className="border px-2 py-2 rounded" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border px-2 py-2 rounded" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="border px-2 py-2 rounded" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <input className="border px-2 py-2 rounded" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
        <div className="col-span-2">
          <button className="bg-pink-600 text-white px-4 py-2 rounded" type="submit">Add Sweet</button>
        </div>
      </form>

      <div className="space-y-3">
        {sweets.map((sweet) => (
          <div key={sweet.id} className="border rounded px-3 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{sweet.name} <span className="text-gray-500">({sweet.category})</span></p>
                <p className="text-sm text-gray-600">${sweet.price.toFixed(2)} • Qty: {sweet.quantity}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => restock(sweet.id)}>Restock +5</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => remove(sweet.id)}>Delete</button>
              </div>
            </div>
            <div className="flex gap-2 mt-2 text-sm">
              <input className="border px-2 py-1 rounded w-32" type="number" defaultValue={sweet.price} onBlur={(e) => update(sweet.id, { price: Number(e.target.value) })} />
              <input className="border px-2 py-1 rounded w-32" type="number" defaultValue={sweet.quantity} onBlur={(e) => update(sweet.id, { quantity: Number(e.target.value) })} />
              <span className="text-gray-500 self-center">Blur fields to update price/qty</span>
            </div>
          </div>
        ))}
        {sweets.length === 0 && <p className="text-sm text-gray-600">No sweets yet</p>}
      </div>
    </div>
  );
}
