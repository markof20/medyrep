import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SUBJECTS, getNodesForSubject, LEVELS_PER_NODE, isReviewNode } from "@/data/medContent";
import {
  getNodeProgress,
  isNodeCompleted,
  isNodeUnlocked,
  useMedStore,
} from "@/lib/medStore";
import { MedHeader } from "@/components/MedHeader";
import { BottomNav } from "@/components/BottomNav";
import { NoLivesDialog } from "@/components/NoLivesDialog";
import { ArrowLeft, Check, Lock, Star, Brain } from "lucide-react";
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
            {nodes.filter((n) => !isReviewNode(n)).length} nodi · {LEVELS_PER_NODE} livelli ciascuno · ripasso ogni 4
          </div>
        </div>

        <ol className="relative pt-2 pb-6">
          {nodes.map((node, idx) => {
            // Path is grouped in blocks of 5 (4 standard + 1 review).
            // Standard nodes alternate sides between groups; the review
            // node at position 4 always sits at the center (dx = 0).
            const group = Math.floor(idx / 5);
            const pos = idx % 5;
            const side = group % 2 === 0 ? 1 : -1;
            const baseOffsets = [60, 100, 100, 60, 0];
            const dx = baseOffsets[pos] * (pos === 4 ? 0 : side);
            const isLast = idx === nodes.length - 1;
            const review = isReviewNode(node);
            const totalLevels = node.levels.length;
            const unlocked = isNodeUnlocked(state, nodeIds, node.id);
            const np = getNodeProgress(state, node.id);
            const completed = isNodeCompleted(state, node.id);
            const doneLevels = np.completedLevels.length;
            const pct = Math.round((doneLevels / totalLevels) * 100);
            const reviewGradient = "from-warning to-warning/70";
            const nodeGradient = review ? reviewGradient : subject.gradient;
            // Standard node index (1-based) for label, skipping review nodes.
            const standardIdx = nodes
              .slice(0, idx + 1)
              .filter((n) => !isReviewNode(n)).length;
            // Review index (1-based) for label.
            const reviewIdx = nodes
              .slice(0, idx + 1)
              .filter((n) => isReviewNode(n)).length;


            const Body = (
              <div
                className={cn(
                  "relative flex flex-col items-center gap-1 transition",
                  unlocked && "hover:-translate-y-0.5 active:translate-y-0.5",
                  !unlocked && "opacity-60",
                )}
              >
                {/* Stars above (only for standard nodes) */}
                {!review && (
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {Array.from({ length: totalLevels }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-2.5",
                          i < doneLevels
                            ? "text-warning fill-warning"
                            : "text-muted-foreground/30",
                        )}
                        strokeWidth={2.5}
                      />
                    ))}
                  </div>
                )}
                {review && (
                  <div className="mb-0.5 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-warning/20 text-warning-foreground">
                    Ripasso
                  </div>
                )}

                {/* Circular node */}
                <div className="relative">
                  {/* Progress ring */}
                  <svg
                    className="absolute inset-0 -rotate-90"
                    viewBox="0 0 80 80"
                    width="80"
                    height="80"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      className="stroke-secondary"
                      strokeWidth="4"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      className={cn(
                        completed
                          ? "stroke-success"
                          : review
                            ? "stroke-warning"
                            : "stroke-primary",
                      )}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={2 * Math.PI * 36 * (1 - pct / 100)}
                      style={{ transition: "stroke-dashoffset 500ms" }}
                    />
                  </svg>
                  <div
                    className={cn(
                      "grid place-items-center size-20 rounded-full text-3xl bg-gradient-to-br text-primary-foreground node-shadow border-4 border-background",
                      completed ? "from-success to-success/70" : nodeGradient,
                      review && !completed && "ring-4 ring-warning/30",
                    )}
                  >
                    {unlocked ? (
                      completed ? (
                        <Check className="size-9" strokeWidth={3} />
                      ) : review ? (
                        <Brain className="size-9" strokeWidth={2.5} />
                      ) : (
                        <span>{node.emoji}</span>
                      )
                    ) : (
                      <Lock className="size-7" />
                    )}
                  </div>
                </div>

                {/* Label */}
                <div className="text-center mt-1 px-2 max-w-[180px]">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    {review ? `Ripasso ${reviewIdx}` : `Nodo ${standardIdx}`}
                  </div>
                  <div className="font-extrabold text-sm text-foreground leading-tight truncate">
                    {node.title}
                  </div>
                </div>
              </div>
            );


            return (
              <li
                key={node.id}
                className="relative flex flex-col items-center"
                style={{ transform: `translateX(${dx}px)`, marginTop: idx === 0 ? 0 : 8 }}
              >
                {!unlocked ? (
                  <button
                    onClick={() => {
                      if (state.lives === 0) setShowNoLives(true);
                    }}
                  >
                    {Body}
                  </button>
                ) : (
                  <Link to="/node/$nodeId" params={{ nodeId: node.id }}>
                    {Body}
                  </Link>
                )}
                {!isLast && (
                  <div
                    aria-hidden
                    className="my-2 h-6 w-1.5 rounded-full bg-muted-foreground/20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, currentColor 0 4px, transparent 4px 8px)",
                      color: "hsl(var(--muted-foreground) / 0.35)",
                      background: "none",
                    }}
                  />
                )}
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
