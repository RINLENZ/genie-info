"""Accès base de données (psycopg 3)."""
from contextlib import contextmanager

import psycopg
from psycopg.rows import dict_row

from .config import settings


@contextmanager
def get_conn():
    """Connexion courte, lignes en dict. Commit/rollback gérés par le contexte."""
    with psycopg.connect(settings.database_url, row_factory=dict_row) as conn:
        yield conn
