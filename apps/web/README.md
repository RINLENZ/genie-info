# Front-end (Next.js) — à venir (Phase 1/2)

Emplacement réservé pour l'application **Next.js + TypeScript + Tailwind**.

La direction artistique est définie dans [`docs/00-cadrage/03-design-system.md`](../../docs/00-cadrage/03-design-system.md)
(« Editorial-Tech »).

Le site statique actuel ([`../../frontend/`](../../frontend/)) sert de référence
visuelle ; ses contenus codés en dur sont désormais en base (cf. `db/init/02_seed.sql`)
et seront consommés via l'API (`/api/formations`, `/api/equipe`, `/api/actualites`).

Initialisation prévue :
```bash
npx create-next-app@latest . --ts --tailwind --app --eslint
```
