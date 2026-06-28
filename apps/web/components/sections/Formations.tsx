import { SectionHeader } from "@/components/SectionHeader";
import { DIPLOME_LABEL, type Formation } from "@/lib/api";

// Détails marketing par formation (en attendant de les porter en base, Phase 2).
const DETAILS: Record<string, { places: string; periode: string; tags: string[] }> = {
  "DIPET1-INFO-FOND": { places: "14 places", periode: "Oct. 2026", tags: ["Algorithmique", "Réseaux", "BDD", "Électronique"] },
  "DIPET1-INFO-IND": { places: "14 places", periode: "Oct. 2026", tags: ["Systèmes embarqués", "Robotique", "Automatique"] },
  "DIPET2-INFO-IND": { places: "7 places", periode: "Sept. 2026", tags: ["ML", "Cryptographie", "BDD distribuées"] },
  "BTS-INFO": { places: "80 places", periode: "Sept. 2025", tags: ["Réseaux", "Développement", "Systèmes"] },
  "LP-INFO-IND": { places: "20 places", periode: "Sept. 2026", tags: ["SCADA", "Automatique", "Embarqué"] },
  "MASTER-INFO": { places: "7 places", periode: "Nov. 2026", tags: ["IA & ML", "IoT", "Recherche"] },
};

export function Formations({ formations }: { formations: Formation[] }) {
  return (
    <section id="formations" className="border-b border-line">
      <div className="container-ed section-pad px-6 md:px-10">
        <SectionHeader num="03" label="Nos programmes" title="Du DIPET 1 au Master, un continuum." />

        <div className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
          {formations.map((f, i) => {
            const d = DETAILS[f.code];
            return (
              <article key={f.code} className="group flex flex-col bg-ink p-8 transition-colors hover:bg-ink-2">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl text-accent/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                    {DIPLOME_LABEL[f.type_diplome] ?? f.type_diplome}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl leading-snug text-paper transition-colors group-hover:text-accent">
                  {f.intitule}
                </h3>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  <span>{f.duree_semestres} sem.</span>
                  {d && <span>{d.places}</span>}
                  {d && <span>{d.periode}</span>}
                </div>

                {d && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {d.tags.map((t) => (
                      <span key={t} className="border border-line px-2.5 py-1 font-mono text-[10px] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-6">
                  <span className={`font-mono text-[10px] uppercase tracking-[0.16em] ${f.est_ouverte_inscription ? "text-accent" : "text-muted"}`}>
                    {f.est_ouverte_inscription ? "● Inscriptions ouvertes" : "○ Fermé"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
