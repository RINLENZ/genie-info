const NAV = [
  ["Département", "#apropos"],
  ["Formations", "#formations"],
  ["Équipe", "#equipe"],
  ["Actualités", "#actualites"],
  ["Contact", "#contact"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur">
      <div className="container-ed flex h-16 items-center justify-between px-6 md:px-10">
        <a href="#accueil" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold text-paper">GI</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            ENSET&nbsp;Ebolowa
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-mono text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="font-mono text-xs uppercase tracking-[0.15em] text-ink bg-accent px-4 py-2 transition-opacity hover:opacity-80"
        >
          Candidater
        </a>
      </div>
    </header>
  );
}
