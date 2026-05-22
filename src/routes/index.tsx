import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NODES, REQUIRED_RUNS, SUBJECT } from "@/data/medContent";
import { getNodeProgress, isNodeCompleted, isNodeUnlocked, useMedStore } from "@/lib/medStore";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { NoLivesDialog } from "@/components/NoLivesDialog";
import { Check, Crown, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedRep — Anatomia Umana, micro-apprendimento gamificato" },
      {
        name: "description",
        content:
          "Studia anatomia un nodo alla volta: quiz, casi clinici, flashcard e classifica. Mobile-first, funziona offline.",
      },
      { property: "og:title", content: "MedRep — Studia medicina, livello per livello" },
      { property: "og:description", content: "Percorso a livelli su Anatomia Umana, con vite, XP e streak." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { state } = useMedStore();
  const nodeIds = useMemo(() => NODES.map((n) => n.id), []);
  const [showNoLives, setShowNoLives] = useState(false);

  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />

      <main className="mx-auto max-w-md px-4 pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-5 node-shadow mb-6">
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Materia</div>
          <h1 className="text-2xl font-extrabold mt-0.5">{SUBJECT.name}</h1>
          <p className="text-sm opacity-90 mt-1">{SUBJECT.faculty}</p>
        </div>

        <ol className="relative space-y-10">
          {NODES.map((node, idx) => {
            const unlocked = isNodeUnlocked(state, nodeIds, node.id);
            const progress = state.progress[node.id] ?? 0;
            const completed = state.completed[node.id];
            const total = node.questions.length;
            const align = idx % 2 === 0 ? "items-start" : "items-end";
            return (
              <li key={node.id} className={`flex flex-col ${align} relative`}>
                {idx > 0 && (
                  <div
                    aria-hidden
                    className="absolute -top-9 left-1/2 -translate-x-1/2 h-9 w-1.5 rounded-full bg-border"
                  />
                )}
                <NodeButton
                  unlocked={unlocked}
                  completed={!!completed}
                  progress={progress}
                  total={total}
                  emoji={node.emoji}
                  nodeId={node.id}
                  onLockedClick={() => {
                    if (state.lives === 0) setShowNoLives(true);
                  }}
                />
                <div className={`mt-3 max-w-[14rem] ${idx % 2 === 0 ? "text-left" : "text-right"}`}>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    Nodo {idx + 1}
                  </div>
                  <div className="font-extrabold text-foreground leading-tight">{node.title}</div>
                  <div className="text-xs text-muted-foreground">{node.subtitle}</div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 text-center text-xs text-muted-foreground">
          Hai studiato {Object.keys(state.completed).length}/{NODES.length} nodi
        </div>
      </main>

      <BottomNav />
      <NoLivesDialog open={showNoLives} onOpenChange={setShowNoLives} />
    </div>
  );
}

function NodeButton({
  unlocked,
  completed,
  progress,
  total,
  emoji,
  nodeId,
  onLockedClick,
}: {
  unlocked: boolean;
  completed: boolean;
  progress: number;
  total: number;
  emoji: string;
  nodeId: string;
  onLockedClick: () => void;
}) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, progress / total);
  const dash = c * pct;

  const ring = completed ? "var(--color-success)" : "var(--color-primary)";

  if (!unlocked) {
    return (
      <button
        onClick={onLockedClick}
        className="relative grid place-items-center size-24 rounded-full bg-locked node-shadow"
        aria-label="Nodo bloccato"
      >
        <Lock className="size-9 text-white/90" strokeWidth={2.5} />
      </button>
    );
  }

  return (
    <Link
      to="/lesson/$nodeId"
      params={{ nodeId }}
      className="relative grid place-items-center"
      aria-label="Inizia lezione"
    >
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-border)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          fill="none"
        />
      </svg>
      <span
        className={
          "grid place-items-center size-20 rounded-full text-4xl node-shadow " +
          (completed ? "bg-success text-success-foreground" : "bg-card")
        }
      >
        {completed ? <Check className="size-10" strokeWidth={3} /> : <span>{emoji}</span>}
      </span>
      {!completed && progress === 0 && (
        <span className="absolute -bottom-2 right-0 grid place-items-center size-8 rounded-full bg-primary text-primary-foreground border-2 border-background">
          <Play className="size-4 fill-current" />
        </span>
      )}
      {completed && (
        <span className="absolute -top-2 -right-2 grid place-items-center size-8 rounded-full bg-warning text-warning-foreground border-2 border-background">
          <Star className="size-4 fill-current" />
        </span>
      )}
    </Link>
  );
}
