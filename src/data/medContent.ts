// Mock dataset for MedRep — Anatomia Umana
// Glossary terms are referenced inline in explanations using [[term]] syntax.

export type GlossaryEntry = { term: string; definition: string };

export type Question =
  | {
      id: string;
      type: "multiple";
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string; // may contain [[term]] markers
    }
  | {
      id: string;
      type: "truefalse";
      prompt: string;
      answer: boolean;
      explanation: string;
    }
  | {
      id: string;
      type: "clinical";
      scenario: string;
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };

export type Flashcard = { id?: string; front: string; back: string };

export type Node = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  questions: Question[];
  flashcards: Flashcard[];
};

export const SUBJECT = {
  id: "anatomia",
  name: "Anatomia Umana",
  faculty: "Medicina e Chirurgia",
};

export const GLOSSARY: GlossaryEntry[] = [
  { term: "miocardio", definition: "Tessuto muscolare striato del cuore, responsabile della contrazione cardiaca." },
  { term: "diafisi", definition: "Porzione centrale e allungata di un osso lungo." },
  { term: "epifisi", definition: "Estremità di un osso lungo, generalmente articolare." },
  { term: "alveoli", definition: "Piccole sacche polmonari dove avvienelo scambio di gas O₂/CO₂." },
  { term: "pleura", definition: "Membrana sierosa che riveste i polmoni e la cavità toracica." },
  { term: "sistole", definition: "Fase di contrazione del cuore durante il ciclo cardiaco." },
  { term: "diastole", definition: "Fase di rilassamento del cuore durante il ciclo cardiaco." },
  { term: "neurone", definition: "Cellula eccitabile del sistema nervoso, unità funzionale del cervello." },
  { term: "sinapsi", definition: "Zona di contatto funzionale tra due neuroni o tra neurone ed effettore." },
  { term: "nefrone", definition: "Unità funzionale del rene, composta da glomerulo e tubulo." },
  { term: "peristalsi", definition: "Contrazioni muscolari ritmiche che spingono il contenuto lungo il tubo digerente." },
  { term: "endocardio", definition: "Membrana che riveste internamente le cavità cardiache." },
  { term: "valvola mitrale", definition: "Valvola atrio-ventricolare sinistra, tra atrio e ventricolo sinistro." },
  { term: "surrene", definition: "Ghiandola endocrina posta sopra il rene, produce cortisolo e adrenalina." },
];

export const NODES: Node[] = [
  {
    id: "locomotore",
    title: "Apparato Locomotore",
    subtitle: "Ossa, articolazioni e muscoli",
    emoji: "🦴",
    questions: [
      {
        id: "loc-1",
        type: "multiple",
        prompt: "Quante ossa compongono lo scheletro umano adulto?",
        options: ["186", "206", "256", "300"],
        correctIndex: 1,
        explanation:
          "Lo scheletro adulto è formato da 206 ossa. Alla nascita ne contiamo circa 270 ma molte si fondono durante la crescita, soprattutto nel cranio e nel sacro.",
      },
      {
        id: "loc-2",
        type: "truefalse",
        prompt: "La [[diafisi]] è l'estremità articolare di un osso lungo.",
        answer: false,
        explanation:
          "Falso: la [[diafisi]] è la porzione centrale dell'osso lungo, mentre l'estremità è chiamata [[epifisi]].",
      },
      {
        id: "loc-3",
        type: "multiple",
        prompt: "Quale di queste è un'articolazione mobile (diartrosi)?",
        options: ["Suture craniche", "Sinfisi pubica", "Articolazione della spalla", "Articolazione tra vertebre"],
        correctIndex: 2,
        explanation:
          "La spalla è una enartrosi, articolazione sferoidale che permette movimenti su tutti i piani dello spazio.",
      },
      {
        id: "loc-4",
        type: "clinical",
        scenario: "Paziente di 22 anni dopo trauma sportivo: dolore acuto al ginocchio, gonfiore e instabilità laterale.",
        prompt: "Quale struttura è più probabilmente lesionata?",
        options: ["Legamento crociato anteriore", "Tendine di Achille", "Menisco esterno isolato", "Rotula"],
        correctIndex: 0,
        explanation:
          "L'instabilità antero-laterale e il meccanismo di torsione sono tipici della rottura del legamento crociato anteriore (LCA).",
      },
      {
        id: "loc-5",
        type: "multiple",
        prompt: "Il muscolo deltoide è innervato principalmente da:",
        options: ["Nervo ulnare", "Nervo ascellare", "Nervo radiale", "Nervo mediano"],
        correctIndex: 1,
        explanation:
          "Il deltoide è innervato dal nervo ascellare (C5-C6), motivo per cui le lussazioni di spalla possono comprometterne la funzione.",
      },
    ],
    flashcards: [
      { front: "Quante vertebre cervicali abbiamo?", back: "7 vertebre cervicali (C1-C7)." },
      { front: "Definizione di diartrosi", back: "Articolazione mobile con cavità sinoviale (es. spalla, anca)." },
      { front: "Origine del muscolo bicipite brachiale", back: "Capo lungo: tubercolo sopraglenoideo. Capo breve: processo coracoideo." },
    ],
  },
  {
    id: "cardio",
    title: "Apparato Cardiocircolatorio",
    subtitle: "Cuore, vasi e circolazione",
    emoji: "❤️",
    questions: [
      {
        id: "car-1",
        type: "multiple",
        prompt: "Quante camere ha il cuore umano?",
        options: ["2", "3", "4", "5"],
        correctIndex: 2,
        explanation:
          "Il cuore ha 4 camere: due atri (destro e sinistro) e due ventricoli. Il [[miocardio]] separa la parte destra dalla sinistra.",
      },
      {
        id: "car-2",
        type: "truefalse",
        prompt: "La [[valvola mitrale]] si trova tra atrio e ventricolo destri.",
        answer: false,
        explanation:
          "Falso: la [[valvola mitrale]] è a sinistra. A destra c'è la valvola tricuspide.",
      },
      {
        id: "car-3",
        type: "multiple",
        prompt: "Durante la [[sistole]] ventricolare:",
        options: [
          "I ventricoli si rilassano e si riempiono",
          "I ventricoli si contraggono ed espellono sangue",
          "Gli atri si contraggono",
          "Le valvole semilunari si chiudono",
        ],
        correctIndex: 1,
        explanation:
          "La [[sistole]] è la fase di contrazione: i ventricoli espellono il sangue verso aorta e arteria polmonare. La [[diastole]] è il rilassamento.",
      },
      {
        id: "car-4",
        type: "clinical",
        scenario: "Uomo di 58 anni, dolore retrosternale irradiato al braccio sinistro, sudorazione e nausea da 30 minuti.",
        prompt: "Sospetto clinico principale?",
        options: ["Pericardite acuta", "Infarto miocardico acuto", "Reflusso gastroesofageo", "Embolia polmonare"],
        correctIndex: 1,
        explanation:
          "Il quadro è tipico di un infarto miocardico acuto: occlusione coronarica che causa ischemia del [[miocardio]].",
      },
      {
        id: "car-5",
        type: "multiple",
        prompt: "L'arteria coronaria sinistra si divide in:",
        options: [
          "Circonflessa e discendente anteriore",
          "Marginale e posteriore",
          "Aorta e polmonare",
          "Cava e azygos",
        ],
        correctIndex: 0,
        explanation:
          "Il tronco comune sinistro si biforca in arteria discendente anteriore (IVA/LAD) e circonflessa.",
      },
    ],
    flashcards: [
      { front: "Valvole semilunari?", back: "Aortica (tra ventricolo sx e aorta) e polmonare (tra ventricolo dx e arteria polmonare)." },
      { front: "Pacemaker fisiologico del cuore?", back: "Nodo seno-atriale (NSA) nell'atrio destro." },
      { front: "Gittata cardiaca normale a riposo?", back: "Circa 5 L/min (70 ml × 70 bpm)." },
    ],
  },
  {
    id: "respiratorio",
    title: "Apparato Respiratorio",
    subtitle: "Vie aeree e polmoni",
    emoji: "🫁",
    questions: [
      {
        id: "res-1",
        type: "multiple",
        prompt: "Dove avviene lo scambio di gas O₂/CO₂?",
        options: ["Bronchi principali", "Trachea", "[[Alveoli]] polmonari", "Laringe"],
        correctIndex: 2,
        explanation:
          "Negli [[alveoli]] avviene la diffusione passiva dei gas attraverso la membrana alveolo-capillare.",
      },
      {
        id: "res-2",
        type: "truefalse",
        prompt: "Il polmone destro ha 3 lobi, il sinistro 2.",
        answer: true,
        explanation:
          "Vero: il polmone sinistro è più piccolo per fare spazio al cuore (incisura cardiaca).",
      },
      {
        id: "res-3",
        type: "multiple",
        prompt: "La [[pleura]] viscerale:",
        options: [
          "Riveste la parete toracica",
          "Riveste direttamente la superficie polmonare",
          "Si trova nel mediastino",
          "È parte del pericardio",
        ],
        correctIndex: 1,
        explanation:
          "La [[pleura]] viscerale aderisce al polmone; quella parietale alla parete toracica. Tra le due, lo spazio pleurico.",
      },
      {
        id: "res-4",
        type: "clinical",
        scenario: "Giovane longilineo, dolore toracico improvviso e dispnea dopo colpo di tosse. MV ridotto a destra.",
        prompt: "Diagnosi più probabile?",
        options: ["Polmonite lobare", "Pneumotorace spontaneo", "Asma acuto", "Embolia polmonare"],
        correctIndex: 1,
        explanation:
          "Quadro classico di pneumotorace spontaneo: rottura di una bolla subpleurica con ingresso di aria nello spazio pleurico.",
      },
      {
        id: "res-5",
        type: "multiple",
        prompt: "Il principale muscolo dell'inspirazione è:",
        options: ["Intercostali interni", "Diaframma", "Sternocleidomastoideo", "Retto dell'addome"],
        correctIndex: 1,
        explanation:
          "Il diaframma contraendosi si abbassa e aumenta il volume toracico, generando pressione negativa.",
      },
    ],
    flashcards: [
      { front: "Numero di lobi polmonari totali?", back: "5 (3 a destra, 2 a sinistra)." },
      { front: "Cos'è il surfattante?", back: "Sostanza tensioattiva prodotta dagli pneumociti tipo II, riduce la tensione superficiale alveolare." },
    ],
  },
  {
    id: "nervoso",
    title: "Sistema Nervoso",
    subtitle: "Cervello, midollo e nervi",
    emoji: "🧠",
    questions: [
      {
        id: "ner-1",
        type: "multiple",
        prompt: "L'unità funzionale del sistema nervoso è:",
        options: ["Astrocita", "[[Neurone]]", "Oligodendrocita", "Microglia"],
        correctIndex: 1,
        explanation:
          "Il [[neurone]] è la cellula eccitabile che genera e trasmette impulsi tramite [[sinapsi]].",
      },
      {
        id: "ner-2",
        type: "truefalse",
        prompt: "Il cervelletto è responsabile della coordinazione motoria e dell'equilibrio.",
        answer: true,
        explanation:
          "Vero: lesioni cerebellari causano atassia, dismetria e disturbi dell'equilibrio.",
      },
      {
        id: "ner-3",
        type: "multiple",
        prompt: "Quanti nervi cranici esistono?",
        options: ["10 paia", "12 paia", "14 paia", "8 paia"],
        correctIndex: 1,
        explanation:
          "12 paia di nervi cranici, numerati con numeri romani da I (olfattivo) a XII (ipoglosso).",
      },
      {
        id: "ner-4",
        type: "clinical",
        scenario: "Donna 70 anni: improvvisa emiparesi destra e afasia. Esordio 1 ora fa.",
        prompt: "Quale arteria è più probabilmente coinvolta?",
        options: ["Cerebrale anteriore destra", "Cerebrale media sinistra", "Cerebrale posteriore destra", "Basilare"],
        correctIndex: 1,
        explanation:
          "L'arteria cerebrale media sinistra irrora le aree motorie e del linguaggio (Broca/Wernicke) dominanti.",
      },
      {
        id: "ner-5",
        type: "multiple",
        prompt: "I principali neurotrasmettitori inibitori del SNC sono:",
        options: ["Glutammato e aspartato", "GABA e glicina", "Dopamina e serotonina", "Acetilcolina"],
        correctIndex: 1,
        explanation:
          "GABA (encefalo) e glicina (midollo) sono i principali NT inibitori; le [[sinapsi]] glutammatergiche sono invece eccitatorie.",
      },
    ],
    flashcards: [
      { front: "Aree del linguaggio?", back: "Broca (produzione, frontale) e Wernicke (comprensione, temporale)." },
      { front: "Substantia nigra: funzione?", back: "Produce dopamina; sua degenerazione causa Parkinson." },
    ],
  },
  {
    id: "digerente",
    title: "Apparato Digerente",
    subtitle: "Dal cavo orale all'intestino",
    emoji: "🍽️",
    questions: [
      {
        id: "dig-1",
        type: "multiple",
        prompt: "Il movimento che spinge il bolo lungo l'esofago si chiama:",
        options: ["Segmentazione", "[[Peristalsi]]", "Mescolamento", "Eruttazione"],
        correctIndex: 1,
        explanation:
          "La [[peristalsi]] è una contrazione propulsiva coordinata dei muscoli lisci del tubo digerente.",
      },
      {
        id: "dig-2",
        type: "truefalse",
        prompt: "Il fegato produce la bile.",
        answer: true,
        explanation:
          "Vero: la bile è prodotta dagli epatociti, conservata nella cistifellea e rilasciata nel duodeno per emulsionare i grassi.",
      },
      {
        id: "dig-3",
        type: "multiple",
        prompt: "Quale tratto dell'intestino tenue assorbe maggior parte dei nutrienti?",
        options: ["Duodeno", "Digiuno", "Ileo", "Cieco"],
        correctIndex: 1,
        explanation:
          "Il digiuno è il tratto principale per l'assorbimento dei nutrienti grazie ai villi e microvilli.",
      },
      {
        id: "dig-4",
        type: "clinical",
        scenario: "Paziente con dolore in fossa iliaca destra, febbre, Blumberg positivo.",
        prompt: "Sospetto clinico?",
        options: ["Colecistite", "Appendicite acuta", "Diverticolite sigmoidea", "Pancreatite"],
        correctIndex: 1,
        explanation:
          "Quadro tipico di appendicite acuta: il punto di McBurney è dolente, segno di Blumberg positivo per irritazione peritoneale.",
      },
      {
        id: "dig-5",
        type: "multiple",
        prompt: "Lo stomaco produce HCl tramite le cellule:",
        options: ["Principali", "Parietali (ossintiche)", "Mucose", "G"],
        correctIndex: 1,
        explanation:
          "Le cellule parietali secernono HCl e fattore intrinseco; le principali producono pepsinogeno.",
      },
    ],
    flashcards: [
      { front: "Tre porzioni del duodeno", back: "Superiore, discendente, orizzontale e ascendente (in realtà 4)." },
      { front: "Funzione del fattore intrinseco?", back: "Permette l'assorbimento della vitamina B12 nell'ileo terminale." },
    ],
  },
  {
    id: "urinario",
    title: "Apparato Urinario",
    subtitle: "Reni e vie urinarie",
    emoji: "💧",
    questions: [
      {
        id: "uri-1",
        type: "multiple",
        prompt: "L'unità funzionale del rene è:",
        options: ["Glomerulo", "[[Nefrone]]", "Tubulo distale", "Ansa di Henle"],
        correctIndex: 1,
        explanation:
          "Il [[nefrone]] comprende glomerulo + sistema tubulare. Ogni rene ne contiene circa 1 milione.",
      },
      {
        id: "uri-2",
        type: "truefalse",
        prompt: "Il [[surrene]] fa parte dell'apparato urinario.",
        answer: false,
        explanation:
          "Falso: il [[surrene]] è solo anatomicamente vicino al rene ma è una ghiandola endocrina indipendente.",
      },
      {
        id: "uri-3",
        type: "multiple",
        prompt: "La filtrazione glomerulare avviene in:",
        options: ["Tubulo prossimale", "Capsula di Bowman", "Ansa di Henle", "Dotto collettore"],
        correctIndex: 1,
        explanation:
          "Il glomerulo filtra il plasma nella capsula di Bowman; il filtrato passa poi nel tubulo prossimale.",
      },
      {
        id: "uri-4",
        type: "clinical",
        scenario: "Uomo di 45 anni: colica renale acuta lombare con irradiazione all'inguine, ematuria.",
        prompt: "Diagnosi più probabile?",
        options: ["Pielonefrite", "Calcolosi ureterale", "Glomerulonefrite", "Cistite"],
        correctIndex: 1,
        explanation:
          "Il dolore colico lombo-inguinale con ematuria è tipico della colica renale da calcolo ureterale.",
      },
      {
        id: "uri-5",
        type: "multiple",
        prompt: "L'ormone antidiuretico (ADH) agisce su:",
        options: ["Glomerulo", "Tubulo prossimale", "Dotto collettore", "Vescica"],
        correctIndex: 2,
        explanation:
          "L'ADH aumenta la permeabilità del dotto collettore all'acqua, concentrando le urine.",
      },
    ],
    flashcards: [
      { front: "Capacità vescicale media?", back: "Circa 400-500 ml." },
      { front: "Cosa attiva il sistema renina-angiotensina?", back: "Ipoperfusione renale e ipovolemia." },
    ],
  },
];

// Simulated leaderboard for the same faculty
export const LEADERBOARD = [
  { name: "Giulia M.", xp: 1240, avatar: "👩‍⚕️" },
  { name: "Marco T.", xp: 1180, avatar: "🧑‍⚕️" },
  { name: "Sara R.", xp: 1050, avatar: "👩🏽‍⚕️" },
  { name: "Luca B.", xp: 980, avatar: "🧑🏻‍⚕️" },
  { name: "Elena P.", xp: 870, avatar: "👩🏼‍⚕️" },
  { name: "Davide L.", xp: 720, avatar: "🧑🏽‍⚕️" },
  { name: "Chiara F.", xp: 640, avatar: "👩🏻‍⚕️" },
  { name: "Andrea V.", xp: 510, avatar: "🧑🏼‍⚕️" },
  { name: "Federica S.", xp: 410, avatar: "👩🏾‍⚕️" },
  { name: "Riccardo N.", xp: 320, avatar: "🧑🏾‍⚕️" },
];

export function findGlossary(term: string): GlossaryEntry | undefined {
  const t = term.trim().toLowerCase();
  return GLOSSARY.find((g) => g.term.toLowerCase() === t);
}

export function findQuestion(qid: string): { node: Node; question: Question } | undefined {
  for (const node of NODES) {
    const q = node.questions.find((q) => q.id === qid);
    if (q) return { node, question: q };
  }
  return undefined;
}
