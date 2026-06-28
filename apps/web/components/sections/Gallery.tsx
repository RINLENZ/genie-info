"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { ALBUM_LABEL, asset, type Media } from "@/lib/api";

export function Gallery({ media }: { media: Media[] }) {
  const albums = useMemo(() => {
    const set = Array.from(new Set(media.map((m) => m.album)));
    return ["all", ...set];
  }, [media]);

  const [actif, setActif] = useState("all");
  const visibles = actif === "all" ? media : media.filter((m) => m.album === actif);

  return (
    <section id="galerie" className="bg-paper text-ink">
      <div className="container-ed section-pad px-6 md:px-10">
        <SectionHeader num="06" label="Galerie" title="La vie au département." dark />

        {/* Filtres */}
        <div className="mb-10 flex flex-wrap gap-2">
          {albums.map((a) => (
            <button
              key={a}
              onClick={() => setActif(a)}
              className={`px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                actif === a
                  ? "bg-ink text-accent"
                  : "border border-ink/15 text-ink/60 hover:border-ink/40"
              }`}
            >
              {a === "all" ? "Tout" : ALBUM_LABEL[a] ?? a}
            </button>
          ))}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {visibles.map((m, i) => (
            <figure
              key={`${m.fichier_url}-${i}`}
              className="group relative aspect-square overflow-hidden bg-ink-2"
            >
              <img
                src={asset(m.fichier_url)}
                alt={m.legende ?? ""}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/85 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-paper transition-transform duration-300 group-hover:translate-y-0">
                {m.legende}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
