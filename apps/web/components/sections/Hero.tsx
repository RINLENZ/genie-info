export function Hero() {
  return (
    <section id="accueil" className="relative isolate overflow-hidden border-b border-line">
      {/* Image de fond */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/assets/img/slide/campus1.webp"
          alt="Campus ENSET Ebolowa"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
      </div>

      <div className="container-ed section-pad px-6 md:px-10">
        <p className="rule-mono">01 — Département de Génie Informatique</p>
        <h1 className="mt-8 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
          Former les ingénieurs et techniciens de l&apos;
          <span className="italic text-gold">ère numérique</span> africaine.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
          L&apos;ENSET d&apos;Ebolowa allie rigueur académique et maîtrise des
          systèmes informatiques industriels — du DIPET 1 au Master Recherche.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#formations"
            className="bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink transition-opacity hover:opacity-80"
          >
            Nos formations
          </a>
          <a
            href="#apropos"
            className="border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:border-accent hover:text-accent"
          >
            Découvrir le département
          </a>
        </div>
      </div>
    </section>
  );
}
