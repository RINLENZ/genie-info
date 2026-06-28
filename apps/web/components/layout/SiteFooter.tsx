const COLS: { titre: string; liens: [string, string][] }[] = [
  {
    titre: "Formations",
    liens: [
      ["DIPET 1 & 2", "#formations"],
      ["BTS Informatique", "#formations"],
      ["Licence Pro — Info. Ind.", "#formations"],
      ["Master Recherche", "#formations"],
    ],
  },
  {
    titre: "Navigation",
    liens: [
      ["Accueil", "#accueil"],
      ["À propos", "#apropos"],
      ["Équipe", "#equipe"],
      ["Actualités", "#actualites"],
      ["Galerie", "#galerie"],
      ["Contact", "#contact"],
    ],
  },
  {
    titre: "Admission",
    liens: [
      ["Conditions d'accès", "#contact"],
      ["Dossier de candidature", "#contact"],
      ["Calendrier académique", "#contact"],
      ["FAQ", "#contact"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="container-ed grid gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-10">
        <div>
          <div className="flex items-center gap-3">
            <img src="/assets/img/logo/logo.webp" alt="ENSET Ebolowa" className="h-10 w-auto" />
            <span className="font-display text-lg font-bold text-paper">Génie Informatique</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Département de Génie Informatique — ENSET d&apos;Ebolowa. Former les
            ingénieurs et techniciens du numérique africain depuis 2017.
          </p>
          <p className="mt-5 border-l-2 border-accent pl-4 font-display text-sm italic text-paper/80">
            « Forger l&apos;excellence numérique, bâtir l&apos;avenir technologique »
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.titre}>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              {col.titre}
            </h4>
            <ul className="mt-5 space-y-3">
              {col.liens.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm text-muted transition-colors hover:text-paper">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="container-ed flex flex-col gap-2 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            © {new Date().getFullYear()} Département Génie Informatique — ENSET Ebolowa
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            Club Info — Génie Informatique
          </span>
        </div>
      </div>
    </footer>
  );
}
