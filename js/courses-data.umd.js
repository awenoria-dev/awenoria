// js/courses-data.umd.js
// Version UMD compatible file:// et localhost
// --------------------------------------------------------

window.COURSES = [
  {
    slug: "rgpd-bases",
    title: "RGPD : les bases essentielles",
    summary: "Comprendre le cadre légal et les principes fondamentaux du RGPD pour une mise en conformité efficace.",
    duration: "1 jour",
    level: "Initiation",
    modalities: ["Présentiel", "Distanciel"],
    program: [
      "Introduction au RGPD et à ses enjeux",
      "Les principes clés de la protection des données",
      "Les droits des personnes concernées",
      "Le rôle et les obligations du responsable de traitement",
      "Mise en conformité et registres obligatoires"
    ]
  },
  {
    slug: "rgaa-access",
    title: "Accessibilité numérique (RGAA)",
    summary: "Apprenez à rendre vos sites et applications accessibles selon le référentiel RGAA et les standards internationaux.",
    duration: "2 jours",
    level: "Intermédiaire",
    modalities: ["Présentiel", "Distanciel"],
    program: [
      "Introduction à l’accessibilité et au RGAA",
      "Critères de conformité et bonnes pratiques",
      "Audit d’accessibilité : méthode et outils",
      "Correction des erreurs fréquentes",
      "Rédaction de la déclaration d’accessibilité"
    ]
  },
  {
    slug: "cookies-cmp",
    title: "Cookies & CMP : mise en conformité",
    summary: "Maîtrisez la réglementation sur les cookies et la mise en place d'une Consent Management Platform conforme CNIL.",
    duration: "1/2 journée",
    level: "Tous niveaux",
    modalities: ["Distanciel"],
    program: [
      "Rappel du cadre légal (ePrivacy, RGPD, CNIL)",
      "Typologie des traceurs et règles applicables",
      "Consentement : critères et durée de validité",
      "Mise en œuvre pratique d'une CMP",
      "Audit et paramétrage technique"
    ]
  },
  {
    slug: "ia-act-intro",
    title: "IA Act : introduction et obligations",
    summary: "Découvrir le futur cadre européen de régulation de l’IA et anticiper ses impacts sur vos projets.",
    duration: "1 journée",
    level: "Avancé",
    modalities: ["Présentiel", "Distanciel"],
    program: [
      "Contexte et objectifs de l’IA Act",
      "Classification des systèmes à risque",
      "Obligations des fournisseurs et utilisateurs",
      "Documentation technique et évaluation de conformité",
      "Anticiper la mise en œuvre dans son organisation"
    ]
  },
  {
    slug: "cyber-initiation",
    title: "Cybersécurité : initiation pour tous",
    summary: "Apprenez les bons réflexes pour sécuriser vos données et vos outils numériques au quotidien.",
    duration: "1 jour",
    level: "Débutant",
    modalities: ["Présentiel"],
    program: [
      "Panorama des menaces numériques",
      "Les attaques les plus fréquentes (phishing, ransomwares, etc.)",
      "Protection des postes et des comptes utilisateurs",
      "Sécurisation des échanges et des mots de passe",
      "Plan de sensibilisation interne"
    ]
  }
];

// Petit message de confirmation
console.log(`[courses-data.umd.js] ${window.COURSES.length} fiches chargées`);
