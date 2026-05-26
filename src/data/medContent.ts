// MedRep — data module
// Subjects, nodes, and per-level question pools are produced by the
// programmatic generator in ./generator.ts so the size of this file stays
// manageable (5 subjects × 20 nodes × 5 levels × 15 questions = 7 500 quizzes).

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
  { term: "miocardio", definition: "Tessuto muscolare striato del cuore, responsabile della contrazione cardiaca." },
  { term: "alveoli", definition: "Piccole sacche polmonari dove avviene lo scambio di gas O₂/CO₂." },
  { term: "sistole", definition: "Fase di contrazione del cuore durante il ciclo cardiaco." },
  { term: "diastole", definition: "Fase di rilassamento del cuore durante il ciclo cardiaco." },
  { term: "neurone", definition: "Cellula eccitabile del sistema nervoso, unità funzionale del cervello." },
  { term: "sinapsi", definition: "Zona di contatto funzionale tra due neuroni o tra neurone ed effettore." },
  { term: "nefrone", definition: "Unità funzionale del rene, composta da glomerulo e tubulo." },
];

import { CURRICULUM } from "./curriculum";
import { buildNodes } from "./generator";

const FACULTY = "Medicina e Chirurgia";

const builtNodes: Node[] = CURRICULUM.flatMap((s) => buildNodes(s));

export const NODES: Node[] = builtNodes;

export const SUBJECTS: Subject[] = CURRICULUM.map((s) => ({
  id: s.id,
  name: s.name,
  emoji: s.emoji,
  description: s.description,
  faculty: FACULTY,
  gradient: s.gradient,
  accent: s.accent,
  nodeIds: s.nodes.map((n) => n.id),
}));

export const LEVELS_PER_NODE = 5;
export const QUESTIONS_PER_LEVEL = 15;
export const SESSION_SIZE = QUESTIONS_PER_LEVEL;

// Simulated leaderboard (global XP across all subjects).
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
    for (const lvl of node.levels) {
      const q = lvl.questions.find((q) => q.id === qid);
      if (q) return { node, question: q };
    }
  }
  return undefined;
}

export function getNodesForSubject(subjectId: string): Node[] {
  const s = SUBJECTS.find((x) => x.id === subjectId);
  if (!s) return [];
  return s.nodeIds.map((id) => NODES.find((n) => n.id === id)).filter(Boolean) as Node[];
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
