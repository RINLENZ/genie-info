-- ============================================================================
--  Plateforme Génie Informatique — ENSET Ebolowa
--  Schéma PostgreSQL (Phase 0 → exécutable). Cible : PostgreSQL >= 14.
--
--  Ordre : extensions → enums → fonctions utilitaires → tables → contraintes
--          → index → triggers → RLS.
--
--  Exécution :  psql -U postgres -d genie_info -f 01_schema.sql
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Extensions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;     -- emails insensibles à la casse
-- CREATE EXTENSION IF NOT EXISTS vector;  -- pgvector (activer en phase IA)

-- ----------------------------------------------------------------------------
-- 2. Types énumérés
-- ----------------------------------------------------------------------------
CREATE TYPE user_role           AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE sexe_t              AS ENUM ('M', 'F', 'autre');
CREATE TYPE type_contrat_t      AS ENUM ('permanent', 'vacataire');
CREATE TYPE type_diplome_t      AS ENUM ('dipet1', 'dipet2', 'bts', 'licence_pro', 'master');
CREATE TYPE statut_global_t     AS ENUM ('candidat', 'actif', 'diplome', 'parti');
CREATE TYPE inscription_statut_t AS ENUM
    ('dossier_soumis', 'admis', 'refuse', 'inscrit', 'en_cours', 'diplome', 'abandon', 'exclu');
CREATE TYPE inscription_type_t   AS ENUM ('nouvelle', 'reinscription');
CREATE TYPE inscription_source_t AS ENUM ('en_ligne', 'papier');
CREATE TYPE document_type_t      AS ENUM
    ('cni', 'diplome', 'releve_notes', 'photo', 'acte_naissance', 'autre');
CREATE TYPE document_statut_t    AS ENUM ('en_attente', 'valide', 'rejete');
CREATE TYPE type_evaluation_t    AS ENUM ('cc', 'tp', 'examen', 'rattrapage');
CREATE TYPE presence_statut_t    AS ENUM ('present', 'absent', 'justifie');
CREATE TYPE consentement_type_t  AS ENUM ('traitement_donnees', 'usage_ia');
CREATE TYPE media_album_t        AS ENUM ('campus', 'salles', 'evenements', 'equipe', 'autre');
CREATE TYPE type_etudiant_t      AS ENUM ('regulier', 'auditeur_libre');

-- ----------------------------------------------------------------------------
-- 3. Fonctions utilitaires
-- ----------------------------------------------------------------------------

-- 3.1 Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3.2 Matricule étudiant
--     Attribué par l'ENSET (saisi/importé), pas généré par la plateforme.
--     Format = année d'entrée sur 2 chiffres + identifiant libre (majuscules/chiffres).
--       Régulier      : ex. 26Z117      (26 = 2026, reste = identifiant école)
--       Auditeur libre : ex. 25UE0041A  (25 = 2025, reste = identifiant école)
--     On valide juste le format ; le détail interne n'est pas interprété.
CREATE OR REPLACE FUNCTION matricule_valide(p_matricule text)
RETURNS boolean AS $$
    -- 2 chiffres (année) puis au moins un caractère alphanumérique majuscule.
    SELECT p_matricule ~ '^[0-9]{2}[A-Z0-9]+$';
$$ LANGUAGE sql IMMUTABLE;

-- ----------------------------------------------------------------------------
-- 4. Identité & comptes
-- ----------------------------------------------------------------------------
CREATE TABLE utilisateur (
    id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email                    citext NOT NULL UNIQUE,
    mot_de_passe_hash        text   NOT NULL,
    role                     user_role NOT NULL,
    est_actif                boolean NOT NULL DEFAULT true,
    email_verifie            boolean NOT NULL DEFAULT false,
    double_auth_active       boolean NOT NULL DEFAULT false,
    mot_de_passe_temporaire  boolean NOT NULL DEFAULT false,
    derniere_connexion       timestamptz,
    created_at               timestamptz NOT NULL DEFAULT now(),
    updated_at               timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. Profils
-- ----------------------------------------------------------------------------
CREATE TABLE etudiant (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id       uuid UNIQUE REFERENCES utilisateur(id) ON DELETE SET NULL,
    matricule            text UNIQUE CHECK (matricule IS NULL OR matricule_valide(matricule)),
    type_etudiant        type_etudiant_t NOT NULL DEFAULT 'regulier',
    nom                  text NOT NULL,
    prenom               text NOT NULL,
    date_naissance       date,
    lieu_naissance       text,
    sexe                 sexe_t,
    nationalite          text,
    telephone            text,
    photo_url            text,
    adresse              text,
    contact_urgence_nom  text,
    contact_urgence_tel  text,
    statut_global        statut_global_t NOT NULL DEFAULT 'candidat',
    created_at           timestamptz NOT NULL DEFAULT now(),
    updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE enseignant (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id  uuid UNIQUE REFERENCES utilisateur(id) ON DELETE SET NULL,
    matricule_ens   text UNIQUE,
    nom             text NOT NULL,
    prenom          text NOT NULL,
    grade           text,
    specialite      text,
    type_contrat    type_contrat_t NOT NULL DEFAULT 'permanent',
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 6. Structure académique
-- ----------------------------------------------------------------------------
CREATE TABLE annee_academique (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    libelle       text NOT NULL UNIQUE,          -- ex: '2025-2026'
    date_debut    date NOT NULL,
    date_fin      date NOT NULL,
    est_courante  boolean NOT NULL DEFAULT false,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    CHECK (date_fin > date_debut)
);
-- Une seule année courante à la fois :
CREATE UNIQUE INDEX uniq_annee_courante ON annee_academique (est_courante)
    WHERE est_courante;

CREATE TABLE formation (
    id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code                      text NOT NULL UNIQUE,   -- ex: 'DIPET1-INFO'
    type_court                text NOT NULL,          -- ex: 'D1' (matricule)
    intitule                  text NOT NULL,
    type_diplome              type_diplome_t NOT NULL,
    duree_semestres           int NOT NULL CHECK (duree_semestres > 0),
    description               text,
    est_ouverte_inscription   boolean NOT NULL DEFAULT false,
    created_at                timestamptz NOT NULL DEFAULT now(),
    updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ue (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    formation_id    uuid NOT NULL REFERENCES formation(id) ON DELETE CASCADE,
    code            text NOT NULL,
    intitule        text NOT NULL,
    credits         int  NOT NULL DEFAULT 0 CHECK (credits >= 0),
    semestre        int  NOT NULL CHECK (semestre > 0),
    enseignant_id   uuid REFERENCES enseignant(id) ON DELETE SET NULL,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (formation_id, code)
);

-- ----------------------------------------------------------------------------
-- 7. Inscriptions & candidatures
-- ----------------------------------------------------------------------------
CREATE TABLE inscription (
    id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    etudiant_id           uuid NOT NULL REFERENCES etudiant(id) ON DELETE CASCADE,
    formation_id          uuid NOT NULL REFERENCES formation(id),
    annee_academique_id   uuid NOT NULL REFERENCES annee_academique(id),
    statut                inscription_statut_t NOT NULL DEFAULT 'dossier_soumis',
    type                  inscription_type_t   NOT NULL DEFAULT 'nouvelle',
    source                inscription_source_t NOT NULL DEFAULT 'en_ligne',
    date_soumission       timestamptz NOT NULL DEFAULT now(),
    cree_par              uuid REFERENCES utilisateur(id),  -- admin/enseignant saisisseur
    valide_par            uuid REFERENCES utilisateur(id),
    date_validation       timestamptz,
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now(),
    UNIQUE (etudiant_id, formation_id, annee_academique_id)
);

CREATE TABLE document (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    inscription_id  uuid NOT NULL REFERENCES inscription(id) ON DELETE CASCADE,
    type            document_type_t NOT NULL,
    fichier_url     text NOT NULL,
    statut          document_statut_t NOT NULL DEFAULT 'en_attente',
    commentaire     text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 8. Pédagogie
-- ----------------------------------------------------------------------------
CREATE TABLE inscription_ue (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    inscription_id  uuid NOT NULL REFERENCES inscription(id) ON DELETE CASCADE,
    ue_id           uuid NOT NULL REFERENCES ue(id) ON DELETE CASCADE,
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (inscription_id, ue_id)
);

CREATE TABLE note (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    inscription_ue_id  uuid NOT NULL REFERENCES inscription_ue(id) ON DELETE CASCADE,
    type_evaluation    type_evaluation_t NOT NULL,
    valeur             numeric(4,2) CHECK (valeur >= 0 AND valeur <= 20),
    coefficient        numeric(4,2) NOT NULL DEFAULT 1 CHECK (coefficient > 0),
    saisie_par         uuid REFERENCES enseignant(id),
    verrouillee        boolean NOT NULL DEFAULT false,
    created_at         timestamptz NOT NULL DEFAULT now(),
    updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE presence (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    inscription_ue_id  uuid NOT NULL REFERENCES inscription_ue(id) ON DELETE CASCADE,
    date_seance        date NOT NULL,
    statut             presence_statut_t NOT NULL,
    saisie_par         uuid REFERENCES enseignant(id),
    created_at         timestamptz NOT NULL DEFAULT now(),
    UNIQUE (inscription_ue_id, date_seance)
);

-- ----------------------------------------------------------------------------
-- 9. CMS (contenu public)
-- ----------------------------------------------------------------------------
CREATE TABLE actualite (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    titre             text NOT NULL,
    slug              text NOT NULL UNIQUE,
    resume            text,
    contenu           text,
    image_url         text,
    categorie         text,
    est_publie        boolean NOT NULL DEFAULT false,
    date_publication  timestamptz,
    auteur_id         uuid REFERENCES utilisateur(id) ON DELETE SET NULL,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE membre_equipe (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nom              text NOT NULL,
    fonction         text,
    photo_url        text,
    bio              text,
    ordre_affichage  int NOT NULL DEFAULT 0,
    liens_sociaux    jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE media (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fichier_url text NOT NULL,
    legende     text,
    album       media_album_t NOT NULL DEFAULT 'autre',
    ordre       int NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 10. Transverse (audit, consentement, contact)
-- ----------------------------------------------------------------------------
CREATE TABLE journal_audit (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id  uuid REFERENCES utilisateur(id) ON DELETE SET NULL,
    action          text NOT NULL,
    entite          text,
    entite_id       uuid,
    details         jsonb NOT NULL DEFAULT '{}'::jsonb,
    ip              inet,
    created_at      timestamptz NOT NULL DEFAULT now()
);
-- Immuable : aucune modification/suppression autorisée (renforcé par RLS §12).

CREATE TABLE consentement (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    etudiant_id  uuid NOT NULL REFERENCES etudiant(id) ON DELETE CASCADE,
    type         consentement_type_t NOT NULL,
    accorde      boolean NOT NULL,
    date_consent timestamptz NOT NULL DEFAULT now(),
    UNIQUE (etudiant_id, type)
);

CREATE TABLE message_contact (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nom         text NOT NULL,
    email       citext NOT NULL,
    sujet       text,
    message     text NOT NULL,
    traite      boolean NOT NULL DEFAULT false,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 11. Index secondaires (recherche fréquente)
-- ----------------------------------------------------------------------------
CREATE INDEX idx_etudiant_nom            ON etudiant (nom, prenom);
CREATE INDEX idx_inscription_etudiant    ON inscription (etudiant_id);
CREATE INDEX idx_inscription_annee       ON inscription (annee_academique_id);
CREATE INDEX idx_inscription_statut      ON inscription (statut);
CREATE INDEX idx_ue_formation            ON ue (formation_id);
CREATE INDEX idx_ue_enseignant           ON ue (enseignant_id);
CREATE INDEX idx_note_inscription_ue     ON note (inscription_ue_id);
CREATE INDEX idx_document_inscription    ON document (inscription_id);
CREATE INDEX idx_audit_entite            ON journal_audit (entite, entite_id);
CREATE INDEX idx_actualite_publie        ON actualite (est_publie, date_publication DESC);

-- ----------------------------------------------------------------------------
-- 12. Triggers updated_at
-- ----------------------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'utilisateur','etudiant','enseignant','annee_academique','formation','ue',
        'inscription','document','note','actualite','membre_equipe','media'
    ] LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%1$s_updated BEFORE UPDATE ON %1$s
             FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t);
    END LOOP;
END;
$$;

-- ----------------------------------------------------------------------------
-- 13. Row-Level Security (esquisse — affinée en Phase 1 avec l'API)
--     L'API positionne le contexte : SET app.current_user_id / app.current_role.
--     Le propriétaire de la base contourne la RLS (init sans souci).
-- ----------------------------------------------------------------------------
ALTER TABLE journal_audit ENABLE ROW LEVEL SECURITY;
-- Lecture réservée aux admins ; écriture par insertion applicative ; jamais update/delete.
CREATE POLICY audit_insert ON journal_audit FOR INSERT WITH CHECK (true);
CREATE POLICY audit_select_admin ON journal_audit FOR SELECT
    USING (current_setting('app.current_role', true) = 'admin');
-- (Pas de policy UPDATE/DELETE => interdites pour les rôles non-propriétaires.)

COMMIT;

-- ============================================================================
--  FIN. Données de référence (années, formations, comptes seed) : 02_seed.sql
-- ============================================================================
