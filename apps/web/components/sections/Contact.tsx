import { SectionHeader } from "@/components/SectionHeader";

const INFOS: { label: string; valeur: string; href?: string }[] = [
  { label: "Adresse", valeur: "ENSET d'Ebolowa, Sud-Cameroun" },
  { label: "Email", valeur: "depginfo@enset-ebolowa.cm", href: "mailto:depginfo@enset-ebolowa.cm" },
  { label: "Téléphone", valeur: "+237 692 581 157", href: "tel:+237692581157" },
  { label: "Horaires", valeur: "Lun – Ven : 08h00 – 17h00" },
];

export function Contact() {
  return (
    <section id="contact" className="border-b border-line">
      <div className="container-ed section-pad px-6 md:px-10">
        <SectionHeader num="07" label="Nous contacter" title="Parlons de votre projet académique." />

        <div className="grid gap-12 md:grid-cols-2">
          {/* Coordonnées */}
          <div>
            <p className="max-w-md leading-relaxed text-muted">
              Notre équipe pédagogique et administrative répond à vos questions sur
              les admissions, les programmes et les partenariats.
            </p>
            <dl className="mt-10 divide-y divide-line border-y border-line">
              {INFOS.map((c) => (
                <div key={c.label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    {c.label}
                  </dt>
                  <dd className="text-right font-display text-lg text-paper">
                    {c.href ? (
                      <a href={c.href} className="transition-colors hover:text-accent">{c.valeur}</a>
                    ) : (
                      c.valeur
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Formulaire (visuel ; branchement API en Phase 2) */}
          <form className="space-y-4" aria-label="Formulaire de contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="w-full border border-line bg-ink-2 px-4 py-3 text-sm text-paper placeholder:text-muted focus:border-accent focus:outline-none" placeholder="Nom complet" />
              <input type="email" className="w-full border border-line bg-ink-2 px-4 py-3 text-sm text-paper placeholder:text-muted focus:border-accent focus:outline-none" placeholder="Adresse email" />
            </div>
            <select className="w-full border border-line bg-ink-2 px-4 py-3 text-sm text-muted focus:border-accent focus:outline-none">
              <option>Admission & inscription</option>
              <option>Informations sur une formation</option>
              <option>Partenariat / stage</option>
              <option>Autre</option>
            </select>
            <textarea rows={5} className="w-full resize-none border border-line bg-ink-2 px-4 py-3 text-sm text-paper placeholder:text-muted focus:border-accent focus:outline-none" placeholder="Votre message…" />
            <button type="button" className="w-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink transition-opacity hover:opacity-80">
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
