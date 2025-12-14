'use client';

import { useEffect, useState } from 'react';
import { fetchSweets, purchaseSweetApi, searchSweets } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

function DashboardContent() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

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

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = query ? await searchSweets(query) : await fetchSweets();
      setSweets(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
    }
  };

  const purchase = async (id: number) => {
    try {
      const updated = await purchaseSweetApi(id, 1);
      setSweets((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Purchase failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl p-8 rounded-2xl border border-pink-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
              🍭 Sweet Shop Dashboard
            </h1>
            <span className="text-sm text-gray-600">Welcome, {user?.username}!</span>
          </div>
          <div className="flex gap-3">
            {user?.role === 'admin' && (
              <Link href="/admin" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-md">
                Admin Panel
              </Link>
            )}
            <button onClick={logout} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
              Logout
            </button>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
        <form onSubmit={onSearch} className="flex gap-3 mb-6">
          <input 
            className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition" 
            placeholder="Search sweets by name or category" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />
          <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg" type="submit">
            Search
          </button>
        </form>
        <div className="grid gap-4 md:grid-cols-2">
          {sweets.map((sweet) => (
            <div key={sweet.id} className="flex items-center justify-between border border-pink-200 rounded-xl px-5 py-4 bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg transition">
              <div>
                <p className="font-bold text-lg text-gray-800">{sweet.name} <span className="text-sm text-gray-500 font-normal">({sweet.category})</span></p>
                <p className="text-sm text-gray-600 mt-1">${sweet.price.toFixed(2)} • Stock: {sweet.quantity}</p>
              </div>
              <button
                disabled={sweet.quantity === 0}
                onClick={() => purchase(sweet.id)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition shadow-md ${
                  sweet.quantity === 0 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 hover:shadow-lg'
                }`}
              >
                {sweet.quantity === 0 ? 'Out of stock' : 'Purchase'}
              </button>
            </div>
          ))}
          {sweets.length === 0 && <p className="text-sm text-gray-600 col-span-2 text-center py-8">No sweets found</p>}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
