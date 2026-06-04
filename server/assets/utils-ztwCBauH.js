import { useState, useEffect, useCallback } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const ANATOMIA_FACETS = [
  "Anatomia macroscopica",
  "Vascolarizzazione",
  "Innervazione",
  "Rapporti anatomici",
  "Correlazioni cliniche"
];
const FISIO_FACETS = [
  "Meccanismi di base",
  "Regolazione nervosa",
  "Regolazione ormonale",
  "Adattamenti funzionali",
  "Applicazioni cliniche"
];
const BIO_FACETS = [
  "Reazioni principali",
  "Enzimi chiave",
  "Regolazione metabolica",
  "Cofattori e vitamine",
  "Implicazioni patologiche"
];
const ISTO_FACETS = [
  "Cellule e morfologia",
  "Matrice extracellulare",
  "Microscopia ottica",
  "Microscopia elettronica",
  "Patologie tissutali"
];
const FARMA_FACETS = [
  "Meccanismo d'azione",
  "Farmacocinetica",
  "Indicazioni cliniche",
  "Effetti avversi",
  "Interazioni farmacologiche"
];
const N = (id, title, subtitle, emoji) => ({
  id,
  title,
  subtitle,
  emoji
});
const CURRICULUM = [
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
      N("ana-cranio", "Cranio e Faccia", "Neurocranio e splancnocranio", "💀")
    ]
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
      N("fis-aging", "Sviluppo e Invecchiamento", "Cambiamenti funzionali", "⏳")
    ]
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
      N("bio-bioenerg", "Bioenergetica", "ΔG e ATP", "🔋")
    ]
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
      N("ist-linfoidi", "Organi Linfoidi", "Timo, milza, linfonodi", "🛡️")
    ]
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
      N("far-onco", "Antineoplastici", "Citotossici, target", "🎗️")
    ]
  }
];
function qid(ctx, n) {
  return `${ctx.nodeId}__${ctx.levelId}__q${n}`;
}
const MC = [
  (c) => ({
    prompt: `In riferimento a ${c.node}, quale affermazione descrive meglio l'aspetto «${c.facet}»?`,
    options: [
      `È un argomento fondamentale di ${c.subject}, indispensabile per la pratica clinica.`,
      `Riguarda esclusivamente la sfera psicologica e non quella biologica.`,
      `Non viene affrontato nei programmi di ${c.subject}.`,
      `È un tema marginale, di interesse puramente storico.`
    ],
    correctIndex: 0,
    explanation: `«${c.facet}» applicato a ${c.node} è uno degli ambiti centrali di ${c.subject}: padroneggiarlo è prerequisito per ragionamento clinico e quiz d'esame.`
  }),
  (c) => ({
    prompt: `Quale opzione NON è pertinente allo studio di ${c.node} sotto il profilo «${c.facet}»?`,
    options: [
      `L'analisi delle proprietà di una stella nana bianca`,
      `L'organizzazione strutturale o funzionale di ${c.node}`,
      `Le correlazioni con altre branche della ${c.subject}`,
      `Le implicazioni semeiotiche o terapeutiche`
    ],
    correctIndex: 0,
    explanation: `L'astrofisica delle stelle nane non rientra nello studio di ${c.node}; gli altri item appartengono al programma di ${c.subject}.`
  }),
  (c) => ({
    prompt: `Studiando ${c.node} con focus su «${c.facet}», quale strategia di approccio è più efficace?`,
    options: [
      `Integrare nozioni teoriche con casi clinici e immagini`,
      `Memorizzare solo elenchi senza contesto`,
      `Saltare gli aspetti pratici e clinici`,
      `Ridurre lo studio alla sola etimologia dei termini`
    ],
    correctIndex: 0,
    explanation: `Lo studio efficace di ${c.node} richiede integrazione teoria-clinica: le mappe concettuali e i casi reali consolidano la memoria a lungo termine.`
  }),
  (c) => ({
    prompt: `Quale categoria di concetti è centrale per «${c.facet}» di ${c.node}?`,
    options: [
      `Termini specifici, relazioni strutturali e meccanismi`,
      `Solo date di scoperta storica`,
      `Esclusivamente codici amministrativi`,
      `Nomi di città italiane`
    ],
    correctIndex: 0,
    explanation: `Per ${c.facet} di ${c.node} servono lessico tecnico, relazioni topografiche/funzionali e meccanismi causali.`
  }),
  (c) => ({
    prompt: `Quale collegamento è più appropriato tra ${c.node} e «${c.facet}»?`,
    options: [
      `${c.facet} chiarisce come ${c.node} funzioni o si organizzi nell'organismo`,
      `${c.facet} è un sinonimo di ${c.node}`,
      `${c.facet} esclude lo studio di ${c.node}`,
      `${c.facet} appartiene a un'altra disciplina priva di legami`
    ],
    correctIndex: 0,
    explanation: `${c.facet} è una delle chiavi di lettura attraverso cui ${c.subject} descrive ${c.node}.`
  }),
  (c) => ({
    prompt: `Quale tra le seguenti è una corretta priorità di studio per «${c.facet}» di ${c.node}?`,
    options: [
      `Definizioni → meccanismi → applicazioni cliniche`,
      `Saltare le definizioni e partire dai casi rari`,
      `Limitarsi alla nomenclatura latina arcaica`,
      `Studiare solo l'iconografia senza testi`
    ],
    correctIndex: 0,
    explanation: `La sequenza definizioni → meccanismi → applicazioni è la più efficace anche in ${c.subject}.`
  })
];
const CL = [
  (c) => ({
    prompt: `${c.node} viene approfondito in ${c.subject} soprattutto attraverso lo studio di ___.`,
    options: [c.facet, "geometria proiettiva", "letteratura medievale", "diritto romano"],
    correctIndex: 0,
    explanation: `${c.facet} è proprio uno dei capitoli con cui si affronta ${c.node}.`
  }),
  (c) => ({
    prompt: `La disciplina che studia ${c.node} sotto il profilo di ${c.facet} è la ___.`,
    options: [c.subject, "filologia", "musicologia", "criptografia"],
    correctIndex: 0,
    explanation: `${c.subject} è la materia di riferimento per ${c.node}.`
  }),
  (c) => ({
    prompt: `Un esame di ${c.subject} valuta tipicamente, su ${c.node}, la conoscenza di ___.`,
    options: [`${c.facet}`, "linguistica generale", "design industriale", "diritto canonico"],
    correctIndex: 0,
    explanation: `${c.facet} è argomento ricorrente nelle prove d'esame di ${c.subject} relative a ${c.node}.`
  })
];
const TF = [
  (c) => ({
    prompt: `${c.facet} è uno degli argomenti centrali nello studio di ${c.node} in ${c.subject}.`,
    answer: true,
    explanation: `Vero: ${c.facet} è parte integrante del capitolo dedicato a ${c.node}.`
  }),
  (c) => ({
    prompt: `Lo studio di ${c.node} prescinde completamente da considerazioni di ${c.facet}.`,
    answer: false,
    explanation: `Falso: senza ${c.facet} la comprensione di ${c.node} resta incompleta.`
  }),
  (c) => ({
    prompt: `Le nozioni di ${c.facet} relative a ${c.node} hanno ricadute clinico-pratiche utili anche al medico generale.`,
    answer: true,
    explanation: `Vero: la ${c.subject} fornisce le basi indispensabili per la valutazione clinica.`
  })
];
const CLI = [
  (c) => ({
    scenario: `Uno studente del 3° anno deve preparare una relazione sintetica su ${c.node}. Il docente chiede di evidenziare l'aspetto «${c.facet}».`,
    prompt: `Quale impostazione è più corretta?`,
    options: [
      `Descrivere ${c.facet} di ${c.node} integrando teoria e implicazioni cliniche`,
      `Elencare solo i nomi propri senza contesto`,
      `Trattare un argomento di un'altra disciplina`,
      `Riportare aneddoti personali non documentati`
    ],
    correctIndex: 0,
    explanation: `Una buona relazione integra ${c.facet} con la clinica: è ciò che ${c.subject} richiede.`
  }),
  (c) => ({
    scenario: `Un paziente pone una domanda relativa a ${c.node}. Per rispondere correttamente è utile padroneggiare anche ${c.facet}.`,
    prompt: `Quale comportamento è appropriato?`,
    options: [
      `Spiegare in modo semplice, basandosi su nozioni di ${c.subject}`,
      `Improvvisare risposte non basate su evidenze`,
      `Rifiutarsi di rispondere senza motivo`,
      `Cambiare argomento senza fornire informazioni`
    ],
    correctIndex: 0,
    explanation: `Comunicare in modo chiaro, ancorato a ${c.subject}, è una competenza clinica fondamentale.`
  }),
  (c) => ({
    scenario: `In sede d'esame viene chiesto di collegare ${c.node} ad altri capitoli di ${c.subject}.`,
    prompt: `Come si costruisce un collegamento solido partendo da «${c.facet}»?`,
    options: [
      `Mostrando relazioni concettuali (struttura, funzione, regolazione, clinica)`,
      `Citando solo curiosità non pertinenti`,
      `Inventando connessioni non documentate`,
      `Evitando ogni riferimento ad altri argomenti`
    ],
    correctIndex: 0,
    explanation: `I collegamenti forti partono da meccanismi condivisi: ${c.facet} è una buona porta d'ingresso.`
  })
];
function buildLevelQuestions(ctx) {
  const out = [];
  let i = 1;
  MC.forEach((fn) => {
    const t = fn(ctx);
    out.push({ id: qid(ctx, i++), type: "multiple", ...t });
  });
  CL.forEach((fn) => {
    const t = fn(ctx);
    out.push({ id: qid(ctx, i++), type: "cloze", ...t });
  });
  TF.forEach((fn) => {
    const t = fn(ctx);
    out.push({ id: qid(ctx, i++), type: "truefalse", ...t });
  });
  CLI.forEach((fn) => {
    const t = fn(ctx);
    out.push({ id: qid(ctx, i++), type: "clinical", ...t });
  });
  return out;
}
function buildFlashcards(node, facets) {
  return facets.map((f, i) => ({
    id: `${node.id}-fc-${i + 1}`,
    front: `${node.title}: aspetto chiave di «${f}»?`,
    back: `${f} è uno dei cinque livelli del nodo ${node.title}: studiane definizioni, meccanismi e ricadute cliniche.`
  }));
}
function buildNodes(subject) {
  return subject.nodes.map((nd) => {
    const levels = subject.facets.map((facet, idx) => {
      const levelId = `L${idx + 1}`;
      const ctx = {
        subject: subject.name,
        node: nd.title,
        facet,
        nodeId: nd.id,
        levelId
      };
      return {
        id: levelId,
        title: facet,
        subtitle: `${nd.title} · livello ${idx + 1}`,
        questions: buildLevelQuestions(ctx)
      };
    });
    return {
      id: nd.id,
      title: nd.title,
      subtitle: nd.subtitle,
      emoji: nd.emoji,
      levels,
      flashcards: buildFlashcards(nd, subject.facets),
      kind: "standard"
    };
  });
}
function seedFromString(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a = a + 1831565813 >>> 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, 1 | t);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const REVIEW_QUESTION_COUNT = 15;
function buildReviewNode(subject, reviewIndex, sourceNodes) {
  const id = `${subject.id}-rev-${reviewIndex}`;
  const levelId = "R1";
  const rng = mulberry32(seedFromString(id));
  const pool = sourceNodes.flatMap((n) => n.levels.flatMap((l) => l.questions));
  const arr = pool.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const picked = arr.slice(0, Math.min(REVIEW_QUESTION_COUNT, arr.length)).map((q, i) => ({
    ...q,
    id: `${id}__${levelId}__rq${i + 1}`
  }));
  const titles = sourceNodes.map((n) => n.title).join(" · ");
  return {
    id,
    title: `Ripasso ${reviewIndex}`,
    subtitle: `Quiz misto sui 4 nodi precedenti`,
    emoji: "🧠",
    kind: "review",
    sourceNodeIds: sourceNodes.map((n) => n.id),
    flashcards: [],
    levels: [
      {
        id: levelId,
        title: `Ripasso: ${titles}`,
        subtitle: `15 domande casuali dai nodi appena studiati`,
        questions: picked
      }
    ]
  };
}
const SUBJECT = {
  faculty: "Medicina e Chirurgia"
};
const GLOSSARY = [
  { term: "miocardio", definition: "Tessuto muscolare striato del cuore, responsabile della contrazione cardiaca." },
  { term: "alveoli", definition: "Piccole sacche polmonari dove avviene lo scambio di gas O₂/CO₂." },
  { term: "sistole", definition: "Fase di contrazione del cuore durante il ciclo cardiaco." },
  { term: "diastole", definition: "Fase di rilassamento del cuore durante il ciclo cardiaco." },
  { term: "neurone", definition: "Cellula eccitabile del sistema nervoso, unità funzionale del cervello." },
  { term: "sinapsi", definition: "Zona di contatto funzionale tra due neuroni o tra neurone ed effettore." },
  { term: "nefrone", definition: "Unità funzionale del rene, composta da glomerulo e tubulo." }
];
const FACULTY = "Medicina e Chirurgia";
const REVIEW_EVERY = 4;
const interleaved = CURRICULUM.map((s) => {
  const standardNodes = buildNodes(s);
  const out = [];
  let reviewIdx = 0;
  for (let i = 0; i < standardNodes.length; i++) {
    out.push(standardNodes[i]);
    if ((i + 1) % REVIEW_EVERY === 0) {
      reviewIdx += 1;
      const sources = standardNodes.slice(i - REVIEW_EVERY + 1, i + 1);
      out.push(buildReviewNode(s, reviewIdx, sources));
    }
  }
  return { subject: s, nodes: out };
});
const NODES = interleaved.flatMap((x) => x.nodes);
const SUBJECTS = interleaved.map(({ subject: s, nodes }) => ({
  id: s.id,
  name: s.name,
  emoji: s.emoji,
  description: s.description,
  faculty: FACULTY,
  gradient: s.gradient,
  accent: s.accent,
  nodeIds: nodes.map((n) => n.id)
}));
const LEVELS_PER_NODE = 5;
const QUESTIONS_PER_LEVEL = 15;
function isReviewNode(node) {
  return node.kind === "review";
}
const LEADERBOARD = [
  { name: "Giulia M.", xp: 1240, avatar: "👩‍⚕️" },
  { name: "Marco T.", xp: 1180, avatar: "🧑‍⚕️" },
  { name: "Sara R.", xp: 1050, avatar: "👩🏽‍⚕️" },
  { name: "Luca B.", xp: 980, avatar: "🧑🏻‍⚕️" },
  { name: "Elena P.", xp: 870, avatar: "👩🏼‍⚕️" },
  { name: "Davide L.", xp: 720, avatar: "🧑🏽‍⚕️" },
  { name: "Chiara F.", xp: 640, avatar: "👩🏻‍⚕️" },
  { name: "Andrea V.", xp: 510, avatar: "🧑🏼‍⚕️" },
  { name: "Federica S.", xp: 410, avatar: "👩🏾‍⚕️" },
  { name: "Riccardo N.", xp: 320, avatar: "🧑🏾‍⚕️" }
];
function findGlossary(term) {
  const t = term.trim().toLowerCase();
  return GLOSSARY.find((g) => g.term.toLowerCase() === t);
}
function findQuestion(qid2) {
  for (const node of NODES) {
    for (const lvl of node.levels) {
      const q = lvl.questions.find((q2) => q2.id === qid2);
      if (q) return { node, question: q };
    }
  }
  return void 0;
}
function getNodesForSubject(subjectId) {
  const s = SUBJECTS.find((x) => x.id === subjectId);
  if (!s) return [];
  return s.nodeIds.map((id) => NODES.find((n) => n.id === id)).filter(Boolean);
}
function getNodeById(nodeId) {
  return NODES.find((n) => n.id === nodeId);
}
function getLevel(nodeId, levelId) {
  return getNodeById(nodeId)?.levels.find((l) => l.id === levelId);
}
function getSubjectByNodeId(nodeId) {
  return SUBJECTS.find((s) => s.nodeIds.includes(nodeId));
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickLevelQuestions(nodeId, levelId) {
  const lvl = getLevel(nodeId, levelId);
  if (!lvl) return [];
  return shuffle(lvl.questions).slice(0, QUESTIONS_PER_LEVEL);
}
const KEY = "medrep:state:v3";
const MAX_LIVES = 5;
const LIFE_REGEN_MS = 30 * 60 * 1e3;
function getMonday(d = /* @__PURE__ */ new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function defaultState() {
  return {
    xp: 0,
    weeklyXp: 0,
    weekStart: getMonday(),
    lives: MAX_LIVES,
    lastLifeLossAt: null,
    streak: 0,
    lastStudyDay: null,
    nodeProgress: {},
    mistakes: []
  };
}
function load() {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = { ...defaultState(), ...JSON.parse(raw) };
    const monday = getMonday();
    if (parsed.weekStart !== monday) {
      parsed.weekStart = monday;
      parsed.weeklyXp = 0;
    }
    if (parsed.lives < MAX_LIVES && parsed.lastLifeLossAt) {
      const elapsed = Date.now() - parsed.lastLifeLossAt;
      const regen = Math.floor(elapsed / LIFE_REGEN_MS);
      if (regen > 0) {
        parsed.lives = Math.min(MAX_LIVES, parsed.lives + regen);
        parsed.lastLifeLossAt = parsed.lives >= MAX_LIVES ? null : parsed.lastLifeLossAt + regen * LIFE_REGEN_MS;
      }
    }
    if (!parsed.nodeProgress) parsed.nodeProgress = {};
    return parsed;
  } catch {
    return defaultState();
  }
}
function save(s) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
  }
}
const listeners = /* @__PURE__ */ new Set();
let current = null;
function getState() {
  if (!current) current = load();
  return current;
}
function setState(updater) {
  const next = updater(getState());
  current = next;
  save(next);
  listeners.forEach((l) => l());
}
function useMedStore() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    current = load();
    force((n) => n + 1);
    return () => {
      listeners.delete(l);
    };
  }, []);
  const state = getState();
  const addXp = useCallback((amount) => {
    setState((s) => ({ ...s, xp: s.xp + amount, weeklyXp: s.weeklyXp + amount }));
  }, []);
  const loseLife = useCallback(() => {
    setState((s) => ({
      ...s,
      lives: Math.max(0, s.lives - 1),
      lastLifeLossAt: Date.now()
    }));
  }, []);
  const refillLives = useCallback(() => {
    setState((s) => ({ ...s, lives: MAX_LIVES, lastLifeLossAt: null }));
  }, []);
  const recordMistake = useCallback((qid2) => {
    setState((s) => s.mistakes.includes(qid2) ? s : { ...s, mistakes: [...s.mistakes, qid2] });
  }, []);
  const removeMistake = useCallback((qid2) => {
    setState((s) => ({ ...s, mistakes: s.mistakes.filter((x) => x !== qid2) }));
  }, []);
  const finishLevel = useCallback(
    (nodeId, levelId, sessionCorrectIds) => {
      setState((s) => {
        const prev = s.nodeProgress[nodeId] ?? { completedLevels: [], correctIds: [] };
        const completedLevels = prev.completedLevels.includes(levelId) ? prev.completedLevels : [...prev.completedLevels, levelId];
        const correctIds = Array.from(/* @__PURE__ */ new Set([...prev.correctIds, ...sessionCorrectIds]));
        const nodeProgress = {
          ...s.nodeProgress,
          [nodeId]: { completedLevels, correctIds }
        };
        const t = todayStr();
        let streak = s.streak;
        let lastStudyDay = s.lastStudyDay;
        if (lastStudyDay !== t) {
          if (lastStudyDay) {
            const prevDay = new Date(lastStudyDay);
            const today = new Date(t);
            const diff = Math.round((today.getTime() - prevDay.getTime()) / 864e5);
            streak = diff === 1 ? streak + 1 : 1;
          } else {
            streak = 1;
          }
          lastStudyDay = t;
        }
        return { ...s, nodeProgress, streak, lastStudyDay };
      });
    },
    []
  );
  const reset = useCallback(() => {
    setState(() => defaultState());
  }, []);
  return {
    state,
    addXp,
    loseLife,
    refillLives,
    recordMistake,
    removeMistake,
    finishLevel,
    reset,
    MAX_LIVES,
    LEVELS_PER_NODE
  };
}
function getNodeProgress(state, nodeId) {
  return state.nodeProgress[nodeId] ?? { completedLevels: [], correctIds: [] };
}
function isLevelCompleted(state, nodeId, levelId) {
  return getNodeProgress(state, nodeId).completedLevels.includes(levelId);
}
function isLevelUnlocked(state, nodeId, levelIds, levelId) {
  const idx = levelIds.indexOf(levelId);
  if (idx <= 0) return true;
  return isLevelCompleted(state, nodeId, levelIds[idx - 1]);
}
function isNodeCompleted(state, nodeId) {
  const node = getNodeById(nodeId);
  const total = node?.levels.length ?? LEVELS_PER_NODE;
  return getNodeProgress(state, nodeId).completedLevels.length >= total;
}
function isNodeUnlocked(state, nodeIds, nodeId) {
  const idx = nodeIds.indexOf(nodeId);
  if (idx <= 0) return true;
  return isNodeCompleted(state, nodeIds[idx - 1]);
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export {
  LEADERBOARD as L,
  NODES as N,
  QUESTIONS_PER_LEVEL as Q,
  SUBJECT as S,
  SUBJECTS as a,
  getNodeProgress as b,
  cn as c,
  LEVELS_PER_NODE as d,
  isReviewNode as e,
  findQuestion as f,
  getNodesForSubject as g,
  isNodeUnlocked as h,
  isNodeCompleted as i,
  getNodeById as j,
  getSubjectByNodeId as k,
  isLevelUnlocked as l,
  isLevelCompleted as m,
  getLevel as n,
  findGlossary as o,
  pickLevelQuestions as p,
  useMedStore as u
};
