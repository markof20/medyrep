import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SUBJECTS, getNodesForSubject, LEVELS_PER_NODE } from "@/data/medContent";
import {
  getNodeProgress,
  isNodeCompleted,
  isNodeUnlocked,
  useMedStore,
} from "@/lib/medStore";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { NoLivesDialog } from "@/components/NoLivesDialog";
import { ArrowLeft, Check, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/subject/$subjectId")({
  component: SubjectPage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      Materia non trovata.{" "}
      <Link to="/" className="text-primary underline">
        Torna alle materie
      </Link>
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
        <Link to="/" className="text-primary underline">
          Torna alle materie
        </Link>
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

        <div
          className={cn(
            "rounded-3xl bg-gradient-to-br text-primary-foreground p-5 node-shadow mb-6",
            subject.gradient,
          )}
        >
          <div className="text-3xl mb-1">{subject.emoji}</div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Materia</div>
          <h1 className="text-2xl font-extrabold mt-0.5">{subject.name}</h1>
          <p className="text-sm opacity-90 mt-1">{subject.description}</p>
          <div className="mt-3 text-[11px] font-extrabold uppercase tracking-wider opacity-90">
            {nodes.length} nodi · {LEVELS_PER_NODE} livelli ciascuno
          </div>
        </div>

        <ol className="space-y-3">
          {nodes.map((node, idx) => {
            const unlocked = isNodeUnlocked(state, nodeIds, node.id);
            const np = getNodeProgress(state, node.id);
            const completed = isNodeCompleted(state, node.id);
            const doneLevels = np.completedLevels.length;
            const pct = Math.round((doneLevels / LEVELS_PER_NODE) * 100);

            const Body = (
              <div
                className={cn(
                  "relative w-full rounded-3xl border-2 bg-card p-3 node-shadow flex items-center gap-3 transition",
                  unlocked && "hover:-translate-y-0.5 active:translate-y-0.5",
                  !unlocked && "opacity-70",
                )}
              >
                <div
                  className={cn(
                    "grid place-items-center size-14 rounded-2xl text-2xl shrink-0 bg-gradient-to-br text-primary-foreground",
                    completed ? "from-success to-success/70" : subject.gradient,
                  )}
                >
                  {unlocked ? (
                    completed ? (
                      <Check className="size-7" strokeWidth={3} />
                    ) : (
                      <span>{node.emoji}</span>
                    )
                  ) : (
                    <Lock className="size-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Nodo {idx + 1}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: LEVELS_PER_NODE }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-3",
                            i < doneLevels
                              ? "text-warning fill-warning"
                              : "text-muted-foreground/30",
                          )}
                          strokeWidth={2.5}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="font-extrabold text-foreground leading-tight truncate">
                    {node.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{node.subtitle}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                          completed ? "from-success to-success/70" : subject.gradient,
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-extrabold text-muted-foreground tabular-nums w-12 text-right">
                      {doneLevels}/{LEVELS_PER_NODE}
                    </div>
                  </div>
                </div>
              </div>
            );

            if (!unlocked) {
              return (
                <li key={node.id}>
                  <button
                    onClick={() => {
                      if (state.lives === 0) setShowNoLives(true);
                    }}
                    className="w-full text-left"
                  >
                    {Body}
                  </button>
                </li>
              );
            }
            return (
              <li key={node.id}>
                <Link
                  to="/subject/$subjectId/node/$nodeId"
                  params={{ subjectId: subject.id, nodeId: node.id }}
                  className="block"
                >
                  {Body}
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Hai padroneggiato {nodes.filter((n) => isNodeCompleted(state, n.id)).length}/{nodes.length} nodi
        </div>
      </main>

      <BottomNav />
      <NoLivesDialog open={showNoLives} onOpenChange={setShowNoLives} />
    </div>
  );
}
