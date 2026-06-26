# Front-end — Next.js (Editorial-Tech)

Application **Next.js 14 (App Router) + TypeScript + Tailwind**, design
« Editorial-Tech » (cf. [`../../docs/00-cadrage/03-design-system.md`](../../docs/00-cadrage/03-design-system.md)).

Consomme l'API FastAPI (`/api/formations`, `/api/equipe`, `/api/actualites`)
avec **repli** sur des données statiques si l'API est injoignable (le site rend
toujours).

## Développement

```bash
cd apps/web
npm install
# API locale : http://localhost:8001 (cf. docker compose à la racine)
echo "NEXT_PUBLIC_API_URL=http://localhost:8001" > .env.local
npm run dev          # http://localhost:3000
```

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL de base de l'API (défaut `http://localhost:8001`) |

## Déploiement (Netlify)

Config dans [`../../netlify.toml`](../../netlify.toml) (base = `apps/web`).
Définir `NEXT_PUBLIC_API_URL` dans l'UI Netlify vers l'API Render.
