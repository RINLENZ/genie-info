import { SectionHeader } from "@/components/SectionHeader";

const PILIERS: [string, string][] = [
  ["Pédagogie par projets", "Chaque étudiant développe des solutions concrètes dès la 1re année."],
  ["Insertion professionnelle", "Partenariats avec des entreprises du secteur numérique et industriel."],
  ["Recherche appliquée", "Laboratoires équipés : systèmes embarqués, robotique, réseaux et IA."],
  ["Impact africain", "Des solutions adaptées aux contextes et contraintes technologiques locaux."],
];

export function About() {
  return (
    <section id="apropos" className="bg-paper text-ink">
      <div className="container-ed section-pad px-6 md:px-10">
        <SectionHeader num="02" label="À propos" title="Un département, une exigence." dark />

        <div className="grid items-start gap-12 md:grid-cols-[1fr_1.1fr]">
          <div className="relative">
            <img
              src="/assets/img/equipe/olleolle.jpg"
              alt="Le département"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute -bottom-5 -right-5 bg-ink px-6 py-4 text-center">
              <div className="font-display text-3xl text-accent">2017</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Depuis</div>
            </div>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-ink/80">
              Le Département de Génie Informatique de l&apos;ENSET d&apos;Ebolowa
              forme des ingénieurs et cadres supérieurs maîtrisant les fondements
              théoriques et les applications pratiques de l&apos;informatique,
              adaptées aux réalités et défis technologiques du continent africain.
            </p>

            <div className="mt-10 grid gap-px bg-ink/10 sm:grid-cols-2">
              {PILIERS.map(([titre, desc]) => (
                <div key={titre} className="bg-paper p-6">
                  <div className="mb-3 h-px w-8 bg-emerald" />
                  <h3 className="font-display text-lg text-ink">{titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
