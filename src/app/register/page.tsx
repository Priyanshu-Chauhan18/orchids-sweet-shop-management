'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Register() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password, role);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-50 p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm shadow-2xl p-8 rounded-2xl border border-pink-200">
        <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
          🍭 Sweet Shop
        </h1>
        <p className="text-gray-600 mb-6">Create your account</p>
        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
        <form className="space-y-4" onSubmit={onSubmit}>
          <input 
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <select 
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition" 
            value={role} 
            onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button 
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105" 
            type="submit"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-pink-600 font-semibold hover:text-pink-700 transition">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
