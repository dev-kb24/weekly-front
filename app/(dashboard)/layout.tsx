'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400 text-sm">Chargement…</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-[90%] mx-auto px-4 py-6 pb-24 sm:pb-6">{children}</main>
    </div>
  );
}
