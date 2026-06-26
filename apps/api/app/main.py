"""
Plateforme Génie Informatique — ENSET Ebolowa — API (FastAPI).

- Authentification 3 rôles (admin / teacher / student) : voir app/auth.py
- Lecture CMS public : formations, équipe, actualités
- Bootstrap admin au démarrage : voir app/bootstrap.py
"""
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .auth import require_role, router as auth_router
from .bootstrap import bootstrap_admin
from .config import settings
from .db import get_conn


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        print(f"[bootstrap] {bootstrap_admin()}")
    except Exception as exc:  # noqa: BLE001
        print(f"[bootstrap] échec : {exc}")
    yield


app = FastAPI(
    title="API Génie Informatique — ENSET Ebolowa",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/health")
def health():
    try:
        with get_conn() as conn:
            conn.execute("SELECT 1")
        return {"status": "ok", "db": "up"}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=503, detail=f"db down: {exc}") from exc


# --- Lecture CMS public --------------------------------------------------------

@app.get("/api/formations")
def list_formations():
    with get_conn() as conn:
        return conn.execute(
            """SELECT code, intitule, type_diplome, duree_semestres,
                      est_ouverte_inscription
               FROM formation ORDER BY type_diplome"""
        ).fetchall()


@app.get("/api/equipe")
def list_equipe():
    with get_conn() as conn:
        return conn.execute(
            """SELECT nom, fonction, photo_url
               FROM membre_equipe ORDER BY ordre_affichage"""
        ).fetchall()


@app.get("/api/actualites")
def list_actualites():
    with get_conn() as conn:
        return conn.execute(
            """SELECT titre, slug, resume, categorie, date_publication
               FROM actualite WHERE est_publie = true
               ORDER BY date_publication DESC"""
        ).fetchall()


# --- Exemple de route réservée à l'admin (démontre require_role) ---------------

@app.get("/admin/ping")
def admin_ping(user: dict = Depends(require_role("admin"))):
    return {"status": "ok", "as": user["email"], "role": user["role"]}
