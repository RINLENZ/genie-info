# Rôles & Permissions — Plateforme Génie Informatique

> Phase 0 — Cadrage. Modèle d'autorisation de la plateforme (RBAC : Role-Based Access Control).

## 1. Les rôles

**3 rôles authentifiés** + le visiteur public. Le Super Admin et l'Administrateur sont **fusionnés** en un seul rôle `admin` (pouvoir technique + métier).

| Rôle | Code | Nature | Qui le crée |
|---|---|---|---|
| Administrateur | `admin` | Technique + métier (tout pouvoir) | Bootstrap initial (seed), puis un Admin peut en créer d'autres |
| Enseignant | `teacher` | Pédagogique | Admin |
| Étudiant | `student` | Usager | Auto-inscription (candidature), **ou** Admin, **ou Enseignant** (inscription papier — voir §5) |
| Visiteur | `guest` | Public non authentifié | — (implicite) |

### L'Administrateur unique
- L'Admin cumule **système** (config, logs, sauvegardes, gestion IA/data, création d'autres admins) **et** métier (inscriptions, contenus, comptes).
- C'est le rôle le plus puissant : sa sécurité est donc renforcée (2FA obligatoire, toutes ses actions journalisées).
- Conséquence : pas de séparation des pouvoirs au niveau rôle — on compense par un **journal d'audit immuable** sur toutes les actions sensibles.

## 2. Matrice de permissions

Légende : ✅ complet · 👁️ lecture seule · 🔸 limité (voir note) · ❌ aucun

| Domaine / Action | Admin | Enseignant | Étudiant |
|---|:--:|:--:|:--:|
| **Système** |
| Config globale, variables d'env | ✅ | ❌ | ❌ |
| Logs d'audit & sécurité | ✅ | ❌ | ❌ |
| Sauvegardes / restauration | ✅ | ❌ | ❌ |
| **Comptes & rôles** |
| Créer/révoquer un Admin | ✅ | ❌ | ❌ |
| Créer/gérer Enseignant | ✅ | ❌ | ❌ |
| Gérer comptes Étudiant | ✅ | 🔸 (créer/voir les siens) | 🔸 (le sien) |
| **Académique** |
| Formations / UE / maquettes | ✅ | 👁️ | 👁️ |
| Année académique (ouvrir/clore) | ✅ | ❌ | ❌ |
| Valider une inscription | ✅ | 🔸 (inscription papier — §5) | ❌ |
| Saisir des notes | ✅ | 🔸 (ses UE) | ❌ |
| Consulter ses notes | — | — | 🔸 (les siennes) |
| Faire l'appel / assiduité | ✅ | 🔸 (ses cours) | 👁️ (le sien) |
| **Contenu (CMS)** |
| Actualités, équipe, galerie | ✅ | ❌ | ❌ |
| **Données & IA** |
| Tableaux de bord statistiques | ✅ | 🔸 (ses classes) | ❌ |
| Accès jeux de données / export | ✅ | ❌ | ❌ |
| Gérer modèles IA / chatbot | ✅ | ❌ | ❌ |
| Utiliser le chatbot | ✅ | ✅ | ✅ |

### Notes sur les permissions limitées (🔸)
- **Enseignant – créer un étudiant** : peut enregistrer directement un étudiant (matricule + mot de passe temporaire) quand l'inscription a été validée sur papier — voir §5. L'étudiant ainsi créé est rattaché à la formation/UE de l'enseignant et reste visible/contrôlable par l'Admin.
- **Enseignant – notes** : ne peut saisir/modifier que les notes des UE dont il est titulaire, et seulement tant que la session n'est pas verrouillée par l'Admin.
- **Étudiant – son compte** : modifie ses infos de contact, sa photo, son mot de passe ; ne peut **pas** changer son matricule, sa formation, ses notes.
- **Admin – stats/data** : voit tous les tableaux de bord ; tout export de données nominatives est journalisé.

## 3. Modèle technique (RBAC + ownership)

Deux niveaux de contrôle :
1. **RBAC** : le rôle ouvre des catégories d'actions (ex : `student` n'a aucune route d'écriture sur `/formations`).
2. **Ownership / scope** : à l'intérieur d'un rôle, on filtre par appartenance (un enseignant ne voit que *ses* UE, un étudiant que *son* dossier).

Implémentation prévue (Phase 1) : guards/décorateurs côté API (`@Roles('admin')` + vérification de scope) + politique au niveau base (row-level security PostgreSQL pour les données sensibles).

## 4. Règles de sécurité transverses
- Mots de passe : hash Argon2 ; politique de complexité ; reset par e-mail.
- 2FA obligatoire pour l'Admin (TOTP).
- Toute action sensible (validation inscription, changement de rôle, création de compte, export data) → écrite dans un **journal d'audit** immuable.
- Sessions : JWT court + refresh token ; révocation possible par l'Admin.
- Principe du moindre privilège : un nouveau compte démarre toujours au rôle le plus bas pertinent.

## 5. Flux « Enseignant crée un étudiant » (inscription papier)

Cas d'usage : l'inscription a été faite/validée sur papier ; l'enseignant enregistre l'étudiant directement pour lui ouvrir un accès.

Étapes :
1. L'enseignant saisit l'étudiant : nom, prénom, **matricule** (fourni par l'ENSET), type (régulier / auditeur libre), formation, infos de base.
2. Le système **valide le format du matricule** (cf. modèle de données §4) et génère un **mot de passe temporaire** (affiché une fois / transmis à l'étudiant).
3. Création atomique : `utilisateur(role=student)` + `etudiant` + `inscription(statut=inscrit, source=papier)`, rattachée à l'année courante et à la formation.
4. Le compte est marqué `mot_de_passe_temporaire = true` → à la 1re connexion, l'étudiant **doit** changer son mot de passe.
5. L'action est journalisée (qui a créé qui, quand) ; l'Admin garde la main pour corriger/révoquer.

Garde-fous :
- L'enseignant ne peut rattacher l'étudiant qu'à une formation où il intervient (scope).
- Pas d'accès aux données système ni aux autres étudiants hors de ses classes.
- L'Admin peut auditer et reprendre tout compte créé par cette voie.
