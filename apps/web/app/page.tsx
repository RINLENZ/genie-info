import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Formations } from "@/components/sections/Formations";
import { Team } from "@/components/sections/Team";
import { News } from "@/components/sections/News";
import { Gallery } from "@/components/sections/Gallery";
import { Contact } from "@/components/sections/Contact";
import { getActualites, getEquipe, getFormations, getMedia } from "@/lib/api";

export default async function Home() {
  // Données pilotées par l'API (repli statique si injoignable).
  const [formations, equipe, actus, media] = await Promise.all([
    getFormations(),
    getEquipe(),
    getActualites(),
    getMedia(),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <About />
        <Formations formations={formations} />
        <Team equipe={equipe} />
        <News actus={actus} />
        <Gallery media={media} />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
