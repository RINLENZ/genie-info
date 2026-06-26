# Build avec contexte = racine du repo (pour inclure db/init/).
#   docker compose : context . / dockerfile apps/api/Dockerfile
#   Render        : dockerContext . / dockerfilePath ./apps/api/Dockerfile
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Client psql pour appliquer les migrations au démarrage (cf. entrypoint.sh).
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/api/ .
COPY db/init/ ./db_init/

RUN chmod +x entrypoint.sh

EXPOSE 8000
CMD ["./entrypoint.sh"]
