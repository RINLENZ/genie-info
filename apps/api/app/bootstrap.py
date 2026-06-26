"""Bootstrap du compte admin au démarrage.

Le seed crée l'admin INACTIF avec le hash sentinelle 'BOOTSTRAP_REQUIRED'.
Au démarrage, si ADMIN_EMAIL/ADMIN_PASSWORD sont fournis, on pose le vrai hash
Argon2 et on active le compte — UNIQUEMENT tant qu'il est en état bootstrap.
On ne réécrit jamais le mot de passe d'un admin déjà actif (sinon l'env
écraserait un mot de passe changé par l'utilisateur).
"""
from .config import settings
from .db import get_conn
from .security import hash_password


def bootstrap_admin() -> str:
    if not settings.admin_email or not settings.admin_password:
        return "skip (ADMIN_EMAIL/ADMIN_PASSWORD non définis)"

    with get_conn() as conn:
        row = conn.execute(
            """SELECT id, mot_de_passe_hash, est_actif
               FROM utilisateur WHERE email = %s AND role = 'admin'""",
            (settings.admin_email,),
        ).fetchone()

        if row is None:
            conn.execute(
                """INSERT INTO utilisateur (email, mot_de_passe_hash, role, est_actif, email_verifie)
                   VALUES (%s, %s, 'admin', true, true)""",
                (settings.admin_email, hash_password(settings.admin_password)),
            )
            conn.commit()
            return "admin créé"

        en_bootstrap = row["mot_de_passe_hash"] == "BOOTSTRAP_REQUIRED" or not row["est_actif"]
        if en_bootstrap:
            conn.execute(
                """UPDATE utilisateur
                   SET mot_de_passe_hash = %s, est_actif = true,
                       email_verifie = true, mot_de_passe_temporaire = false
                   WHERE id = %s""",
                (hash_password(settings.admin_password), row["id"]),
            )
            conn.commit()
            return "admin activé"

    return "admin déjà actif (inchangé)"
