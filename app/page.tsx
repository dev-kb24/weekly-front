import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeRedirect } from '@/components/shared/HomeRedirect';
import { LandingHero } from '@/components/sections/LandingHero';
import { LandingMockPlanning } from '@/components/sections/LandingMockPlanning';
import { LandingFeatures } from '@/components/sections/LandingFeatures';

export const metadata: Metadata = {
  title: 'WeeklyFit — Journalisez vos entraînements',
  description:
    "Planifiez et suivez vos séances de course à pied semaine par semaine. Décomposez chaque entraînement en parties avec allures et zones cardiaques.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[--color-bg]">
      <HomeRedirect />
      {/* Top nav */}
      <header className="sticky top-0 z-40 w-full bg-[--color-bg]/95 backdrop-blur-sm border-b border-[--color-border] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-base font-black tracking-tight text-[--color-text]">WeeklyFit</span>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-semibold text-[--color-text-muted] hover:text-[--color-text] transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-sm font-black px-4 py-2 bg-[--color-text] text-[--color-bg] rounded-lg hover:opacity-80 transition-opacity"
            >
              Commencer
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <LandingHero />
        <LandingMockPlanning />
        <LandingFeatures />
      </main>

      {/* Footer */}
      <footer className="border-t border-[--color-border] px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-black tracking-tight text-[--color-text]">WeeklyFit</span>
          <Link
            href="/register"
            className="text-sm font-black px-6 py-3 bg-[--color-accent] text-white rounded-xl hover:bg-[--color-accent-hover] transition-colors"
          >
            Commencer gratuitement →
          </Link>
        </div>
      </footer>
    </div>
  );
}


