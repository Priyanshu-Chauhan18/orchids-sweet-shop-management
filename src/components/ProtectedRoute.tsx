'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ 
  children, 
  adminOnly = false 
}: { 
  children: React.ReactNode; 
  adminOnly?: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (adminOnly && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, adminOnly, router]);

  if (!user || (adminOnly && user.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}
