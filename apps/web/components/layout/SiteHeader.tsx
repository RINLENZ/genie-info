const NAV = [
  ["Accueil", "#accueil"],
  ["À propos", "#apropos"],
  ["Formations", "#formations"],
  ["Équipe", "#equipe"],
  ["Actualités", "#actualites"],
  ["Galerie", "#galerie"],
  ["Contact", "#contact"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur">
      <div className="container-ed flex h-16 items-center justify-between px-6 md:px-10">
        <a href="#accueil" className="flex items-center gap-3">
          <img src="/assets/img/logo/logo.webp" alt="ENSET Ebolowa" className="h-9 w-auto" />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-base font-bold text-paper">Génie Informatique</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">ENSET Ebolowa</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink transition-opacity hover:opacity-80"
        >
          Candidater
        </a>
      </div>
    </header>
  );
}
