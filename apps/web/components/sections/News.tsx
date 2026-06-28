import { SectionHeader } from "@/components/SectionHeader";
import { asset, type Actualite } from "@/lib/api";

function formatDate(d: string | null): string {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

export function News({ actus }: { actus: Actualite[] }) {
  return (
    <section id="actualites" className="border-b border-line">
      <div className="container-ed section-pad px-6 md:px-10">
        <SectionHeader num="05" label="Actualités & événements" title="Dernières nouvelles du département." />

        <div className="grid gap-8 md:grid-cols-3">
          {actus.map((a) => (
            <article key={a.slug} className="group flex flex-col border border-line transition-colors hover:border-accent/40">
              <div className="relative aspect-[16/10] overflow-hidden bg-ink-2">
                {a.image_url ? (
                  <img
                    src={asset(a.image_url)}
                    alt={a.titre}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-deep to-ink-2">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40">
                      {a.categorie}
                    </span>
                  </div>
                )}
                {a.categorie && (
                  <span className="absolute left-4 top-4 bg-accent px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
                    {a.categorie}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  {formatDate(a.date_publication)}
                </span>
                <h3 className="mt-2 font-display text-xl leading-snug text-paper transition-colors group-hover:text-accent">
                  {a.titre}
                </h3>
                {a.resume && <p className="mt-3 text-sm leading-relaxed text-muted">{a.resume}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
