# Plateforme — Département de Génie Informatique (ENSET Ebolowa)

Refonte du site vitrine en **plateforme complète** : portail dynamique + CMS,
espace étudiant / inscriptions, modules IA et collecte de données.

## Stack

| Couche | Techno |
|---|---|
| Front | Next.js + TypeScript + Tailwind (à venir — `apps/web/`) |
| API | FastAPI / Python (`apps/api/`) |
| Données | PostgreSQL (+ pgvector pour l'IA), Redis, MinIO |
| Infra | Docker Compose, Nginx (prod) |

## Arborescence

```
.
├── apps/
│   ├── api/            # API FastAPI
│   └── web/            # Front Next.js (à initialiser)
├── db/init/            # Schéma + seed PostgreSQL (exécutés au 1er démarrage)
├── docs/00-cadrage/    # Rôles, modèle de données, design system
├── frontend/           # Ancien site statique (référence, en cours de migration)
└── docker-compose.yml
```

## Démarrage local

```bash
cp .env.example .env          # adapter les mots de passe
docker compose up -d          # db + redis + minio + api
docker compose ps             # vérifier l'état

curl http://localhost:8000/health        # {"status":"ok","db":"up"}
curl http://localhost:8000/api/formations
```

- API : http://localhost:8000 (docs interactives : `/docs`)
- MinIO console : http://localhost:9001

## État d'avancement

- [x] **Phase 0** — Cadrage (rôles, modèle de données, design system) → `docs/00-cadrage/`
- [x] **Phase 1 (socle)** — Schéma + seed PostgreSQL validés, Docker Compose, API FastAPI (santé + lecture CMS)
- [ ] Phase 1 — Auth (3 rôles : admin / teacher / student) + bootstrap admin
- [ ] Phase 2 — CMS dynamique (back-office)
- [ ] Phase 3 — Espace étudiant / inscriptions
- [ ] Phase 4 — Collecte de données + tableaux de bord
- [ ] Phase 5 — Chatbot RAG (IA)
- [ ] Phase 6 — Modèles ML (réussite, recommandation de filière)

## Déploiement (prévu)

- Front (Next.js) → **Netlify**
- API (FastAPI) + PostgreSQL → **Render**
