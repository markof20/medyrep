// Piano di Studi — Medicina e Chirurgia (elenco esami reale dell'utente)
// 6 gruppi tematici × 6 esami = 36 esami, 10 livelli × 15 domande generate
// proceduralmente (cfr. generator.ts). I gruppi non rappresentano più un
// "anno accademico" mostrato in UI: servono solo internamente per assegnare
// un template di 10 "facets" (nomi dei livelli) e un colore coerenti con il
// tipo di contenuto dell'esame. Un nodo di revisione viene inserito ogni 4
// nodi standard (cfr. medContent.ts).

export type CurriculumLevel = { id: string; title: string };
export type CurriculumNode = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
};
export type CurriculumSubject = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
  accent: string;
  facets: string[]; // esattamente 10 — usati come nomi dei livelli per ogni nodo
  nodes: CurriculumNode[];
};

// ---------- Facets per gruppo tematico (10 livelli × nodo) ----------

const SCIENZE_BASE_FACETS = [
  "Definizioni e nomenclatura",
  "Struttura molecolare",
  "Struttura cellulare",
  "Reazioni e meccanismi",
  "Enzimi e catalisi",
  "Regolazione e controllo",
  "Metodi sperimentali",
  "Tecniche di laboratorio",
  "Patologie correlate",
  "Applicazioni cliniche",
];

const FISIO_MICROBIO_FACETS = [
  "Anatomia macroscopica",
  "Istologia e microscopia",
  "Fisiologia di base",
  "Regolazione ormonale",
  "Regolazione nervosa",
  "Adattamenti fisiologici",
  "Microrganismi e virulenza",
  "Risposta immunitaria",
  "Fisiopatologia",
  "Correlazioni cliniche",
];

const PAT_SEMEIOTICA_FACETS = [
  "Fisiopatologia generale",
  "Alterazioni molecolari",
  "Semeiotica e anamnesi",
  "Esame obiettivo",
  "Esami ematochimici",
  "Diagnostica microbiologica",
  "Anatomia patologica",
  "Classificazione e staging",
  "Terapia farmacologica",
  "Casi anatomo-clinici",
];

const FARMACO_SPECIALITA_FACETS = [
  "Epidemiologia e fattori di rischio",
  "Patogenesi",
  "Clinica e semeiotica",
  "Diagnostica strumentale",
  "Esami di laboratorio",
  "Farmacocinetica",
  "Meccanismo d'azione",
  "Indicazioni e posologia",
  "Tecniche e procedure",
  "Casi clinici complessi",
];

const SPECIALITA_DIAGNOSTICA_FACETS = [
  "Epidemiologia",
  "Patogenesi",
  "Quadro clinico",
  "Semeiotica specialistica",
  "Diagnostica: segni elementari",
  "Diagnostica: diagnosi differenziale",
  "Terapia medica",
  "Terapia chirurgica e procedure",
  "Riabilitazione e follow-up",
  "Prevenzione e aspetti medico-legali",
];

const CLINICA_EMERGENZE_FACETS = [
  "Inquadramento diagnostico",
  "Diagnosi differenziale",
  "Urgenze e triage",
  "Gestione acuta",
  "Procedure e tecniche",
  "Terapia farmacologica",
  "Terapia chirurgica",
  "Complicanze e monitoraggio",
  "Gestione del paziente complesso",
  "Continuità delle cure",
];

const N = (id: string, title: string, subtitle: string, emoji: string): CurriculumNode => ({
  id,
  title,
  subtitle,
  emoji,
});

export const CURRICULUM: CurriculumSubject[] = [
  // =========================================================
  // Scienze di Base
  // =========================================================
  {
    id: "scienze-base",
    name: "Scienze di Base",
    emoji: "🔬",
    description: "Chimica, fisica, biologia e basi molecolari della medicina",
    gradient: "from-primary to-primary/70",
    accent: "text-primary",
    facets: SCIENZE_BASE_FACETS,
    nodes: [
      N(
        "chimica-biochimica",
        "Chimica e propedeutica biochimica",
        "Legami chimici, equilibri, pH e basi di biochimica",
        "⚗️",
      ),
      N(
        "fisica",
        "Fisica",
        "Meccanica, fluidi, termodinamica, onde ed elettromagnetismo",
        "⚙️",
      ),
      N("biologia", "Biologia", "Cellula, genetica mendeliana, ciclo cellulare", "🦠"),
      N(
        "abilita-informatiche",
        "Abilità informatiche, statistiche e linguistiche",
        "Strumenti digitali, statistica di base e inglese scientifico",
        "💻",
      ),
      N(
        "anatomia1-istologia-embriologia",
        "Anatomia 1, Istologia ed Embriologia umana",
        "Anatomia sistematica, tessuti fondamentali e sviluppo embrionale",
        "🫀",
      ),
      N(
        "biochimica-biomol-genetica",
        "Biochimica, Biologia Molecolare e Genetica",
        "Metabolismo, DNA/RNA, trascrizione e regolazione genica",
        "🧬",
      ),
    ],
  },

  // =========================================================
  // Scienze Fisiologiche e Microbiologiche
  // =========================================================
  {
    id: "fisio-microbio",
    name: "Scienze Fisiologiche e Microbiologiche",
    emoji: "⚙️",
    description: "Anatomia, fisiologia umana, microbiologia e immunologia",
    gradient: "from-success to-success/70",
    accent: "text-success",
    facets: FISIO_MICROBIO_FACETS,
    nodes: [
      N(
        "anatomia2",
        "Anatomia Umana 2",
        "Anatomia viscerale, topografica e apparato locomotore",
        "🗺️",
      ),
      N(
        "microbio-immuno",
        "Microbiologia ed Immunologia",
        "Batteri, virus, immunità innata e adattativa",
        "🛡️",
      ),
      N(
        "fisiologia1",
        "Fisiologia Umana 1",
        "Sistema nervoso, muscolo e fisiologia cardiovascolare",
        "⚡",
      ),
      N(
        "fisiologia2",
        "Fisiologia Umana 2",
        "Fisiologia respiratoria, renale, endocrina e gastrointestinale",
        "🫁",
      ),
      N(
        "patgen1-genetica-medica",
        "Patologia Generale 1 e Genetica Medica",
        "Danno cellulare, infiammazione e malattie ereditarie",
        "🧬",
      ),
      N(
        "scienze-umane",
        "Scienze Umane",
        "Bioetica, psicologia medica e storia della medicina",
        "📚",
      ),
    ],
  },

  // =========================================================
  // Patologia e Semeiotica Clinica
  // =========================================================
  {
    id: "pat-semeiotica",
    name: "Patologia e Semeiotica Clinica",
    emoji: "🩺",
    description: "Patologia, semeiotica, laboratorio e medicina d'organo",
    gradient: "from-warning to-warning/70",
    accent: "text-warning-foreground",
    facets: PAT_SEMEIOTICA_FACETS,
    nodes: [
      N(
        "patgen2",
        "Patologia Generale 2",
        "Neoplasie, fisiopatologia d'organo e riparazione tissutale",
        "🔬",
      ),
      N(
        "semeiotica-med-chir",
        "Semeiotica Medica e Chirurgica",
        "Anamnesi, esame obiettivo e semeiotica strumentale",
        "🩺",
      ),
      N(
        "medicina-laboratorio",
        "Medicina di Laboratorio",
        "Emocromo, biochimici, markers e diagnostica di laboratorio",
        "🧫",
      ),
      N(
        "endocrino-gastro-nutrizione",
        "Endocrinologia, Gastroenterologia e Nutrizione Clinica",
        "Diabete, tiroide, malattie epatiche e nutrizione clinica",
        "🍽️",
      ),
      N(
        "pat-sistemica-ricostruttiva",
        "Patologia Sistemica e Ricostruttiva",
        "Patologia d'organo e principi di chirurgia ricostruttiva",
        "🏥",
      ),
      N(
        "anatomia-patologica",
        "Anatomia Patologica e correlazioni anatomo-cliniche",
        "Istopatologia, biopsie e correlazioni clinico-patologiche",
        "🔭",
      ),
    ],
  },

  // =========================================================
  // Farmacologia e Specialità Cliniche
  // =========================================================
  {
    id: "farmaco-specialita",
    name: "Farmacologia e Specialità Cliniche",
    emoji: "💊",
    description: "Farmacologia, oncologia e patologie dei grandi apparati",
    gradient: "from-accent to-accent/70",
    accent: "text-accent-foreground",
    facets: FARMACO_SPECIALITA_FACETS,
    nodes: [
      N(
        "farmaco-tossicologia",
        "Farmacologia e Tossicologia",
        "Farmacocinetica, farmacodinamica e tossicologia clinica",
        "⏱️",
      ),
      N(
        "scienze-comportamento",
        "Scienze del Comportamento",
        "Psichiatria clinica e disturbi del comportamento",
        "🧩",
      ),
      N(
        "organi-senso",
        "Malattie degli Organi di Senso",
        "Oculistica e otorinolaringoiatria",
        "👁️",
      ),
      N(
        "oncologia",
        "Oncologia",
        "Tumori solidi ed ematologici, staging e terapia oncologica",
        "🎗️",
      ),
      N(
        "pat-cv-resp-renale",
        "Patologie Apparato Cardiovascolare, Respiratorio e Renale",
        "Cardiologia, pneumologia e nefrologia clinica",
        "❤️",
      ),
      N(
        "chirurgia-specialistica",
        "Chirurgia Specialistica",
        "Urologia, chirurgia vascolare e tecniche mininvasive",
        "🔪",
      ),
    ],
  },

  // =========================================================
  // Specialità Cliniche e Diagnostica
  // =========================================================
  {
    id: "specialita-diagnostica",
    name: "Specialità Cliniche e Diagnostica",
    emoji: "🧠",
    description: "Neurologia, diagnostica per immagini e specialità mediche",
    gradient: "from-streak to-streak/70",
    accent: "text-streak",
    facets: SPECIALITA_DIAGNOSTICA_FACETS,
    nodes: [
      N("scienze-neurologiche", "Scienze Neurologiche", "Neurologia clinica e neurochirurgia", "🧠"),
      N(
        "diagnostica-immagini-radioterapia",
        "Diagnostica per Immagini e Radioterapia",
        "RX, TC, RM, ecografia, medicina nucleare e radioterapia",
        "📷",
      ),
      N(
        "apparato-locomotore",
        "Malattie dell'Apparato Locomotore",
        "Ortopedia, traumatologia e reumatologia",
        "🦴",
      ),
      N(
        "igiene-medicina-legale",
        "Igiene e Medicina Legale",
        "Sanità pubblica, prevenzione e medicina legale",
        "⚖️",
      ),
      N(
        "diagnostica-malattie-infettive",
        "Diagnostica Clinica e Terapia delle Malattie Infettive",
        "Malattie infettive, antibioticoterapia e resistenze",
        "🦠",
      ),
      N(
        "gineco-ostetricia",
        "Ginecologia, Ostetricia e Medicina della Riproduzione",
        "Ginecologia clinica, gravidanza e medicina della riproduzione",
        "🌸",
      ),
    ],
  },

  // =========================================================
  // Clinica Integrata ed Emergenze
  // =========================================================
  {
    id: "clinica-emergenze",
    name: "Clinica Integrata ed Emergenze",
    emoji: "🏥",
    description: "Clinica integrata, chirurgia, emergenze e pediatria",
    gradient: "from-destructive to-destructive/70",
    accent: "text-destructive",
    facets: CLINICA_EMERGENZE_FACETS,
    nodes: [
      N("clinica-medica", "Clinica Medica", "Casi clinici integrati di medicina interna", "🏥"),
      N(
        "chirurgia-gen-specialistica",
        "Chirurgia Generale e Specialistica",
        "Chirurgia addominale, oncologica e tecniche mininvasive",
        "🔪",
      ),
      N(
        "anestesia-rianimazione",
        "Anestesia, Rianimazione, Terapia Intensiva e del Dolore",
        "Anestesia generale, terapia intensiva e terapia del dolore",
        "😷",
      ),
      N(
        "medicina-territorio-management",
        "Medicina del Territorio e Management Sanitario",
        "Medicina generale, continuità delle cure e organizzazione sanitaria",
        "🏡",
      ),
      N(
        "emergenze-med-chir",
        "Emergenze Mediche-Chirurgiche",
        "Urgenze cardiologiche, neurologiche e politrauma",
        "🚨",
      ),
      N("pediatria", "Pediatria", "Pediatria clinica e neonatologia", "👶"),
    ],
  },
];
