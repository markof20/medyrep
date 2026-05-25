import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SUBJECTS, getNodesForSubject, REQUIRED_RUNS } from "@/data/medContent";
import { getNodeProgress, isNodeCompleted, isNodeUnlocked, useMedStore } from "@/lib/medStore";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { NoLivesDialog } from "@/components/NoLivesDialog";
import { ArrowLeft, Check, Crown, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/subject/$subjectId")({
  component: SubjectPage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      Materia non trovata.{" "}
      <Link to="/" className="text-primary underline">Torna alle materie</Link>
    </div>
  ),
});

function SubjectPage() {
  const { subjectId } = Route.useParams();
  const navigate = useNavigate();
  const subject = useMemo(() => SUBJECTS.find((s) => s.id === subjectId), [subjectId]);
  const nodes = useMemo(() => getNodesForSubject(subjectId), [subjectId]);
  const { state } = useMedStore();
  const nodeIds = useMemo(() => nodes.map((n) => n.id), [nodes]);
  const [showNoLives, setShowNoLives] = useState(false);

  if (!subject) {
    return (
      <div className="p-8 text-center">
        Materia non trovata.{" "}
        <Link to="/" className="text-primary underline">Torna alle materie</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-background">
      <MedHeader />
      <main className="mx-auto max-w-md px-4 pt-4">
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-1 text-sm font-extrabold text-muted-foreground mb-3 hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Materie
        </button>

        <div className={cn("rounded-3xl bg-gradient-to-br text-primary-foreground p-5 node-shadow mb-6", subject.gradient)}>
          <div className="text-3xl mb-1">{subject.emoji}</div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Materia</div>
          <h1 className="text-2xl font-extrabold mt-0.5">{subject.name}</h1>
          <p className="text-sm opacity-90 mt-1">{subject.description}</p>
        </div>

        {nodes.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed p-8 text-center">
            <div className="text-5xl mb-2">🚧</div>
            <div className="font-extrabold text-lg">In arrivo</div>
            <p className="text-sm text-muted-foreground mt-1">
              I contenuti di questa materia saranno disponibili a breve.
            </p>
          </div>
        ) : (
          <ol className="relative space-y-12">
            {nodes.map((node, idx) => {
              const unlocked = isNodeUnlocked(state, nodeIds, node.id);
              const np = getNodeProgress(state, node.id);
              const completed = isNodeCompleted(state, node.id);
              const align = idx % 2 === 0 ? "items-start" : "items-end";
              return (
                <li key={node.id} className={`flex flex-col ${align} relative animate-pop-in`}>
                  {idx > 0 && (
                    <div
                      aria-hidden
                      className="absolute -top-10 left-1/2 -translate-x-1/2 h-10 w-1.5 rounded-full bg-border"
                    />
                  )}
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: REQUIRED_RUNS }).map((_, i) => (
                      <Crown
                        key={i}
                        className={cn(
                          "size-5 transition",
                          i < np.runs ? "text-warning fill-warning animate-pop-in" : "text-muted-foreground/30",
                        )}
                        strokeWidth={2.5}
                      />
                    ))}
                  </div>
                  <NodeButton
                    unlocked={unlocked}
                    completed={completed}
                    runs={np.runs}
                    requiredRuns={REQUIRED_RUNS}
                    emoji={node.emoji}
                    nodeId={node.id}
                    onLockedClick={() => {
                      if (state.lives === 0) setShowNoLives(true);
                    }}
                  />
                  <div className={`mt-3 max-w-[14rem] ${idx % 2 === 0 ? "text-left" : "text-right"}`}>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Nodo {idx + 1} · {np.runs}/{REQUIRED_RUNS} sessioni
                    </div>
                    <div className="font-extrabold text-foreground leading-tight">{node.title}</div>
                    <div className="text-xs text-muted-foreground">{node.subtitle}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {nodes.length > 0 && (
          <div className="mt-10 text-center text-xs text-muted-foreground">
            Hai padroneggiato {nodes.filter((n) => isNodeCompleted(state, n.id)).length}/{nodes.length} nodi
          </div>
        )}
      </main>

      <BottomNav />
      <NoLivesDialog open={showNoLives} onOpenChange={setShowNoLives} />
    </div>
  );
}

function NodeButton({
  unlocked,
  completed,
  runs,
  requiredRuns,
  emoji,
  nodeId,
  onLockedClick,
}: {
  unlocked: boolean;
  completed: boolean;
  runs: number;
  requiredRuns: number;
  emoji: string;
  nodeId: string;
  onLockedClick: () => void;
}) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, runs / requiredRuns);
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
      className="relative grid place-items-center animate-unlock"
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
          className="transition-all duration-500"
        />
      </svg>
      <span
        className={
          "grid place-items-center size-20 rounded-full text-4xl node-shadow transition-transform " +
          (completed ? "bg-success text-success-foreground" : "bg-card hover:scale-105 active:scale-95")
        }
      >
        {completed ? <Check className="size-10" strokeWidth={3} /> : <span>{emoji}</span>}
      </span>
      {!completed && runs === 0 && (
        <span className="absolute -bottom-2 right-0 grid place-items-center size-8 rounded-full bg-primary text-primary-foreground border-2 border-background animate-pulse">
          <Play className="size-4 fill-current" />
        </span>
      )}
    </Link>
  );
}
