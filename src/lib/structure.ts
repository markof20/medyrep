import { type Level, type Node, isReviewNode } from "@/data/medContent";
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

/**
 * Ogni esame standard viene esposto come 4 moduli indipendenti ("percorsi
 * separati"): scegliere di studiare il modulo 3 non richiede aver finito
 * il modulo 1. I nodi di ripasso hanno un solo livello e restano un unico
 * "modulo" che coincide con l'esame stesso.
 */
const MODULE_SIZES = [3, 3, 2, 2];

export function getModules(node: Node): ModuleGroup[] {
  if (isReviewNode(node)) {
    return [{ index: 0, title: node.title, subtitle: node.subtitle, levels: node.levels }];
  }
  const groups: ModuleGroup[] = [];
  let offset = 0;
  MODULE_SIZES.forEach((size, i) => {
    const levels = node.levels.slice(offset, offset + size);
    groups.push({
      index: i,
      title: `Modulo ${i + 1}`,
      subtitle: levels.map((l) => l.title).join(" · "),
      levels,
    });
    offset += size;
  });
  return groups;
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
