import { type Level, type Node, isReviewNode } from "@/data/medContent";
import { EXAM_MODULES } from "@/data/examModules";
import { type MedState, isLevelCompleted } from "@/lib/medStore";

/**
 * Layer di navigazione puramente derivato: l'università non impone di dare
 * un esame prima di un altro, quindi non esiste alcun gating qui sopra —
 * solo raggruppamenti (modulo) calcolati dai dati già generati.
 */

export type ModuleGroup = {
  index: number;
  title: string;
  subtitle: string;
  levels: Level[];
};

// Fallback usato solo se un nodo standard non ha una voce in EXAM_MODULES
// (non dovrebbe accadere: tutti i 36 esami del piano di studi sono mappati).
const DEFAULT_MODULE_NAMES = ["Modulo 1", "Modulo 2", "Modulo 3", "Modulo 4"];

/** Ripartisce i livelli tra `count` moduli nel modo più equo possibile. */
function distributeLevels(levels: Level[], count: number): Level[][] {
  const base = Math.floor(levels.length / count);
  const extra = levels.length % count;
  const groups: Level[][] = [];
  let offset = 0;
  for (let i = 0; i < count; i++) {
    const size = base + (i < extra ? 1 : 0);
    groups.push(levels.slice(offset, offset + size));
    offset += size;
  }
  return groups;
}

/**
 * Ogni esame standard viene esposto con gli stessi moduli del piano di studi
 * ufficiale (cfr. EXAM_MODULES): scegliere di studiare un modulo non richiede
 * aver finito i precedenti — sono percorsi indipendenti. I nodi di ripasso
 * hanno un solo livello e restano un unico "modulo" che coincide con l'esame
 * stesso.
 */
export function getModules(node: Node): ModuleGroup[] {
  if (isReviewNode(node)) {
    return [{ index: 0, title: node.title, subtitle: node.subtitle, levels: node.levels }];
  }
  const names = EXAM_MODULES[node.id] ?? DEFAULT_MODULE_NAMES;
  return distributeLevels(node.levels, names.length).map((levels, i) => ({
    index: i,
    title: names[i],
    subtitle: levels.map((l) => l.title).join(" · "),
    levels,
  }));
}

export function getModule(node: Node, moduleIndex: number): ModuleGroup | undefined {
  return getModules(node)[moduleIndex];
}

export function getModuleIndexForLevel(node: Node, levelId: string): number {
  const idx = getModules(node).findIndex((g) => g.levels.some((l) => l.id === levelId));
  return idx < 0 ? 0 : idx;
}

export function getModuleProgress(
  state: MedState,
  node: Node,
  moduleIndex: number,
): { done: number; total: number; pct: number } {
  const group = getModule(node, moduleIndex);
  if (!group) return { done: 0, total: 0, pct: 0 };
  const done = group.levels.filter((l) => isLevelCompleted(state, node.id, l.id)).length;
  return { done, total: group.levels.length, pct: Math.round((done / group.levels.length) * 100) };
}
