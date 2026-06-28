// Client API + données de repli.
// L'URL de l'API est fournie par NEXT_PUBLIC_API_URL (Render en prod).
// Si l'API est injoignable (build, API en veille…), on retombe sur des
// données de repli pour que le site rende toujours.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

/** Normalise un chemin d'image (les médias en base sont relatifs : assets/...). */
export function asset(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `/${path}`;
}

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
  bio?: string | null;
};

export type Actualite = {
  titre: string;
  slug: string;
  resume: string | null;
  categorie: string | null;
  image_url?: string | null;
  date_publication: string | null;
};

export type Media = {
  fichier_url: string;
  legende: string | null;
  album: string;
  ordre: number;
};

async function getJSON<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    const data = (await res.json()) as T;
    return Array.isArray(data) && data.length === 0 ? fallback : data;
  } catch {
    return fallback;
  }
}

const FALLBACK_FORMATIONS: Formation[] = [
  { code: "DIPET1-INFO-FOND", intitule: "DIPET 1 — Informatique Fondamentale", type_diplome: "dipet1", duree_semestres: 6, est_ouverte_inscription: true },
  { code: "DIPET1-INFO-IND", intitule: "DIPET 1 — Informatique Industrielle", type_diplome: "dipet1", duree_semestres: 6, est_ouverte_inscription: true },
  { code: "DIPET2-INFO-IND", intitule: "DIPET 2 — Informatique Industrielle", type_diplome: "dipet2", duree_semestres: 4, est_ouverte_inscription: true },
  { code: "BTS-INFO", intitule: "BTS Informatique", type_diplome: "bts", duree_semestres: 4, est_ouverte_inscription: true },
  { code: "LP-INFO-IND", intitule: "Licence Professionnelle — Informatique Industrielle", type_diplome: "licence_pro", duree_semestres: 2, est_ouverte_inscription: true },
  { code: "MASTER-INFO", intitule: "Master Recherche — Informatique", type_diplome: "master", duree_semestres: 4, est_ouverte_inscription: true },
];

const FALLBACK_EQUIPE: Membre[] = [
  { nom: "Pr. Olle Olle Daniel", fonction: "Chef de Département", photo_url: "assets/img/equipe/olle.jpg", bio: "Docteur en Informatique, expert en analyse de données et IA appliquée au contexte africain." },
  { nom: "Dr. Tchuani Diane", fonction: "Chargée de Cours", photo_url: "assets/img/equipe/Tchuani.webp", bio: "Experte en sécurité des réseaux, coordinatrice du laboratoire réseaux et systèmes distribués." },
  { nom: "Dr. Medzo Charles", fonction: "Assistant", photo_url: "assets/img/div/salle6.jpg", bio: "Spécialiste des systèmes embarqués temps-réel, responsable du laboratoire IoT et automatisme." },
];

const FALLBACK_ACTUS: Actualite[] = [
  { titre: "Hackathon annuel — IA & Agriculture Camerounaise", slug: "hackathon-ia-agriculture", resume: "48h pour concevoir des solutions numériques au service de l'agriculture. Édition record, +20 équipes.", categorie: "Événement", image_url: null, date_publication: "2025-03-01" },
  { titre: "Étudiant primé au concours national d'innovation", slug: "etudiant-prime-innovation", resume: "M. Toko Serge (Master 2) remporte le 1er prix pour son projet de supervision industrielle low-cost.", categorie: "Distinction", image_url: null, date_publication: "2025-02-01" },
  { titre: "Inscriptions 2025-2026 ouvertes", slug: "inscriptions-2025-2026-ouvertes", resume: "Les candidatures (DIPET 1 & 2, BTS, Licence Pro, Master) sont ouvertes.", categorie: "Admission", image_url: null, date_publication: "2025-01-15" },
];

const FALLBACK_MEDIA: Media[] = [
  ...["campus1", "campus2", "campus3", "campus4", "campus5", "campus6", "campus7"].map((c, i) => ({ fichier_url: `assets/img/slide/${c}.webp`, legende: "Campus", album: "campus", ordre: i })),
  ...["salle1", "salle2", "salle3", "salle4", "salle5", "salle6"].map((s, i) => ({ fichier_url: `assets/img/div/${s}.jpg`, legende: "Salle de TP", album: "salles", ordre: i })),
  { fichier_url: "assets/img/div/groupe.jpg", legende: "Groupe d'étudiants", album: "evenements", ordre: 0 },
  { fichier_url: "assets/img/div/Vehicule.jpg", legende: "Véhicule du département", album: "evenements", ordre: 1 },
];

export const getFormations = () => getJSON("/api/formations", FALLBACK_FORMATIONS);
export const getEquipe = () => getJSON("/api/equipe", FALLBACK_EQUIPE);
export const getActualites = () => getJSON("/api/actualites", FALLBACK_ACTUS);
export const getMedia = () => getJSON("/api/media", FALLBACK_MEDIA);

export const DIPLOME_LABEL: Record<string, string> = {
  dipet1: "DIPET 1",
  dipet2: "DIPET 2",
  bts: "BTS",
  licence_pro: "Licence Pro",
  master: "Master",
};

export const ALBUM_LABEL: Record<string, string> = {
  campus: "Campus",
  salles: "Laboratoires",
  evenements: "Événements",
  equipe: "Équipe",
  autre: "Autres",
};
