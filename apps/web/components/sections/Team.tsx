import { SectionHeader } from "@/components/SectionHeader";
import { asset, type Membre } from "@/lib/api";

export function Team({ equipe }: { equipe: Membre[] }) {
  return (
    <section id="equipe" className="bg-paper text-ink">
      <div className="container-ed section-pad px-6 md:px-10">
        <SectionHeader num="04" label="Corps enseignant" title="Une équipe d'experts." dark />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {equipe.map((m) => (
            <article key={m.nom} className="group flex flex-col bg-ink">
              <div className="relative aspect-[4/3] overflow-hidden">
                {m.photo_url ? (
                  <img
                    src={asset(m.photo_url)}
                    alt={m.nom}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-ink-2 font-display text-4xl text-line">
                    {m.nom.split(" ").slice(-1)[0][0]}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl text-paper">{m.nom}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-gold">
                  {m.fonction}
                </p>
                {m.bio && <p className="mt-4 text-sm leading-relaxed text-muted">{m.bio}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
