// Programmatic question generator.
// For every (subject, node, level) tuple it produces 15 questions:
// 6 multiple choice, 3 cloze, 3 true/false, 3 clinical.
// The wording references the node title + facet so each level feels
// contextual even though phrasings come from a shared template bank.

import type { Node, Question, Level, Flashcard } from "./medContent";
import type { CurriculumSubject, CurriculumNode } from "./curriculum";

type Ctx = {
  subject: string; // subject display name
  node: string; // node title
  facet: string; // level facet
  nodeId: string;
  levelId: string;
};

function qid(ctx: Ctx, n: number): string {
  return `${ctx.nodeId}__${ctx.levelId}__q${n}`;
}

// Six multiple-choice templates.
const MC: Array<(ctx: Ctx) => { prompt: string; options: string[]; correctIndex: number; explanation: string }> = [
  (c) => ({
    prompt: `In riferimento a ${c.node}, quale affermazione descrive meglio l'aspetto «${c.facet}»?`,
    options: [
      `È un argomento fondamentale di ${c.subject}, indispensabile per la pratica clinica.`,
      `Riguarda esclusivamente la sfera psicologica e non quella biologica.`,
      `Non viene affrontato nei programmi di ${c.subject}.`,
      `È un tema marginale, di interesse puramente storico.`,
    ],
    correctIndex: 0,
    explanation: `«${c.facet}» applicato a ${c.node} è uno degli ambiti centrali di ${c.subject}: padroneggiarlo è prerequisito per ragionamento clinico e quiz d'esame.`,
  }),
  (c) => ({
    prompt: `Quale opzione NON è pertinente allo studio di ${c.node} sotto il profilo «${c.facet}»?`,
    options: [
      `L'analisi delle proprietà di una stella nana bianca`,
      `L'organizzazione strutturale o funzionale di ${c.node}`,
      `Le correlazioni con altre branche della ${c.subject}`,
      `Le implicazioni semeiotiche o terapeutiche`,
    ],
    correctIndex: 0,
    explanation: `L'astrofisica delle stelle nane non rientra nello studio di ${c.node}; gli altri item appartengono al programma di ${c.subject}.`,
  }),
  (c) => ({
    prompt: `Studiando ${c.node} con focus su «${c.facet}», quale strategia di approccio è più efficace?`,
    options: [
      `Integrare nozioni teoriche con casi clinici e immagini`,
      `Memorizzare solo elenchi senza contesto`,
      `Saltare gli aspetti pratici e clinici`,
      `Ridurre lo studio alla sola etimologia dei termini`,
    ],
    correctIndex: 0,
    explanation: `Lo studio efficace di ${c.node} richiede integrazione teoria-clinica: le mappe concettuali e i casi reali consolidano la memoria a lungo termine.`,
  }),
  (c) => ({
    prompt: `Quale categoria di concetti è centrale per «${c.facet}» di ${c.node}?`,
    options: [
      `Termini specifici, relazioni strutturali e meccanismi`,
      `Solo date di scoperta storica`,
      `Esclusivamente codici amministrativi`,
      `Nomi di città italiane`,
    ],
    correctIndex: 0,
    explanation: `Per ${c.facet} di ${c.node} servono lessico tecnico, relazioni topografiche/funzionali e meccanismi causali.`,
  }),
  (c) => ({
    prompt: `Quale collegamento è più appropriato tra ${c.node} e «${c.facet}»?`,
    options: [
      `${c.facet} chiarisce come ${c.node} funzioni o si organizzi nell'organismo`,
      `${c.facet} è un sinonimo di ${c.node}`,
      `${c.facet} esclude lo studio di ${c.node}`,
      `${c.facet} appartiene a un'altra disciplina priva di legami`,
    ],
    correctIndex: 0,
    explanation: `${c.facet} è una delle chiavi di lettura attraverso cui ${c.subject} descrive ${c.node}.`,
  }),
  (c) => ({
    prompt: `Quale tra le seguenti è una corretta priorità di studio per «${c.facet}» di ${c.node}?`,
    options: [
      `Definizioni → meccanismi → applicazioni cliniche`,
      `Saltare le definizioni e partire dai casi rari`,
      `Limitarsi alla nomenclatura latina arcaica`,
      `Studiare solo l'iconografia senza testi`,
    ],
    correctIndex: 0,
    explanation: `La sequenza definizioni → meccanismi → applicazioni è la più efficace anche in ${c.subject}.`,
  }),
];

// Three cloze templates (the option labelled correctIndex completes the sentence).
const CL: Array<(ctx: Ctx) => { prompt: string; options: string[]; correctIndex: number; explanation: string }> = [
  (c) => ({
    prompt: `${c.node} viene approfondito in ${c.subject} soprattutto attraverso lo studio di ___.`,
    options: [c.facet, "geometria proiettiva", "letteratura medievale", "diritto romano"],
    correctIndex: 0,
    explanation: `${c.facet} è proprio uno dei capitoli con cui si affronta ${c.node}.`,
  }),
  (c) => ({
    prompt: `La disciplina che studia ${c.node} sotto il profilo di ${c.facet} è la ___.`,
    options: [c.subject, "filologia", "musicologia", "criptografia"],
    correctIndex: 0,
    explanation: `${c.subject} è la materia di riferimento per ${c.node}.`,
  }),
  (c) => ({
    prompt: `Un esame di ${c.subject} valuta tipicamente, su ${c.node}, la conoscenza di ___.`,
    options: [`${c.facet}`, "linguistica generale", "design industriale", "diritto canonico"],
    correctIndex: 0,
    explanation: `${c.facet} è argomento ricorrente nelle prove d'esame di ${c.subject} relative a ${c.node}.`,
  }),
];

// Three true/false templates (mix true and false).
const TF: Array<(ctx: Ctx) => { prompt: string; answer: boolean; explanation: string }> = [
  (c) => ({
    prompt: `${c.facet} è uno degli argomenti centrali nello studio di ${c.node} in ${c.subject}.`,
    answer: true,
    explanation: `Vero: ${c.facet} è parte integrante del capitolo dedicato a ${c.node}.`,
  }),
  (c) => ({
    prompt: `Lo studio di ${c.node} prescinde completamente da considerazioni di ${c.facet}.`,
    answer: false,
    explanation: `Falso: senza ${c.facet} la comprensione di ${c.node} resta incompleta.`,
  }),
  (c) => ({
    prompt: `Le nozioni di ${c.facet} relative a ${c.node} hanno ricadute clinico-pratiche utili anche al medico generale.`,
    answer: true,
    explanation: `Vero: la ${c.subject} fornisce le basi indispensabili per la valutazione clinica.`,
  }),
];

// Three clinical templates.
const CLI: Array<(ctx: Ctx) => { scenario: string; prompt: string; options: string[]; correctIndex: number; explanation: string }> = [
  (c) => ({
    scenario: `Uno studente del 3° anno deve preparare una relazione sintetica su ${c.node}. Il docente chiede di evidenziare l'aspetto «${c.facet}».`,
    prompt: `Quale impostazione è più corretta?`,
    options: [
      `Descrivere ${c.facet} di ${c.node} integrando teoria e implicazioni cliniche`,
      `Elencare solo i nomi propri senza contesto`,
      `Trattare un argomento di un'altra disciplina`,
      `Riportare aneddoti personali non documentati`,
    ],
    correctIndex: 0,
    explanation: `Una buona relazione integra ${c.facet} con la clinica: è ciò che ${c.subject} richiede.`,
  }),
  (c) => ({
    scenario: `Un paziente pone una domanda relativa a ${c.node}. Per rispondere correttamente è utile padroneggiare anche ${c.facet}.`,
    prompt: `Quale comportamento è appropriato?`,
    options: [
      `Spiegare in modo semplice, basandosi su nozioni di ${c.subject}`,
      `Improvvisare risposte non basate su evidenze`,
      `Rifiutarsi di rispondere senza motivo`,
      `Cambiare argomento senza fornire informazioni`,
    ],
    correctIndex: 0,
    explanation: `Comunicare in modo chiaro, ancorato a ${c.subject}, è una competenza clinica fondamentale.`,
  }),
  (c) => ({
    scenario: `In sede d'esame viene chiesto di collegare ${c.node} ad altri capitoli di ${c.subject}.`,
    prompt: `Come si costruisce un collegamento solido partendo da «${c.facet}»?`,
    options: [
      `Mostrando relazioni concettuali (struttura, funzione, regolazione, clinica)`,
      `Citando solo curiosità non pertinenti`,
      `Inventando connessioni non documentate`,
      `Evitando ogni riferimento ad altri argomenti`,
    ],
    correctIndex: 0,
    explanation: `I collegamenti forti partono da meccanismi condivisi: ${c.facet} è una buona porta d'ingresso.`,
  }),
];

function buildLevelQuestions(ctx: Ctx): Question[] {
  const out: Question[] = [];
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

function buildFlashcards(node: CurriculumNode, facets: string[]): Flashcard[] {
  return facets.map((f, i) => ({
    id: `${node.id}-fc-${i + 1}`,
    front: `${node.title}: aspetto chiave di «${f}»?`,
    back: `${f} è uno dei cinque livelli del nodo ${node.title}: studiane definizioni, meccanismi e ricadute cliniche.`,
  }));
}

export function buildNodes(subject: CurriculumSubject): Node[] {
  return subject.nodes.map((nd) => {
    const levels: Level[] = subject.facets.map((facet, idx) => {
      const levelId = `L${idx + 1}`;
      const ctx: Ctx = {
        subject: subject.name,
        node: nd.title,
        facet,
        nodeId: nd.id,
        levelId,
      };
      return {
        id: levelId,
        title: facet,
        subtitle: `${nd.title} · livello ${idx + 1}`,
        questions: buildLevelQuestions(ctx),
      };
    });
    return {
      id: nd.id,
      title: nd.title,
      subtitle: nd.subtitle,
      emoji: nd.emoji,
      levels,
      flashcards: buildFlashcards(nd, subject.facets),
      kind: "standard" as const,
    };
  });
}

// ---------- Review node ----------

function seedFromString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const REVIEW_QUESTION_COUNT = 15;

export function buildReviewNode(
  subject: CurriculumSubject,
  reviewIndex: number,
  sourceNodes: Node[],
): Node {
  const id = `${subject.id}-rev-${reviewIndex}`;
  const levelId = "R1";
  const rng = mulberry32(seedFromString(id));
  // Flatten all questions from source nodes (all levels).
  const pool: Question[] = sourceNodes.flatMap((n) => n.levels.flatMap((l) => l.questions));
  // Fisher–Yates with seeded RNG.
  const arr = pool.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const picked = arr.slice(0, Math.min(REVIEW_QUESTION_COUNT, arr.length)).map((q, i) => ({
    ...q,
    id: `${id}__${levelId}__rq${i + 1}`,
  })) as Question[];

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
        questions: picked,
      },
    ],
  };
}

