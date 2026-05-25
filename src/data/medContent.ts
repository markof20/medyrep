// MedRep — data module
// Question pools per node are loaded from src/data/nodes/*.ts

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

export type Node = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  questions: Question[];
  flashcards: Flashcard[];
};

export type Subject = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  faculty: string;
  gradient: string; // tailwind gradient classes for the header card
  accent: string; // tailwind color class for accents
  nodeIds: string[];
  comingSoon?: boolean;
};

// Kept for backward compatibility (used by Leaderboard header).
export const SUBJECT = {
  id: "medrep",
  name: "MedRep",
  faculty: "Medicina e Chirurgia",
};

export const GLOSSARY: GlossaryEntry[] = [
  { term: "miocardio", definition: "Tessuto muscolare striato del cuore, responsabile della contrazione cardiaca." },
  { term: "diafisi", definition: "Porzione centrale e allungata di un osso lungo." },
  { term: "epifisi", definition: "Estremità di un osso lungo, generalmente articolare." },
  { term: "alveoli", definition: "Piccole sacche polmonari dove avviene lo scambio di gas O₂/CO₂." },
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

// Node pools.
import { locomotore } from "./nodes/locomotore";
import { cardio } from "./nodes/cardio";
import { respiratorio } from "./nodes/respiratorio";
import { nervoso } from "./nodes/nervoso";
import { digerente } from "./nodes/digerente";
import { urinario } from "./nodes/urinario";
import { fisioCardio } from "./nodes/fisio-cardio";
import { fisioResp } from "./nodes/fisio-resp";
import { bioMetab } from "./nodes/bio-metab";
import { bioEnzimi } from "./nodes/bio-enzimi";

export const NODES: Node[] = [
  locomotore, cardio, respiratorio, nervoso, digerente, urinario,
  fisioCardio, fisioResp,
  bioMetab, bioEnzimi,
];

export const SUBJECTS: Subject[] = [
  {
    id: "anatomia",
    name: "Anatomia Umana",
    emoji: "🫀",
    description: "Apparati e sistemi del corpo umano",
    faculty: "Medicina e Chirurgia",
    gradient: "from-primary to-primary/70",
    accent: "text-primary",
    nodeIds: ["locomotore", "cardio", "respiratorio", "nervoso", "digerente", "urinario"],
  },
  {
    id: "fisiologia",
    name: "Fisiologia",
    emoji: "⚙️",
    description: "Funzioni e regolazione dei sistemi",
    faculty: "Medicina e Chirurgia",
    gradient: "from-success to-success/70",
    accent: "text-success",
    nodeIds: ["fisio-cardio", "fisio-resp"],
  },
  {
    id: "biochimica",
    name: "Biochimica",
    emoji: "🧪",
    description: "Metabolismo, enzimi e biomolecole",
    faculty: "Medicina e Chirurgia",
    gradient: "from-warning to-warning/70",
    accent: "text-warning-foreground",
    nodeIds: ["bio-metab", "bio-enzimi"],
  },
  {
    id: "istologia",
    name: "Istologia",
    emoji: "🔬",
    description: "Tessuti e microscopia",
    faculty: "Medicina e Chirurgia",
    gradient: "from-accent to-accent/70",
    accent: "text-accent-foreground",
    nodeIds: [],
    comingSoon: true,
  },
  {
    id: "farmacologia",
    name: "Farmacologia",
    emoji: "💊",
    description: "Farmaci, meccanismi e dosaggi",
    faculty: "Medicina e Chirurgia",
    gradient: "from-destructive to-destructive/70",
    accent: "text-destructive",
    nodeIds: [],
    comingSoon: true,
  },
];

export const REQUIRED_RUNS = 3;
export const SESSION_SIZE = 15;

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
    const q = node.questions.find((q) => q.id === qid);
    if (q) return { node, question: q };
  }
  return undefined;
}

export function getNodesForSubject(subjectId: string): Node[] {
  const s = SUBJECTS.find((x) => x.id === subjectId);
  if (!s) return [];
  return s.nodeIds.map((id) => NODES.find((n) => n.id === id)).filter(Boolean) as Node[];
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

export function pickSessionQuestions(
  nodeId: string,
  alreadyCorrectIds: string[],
  size: number = SESSION_SIZE,
): Question[] {
  const node = NODES.find((n) => n.id === nodeId);
  if (!node) return [];
  const excluded = new Set(alreadyCorrectIds);
  const fresh = node.questions.filter((q) => !excluded.has(q.id));
  const picked = shuffle(fresh).slice(0, size);
  if (picked.length < size) {
    const fillers = shuffle(node.questions.filter((q) => excluded.has(q.id))).slice(
      0,
      size - picked.length,
    );
    picked.push(...fillers);
  }
  return picked;
}
