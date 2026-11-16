'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const userName = user ? `${user.firstName} ${user.lastName}` : null;

  return (
    <nav className="sticky top-0 z-40 w-full bg-[--color-bg]/95 backdrop-blur-sm border-b border-[--color-border] px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-black tracking-tight text-[--color-text]">
          WeeklyFit
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          {userName && (
            <span className="text-sm text-[--color-text-muted]">{userName}</span>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden p-2 text-[--color-text-muted] hover:bg-[--color-surface] rounded"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden mt-2 border-t border-[--color-border] pt-3 pb-2 px-4 flex flex-col gap-2">
          {userName && (
            <span className="text-sm text-[--color-text-muted]">{userName}</span>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      )}
    </nav>
  );
}
