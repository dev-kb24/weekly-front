import Link from 'next/link';

export function LandingHero() {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[--color-text-muted] mb-8">
        Votre journal d&apos;entraînement
      </p>

      <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[--color-text] leading-[1.05] mb-8">
        Tracez votre{' '}
        <span className="text-[--color-accent]">progression.</span>
      </h1>

      <p className="text-lg md:text-xl text-[--color-text-muted] max-w-xl leading-relaxed mb-12">
        Planifiez vos séances semaine par semaine. Décomposez chaque entraînement en parties — échauffement, fractionné, récupération — avec allures et zones cardiaques.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/register"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-black bg-[--color-text] text-[--color-bg] rounded-xl hover:opacity-80 transition-opacity"
        >
          Commencer gratuitement
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[--color-text-muted] hover:text-[--color-text] transition-colors"
        >
          Se connecter →
        </Link>
      </div>
    </section>
  );
}
