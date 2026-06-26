-- ============================================================================
--  Plateforme Génie Informatique — ENSET Ebolowa
--  Données de référence (seed). À exécuter APRÈS 01_schema.sql.
--
--  Contenu repris du site existant (frontend/) : formations, équipe, galerie.
--  Idempotent : ON CONFLICT DO NOTHING sur les clés naturelles.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Année académique courante
-- ----------------------------------------------------------------------------
INSERT INTO annee_academique (libelle, date_debut, date_fin, est_courante) VALUES
    ('2025-2026', '2025-09-01', '2026-07-31', true)
ON CONFLICT (libelle) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. Formations (DIPET 1 & 2, BTS, Licence Pro, Master)
--    type_court : code court conservé à titre indicatif (matricule = saisi).
-- ----------------------------------------------------------------------------
INSERT INTO formation (code, type_court, intitule, type_diplome, duree_semestres, est_ouverte_inscription, description) VALUES
    ('DIPET1-INFO-FOND', 'D1', 'DIPET 1 — Informatique Fondamentale',                 'dipet1',      2, true,  'Premier cycle DIPET, orientation informatique fondamentale.'),
    ('DIPET1-INFO-IND',  'D1', 'DIPET 1 — Informatique Industrielle',                 'dipet1',      2, true,  'Premier cycle DIPET, orientation informatique industrielle.'),
    ('DIPET2-INFO-IND',  'D2', 'DIPET 2 — Informatique Industrielle',                 'dipet2',      2, true,  'Second cycle DIPET, informatique industrielle.'),
    ('BTS-INFO',         'BT', 'BTS Informatique',                                    'bts',         4, true,  'Brevet de Technicien Supérieur en informatique.'),
    ('LP-INFO-IND',      'LP', 'Licence Professionnelle — Informatique Industrielle', 'licence_pro', 2, true,  'Licence professionnelle, informatique industrielle.'),
    ('MASTER-INFO',      'MA', 'Master Recherche — Informatique',                     'master',      4, true,  'Master Recherche en informatique industrielle et fondamentale.')
ON CONFLICT (code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. Compte administrateur (bootstrap)
--    Sécurité : créé INACTIF avec un hash sentinelle. Le mot de passe réel
--    (Argon2) est posé par le bootstrap de l'API (variable d'env), qui active
--    ensuite le compte. On ne committe jamais de mot de passe.
-- ----------------------------------------------------------------------------
INSERT INTO utilisateur (email, mot_de_passe_hash, role, est_actif, email_verifie, double_auth_active, mot_de_passe_temporaire) VALUES
    ('depginfo@enset-ebolowa.cm', 'BOOTSTRAP_REQUIRED', 'admin', false, false, false, true)
ON CONFLICT (email) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. Corps enseignant (CMS — section équipe du site)
-- ----------------------------------------------------------------------------
INSERT INTO membre_equipe (nom, fonction, photo_url, ordre_affichage) VALUES
    ('Pr. Olle Olle Daniel', 'Chef de Département',  'assets/img/equipe/olle.jpg',     1),
    ('Dr. Tchuani Diane',    'Chargée de Cours',     'assets/img/equipe/Tchuani.webp', 2),
    ('Dr. Medzo Charles',    'Assistant',            NULL,                             3)
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. Galerie (CMS — médias du site)
-- ----------------------------------------------------------------------------
INSERT INTO media (fichier_url, legende, album, ordre) VALUES
    ('assets/img/slide/campus1.webp', 'Amphithéâtre central',  'campus',     1),
    ('assets/img/slide/campus2.webp', 'Campus',                'campus',     2),
    ('assets/img/slide/campus3.webp', 'Campus',                'campus',     3),
    ('assets/img/slide/campus4.webp', 'Campus',                'campus',     4),
    ('assets/img/slide/campus5.webp', 'Campus',                'campus',     5),
    ('assets/img/slide/campus6.webp', 'Campus',                'campus',     6),
    ('assets/img/slide/campus7.webp', 'Campus',                'campus',     7),
    ('assets/img/div/salle1.jpg',     'Salle de TP',           'salles',     1),
    ('assets/img/div/salle2.jpg',     'Salle de TP',           'salles',     2),
    ('assets/img/div/salle3.jpg',     'Salle de TP',           'salles',     3),
    ('assets/img/div/salle4.jpg',     'Salle de TP',           'salles',     4),
    ('assets/img/div/salle5.jpg',     'Salle de TP',           'salles',     5),
    ('assets/img/div/salle6.jpg',     'Salle de TP',           'salles',     6),
    ('assets/img/div/groupe.jpg',     'Groupe d''étudiants',   'evenements', 1),
    ('assets/img/div/Vehicule.jpg',   'Véhicule du département','evenements', 2)
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. Actualité de démarrage
-- ----------------------------------------------------------------------------
INSERT INTO actualite (titre, slug, resume, contenu, categorie, est_publie, date_publication) VALUES
    ('Inscriptions 2025-2026 ouvertes',
     'inscriptions-2025-2026-ouvertes',
     'Les inscriptions (DIPET 1 & 2, BTS, Licence Pro, Master) sont ouvertes.',
     'Le Département de Génie Informatique de l''ENSET Ebolowa ouvre ses inscriptions pour l''année académique 2025-2026. Filières : DIPET 1 & 2, BTS, Licence Professionnelle et Master Recherche.',
     'Admission', true, now())
ON CONFLICT (slug) DO NOTHING;

COMMIT;

-- ============================================================================
--  Vérification rapide (lecture seule) :
--    SELECT count(*) FROM formation;       -- 6
--    SELECT count(*) FROM membre_equipe;   -- 3
--    SELECT count(*) FROM media;           -- 15
-- ============================================================================
