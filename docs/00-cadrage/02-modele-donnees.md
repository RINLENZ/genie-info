# Modèle de données — Plateforme Génie Informatique

> Phase 0 — Cadrage. Schéma conceptuel centré sur une **gestion rigoureuse des étudiants**.
> SGBD cible : PostgreSQL. Convention : `snake_case`, clés primaires `id` (UUID), horodatage `created_at` / `updated_at` partout.

## 1. Principe : séparer Compte / Profil / Inscription

Erreur classique = tout mettre dans une table « étudiant ». On sépare 3 notions qui changent à des rythmes différents :

- **`utilisateur`** = identité de connexion (commune à tous les rôles).
- **`etudiant` / `enseignant`** = profil métier (1 ligne par personne, stable).
- **`inscription`** = lien étudiant ↔ formation **pour une année académique** (recréé chaque année → historique des réinscriptions).

```
utilisateur 1───1 etudiant 1───* inscription *───1 formation
                                     │
                                     └─*─ inscription_ue *─1 ue *─1 formation
```

## 2. Cycle de vie de l'étudiant

```
 candidat ──► dossier_soumis ──► admis ──► inscrit ──► en_cours ──┬─► diplome
                              └─► refuse                          ├─► abandon
                                          (chaque année: reinscription)└─► exclu
```
Le statut vit sur l'`inscription` (par année), pas sur l'étudiant — un même étudiant peut être `diplome` du BTS puis `inscrit` en Licence Pro.

## 3. Entités

### 3.1 Identité & comptes

**`utilisateur`**
| Champ | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| email | citext unique | identifiant de connexion |
| mot_de_passe_hash | text | Argon2 |
| role | enum | `admin`,`teacher`,`student` (Super Admin fusionné dans `admin`) |
| est_actif | bool | désactivation sans suppression |
| email_verifie | bool | |
| double_auth_active | bool | obligatoire pour `admin` |
| mot_de_passe_temporaire | bool | `true` si créé par un enseignant/admin → changement forcé à la 1re connexion |
| derniere_connexion | timestamptz | |

### 3.2 Profils

**`etudiant`**
| Champ | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| utilisateur_id | UUID (FK→utilisateur) | nullable tant que simple candidat |
| matricule | text unique | **saisi** (attribué par l'ENSET), validé par format — voir §4 |
| type_etudiant | enum | `regulier`,`auditeur_libre` |
| nom, prenom | text | |
| date_naissance, lieu_naissance | date, text | |
| sexe | enum | |
| nationalite | text | |
| telephone | text | |
| photo_url | text | MinIO |
| adresse | text | |
| contact_urgence_nom / _tel | text | |
| statut_global | enum | `candidat`,`actif`,`diplome`,`parti` |

**`enseignant`**
| Champ | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| utilisateur_id | UUID (FK) | |
| matricule_ens | text unique | |
| nom, prenom, grade | text | grade : assistant, MdC, professeur… |
| specialite | text | |
| type_contrat | enum | permanent / vacataire |

### 3.3 Structure académique

**`annee_academique`** — id, libelle (`2025-2026`), date_debut, date_fin, est_courante (bool, une seule).

**`formation`** (filière + niveau)
| Champ | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| code | text unique | ex `DIPET1-INFO` |
| intitule | text | « DIPET 1 — Informatique Fondamentale » |
| type_diplome | enum | `dipet1`,`dipet2`,`bts`,`licence_pro`,`master` |
| duree_semestres | int | |
| description | text | |
| est_ouverte_inscription | bool | |

**`ue`** (unité d'enseignement / matière)
| Champ | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| formation_id | UUID (FK) | |
| code, intitule | text | |
| credits | int | ECTS |
| semestre | int | |
| enseignant_id | UUID (FK→enseignant) | titulaire (nullable) |

### 3.4 Inscriptions & candidatures

**`inscription`** (le pivot)
| Champ | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| etudiant_id | UUID (FK) | |
| formation_id | UUID (FK) | |
| annee_academique_id | UUID (FK) | |
| statut | enum | `dossier_soumis`,`admis`,`refuse`,`inscrit`,`en_cours`,`diplome`,`abandon`,`exclu` |
| type | enum | `nouvelle`,`reinscription` |
| source | enum | `en_ligne`,`papier` (papier = saisie directe par enseignant/admin) |
| date_soumission | timestamptz | |
| cree_par | UUID (FK→utilisateur) | qui a saisi (admin ou enseignant) |
| valide_par | UUID (FK→utilisateur) | l'admin/enseignant qui valide |
| date_validation | timestamptz | |
| Contrainte | unique(etudiant, formation, annee) | pas de doublon |

**`document`** (pièces du dossier)
| Champ | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| inscription_id | UUID (FK) | |
| type | enum | `cni`,`diplome`,`releve_notes`,`photo`,`acte_naissance`,`autre` |
| fichier_url | text | MinIO |
| statut | enum | `en_attente`,`valide`,`rejete` |
| commentaire | text | motif de rejet éventuel |

### 3.5 Pédagogie

**`inscription_ue`** — lien inscription ↔ ue (les matières suivies cette année).

**`note`**
| Champ | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| inscription_ue_id | UUID (FK) | |
| type_evaluation | enum | `cc`,`tp`,`examen`,`rattrapage` |
| valeur | numeric(4,2) | /20 |
| coefficient | numeric | |
| saisie_par | UUID (FK→enseignant) | |
| verrouillee | bool | empêche modif après session |

**`presence`** — id, inscription_ue_id, date_seance, statut (`present`,`absent`,`justifie`), saisie_par.

### 3.6 CMS (contenu public)

- **`actualite`** — id, titre, slug, resume, contenu (markdown/richtext), image_url, categorie, est_publie, date_publication, auteur_id.
- **`membre_equipe`** — id, nom, fonction, photo_url, bio, ordre_affichage, liens_sociaux (jsonb).
- **`media`** — id, fichier_url, legende, album (enum: campus/salles/evenements…), ordre.

### 3.7 Transverse

- **`journal_audit`** — id, utilisateur_id, action, entite, entite_id, details (jsonb), ip, created_at. **Immuable** (pas d'update/delete).
- **`consentement`** — id, etudiant_id, type (`traitement_donnees`,`usage_ia`), accorde (bool), date. → indispensable pour exploiter les données en IA légalement.
- **`message_contact`** — formulaire public (nom, email, sujet, message, traite).

## 4. Matricule étudiant

Le matricule est **attribué par l'ENSET** (saisi/importé), **pas généré** par la plateforme. On stocke la valeur et on **valide son format**.

Format = **année d'entrée (2 chiffres) + identifiant libre** (majuscules/chiffres) ; le détail interne n'est pas interprété par la plateforme.
- Étudiant régulier : ex. `26Z117` (26 = 2026)
- Auditeur libre : ex. `25UE0041A` (25 = 2025)

Validation (fonction `matricule_valide`) : regex `^[0-9]{2}[A-Z0-9]+$`.
La distinction régulier / auditeur libre est portée par le champ `etudiant.type_etudiant`.

## 5. Index & contraintes clés
- `inscription` : unique(etudiant_id, formation_id, annee_academique_id).
- `etudiant.matricule`, `utilisateur.email`, `formation.code` : unique.
- Une seule `annee_academique.est_courante = true` (contrainte partielle).
- Row-Level Security sur `note`, `document`, `etudiant` : un étudiant ne lit que ses lignes.

## 6. Données à migrer depuis le site actuel
Le contenu codé en dur dans `frontend/index.html` devient des lignes en base :
- Formations (DIPET 1&2, BTS, Licence Pro, Master) → `formation`
- Équipe (Tchuani, Olle…) → `membre_equipe`
- Galerie (campus, salles) → `media`
- Actualités → `actualite`
