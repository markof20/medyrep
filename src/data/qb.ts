import type { Question } from "./medContent";

export const m = (
  id: string,
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): Question => ({ id, type: "multiple", prompt, options, correctIndex, explanation });

export const c = (
  id: string,
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): Question => ({ id, type: "cloze", prompt, options, correctIndex, explanation });

export const cli = (
  id: string,
  scenario: string,
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): Question => ({ id, type: "clinical", scenario, prompt, options, correctIndex, explanation });

export const tf = (
  id: string,
  prompt: string,
  answer: boolean,
  explanation: string,
): Question => ({ id, type: "truefalse", prompt, answer, explanation });
