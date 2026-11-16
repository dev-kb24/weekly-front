interface Feature {
  number: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    number: '01',
    title: 'Planning hebdomadaire',
    description:
      'Visualisez votre semaine entière d\'un coup d\'œil. Naviguez d\'une semaine à l\'autre, passez en vue journalière pour le détail.',
  },
  {
    number: '02',
    title: 'Séances décomposées',
    description:
      'Chaque entraînement se découpe en parties : échauffement, fractionné, running, récupération. Durée en temps ou en distance.',
  },
  {
    number: '03',
    title: 'Allures & zones cardiaques',
    description:
      'Ciblez chaque partie avec une allure min/km précise ou une zone cardiaque. Gardez une trace de votre intensité réelle.',
  },
];

export function LandingFeatures() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[--color-text-muted] mb-4">
        Fonctionnalités
      </p>
      <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[--color-text] mb-16">
        Tout ce qu&apos;il faut,<br />
        <span className="text-[--color-accent]">rien de superflu.</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[--color-border]">
        {FEATURES.map((feature) => (
          <div key={feature.number} className="bg-[--color-bg] p-8">
            <p className="text-4xl font-black text-[--color-border] mb-6 select-none">
              {feature.number}
            </p>
            <h3 className="text-lg font-black text-[--color-text] mb-3">
              {feature.title}
            </h3>
            <p className="text-sm text-[--color-text-muted] leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
