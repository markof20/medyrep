// MedRep — data module
// Subjects, nodes, and per-level question pools are produced by the
// programmatic generator in ./generator.ts so the size of this file stays
// manageable (6 anni × 15 ambiti × 10 livelli × 15 domande = 13 500 quiz).

export type GlossaryEntry = { term: string; definition: string };

export type Question =
  | {
      id: string;
      type: "multiple";
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  | {
      id: string;
      type: "cloze";
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
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

export type Level = {
  id: string;
  title: string;
  subtitle: string;
  questions: Question[];
};

export type Node = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  levels: Level[];
  flashcards: Flashcard[];
  kind?: "standard" | "review";
  sourceNodeIds?: string[];
};

export type Subject = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  faculty: string;
  gradient: string;
  accent: string;
  nodeIds: string[];
};

export const SUBJECT = {
  id: "medrep",
  name: "MedRep",
  faculty: "Medicina e Chirurgia",
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "miocardio",
    definition: "Tessuto muscolare striato del cuore, responsabile della contrazione cardiaca.",
  },
  {
    term: "alveoli",
    definition: "Piccole sacche polmonari dove avviene lo scambio di gas O₂/CO₂.",
  },
  { term: "sistole", definition: "Fase di contrazione del cuore durante il ciclo cardiaco." },
  { term: "diastole", definition: "Fase di rilassamento del cuore durante il ciclo cardiaco." },
  {
    term: "neurone",
    definition: "Cellula eccitabile del sistema nervoso, unità funzionale del cervello.",
  },
  {
    term: "sinapsi",
    definition: "Zona di contatto funzionale tra due neuroni o tra neurone ed effettore.",
  },
  { term: "nefrone", definition: "Unità funzionale del rene, composta da glomerulo e tubulo." },
];

import { CURRICULUM } from "./curriculum";
import { buildNodes } from "./generator";

const FACULTY = "Medicina e Chirurgia";

// Nodi di ripasso disattivati per ora: verranno reintrodotti in un secondo
// momento all'interno dei singoli moduli invece che come nodi a sé stanti
// (cfr. buildReviewNode in generator.ts, ancora disponibile per quel riuso).
const built = CURRICULUM.map((s) => ({ subject: s, nodes: buildNodes(s) }));

export const NODES: Node[] = built.flatMap((x) => x.nodes);

export const SUBJECTS: Subject[] = built.map(({ subject: s, nodes }) => ({
  id: s.id,
  name: s.name,
  emoji: s.emoji,
  description: s.description,
  faculty: FACULTY,
  gradient: s.gradient,
  accent: s.accent,
  nodeIds: nodes.map((n) => n.id),
}));

export const LEVELS_PER_NODE = 10;
export const QUESTIONS_PER_LEVEL = 15;
export const SESSION_SIZE = QUESTIONS_PER_LEVEL;

export function isReviewNode(node: Node): boolean {
  return node.kind === "review";
}

export function getNodeLevelCount(node: Node): number {
  return node.levels.length;
}

export function findGlossary(term: string): GlossaryEntry | undefined {
  const t = term.trim().toLowerCase();
  return GLOSSARY.find((g) => g.term.toLowerCase() === t);
}

export function findQuestion(qid: string): { node: Node; question: Question } | undefined {
  for (const node of NODES) {
    for (const lvl of node.levels) {
      const q = lvl.questions.find((q) => q.id === qid);
      if (q) return { node, question: q };
    }
  }
  return undefined;
}

export function getNodeById(nodeId: string): Node | undefined {
  return NODES.find((n) => n.id === nodeId);
}

export function getLevel(nodeId: string, levelId: string): Level | undefined {
  return getNodeById(nodeId)?.levels.find((l) => l.id === levelId);
}

export function getSubjectByNodeId(nodeId: string): Subject | undefined {
  return SUBJECTS.find((s) => s.nodeIds.includes(nodeId));
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickLevelQuestions(nodeId: string, levelId: string): Question[] {
  const lvl = getLevel(nodeId, levelId);
  if (!lvl) return [];
  return shuffle(lvl.questions).slice(0, QUESTIONS_PER_LEVEL);
}
