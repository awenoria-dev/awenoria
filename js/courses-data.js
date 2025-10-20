// /js/courses-data.js
// ------------------------------------------------------------
// Données formations Awenoria (+ libellés).
// Utilisation :
//  - ESM :   import { COURSES, THEME_LABELS, AUDIENCE_LABELS } from "../js/courses-data.js"
//  - Global : <script src="/js/courses-data.js"></script> => window.COURSES (fallback)
// ------------------------------------------------------------

/** @type {const} */
export const THEME_LABELS = {
  "rgpd-essentiels": "RGPD – essentiels, registre, AIPD",
  "ia-act":           "IA Act – obligations & documentation",
  "cookies":          "Cookies & CMP",
  "web-legal":        "Mentions légales & conformité web",
  "access":           "Accessibilité (RGAA / EN 301 549)",
  "cyber":            "Cybersécurité de base"
};

/** @type {const} */
export const AUDIENCE_LABELS = {
  dirigeants: "Dirigeants & responsables",
  equipes:    "Équipes opérationnelles",
  dpo:        "Référents / DPO",
  dev:        "Dev, Produit & Data"
};

/** @type {const} */
export const COURSES = Object.freeze([
  {
    id: "rgpd-bases",
    slug: "rgpd-bases",
    title: "RGPD : les essentiels opérationnels",
    duration: "1/2 journée",
    level: "Débutant à intermédiaire",
    modalities: ["Présentiel", "Distanciel"],
    themes: ["rgpd-essentiels"],
    audiences: ["dirigeants", "equipes", "dpo"],
    summary:
      "Comprendre les obligations clés (base légale, registre, information, droits) et savoir quoi faire demain matin.",
    pitchByTheme: {
      "rgpd-essentiels":
        "Vue d'ensemble pragmatique du RGPD avec focus registre, AIPD et preuves de conformité."
    },
    pitchByAudience: {
      dirigeants:
        "Décider vite : risques, priorités, feuille de route 90 jours, budget & arbitrages.",
      equipes:
        "Passer à l’action : modèles concrets (registre, mentions, demandes d’accès), checklists métier.",
      dpo:
        "Structurer la gouvernance : cartographie, DPIA, preuves et suivi des écarts."
    },
    program: [
      "Bases légales & minimisation",
      "Registre : quoi, comment, preuves",
      "Droits des personnes : process & SLA",
      "Plan d’action 90 jours"
    ]
  },

  {
    id: "cookies-cmp",
    slug: "cookies-cmp",
    title: "Cookies, traceurs & CMP conformes",
    duration: "2h à 1/2 journée",
    level: "Intermédiaire",
    modalities: ["Distanciel", "Présentiel"],
    themes: ["cookies", "web-legal"],
    audiences: ["dirigeants", "equipes", "dpo", "dev"],
    summary:
      "Mettre en place une CMP propre, auditer les tags, documenter le consentement et limiter l'impact business.",
    pitchByTheme: {
      cookies:
        "De l’audit aux correctifs : catégories, preuve du consentement, exemptions, plans de taggage.",
      "web-legal":
        "Aligner mentions, politique cookies et CMP pour un parcours utilisateur cohérent."
    },
    pitchByAudience: {
      dirigeants:
        "Réduire le risque sans casser l’acquisition : options, KPIs, compromis.",
      equipes:
        "Paramétrages CMP, bannières, tagging plan, recettes de tests.",
      dpo:
        "Doctrine interne, exemptions, preuves de consentement & journalisation.",
      dev:
        "Implémentation technique : events, priorités de chargement, bandeau, refus dur."
    },
    program: [
      "Cadre CNIL/UE et exemptions",
      "Choisir et paramétrer une CMP",
      "Audit des tags & politique cookies",
      "Mesure d’impact et A/B si besoin"
    ]
  },

  {
    id: "ia-act-intro",
    slug: "ia-act-intro",
    title: "IA Act (UE) : obligations & documentation",
    duration: "1/2 journée à 1 journée",
    level: "Intermédiaire",
    modalities: ["Distanciel", "Présentiel"],
    themes: ["ia-act"],
    audiences: ["dirigeants", "equipes", "dpo", "dev"],
    summary:
      "Qualifier les systèmes, comprendre les obligations par niveau de risque, préparer la doc et la gouvernance.",
    pitchByTheme: {
      "ia-act":
        "Passage en revue des catégories de risque, obligations et trame documentaire prête à l’emploi."
    },
    pitchByAudience: {
      dirigeants:
        "Décider : périmètre, risques, responsabilités, budget et comitologie.",
      equipes:
        "Procédures et modèles pour opérer la conformité au quotidien.",
      dpo:
        "Articuler RGPD/IA Act : registres, analyses, contrôles, preuves.",
      dev:
        "Impacts produit/data : dataset, logs, évaluation, robustesse, transparence."
    },
    program: [
      "Cartographier les cas d’usage",
      "Qualification du risque & obligations",
      "Dossier technique & transparence",
      "Plan de mise en conformité"
    ]
  },

  {
    id: "rgaa-access",
    slug: "rgaa-access",
    title: "Accessibilité (RGAA / EN 301 549)",
    duration: "1/2 journée",
    level: "Intermédiaire",
    modalities: ["Distanciel", "Présentiel"],
    themes: ["access"],
    audiences: ["equipes", "dev", "dirigeants"],
    summary:
      "Intégrer l’accessibilité dans vos produits numériques : obligations, quick wins, outils de test.",
    pitchByTheme: {
      access:
        "RGAA/EN 301 549 : exigences, méthodes de test et mise en œuvre pragmatique."
    },
    pitchByAudience: {
      dirigeants:
        "Conformité, image et risques : feuille de route réaliste.",
      equipes:
        "Design, contenu et QA : checklists prêtes à l’emploi.",
      dev:
        "Implémentation : sémantique, contrastes, focus, ARIA, tests."
    },
    program: [
      "Cadre légal et normes",
      "Audit rapide & priorisation",
      "Design/éditorial accessibles",
      "Outillage & contrôle continu"
    ]
  }
]);

// -----------------------
// Fallback global (UMD-like)
// -----------------------
try {
  if (typeof window !== "undefined") {
    window.COURSES = COURSES;
    window.THEME_LABELS = THEME_LABELS;
    window.AUDIENCE_LABELS = AUDIENCE_LABELS;

    // Petits contrôles en dev (pas bloquants)
    if (process?.env?.NODE_ENV !== "production") {
      const ids = new Set(), slugs = new Set();
      for (const c of COURSES) {
        if (ids.has(c.id))   console.warn("[COURSES] id dupliqué :", c.id);
        if (slugs.has(c.slug)) console.warn("[COURSES] slug dupliqué :", c.slug);
        ids.add(c.id); slugs.add(c.slug);
      }
    }
  }
} catch { /* ignore pour compat navigateur sans process */ }
