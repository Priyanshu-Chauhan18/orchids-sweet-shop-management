'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-50">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 mb-4">
          🍭 Sweet Shop
        </h1>
        <p className="text-xl text-gray-700 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
