// Client API + données de repli.
// L'URL de l'API est fournie par NEXT_PUBLIC_API_URL (Render en prod).
// Si l'API est injoignable (build, API en veille…), on retombe sur des
// données de repli pour que le site rende toujours.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

export type Formation = {
  code: string;
  intitule: string;
  type_diplome: string;
  duree_semestres: number;
  est_ouverte_inscription: boolean;
};

export type Membre = {
  nom: string;
  fonction: string | null;
  photo_url: string | null;
};

export type Actualite = {
  titre: string;
  slug: string;
  resume: string | null;
  categorie: string | null;
  date_publication: string | null;
};

async function getJSON<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

const FALLBACK_FORMATIONS: Formation[] = [
  { code: "DIPET1-INFO-FOND", intitule: "DIPET 1 — Informatique Fondamentale", type_diplome: "dipet1", duree_semestres: 2, est_ouverte_inscription: true },
  { code: "DIPET1-INFO-IND", intitule: "DIPET 1 — Informatique Industrielle", type_diplome: "dipet1", duree_semestres: 2, est_ouverte_inscription: true },
  { code: "DIPET2-INFO-IND", intitule: "DIPET 2 — Informatique Industrielle", type_diplome: "dipet2", duree_semestres: 2, est_ouverte_inscription: true },
  { code: "BTS-INFO", intitule: "BTS Informatique", type_diplome: "bts", duree_semestres: 4, est_ouverte_inscription: true },
  { code: "LP-INFO-IND", intitule: "Licence Professionnelle — Informatique Industrielle", type_diplome: "licence_pro", duree_semestres: 2, est_ouverte_inscription: true },
  { code: "MASTER-INFO", intitule: "Master Recherche — Informatique", type_diplome: "master", duree_semestres: 4, est_ouverte_inscription: true },
];

const FALLBACK_EQUIPE: Membre[] = [
  { nom: "Pr. Olle Olle Daniel", fonction: "Chef de Département", photo_url: null },
  { nom: "Dr. Tchuani Diane", fonction: "Chargée de Cours", photo_url: null },
  { nom: "Dr. Medzo Charles", fonction: "Assistant", photo_url: null },
];

const FALLBACK_ACTUS: Actualite[] = [
  { titre: "Inscriptions 2025-2026 ouvertes", slug: "inscriptions-2025-2026-ouvertes", resume: "Les inscriptions (DIPET 1 & 2, BTS, Licence Pro, Master) sont ouvertes.", categorie: "Admission", date_publication: null },
];

export const getFormations = () => getJSON("/api/formations", FALLBACK_FORMATIONS);
export const getEquipe = () => getJSON("/api/equipe", FALLBACK_EQUIPE);
export const getActualites = () => getJSON("/api/actualites", FALLBACK_ACTUS);

export const DIPLOME_LABEL: Record<string, string> = {
  dipet1: "DIPET 1",
  dipet2: "DIPET 2",
  bts: "BTS",
  licence_pro: "Licence Pro",
  master: "Master",
};
