# Direction artistique — « Editorial-Tech »

> Phase 0 — Cadrage. Objectif : une identité **singulière**, reconnaissable, qui ne ressemble à aucun template Bootstrap/SaaS générique — tout en restant sobre et académique.

## 1. Concept

Le département forme des informaticiens dans une **École Normale** : on croise donc deux univers visuels assumés.

- **Editorial** : la rigueur d'une revue académique — grandes typographies serif, beaucoup d'air, une grille visible, des numéros de section.
- **Tech** : des signaux d'ingénierie — détails monospace, traits fins, annotations type « schéma technique », accents de couleur précis.

Le résultat : *« une revue d'ingénierie »*. Ni corporate, ni startup, ni template d'école lambda.

## 2. Ce qu'on bannit (anti-template)
- ❌ Cartes blanches à ombre portée douce alignées en grille de 3.
- ❌ Hero avec gros dégradé violet/bleu et bouton arrondi générique.
- ❌ Icônes rondes colorées « features » façon SaaS.
- ❌ Carrousel Bootstrap standard.
- ❌ Sections au rythme identique (titre centré + 3 colonnes) répétées.

## 3. Palette (dérivée de l'identité actuelle)

| Token | Valeur | Usage |
|---|---|---|
| `--ink` | `#0e1a14` | Fond principal (vert-noir profond, déjà présent) |
| `--ink-2` | `#16241d` | Surfaces, cartes |
| `--paper` | `#f4f1ea` | Fond clair (sections « papier ») |
| `--accent` | `#c8ff4d` *(lime tech)* | Accent unique, vif, rare — liens actifs, focus, données |
| `--accent-warm` | `#e3a857` | Accent secondaire chaleureux (or académique) |
| `--line` | `rgba(255,255,255,.14)` | Filets, bordures techniques |
| `--muted` | `rgba(244,241,234,.6)` | Texte secondaire |

Principe : **bi-tonalité** — alternance de sections « ink » (sombres) et « paper » (claires) pour un rythme éditorial, l'accent lime utilisé avec parcimonie (max ~5 % de la surface).

## 4. Typographie

On conserve et structure les polices déjà chargées :

| Rôle | Police | Usage |
|---|---|---|
| Display / titres | **Playfair Display** ou **Cormorant Garamond** (serif) | Grands titres éditoriaux, italique pour l'emphase |
| Corps | **DM Sans** | Texte courant, lisible |
| Technique | **DM Mono** | Numéros de section, labels, métadonnées, données chiffrées, « code » |

Signature typographique : chaque grande section porte un **numéro mono** (`01 — Formations`) et un titre serif. C'est le détail qui « fait revue ».

## 5. Grille & mise en page
- Grille **éditoriale asymétrique** (12 colonnes mais usage décalé : titres sur 4 col., contenu sur 7, marge respiratoire).
- **Filets fins** (`--line`) pour délimiter, plutôt que des ombres/cartes.
- Marges généreuses, lignes de texte courtes (mesure ~65 caractères).
- Sections jamais toutes identiques : on alterne pleine largeur, deux colonnes décalées, et bandeaux pleins.

## 6. Composants signature (à concevoir en Phase 1)
1. **En-tête de section numéroté** : `01 ──────── FORMATIONS` (mono + filet).
2. **Carte formation « fiche technique »** : pas une carte SaaS, mais une fiche type spécimen — bord filet, label mono en haut, intitulé serif, métadonnées (durée, crédits) en mono alignées.
3. **Annotations techniques** : petits textes mono en marge, comme des légendes de schéma.
4. **Tableau de données** style « datasheet » pour les stats du département (compteurs animés sobres, pas de gros chiffres colorés).
5. **Curseur / focus** à accent lime, micro-animations discrètes (apparition au défilement, pas de bounce).

## 7. Mouvement
- Transitions courtes (150–250 ms), easing naturel.
- Révélation au scroll **subtile** (léger fade + translation de 8 px), jamais spectaculaire.
- Un seul effet « signature » fort possible : un trait/ligne qui se dessine au scroll le long des sections (rappel schéma technique).

## 8. Accessibilité (non négociable)
- Contraste AA minimum sur tous les couples texte/fond (vérifier lime sur ink).
- Navigation clavier complète, focus visible (accent lime).
- Respect `prefers-reduced-motion` (désactive les animations).
- Tailles de police fluides (`clamp`) pour le responsive.

## 9. Mise en œuvre technique
- **Tailwind CSS** avec tokens custom (les variables ci-dessus en `theme.extend`).
- Composants **shadcn/ui** re-stylés pour l'admin (cohérence, accessibilité), mais le **site public garde un style 100 % sur-mesure** (c'est lui qui doit être unique).
- On réutilise le CSS actuel comme référence de couleurs/typo, mais on le **réécrit en composants** (fin du fichier de 1600 lignes + CSS inline).
