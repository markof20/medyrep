import { useEffect, useState, useCallback } from "react";
import { LEVELS_PER_NODE, getNodeById } from "@/data/medContent";

const KEY = "medrep:state:v3";
const MAX_LIVES = 5;
const LIFE_REGEN_MS = 30 * 60 * 1000;

export type NodeProgress = {
  completedLevels: string[]; // ids of completed levels (e.g. ["L1","L2"])
  correctIds: string[]; // question ids answered correctly (for review)
};

export type MedState = {
  xp: number;
  weeklyXp: number;
  weekStart: number;
  lives: number;
  lastLifeLossAt: number | null;
  streak: number;
  lastStudyDay: string | null;
  nodeProgress: Record<string, NodeProgress>;
  mistakes: string[];
};

function getMonday(d = new Date()): number {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultState(): MedState {
  return {
    xp: 0,
    weeklyXp: 0,
    weekStart: getMonday(),
    lives: MAX_LIVES,
    lastLifeLossAt: null,
    streak: 0,
    lastStudyDay: null,
    nodeProgress: {},
    mistakes: [],
  };
}

function load(): MedState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = { ...defaultState(), ...JSON.parse(raw) } as MedState;
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
        parsed.lastLifeLossAt =
          parsed.lives >= MAX_LIVES ? null : parsed.lastLifeLossAt + regen * LIFE_REGEN_MS;
      }
    }
    if (!parsed.nodeProgress) parsed.nodeProgress = {};
    return parsed;
  } catch {
    return defaultState();
  }
}

function save(s: MedState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

const listeners = new Set<() => void>();
let current: MedState | null = null;

function getState(): MedState {
  if (!current) current = load();
  return current;
}

function setState(updater: (s: MedState) => MedState) {
  const next = updater(getState());
  current = next;
  save(next);
  listeners.forEach((l) => l());
}

export function useMedStore() {
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

  const addXp = useCallback((amount: number) => {
    setState((s) => ({ ...s, xp: s.xp + amount, weeklyXp: s.weeklyXp + amount }));
  }, []);

  const loseLife = useCallback(() => {
    setState((s) => ({
      ...s,
      lives: Math.max(0, s.lives - 1),
      lastLifeLossAt: Date.now(),
    }));
  }, []);

  const refillLives = useCallback(() => {
    setState((s) => ({ ...s, lives: MAX_LIVES, lastLifeLossAt: null }));
  }, []);

  const recordMistake = useCallback((qid: string) => {
    setState((s) => (s.mistakes.includes(qid) ? s : { ...s, mistakes: [...s.mistakes, qid] }));
  }, []);

  const removeMistake = useCallback((qid: string) => {
    setState((s) => ({ ...s, mistakes: s.mistakes.filter((x) => x !== qid) }));
  }, []);

  /** Marks a level as completed and persists newly-correct question ids. */
  const finishLevel = useCallback(
    (nodeId: string, levelId: string, sessionCorrectIds: string[]) => {
      setState((s) => {
        const prev = s.nodeProgress[nodeId] ?? { completedLevels: [], correctIds: [] };
        const completedLevels = prev.completedLevels.includes(levelId)
          ? prev.completedLevels
          : [...prev.completedLevels, levelId];
        const correctIds = Array.from(new Set([...prev.correctIds, ...sessionCorrectIds]));
        const nodeProgress = {
          ...s.nodeProgress,
          [nodeId]: { completedLevels, correctIds },
        };

        const t = todayStr();
        let streak = s.streak;
        let lastStudyDay = s.lastStudyDay;
        if (lastStudyDay !== t) {
          if (lastStudyDay) {
            const prevDay = new Date(lastStudyDay);
            const today = new Date(t);
            const diff = Math.round((today.getTime() - prevDay.getTime()) / 86400000);
            streak = diff === 1 ? streak + 1 : 1;
          } else {
            streak = 1;
          }
          lastStudyDay = t;
        }
        return { ...s, nodeProgress, streak, lastStudyDay };
      });
    },
    [],
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
    LEVELS_PER_NODE,
  };
}

export function getNodeProgress(state: MedState, nodeId: string): NodeProgress {
  return state.nodeProgress[nodeId] ?? { completedLevels: [], correctIds: [] };
}

export function isLevelCompleted(state: MedState, nodeId: string, levelId: string): boolean {
  return getNodeProgress(state, nodeId).completedLevels.includes(levelId);
}

/** A level is unlocked when its index is 0 or the previous level is done. */
export function isLevelUnlocked(
  state: MedState,
  nodeId: string,
  levelIds: string[],
  levelId: string,
): boolean {
  const idx = levelIds.indexOf(levelId);
  if (idx <= 0) return true;
  return isLevelCompleted(state, nodeId, levelIds[idx - 1]);
}

export function isNodeCompleted(state: MedState, nodeId: string): boolean {
  const node = getNodeById(nodeId);
  const total = node?.levels.length ?? LEVELS_PER_NODE;
  return getNodeProgress(state, nodeId).completedLevels.length >= total;
}

export function nodeProgressRatio(state: MedState, nodeId: string): number {
  const node = getNodeById(nodeId);
  const total = node?.levels.length ?? LEVELS_PER_NODE;
  const done = getNodeProgress(state, nodeId).completedLevels.length;
  return Math.min(1, done / total);
}


export function isNodeUnlocked(state: MedState, nodeIds: string[], nodeId: string): boolean {
  const idx = nodeIds.indexOf(nodeId);
  if (idx <= 0) return true;
  return isNodeCompleted(state, nodeIds[idx - 1]);
}
