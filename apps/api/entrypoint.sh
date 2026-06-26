#!/bin/sh
# Démarrage de l'API.
#   RUN_MIGRATIONS=true  -> applique le schéma (si absent) puis le seed (idempotent).
#                           Utilisé sur Render (la base managée ne lit pas db/init/).
#                           En local, le conteneur Postgres initialise déjà la base,
#                           donc on laisse RUN_MIGRATIONS non défini.
#   RELOAD=true          -> uvicorn --reload (dev).
#   PORT                 -> port d'écoute (Render le fournit ; défaut 8000).
set -e

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  echo "[entrypoint] Attente de la base..."
  for i in $(seq 1 30); do
    if psql "$DATABASE_URL" -tAc "SELECT 1" >/dev/null 2>&1; then break; fi
    sleep 2
  done

  HAS=$(psql "$DATABASE_URL" -tAc "SELECT to_regclass('public.utilisateur')" 2>/dev/null || echo "")
  if [ -z "$HAS" ]; then
    echo "[entrypoint] Application du schéma (01_schema.sql)..."
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f ./db_init/01_schema.sql
  else
    echo "[entrypoint] Schéma déjà présent, on saute."
  fi

  echo "[entrypoint] Application du seed (02_seed.sql, idempotent)..."
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f ./db_init/02_seed.sql
fi

PORT="${PORT:-8000}"
if [ "${RELOAD:-false}" = "true" ]; then
  exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT" --reload
else
  exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"
fi
