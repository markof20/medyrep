import { useEffect, useState, useCallback } from "react";

const KEY = "medrep:state:v1";
const MAX_LIVES = 5;
const LIFE_REGEN_MS = 30 * 60 * 1000; // 30 min per life

export type MedState = {
  xp: number;
  weeklyXp: number;
  weekStart: number; // ms timestamp of monday
  lives: number;
  lastLifeLossAt: number | null;
  streak: number;
  lastStudyDay: string | null; // YYYY-MM-DD
  progress: Record<string, number>; // nodeId -> 0..5 (questions answered correctly)
  completed: Record<string, boolean>; // nodeId -> true if 5/5
  mistakes: string[]; // question ids
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
    progress: {},
    completed: {},
    mistakes: [],
  };
}

function load(): MedState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = { ...defaultState(), ...JSON.parse(raw) } as MedState;
    // weekly reset
    const monday = getMonday();
    if (parsed.weekStart !== monday) {
      parsed.weekStart = monday;
      parsed.weeklyXp = 0;
    }
    // life regen
    if (parsed.lives < MAX_LIVES && parsed.lastLifeLossAt) {
      const elapsed = Date.now() - parsed.lastLifeLossAt;
      const regen = Math.floor(elapsed / LIFE_REGEN_MS);
      if (regen > 0) {
        parsed.lives = Math.min(MAX_LIVES, parsed.lives + regen);
        parsed.lastLifeLossAt = parsed.lives >= MAX_LIVES ? null : parsed.lastLifeLossAt + regen * LIFE_REGEN_MS;
      }
    }
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

// Simple pub/sub so multiple components stay in sync
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
    // re-load on mount to pick up regen
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

  const setNodeProgress = useCallback((nodeId: string, correctCount: number, total: number) => {
    setState((s) => {
      const completed = { ...s.completed };
      const progress = { ...s.progress, [nodeId]: correctCount };
      if (correctCount >= total) completed[nodeId] = true;
      // streak
      const t = todayStr();
      let streak = s.streak;
      let lastStudyDay = s.lastStudyDay;
      if (lastStudyDay !== t) {
        if (lastStudyDay) {
          const prev = new Date(lastStudyDay);
          const today = new Date(t);
          const diff = Math.round((today.getTime() - prev.getTime()) / 86400000);
          streak = diff === 1 ? streak + 1 : 1;
        } else {
          streak = 1;
        }
        lastStudyDay = t;
      }
      return { ...s, progress, completed, streak, lastStudyDay };
    });
  }, []);

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
    setNodeProgress,
    reset,
    MAX_LIVES,
  };
}

export function isNodeUnlocked(state: MedState, nodeIds: string[], nodeId: string): boolean {
  const idx = nodeIds.indexOf(nodeId);
  if (idx <= 0) return true;
  const prev = nodeIds[idx - 1];
  return !!state.completed[prev];
}
