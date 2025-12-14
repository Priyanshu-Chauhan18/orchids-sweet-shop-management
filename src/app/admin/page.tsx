'use client';

import { useEffect, useState } from 'react';
import { createSweetApi, deleteSweetApi, fetchSweets, restockSweetApi, updateSweetApi } from '@/services/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

function AdminPanelContent() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [form, setForm] = useState({ name: '', category: '', price: 0, quantity: 0 });
  const [error, setError] = useState('');
  const { logout } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl p-8 rounded-2xl border border-pink-200 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
            🍬 Admin Panel
          </h1>
          <div className="flex gap-3">
            <Link href="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
              Back to Dashboard
            </Link>
            <button onClick={logout} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
              Logout
            </button>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
        
        <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Sweet</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={create}>
            <input 
              className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition" 
              placeholder="Sweet Name" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              required
            />
            <input 
              className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition" 
              placeholder="Category (e.g., Chocolate, Candy)" 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })} 
              required
            />
            <input 
              className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition" 
              type="number" 
              step="0.01"
              placeholder="Price" 
              value={form.price} 
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} 
              required
            />
            <input 
              className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition" 
              type="number" 
              placeholder="Quantity" 
              value={form.quantity} 
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} 
              required
            />
            <div className="md:col-span-2">
              <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg" type="submit">
                Add Sweet
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Manage Sweets</h2>
          {sweets.map((sweet) => (
            <div key={sweet.id} className="border border-pink-200 rounded-xl px-5 py-4 bg-gradient-to-br from-white to-pink-50 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-lg text-gray-800">{sweet.name} <span className="text-sm text-gray-500 font-normal">({sweet.category})</span></p>
                  <p className="text-sm text-gray-600">${sweet.price.toFixed(2)} • Stock: {sweet.quantity}</p>
                </div>
                <div className="flex gap-2 text-sm">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-md" onClick={() => restock(sweet.id)}>
                    Restock +5
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md" onClick={() => remove(sweet.id)}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Price</label>
                  <input 
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition" 
                    type="number" 
                    step="0.01"
                    defaultValue={sweet.price} 
                    onBlur={(e) => update(sweet.id, { price: Number(e.target.value) })} 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                  <input 
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition" 
                    type="number" 
                    defaultValue={sweet.quantity} 
                    onBlur={(e) => update(sweet.id, { quantity: Number(e.target.value) })} 
                  />
                </div>
              </div>
            </div>
          ))}
          {sweets.length === 0 && <p className="text-sm text-gray-600 text-center py-8">No sweets yet. Add your first sweet above!</p>}
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <ProtectedRoute adminOnly>
      <AdminPanelContent />
    </ProtectedRoute>
  );
}
