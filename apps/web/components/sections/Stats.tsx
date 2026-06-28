const STATS: [string, string][] = [
  ["400+", "Étudiants actifs"],
  ["8", "Années d'existence"],
  ["400+", "Projets réalisés"],
  ["28", "Enseignants-chercheurs"],
];

export function Stats() {
  return (
    <section aria-label="Chiffres clés" className="border-b border-line bg-ink-2">
      <div className="container-ed grid grid-cols-2 gap-px bg-line md:grid-cols-4">
        {STATS.map(([num, label]) => (
          <div key={label} className="bg-ink-2 px-6 py-10 text-center">
            <div className="font-display text-4xl text-paper md:text-5xl">{num}</div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
