"""
Plateforme Génie Informatique — ENSET Ebolowa
API (FastAPI). Phase 1 — socle : santé + endpoints de lecture du CMS,
preuve de bout-en-bout (API -> PostgreSQL).

Les modules métier (auth, inscriptions, notes…) viendront en Phases 2+.
"""
import os
from contextlib import contextmanager

import psycopg
from psycopg.rows import dict_row
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

DATABASE_URL = os.environ.get(
    "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/genie_info"
)
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")

app = FastAPI(title="API Génie Informatique — ENSET Ebolowa", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@contextmanager
def get_conn():
    with psycopg.connect(DATABASE_URL, row_factory=dict_row) as conn:
        yield conn


@app.get("/health")
def health():
    """Vérifie que l'API et la base répondent."""
    try:
        with get_conn() as conn:
            conn.execute("SELECT 1")
        return {"status": "ok", "db": "up"}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=503, detail=f"db down: {exc}") from exc


@app.get("/api/formations")
def list_formations():
    with get_conn() as conn:
        rows = conn.execute(
            """SELECT code, intitule, type_diplome, duree_semestres,
                      est_ouverte_inscription
               FROM formation
               ORDER BY type_diplome"""
        ).fetchall()
    return rows


@app.get("/api/equipe")
def list_equipe():
    with get_conn() as conn:
        rows = conn.execute(
            """SELECT nom, fonction, photo_url
               FROM membre_equipe
               ORDER BY ordre_affichage"""
        ).fetchall()
    return rows


@app.get("/api/actualites")
def list_actualites():
    with get_conn() as conn:
        rows = conn.execute(
            """SELECT titre, slug, resume, categorie, date_publication
               FROM actualite
               WHERE est_publie = true
               ORDER BY date_publication DESC"""
        ).fetchall()
    return rows
