'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function HomeRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) router.push('/dashboard');
  }, [isLoading, user, router]);

  if (isLoading) return <div className="fixed inset-0 bg-[--color-bg]" />;
  return null;
}
