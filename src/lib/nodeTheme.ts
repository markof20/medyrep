/**
 * Le mockup danno a ogni materia una tessera pastello di colore diverso.
 * Il curriculum non porta un colore per nodo, quindi lo assegno in modo
 * deterministico dalla posizione: stessa materia → sempre stesso colore.
 */
export type NodeTheme = {
  /** Sfondo della tessera con l'icona. */
  tile: string;
  /** Barra di avanzamento / accenti. */
  bar: string;
  /** Testo colorato coordinato. */
  text: string;
};

const PALETTE: NodeTheme[] = [
  { tile: "bg-rose-100", bar: "bg-rose-400", text: "text-rose-500" },
  { tile: "bg-sky-100", bar: "bg-sky-500", text: "text-sky-600" },
  { tile: "bg-violet-100", bar: "bg-violet-400", text: "text-violet-500" },
  { tile: "bg-amber-100", bar: "bg-amber-400", text: "text-amber-500" },
  { tile: "bg-emerald-100", bar: "bg-emerald-400", text: "text-emerald-500" },
  { tile: "bg-cyan-100", bar: "bg-cyan-500", text: "text-cyan-600" },
  { tile: "bg-fuchsia-100", bar: "bg-fuchsia-400", text: "text-fuchsia-500" },
  { tile: "bg-lime-100", bar: "bg-lime-500", text: "text-lime-600" },
];

export function nodeTheme(index: number): NodeTheme {
  return PALETTE[index % PALETTE.length];
}
