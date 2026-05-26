// Curriculum outline — 5 subjects × 20 nodes × 5 levels.
// The actual Question[] for each level is produced by ./generator.ts,
// keeping the source tree small and avoiding 7 500 hand-authored items.

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
  facets: string[]; // exactly 5 — used as level names per node
  nodes: CurriculumNode[]; // exactly 20
};

const ANATOMIA_FACETS = [
  "Anatomia macroscopica",
  "Vascolarizzazione",
  "Innervazione",
  "Rapporti anatomici",
  "Correlazioni cliniche",
];
const FISIO_FACETS = [
  "Meccanismi di base",
  "Regolazione nervosa",
  "Regolazione ormonale",
  "Adattamenti funzionali",
  "Applicazioni cliniche",
];
const BIO_FACETS = [
  "Reazioni principali",
  "Enzimi chiave",
  "Regolazione metabolica",
  "Cofattori e vitamine",
  "Implicazioni patologiche",
];
const ISTO_FACETS = [
  "Cellule e morfologia",
  "Matrice extracellulare",
  "Microscopia ottica",
  "Microscopia elettronica",
  "Patologie tissutali",
];
const FARMA_FACETS = [
  "Meccanismo d'azione",
  "Farmacocinetica",
  "Indicazioni cliniche",
  "Effetti avversi",
  "Interazioni farmacologiche",
];

const N = (id: string, title: string, subtitle: string, emoji: string): CurriculumNode => ({
  id,
  title,
  subtitle,
  emoji,
});

export const CURRICULUM: CurriculumSubject[] = [
  {
    id: "anatomia",
    name: "Anatomia Umana",
    emoji: "🫀",
    description: "Apparati e sistemi del corpo umano",
    gradient: "from-primary to-primary/70",
    accent: "text-primary",
    facets: ANATOMIA_FACETS,
    nodes: [
      N("ana-locomotore", "Apparato Locomotore", "Ossa, articolazioni e muscoli", "🦴"),
      N("ana-cuore", "Cuore e Grandi Vasi", "Camere, valvole, aorta", "🫀"),
      N("ana-polmoni", "Polmoni e Vie Aeree", "Trachea, bronchi, alveoli", "🫁"),
      N("ana-snc", "Sistema Nervoso Centrale", "Encefalo e midollo spinale", "🧠"),
      N("ana-snp", "Sistema Nervoso Periferico", "Nervi cranici e spinali", "⚡"),
      N("ana-orofaringe", "Cavo Orale e Faringe", "Bocca, lingua, ghiandole salivari", "👄"),
      N("ana-stomaco", "Stomaco e Intestino", "Tubo gastroenterico", "🌀"),
      N("ana-fegato", "Fegato e Vie Biliari", "Lobi, dotti, colecisti", "🟫"),
      N("ana-pancreas", "Pancreas", "Esocrino ed endocrino", "🟡"),
      N("ana-urinario", "Apparato Urinario", "Rene, uretere, vescica", "💧"),
      N("ana-rep-m", "App. Riproduttivo Maschile", "Testicoli, prostata, pene", "♂️"),
      N("ana-rep-f", "App. Riproduttivo Femminile", "Ovaio, utero, tube", "♀️"),
      N("ana-endocrino", "Sistema Endocrino", "Ipofisi, tiroide, surrene", "⚗️"),
      N("ana-cute", "Cute e Annessi", "Epidermide, derma, peli", "🧴"),
      N("ana-occhio", "Occhio", "Bulbo, retina, vie ottiche", "👁️"),
      N("ana-orecchio", "Orecchio", "Esterno, medio, interno", "👂"),
      N("ana-mediastino", "Mediastino", "Compartimenti toracici", "📦"),
      N("ana-linfatico", "Sistema Linfatico", "Linfonodi, dotti, milza", "🛡️"),
      N("ana-peritoneo", "Peritoneo e Cavità Add.", "Sierose addominali", "🗺️"),
      N("ana-cranio", "Cranio e Faccia", "Neurocranio e splancnocranio", "💀"),
    ],
  },
  {
    id: "fisiologia",
    name: "Fisiologia",
    emoji: "⚙️",
    description: "Funzioni e regolazione dei sistemi",
    gradient: "from-success to-success/70",
    accent: "text-success",
    facets: FISIO_FACETS,
    nodes: [
      N("fis-cardio", "Fisiologia Cardiovascolare", "Ciclo cardiaco e gittata", "❤️"),
      N("fis-resp", "Fisiologia Respiratoria", "Ventilazione e scambi", "💨"),
      N("fis-renale", "Fisiologia Renale", "Filtrazione e riassorbimento", "💧"),
      N("fis-gi", "Fisiologia Gastrointestinale", "Motilità e secrezioni", "🍽️"),
      N("fis-endo", "Fisiologia Endocrina", "Ormoni e assi", "⚗️"),
      N("fis-neuro", "Fisiologia del Neurone", "Potenziali e sinapsi", "⚡"),
      N("fis-muscolo", "Fisiologia Muscolare", "Contrazione e fatica", "💪"),
      N("fis-acido-base", "Equilibrio Acido-Base", "pH, tamponi, compensi", "⚖️"),
      N("fis-termo", "Termoregolazione", "Produzione e dispersione calore", "🌡️"),
      N("fis-rip", "Fisiologia Riproduttiva", "Cicli e fertilità", "🌱"),
      N("fis-vista", "Fisiologia della Vista", "Fototrasduzione", "👁️"),
      N("fis-udito", "Fisiologia dell'Udito", "Coclea e vie uditive", "👂"),
      N("fis-sangue", "Sangue ed Emostasi", "Cellule e coagulazione", "🩸"),
      N("fis-immuno", "Fisiologia Immunitaria", "Innata e adattativa", "🛡️"),
      N("fis-metab", "Metabolismo Energetico", "Spesa e bilancio", "🔥"),
      N("fis-idrosal", "Bilancio Idrico-Salino", "Volemia e osmolarità", "🧂"),
      N("fis-esercizio", "Esercizio Fisico", "Risposte acute e croniche", "🏃"),
      N("fis-sonno", "Sonno e Ritmi Circadiani", "Fasi e regolazione", "😴"),
      N("fis-stress", "Stress e Adattamento", "Asse HPA e risposta", "🌪️"),
      N("fis-aging", "Sviluppo e Invecchiamento", "Cambiamenti funzionali", "⏳"),
    ],
  },
  {
    id: "biochimica",
    name: "Biochimica",
    emoji: "🧪",
    description: "Metabolismo, enzimi e biomolecole",
    gradient: "from-warning to-warning/70",
    accent: "text-warning-foreground",
    facets: BIO_FACETS,
    nodes: [
      N("bio-glicolisi", "Glicolisi", "Da glucosio a piruvato", "🍬"),
      N("bio-krebs", "Ciclo di Krebs", "Ossidazione acetil-CoA", "🔁"),
      N("bio-fosfox", "Fosforilazione Ossidativa", "Catena di trasporto e ATP", "⚡"),
      N("bio-gng", "Gluconeogenesi", "Sintesi di glucosio", "🍞"),
      N("bio-glicogeno", "Metabolismo del Glicogeno", "Sintesi e demolizione", "🟫"),
      N("bio-ppp", "Via dei Pentoso-Fosfati", "NADPH e ribosio-5P", "🌟"),
      N("bio-beta", "β-Ossidazione", "Demolizione acidi grassi", "🔥"),
      N("bio-lipogen", "Sintesi Acidi Grassi", "Lipogenesi citosolica", "🧈"),
      N("bio-colest", "Metabolismo del Colesterolo", "HMG-CoA reduttasi", "🧀"),
      N("bio-aa", "Metabolismo degli Aminoacidi", "Transaminazioni", "🥚"),
      N("bio-urea", "Ciclo dell'Urea", "Detossificazione NH₃", "💧"),
      N("bio-dnarep", "Replicazione del DNA", "Forca replicativa", "🧬"),
      N("bio-trascr", "Trascrizione", "RNA polimerasi", "📜"),
      N("bio-trad", "Traduzione", "Ribosoma e tRNA", "🔤"),
      N("bio-vit-h", "Vitamine Idrosolubili", "Gruppo B e C", "💊"),
      N("bio-vit-l", "Vitamine Liposolubili", "A, D, E, K", "🥑"),
      N("bio-enzim", "Enzimi e Cinetica", "Michaelis-Menten", "⚙️"),
      N("bio-segnali", "Segnalazione Cellulare", "Secondi messaggeri", "📡"),
      N("bio-emo", "Emoglobina e Mioglobina", "Trasporto O₂", "🩸"),
      N("bio-bioenerg", "Bioenergetica", "ΔG e ATP", "🔋"),
    ],
  },
  {
    id: "istologia",
    name: "Istologia",
    emoji: "🔬",
    description: "Tessuti e microscopia",
    gradient: "from-accent to-accent/70",
    accent: "text-accent-foreground",
    facets: ISTO_FACETS,
    nodes: [
      N("ist-epi-riv", "Epitelio di Rivestimento", "Pavimentoso, cubico, cilindrico", "🧱"),
      N("ist-epi-ghi", "Epitelio Ghiandolare", "Esocrino ed endocrino", "💧"),
      N("ist-conn-prop", "Connettivo Prop. Detto", "Lasso e denso", "🕸️"),
      N("ist-adiposo", "Tessuto Adiposo", "Bianco e bruno", "🥓"),
      N("ist-cartil", "Cartilagine", "Ialina, elastica, fibrosa", "🦴"),
      N("ist-osso", "Osso", "Compatto e spugnoso", "🦴"),
      N("ist-sangue", "Sangue", "Plasma e cellule", "🩸"),
      N("ist-musc-sch", "Muscolare Scheletrico", "Sarcomero striato", "💪"),
      N("ist-musc-lis", "Muscolare Liscio", "Cellule fusate", "🌀"),
      N("ist-musc-car", "Muscolare Cardiaco", "Dischi intercalari", "❤️"),
      N("ist-nervoso", "Tessuto Nervoso", "Neuroni e glia", "🧠"),
      N("ist-cute", "Cute", "Epidermide e derma", "🧴"),
      N("ist-mucose", "Mucose", "Tipiche e specializzate", "💧"),
      N("ist-sierose", "Sierose", "Mesotelio e tonaca", "🗺️"),
      N("ist-vasi", "Vasi Sanguigni", "Tonache arteriose/venose", "🩸"),
      N("ist-tubo", "Tubo Digerente", "Stratificazione mucosa", "🌀"),
      N("ist-aeree", "Vie Aeree", "Epitelio respiratorio", "🫁"),
      N("ist-rene", "Rene", "Nefroni e dotti", "💧"),
      N("ist-ghend", "Ghiandole Endocrine", "Cordoni e follicoli", "⚗️"),
      N("ist-linfoidi", "Organi Linfoidi", "Timo, milza, linfonodi", "🛡️"),
    ],
  },
  {
    id: "farmacologia",
    name: "Farmacologia",
    emoji: "💊",
    description: "Farmaci, meccanismi e dosaggi",
    gradient: "from-destructive to-destructive/70",
    accent: "text-destructive",
    facets: FARMA_FACETS,
    nodes: [
      N("far-pk", "Principi di Farmacocinetica", "ADME", "⏱️"),
      N("far-pd", "Principi di Farmacodinamica", "Recettori ed effetti", "🎯"),
      N("far-betalat", "Antibiotici β-Lattamici", "Penicilline e cefalosp.", "🦠"),
      N("far-macrol", "Antibiotici Macrolidi", "Eritro/Azitromicina", "🦠"),
      N("far-chin", "Chinoloni e Aminoglic.", "Cipro, Gentamicina", "🦠"),
      N("far-antimic", "Antimicotici", "Azoli, polieni", "🍄"),
      N("far-antiv", "Antivirali", "Aciclovir, antiretrovirali", "🧫"),
      N("far-fans", "FANS", "Ibuprofene, ketorolac", "💊"),
      N("far-oppi", "Oppioidi", "Morfina, fentanyl", "💉"),
      N("far-anest-loc", "Anestetici Locali", "Lidocaina", "🧊"),
      N("far-anest-gen", "Anestetici Generali", "Propofol, sevoflurano", "😴"),
      N("far-ipert", "Antipertensivi", "ACE-I, sartani, β-bloc.", "❤️"),
      N("far-diur", "Diuretici", "Tiazidici, dell'ansa", "💧"),
      N("far-anticoag", "Anticoagulanti", "Warfarin, eparina, DOAC", "🩸"),
      N("far-aritm", "Antiaritmici", "Classi I-IV", "💓"),
      N("far-diab", "Antidiabetici", "Insulina, metformina", "🍬"),
      N("far-broncod", "Broncodilatatori", "β2-agonisti, anticolin.", "🫁"),
      N("far-anti-h", "Antistaminici", "H1 e H2", "🤧"),
      N("far-psico", "Psicofarmaci", "SSRI, antipsicotici", "🧠"),
      N("far-onco", "Antineoplastici", "Citotossici, target", "🎗️"),
    ],
  },
];
