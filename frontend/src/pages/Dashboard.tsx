import { useEffect, useState } from 'react';
import { fetchSweets, purchaseSweetApi, searchSweets } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export default function Dashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

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
    <div className="bg-white shadow p-6 rounded">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <span className="text-sm text-gray-500">Welcome {user?.username}</span>
      </div>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={onSearch} className="flex gap-2 mb-4">
        <input className="flex-1 border px-3 py-2 rounded" placeholder="Search sweets" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="bg-pink-600 text-white px-4 py-2 rounded" type="submit">Search</button>
      </form>
      <div className="space-y-3">
        {sweets.map((sweet) => (
          <div key={sweet.id} className="flex items-center justify-between border rounded px-3 py-2">
            <div>
              <p className="font-medium">{sweet.name} <span className="text-gray-500">({sweet.category})</span></p>
              <p className="text-sm text-gray-600">${sweet.price.toFixed(2)} • Qty: {sweet.quantity}</p>
            </div>
            <button
              disabled={sweet.quantity === 0}
              onClick={() => purchase(sweet.id)}
              className={`px-3 py-2 rounded text-sm ${sweet.quantity === 0 ? 'bg-gray-300 text-gray-600' : 'bg-pink-600 text-white'}`}
            >
              {sweet.quantity === 0 ? 'Out of stock' : 'Purchase'}
            </button>
          </div>
        ))}
        {sweets.length === 0 && <p className="text-sm text-gray-600">No sweets found</p>}
      </div>
    </div>
  );
}
