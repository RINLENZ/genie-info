import { SiteHeader } from "@/components/SiteHeader";
import { SectionHeader } from "@/components/SectionHeader";
import {
  getFormations,
  getEquipe,
  getActualites,
  DIPLOME_LABEL,
} from "@/lib/api";

export default async function Home() {
  const [formations, equipe, actus] = await Promise.all([
    getFormations(),
    getEquipe(),
    getActualites(),
  ]);

  return (
    <main>
      <SiteHeader />

      {/* 01 — HERO */}
      <section id="accueil" className="relative overflow-hidden border-b border-line">
        <div className="container-ed section-pad px-6 md:px-10">
          <p className="rule-mono">01 — Département de Génie Informatique</p>
          <h1 className="mt-8 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
            Former les ingénieurs et enseignants du{" "}
            <span className="italic text-accent-warm">numérique</span>.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            De la DIPET 1 au Master Recherche, des parcours rigoureux en
            informatique industrielle et fondamentale, à l&apos;ENSET Ebolowa.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#formations"
              className="bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink transition-opacity hover:opacity-80"
            >
              Voir les formations
            </a>
            <a
              href="#contact"
              className="border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:border-accent hover:text-accent"
            >
              Nous contacter
            </a>
          </div>

          <dl className="mt-20 grid max-w-2xl grid-cols-3 gap-8 border-t border-line pt-8">
            {[
              ["05", "Filières"],
              ["DIPET→Master", "Parcours"],
              ["2025-26", "Année en cours"],
            ].map(([v, k]) => (
              <div key={k}>
                <dt className="font-display text-3xl text-paper md:text-4xl">{v}</dt>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  {k}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 02 — À PROPOS (section claire « papier ») */}
      <section id="apropos" className="bg-paper text-ink">
        <div className="container-ed section-pad px-6 md:px-10">
          <SectionHeader num="02" label="À propos" title="Un département, une exigence." dark />
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
            <p className="font-mono text-sm leading-relaxed text-ink/60">
              ENSET Ebolowa · Cameroun
            </p>
            <div className="space-y-6 text-lg leading-relaxed text-ink/80">
              <p>
                Le Département de Génie Informatique forme des techniciens,
                ingénieurs et enseignants capables de concevoir, déployer et
                maintenir les systèmes informatiques industriels et
                fondamentaux.
              </p>
              <p>
                Programmation, réseaux, systèmes embarqués, robotique et
                analyse de données : un socle solide adossé à des équipements
                et un corps enseignant dédiés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — FORMATIONS (fiches techniques) */}
      <section id="formations" className="border-b border-line">
        <div className="container-ed section-pad px-6 md:px-10">
          <SectionHeader num="03" label="Cursus" title="Cinq filières, un continuum." />
          <div className="border-t border-line">
            {formations.map((f, i) => (
              <article
                key={f.code}
                className="group grid grid-cols-1 items-baseline gap-2 border-b border-line py-6 md:grid-cols-[80px_1fr_auto]"
              >
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl text-paper transition-colors group-hover:text-accent md:text-3xl">
                  {f.intitule}
                </h3>
                <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                  <span>{DIPLOME_LABEL[f.type_diplome] ?? f.type_diplome}</span>
                  <span>{f.duree_semestres} sem.</span>
                  <span className={f.est_ouverte_inscription ? "text-accent" : ""}>
                    {f.est_ouverte_inscription ? "Ouvert" : "Fermé"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — ÉQUIPE */}
      <section id="equipe" className="border-b border-line">
        <div className="container-ed section-pad px-6 md:px-10">
          <SectionHeader num="04" label="Corps enseignant" title="L'équipe pédagogique." />
          <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {equipe.map((m) => (
              <div key={m.nom} className="bg-ink p-8">
                <div className="mb-6 h-px w-10 bg-accent" />
                <h3 className="font-display text-xl text-paper">{m.nom}</h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                  {m.fonction}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — ACTUALITÉS */}
      <section id="actualites" className="bg-paper text-ink">
        <div className="container-ed section-pad px-6 md:px-10">
          <SectionHeader num="05" label="Vie du département" title="Actualités." dark />
          <div className="border-t border-ink/15">
            {actus.map((a) => (
              <article
                key={a.slug}
                className="flex flex-col gap-2 border-b border-ink/15 py-6 md:flex-row md:items-baseline md:justify-between"
              >
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-warm">
                    {a.categorie}
                  </span>
                  <h3 className="mt-1 font-display text-2xl text-ink">{a.titre}</h3>
                  {a.resume && (
                    <p className="mt-1 max-w-xl text-ink/70">{a.resume}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — CONTACT / FOOTER */}
      <section id="contact">
        <div className="container-ed section-pad px-6 md:px-10">
          <SectionHeader num="06" label="Contact" title="Rejoindre le département." />
          <div className="grid gap-10 md:grid-cols-3">
            {[
              ["Email", "depginfo@enset-ebolowa.cm", "mailto:depginfo@enset-ebolowa.cm"],
              ["Téléphone", "+237 692 581 157", "tel:+237692581157"],
              ["Adresse", "ENSET Ebolowa, Cameroun", null],
            ].map(([label, value, href]) => (
              <div key={label as string}>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href as string}
                    className="mt-2 block font-display text-xl text-paper transition-colors hover:text-accent"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-2 font-display text-xl text-paper">{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <footer className="border-t border-line">
          <div className="container-ed flex flex-col gap-2 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              © {new Date().getFullYear()} Département de Génie Informatique — ENSET Ebolowa
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              Editorial-Tech
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}
