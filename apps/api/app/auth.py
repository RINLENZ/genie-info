"""Authentification : login, profil, changement de mot de passe + dépendances de rôle."""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

from .db import get_conn
from .security import (
    create_access_token,
    decode_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    must_change_password: bool


class ChangePasswordIn(BaseModel):
    ancien_mot_de_passe: str
    nouveau_mot_de_passe: str


# --- Dépendances ---------------------------------------------------------------

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = decode_token(token)
    except Exception:  # noqa: BLE001
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token invalide ou expiré")
    uid = payload.get("sub")
    with get_conn() as conn:
        user = conn.execute(
            """SELECT id, email, role, est_actif, mot_de_passe_temporaire
               FROM utilisateur WHERE id = %s""",
            (uid,),
        ).fetchone()
    if not user or not user["est_actif"]:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Compte introuvable ou inactif")
    return user


def require_role(*roles: str):
    """Dépendance : restreint l'accès aux rôles donnés (admin / teacher / student)."""
    def checker(user: dict = Depends(get_current_user)) -> dict:
        if user["role"] not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
        return user
    return checker


# --- Routes --------------------------------------------------------------------

@router.post("/login", response_model=TokenOut)
def login(form: OAuth2PasswordRequestForm = Depends()):
    """Connexion par email (champ `username`) + mot de passe."""
    with get_conn() as conn:
        user = conn.execute(
            """SELECT id, mot_de_passe_hash, role, est_actif, mot_de_passe_temporaire
               FROM utilisateur WHERE email = %s""",
            (form.username,),
        ).fetchone()

    if not user or not verify_password(user["mot_de_passe_hash"], form.password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Identifiants invalides")
    if not user["est_actif"]:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Compte inactif")

    token = create_access_token(user["id"], user["role"])
    return TokenOut(
        access_token=token,
        role=user["role"],
        must_change_password=user["mot_de_passe_temporaire"],
    )


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {
        "id": str(user["id"]),
        "email": user["email"],
        "role": user["role"],
        "must_change_password": user["mot_de_passe_temporaire"],
    }


@router.post("/change-password")
def change_password(data: ChangePasswordIn, user: dict = Depends(get_current_user)):
    if len(data.nouveau_mot_de_passe) < 8:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Mot de passe trop court (min. 8)")
    with get_conn() as conn:
        row = conn.execute(
            "SELECT mot_de_passe_hash FROM utilisateur WHERE id = %s", (user["id"],)
        ).fetchone()
        if not verify_password(row["mot_de_passe_hash"], data.ancien_mot_de_passe):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Ancien mot de passe incorrect")
        conn.execute(
            """UPDATE utilisateur
               SET mot_de_passe_hash = %s, mot_de_passe_temporaire = false, updated_at = now()
               WHERE id = %s""",
            (hash_password(data.nouveau_mot_de_passe), user["id"]),
        )
        conn.commit()
    return {"status": "ok", "message": "Mot de passe mis à jour"}
